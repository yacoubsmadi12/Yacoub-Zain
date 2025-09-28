'use server';
/**
 * @fileOverview This flow provides word definitions using the Gemini API for admin word management.
 *
 * - getWordDefinition - A function that generates a word definition including usage examples.
 * - GetWordDefinitionInput - The input type for the getWordDefinition function.
 * - GetWordDefinitionOutput - The return type for the getWordDefinition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetWordDefinitionInputSchema = z.object({
  word: z.string().describe('The word to define.'),
});
export type GetWordDefinitionInput = z.infer<typeof GetWordDefinitionInputSchema>;

const GetWordDefinitionOutputSchema = z.object({
  definition: z.string().describe('The definition of the word, including usage examples.'),
});
export type GetWordDefinitionOutput = z.infer<typeof GetWordDefinitionOutputSchema>;

export async function getWordDefinition(input: GetWordDefinitionInput): Promise<GetWordDefinitionOutput> {
  return getWordDefinitionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getWordDefinitionPrompt',
  input: {schema: GetWordDefinitionInputSchema},
  output: {schema: GetWordDefinitionOutputSchema},
  prompt: `Provide a comprehensive definition for the word "{{word}}", including several usage examples.`,
});

const getWordDefinitionFlow = ai.defineFlow(
  {
    name: 'getWordDefinitionFlow',
    inputSchema: GetWordDefinitionInputSchema,
    outputSchema: GetWordDefinitionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      definition: output!.definition,
    };
  }
);
