'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { PlannedMeal } from '@/features/planner/types';
import { RecipeFormValues } from '@/features/recipes/components/RecipeForm';
import { recipes } from '@/features/recipes/data';
import { Recipe } from '@/features/recipes/types';

type DashboardContextType = {
  recipeList: Recipe[];
  plannedMeals: PlannedMeal[];
  setPlannedMeals: React.Dispatch<React.SetStateAction<PlannedMeal[]>>;
  handleDeleteRecipe: (id: string) => void;
  handleSubmitRecipe: (values: RecipeFormValues) => void;
  handleEditRecipe: (recipe: Recipe) => void;
  handleCancelEdit: () => void;
  editingRecipe: Recipe | null;
  editingFormValues: RecipeFormValues | undefined;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Tout le state et les handlers viennent ici
  const [recipeList, setRecipeList] = useState<Recipe[]>(() => {
    if (typeof window === 'undefined') return recipes;
    const storedRecipes = localStorage.getItem('recipes');
    return storedRecipes ? JSON.parse(storedRecipes) : recipes;
  });

  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>(() => {
    if (typeof window === 'undefined') return [];
    const storedPlanned = localStorage.getItem('planned-meals');
    return storedPlanned ? JSON.parse(storedPlanned) : [];
  });

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipeList));
  }, [recipeList]);

  useEffect(() => {
    localStorage.setItem('planned-meals', JSON.stringify(plannedMeals));
  }, [plannedMeals]);

  const handleSubmitRecipe = (values: RecipeFormValues) => {
    if (editingRecipe) {
      setRecipeList((prev) =>
        prev.map((recipe) =>
          recipe.id === editingRecipe.id ? { ...recipe, ...values } : recipe,
        ),
      );
      setEditingRecipe(null);
      return;
    }

    const newRecipe: Recipe = {
      id: crypto.randomUUID(),
      ...values,
    };

    setRecipeList((prev) => [...prev, newRecipe]);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingRecipe(null);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    setRecipeList((prev) => prev.filter((recipe) => recipe.id !== recipeId));
  };

  const editingFormValues: RecipeFormValues | undefined = editingRecipe
    ? {
        title: editingRecipe.title,
        description: editingRecipe.description,
        servings: editingRecipe.servings,
        prepTimeMinutes: editingRecipe.prepTimeMinutes,
        category: editingRecipe.category,
        ingredients: editingRecipe.ingredients,
        instructions: editingRecipe.instructions,
      }
    : undefined;
  return (
    <DashboardContext.Provider
      value={{
        recipeList,
        plannedMeals,
        setPlannedMeals,
        handleDeleteRecipe,
        handleSubmitRecipe,
        handleEditRecipe,
        handleCancelEdit,
        editingRecipe,
        editingFormValues,
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
