import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, type Firestore } from 'firebase/firestore';
import config from '@/lib/config';

const firebaseConfig = config.firebase;

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);

if (typeof window !== 'undefined') {
    try {
      enableIndexedDbPersistence(db)
        .catch((err) => {
            if (err.code == 'failed-precondition') {
                console.warn('Firestore persistence failed: multiple tabs open.');
            } else if (err.code == 'unimplemented') {
                console.warn('Firestore persistence not available in this browser.');
            }
        });
    } catch (err: any) {
        console.error("Error enabling Firestore persistence: ", err);
    }
}

export { app, auth, db };
