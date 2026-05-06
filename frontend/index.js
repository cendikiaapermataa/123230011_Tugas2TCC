//const ipAddress = '34.172.113.167'; 
//const port = prompt("Masukkan Port Backend (Contoh: 3000):", "3000"); 
//const API_URL = `http://${ipAddress}:${port}/api/notes`; 
const API_URL = 'https://be-rest-011-1079290367613.us-central1.run.app/api/notes';

let allNotes = []; 

document.addEventListener('DOMContentLoaded', getNotes);

async function getNotes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Gagal mengambil data");
        allNotes = await response.json(); // Simpan ke variabel global
        displayNotes(allNotes);
    } catch (error) {
        console.error("Gagal mengambil data:", error);
        const container = document.getElementById('notesList');
        container.innerHTML = `<p style="text-align: center; color: red;">Gagal terhubung ke server di port ${port}!</p>`;
    }
}

function displayNotes(notes) {
    const container = document.getElementById('notesList');
    container.innerHTML = '';

    if (notes.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">Belum ada catatan.</p>';
        return;
    }

    notes.forEach(note => {
        const date = new Date(note.tanggal_dibuat).toLocaleString('id-ID');
        const card = `
            <div class="note-card">
                <h3>${note.judul}</h3>
                <p>${note.isi}</p>
                <small>Dibuat: ${date}</small>
                <div class="actions">
                    <button class="btn-edit" onclick="prepareEdit(${note.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteNote(${note.id})">Hapus</button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Menyiapkan data untuk diedit
function prepareEdit(id) {
    const note = allNotes.find(n => n.id === id);
    if (note) {
        document.getElementById('noteId').value = note.id;
        document.getElementById('judul').value = note.judul;
        document.getElementById('isi').value = note.isi;
        
        document.getElementById('btnSimpan').innerText = "Update Catatan";
        document.getElementById('btnBatal').style.display = "block";
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

async function saveNote() {
    const id = document.getElementById('noteId').value;
    const judul = document.getElementById('judul').value;
    const isi = document.getElementById('isi').value;

    if (!judul || !isi) return alert("Judul dan isi tidak boleh kosong!");

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ judul, isi })
        });

        if (response.ok) {
            resetForm();
            getNotes();
        } else {
            alert("Gagal menyimpan ke database.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Gagal terhubung ke server!");
    }
}

function resetForm() {
    document.getElementById('noteId').value = '';
    document.getElementById('judul').value = '';
    document.getElementById('isi').value = '';
    document.getElementById('btnSimpan').innerText = "Simpan Catatan";
    document.getElementById('btnBatal').style.display = "none";
}

async function deleteNote(id) {
    if (confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                getNotes();
            }
        } catch (error) {
            alert("Gagal menghapus catatan!");
        }
    }
}
