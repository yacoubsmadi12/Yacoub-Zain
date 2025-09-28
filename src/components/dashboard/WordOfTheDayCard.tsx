'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getWordOfTheDayAction } from '@/app/actions/get-word-of-the-day-action';
import type { Word } from '@/types';
import { Volume2 } from 'lucide-react';
import { Button } from '../ui/button';

interface WordOfTheDayCardProps {
  department: string;
}

export function WordOfTheDayCard({ department }: WordOfTheDayCardProps) {
  const [word, setWord] = useState<Word | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const wordOfTheDay = await getWordOfTheDayAction(department);
        setWord(wordOfTheDay);
      } catch (error) {
        console.error('Error fetching word of the day:', error);
      }
    });
  }, [department]);
  
  const handlePronounce = () => {
    if (word && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      speechSynthesis.speak(utterance);
    }
  };

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!word) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Word of the Day</CardTitle>
          <CardDescription>for the {department} department</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No word available for today. Please check back later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Word of the Day</CardTitle>
        <CardDescription>Specially selected for the {department} department.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-bold font-headline capitalize">{word.word}</h2>
            <Button variant="ghost" size="icon" onClick={handlePronounce}>
                <Volume2 className="h-6 w-6" />
                <span className="sr-only">Pronounce word</span>
            </Button>
          </div>
          {word.pronunciation && <p className="text-muted-foreground">{word.pronunciation}</p>}
        </div>
        
        <p className="text-lg leading-relaxed">{word.definition}</p>
        
        <div>
          <h3 className="font-semibold mb-2">Usage Examples:</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            {word.examples.map((example, index) => (
              <li key={index}>"{example}"</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
