'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, use, useEffect } from 'react';
import { toast } from 'sonner';

import { usePlanner } from '@/context/PlannerContext';
import { useRecipes } from '@/context/RecipesContext';
import { RecipeDetailView } from '@/features/recipes/components/RecipeDetailView';

type Props = {
  params: Promise<{ id: string }>;
};

const RecipeDetailContent = ({ params }: Props) => {
  const { recipes, handleUpdateRecipe } = useRecipes();
  const { handleAddToPlanning } = usePlanner();
  const { id } = use(params);
  const searchParams = useSearchParams();
  const initialIsEditing = searchParams.get('edit') === 'true';
  const router = useRouter();

  const recipe = recipes.find((r) => r.id === id);

  useEffect(() => {
    if (!recipe) {
      toast.error('Recette introuvable');
      router.push('/dashboard/recipes');
    }
  }, [recipe, router]);

  if (!recipe) return null;

  return (
    <RecipeDetailView
      recipe={recipe}
      onSave={(values) => handleUpdateRecipe(recipe.id, values)}
      initialIsEditing={initialIsEditing}
      onAddToPlanning={(date, mealPeriod, courseType) =>
        handleAddToPlanning(date, mealPeriod, courseType, recipe.id)
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
