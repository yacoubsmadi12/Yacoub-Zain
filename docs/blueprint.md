# **App Name**: ZainLingo Lite

## Core Features:

- Department-Specific Word Display: Displays a 'Word of the Day' tailored to the user's department upon login, fetched daily. Focus on a simplified view for MVP, excluding synonyms and antonyms initially.
- Basic Quiz Generation: Generates a quiz using words from the current and previous days, focusing on definition matching or fill-in-the-blank. No AI for quiz question generation in MVP.
- Progress Tracking: Tracks user progress (words seen, quizzes taken, average score). Focus on basic metrics.
- AI-Powered Definition Tool: Uses the Gemini API as a tool to provide word definitions, including usage examples.
- Admin Word Management: Allows admins to add new words and definitions, with basic logging of admin actions (word additions/deletions) for auditing purposes.
- Department Authentication: Restricts Google SSO and content access to zain.com domains and allows user-defined department selection. The MVP includes simplified profile settings focused on department. Password reset using Firebase Auth is also part of the authentication flow.
- Archive Browser: Presents a streamlined archive to display past words sorted by date.

## Style Guidelines:

- Primary color: Strong blue (#2962FF) for corporate trust.
- Background color: Light gray (#F0F4F9) to provide a professional, clean backdrop, ensuring legibility.
- Accent color: Orange (#FF9800) used to highlight interactive elements.
- Body and headline font: 'PT Sans' (sans-serif) for its readability and modern appeal, appropriate for both headers and body text.
- Use a consistent set of simple, outline-style icons from a library like FontAwesome or Material Icons.
- Maintain a clean, card-based layout. Use clear spacing to separate elements, enhancing the focus on individual content chunks.
- Incorporate subtle transitions and animations to enhance user interaction, such as word display transitions or quiz feedback.