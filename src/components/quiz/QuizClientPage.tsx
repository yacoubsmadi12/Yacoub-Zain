'use client';

import { useEffect, useState, useTransition } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getDailyQuizAction, type DailyQuiz } from '@/app/actions/get-daily-quiz-action';
import { QuizCard } from './QuizCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen } from 'lucide-react';

export function QuizClientPage() {
  const { user } = useAuth();
  const [dailyQuiz, setDailyQuiz] = useState<DailyQuiz | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (user?.profile?.department) {
      startTransition(async () => {
        try {
          const quizData = await getDailyQuizAction(user.profile.department!);
          setDailyQuiz(quizData);
        } catch (error) {
          console.error('Failed to fetch daily quiz:', error);
        }
      });
    }
  }, [user?.profile?.department]);

  if (isPending) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </CardContent>
      </Card>
    );
  }

  if (!dailyQuiz) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Not Available</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px]">
          <BookOpen className="h-16 w-16 mb-4" />
          <p>A quiz could not be generated. This might be because there is no "Word of the Day" available.</p>
        </CardContent>
      </Card>
    );
  }

  return <QuizCard dailyQuiz={dailyQuiz} />;
}
