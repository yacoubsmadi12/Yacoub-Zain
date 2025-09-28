import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Your Progress
        </h1>
        <p className="text-muted-foreground">Visualize your learning journey and track your improvements.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Detailed progress charts are on the way.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px]">
          <BarChart className="h-16 w-16 mb-4" />
          <p>This section will feature graphs for your streaks, quiz performance, and words learned over time.</p>
        </CardContent>
      </Card>
    </div>
  );
}
