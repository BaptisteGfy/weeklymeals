'use client';

import { Clock, Edit2, LayoutGrid, List, Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { PageHeader } from '@/components/shared/PageHeader';
import { RecipeCard } from '@/components/shared/RecipeCard';
import { Button } from '@/components/ui/button';
import { RecipePlaceholder } from '@/components/ui/recipe-placeholder';
import { SearchInput } from '@/components/ui/search-input';
import { useRecipes } from '@/context/RecipesContext';
import { categoryLabels } from '@/labels/recipes';
import { cn } from '@/lib/utils';
import type { Recipe, RecipeCategory } from '@/types/recipes';

type RecipeTab = 'all' | 'favorites' | 'recent' | 'drafts' | 'shared';
type ViewMode = 'grid' | 'list';

const PAGE_SIZE = { grid: 12, list: 15 } as const;

const TABS: { id: RecipeTab; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'favorites', label: 'Favoris' },
  { id: 'recent', label: 'Récemment ajoutées' },
  { id: 'drafts', label: 'Brouillons' },
  { id: 'shared', label: 'Partagées avec moi' },
];

const applyTab = (recipes: Recipe[], tab: RecipeTab): Recipe[] => {
  switch (tab) {
    case 'all':
      return recipes;
    case 'recent':
      return [...recipes].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'favorites':
      return recipes.filter((r) => r.isSaved);
    // No data yet
    case 'drafts':
    case 'shared':
      return [];
  }
};

const categoryTokens: Record<RecipeCategory, string> = {
  breakfast: 'bg-sky-100 text-sky-700',
  lunch: 'bg-olive-100 text-olive-700',
  dinner: 'bg-terracotta-100 text-terracotta-700',
  dessert: 'bg-sable-200 text-sable-700',
};

const RecipesPage = () => {
  const { recipes, handleDeleteRecipe, handleUnsaveRecipe } = useRecipes();
  const [activeTab, setActiveTab] = useState<RecipeTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentPage, setCurrentPage] = useState(1);

  const tabRecipes = useMemo(
    () => applyTab(recipes, activeTab),
    [recipes, activeTab],
  );

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return tabRecipes;
    return tabRecipes.filter((r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [tabRecipes, searchQuery]);

  const pageSize = PAGE_SIZE[viewMode];
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleTabChange = (tab: RecipeTab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const tabLabel = (tab: RecipeTab) => {
    if (tab === 'all') return `Toutes (${recipes.length})`;
    if (tab === 'recent') return 'Récemment ajoutées';
    return TABS.find((t) => t.id === tab)?.label ?? tab;
  };

  const totalTime = (r: Recipe) =>
    (r.prepTimeMinutes ?? 0) + (r.cookTimeMinutes ?? 0);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <PageHeader
        eyebrow={`${recipes.length} recette${recipes.length > 1 ? 's' : ''} personnelle${recipes.length > 1 ? 's' : ''}`}
        title={
          <>
            Mes <em>recettes</em>.
          </>
        }
        description="Vos créations, vos préférées, vos recettes de famille — tout ce qui vous appartient."
        actions={
          <Button asChild>
            <Link href="/dashboard/recipes/new">
              <Plus size={16} />
              Nouvelle recette
            </Link>
          </Button>
        }
      />

      <div className="border-neutre-100 overflow-hidden rounded-xl border bg-white shadow-xs">
        {/* Tabs */}
        <div className="border-neutre-100 flex gap-1 overflow-x-auto border-b px-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'shrink-0 border-b-2 px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors',
                activeTab === tab.id
                  ? 'border-terracotta-500 text-terracotta-600'
                  : 'text-neutre-400 hover:text-neutre-600 border-transparent',
              )}
            >
              {tabLabel(tab.id)}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="w-72">
            <SearchInput
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Chercher dans mes recettes…"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-neutre-400 text-sm">
              {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
            </span>
            <div className="border-neutre-200 flex overflow-hidden rounded-lg border">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors',
                  viewMode === 'grid'
                    ? 'bg-terracotta-500 text-white'
                    : 'text-neutre-400 hover:bg-sable-50',
                )}
              >
                <LayoutGrid size={14} />
                Grille
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex items-center gap-1.5 border-l px-3 py-1.5 text-sm transition-colors',
                  viewMode === 'list'
                    ? 'bg-terracotta-500 border-terracotta-500 text-white'
                    : 'border-neutre-200 text-neutre-400 hover:bg-sable-50',
                )}
              >
                <List size={14} />
                Liste
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {paginated.length === 0 ? (
          <div className="text-neutre-400 py-16 text-center text-sm">
            {activeTab === 'favorites' ||
            activeTab === 'drafts' ||
            activeTab === 'shared'
              ? 'Fonctionnalité à venir.'
              : 'Aucune recette trouvée.'}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={recipe.isSaved ? undefined : handleDeleteRecipe}
                onUnsave={recipe.isSaved ? handleUnsaveRecipe : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="divide-neutre-100 divide-y">
            {/* List header */}
            <div className="text-neutre-400 grid grid-cols-[3rem_1fr_8rem_6rem_2.5rem] items-center gap-4 px-6 py-2 text-xs font-medium tracking-wide uppercase">
              <span />
              <span>Recette</span>
              <span>Catégorie</span>
              <span>Temps</span>
              <span />
            </div>
            {paginated.map((recipe) => (
              <div
                key={recipe.id}
                className="hover:bg-sable-50 grid grid-cols-[3rem_1fr_8rem_6rem_2.5rem] items-center gap-4 px-6 py-3 transition-colors"
              >
                {/* Thumb */}
                <div className="h-10 w-10 overflow-hidden rounded-md">
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
                {/* Title + tags */}
                <div className="min-w-0">
                  <Link
                    href={`/dashboard/recipes/${recipe.id}`}
                    className="text-neutre-800 truncate text-sm font-medium hover:underline"
                  >
                    {recipe.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        categoryTokens[recipe.category as RecipeCategory],
                      )}
                    >
                      {categoryLabels[recipe.category as RecipeCategory]}
                    </span>
                    {recipe.servings && (
                      <span className="text-neutre-400 flex items-center gap-1 text-xs">
                        <Users size={10} />
                        {recipe.servings}
                      </span>
                    )}
                  </div>
                </div>
                {/* Category */}
                <span className="text-neutre-500 text-sm">
                  {categoryLabels[recipe.category as RecipeCategory]}
                </span>
                {/* Time */}
                <span className="text-neutre-400 flex items-center gap-1 text-sm">
                  {totalTime(recipe) > 0 ? (
                    <>
                      <Clock size={12} />
                      {totalTime(recipe)} min
                    </>
                  ) : (
                    '—'
                  )}
                </span>
                {/* Edit */}
                <Link
                  href={`/dashboard/recipes/${recipe.id}?edit=true`}
                  className="text-neutre-400 hover:text-terracotta-500 flex items-center justify-center transition-colors"
                >
                  <Edit2 size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-neutre-400 text-sm">
            Affichage {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filtered.length)} sur{' '}
            {filtered.length}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-neutre-200 text-neutre-400 hover:bg-sable-50 flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition-colors disabled:opacity-40"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setCurrentPage(p)}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors',
                  p === currentPage
                    ? 'bg-terracotta-500 text-white'
                    : 'border-neutre-200 text-neutre-500 hover:bg-sable-50 border',
                )}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-neutre-200 text-neutre-400 hover:bg-sable-50 flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition-colors disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
