'use client';

import { use } from 'react';

import { useDashboard } from '@/context/DashboardContext';
import { RecipeDetailView } from '@/features/recipes/components/RecipeDetailView';

type Props = {
  params: Promise<{ id: string }>;
};

const RecipeDetailPage = ({ params }: Props) => {
  const { recipeList } = useDashboard();
  const { id } = use(params);

  const recipe = recipeList.find((r) => r.id === id);

  if (!recipe) {
    return <div>Recette non trouvée</div>;
  }
  return <RecipeDetailView recipe={recipe} />;
};

export default RecipeDetailPage;
