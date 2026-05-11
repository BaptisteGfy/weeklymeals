'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, use } from 'react';

import { useDashboard } from '@/context/DashboardContext';
import { RecipeDetailView } from '@/features/recipes/components/RecipeDetailView';

type Props = {
  params: Promise<{ id: string }>;
};

const RecipeDetailContent = ({ params }: Props) => {
  const { recipes, handleUpdateRecipe, handleAddToPlanning } = useDashboard();
  const { id } = use(params);
  const searchParams = useSearchParams();
  const initialIsEditing = searchParams.get('edit') === 'true';

  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return <div>Recette non trouvée</div>;
  }

  return (
    <RecipeDetailView
      recipe={recipe}
      onSave={(values) => handleUpdateRecipe(recipe.id, values)}
      initialIsEditing={initialIsEditing}
      onAddToPlanning={(date, mealType) =>
        handleAddToPlanning(date, mealType, recipe.id)
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
