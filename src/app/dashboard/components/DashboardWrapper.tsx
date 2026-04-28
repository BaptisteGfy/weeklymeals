'use client';

import { useState } from 'react';

import { Sidebar } from './Sidebar';

export const DashboardWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <main className="flex-1 overflow-y-auto p-6">
        <button className="lg:hidden" onClick={() => setIsOpen(true)}>
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        {children}
      </main>
    </div>
  );
};
