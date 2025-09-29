'use client';

import { useEffect, useState, useTransition } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserProgressAction } from '@/app/actions/get-user-progress-action';
import type { QuizResult, Achievement } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Flame, Target, Trophy, TrendingUp } from "lucide-react";
import { Skeleton } from '../ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { AchievementsCard } from './AchievementsCard';

interface ProgressData {
    wordsLearned: number;
    quizAverage: number;
    streak: number;
    quizResults: Omit<QuizResult, 'id'>[];
    achievements: Achievement[];
}

export function ProgressClientPage() {
    const { user } = useAuth();
    const [progress, setProgress] = useState<ProgressData | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (user?.uid) {
            startTransition(async () => {
                const data = await getUserProgressAction(user.uid);
                if (data) {
                    setProgress(data as ProgressData);
                } else {
                    // Handle case where no data is returned (e.g., new user)
                    setProgress({
                        wordsLearned: 0,
                        quizAverage: 0,
                        streak: 0,
                        quizResults: [],
                        achievements: []
                    });
                }
            });
        }
    }, [user]);

    const chartData = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), i);
        const dateString = date.toISOString().split('T')[0];
        
        const resultsOnDay = progress?.quizResults.filter(r => r.date === dateString) || [];
        const averageScore = resultsOnDay.length > 0 
            ? resultsOnDay.reduce((acc, r) => acc + r.score, 0) / resultsOnDay.length
            : 0;
            
        return {
            date: format(date, 'MMM d'),
            score: averageScore,
        };
    }).reverse();


    if (isPending || progress === null) {
        return (
            <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
                <Skeleton className="h-80" />
                <Skeleton className="h-48" />
            </div>
        );
    }
    
    if (!progress || progress.quizResults.length === 0) {
        return (
            <Card>
                <CardHeader>
                <CardTitle>Start Learning to See Your Progress</CardTitle>
                <CardDescription>Your progress will appear here once you complete a quiz.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px]">
                    <BarChart className="h-16 w-16 mb-4" />
                    <p>Complete your first daily quiz to start tracking your learning journey!</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                        <Flame className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{progress.streak} days</div>
                        <p className="text-xs text-muted-foreground">Keep it up!</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Words Learned</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{progress.wordsLearned}</div>
                        <p className="text-xs text-muted-foreground">Total unique words from quizzes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quiz Average</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{progress.quizAverage.toFixed(0)}%</div>
                         <p className="text-xs text-muted-foreground">Across all completed quizzes</p>
                    </CardContent>
                </Card>
            </div>

            <AchievementsCard achievements={progress.achievements} />
            
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Recent Performance
                    </CardTitle>
                    <CardDescription>
                        Your average quiz scores over the last 7 days.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={chartData}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                                <YAxis unit="%" tickLine={false} axisLine={false} domain={[0, 100]} />
                                <ChartTooltip 
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dot" />}
                                />
                                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
