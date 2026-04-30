'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { MealType, PlannedMeal, WeekDay } from '@/features/planner/types';
import { recipes as mockRecipes } from '@/features/recipes/mock-data';
import { Recipe, RecipeFormValues } from '@/features/recipes/types';

type DashboardContextType = {
  recipes: Recipe[];
  plannedMeals: PlannedMeal[];
  handleCreateRecipe: (id: string, values: RecipeFormValues) => void;
  handleUpdateRecipe: (id: string, values: RecipeFormValues) => void;
  handleDeleteRecipe: (id: string) => void;
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
}: {
  children: React.ReactNode;
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    // localStorage n'est pas disponible côté serveur (SSR)
    if (typeof window === 'undefined') return mockRecipes;
    const stored = localStorage.getItem('recipes');
    return stored ? JSON.parse(stored) : mockRecipes;
  });

  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>(() => {
    // localStorage n'est pas disponible côté serveur (SSR)
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('planned-meals');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('planned-meals', JSON.stringify(plannedMeals));
  }, [plannedMeals]);

  const handleCreateRecipe = (id: string, values: RecipeFormValues) => {
    setRecipes((prev) => [...prev, { id, ...values }]);
  };

  const handleUpdateRecipe = (id: string, values: RecipeFormValues) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id ? { ...recipe, ...values } : recipe,
      ),
    );
  };

  const handleDeleteRecipe = (id: string) => {
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
