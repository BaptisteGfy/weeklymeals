'use client';

import { useSearchParams } from 'next/navigation';
import { use } from 'react';

import { useDashboard } from '@/context/DashboardContext';
import { RecipeDetailView } from '@/features/recipes/components/RecipeDetailView';

type Props = {
  params: Promise<{ id: string }>;
};

const RecipeDetailPage = ({ params }: Props) => {
  const { recipeList, handleUpdateRecipe } = useDashboard();
  const { id } = use(params);
  const searchParams = useSearchParams();
  const initialIsEditing = searchParams.get('edit') === 'true';

  const recipe = recipeList.find((r) => r.id === id);

  if (!recipe) {
    return <div>Recette non trouvée</div>;
  }

  return (
    <RecipeDetailView
      recipe={recipe}
      onSave={(values) => handleUpdateRecipe(recipe.id, values)}
      initialIsEditing={initialIsEditing}
    />
  );
};

export default RecipeDetailPage;
