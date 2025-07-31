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

// ======== Delete Confirm Overlay ========
const deleteConfirm = document.getElementById("deleteConfirm");
const confirmBtn = document.getElementById("confirmDeleteBtn");
const cancelBtn = document.getElementById("cancelDeleteBtn");

let cardToDelete = null;
let deleteId = null;

if (confirmBtn && cancelBtn && deleteConfirm) {
  confirmBtn.addEventListener("click", () => {
    if (cardToDelete && deleteId !== null) {
      fetch(`/api/delete-kanji/${deleteId}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            cardToDelete.remove();
          } else {
            alert("❌ Gagal menghapus data");
          }
          deleteConfirm.style.display = "none";
        })
        .catch(() => {
          alert("❌ Terjadi kesalahan");
          deleteConfirm.style.display = "none";
        });
    }
  });

  cancelBtn.addEventListener("click", () => {
    cardToDelete = null;
    deleteId = null;
    deleteConfirm.style.display = "none";
  });
}

// ======== Ambil data dan render kartu ========
fetch("/api/kanji")
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("main-content");
    if (!container) return;

    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card-horizontal";
      card.id = `kanji-${item.kanji}`;

      card.innerHTML = `
        <div class="card-options">
          <i class="ph ph-dots-three-outline-vertical"></i>
          <div class="card-tooltip">
            <button class="edit-btn"><i class="ph ph-pencil-simple"></i> Edit</button>
            <button class="delete-btn"><i class="ph ph-trash"></i> Delete</button>
          </div>
        </div>
        <div class="card-content">
          <h2>${item.kanji}</h2>
          <p class="main-text">${item.bacaan}</p>
          <p class="sub-text">${item.arti}</p>
        </div>
      `;

      const dotsIcon = card.querySelector(".ph-dots-three-outline-vertical");
      const tooltip = card.querySelector(".card-tooltip");

      dotsIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        tooltip.style.display =
          tooltip.style.display === "flex" ? "none" : "flex";

        document.querySelectorAll(".card-tooltip").forEach((other) => {
          if (other !== tooltip) other.style.display = "none";
        });

        document.addEventListener("click", function outsideClick(ev) {
          if (!tooltip.contains(ev.target) && ev.target !== dotsIcon) {
            tooltip.style.display = "none";
            document.removeEventListener("click", outsideClick);
          }
        });
      });

      const editBtn = card.querySelector(".edit-btn");
      editBtn.addEventListener("click", () => {
        const url = `edit.html?kanji=${encodeURIComponent(
          item.kanji
        )}&reading=${encodeURIComponent(
          item.bacaan
        )}&meaning=${encodeURIComponent(item.arti)}`;
        window.location.href = url;
      });

      const deleteBtn = card.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => {
        cardToDelete = card;
        deleteId = item.id;
        deleteConfirm.style.display = "flex";
      });

      container.appendChild(card);
    });
  })
  .catch((err) => {
    console.error("Gagal ambil data kanji:", err);
  });

// ======== Form Tambah (tambah.html) ========
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("kanjiForm");
  const customAlert = document.getElementById("customAlert");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // ✅ Cegah form kirim default (GET)

      const formData = new FormData(form);
      const data = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
        data.append(key, value);
      }

      try {
        const response = await fetch("/submit-kanji", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: data.toString(),
        });

        const text = await response.text();

        if (response.ok) {
          if (customAlert) {
            customAlert.classList.remove("hidden");
          }
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1500);
        } else {
          alert("❌ Gagal menyimpan: " + text);
        }
      } catch (err) {
        console.error("❌ Gagal kirim:", err);
        alert("❌ Terjadi kesalahan saat kirim data.");
      }
    });
  }
});

// ========== LOGIKA EDIT ==========
