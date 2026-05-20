import { UtensilsCrossed } from 'lucide-react';

import { cn } from '@/lib/utils';

type LogoSize = 'sm' | 'md' | 'lg';
type LogoVariant = 'mark' | 'full';

const SIZES: Record<LogoSize, { mark: string; icon: number; text: string }> = {
  sm: { mark: 'h-7 w-7', icon: 14, text: 'text-base' },
  md: { mark: 'h-9 w-9', icon: 18, text: 'text-lg' },
  lg: { mark: 'h-12 w-12', icon: 22, text: 'text-xl' },
};

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
}

export const Logo = ({
  size = 'md',
  variant = 'full',
  className,
}: LogoProps) => {
  const s = SIZES[size];
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'bg-terracotta-500 flex items-center justify-center rounded-lg',
          s.mark,
        )}
      >
        <UtensilsCrossed size={s.icon} className="text-white" />
      </div>
      {variant === 'full' && (
        <span
          className={cn('text-neutre-800 font-serif font-semibold', s.text)}
        >
          WeeklyMeals
        </span>
      )}
    </div>
  );
};
