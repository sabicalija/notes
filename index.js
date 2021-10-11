// Model
const notes = [
  // { id: "676c9ba771", title: "Title 1", text: "ToDo 1" },
  // { id: "dc19d1538f", title: "Title 2", text: "ToDo 2" },
  // { id: "fd8c75b4fb", title: "Title 3", text: "ToDo 2" },
  // ...
];

// View
// see HTML
function buildLIItem(note) {
  const item = document.createElement("li");
  item.textContent = note;
  item.addEventListener("click", handleClickLIItem);
  return item;
}

// Controller
document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("add");
  button.addEventListener("click", handleClick);
});

function handleClick(/* event */) {
  add();
}

function handleClickLIItem(event) {
  const list = document.getElementById("list");
  list.removeChild(event.target);
}

function add() {
  const input = document.getElementById("text");
  const note = input.value;
  if (note) {
    const list = document.getElementById("list");
    const item = buildLIItem(note);
    list.appendChild(item);
    notes.push(note);
    input.value = "";
    input.focus();
  }
}
