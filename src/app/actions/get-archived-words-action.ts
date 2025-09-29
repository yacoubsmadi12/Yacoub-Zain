'use server';

import 'server-only';
import { headers } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin-config';
import { getUserProfile, getArchivedWords } from '@/lib/firebase/firestore';
import type { Word } from '@/types';

export async function getArchivedWordsAction(): Promise<Word[]> {
    try {
        const authorization = headers().get('Authorization');
        if (!authorization?.startsWith('Bearer ')) {
            // This can happen if the user is not logged in.
            return [];
        }
        const idToken = authorization.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        const userProfile = await getUserProfile(userId);
        if (!userProfile?.department) {
            return [];
        }

        const words = await getArchivedWords(userProfile.department);
        return words;

    } catch (error) {
        console.error("Error fetching archived words: ", error);
        return [];
    }
}
