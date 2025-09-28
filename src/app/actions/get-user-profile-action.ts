'use server';

import 'server-only';
import { adminDb } from '@/lib/firebase/admin-config';
import type { UserProfile } from '@/types';

export async function getUserProfileAction(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = adminDb.collection('users').doc(uid);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile from server action: ", error);
    return null;
  }
}
