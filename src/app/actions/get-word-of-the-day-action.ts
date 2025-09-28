'use server';

import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Word } from '@/types';

/**
 * Fetches the word of the day for a given department.
 * This is a Server Action and will only execute on the server.
 */
export async function getWordOfTheDayAction(department: string): Promise<Word | null> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    // First, try to find a word for the specific department
    const departmentQuery = query(
      collection(db, 'words'),
      where('department', '==', department),
      where('date', '==', today),
      limit(1)
    );
    const departmentSnapshot = await getDocs(departmentQuery);
    if (!departmentSnapshot.empty) {
      const doc = departmentSnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Word;
    }

    // If no word for the specific department, fall back to "General"
    if (department !== 'General') {
      const generalQuery = query(
        collection(db, 'words'),
        where('department', '==', 'General'),
        where('date', '==', today),
        limit(1)
      );
      const generalSnapshot = await getDocs(generalQuery);
      if (!generalSnapshot.empty) {
        const doc = generalSnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Word;
      }
    }
  } catch (error) {
    console.error("Error fetching word of the day from server action: ", error);
    // Return null or re-throw to handle the error on the client side
    return null;
  }
  
  return null;
}
