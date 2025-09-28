import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Flame, Target, Trophy } from 'lucide-react';

export function ProgressSummaryCard() {
  // These would be dynamic values fetched from Firestore
  const streak = 5;
  const wordsLearned = 42;
  const quizAverage = 88;

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
          <span className="font-bold">{streak} days</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">Words Learned</span>
          </div>
          <span className="font-bold">{wordsLearned}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-green-500" />
            <span className="text-muted-foreground">Quiz Average</span>
          </div>
          <span className="font-bold">{quizAverage}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
