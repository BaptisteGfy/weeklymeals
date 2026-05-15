'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { toast } from 'sonner';

import { addMealIdea, removeMealIdea } from '@/actions/meal-idea-actions';
import {
  addToPlanning,
  getPlannedMeals,
  removeFromPlanning,
} from '@/actions/planner-actions';
import type {
  CourseType,
  MealIdea,
  MealPeriod,
  PlannedMeal,
} from '@/features/planner/types';
import { weekDayToDate } from '@/features/planner/utils/date';

type PlannerContextType = {
  plannedMeals: PlannedMeal[];
  loadWeekMeals: (weekStart: Date) => Promise<void>;
  handleAddToPlanning: (
    date: string,
    mealPeriod: MealPeriod,
    courseType: CourseType,
    recipeId: string,
  ) => Promise<void>;
  handleRemoveFromPlanning: (
    date: string,
    mealPeriod: MealPeriod,
    courseType: CourseType,
  ) => Promise<void>;
  mealIdeas: MealIdea[];
  handleAddMealIdea: (recipeId: string) => Promise<void>;
  handleRemoveMealIdea: (recipeId: string) => Promise<void>;
};

const PlannerContext = createContext<PlannerContextType | null>(null);

export const PlannerProvider = ({
  children,
  initialPlannedMeals,
  initialMealIdeas,
}: {
  children: React.ReactNode;
  initialPlannedMeals: PlannedMeal[];
  initialMealIdeas: MealIdea[];
}) => {
  const [plannedMeals, setPlannedMeals] =
    useState<PlannedMeal[]>(initialPlannedMeals);
  const [mealIdeas, setMealIdeas] = useState<MealIdea[]>(initialMealIdeas);

  const handleAddToPlanning = async (
    date: string,
    mealPeriod: MealPeriod,
    courseType: CourseType,
    recipeId: string,
  ) => {
    try {
      const newMeal = await addToPlanning(
        date,
        mealPeriod,
        courseType,
        recipeId,
      );
      setPlannedMeals((prev) => {
        const filtered = prev.filter(
          (meal) =>
            !(
              meal.date === date &&
              meal.mealPeriod === mealPeriod &&
              meal.courseType === courseType
            ),
        );
        return [...filtered, newMeal];
      });
    } catch {
      toast.error("Impossible d'ajouter au planning. Réessaie.");
    }
  };

  const handleRemoveFromPlanning = async (
    date: string,
    mealPeriod: MealPeriod,
    courseType: CourseType,
  ) => {
    try {
      await removeFromPlanning(date, mealPeriod, courseType);
      setPlannedMeals((prev) =>
        prev.filter(
          (meal) =>
            !(
              meal.date === date &&
              meal.mealPeriod === mealPeriod &&
              meal.courseType === courseType
            ),
        ),
      );
    } catch {
      toast.error('Impossible de retirer du planning. Réessaie.');
    }
  };

  const loadWeekMeals = useCallback(async (weekStart: Date) => {
    try {
      const meals = await getPlannedMeals(weekStart);
      setPlannedMeals((prev) => {
        const weekStartDate = weekDayToDate('monday', weekStart);
        const weekEndDate = weekDayToDate('sunday', weekStart);
        const filtered = prev.filter(
          (meal) => meal.date < weekStartDate || meal.date > weekEndDate,
        );
        return [...filtered, ...meals];
      });
    } catch {
      toast.error('Impossible de charger le planning. Réessaie.');
    }
  }, []);

  const handleAddMealIdea = async (recipeId: string) => {
    try {
      const newIdea = await addMealIdea(recipeId);
      setMealIdeas((prev) => [...prev, newIdea]);
    } catch {
      toast.error("Impossible d'ajouter l'idée. Réessaie.");
    }
  };

  const handleRemoveMealIdea = async (recipeId: string) => {
    try {
      await removeMealIdea(recipeId);
      setMealIdeas((prev) => prev.filter((idea) => idea.recipeId !== recipeId));
    } catch {
      toast.error("Impossible de retirer l'idée. Réessaie.");
    }
  };

  return (
    <PlannerContext.Provider
      value={{
        plannedMeals,
        loadWeekMeals,
        handleAddToPlanning,
        handleRemoveFromPlanning,
        mealIdeas,
        handleAddMealIdea,
        handleRemoveMealIdea,
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
