const settingBtn = document.getElementById("setting-btn");
const settings = document.getElementById("settings");

let value = false;

settingBtn.addEventListener("click", () => {
  if (value === false) {
    settings.style.display = "block";
    settingBtn.innerHTML = "Settings ❌";
    value = true;
  } else {
    settings.style.display = "none";
    settingBtn.innerHTML = "Settings ▶";
    value = false;
  }
});
