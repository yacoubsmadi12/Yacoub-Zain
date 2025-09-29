import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import type { UserProfile, Word } from '@/types';

// Create a new user profile document
export const createUserProfile = (uid: string, data: UserProfile) => {
  return setDoc(doc(db, 'users', uid), data);
};

// Get a user profile (CLIENT-SIDE ONLY)
// Used during sign-in with Google to check if a profile exists.
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};


// Update a user profile
export const updateUserProfile = (uid: string, data: Partial<UserProfile>) => {
    const userDocRef = doc(db, 'users', uid);
    return setDoc(userDocRef, data, { merge: true });
};


// Add a word
export const addWord = (wordData: Omit<Word, 'id'>) => {
  const wordsCollection = collection(db, 'words');
  return addDoc(wordsCollection, wordData);
};

// Log an admin action
export const logAdminAction = (adminId: string, action: string, details: object) => {
    const logsCollection = collection(db, 'admin_logs');
    return addDoc(logsCollection, {
        adminId,
        action,
        details,
        timestamp: serverTimestamp(),
    });
}
