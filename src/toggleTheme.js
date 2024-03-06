const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  toggle = body.querySelector(".toggle"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");

const savedMode = localStorage.getItem("mode");
if (savedMode) {
  body.classList.add(savedMode);
  if (savedMode === "dark") {
    modeText.innerText = "Light mode";
  } else {
    modeText.innerText = "Dark mode";
  }
}

sidebar.classList.remove("close");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");
  const currentMode = body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("mode", currentMode);
  if (body.classList.contains("dark")) {
    modeText.innerText = "Light mode";
  } else {
    modeText.innerText = "Dark mode";
  }
});

function myFunction(x) {
  x.classList.toggle("change");
}
