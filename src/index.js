if (
  localStorage.getItem("tasks") === null ||
  localStorage.getItem("tasks") === undefined
) {
  localStorage.setItem("tasks", "[]");
}

console.log(localStorage.getItem("tasks"));
