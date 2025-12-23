import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Firebase конфигурация
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD2d6zK6yObRvmIXyWfAPvtvDr6xNR4TV4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "santa-s-workshop-96a2e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "santa-s-workshop-96a2e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "santa-s-workshop-96a2e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "574769228252",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:574769228252:web:7c4abbe9a7731aa5fb0719"
}

// Инициализиране на Firebase
const app = initializeApp(firebaseConfig)

// Инициализиране на Firestore
export const db = getFirestore(app)

// Инициализиране на Authentication
export const auth = getAuth(app)

export default app
