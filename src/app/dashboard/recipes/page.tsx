'use client';

import {
  BookOpen,
  Clock,
  Edit2,
  LayoutGrid,
  List,
  Plus,
  SearchX,
  Star,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { RecipeCard } from '@/components/shared/RecipeCard';
import { Button } from '@/components/ui/button';
import { FilterChip } from '@/components/ui/filter-chip';
import { RecipePlaceholder } from '@/components/ui/recipe-placeholder';
import { SearchInput } from '@/components/ui/search-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRecipes } from '@/context/RecipesContext';
import { categoryLabels } from '@/labels/recipes';
import { cn } from '@/lib/utils';
import type { Recipe, RecipeCategory } from '@/types/recipes';

// ── Types ──────────────────────────────────────────────────────────────────
type RecipeTab = 'all' | 'favorites' | 'shared';
type ViewMode = 'grid' | 'list';
type SortOrder = 'recent' | 'az' | 'za';
type RecipeFilter =
  | 'all'
  | 'main'
  | 'dessert'
  | 'breakfast'
  | 'under-30'
  | 'vegetarian'
  | 'gluten-free';

const PAGE_SIZE = { grid: 12, list: 15 } as const;

// ── Tabs ───────────────────────────────────────────────────────────────────
const TABS: { id: RecipeTab; label: string; disabled?: boolean }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'favorites', label: 'Favoris' },
  { id: 'shared', label: 'Partagées avec moi', disabled: true },
];

// ── Filters ────────────────────────────────────────────────────────────────
const FILTERS: { id: RecipeFilter; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'main', label: 'Plat principal' },
  { id: 'dessert', label: 'Dessert' },
  { id: 'breakfast', label: 'Petit-déjeuner' },
  { id: 'under-30', label: 'Moins de 30 min' },
  { id: 'vegetarian', label: 'Végétarien' },
  { id: 'gluten-free', label: 'Sans gluten' },
];

// ── Logic ──────────────────────────────────────────────────────────────────
const applyTab = (recipes: Recipe[], tab: RecipeTab): Recipe[] => {
  switch (tab) {
    case 'all':
      return recipes;
    case 'favorites':
      return recipes.filter((r) => r.isFavorite);
    case 'shared':
      return [];
  }
};

const applyFilter = (recipes: Recipe[], filter: RecipeFilter): Recipe[] => {
  switch (filter) {
    case 'all':
      return recipes;
    case 'main':
      return recipes.filter(
        (r) => r.category === 'starter' || r.category === 'main',
      );
    case 'dessert':
      return recipes.filter((r) => r.category === 'dessert');
    case 'breakfast':
      return recipes.filter((r) => r.category === 'breakfast');
    case 'under-30':
      return recipes.filter((r) => {
        const t = (r.prepTimeMinutes ?? 0) + (r.cookTimeMinutes ?? 0);
        return t > 0 && t <= 30;
      });
    // No tag data yet
    default:
      return recipes;
  }
};

const applySort = (recipes: Recipe[], sort: SortOrder): Recipe[] => {
  switch (sort) {
    case 'recent':
      return [...recipes].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'az':
      return [...recipes].sort((a, b) => a.title.localeCompare(b.title, 'fr'));
    case 'za':
      return [...recipes].sort((a, b) => b.title.localeCompare(a.title, 'fr'));
  }
};

const categoryTokens: Record<RecipeCategory, string> = {
  breakfast: 'bg-sky-100 text-sky-700',
  starter: 'bg-olive-100 text-olive-700',
  main: 'bg-terracotta-100 text-terracotta-700',
  dessert: 'bg-sable-200 text-sable-700',
};

// ── Component ──────────────────────────────────────────────────────────────
const RecipesPage = () => {
  const {
    recipes,
    handleDeleteRecipe,
    handleUnsaveRecipe,
    handleToggleFavorite,
  } = useRecipes();

  const [activeTab, setActiveTab] = useState<RecipeTab>('all');
  const [activeFilter, setActiveFilter] = useState<RecipeFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentPage, setCurrentPage] = useState(1);

  const processed = useMemo(() => {
    let result = applyTab(recipes, activeTab);
    result = applyFilter(result, activeFilter);
    if (searchQuery.trim())
      result = result.filter((r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return applySort(result, sortOrder);
  }, [recipes, activeTab, activeFilter, searchQuery, sortOrder]);

  const pageSize = PAGE_SIZE[viewMode];
  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  const paginated = processed.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const reset = () => {
    setActiveFilter('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleTabChange = (tab: RecipeTab) => {
    setActiveTab(tab);
    reset();
  };

  const tabLabel = (tab: RecipeTab) => {
    if (tab === 'all') return `Toutes (${recipes.length})`;
    if (tab === 'favorites')
      return `Favoris (${recipes.filter((r) => r.isFavorite).length})`;
    return 'Partagées avec moi';
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
              disabled={tab.disabled}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              className={cn(
                'shrink-0 border-b-2 px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors',
                tab.disabled && 'cursor-not-allowed opacity-40',
                activeTab === tab.id && !tab.disabled
                  ? 'border-terracotta-500 text-terracotta-600'
                  : 'text-neutre-400 hover:text-neutre-600 border-transparent',
              )}
            >
              {tabLabel(tab.id)}
              {tab.disabled && (
                <span className="text-neutre-300 ml-1.5 text-xs font-normal">
                  — bientôt
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filter chips */}
        <div className="border-neutre-100 flex flex-wrap items-center gap-2 border-b px-6 py-3">
          {FILTERS.map((f) => (
            <FilterChip
              key={f.id}
              label={f.label}
              active={activeFilter === f.id}
              onClick={() => {
                setActiveFilter(f.id);
                setCurrentPage(1);
              }}
            />
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
              {processed.length} résultat{processed.length > 1 ? 's' : ''}
            </span>
            <Select
              value={sortOrder}
              onValueChange={(v) => setSortOrder(v as SortOrder)}
            >
              <SelectTrigger className="text-neutre-400 h-auto w-auto gap-1 border-none bg-transparent px-0 py-0 text-sm shadow-none focus:ring-0">
                <span>Trier ·</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="recent">Récentes</SelectItem>
                <SelectItem value="az">A–Z</SelectItem>
                <SelectItem value="za">Z–A</SelectItem>
              </SelectContent>
            </Select>
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
          activeTab === 'shared' ? (
            <EmptyState
              icon={Users}
              title="Fonctionnalité foyer bientôt disponible."
              description="Bientôt, vous pourrez partager vos recettes avec les membres de votre foyer."
            />
          ) : activeTab === 'favorites' ? (
            <EmptyState
              icon={Star}
              title="Pas encore de favoris."
              description="Marquez des recettes avec une étoile pour les retrouver ici."
              actions={
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/library">Découvrir des recettes</Link>
                </Button>
              }
            />
          ) : recipes.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Constituez votre répertoire de recettes."
              description="Créez vos propres recettes ou ajoutez-en depuis la bibliothèque."
              actions={
                <>
                  <Button asChild>
                    <Link href="/dashboard/recipes/new">
                      <Plus size={14} />
                      Créer une recette
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/dashboard/library">
                      Explorer la bibliothèque
                    </Link>
                  </Button>
                </>
              }
            />
          ) : (
            <EmptyState
              icon={SearchX}
              title="Aucune recette ne correspond."
              description="Essayez d'ajuster votre recherche ou vos filtres."
              actions={
                <Button variant="outline" size="sm" onClick={reset}>
                  Réinitialiser les filtres
                </Button>
              }
            />
          )
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginated.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={recipe.isFavorite}
                onToggleFavorite={handleToggleFavorite}
                onDelete={recipe.isSaved ? undefined : handleDeleteRecipe}
                onUnsave={recipe.isSaved ? handleUnsaveRecipe : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="divide-neutre-100 divide-y">
            <div className="text-neutre-400 grid grid-cols-[3rem_1fr_8rem_6rem_5rem] items-center gap-4 px-6 py-2 text-xs font-medium tracking-wide uppercase">
              <span />
              <span>Recette</span>
              <span>Catégorie</span>
              <span>Temps</span>
              <span />
            </div>
            {paginated.map((recipe) => (
              <div
                key={recipe.id}
                className="hover:bg-sable-50 grid grid-cols-[3rem_1fr_8rem_6rem_5rem] items-center gap-4 px-6 py-3 transition-colors"
              >
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
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/dashboard/recipes/${recipe.id}`}
                      className="text-neutre-800 truncate text-sm font-medium hover:underline"
                    >
                      {recipe.title}
                    </Link>
                    {recipe.isFavorite && (
                      <Star
                        size={12}
                        className="text-sable-400 fill-sable-400 shrink-0"
                      />
                    )}
                  </div>
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
                <span className="text-neutre-500 text-sm">
                  {categoryLabels[recipe.category as RecipeCategory]}
                </span>
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
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(recipe.id)}
                    title={
                      recipe.isFavorite
                        ? 'Retirer des favoris'
                        : 'Ajouter aux favoris'
                    }
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                      recipe.isFavorite
                        ? 'text-sable-400'
                        : 'text-neutre-300 hover:text-sable-400',
                    )}
                  >
                    <Star
                      size={14}
                      className={recipe.isFavorite ? 'fill-current' : ''}
                    />
                  </button>
                  {!recipe.isSaved && (
                    <Link
                      href={`/dashboard/recipes/${recipe.id}?edit=true`}
                      className="text-neutre-400 hover:text-terracotta-500 flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                    >
                      <Edit2 size={14} />
                    </Link>
                  )}
                </div>
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
            {Math.min(currentPage * pageSize, processed.length)} sur{' '}
            {processed.length}
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
