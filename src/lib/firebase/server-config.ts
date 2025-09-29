'use server';
// src/lib/firebase/server-config.ts
import 'server-only';
import admin from 'firebase-admin';
import 'dotenv/config';

// This is a singleton pattern to ensure Firebase Admin is initialized only once.
let app: admin.app.App;

function getFirebaseAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

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

  try {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key needs to have newline characters correctly interpreted.
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(
          /\\n/g,
          '\n'
        ),
      }),
    });
    return app;
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.message);
    throw new Error(
      'Could not initialize Firebase Admin SDK. Check server logs and .env file.'
    );
  }
}

// Initialize the app when the module is loaded
getFirebaseAdminApp();

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
