'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { unsaveRecipe } from '@/actions/library-actions';
import {
  createRecipe,
  deleteRecipe,
  updateRecipe,
} from '@/actions/recipe-actions';
import type { Recipe, RecipeFormValues } from '@/types/recipes';

type RecipesContextType = {
  recipes: Recipe[];
  handleCreateRecipe: (values: RecipeFormValues) => Promise<Recipe>;
  handleUpdateRecipe: (id: string, values: RecipeFormValues) => Promise<void>;
  handleDeleteRecipe: (id: string) => Promise<void>;
  handleUnsaveRecipe: (id: string) => Promise<void>;
};

const RecipesContext = createContext<RecipesContextType | null>(null);

export const RecipesProvider = ({
  children,
  initialRecipes,
}: {
  children: React.ReactNode;
  initialRecipes: Recipe[];
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);

  useEffect(() => {
    setRecipes(initialRecipes);
  }, [initialRecipes]);

  const handleCreateRecipe = async (values: RecipeFormValues) => {
    try {
      const newRecipe = await createRecipe(values);
      setRecipes((prev) => [...prev, newRecipe]);
      return newRecipe;
    } catch {
      toast.error('Impossible de créer la recette. Réessaie.');
      throw new Error('Failed to create recipe');
    }
  };

  const handleUpdateRecipe = async (id: string, values: RecipeFormValues) => {
    try {
      const updatedRecipe = await updateRecipe(id, values);
      setRecipes((prev) =>
        prev.map((recipe) => (recipe.id === id ? updatedRecipe : recipe)),
      );
    } catch {
      toast.error('Impossible de modifier la recette. Réessaie.');
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    const recipe = recipes.find((r) => r.id === id);
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      toast.success(`« ${recipe?.title} » supprimée.`);
    } catch {
      toast.error('Impossible de supprimer la recette. Réessaie.');
    }
  };

  const handleUnsaveRecipe = async (id: string) => {
    const recipe = recipes.find((r) => r.id === id);
    try {
      await unsaveRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      toast.success(`« ${recipe?.title} » retirée de vos recettes.`);
    } catch {
      toast.error('Impossible de retirer la recette. Réessaie.');
    }
  };

  return (
    <RecipesContext.Provider
      value={{
        recipes,
        handleCreateRecipe,
        handleUpdateRecipe,
        handleDeleteRecipe,
        handleUnsaveRecipe,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (!context)
    throw new Error('useRecipes must be used within RecipesProvider');
  return context;
};
