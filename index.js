// Model
let notes = [
  // { id: "676c9ba771", title: "Title 1", text: "ToDo 1" },
  // { id: "dc19d1538f", title: "Title 2", text: "ToDo 2" },
  // { id: "fd8c75b4fb", title: "Title 3", text: "ToDo 2" },
  // ...
];

// View
// see HTML
function buildLIItem(note, classNames = []) {
  const item = document.createElement("li");
  item.id = note.id;
  item.classList.add("note", ...classNames);

  const article = document.createElement("article");
  const title = document.createElement("header");
  title.textContent = note.title;
  title.classList.add("note__title");
  const text = document.createElement("p");
  text.textContent = note.text;
  text.classList.add("note__text");

  const controls = document.createElement("div");
  controls.classList.add("note__controls");
  const button = document.createElement("button");
  button.classList.add("note__controls__delete");
  button.addEventListener("click", handleClickDelete(note.id));
  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-trash", "fa-2x");
  button.appendChild(icon);
  controls.appendChild(button);

  article.appendChild(title);
  article.appendChild(text);
  article.appendChild(controls);
  item.appendChild(article);
  return item;
}

// Controller
document.addEventListener("DOMContentLoaded", function () {
  init();
});

function handleClick(/* event */) {
  add();
  save();
}

function handleClickDelete(id) {
  return function () {
    const item = document.getElementById(id);
    const list = document.getElementById("list");
    list.removeChild(item);
    const pos = notes.findIndex((note) => note.id === id);
    notes.splice(pos, 1);
    save();
  };
}

function handleRegistration(registration) {
  registration.addEventListener("updatefound", function () {
    if (registration.installing) {
      const worker = registration.installing;
      worker.addEventListener("statechange", function () {
        if (worker.state === "installed") {
          handleUpdate(worker);
        }
      });
    } else if (registration.waiting) {
      const worker = registration.waiting;
      if (worker.state === "installed") {
        handleUpdate(worker);
      }
    }
  });
}

function handleUpdate(worker) {
  if (navigator.serviceWorker.controller) {
    const modal = document.getElementById("service-worker");
    const button = document.getElementById("service-worker-control");
    button.addEventListener("click", function () {
      worker.postMessage({ action: "skipWaiting" });
      modal.style.display = "none";
    });
    modal.style.display = "block";
  }
}

function add() {
  const title = document.getElementById("title");
  const text = document.getElementById("text");
  if (title.value || text.value) {
    const list = document.getElementById("list");
    const note = createNote(title.value, text.value);
    const item = buildLIItem(note, ["slide-in"]);
    list.appendChild(item);
    notes.push(note);
    title.value = "";
    text.value = "";
  }
}

function createNote(title, text) {
  const id = generateId(title, text);
  return { id, title, text };
}

function generateId(title, text, length = 10) {
  return CryptoJS.SHA256(title + text + new Date())
    .toString()
    .substring(0, length);
}

function init() {
  registerEventHandlers();
  load();
  draw();
  registerServiceWorker();
}

function registerEventHandlers() {
  const button = document.getElementById("add");
  button.addEventListener("click", handleClick);
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    let refreshing;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
    navigator.serviceWorker
      .register("/notes/sw.js", { scope: "/notes/ " })
      .then((registration) => handleRegistration(registration))
      .catch((error) => console.log("Service Worker registration failed!", error));
  }
}

function load() {
  notes = JSON.parse(localStorage.getItem("notes")) || [];
}

function save() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function draw() {
  const list = document.getElementById("list");
  while (list.firstChild) list.removeChild(list.firstChild);
  notes.forEach((note) => list.appendChild(buildLIItem(note)));
}
