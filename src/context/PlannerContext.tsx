'use client';

import { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

import { addToPlanning, removeFromPlanning } from '@/actions/planner-actions';
import type { MealType, PlannedMeal } from '@/features/planner/types';

type PlannerContextType = {
  plannedMeals: PlannedMeal[];
  handleAddToPlanning: (
    date: string,
    mealType: MealType,
    recipeId: string,
  ) => Promise<void>;
  handleRemoveFromPlanning: (date: string, mealType: MealType) => Promise<void>;
};

const PlannerContext = createContext<PlannerContextType | null>(null);

export const PlannerProvider = ({
  children,
  initialPlannedMeals,
}: {
  children: React.ReactNode;
  initialPlannedMeals: PlannedMeal[];
}) => {
  const [plannedMeals, setPlannedMeals] =
    useState<PlannedMeal[]>(initialPlannedMeals);

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
      toast.error("Impossible d'ajouter au planning. Réessaie.");
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
    <PlannerContext.Provider
      value={{
        plannedMeals,
        handleAddToPlanning,
        handleRemoveFromPlanning,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context)
    throw new Error('usePlanner must be used within PlannerProvider');
  return context;
};
