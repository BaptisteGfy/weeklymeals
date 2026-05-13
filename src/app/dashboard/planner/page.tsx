'use client';

import { useEffect, useState } from 'react';

import { usePlanner } from '@/context/PlannerContext';
import { useRecipes } from '@/context/RecipesContext';
import { MealIdeasSection } from '@/features/planner/components/MealIdeasSection';
import { PlannerView } from '@/features/planner/components/PlannerView';
import { getWeekStart, weekDayToDate } from '@/features/planner/utils/date';
import { ShoppingListView } from '@/features/shopping-list/components/ShoppingListView';

const PlannerPage = () => {
  const { recipes } = useRecipes();
  const {
    plannedMeals,
    handleAddToPlanning,
    handleRemoveFromPlanning,
    loadWeekMeals,
    mealIdeas,
    handleAddMealIdea,
    handleRemoveMealIdea,
  } = usePlanner();
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = getWeekStart(weekOffset);
  const weekStartDate = weekDayToDate('monday', weekStart);
  const weekEndDate = weekDayToDate('sunday', weekStart);

  const currentWeekMeals = plannedMeals.filter(
    (meal) => meal.date >= weekStartDate && meal.date <= weekEndDate,
  );

  useEffect(() => {
    if (weekOffset !== 0) {
      loadWeekMeals(getWeekStart(weekOffset));
    }
  }, [weekOffset, loadWeekMeals]);

  return (
    <>
      <MealIdeasSection
        recipes={recipes}
        mealIdeas={mealIdeas}
        onAddMealIdea={handleAddMealIdea}
        onRemoveMealIdea={handleRemoveMealIdea}
      />

      <PlannerView
        recipes={recipes}
        plannedMeals={currentWeekMeals}
        weekStart={weekStart}
        onPrevWeek={() => setWeekOffset((o) => o - 1)}
        onNextWeek={() => setWeekOffset((o) => o + 1)}
        onAddToPlanning={handleAddToPlanning}
        onRemoveFromPlanning={handleRemoveFromPlanning}
      />

      <ShoppingListView recipes={recipes} plannedMeals={currentWeekMeals} />
    </>
  );
};

export default PlannerPage;
