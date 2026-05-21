import { type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type StatCardVariant = 'default' | 'terracotta' | 'olive';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  icon?: LucideIcon;
  variant?: StatCardVariant;
  className?: string;
}

const variantStyles: Record<
  StatCardVariant,
  { card: string; label: string; value: string; delta: string; icon: string }
> = {
  default: {
    card: 'border-neutre-100 bg-white border',
    label: 'text-neutre-500',
    value: 'text-neutre-800',
    delta: 'text-neutre-400',
    icon: 'text-terracotta-500',
  },
  terracotta: {
    card: 'bg-terracotta-600 border-transparent',
    label: 'text-terracotta-200',
    value: 'text-white',
    delta: 'text-terracotta-200',
    icon: 'text-terracotta-300',
  },
  olive: {
    card: 'bg-olive-700 border-transparent',
    label: 'text-olive-300',
    value: 'text-white',
    delta: 'text-olive-300',
    icon: 'text-olive-400',
  },
};

export const StatCard = ({
  label,
  value,
  delta,
  icon: Icon,
  variant = 'default',
  className,
}: StatCardProps) => {
  const s = variantStyles[variant];

  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-xl border px-5 py-4',
        s.card,
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={13} className={cn(s.icon)} strokeWidth={2} />}
        <p
          className={cn(
            'text-xs font-medium tracking-widest uppercase',
            s.label,
          )}
        >
          {label}
        </p>
      </div>
      <p
        className={cn(
          'font-serif text-[30px] leading-none font-semibold',
          s.value,
        )}
      >
        {value}
      </p>
      {delta && <p className={cn('text-xs', s.delta)}>{delta}</p>}
    </div>
  );
};
