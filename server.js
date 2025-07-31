const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ==== KONEKSI DATABASE ====
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "belajar_kanji",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Koneksi database gagal:", err);
    return;
  }
  console.log("✅ Terhubung ke database MySQL");
});

// ==== AMBIL SEMUA DATA ====
app.get("/api/kanji", (req, res) => {
  const sql = "SELECT * FROM kanji_data";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Gagal mengambil data:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ==== HAPUS DATA ====
app.delete("/api/delete-kanji/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM kanji_data WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Gagal menghapus data:", err);
      return res.status(500).send("Gagal menghapus data");
    }
    res.json({ success: true });
  });
});

// ==== SIMPAN DATA BARU ====
app.post("/submit-kanji", (req, res) => {
  const { kanji, reading, meaning } = req.body;

  if (!kanji || !reading || !meaning) {
    return res
      .status(400)
      .json({ success: false, message: "Data tidak lengkap" });
  }

  const sql = "INSERT INTO kanji_data (kanji, bacaan, arti) VALUES (?, ?, ?)";
  db.query(sql, [kanji, reading, meaning], (err, result) => {
    if (err) {
      console.error("❌ Gagal menyimpan data:", err);
      return res
        .status(500)
        .json({ success: false, message: "Gagal menyimpan ke database" });
    }
    res.json({ success: true, message: "Data berhasil disimpan" });
  });
});

// ==== EDIT DATA ====

// ==== JALANKAN SERVER ====
app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
