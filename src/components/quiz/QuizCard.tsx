'use client';

import { useState } from 'react';
import type { DailyQuiz } from '@/app/actions/get-daily-quiz-action';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizCardProps {
  dailyQuiz: DailyQuiz;
}

export function QuizCard({ dailyQuiz }: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { toast } = useToast();

  const { word, quiz } = dailyQuiz;
  const { question, options, correctAnswer } = quiz;

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
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsAnswered(false);
  }

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return selectedOption === option ? 'border-primary ring-2 ring-primary' : '';
    }
    if (option === correctAnswer) {
      return 'bg-green-100 border-green-500 text-green-800 hover:bg-green-200 ring-2 ring-green-500';
    }
    if (option === selectedOption && option !== correctAnswer) {
      return 'bg-red-100 border-red-500 text-red-800 hover:bg-red-200 ring-2 ring-red-500';
    }
    return 'border-muted text-muted-foreground';
  };

  const getIcon = (option: string) => {
    if (!isAnswered) return null;
    if (option === correctAnswer) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (option === selectedOption && option !== correctAnswer) {
      return <XCircle className="h-5 w-5 text-red-600" />;
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz for: <span className="capitalize font-bold text-primary">{word.word}</span></CardTitle>
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
        <div className="flex justify-end gap-2">
            {isAnswered ? (
                <Button onClick={handleReset}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            ) : (
                <Button onClick={handleSubmit}>Submit Answer</Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
