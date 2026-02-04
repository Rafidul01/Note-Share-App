import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Fallback to hardcoded values if env vars are not available (for debugging)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD7v_kSCwKs-ItsRZGH-Pv4E-hYAFxZx70",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "noteshare-d6d2b.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "noteshare-d6d2b",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "noteshare-d6d2b.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "786894015215",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:786894015215:web:1348a4baa24ceb0df1a91a",
};

console.log('🔥 Firebase initialization:', {
  usingEnvVars: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 15)}...` : 'MISSING',
  projectId: firebaseConfig.projectId,
});

// Initialize Firebase
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth: Auth = getAuth(app);
const storage: FirebaseStorage = getStorage(app);

export { auth, storage };
