'use client';

import { createContext, useContext, useState } from 'react';

import {
  createRecipe,
  deleteRecipe,
  updateRecipe,
} from '@/actions/recipe-actions';
import { MealType, PlannedMeal, WeekDay } from '@/features/planner/types';
import { Recipe, RecipeFormValues } from '@/features/recipes/types';

type DashboardContextType = {
  recipes: Recipe[];
  plannedMeals: PlannedMeal[];
  handleCreateRecipe: (values: RecipeFormValues) => Promise<Recipe>;
  handleUpdateRecipe: (id: string, values: RecipeFormValues) => Promise<void>;
  handleDeleteRecipe: (id: string) => Promise<void>;
  handleAddToPlanning: (
    day: WeekDay,
    mealType: MealType,
    recipeId: string,
  ) => void;
  handleRemoveFromPlanning: (day: WeekDay, mealType: MealType) => void;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({
  children,
  initialRecipes,
}: {
  children: React.ReactNode;
  initialRecipes: Recipe[];
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);

  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>(() => {
    // localStorage n'est pas disponible côté serveur (SSR)
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('planned-meals');
    return stored ? JSON.parse(stored) : [];
  });

  const handleCreateRecipe = async (values: RecipeFormValues) => {
    const newRecipe = await createRecipe(values);
    setRecipes((prev) => [...prev, newRecipe]);
    return newRecipe;
  };

  const handleUpdateRecipe = async (id: string, values: RecipeFormValues) => {
    const updatedRecipe = await updateRecipe(id, values);
    setRecipes((prev) =>
      prev.map((recipe) => (recipe.id === id ? updatedRecipe : recipe)),
    );
  };

  const handleDeleteRecipe = async (id: string) => {
    await deleteRecipe(id);
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  const handleAddToPlanning = (
    day: WeekDay,
    mealType: MealType,
    recipeId: string,
  ) => {
    setPlannedMeals((prev) => {
      const filtered = prev.filter(
        (meal) => !(meal.day === day && meal.mealType === mealType),
      );
      return [
        ...filtered,
        { id: crypto.randomUUID(), day, mealType, recipeId },
      ];
    });
  };

  const handleRemoveFromPlanning = (day: WeekDay, mealType: MealType) => {
    setPlannedMeals((prev) =>
      prev.filter((meal) => !(meal.day === day && meal.mealType === mealType)),
    );
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
