import Link from 'next/link';

import { type MealType, MealTypeBadge } from '@/components/ui/meal-type-badge';
import { cn } from '@/lib/utils';

interface MealSlotProps {
  type: MealType;
  course?: string;
  recipeName: string;
  href: string;
  portions?: number;
  className?: string;
}

export const MealSlot = ({
  type,
  course,
  recipeName,
  href,
  portions,
  className,
}: MealSlotProps) => (
  <Link href={href} className={cn('group block', className)}>
    <MealTypeBadge
      type={type}
      course={course}
      name={recipeName}
      className="transition-opacity group-hover:opacity-80"
    />
    {portions && (
      <p className="text-neutre-400 mt-0.5 pl-3 text-[10px]">
        {portions} pers.
      </p>
    )}
  </Link>
);
