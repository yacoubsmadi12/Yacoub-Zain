'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getWordOfTheDayAction } from '@/app/actions/get-word-of-the-day-action';
import type { Word } from '@/types';
import { Volume2, Clock } from 'lucide-react';
import { Button } from '../ui/button';

interface WordOfTheDayCardProps {
  department: string;
}

export function WordOfTheDayCard({ department }: WordOfTheDayCardProps) {
  const [word, setWord] = useState<Word | null>(null);
  const [isPending, startTransition] = useTransition();
  const [expiryTime, setExpiryTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    startTransition(async () => {
      try {
        const wordOfTheDay = await getWordOfTheDayAction(department);
        setWord(wordOfTheDay);
        if (wordOfTheDay) {
          // Set expiry time to 24 hours from now
          const now = new Date();
          setExpiryTime(now.getTime() + 24 * 60 * 60 * 1000);
        }
      } catch (error) {
        console.error('Error fetching word of the day:', error);
      }
    });
  }, [department]);

  useEffect(() => {
    if (!expiryTime) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const difference = expiryTime - now;

      if (difference <= 0) {
        return '00:00:00';
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    // Set initial value
    setTimeRemaining(calculateTimeRemaining());

    return () => clearInterval(intervalId);
  }, [expiryTime]);

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
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Word of the Day</CardTitle>
        <CardDescription>Specially selected for the {department} department.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-grow">
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
       <CardFooter className="border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>New word in: {timeRemaining}</span>
          </div>
        </CardFooter>
    </Card>
  );
}
