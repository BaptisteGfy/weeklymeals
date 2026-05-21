import { cn } from '@/lib/utils';

interface ShoppingCategoryHeaderProps {
  emoji: string;
  label: string;
  checked: number;
  total: number;
  className?: string;
}

export const ShoppingCategoryHeader = ({
  emoji,
  label,
  checked,
  total,
  className,
}: ShoppingCategoryHeaderProps) => (
  <div className={cn('flex items-center justify-between py-1', className)}>
    <div className="flex items-center gap-2">
      <span className="text-base">{emoji}</span>
      <h3 className="text-neutre-800 font-serif text-sm font-semibold">
        {label}
      </h3>
    </div>
    <span className="text-neutre-400 text-xs">
      {checked}/{total} cochés
    </span>
  </div>
);
