'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { PlannedMeal } from '@/features/planner/types';
import { recipes } from '@/features/recipes/data';
import { Recipe, RecipeFormValues } from '@/features/recipes/types';

type DashboardContextType = {
  recipeList: Recipe[];
  plannedMeals: PlannedMeal[];
  setPlannedMeals: React.Dispatch<React.SetStateAction<PlannedMeal[]>>;
  handleCreateRecipe: (id: string, values: RecipeFormValues) => void;
  handleUpdateRecipe: (id: string, values: RecipeFormValues) => void;
  handleDeleteRecipe: (id: string) => void;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [recipeList, setRecipeList] = useState<Recipe[]>(() => {
    if (typeof window === 'undefined') return recipes;
    const stored = localStorage.getItem('recipes');
    return stored ? JSON.parse(stored) : recipes;
  });

  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('planned-meals');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipeList));
  }, [recipeList]);

  useEffect(() => {
    localStorage.setItem('planned-meals', JSON.stringify(plannedMeals));
  }, [plannedMeals]);

  const handleCreateRecipe = (id: string, values: RecipeFormValues) => {
    const newRecipe: Recipe = { id, ...values };
    setRecipeList((prev) => [...prev, newRecipe]);
  };

  const handleUpdateRecipe = (id: string, values: RecipeFormValues) => {
    setRecipeList((prev) =>
      prev.map((recipe) =>
        recipe.id === id ? { ...recipe, ...values } : recipe,
      ),
    );
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipeList((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  return (
    <DashboardContext.Provider
      value={{
        recipeList,
        plannedMeals,
        setPlannedMeals,
        handleCreateRecipe,
        handleUpdateRecipe,
        handleDeleteRecipe,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context)
    throw new Error('useDashboard must be used within DashboardProvider');
  return context;
};
