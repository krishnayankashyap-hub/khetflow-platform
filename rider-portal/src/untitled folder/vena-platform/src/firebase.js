// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjf6C4rXZNUiqWBvtK234G8R2aadXGzf4",
  authDomain: "vena-bf72a.firebaseapp.com",
  projectId: "vena-bf72a",
  storageBucket: "vena-bf72a.firebasestorage.app",
  messagingSenderId: "433281320425",
  appId: "1:433281320425:web:f4e78fbc733a8b5a1db778"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);