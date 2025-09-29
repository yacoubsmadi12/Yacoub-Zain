'use server';

import 'server-only';
import { saveQuizResult } from '@/lib/firebase/firestore';

interface SaveQuizResultPayload {
    userId: string;
    wordId: string;
    score: number;
}

export async function saveQuizResultAction(payload: SaveQuizResultPayload): Promise<void> {
    try {
        await saveQuizResult(payload);
    } catch (error) {
        console.error("Error saving quiz result: ", error);
        throw new Error("Could not save quiz result.");
    }
}
