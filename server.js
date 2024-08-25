const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

// Fungsi untuk memuat data dari file JSON
function loadData() {
    if (!fs.existsSync('data.json')) {
        return [];
    }
    const data = fs.readFileSync('data.json');
    return JSON.parse(data);
}

// Fungsi untuk menyimpan data ke file JSON
function saveData(data) {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 4));
}

// Endpoint untuk menambah data
app.post('/add', (req, res) => {
    const newEntry = req.body;
    const data = loadData();
    data.push(newEntry);
    saveData(data);
    res.status(201).json({ message: "Data berhasil ditambahkan!" });
});

// Endpoint untuk menghapus data berdasarkan nama variabel
app.delete('/delete/:variable', (req, res) => {
    const variable = req.params.variable;
    let data = loadData();
    data = data.filter(entry => entry.name !== variable);
    saveData(data);
    res.status(200).json({ message: "Data berhasil dihapus!" });
});

// Endpoint untuk mengedit data berdasarkan nama variabel
app.put('/edit/:variable', (req, res) => {
    const variable = req.params.variable;
    const updatedEntry = req.body;
    let data = loadData();
    const index = data.findIndex(entry => entry.name === variable);
    if (index !== -1) {
        data[index] = updatedEntry;
        saveData(data);
        res.status(200).json({ message: "Data berhasil diperbarui!" });
    } else {
        res.status(404).json({ message: "Data tidak ditemukan!" });
    }
});

// Endpoint untuk melihat data berdasarkan nama variabel
app.get('/view/:variable', (req, res) => {
    const variable = req.params.variable;
    const data = loadData();
    const entry = data.find(entry => entry.name === variable);
    if (entry) {
        res.status(200).json(entry);
    } else {
        res.status(404).json({ message: "Data tidak ditemukan!" });
    }
});

// Endpoint untuk menyambut pengguna di halaman utama
app.get('/', (req, res) => {
    res.status(200).json({ message: "Selamat datang di JSON Database API!" });
});

// Menjalankan server Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan pada http://localhost:${PORT}`);
});
