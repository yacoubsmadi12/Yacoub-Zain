import { LoginForm } from '@/components/auth/LoginForm';
import { AuthCard } from '@/components/auth/AuthCard';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome Back"
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
      <div className="space-y-4">
        <LoginForm />
      </div>
    </AuthCard>
  );
}
