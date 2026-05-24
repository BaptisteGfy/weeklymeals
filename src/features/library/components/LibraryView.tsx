'use client';

import { Clock, Leaf, SearchX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { LibraryRecipe } from '@/actions/library-actions';
import { EmptyState } from '@/components/shared/EmptyState';
import { RecipeCard } from '@/components/shared/RecipeCard';
import { Button } from '@/components/ui/button';
import { FilterChip } from '@/components/ui/filter-chip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type LibraryFilter =
  | 'all'
  | 'weeklymeals'
  | 'users'
  | 'seasonal'
  | 'vegetarian'
  | 'gluten-free'
  | 'dairy-free'
  | 'under-30'
  | 'main'
  | 'dessert'
  | 'comfort';

const FILTERS: { id: LibraryFilter; label: string; icon?: React.ReactNode }[] =
  [
    { id: 'all', label: 'Tout' },
    { id: 'weeklymeals', label: 'WeeklyMeals' },
    { id: 'users', label: 'Utilisateurs' },
    { id: 'seasonal', label: 'De saison', icon: <Leaf size={13} /> },
    { id: 'vegetarian', label: 'Végétarien' },
    { id: 'gluten-free', label: 'Sans gluten' },
    { id: 'dairy-free', label: 'Sans lactose' },
    { id: 'under-30', label: 'Moins de 30 min', icon: <Clock size={13} /> },
    { id: 'main', label: 'Plat principal' },
    { id: 'dessert', label: 'Dessert' },
    { id: 'comfort', label: 'Réconfort' },
  ];

type SortOrder = 'popular' | 'quick' | 'az';

const sortRecipes = (
  recipes: LibraryRecipe[],
  sort: SortOrder,
): LibraryRecipe[] => {
  switch (sort) {
    case 'popular':
      return recipes;
    case 'quick':
      return [...recipes].sort((a, b) => {
        const ta = (a.prepTimeMinutes ?? 0) + (a.cookTimeMinutes ?? 0);
        const tb = (b.prepTimeMinutes ?? 0) + (b.cookTimeMinutes ?? 0);
        if (ta === 0) return 1;
        if (tb === 0) return -1;
        return ta - tb;
      });
    case 'az':
      return [...recipes].sort((a, b) => a.title.localeCompare(b.title, 'fr'));
  }
};

const applyFilter = (
  recipes: LibraryRecipe[],
  filter: LibraryFilter,
): LibraryRecipe[] => {
  switch (filter) {
    case 'all':
      return recipes;
    case 'weeklymeals':
      return recipes.filter((r) => r.isLibrary);
    case 'users':
      return recipes.filter((r) => !r.isLibrary);
    case 'under-30':
      return recipes.filter((r) => {
        const total = (r.prepTimeMinutes ?? 0) + (r.cookTimeMinutes ?? 0);
        return total > 0 && total <= 30;
      });
    case 'main':
      return recipes.filter(
        (r) => r.category === 'starter' || r.category === 'main',
      );
    case 'dessert':
      return recipes.filter((r) => r.category === 'dessert');
    // No tag data yet — no-op until tags are added to the model
    default:
      return recipes;
  }
};

type Props = {
  recipes: LibraryRecipe[];
  savedRecipeIds: string[];
  onSave: (recipeId: string) => Promise<void>;
  onUnsave: (recipeId: string) => Promise<void>;
};

export const LibraryView = ({
  recipes,
  savedRecipeIds,
  onSave,
  onUnsave,
}: Props) => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<LibraryFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('popular');

  const filtered = useMemo(
    () => sortRecipes(applyFilter(recipes, activeFilter), sortOrder),
    [recipes, activeFilter, sortOrder],
  );

  const handleToggle = async (recipeId: string, isSaved: boolean) => {
    if (isSaved) {
      await onUnsave(recipeId);
      toast.success('Recette retirée de votre collection');
    } else {
      await onSave(recipeId);
      toast.success('Recette ajoutée à vos recettes !');
    }
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <FilterChip
            key={f.id}
            label={f.label}
            icon={f.icon}
            active={activeFilter === f.id}
            onClick={() => setActiveFilter(f.id)}
          />
        ))}
        <Select
          value={sortOrder}
          onValueChange={(v) => setSortOrder(v as SortOrder)}
        >
          <SelectTrigger className="text-neutre-400 hover:text-neutre-600 ml-auto h-auto w-auto gap-1 border-none bg-transparent px-0 py-0 text-sm shadow-none focus:ring-0">
            <span>Trier ·</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="popular">Populaires</SelectItem>
            <SelectItem value="quick">Rapides</SelectItem>
            <SelectItem value="az">A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtered count */}
      <p className="text-neutre-400 text-sm">
        {filtered.length} recette{filtered.length > 1 ? 's' : ''}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Aucune recette ne colle à vos filtres."
          description="Essayez un autre filtre ou réinitialisez pour tout afficher."
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter('all')}
            >
              Réinitialiser les filtres
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((recipe) => {
            const isSaved = savedRecipeIds.includes(recipe.id);
            return (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isSaved={isSaved}
                onSave={() => handleToggle(recipe.id, isSaved)}
                badge={
                  recipe.isLibrary
                    ? { label: 'WeeklyMeals', variant: 'library' }
                    : {
                        label: recipe.authorName ?? 'Utilisateur',
                        variant: 'user',
                      }
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
