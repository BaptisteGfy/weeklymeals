'use client';

import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StepperProps {
  value?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export const Stepper = ({
  value: initial = 1,
  min = 1,
  max = 99,
  onChange,
  className,
}: StepperProps) => {
  const [value, setValue] = useState(initial);

  const update = (next: number) => {
    if (next < min || next > max) return;
    setValue(next);
    onChange?.(next);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8"
        onClick={() => update(value - 1)}
        disabled={value <= min}
      >
        <Minus size={14} />
      </Button>
      <span className="text-neutre-800 w-8 text-center font-mono text-sm font-medium">
        {value}
      </span>
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8"
        onClick={() => update(value + 1)}
        disabled={value >= max}
      >
        <Plus size={14} />
      </Button>
    </div>
  );
};
