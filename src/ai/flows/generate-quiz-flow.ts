'use server';
/**
 * @fileOverview An AI agent that generates a multiple-choice quiz question based on a word and its definition.
 *
 * - generateQuiz - Generates a quiz question with options and the correct answer.
 * - GenerateQuizInput - The input type for the flow.
 * - GenerateQuizOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  word: z.string().describe('The word to create a quiz for.'),
  definition: z.string().describe('The definition of the word.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  question: z.string().describe('A multiple-choice question that tests the understanding of the word.'),
  options: z.array(z.string()).length(4).describe('An array of four possible answers. One must be the correct definition, and the other three should be plausible but incorrect distractors.'),
  correctAnswer: z.string().describe('The correct answer from the options array.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert in creating educational content. Your task is to generate a single multiple-choice question to test a user's understanding of a vocabulary word.

Word: "{{word}}"
Definition: "{{definition}}"

Create a question that asks for the definition of the word. Provide four options:
1. The correct definition.
2. Three plausible but incorrect definitions (distractors).

Ensure the options are distinct and the question is clear. The correct answer must exactly match one of the provided options.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
