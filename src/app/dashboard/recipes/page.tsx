'use client';

import Link from 'next/link';

import { useDashboard } from '@/context/DashboardContext';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';

const RecipesPage = () => {
  const { recipeList, handleDeleteRecipe } = useDashboard();

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipeList.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onDelete={handleDeleteRecipe}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipesPage;
