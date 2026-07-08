import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/**
 * ============================================================================
 * TODO: FIREBASE CONFIGURATION FOR IMOTION PRODUCTION
 * ============================================================================
 * Replace the placeholder values below with your actual Firebase project credentials.
 * You can find these in the Firebase Console:
 * 1. Go to Project Settings (gear icon next to Project Overview)
 * 2. Under 'Your apps', click on your Web app (or register a new one)
 * 3. Copy the 'firebaseConfig' object and paste it below.
 * ============================================================================
 */
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY_HERE",
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || "imotion-production-billing.firebaseapp.com",
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || "imotion-production-billing",
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || "imotion-production-billing.appspot.com",
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID_HERE",
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID_HERE"
};

// Check if the developer has filled in their actual credentials
export const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  !firebaseConfig.apiKey.includes("YOUR_") &&
  firebaseConfig.apiKey.trim().length > 10;

let db: any = null;

if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    console.log("🔥 Firebase Firestore connected and verified.");
  } catch (err) {
    console.error("❌ Failed to connect to Firebase Firestore:", err);
  }
} else {
  console.log(
    "⚠️ Firebase Firestore is not configured yet. Running in high-fidelity 'Local Storage Mode'. Data will persist locally in your browser cache. Fill in your credentials in `src/firebase/config.ts` to activate live Firestore cloud sync."
  );
}

export { db };
export default firebaseConfig;
