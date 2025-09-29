'use server';

import 'server-only';
import { getAuth } from 'firebase/auth/web-extension';
import { app } from '@/lib/firebase/config';
import { getUserProgress } from '@/lib/firebase/firestore';

// NOTE: This is a workaround to get the auth instance on the server.
const auth = getAuth(app);

export async function getUserProgressAction() {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            return null;
        }

        return await getUserProgress(userId);

    } catch (error) {
        console.error("Error fetching user progress: ", error);
        return null;
    }
}