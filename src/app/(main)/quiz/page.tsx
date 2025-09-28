import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function QuizPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Daily Quiz
        </h1>
        <p className="text-muted-foreground">Test your knowledge on recent words.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Interactive quizzes are being developed.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px]">
          <BookOpen className="h-16 w-16 mb-4" />
          <p>Get ready to challenge yourself with quizzes based on your department's vocabulary!</p>
        </CardContent>
      </Card>
    </div>
  );
}
