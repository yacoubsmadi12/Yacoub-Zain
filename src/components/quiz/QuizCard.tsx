'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';
import { type QuizItem } from '@/types/quiz';

interface QuizCardProps {
  quizItem: QuizItem;
  onAnswerSelect: (selectedOption: string) => void;
  selectedOption: string | null;
  isSubmitted: boolean;
}

export function QuizCard({ quizItem, onAnswerSelect, selectedOption, isSubmitted }: QuizCardProps) {
  const { question, options, correctAnswer } = quizItem;

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    onAnswerSelect(option);
  };

  const getButtonClass = (option: string) => {
    if (!isSubmitted) {
      return selectedOption === option ? 'border-primary ring-2 ring-primary' : '';
    }
    if (option === correctAnswer) {
      return 'bg-green-100 border-green-500 text-green-800 hover:bg-green-200 ring-2 ring-green-500 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/60';
    }
    if (option === selectedOption && option !== correctAnswer) {
      return 'bg-red-100 border-red-500 text-red-800 hover:bg-red-200 ring-2 ring-red-500 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/60';
    }
    return 'border-muted text-muted-foreground';
  };

  const getIcon = (option: string) => {
    if (!isSubmitted) return null;
    if (option === correctAnswer) {
      return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
    }
    if (option === selectedOption && option !== correctAnswer) {
      return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quiz Question</CardTitle>
        <CardDescription>{question}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={cn(
                'h-auto w-full justify-start text-left whitespace-normal py-4 text-base relative',
                getButtonClass(option)
              )}
              onClick={() => handleOptionSelect(option)}
              disabled={isSubmitted}
            >
              <span className="flex-1 pr-8">{option}</span>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {getIcon(option)}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
