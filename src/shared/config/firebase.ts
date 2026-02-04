import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Log all NEXT_PUBLIC env vars to debug
console.log('Environment variables check:', {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'EXISTS' : 'MISSING',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'EXISTS' : 'MISSING',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'EXISTS' : 'MISSING',
});

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('Firebase config being used:', {
  apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'UNDEFINED',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
});

// Validate required config
if (!firebaseConfig.apiKey) {
  console.error('CRITICAL: NEXT_PUBLIC_FIREBASE_API_KEY is not set!');
  throw new Error('Missing NEXT_PUBLIC_FIREBASE_API_KEY environment variable');
}

// Initialize Firebase
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth: Auth = getAuth(app);
const storage: FirebaseStorage = getStorage(app);

export { auth, storage };
