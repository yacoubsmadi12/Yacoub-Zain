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

// Register with email and password
export const registerWithEmail = async (email: string, password: string, name: string, department: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign in with Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    hd: 'zain.com', // Restrict to zain.com domain
  });
  const result = await signInWithPopup(auth, provider);
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
  return signOut(auth);
};

// Password reset
export const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
}
