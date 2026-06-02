# Nutrify 🥗

**Nutrify** adalah aplikasi Full-stack yang membantu pengguna melacak asupan nutrisi harian, mendeteksi kandungan makanan dari gambar atau input manual menggunakan kecerdasan buatan (AI), serta memberikan saran pola makan sehat yang disesuaikan dengan kondisi medis masing-masing pengguna (seperti Diabetes, Hipertensi, Asam Urat, Kolesterol, atau Obesitas) melalui Asisten AI terintegrasi.

Aplikasi ini dibagi menjadi dua bagian utama:
1.  **Frontend** (`frontend-nutrify`): Aplikasi antarmuka pengguna berbasis React + Vite.
2.  **Backend** (`backend-nutrify`): API Server berbasis Node.js + Express.js dengan database MongoDB.

---

## ✨ Fitur Utama

*   📸 **Scan Makanan (AI Image Scanner)**: Unggah foto makanan Anda dan AI akan menganalisis berat porsi estimasi beserta rincian kandungan gizinya secara otomatis.
*   ✍️ **Input Komposisi Manual**: Menganalisis komposisi gizi makanan berdasarkan ketikan teks pengguna (misal: "Nasi goreng 1 porsi, Telur ceplok 1 butir").
*   📊 **Dashboard Nutrisi Harian**: Grafik garis untuk tren kalori mingguan dan grafik pai untuk proporsi makronutrisi harian (Karbohidrat, Protein, Lemak, Serat, Gula, Natrium).
*   🤖 **Nutrify AI Chatbot**: Asisten chatbot pintar yang didukung oleh model Google Gemini untuk konsultasi gizi, makanan sehat, resep, dan tips olahraga.
*   ⚙️ **Personalisasi Gizi**: Menghitung target kalori dan gizi harian otomatis berdasarkan tinggi badan, berat badan, umur, tingkat aktivitas fisik, alergi makanan, serta batasan kondisi medis tertentu.
*   ⏳ **Riwayat Asupan (History)**: Menyimpan riwayat makanan yang telah dikonsumsi lengkap dengan rincian nutrisi yang bisa ditinjau kembali atau dihapus jika diperlukan.

---

## 🛠️ Tech Stack

### Frontend
*   **React JS** (Vite)
*   **Tailwind CSS** & vanilla styling
*   **Framer Motion** (Animasi transisi antarmuka)
*   **Axios** (Integrasi API)
*   **Firebase Authentication** (Google Sign-In)
*   **Recharts** (Rendering grafik statistik)

### Backend
*   **Node.js** & **Express.js** (API Framework)
*   **MongoDB** & **Mongoose** (Database)
*   **Google GenAI SDK** (Model Gemini)
*   **Hugging Face Space API** (Dukungan API Eksternal untuk klasifikasi makanan)
*   **JSON Web Tokens (JWT)** (Autentikasi sesi pengguna)
*   **Bcrypt.js** (Hashing password keamanan tingkat tinggi)

---

## 🔒 Fitur Keamanan Terbaru (Security Hardening)
Aplikasi ini telah diperbaiki dari celah kerentanan kritis untuk menjamin keamanan data saat dipublikasikan ke hosting publik:
*   **Proteksi IDOR (Insecure Direct Object Reference)**: Validasi token JWT yang ketat pada profil pengguna (`/api/users/:id`), sehingga pengguna hanya bisa memodifikasi atau melihat data mereka sendiri.
*   **Pencegahan Data Leak**: Menonaktifkan endpoint listing semua user global (`GET /api/users`) guna mematuhi prinsip privasi data.
*   **Autentikasi Chatbot**: Endpoint chatbot (`/api/chat`) sekarang sepenuhnya dilindungi middleware `protect` JWT untuk menghindari eksploitasi API Gemini gratisan.
*   **Rate Limiting**: Pembatasan request dari satu alamat IP untuk memblokir serangan DoS dan Brute Force pada autentikasi login/register.
*   **Secure Headers & CORS**: Menggunakan middleware `helmet` untuk memasang header keamanan HTTP standar dan membatasi CORS origin ke domain resmi (contoh: `https://nutrify.biz.id`).

---

## 🚀 Langkah Instalasi & Penggunaan Lokal

### 1. Prasyarat (Prerequisites)
Pastikan Anda sudah menginstal:
*   [Node.js](https://nodejs.org/) (versi LTS terbaru direkomendasikan)
*   [MongoDB](https://www.mongodb.com/) (lokal atau cloud cluster MongoDB Atlas)

---

### 2. Konfigurasi Backend (`backend-nutrify`)
1.  Buka terminal dan masuk ke direktori backend:
    ```bash
    cd backend-nutrify
    ```
2.  Instal seluruh dependensi:
    ```bash
    npm install
    ```
3.  Salin file `.env.example` menjadi `.env` lalu isi variabel yang dibutuhkan:
    ```env
    PORT=5000
    MONGO_URI=mongodb+srv://... (atau mongodb://localhost:27017/nutrify)
    JWT_SECRET=gunakan_kunci_acak_dan_panjang
    GEMINI_API_KEY=AIzaSy... (API Key dari Google AI Studio)
    ALLOWED_ORIGINS=http://localhost:5173,https://nutrify.biz.id
    ```
4.  Jalankan server pengembangan backend:
    ```bash
    npm run dev
    ```
    Server akan berjalan di port `5000` (`http://localhost:5000`).

---

### 3. Konfigurasi Frontend (`frontend-nutrify`)
1.  Buka terminal baru dan masuk ke direktori frontend:
    ```bash
    cd ../frontend-nutrify
    ```
2.  Instal seluruh dependensi:
    ```bash
    npm install
    ```
3.  Buat file `.env` di dalam folder `frontend-nutrify` (atau sesuaikan `.env.example`):
    ```env
    # Firebase Config
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    
    # URL Backend API
    VITE_API_URL=http://localhost:5000
    ```
4.  Jalankan aplikasi React secara lokal:
    ```bash
    npm run dev
    ```
    Aplikasi web dapat diakses di browser melalui alamat `http://localhost:5173`.

---

## 📂 Struktur Proyek

```text
Full-Stack/
├── backend-nutrify/
│   ├── src/
│   │   ├── config/       # Koneksi DB
│   │   ├── controllers/  # Logika request-response router
│   │   ├── middlewares/  # Middleware JWT & Auth
│   │   ├── models/       # Skema MongoDB Mongoose
│   │   ├── routes/       # Definisi endpoint rute API
│   │   └── services/     # Logika bisnis inti & Integrasi AI
│   ├── app.js            # Inisialisasi Express & Middleware Keamanan
│   └── server.js         # Entrypoint server lokal
│
├── frontend-nutrify/
│   ├── src/
│   │   ├── components/   # UI Reusable components
│   │   ├── config/       # Inisialisasi Firebase Auth
│   │   ├── features/     # Modul Fitur (Dashboard, Chat, Scan, History, Auth)
│   │   ├── layout/       # Tata letak halaman (Sidebar, Navbar)
│   │   └── utils/        # Helper functions & session storage
│   ├── index.html
│   └── vite.config.js
```
