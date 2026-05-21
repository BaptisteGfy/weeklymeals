import { cn } from '@/lib/utils';

interface DayChipProps {
  label: string;
  date?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const DayChip = ({
  label,
  date,
  active = false,
  onClick,
  className,
}: DayChipProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      'focus-visible:outline-terracotta-400 focus-visible:outline-2 focus-visible:outline-offset-2',
      'flex flex-col items-center rounded-lg px-3 py-2 transition-colors',
      active
        ? 'bg-terracotta-500 text-white'
        : 'bg-neutre-50 text-neutre-600 hover:bg-neutre-100',
      className,
    )}
  >
    <span className="text-[10px] font-medium tracking-wide uppercase">
      {label}
    </span>
    {date !== undefined && (
      <span className="font-serif text-lg leading-tight font-medium">
        {date}
      </span>
    )}
  </button>
);
