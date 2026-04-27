import './globals.css';

import type { Metadata } from 'next';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'WeeklyMeals',
  description: 'Planifiez vos repas de la semaine',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="fr">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
