$(document).ready(function () {
  const menuBtn = document.getElementById("menuBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");

  menuBtn.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".header-opt")) {
      dropdownMenu.classList.remove("show");
    }
  });
});
