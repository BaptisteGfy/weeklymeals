import { Search } from 'lucide-react';
import { forwardRef } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const SearchInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => (
  <div className="relative">
    <Search
      size={15}
      className="text-neutre-400 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
    />
    <Input ref={ref} className={cn('pl-9', className)} {...props} />
  </div>
));

SearchInput.displayName = 'SearchInput';
