const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// Middleware untuk parsing data dari form
app.use(bodyParser.urlencoded({ extended: true }));

// Layani file HTML, CSS, JS dari folder /public
app.use(express.static(path.join(__dirname, "public")));

// Koneksi ke MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Ganti jika pakai user lain
  password: "", // Ganti kalau ada password
  database: "belajar_kanji",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Koneksi database gagal:", err);
    return;
  }
  console.log("✅ Terhubung ke database MySQL");
});

// Terima POST dari form
app.post("/submit-kanji", (req, res) => {
  const { kanji, reading, meaning } = req.body;

  console.log("Data diterima:", req.body);

  const sql = "INSERT INTO kanji_data (kanji, bacaan, arti) VALUES (?, ?, ?)";
  db.query(sql, [kanji, reading, meaning], (err, result) => {
    if (err) {
      console.error("❌ Gagal menyimpan data:", err);
      return res.status(500).send("Terjadi kesalahan saat menyimpan data");
    }

    console.log("✅ Data berhasil disimpan:", result);
    res.sendStatus(200); // Kirim OK ke frontend
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
