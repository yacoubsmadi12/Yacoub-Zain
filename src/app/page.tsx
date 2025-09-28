'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Rocket } from 'lucide-react';
import { FeaturedDepartments } from '@/components/landing/FeaturedDepartments';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';

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
          <Card className="w-full max-w-sm mx-auto">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <Logo />
              </div>
              <CardTitle className="font-headline text-2xl">Welcome</CardTitle>
              <CardDescription>Sign in or create an account to start your journey.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin" className="pt-4">
                  <LoginForm />
                </TabsContent>
                <TabsContent value="signup" className="pt-4">
                  <RegisterForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <FeaturedDepartments />
    </div>
  );
}
