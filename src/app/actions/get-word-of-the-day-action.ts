'use server';

import 'server-only';
import { adminDb } from '@/lib/firebase/admin-config';
import type { Word } from '@/types';

/**
 * Fetches the word of the day for a given department using the Firebase Admin SDK.
 * This is a Server Action and will only execute on the server.
 */
export async function getWordOfTheDayAction(department: string): Promise<Word | null> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    const fetchWord = async (dept: string) => {
      const snapshot = await adminDb
        .collection('words')
        .where('department', '==', dept)
        .where('date', '==', today)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Word;
      }
      return null;
    };

    // First, try to find a word for the specific department
    let word = await fetchWord(department);
    if (word) {
      return word;
    }

    // If no word for the specific department, fall back to "General"
    if (department !== 'General') {
      word = await fetchWord('General');
      if (word) {
        return word;
      }
    }
  } catch (error) {
    console.error("Error fetching word of the day from server action: ", error);
    // In a production app, you might want to handle this more gracefully.
    // For now, we return null, and the UI will show a "not available" message.
    return null;
  }
  
  return null;
}
