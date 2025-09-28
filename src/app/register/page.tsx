import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthCard } from '@/components/auth/AuthCard';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create an Account"
      description="Start your journey with ZainLingo Lite today."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
