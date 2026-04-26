'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useDashboard } from '@/context/DashboardContext';
import { RecipeDetailView } from '@/features/recipes/components/RecipeDetailView';
import { Recipe } from '@/features/recipes/types';

const defaultRecipe: Omit<Recipe, 'id'> = {
  title: '',
  description: '',
  servings: 4,
  prepTimeMinutes: 30,
  category: 'dinner',
  ingredients: [],
  instructions: [],
};

const NewRecipePage = () => {
  const router = useRouter();
  const { handleCreateRecipe } = useDashboard();
  const [newId] = useState(() => crypto.randomUUID());

  const recipe: Recipe = { id: newId, ...defaultRecipe };

  return (
    <RecipeDetailView
      recipe={recipe}
      initialIsEditing
      onSave={(values) => {
        handleCreateRecipe(newId, values);
        router.push(`/dashboard/recipes/${newId}`);
      }}
      onCancel={() => router.push('/dashboard/recipes')}
    />
  );
};

export default NewRecipePage;
