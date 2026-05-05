'use client';

import { useRouter } from 'next/navigation';

import { useDashboard } from '@/context/DashboardContext';
import { RecipeDetailView } from '@/features/recipes/components/RecipeDetailView';
import { Recipe } from '@/features/recipes/types';

const defaultRecipe: Omit<Recipe, 'id'> = {
  title: '',
  description: '',
  servings: 4,
  prepTimeMinutes: 30,
  cookTimeMinutes: undefined,
  restTimeMinutes: undefined,
  category: 'dinner',
  ingredients: [],
  instructions: [],
};

const NewRecipePage = () => {
  const router = useRouter();
  const { handleCreateRecipe } = useDashboard();

  const recipe: Recipe = { id: '', ...defaultRecipe };

  return (
    <RecipeDetailView
      recipe={recipe}
      initialIsEditing
      onSave={async (values) => {
        const newRecipe = await handleCreateRecipe(values);
        router.push(`/dashboard/recipes/${newRecipe.id}`);
      }}
      onCancel={() => router.push('/dashboard/recipes')}
    />
  );
};

export default NewRecipePage;
