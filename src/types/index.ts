import type { User as FirebaseUser } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  department: string | null;
  isAdmin?: boolean;
}

export interface AppUser extends FirebaseUser {
  profile?: UserProfile;
}

export interface Word {
  id: string;
  word: string;
  definition: string;
  examples: string[];
  pronunciation?: string;
  department: string;
  date: string; // YYYY-MM-DD
}

export interface QuizResult {
  id: string;
  userId: string;
  wordId: string;
  score: number; // Percentage
  date: string; // YYYY-MM-DD
}

export interface Achievement {
  id: 'first_word' | 'streak_3' | 'streak_7' | 'words_10' | 'words_25' | 'quiz_perfect';
  name: string;
  description: string;
  unlocked: boolean;
}
