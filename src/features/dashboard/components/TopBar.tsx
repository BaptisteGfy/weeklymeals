'use client';

import { Bell, Menu, Plus, Search, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRecipes } from '@/context/RecipesContext';

type TopBarProps = {
  onSidebarOpen: () => void;
};

export const TopBar = ({ onSidebarOpen }: TopBarProps) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const { recipes } = useRecipes();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  const filtered = recipes
    .filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6);

  const handleSelect = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery('');
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

      <div ref={containerRef} className="relative flex-1">
        <div className="bg-input/40 hover:bg-input/60 focus-within:bg-input/60 flex items-center gap-2 rounded-lg px-3 py-2 transition-colors">
          <Search className="text-muted-foreground size-4 shrink-0" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Cherchez une recette..."
            className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        {open && query && (
          <div className="border-border bg-popover absolute top-full right-0 left-0 z-50 mt-1.5 overflow-hidden rounded-lg border shadow-lg">
            {filtered.length > 0 ? (
              <ul className="p-1">
                {filtered.map((recipe) => (
                  <li key={recipe.id}>
                    <button
                      onClick={() => handleSelect('/dashboard/recipes')}
                      className="hover:bg-muted flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors"
                    >
                      <UtensilsCrossed className="text-muted-foreground size-4 shrink-0" />
                      <span className="font-medium">{recipe.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground px-4 py-3 text-sm">
                Aucun résultat pour « {query} »
              </p>
            )}
          </div>
        )}
      </div>

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
