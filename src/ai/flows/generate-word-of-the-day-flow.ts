'use server';
/**
 * @fileOverview An AI agent that generates a word of the day for a specific department.
 *
 * - generateWordOfTheDay - Generates a word, definition, examples, and pronunciation.
 * - GenerateWordOfTheDayInput - The input type for the flow.
 * - GenerateWordOfTheDayOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWordOfTheDayInputSchema = z.object({
  department: z.string().describe('The department for which to generate a word. e.g., "Finance", "Engineering".'),
});
export type GenerateWordOfTheDayInput = z.infer<typeof GenerateWordOfTheDayInputSchema>;

const GenerateWordOfTheDayOutputSchema = z.object({
  word: z.string().describe('A single, relevant vocabulary word for the specified department.'),
  definition: z.string().describe('A concise definition of the word.'),
  examples: z.array(z.string()).describe('Two or three practical examples of how the word is used in a sentence within the context of the department.'),
  pronunciation: z.string().describe('A simple phonetic transcription of the word. e.g., "sin-er-jee".'),
});
export type GenerateWordOfTheDayOutput = z.infer<typeof GenerateWordOfTheDayOutputSchema>;

export async function generateWordOfTheDay(input: GenerateWordOfTheDayInput): Promise<GenerateWordOfTheDayOutput> {
  return generateWordOfTheDayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWordOfTheDayPrompt',
  input: {schema: GenerateWordOfTheDayInputSchema},
  output: {schema: GenerateWordOfTheDayOutputSchema},
  prompt: `You are an expert lexicographer creating "Word of the Day" content for a corporate learning app.
  
  Your task is to generate a single, relevant vocabulary word for an employee in the "{{department}}" department.
  
  The word should be moderately complex but useful in a professional context. Avoid overly simple or extremely obscure terms.
  
  Provide the word, a concise definition, a simple phonetic pronunciation, and two or three clear examples of its use in a sentence relevant to the {{department}} department.`,
});

const generateWordOfTheDayFlow = ai.defineFlow(
  {
    name: 'generateWordOfTheDayFlow',
    inputSchema: GenerateWordOfTheDayInputSchema,
    outputSchema: GenerateWordOfTheDayOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
