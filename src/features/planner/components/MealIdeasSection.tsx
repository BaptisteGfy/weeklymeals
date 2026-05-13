'use client';

import { useState } from 'react';

import type { MealIdea } from '@/features/planner/types';
import type { Recipe } from '@/features/recipes/types';

import { RecipePickerModal } from './RecipePickerModal';

type Props = {
  recipes: Recipe[];
  mealIdeas: MealIdea[];
  onAddMealIdea: (recipeId: string) => Promise<void>;
  onRemoveMealIdea: (recipeId: string) => Promise<void>;
};

export const MealIdeasSection = ({
  recipes,
  mealIdeas,
  onAddMealIdea,
  onRemoveMealIdea,
}: Props) => {
  const [showPicker, setShowPicker] = useState(false);

  const ideaRecipeIds = new Set(mealIdeas.map((i) => i.recipeId));
  const availableRecipes = recipes.filter((r) => !ideaRecipeIds.has(r.id));

  const getRecipeById = (id: string) => recipes.find((r) => r.id === id);

  const handleSelectRecipe = async (recipeId: string) => {
    await onAddMealIdea(recipeId);
    setShowPicker(false);
  };

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Idées de repas</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Ces recettes n&apos;alimentent pas la liste de courses
          </p>
        </div>
        <button
          onClick={() => setShowPicker(true)}
          className="rounded-md border px-3 py-1.5 text-sm font-medium transition hover:bg-slate-50"
        >
          + Ajouter une idée
        </button>
      </div>

      {mealIdeas.length === 0 ? (
        <p className="text-sm text-slate-500">Aucune idée pour l&apos;instant.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {mealIdeas.map((idea) => {
            const recipe = getRecipeById(idea.recipeId);
            return (
              <li
                key={idea.id}
                className="flex items-center gap-2 rounded-full border bg-slate-50 px-3 py-1.5 text-sm"
              >
                <span>{recipe?.title ?? 'Recette inconnue'}</span>
                <button
                  onClick={() => onRemoveMealIdea(idea.recipeId)}
                  className="text-slate-400 transition hover:text-slate-700"
                  aria-label={`Retirer ${recipe?.title} des idées`}
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {showPicker && (
        <RecipePickerModal
          subtitle="Ajouter aux idées de repas"
          recipes={availableRecipes}
          onSelectRecipe={handleSelectRecipe}
          onClose={() => setShowPicker(false)}
        />
      )}
    </section>
  );
};
