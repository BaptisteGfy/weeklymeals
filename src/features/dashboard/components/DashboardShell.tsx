'use client';

import { useState } from 'react';

import { GlobalSearch } from './GlobalSearch';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

type DashboardShellProps = {
  children: React.ReactNode;
  user: { name: string; email: string; role: string };
};

export const DashboardShell = ({ children, user }: DashboardShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onSidebarOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <GlobalSearch />
    </div>
  );
};
