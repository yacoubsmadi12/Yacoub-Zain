'use server';

/**
 * @fileOverview An AI agent that defines a word using the Gemini API and provides usage examples.
 *
 * - defineWordWithGemini - A function that defines a given word and returns its definition and usage examples.
 * - DefineWordWithGeminiInput - The input type for the defineWordWithGemini function.
 * - DefineWordWithGeminiOutput - The return type for the defineWordWithGemini function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DefineWordWithGeminiInputSchema = z.object({
  word: z.string().describe('The word to define.'),
});
export type DefineWordWithGeminiInput = z.infer<typeof DefineWordWithGeminiInputSchema>;

const DefineWordWithGeminiOutputSchema = z.object({
  definition: z.string().describe('The definition of the word.'),
  examples: z.array(z.string()).describe('Usage examples of the word.'),
});
export type DefineWordWithGeminiOutput = z.infer<typeof DefineWordWithGeminiOutputSchema>;

export async function defineWordWithGemini(input: DefineWordWithGeminiInput): Promise<DefineWordWithGeminiOutput> {
  return defineWordWithGeminiFlow(input);
}

const defineWordWithGeminiPrompt = ai.definePrompt({
  name: 'defineWordWithGeminiPrompt',
  input: {schema: DefineWordWithGeminiInputSchema},
  output: {schema: DefineWordWithGeminiOutputSchema},
  prompt: `You are an expert lexicographer. Provide a concise definition and three usage examples for the word: {{{word}}}.\n\nDefinition:\n{{definition}}\n\nExamples:\n{{#each examples}}- {{this}}\n{{/each}}`,
});

const defineWordWithGeminiFlow = ai.defineFlow(
  {
    name: 'defineWordWithGeminiFlow',
    inputSchema: DefineWordWithGeminiInputSchema,
    outputSchema: DefineWordWithGeminiOutputSchema,
  },
  async input => {
    const {output} = await defineWordWithGeminiPrompt(input);
    return output!;
  }
);
