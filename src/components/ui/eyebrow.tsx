import { cn } from '@/lib/utils';

type EyebrowColor = 'terracotta' | 'olive' | 'neutre';

const COLOR_MAP: Record<EyebrowColor, string> = {
  terracotta: 'text-terracotta-500',
  olive: 'text-olive-600',
  neutre: 'text-neutre-400',
};

interface EyebrowProps {
  children: React.ReactNode;
  color?: EyebrowColor;
  className?: string;
}

export const Eyebrow = ({
  children,
  color = 'terracotta',
  className,
}: EyebrowProps) => (
  <p
    className={cn(
      'text-xs font-medium tracking-widest uppercase',
      COLOR_MAP[color],
      className,
    )}
  >
    {children}
  </p>
);
