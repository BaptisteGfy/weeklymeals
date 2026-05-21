import Link from 'next/link';

import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export const SectionHeader = ({
  title,
  href,
  linkLabel = 'Tout voir',
  className,
}: SectionHeaderProps) => (
  <div className={cn('flex items-baseline justify-between', className)}>
    <h2 className="text-neutre-800 font-serif text-lg font-semibold">
      {title}
    </h2>
    {href && (
      <Link
        href={href}
        className="text-terracotta-600 hover:text-terracotta-700 text-xs font-medium transition-colors"
      >
        {linkLabel} →
      </Link>
    )}
  </div>
);
