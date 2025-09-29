'use client';

import { useAuth } from "@/hooks/useAuth";
import { WordOfTheDayCard } from "@/components/dashboard/WordOfTheDayCard";

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
        <p className="text-muted-foreground">Here's your word for today. Keep up the great work!</p>
      </div>

      <WordOfTheDayCard department={user.profile.department || 'General'} />
    </div>
  );
}
