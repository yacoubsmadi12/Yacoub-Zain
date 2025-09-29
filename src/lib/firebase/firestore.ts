import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from './config';
import type { UserProfile, Word, QuizResult } from '@/types';

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
};

export const saveQuizResult = (resultData: Omit<QuizResult, 'id' | 'date'>) => {
  const resultsCollection = collection(db, 'quiz_results');
  return addDoc(resultsCollection, {
    ...resultData,
    date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
  });
}

export const getArchivedWords = async (department: string): Promise<Word[]> => {
  const q = query(
    collection(db, 'words'),
    where('department', '==', department),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Word));
};

export const getUserProgress = async (userId: string) => {
    const wordsQuery = query(collection(db, 'words'), where('department', '==', 'General')); // Simplified for now
    const quizResultsQuery = query(collection(db, 'quiz_results'), where('userId', '==', userId), orderBy('date', 'desc'));

    const [wordsSnapshot, quizResultsSnapshot] = await Promise.all([getDocs(wordsQuery), getDocs(quizResultsQuery)]);

    const wordsLearned = new Set(quizResultsSnapshot.docs.map(doc => doc.data().wordId)).size;
    const quizResults = quizResultsSnapshot.docs.map(doc => doc.data() as Omit<QuizResult, 'id'>);
    
    // Calculate streak
    let streak = 0;
    if (quizResults.length > 0) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const dates = [...new Set(quizResults.map(r => r.date))].sort().reverse();
        const participationDates = dates.map(d => new Date(d));

        let currentDate = new Date(new Date().toISOString().split('T')[0]);

        // Check if today is in participation dates
        const todayInDates = participationDates.some(d => d.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]);
        if(todayInDates) streak++;
        else {
          currentDate.setDate(currentDate.getDate() - 1); // Start checking from yesterday
        }
        
        for (let i = 0; i < participationDates.length; i++) {
            const date = participationDates[i];
            const expectedDateStr = currentDate.toISOString().split('T')[0];

            if (date.toISOString().split('T')[0] === expectedDateStr) {
                if(!todayInDates) streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (date < currentDate) {
                break; // Gap in dates
            }
        }
    }


    const quizAverage = quizResults.length > 0
        ? quizResults.reduce((acc, r) => acc + r.score, 0) / quizResults.length
        : 0;

    return {
        wordsLearned,
        quizAverage,
        streak,
        quizResults,
    };
};
