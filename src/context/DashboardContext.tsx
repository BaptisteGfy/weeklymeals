'use client';

import { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

import { addToPlanning, removeFromPlanning } from '@/actions/planner-actions';
import {
  createRecipe,
  deleteRecipe,
  updateRecipe,
} from '@/actions/recipe-actions';
import type { MealType, PlannedMeal } from '@/features/planner/types';
import type { Recipe, RecipeFormValues } from '@/features/recipes/types';

type DashboardContextType = {
  recipes: Recipe[];
  plannedMeals: PlannedMeal[];
  handleCreateRecipe: (values: RecipeFormValues) => Promise<Recipe>;
  handleUpdateRecipe: (id: string, values: RecipeFormValues) => Promise<void>;
  handleDeleteRecipe: (id: string) => Promise<void>;
  handleAddToPlanning: (
    date: string,
    mealType: MealType,
    recipeId: string,
  ) => Promise<void>;
  handleRemoveFromPlanning: (date: string, mealType: MealType) => Promise<void>;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({
  children,
  initialRecipes,
  initialPlannedMeals,
}: {
  children: React.ReactNode;
  initialRecipes: Recipe[];
  initialPlannedMeals: PlannedMeal[];
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [plannedMeals, setPlannedMeals] =
    useState<PlannedMeal[]>(initialPlannedMeals);

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
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    } catch {
      toast.error('Impossible de supprimer la recette. Réessaie.');
    }
  };

  const handleAddToPlanning = async (
    date: string,
    mealType: MealType,
    recipeId: string,
  ) => {
    try {
      const newMeal = await addToPlanning(date, mealType, recipeId);
      setPlannedMeals((prev) => {
        const filtered = prev.filter(
          (meal) => !(meal.date === date && meal.mealType === mealType),
        );
        return [...filtered, newMeal];
      });
    } catch {
      toast.error('Impossible d\'ajouter au planning. Réessaie.');
    }
  };

  const handleRemoveFromPlanning = async (date: string, mealType: MealType) => {
    try {
      await removeFromPlanning(date, mealType);
      setPlannedMeals((prev) =>
        prev.filter(
          (meal) => !(meal.date === date && meal.mealType === mealType),
        ),
      );
    } catch {
      toast.error('Impossible de retirer du planning. Réessaie.');
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        recipes,
        plannedMeals,
        handleCreateRecipe,
        handleUpdateRecipe,
        handleDeleteRecipe,
        handleAddToPlanning,
        handleRemoveFromPlanning,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context)
    throw new Error('useDashboard must be used within DashboardProvider');
  return context;
};
