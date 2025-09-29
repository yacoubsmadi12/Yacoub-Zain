// src/lib/firebase/admin-config.ts
import 'server-only';
import admin from 'firebase-admin';
import 'dotenv/config';

const getFirebaseAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  try {
    // Ensure all required environment variables are present
    if (
      !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error(
        'Missing Firebase Admin SDK credentials. Please check your .env file.'
      );
    }

    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    return app;
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    throw new Error('Could not initialize Firebase Admin SDK. Check server logs and .env file.');
  }
};

const app = getFirebaseAdminApp();
export const adminDb = admin.firestore(app);
export const adminAuth = admin.auth(app);
