import './globals.css';

import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const lora = Lora({ subsets: ['latin'], variable: '--font-serif' });

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'WeeklyMeals',
  description: 'Planifiez vos repas de la semaine',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="fr" className={cn('font-sans', inter.variable, lora.variable)}>
      <body>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
};

export default RootLayout;
