'use server';

import 'server-only';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { UserProfile } from '@/types';

export async function getUserProfileAction(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile from server action: ", error);
    return null;
  }
}
