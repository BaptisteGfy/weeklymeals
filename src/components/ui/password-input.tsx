'use client';

import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function PasswordInput({ className, ...props }: React.ComponentProps<'input'>) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? 'text' : 'password'}
        className={className}
        {...props}
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={() => setVisible((v) => !v)}
        className="text-neutre-400 hover:text-neutre-700 absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
        tabIndex={-1}
        aria-label={
          visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
        }
      >
        {visible ? <EyeOff size={15} /> : <Eye size={15} />}
      </Button>
    </div>
  );
}

export { PasswordInput };
