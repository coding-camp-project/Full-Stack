import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBiJKbvc5byizYVDKA5-SdhVEvJgqCAYT4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nutrify-66004.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nutrify-66004",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nutrify-66004.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "568155898797",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:568155898797:web:be12c4ebc9ee7fc16e9724",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-45HGSDX2KM"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Auth & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
