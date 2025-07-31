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
function bindTooltipListeners() {
  document.querySelectorAll(".card-options i").forEach((icon) => {
    icon.addEventListener("click", function (e) {
      const tooltip = this.nextElementSibling;
      tooltip.style.display =
        tooltip.style.display === "flex" ? "none" : "flex";

      document.querySelectorAll(".card-tooltip").forEach((other) => {
        if (other !== tooltip) other.style.display = "none";
      });

      document.addEventListener("click", function outsideClick(ev) {
        if (!tooltip.contains(ev.target) && ev.target !== icon) {
          tooltip.style.display = "none";
          document.removeEventListener("click", outsideClick);
        }
      });
    });
  });
}

// Jalankan tooltip listener awal (untuk card statis kalau ada)
bindTooltipListeners();

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

// ===============================
// Fetch dan render data dari API
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.querySelector(".main-content");

  if (!mainContent) return;

  fetch("/api/kanji")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        const card = document.createElement("div");
        card.className = "card-horizontal";
        card.innerHTML = `
          <div class="card-options">
            <i class="ph ph-dots-three-outline-vertical"></i>
            <div class="card-tooltip">
              <button><i class="ph ph-pencil-simple"></i> Edit</button>
              <button><i class="ph ph-trash"></i> Delete</button>
            </div>
          </div>
          <div class="card-content">
            <h2>${item.kanji}</h2>
            <p class="main-text">${item.bacaan}</p>
            <p class="sub-text">${item.arti}</p>
          </div>
        `;
        mainContent.appendChild(card);
      });

      // Aktifkan tooltip untuk card yang baru ditambahkan
      bindTooltipListeners();
    })
    .catch((err) => {
      console.error("Gagal mengambil data kartu:", err);
    });
});
