import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 text-primary", className)}>
      <Rocket className="h-6 w-6" />
      <span className="text-xl font-bold text-foreground">
        ZainLingo <span className="text-primary/80">Lite</span>
      </span>
    </div>
  );
}
