import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WeeklyMeals',
  description: 'Planifiez vos repas de la semaine',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
