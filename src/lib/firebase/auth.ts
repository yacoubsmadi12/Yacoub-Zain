import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from './config';
import { createUserProfile, getUserProfile } from './firestore';
import type { UserProfile } from '@/types';

const checkFirebaseAuth = () => {
  if (!auth) {
    throw new Error('Firebase is not configured. Please add Firebase environment variables to use authentication features.');
  }
  return auth;
};

// Register with email and password
export const registerWithEmail = async (email: string, password: string, name: string, department: string) => {
  const firebaseAuth = checkFirebaseAuth();
  const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  const user = userCredential.user;
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email,
    name,
    department,
  };
  await createUserProfile(user.uid, userProfile);
  return userCredential;
};

// Sign in with email and password
export const signInWithEmail = (email: string, password: string) => {
  const firebaseAuth = checkFirebaseAuth();
  return signInWithEmailAndPassword(firebaseAuth, email, password);
};

// Sign in with Google
export const signInWithGoogle = async () => {
  const firebaseAuth = checkFirebaseAuth();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(firebaseAuth, provider);
  const user = result.user;
  
  // Check if user profile exists, if not create one
  const userProfile = await getUserProfile(user.uid);
  if (!userProfile) {
    const newUserProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      department: 'Unassigned', // Default department
    };
    await createUserProfile(user.uid, newUserProfile);
  }
  return result;
};

// Sign out
export const logout = () => {
  const firebaseAuth = checkFirebaseAuth();
  return signOut(firebaseAuth);
};

// Password reset
export const resetPassword = (email: string) => {
  const firebaseAuth = checkFirebaseAuth();
  return sendPasswordResetEmail(firebaseAuth, email);
}
