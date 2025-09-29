import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, Flame, Star, Target } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/types";

interface AchievementsCardProps {
    achievements: Achievement[];
}

const achievementIcons: { [key: string]: React.ReactNode } = {
    'streak_3': <Flame className="h-8 w-8" />,
    'streak_7': <Flame className="h-8 w-8 text-accent" />,
    'words_10': <Target className="h-8 w-8" />,
    'words_25': <Target className="h-8 w-8 text-accent" />,
    'quiz_perfect': <Star className="h-8 w-8 text-yellow-400" />,
    'first_word': <Award className="h-8 w-8" />
};

export function AchievementsCard({ achievements }: AchievementsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>Badges you've earned on your learning journey.</CardDescription>
            </CardHeader>
            <CardContent>
                {achievements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[150px]">
                        <Award className="h-12 w-12 mb-4" />
                        <p>Your achievements will appear here as you learn.</p>
                    </div>
                ) : (
                    <TooltipProvider>
                        <div className="flex flex-wrap gap-4">
                            {achievements.map((ach) => (
                                <Tooltip key={ach.id}>
                                    <TooltipTrigger>
                                        <div className={cn(
                                            "flex flex-col items-center justify-center h-24 w-24 rounded-lg p-4 transition-transform hover:scale-110",
                                            ach.unlocked ? "bg-secondary border-2 border-accent" : "bg-muted/50 grayscale opacity-50"
                                        )}>
                                            <div className={cn(ach.unlocked ? "text-primary" : "text-muted-foreground")}>
                                                {achievementIcons[ach.id]}
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-bold">{ach.name}</p>
                                        <p className="text-sm text-muted-foreground">{ach.description}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    </TooltipProvider>
                )}
            </CardContent>
        </Card>
    )
}
