'use client';

import { useState } from 'react';
import type { DailyQuiz } from '@/app/actions/get-daily-quiz-action';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type QuizItem } from '@/ai/flows/generate-multiple-quizzes-flow';

interface QuizCardProps {
  quizItem: QuizItem;
  onAnswer: (isCorrect: boolean) => void;
}

export function QuizCard({ quizItem, onAnswer }: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { toast } = useToast();

  const { question, options, correctAnswer } = quizItem;

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      toast({
        title: 'No Answer Selected',
        description: 'Please choose an option before submitting.',
        variant: 'destructive',
      });
      return;
    }
    setIsAnswered(true);
    onAnswer(selectedOption === correctAnswer);
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
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
    if (!isAnswered) return null;
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
                'h-auto w-full justify-start text-left whitespace-normal py-4 text-base',
                getButtonClass(option)
              )}
              onClick={() => handleOptionSelect(option)}
              disabled={isAnswered}
            >
              <div className="flex items-center w-full">
                <span className="flex-1">{option}</span>
                {getIcon(option)}
              </div>
            </Button>
          ))}
        </div>
        {!isAnswered && (
             <div className="flex justify-end gap-2">
                <Button onClick={handleSubmit}>Submit Answer</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
