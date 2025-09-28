import { doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from './config';
import type { UserProfile, Word } from '@/types';

// Create a new user profile document
export const createUserProfile = (uid: string, data: UserProfile) => {
  return setDoc(doc(db, 'users', uid), data);
};

// Get a user profile
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

// Get Word of the Day for a department
export const getWordOfTheDay = async (department: string): Promise<Word | null> => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const q = query(
        collection(db, 'words'), 
        where('department', '==', department), 
        where('date', '==', today),
        limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Word;
    }
    return null;
}

// Get all words for a department (for archive)
export const getWordsByDepartment = async (department: string): Promise<Word[]> => {
    const q = query(
        collection(db, 'words'),
        where('department', '==', department),
        orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Word));
}

// Log an admin action
export const logAdminAction = (adminId: string, action: string, details: object) => {
    const logsCollection = collection(db, 'admin_logs');
    return addDoc(logsCollection, {
        adminId,
        action,
        details,
        timestamp: new Date(),
    });
}
