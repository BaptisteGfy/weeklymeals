'use client';

import { Menu } from 'lucide-react';
import { useState } from 'react';

import { Sidebar } from './Sidebar';

type DashboardShellProps = {
  children: React.ReactNode;
  user: { name: string; email: string; role: string };
};

export const DashboardShell = ({ children, user }: DashboardShellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />
      <main className="flex-1 overflow-y-auto p-6">
        <button className="lg:hidden" onClick={() => setIsOpen(true)} aria-label="Ouvrir le menu">
          <Menu className="h-6 w-6" />
        </button>
        {children}
      </main>
    </div>
  );
};
