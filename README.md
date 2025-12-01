# URBANSOLE — Hardcore Neo-Brutalism Streetwear ⚡

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Design](https://img.shields.io/badge/Design-Neo--Brutalism-000000?style=for-the-badge)

> **"Drop The Basic Look. Wear Chaos."**

**URBANSOLE** adalah platform *E-Commerce* modern yang mengusung estetika desain **Neo-Brutalism**. Proyek ini menantang standar desain konvensional dengan penggunaan tipografi monospaced yang berani, garis tepi tebal, warna kontras tinggi, dan tata letak asimetris (*Bento Grid*).

Dibangun dengan **Vanilla JavaScript**, Urbansole membuktikan bahwa fungsionalitas kompleks seperti manajemen keranjang belanja, wishlist, autentikasi pengguna, dan dashboard admin dapat dicapai tanpa framework berat.

---

## 🌐 Live Demo

Rasakan pengalaman belanja yang berbeda di sini:

👉 **[https://bayugensoz.github.io/urbansole/](https://bayugensoz.github.io/urbansole/)**

---

## 🔥 Fitur Utama (Key Features)

### 🎨 1. Neo-Brutalism UI/UX
*   **High Contrast Aesthetics:** Kombinasi warna kuning lalu lintas, biru elektrik, dan merah murni dengan border hitam 3px yang tegas.
*   **Tactile Interactions:** Efek *hover* dengan bayangan kasar (*hard shadow*) memberikan umpan balik visual yang memuaskan.
*   **Responsive Layout:** Desain adaptif yang tetap "rusuh" namun fungsional di berbagai ukuran layar.

### 🛍️ 2. Advanced Shopping Experience
*   **Shopping Cart System:** Tambah barang ke keranjang, update kuantitas, dan hitung total belanja secara *real-time*.
*   **Wishlist:** Simpan item favorit Anda untuk dibeli nanti.
*   **Checkout Simulation:** Formulir checkout lengkap dengan ringkasan pesanan dan validasi.
*   **Dynamic Product Rendering:** Katalog produk di-generate secara dinamis dari data JavaScript.

### 🔐 3. User Management & Admin
*   **User Authentication:** Sistem Login dan Register fungsional menggunakan `localStorage`.
*   **Admin Dashboard:** Panel khusus admin untuk mengelola produk (Tambah/Hapus Produk).
*   **Profile Management:** Tampilan status login yang personal dengan pemotongan nama pengguna otomatis.

### ⚙️ 4. Technical Highlights
*   **Local Storage Database:** Persistensi data untuk user, produk, keranjang, dan wishlist tanpa backend server.
*   **Image Handling:** Dukungan upload gambar produk (konversi Base64) untuk penambahan produk baru.
*   **Clean Code Architecture:** Pemisahan logika (JS), gaya (CSS), dan struktur (HTML) yang rapi.

---

## 📂 Struktur Proyek

```text
urbansole/
├── index.html          # Halaman Utama (Bento Grid Layout)
├── produk.html         # Katalog Produk Lengkap
├── detail-produk.html  # Halaman Detail Produk
├── wishlist.html       # Halaman Item Favorit
├── checkout.html       # Halaman Pembayaran
├── login.html          # Halaman Masuk
├── register.html       # Halaman Pendaftaran
├── admin.html          # Dashboard Admin (Kelola Produk)
├── about.html          # Tentang Kami
├── kontak.html         # Halaman Kontak
├── css/
│   └── style.css       # Stylesheet Utama (CSS Variables & Neo-Brutalism)
├── js/
│   └── script.js       # Core Logic (Auth, Cart, Products, DOM)
└── img/                # Aset Gambar
```

---

## 🚀 Cara Menjalankan (Local Development)

1.  Clone repository ini:
    ```bash
    git clone https://github.com/bayugensoz/urbansole.git
    ```
2.  Buka folder proyek di VS Code.
3.  Jalankan menggunakan **Live Server** extension untuk pengalaman terbaik.

---

### 👨‍💻 Author

Project ini dikerjakan dengan penuh dedikasi oleh:

*   **Nama:** Bayu Ramadhan
*   **NIM:** 242011069
*   **Kelas:** MC

*Dibuat untuk memenuhi Tugas Pemrograman Web 1.*