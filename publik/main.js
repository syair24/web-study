const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", () => {
  sidebar.classList.add("open");
});

closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("open");
});

document.querySelectorAll(".card-options i").forEach((icon) => {
  icon.addEventListener("click", function (e) {
    const tooltip = this.nextElementSibling;
    tooltip.style.display = tooltip.style.display === "flex" ? "none" : "flex";

    // Tutup tooltip lain jika ada
    document.querySelectorAll(".card-tooltip").forEach((other) => {
      if (other !== tooltip) other.style.display = "none";
    });

    // Klik luar -> tutup
    document.addEventListener("click", function outsideClick(ev) {
      if (!tooltip.contains(ev.target) && ev.target !== icon) {
        tooltip.style.display = "none";
        document.removeEventListener("click", outsideClick);
      }
    });
  });
});
