'use server';

import 'server-only';
import { getAuth } from 'firebase/auth/web-extension';
import { app } from '@/lib/firebase/config';
import { getUserProfile, getArchivedWords } from '@/lib/firebase/firestore';
import type { Word } from '@/types';

// NOTE: This is a workaround to get the auth instance on the server.
const auth = getAuth(app);

export async function getArchivedWordsAction(): Promise<Word[]> {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            // This can happen if the user is not logged in.
            return [];
        }

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
