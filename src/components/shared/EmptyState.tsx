import { type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actions,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center gap-6 py-16 text-center',
      className,
    )}
  >
    <div
      className="flex h-24 w-24 items-center justify-center rounded-full"
      style={{
        backgroundImage: `repeating-linear-gradient(
          135deg,
          var(--sable-200) 0px,  var(--sable-200) 16px,
          var(--sable-100) 16px, var(--sable-100) 32px
        )`,
      }}
    >
      <Icon size={36} className="text-terracotta-600" strokeWidth={1.5} />
    </div>

    <div className="flex max-w-sm flex-col items-center gap-2">
      <h3 className="font-serif text-xl text-neutre-800">{title}</h3>
      {description && (
        <p className="text-sm text-neutre-500">{description}</p>
      )}
    </div>

    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
);
