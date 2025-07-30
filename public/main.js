// ======== Sidebar Logic ========
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");

if (menuBtn && closeBtn && sidebar) {
  menuBtn.addEventListener("click", () => {
    sidebar.classList.add("open");
  });

  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });
}

// ======== Tooltip Logic ========
document.querySelectorAll(".card-options i").forEach((icon) => {
  icon.addEventListener("click", function (e) {
    const tooltip = this.nextElementSibling;
    tooltip.style.display = tooltip.style.display === "flex" ? "none" : "flex";

    // Tutup tooltip lain
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

/* ===================================== */
/*  Form Submit Logic style tambah.html  */
/* ===================================== */
const form = document.getElementById("kanjiForm");
const alertBox = document.getElementById("customAlert");

if (form && alertBox) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = new URLSearchParams(formData);

    fetch("/submit-kanji", {
      method: "POST",
      body: data,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal simpan");

        alertBox.classList.remove("hidden");
        alertBox.querySelector("span").textContent =
          "✅ Data berhasil disimpan!";

        form.reset();

        setTimeout(() => {
          alertBox.classList.add("hidden");
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        alertBox.classList.remove("hidden");
        alertBox.querySelector("span").textContent = "❌ Gagal menyimpan data";
        setTimeout(() => {
          alertBox.classList.add("hidden");
        }, 3000);
      });
  });
}
