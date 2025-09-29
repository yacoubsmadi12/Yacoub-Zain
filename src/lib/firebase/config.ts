import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import config from '@/lib/config';

// Initialize Firebase for client side
const app: FirebaseApp = !getApps().length ? initializeApp(config.firebase) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
