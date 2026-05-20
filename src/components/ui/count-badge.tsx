import { cn } from '@/lib/utils';

interface CountBadgeProps {
  count: number;
  max?: number;
  className?: string;
}

export const CountBadge = ({ count, max = 99, className }: CountBadgeProps) => {
  const display = count > max ? `${max}+` : String(count);
  return (
    <span
      className={cn(
        'bg-terracotta-500 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] leading-none font-semibold text-white',
        className,
      )}
    >
      {display}
    </span>
  );
};
