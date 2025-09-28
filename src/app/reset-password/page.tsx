import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { AuthCard } from '@/components/auth/AuthCard';
import Link from 'next/link';

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Reset Password"
      description="Enter your email to receive a password reset link."
      footer={
        <>
          Remember your password?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
