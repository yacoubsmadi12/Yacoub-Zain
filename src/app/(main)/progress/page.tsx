import { ProgressClientPage } from "@/components/progress/ProgressClientPage";

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Your Progress
        </h1>
        <p className="text-muted-foreground">Visualize your learning journey and track your improvements.</p>
      </div>
      <ProgressClientPage />
    </div>
  );
}
