'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import type { MealIdea } from '@/types/planner';
import type { Recipe } from '@/types/recipes';

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
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Idées & inspirations</h2>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Repas sans date fixe, pour vous inspirer
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {mealIdeas.map((idea) => {
          const recipe = getRecipeById(idea.recipeId);
          if (!recipe) return null;
          return (
            <div key={idea.id} className="group relative">
              <RecipeCard recipe={recipe} variant="mini" />
              <button
                onClick={() => onRemoveMealIdea(idea.recipeId)}
                className="bg-destructive absolute -top-1.5 -right-1.5 hidden h-5 w-5 items-center justify-center rounded-full text-xs text-white group-hover:flex"
                aria-label={`Retirer ${recipe.title} des idées`}
              >
                ×
              </button>
            </div>
          );
        })}

        <button
          onClick={() => setShowPicker(true)}
          className="border-border/50 text-muted-foreground/40 hover:border-primary/30 hover:text-primary/50 hover:bg-accent/10 flex h-16 w-full items-center justify-center gap-2 rounded-lg border border-dashed transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm">Ajouter une idée</span>
        </button>
      </div>

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
