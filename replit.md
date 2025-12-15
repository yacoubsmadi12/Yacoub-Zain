# ZainLingo Lite

A departmental vocabulary learning application built with Next.js, Firebase, and Genkit AI.

## Overview

ZainLingo Lite is designed to enhance communication across departments by providing daily, department-specific vocabulary. The application helps users learn jargon and terminology from different departments through quizzes, word-of-the-day features, and progress tracking.

## Tech Stack

- **Framework**: Next.js 15.3.3 with Turbopack
- **Language**: TypeScript
- **UI**: React 18, Tailwind CSS, Radix UI components
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **AI Integration**: Genkit with Google AI

## Project Structure

```
src/
├── ai/              # Genkit AI flows for word definitions, quizzes
├── app/             # Next.js App Router pages
│   ├── (admin)/     # Admin dashboard pages
│   ├── (main)/      # Main user pages (dashboard, quiz, progress)
│   ├── actions/     # Server actions for data fetching
│   └── login/       # Authentication pages
├── components/      # React components
│   ├── admin/       # Admin-specific components
│   ├── auth/        # Authentication forms
│   ├── dashboard/   # Dashboard widgets
│   ├── quiz/        # Quiz components
│   └── ui/          # Reusable UI components (shadcn/ui)
├── context/         # React contexts (Auth, Progress)
├── hooks/           # Custom React hooks
├── lib/             # Utilities and Firebase config
└── types/           # TypeScript type definitions
```

## Environment Variables Required

The application requires the following Firebase environment variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

For Genkit AI features:
- `GOOGLE_GENAI_API_KEY`

## Development

The development server runs on port 5000 with Turbopack for fast refresh:

```bash
npm run dev
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run genkit:dev` - Run Genkit AI development server
