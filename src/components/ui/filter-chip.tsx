'use client';

import { cn } from '@/lib/utils';

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const FilterChip = ({
  label,
  active = false,
  onClick,
  className,
}: FilterChipProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      'inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
      'focus-visible:outline-terracotta-400 focus-visible:outline-2 focus-visible:outline-offset-2',
      active
        ? 'bg-terracotta-500 text-white'
        : 'border-neutre-200 text-neutre-600 hover:border-neutre-300 hover:bg-neutre-50 border bg-white',
      className,
    )}
  >
    {label}
  </button>
);
