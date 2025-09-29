'use server';

import 'server-only';
import { getWordOfTheDayAction } from './get-word-of-the-day-action';
import { generateQuiz, type GenerateQuizOutput } from '@/ai/flows/generate-quiz-flow';
import type { Word } from '@/types';

export interface DailyQuiz {
    word: Word;
    quiz: GenerateQuizOutput;
}

/**
 * Fetches the word of the day and generates a quiz for it.
 * This is a Server Action and will only execute on the server.
 */
export async function getDailyQuizAction(department: string): Promise<DailyQuiz | null> {
    try {
        const word = await getWordOfTheDayAction(department);

        if (!word) {
            console.log('No word of the day available to generate a quiz.');
            return null;
        }

        const quiz = await generateQuiz({ word: word.word, definition: word.definition });

        return { word, quiz };

    } catch (error) {
        console.error("Error in getDailyQuizAction: ", error);
        return null;
    }
}
