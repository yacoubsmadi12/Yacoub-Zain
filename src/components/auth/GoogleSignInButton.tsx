'use client';

import { Button } from '@/components/ui/button';

type GoogleSignInButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M20.94 11.05A8.5 8.5 0 0 0 12 3.5c-4.69 0-8.5 3.81-8.5 8.5s3.81 8.5 8.5 8.5c2.31 0 4.4-0.92 5.94-2.44" />
        <path d="M22 12h-6" />
        <path d="M12 12V6" />
        <path d="m15.5 15.5-3-3" />
        <path d="m6 18 1.5-1.5" />
    </svg>
)


export function GoogleSignInButton({ onClick, disabled }: GoogleSignInButtonProps) {
  return (
    <Button variant="outline" className="w-full" onClick={onClick} disabled={disabled}>
      <GoogleIcon />
      Continue with Google
    </Button>
  );
}
