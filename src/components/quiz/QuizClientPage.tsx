'use client';

import { useEffect, useState, useTransition } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getDailyQuizAction, type DailyQuiz } from '@/app/actions/get-daily-quiz-action';
import { QuizCard } from './QuizCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { BookOpen, Check, ThumbsUp, X } from 'lucide-react';
import { Button } from '../ui/button';
import { saveQuizResultAction } from '@/app/actions/save-quiz-result-action';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '../ui/progress';
import { QuizItem } from '@/types/quiz';
import { useProgressUpdate } from '@/context/ProgressUpdateContext';

export function QuizClientPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dailyQuiz, setDailyQuiz] = useState<DailyQuiz | null>(null);
  const [isPending, startTransition] = useTransition();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const { setProgressUpdated } = useProgressUpdate();


  useEffect(() => {
    if (user?.profile?.department) {
      startTransition(async () => {
        try {
          const quizData = await getDailyQuizAction(user.profile.department!);
          setDailyQuiz(quizData);
          if (quizData) {
            setAnswers(new Array(quizData.quizzes.quizzes.length).fill(null));
          }
        } catch (error) {
          console.error('Failed to fetch daily quiz:', error);
        }
      });
    }
  }, [user?.profile?.department]);

  const handleAnswerSelect = (selectedOption: string) => {
    if (questionSubmitted) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);
  };

  const handleSubmitQuestion = () => {
    if (answers[currentQuestionIndex] === null) {
      toast({
        title: 'No Answer Selected',
        description: 'Please choose an option before submitting.',
        variant: 'destructive',
      });
      return;
    }
    setQuestionSubmitted(true);
  }

  const handleNextQuestion = () => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (dailyQuiz && nextQuestionIndex < dailyQuiz.quizzes.quizzes.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setQuestionSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!user || !dailyQuiz) return;

    let correctAnswers = 0;
    dailyQuiz.quizzes.quizzes.forEach((quiz, index) => {
      if (answers[index] === quiz.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = (correctAnswers / dailyQuiz.quizzes.quizzes.length) * 100;
    setScore(correctAnswers);
    setIsQuizFinished(true);
    
    setIsSubmitting(true);
    try {
        await saveQuizResultAction({
            userId: user.uid,
            wordId: dailyQuiz.word.id,
            score: finalScore
        });
        setProgressUpdated(true); // Notify other components
        toast({
            title: 'Quiz Complete!',
            description: `Your score of ${finalScore.toFixed(0)}% has been saved.`,
        });
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Could not save your quiz result.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsQuizFinished(false);
    setQuestionSubmitted(false);
    if(dailyQuiz) {
        setAnswers(new Array(dailyQuiz.quizzes.quizzes.length).fill(null));
    }
  };

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dailyQuiz || !dailyQuiz.quizzes.quizzes.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Not Available</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px]">
          <BookOpen className="h-16 w-16 mb-4" />
          <p>A quiz could not be generated. This might be because there is no "Word of the Day" available.</p>
        </CardContent>
      </Card>
    );
  }

  if (isQuizFinished) {
    const totalQuestions = dailyQuiz.quizzes.quizzes.length;
    const percentage = (score / totalQuestions) * 100;
    
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Quiz Complete!</CardTitle>
          <CardDescription>Here's how you did on the quiz for "{dailyQuiz.word.word}".</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6">
            <div className="relative h-32 w-32">
                <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36">
                    <circle className="text-muted/20" strokeWidth="4" stroke="currentColor" fill="transparent" r="16" cx="18" cy="18" />
                    <circle
                        className="text-primary"
                        strokeWidth="4"
                        strokeDasharray={`${percentage}, 100`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="16"
                        cx="18"
                        cy="18"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                    {percentage.toFixed(0)}%
                </div>
            </div>
            
            <div className="text-center">
                <p className="text-lg">You answered <span className="font-bold text-primary">{score}</span> out of <span className="font-bold">{totalQuestions}</span> questions correctly.</p>
            </div>

            <div className="flex w-full justify-around pt-4">
                <div className="flex items-center gap-2">
                    <Check className="h-6 w-6 text-green-500" />
                    <span className="text-lg">{score} Correct</span>
                </div>
                <div className="flex items-center gap-2">
                    <X className="h-6 w-6 text-destructive" />
                    <span className="text-lg">{totalQuestions - score} Incorrect</span>
                </div>
            </div>

          <Button onClick={resetQuiz} disabled={isSubmitting}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuizItem = dailyQuiz.quizzes.quizzes[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / dailyQuiz.quizzes.quizzes.length) * 100;
  const isLastQuestion = currentQuestionIndex === dailyQuiz.quizzes.quizzes.length - 1;

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Quiz for: <span className="capitalize font-bold text-primary">{dailyQuiz.word.word}</span></CardTitle>
                <CardDescription>Question {currentQuestionIndex + 1} of {dailyQuiz.quizzes.quizzes.length}</CardDescription>
            </CardHeader>
            <CardContent>
                 <Progress value={progress} className="mb-6" />
                 <QuizCard 
                    quizItem={currentQuizItem} 
                    onAnswerSelect={handleAnswerSelect}
                    selectedOption={answers[currentQuestionIndex]}
                    isSubmitted={questionSubmitted}
                 />
                 <div className="flex justify-end mt-6">
                    {questionSubmitted ? (
                        <Button onClick={handleNextQuestion}>
                            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                        </Button>
                    ) : (
                        <Button onClick={handleSubmitQuestion} disabled={answers[currentQuestionIndex] === null}>
                            Submit Answer
                        </Button>
                    )}
                 </div>
            </CardContent>
        </Card>
    </div>
  );
}
