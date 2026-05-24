'use client';

import { Cake, Clock, Salad, Sun, UtensilsCrossed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { RecipePlaceholder } from '@/components/ui/recipe-placeholder';
import { useRecipes } from '@/context/RecipesContext';
import { categoryLabels } from '@/labels/recipes';
import { cn } from '@/lib/utils';
import type { RecipeCategory } from '@/types/recipes';

const CATEGORY_SUGGESTIONS: {
  category: RecipeCategory;
  icon: React.ElementType;
}[] = [
  { category: 'breakfast', icon: Sun },
  { category: 'starter', icon: Salad },
  { category: 'main', icon: UtensilsCrossed },
  { category: 'dessert', icon: Cake },
];

const categoryTokens: Record<RecipeCategory, string> = {
  breakfast: 'bg-sky-100 text-sky-700',
  starter: 'bg-olive-100 text-olive-700',
  main: 'bg-terracotta-100 text-terracotta-700',
  dessert: 'bg-sable-200 text-sable-700',
};

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { recipes } = useRecipes();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setQuery('');
  };

  const handleSelect = (href: string) => {
    router.push(href);
    handleClose();
  };

  const filtered = recipes
    .filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);

  return (
    <CommandDialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose();
        else setOpen(true);
      }}
      title="Recherche globale"
      description="Recherchez une recette ou naviguez par catégorie"
    >
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Chercher des recettes, ingrédients..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>Aucun résultat pour « {query} »</CommandEmpty>

          {query === '' && (
            <CommandGroup heading="Catégories">
              {CATEGORY_SUGGESTIONS.map(({ category, icon: Icon }) => (
                <CommandItem
                  key={category}
                  value={category}
                  onSelect={() =>
                    handleSelect(`/dashboard/recipes?category=${category}`)
                  }
                >
                  <span
                    className={cn(
                      'flex size-7 shrink-0 items-center justify-center rounded-md',
                      categoryTokens[category],
                    )}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <span className="font-medium">
                    {categoryLabels[category]}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {query !== '' && (
            <CommandGroup heading="Recettes">
              {filtered.map((recipe) => {
                const totalTime =
                  (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0);
                return (
                  <CommandItem
                    key={recipe.id}
                    value={recipe.id}
                    onSelect={() =>
                      handleSelect(`/dashboard/recipes/${recipe.id}`)
                    }
                    className="gap-3 py-1.5"
                  >
                    <div className="size-10 shrink-0 overflow-hidden rounded-md">
                      {recipe.imageUrl ? (
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <RecipePlaceholder
                          className="h-full w-full"
                          iconSize={14}
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {recipe.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span
                          className={cn(
                            'rounded-full px-1.5 py-0.5 text-xs font-medium',
                            categoryTokens[recipe.category],
                          )}
                        >
                          {categoryLabels[recipe.category]}
                        </span>
                        {totalTime > 0 && (
                          <span className="text-muted-foreground flex items-center gap-1 text-xs">
                            <Clock className="size-3" />
                            {totalTime} min
                          </span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>

        <div className="border-border flex items-center gap-4 border-t px-4 py-2">
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <kbd className="bg-muted border-border rounded border px-1 py-0.5 font-mono text-[10px]">
              ↑↓
            </kbd>
            naviguer
          </span>
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <kbd className="bg-muted border-border rounded border px-1 py-0.5 font-mono text-[10px]">
              ↵
            </kbd>
            sélectionner
          </span>
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <kbd className="bg-muted border-border rounded border px-1 py-0.5 font-mono text-[10px]">
              Esc
            </kbd>
            fermer
          </span>
        </div>
      </Command>
    </CommandDialog>
  );
};
