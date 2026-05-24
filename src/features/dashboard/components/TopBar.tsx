'use client';

import { Bell, Menu, Plus, Search } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TopBarProps = {
  onSidebarOpen: () => void;
};

export const TopBar = ({ onSidebarOpen }: TopBarProps) => {
  const openSearch = () => {
    const fn = (window as Record<string, unknown>).__globalSearchOpen;
    if (typeof fn === 'function') fn();
  };

  return (
    <header className="border-sidebar-border flex h-14 shrink-0 items-center gap-3 border-b px-6">
      <button
        className="lg:hidden"
        onClick={onSidebarOpen}
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <button
        onClick={openSearch}
        className="bg-input/40 hover:bg-input/60 flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors"
        aria-label="Ouvrir la recherche"
      >
        <Search className="text-muted-foreground size-4 shrink-0" />
        <span className="text-muted-foreground flex-1 text-sm">
          Chercher une recette, un ingrédient…
        </span>
        <kbd className="bg-muted border-border text-muted-foreground hidden rounded border px-1.5 py-0.5 font-mono text-[10px] sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              disabled
              className="cursor-not-allowed p-2 opacity-40"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Notifications — bientôt disponible</TooltipContent>
        </Tooltip>

        <Button asChild size="sm">
          <Link href="/dashboard/recipes/new">
            <Plus className="size-4" />
            <span className="hidden sm:block">Nouvelle recette</span>
          </Link>
        </Button>
      </div>
    </header>
  );
};
