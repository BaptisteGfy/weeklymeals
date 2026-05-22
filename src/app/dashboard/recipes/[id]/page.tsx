'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, use, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { getRecipeById } from '@/actions/recipe-actions';
import { usePlanner } from '@/context/PlannerContext';
import { useRecipes } from '@/context/RecipesContext';
import { RecipeDetailView } from '@/features/recipes/components/RecipeDetailView';
import type { Recipe } from '@/types/recipes';

type Props = {
  params: Promise<{ id: string }>;
};

const RecipeDetailContent = ({ params }: Props) => {
  const { recipes, handleUpdateRecipe, handleDeleteRecipe } = useRecipes();
  const { handleAddToPlanning } = usePlanner();
  const { id } = use(params);
  const searchParams = useSearchParams();
  const initialIsEditing = searchParams.get('edit') === 'true';
  const router = useRouter();

  const contextRecipe = recipes.find((r) => r.id === id);
  const [fetchedRecipe, setFetchedRecipe] = useState<Recipe | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (contextRecipe || hasFetched.current) return;
    hasFetched.current = true;
    getRecipeById(id).then((r) => {
      if (!r) {
        toast.error('Recette introuvable');
        router.push('/dashboard/recipes');
      } else {
        setFetchedRecipe(r);
      }
    });
  }, [contextRecipe, hasFetched, id, router]);

  const recipe = contextRecipe ?? fetchedRecipe;

  if (!recipe) return null;

  const isOwned = !!contextRecipe && !contextRecipe.isSaved;

  return (
    <RecipeDetailView
      recipe={recipe}
      onSave={
        isOwned ? (values) => handleUpdateRecipe(recipe.id, values) : undefined
      }
      onDelete={
        isOwned
          ? () => {
              handleDeleteRecipe(recipe.id);
              router.push('/dashboard/recipes');
            }
          : undefined
      }
      initialIsEditing={initialIsEditing}
      onAddToPlanning={(date, mealPeriod, courseType, servings) =>
        handleAddToPlanning(date, mealPeriod, courseType, recipe.id, servings)
      }
    />
  );
};

const RecipeDetailPage = ({ params }: Props) => (
  <Suspense fallback={null}>
    <RecipeDetailContent params={params} />
  </Suspense>
);

export default RecipeDetailPage;
