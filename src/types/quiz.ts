import { z } from 'zod';

export const QuizItemSchema = z.object({
    question: z.string().describe("A unique question about the word. Questions should be varied, asking about the definition, a synonym, an antonym, or asking to complete a sentence."),
    options: z.array(z.string()).length(4).describe("An array of four plausible answers."),
    correctAnswer: z.string().describe("The correct answer from the options array."),
});
export type QuizItem = z.infer<typeof QuizItemSchema>;
