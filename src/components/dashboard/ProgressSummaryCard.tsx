'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Flame, Target, Trophy } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { getUserProgressAction } from '@/app/actions/get-user-progress-action';
import { Skeleton } from '../ui/skeleton';

interface ProgressSummaryCardProps {
    userId: string;
}

export function ProgressSummaryCard({ userId }: ProgressSummaryCardProps) {
  const [progress, setProgress] = useState<{streak: number, wordsLearned: number, quizAverage: number} | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (userId) {
        startTransition(async () => {
            const data = await getUserProgressAction(userId);
            if(data) {
                setProgress(data);
            } else {
                setProgress({ streak: 0, wordsLearned: 0, quizAverage: 0 });
            }
        });
    }
  }, [userId]);

  if (isPending || progress === null) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Progress Summary</CardTitle>
                <CardDescription>Your learning at a glance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-10" />
                </div>
                 <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-10" />
                </div>
                 <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-10" />
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Summary</CardTitle>
        <CardDescription>Your learning at a glance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-accent" />
            <span className="text-muted-foreground">Current Streak</span>
          </div>
          <span className="font-bold">{progress.streak} days</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">Words Learned</span>
          </div>
          <span className="font-bold">{progress.wordsLearned}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-green-500" />
            <span className="text-muted-foreground">Quiz Average</span>
          </div>
          <span className="font-bold">{progress.quizAverage.toFixed(0)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
