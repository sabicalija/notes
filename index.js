const button = document.getElementById("add");
button.addEventListener("click", handleClick);

function handleClick(/* event */) {
  const input = document.getElementById("text");
  const note = input.value;
  if (note) {
    const list = document.getElementById("list");
    const item = document.createElement("li");
    item.textContent = note;
    list.appendChild(item);
    input.value = "";
    input.focus();
  }
}
