'use server';

import 'server-only';
import { collection, query, where, limit, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Word } from '@/types';
import { generateWordOfTheDay } from '@/ai/flows/generate-word-of-the-day-flow';

/**
 * Fetches the word of the day for a given department.
 * If no word is found, it generates a new one using an AI flow and saves it.
 * This is a Server Action and will only execute on the server.
 */
export async function getWordOfTheDayAction(department: string): Promise<Word | null> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    const fetchWord = async (dept: string) => {
      const q = query(
        collection(db, 'words'),
        where('department', '==', dept),
        where('date', '==', today),
        limit(1)
      );
      
      const snapshot = await getDocs(q);

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
    
    // If still no word is found for today, generate one for the user's department
    console.log(`No word found for ${department} or General. Generating a new one.`);
    const generatedWord = await generateWordOfTheDay({ department });

    const newWordData = {
      word: generatedWord.word,
      definition: generatedWord.definition,
      examples: generatedWord.examples,
      pronunciation: generatedWord.pronunciation,
      department: department,
      date: today,
    };

    const docRef = await addDoc(collection(db, 'words'), newWordData);
    console.log(`New word "${generatedWord.word}" saved with ID: ${docRef.id}`);

    return { id: docRef.id, ...newWordData };

  } catch (error) {
    console.error("Error in getWordOfTheDayAction: ", error);
    // In a production app, you might want to handle this more gracefully.
    // For now, we return null, and the UI will show a "not available" message.
    return null;
  }
}
