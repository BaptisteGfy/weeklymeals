'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useDashboard } from '@/context/DashboardContext';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';

const RecipesPage = () => {
  const { recipeList, handleDeleteRecipe } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = recipeList.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes recettes</h1>
        <Link
          href="/dashboard/recipes/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          + Nouvelle recette
        </Link>
      </div>
      <input
        type="text"
        placeholder="Rechercher une recette..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 rounded-md border border-slate-300 bg-slate-100 p-2 text-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.length === 0 ? (
          <p className="col-span-full text-center text-slate-500">
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
