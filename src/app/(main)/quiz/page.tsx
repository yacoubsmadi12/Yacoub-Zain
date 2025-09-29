import { QuizClientPage } from "@/components/quiz/QuizClientPage";

export default function QuizPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Daily Quiz
        </h1>
        <p className="text-muted-foreground">Test your knowledge on recent words.</p>
      </div>
      <QuizClientPage />
    </div>
  );
}
