import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Ganti konfigurasi ini dengan dari Firebase Console milikmu!
// 1. Buat project di https://console.firebase.google.com/
// 2. Pergi ke Project Settings > General > Your apps (Web)
// 3. Copy firebaseConfig ke bawah ini.
// 4. Pastikan kamu sudah mengaktifkan "Google" di menu Authentication > Sign-in method.
const firebaseConfig = {
  apiKey: "AIzaSyBiJKbvc5byizYVDKA5-SdhVEvJgqCAYT4",
  authDomain: "nutrify-66004.firebaseapp.com",
  projectId: "nutrify-66004",
  storageBucket: "nutrify-66004.firebasestorage.app",
  messagingSenderId: "568155898797",
  appId: "1:568155898797:web:be12c4ebc9ee7fc16e9724",
  measurementId: "G-45HGSDX2KM"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Auth & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
