import { config } from 'dotenv';
config();

import '@/ai/flows/define-word-with-gemini.ts';
import '@/ai/flows/provide-definition-for-admin-word-management.ts';
import '@/ai/flows/generate-word-of-the-day-flow.ts';
import '@/ai/flows/generate-quiz-flow.ts';
