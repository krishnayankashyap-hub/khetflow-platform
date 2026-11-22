import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDtGjU-sKguz0iFHunt_VpqUvDByygWCfk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "khetflow-38a6e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "khetflow-38a6e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "khetflow-38a6e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "338837231132",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:338837231132:web:070ca3b524789030bd31d9",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DGP8CR6GWB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
