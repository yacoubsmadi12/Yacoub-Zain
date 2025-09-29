'use server';
/**
 * @fileOverview An AI agent that generates multiple, varied quiz questions for a given word.
 *
 * - generateMultipleQuizzes - Generates an array of 5 quiz questions.
 * - GenerateMultipleQuizzesInput - The input type for the flow.
 * - GenerateMultipleQuizzesOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { QuizItemSchema } from '@/types/quiz';

const GenerateMultipleQuizzesInputSchema = z.object({
  word: z.string().describe('The word to create quizzes for.'),
  definition: z.string().describe('The definition of the word.'),
});
export type GenerateMultipleQuizzesInput = z.infer<typeof GenerateMultipleQuizzesInputSchema>;

const GenerateMultipleQuizzesOutputSchema = z.object({
  quizzes: z.array(QuizItemSchema).length(5).describe("An array of 5 unique quiz questions."),
});
export type GenerateMultipleQuizzesOutput = z.infer<typeof GenerateMultipleQuizzesOutputSchema>;

export async function generateMultipleQuizzes(input: GenerateMultipleQuizzesInput): Promise<GenerateMultipleQuizzesOutput> {
  return generateMultipleQuizzesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMultipleQuizzesPrompt',
  input: {schema: GenerateMultipleQuizzesInputSchema},
  output: {schema: GenerateMultipleQuizzesOutputSchema},
  prompt: `You are an expert in educational content. Your task is to generate a set of 5 unique multiple-choice questions to test a user's understanding of a vocabulary word.

Word: "{{word}}"
Definition: "{{definition}}"

Create 5 varied questions. The questions should test different aspects of understanding:
1.  One question asking for the definition.
2.  One question asking for a synonym of the word.
3.  One question asking for an antonym of the word.
4.  Two questions that require the user to fill in the blank in a sentence.

For each question, provide four plausible options and ensure one is the correct answer. The correct answer must exactly match one of the provided options. Ensure all questions are distinct.`,
});

const generateMultipleQuizzesFlow = ai.defineFlow(
  {
    name: 'generateMultipleQuizzesFlow',
    inputSchema: GenerateMultipleQuizzesInputSchema,
    outputSchema: GenerateMultipleQuizzesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
