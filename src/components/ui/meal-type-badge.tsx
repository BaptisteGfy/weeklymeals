import { cn } from '@/lib/utils';

export type MealType = 'veggie' | 'main' | 'meat' | 'breakfast';

const STYLES: Record<MealType, string> = {
  veggie:    'border-l-olive-500    bg-olive-50    text-olive-800',
  main:      'border-l-terracotta-400 bg-terracotta-50 text-terracotta-800',
  meat:      'border-l-bordeaux-400  bg-bordeaux-50  text-bordeaux-800',
  breakfast: 'border-l-sable-400    bg-sable-50    text-sable-800',
};

interface MealTypeBadgeProps {
  type: MealType;
  course?: string;
  name: string;
  className?: string;
}

export const MealTypeBadge = ({
  type,
  course,
  name,
  className,
}: MealTypeBadgeProps) => (
  <div
    className={cn(
      'rounded-r-md border-l-[3px] px-2 py-1.5',
      STYLES[type],
      className,
    )}
  >
    {course && (
      <p className="text-[9px] font-semibold uppercase tracking-wider opacity-70">
        {course}
      </p>
    )}
    <p className="text-xs font-medium leading-tight">{name}</p>
  </div>
);
