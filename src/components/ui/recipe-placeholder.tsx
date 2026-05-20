import { UtensilsCrossed } from 'lucide-react';

import { cn } from '@/lib/utils';

interface RecipePlaceholderProps {
  className?: string;
  iconSize?: number;
}

export const RecipePlaceholder = ({
  className,
  iconSize = 32,
}: RecipePlaceholderProps) => (
  <div
    className={cn('bg-sable-100 flex items-center justify-center', className)}
    style={{
      backgroundImage: `repeating-linear-gradient(
        135deg,
        var(--sable-200) 0px,  var(--sable-200) 16px,
        var(--sable-100) 16px, var(--sable-100) 32px
      )`,
    }}
  >
    <UtensilsCrossed size={iconSize} className="text-terracotta-600" />
  </div>
);
