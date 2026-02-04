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
    // During build time, environment variables might not be available
    // Don't throw error, just log warning
    console.warn('⚠️ Firebase Admin credentials not found. This is expected during build time.');
    return;
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
    // Don't throw during initialization - let it fail at runtime if needed
  }
}

// Initialize on module load (but don't throw if it fails)
initializeFirebaseAdmin();

// Lazy getter for adminAuth - will throw at runtime if not initialized
export const getAdminAuth = (): Auth => {
  if (!adminAuthInstance) {
    throw new Error('Firebase Admin not initialized. Check environment variables.');
  }
  return adminAuthInstance;
};

// For backward compatibility
export const adminAuth = new Proxy({} as Auth, {
  get(target, prop) {
    return getAdminAuth()[prop as keyof Auth];
  }
});

export { adminApp };
