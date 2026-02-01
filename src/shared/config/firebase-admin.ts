import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App | undefined;
let adminAuthInstance: Auth | undefined;

function initializeFirebaseAdmin() {
  // Check if already initialized
  if (getApps().length > 0) {
    adminApp = getApps()[0];
    adminAuthInstance = getAuth(adminApp);
    return;
  }

  // Validate environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin credentials. Please check your .env.local file.'
    );
  }

  try {
    // Initialize Firebase Admin
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });

    adminAuthInstance = getAuth(adminApp);
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error);
    throw error;
  }
}

// Initialize on module load
initializeFirebaseAdmin();

export const adminAuth = adminAuthInstance!;
export { adminApp };
