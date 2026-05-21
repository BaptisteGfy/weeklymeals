import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) => (
  <div className={cn('flex items-start justify-between gap-4', className)}>
    <div className="flex flex-col gap-1">
      {eyebrow && (
        <p className="text-neutre-400 text-xs font-medium tracking-widest uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="text-neutre-800 font-serif text-3xl font-semibold">
        {title}
      </h1>
      {description && (
        <p className="text-neutre-500 mt-1 text-sm">{description}</p>
      )}
    </div>

    {actions && (
      <div className="flex shrink-0 items-center gap-2">{actions}</div>
    )}
  </div>
);
