import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from './config';
import type { UserProfile, Word, QuizResult, Achievement } from '@/types';

// Create a new user profile document
export const createUserProfile = (uid: string, data: UserProfile) => {
  return setDoc(doc(db!, 'users', uid), data);
};

// Get a user profile (CLIENT-SIDE ONLY)
// Used during sign-in with Google to check if a profile exists.
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db!, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};


// Update a user profile
export const updateUserProfile = (uid: string, data: Partial<UserProfile>) => {
    const userDocRef = doc(db!, 'users', uid);
    return setDoc(userDocRef, data, { merge: true });
};


// Add a word
export const addWord = (wordData: Omit<Word, 'id'>) => {
  const wordsCollection = collection(db!, 'words');
  return addDoc(wordsCollection, wordData);
};

// Log an admin action
export const logAdminAction = (adminId: string, action: string, details: object) => {
    const logsCollection = collection(db!, 'admin_logs');
    return addDoc(logsCollection, {
        adminId,
        action,
        details,
        timestamp: serverTimestamp(),
    });
};

export const saveQuizResult = (resultData: Omit<QuizResult, 'id' | 'date'>) => {
  const resultsCollection = collection(db!, 'quiz_results');
  return addDoc(resultsCollection, {
    ...resultData,
    date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
  });
}

export const getArchivedWords = async (department: string): Promise<Word[]> => {
  const q = query(
    collection(db!, 'words'),
    where('department', '==', department),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Word));
};

const allAchievements: Omit<Achievement, 'unlocked'>[] = [
    { id: 'first_word', name: 'First Step', description: 'Completed your first quiz.' },
    { id: 'words_10', name: 'Word Collector', description: 'Learned 10 new words.' },
    { id: 'words_25', name: 'Lexicon Builder', description: 'Learned 25 new words.' },
    { id: 'streak_3', name: 'On a Roll', description: 'Maintained a 3-day streak.' },
    { id: 'streak_7', name: 'Weekly Warrior', description: 'Maintained a 7-day streak.' },
    { id: 'quiz_perfect', name: 'Perfectionist', description: 'Scored 100% on a quiz.' },
];

export const getUserProgress = async (userId: string) => {
    const quizResultsQuery = query(collection(db!, 'quiz_results'), where('userId', '==', userId), orderBy('date', 'desc'));

    const quizResultsSnapshot = await getDocs(quizResultsQuery);

    const wordsLearned = new Set(quizResultsSnapshot.docs.map(doc => doc.data().wordId)).size;
    const quizResults = quizResultsSnapshot.docs.map(doc => doc.data() as Omit<QuizResult, 'id'>);
    
    // Calculate streak
    let streak = 0;
    if (quizResults.length > 0) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const dates = [...new Set(quizResults.map(r => r.date))].sort();
        const participationDates = dates.map(d => new Date(d));

        let currentDate = new Date(new Date().toISOString().split('T')[0]);
        let tempStreak = 0;

        // Check for today's participation
        const todayStr = currentDate.toISOString().split('T')[0];
        if (dates.includes(todayStr)) {
            tempStreak = 1;
        }

        // Check backwards from yesterday
        currentDate.setDate(currentDate.getDate() - 1);
        for (let i = dates.length - 1; i >= 0; i--) {
            const dateStr = dates[i];
            const expectedDateStr = currentDate.toISOString().split('T')[0];
            
            if (dateStr === todayStr) continue;

            if (dateStr === expectedDateStr) {
                tempStreak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (new Date(dateStr) < currentDate) {
                break;
            }
        }
        streak = tempStreak;
    }


    const quizAverage = quizResults.length > 0
        ? quizResults.reduce((acc, r) => acc + r.score, 0) / quizResults.length
        : 0;

    // Check achievements
    const hasPerfectScore = quizResults.some(r => r.score === 100);

    const achievements = allAchievements.map(ach => {
        let unlocked = false;
        switch (ach.id) {
            case 'first_word':
                unlocked = quizResults.length > 0;
                break;
            case 'words_10':
                unlocked = wordsLearned >= 10;
                break;
            case 'words_25':
                unlocked = wordsLearned >= 25;
                break;
            case 'streak_3':
                unlocked = streak >= 3;
                break;
            case 'streak_7':
                unlocked = streak >= 7;
                break;
            case 'quiz_perfect':
                unlocked = hasPerfectScore;
                break;
        }
        return { ...ach, unlocked };
    });

    return {
        wordsLearned,
        quizAverage,
        streak,
        quizResults,
        achievements,
    };
};
