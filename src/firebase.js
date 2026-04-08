import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdaZFG0ijenJkkp0vKgtn0qYP3EZt3N7c",
  authDomain: "xinfattioc.firebaseapp.com",
  projectId: "xinfattioc",
  storageBucket: "xinfattioc.firebasestorage.app",
  messagingSenderId: "1027450945966",
  appId: "1:1027450945966:web:eb869e38df76c40a6dc83f",
  measurementId: "G-YZFM9SF3CX"
};

// Inicializamos la App
const app = initializeApp(firebaseConfig);

// Exportamos las herramientas para usarlas en tu red social
export const db = getFirestore(app);      // Para guardar los posts
export const auth = getAuth(app);        // Para que la gente se registre
export const storage = getStorage(app);  // Para las fotos que suban