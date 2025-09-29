'use server';

import 'server-only';
import { getUserProgress } from '@/lib/firebase/firestore';

export async function getUserProgressAction(userId: string) {
    try {
        if (!userId) {
            console.log("User ID not provided to getUserProgressAction");
            return null;
        }

        return await getUserProgress(userId);

    } catch (error) {
        console.error("Error fetching user progress: ", error);
        return null;
    }
}
