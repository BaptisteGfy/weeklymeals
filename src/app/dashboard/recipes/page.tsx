'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { useRecipes } from '@/context/RecipesContext';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';

type CategoryFilter = 'all' | 'plat' | 'dessert';

const FILTERS: { label: string; value: CategoryFilter }[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'Plat', value: 'plat' },
  { label: 'Dessert', value: 'dessert' },
];

const RecipesPage = () => {
  const { recipes, handleDeleteRecipe } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeFilter === 'all' ||
      (activeFilter === 'plat' &&
        (recipe.category === 'lunch' || recipe.category === 'dinner')) ||
      (activeFilter === 'dessert' && recipe.category === 'dessert');
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="font-heading text-3xl font-bold">Mes recettes</h1>
          <span className="text-muted-foreground text-sm">
            {recipes.length} recettes
          </span>
        </div>
        <Link
          href="/dashboard/recipes/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          + Nouvelle recette
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search
            size={16}
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Rechercher une recette..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-input bg-background placeholder:text-muted-foreground focus:ring-ring h-9 rounded-lg border pr-4 pl-9 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeFilter === filter.value
                ? 'bg-primary text-primary-foreground'
                : 'border-input bg-background hover:bg-muted border'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center">
            Aucune recette trouvée.
          </p>
        ) : (
          filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={handleDeleteRecipe}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RecipesPage;
