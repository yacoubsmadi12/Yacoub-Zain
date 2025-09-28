'use client';

import { useAuth } from "@/hooks/useAuth";
import { WordOfTheDayCard } from "@/components/dashboard/WordOfTheDayCard";
import { ProgressSummaryCard } from "@/components/dashboard/ProgressSummaryCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user } = useAuth();
  
  if (!user?.profile) {
    return <div>Loading user profile...</div>;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {getGreeting()}, {user.profile.name || 'User'}!
        </h1>
        <p className="text-muted-foreground">Here's what's new for you today.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <WordOfTheDayCard department={user.profile.department || 'General'} />
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Department</CardTitle>
                </CardHeader>
                <CardContent>
                    <Badge variant="secondary" className="text-lg py-2 px-4">{user.profile.department || 'Not set'}</Badge>
                </CardContent>
            </Card>
            <ProgressSummaryCard />
        </div>
      </div>
    </div>
  );
}
