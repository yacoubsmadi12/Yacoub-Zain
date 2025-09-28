'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Rocket } from 'lucide-react';
import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import { FeaturedDepartments } from '@/components/landing/FeaturedDepartments';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading ZainLingo Lite...</p>
      </div>
    );
  }

  // If user is not logged in, show the landing page.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="container mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2 py-12">
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-3">
            <Rocket className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight font-headline">
              ZainLingo <span className="text-primary/80">Lite</span>
            </h1>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Your departmental vocabulary companion.</h2>
          <p className="text-lg text-muted-foreground">
            ZainLingo Lite is designed to enhance communication across departments. By providing daily, department-specific vocabulary, we aim to break down jargon barriers and foster a more collaborative environment.
          </p>
          <div className="text-center md:text-left">
            <Link href="/about" className="font-semibold text-primary hover:underline">
              Learn more about how it works &rarr;
            </Link>
          </div>
        </div>
        <div>
          <AuthCard
            title="Welcome"
            description="Sign in to continue your learning journey."
            footer={
              <>
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                  Sign up
                </Link>
              </>
            }
          >
            <LoginForm />
          </AuthCard>
        </div>
      </div>
      <FeaturedDepartments />
    </div>
  );
}
