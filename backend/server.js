require('dotenv').config(); // Tambahkan ini di paling atas!
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Menggunakan variabel dari file .env
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'notes_app'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Database Connected!');
});

// --- BAGIAN CRUD ---

// 1. GET: Ambil semua catatan
app.get('/api/notes', (req, res) => {
  const sql = "SELECT * FROM notes ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// 2. POST: Tambah catatan baru
app.post('/api/notes', (req, res) => {
  const { judul, isi } = req.body;
  const sql = "INSERT INTO notes (judul, isi) VALUES (?, ?)";
  db.query(sql, [judul, isi], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Note added!", id: result.insertId });
  });
});

// 3. DELETE: Hapus catatan
app.delete('/api/notes/:id', (req, res) => {
  const sql = "DELETE FROM notes WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Note deleted!" });
  });
});


// 4. PUT: Edit catatan
app.put('/api/notes/:id', (req, res) => {
  const { judul, isi } = req.body;
  const sql = "UPDATE notes SET judul = ?, isi = ? WHERE id = ?";
  db.query(sql, [judul, isi, req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Note updated!" });
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
