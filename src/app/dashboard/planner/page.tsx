'use client';

import { useEffect, useState } from 'react';

import { usePlanner } from '@/context/PlannerContext';
import { useRecipes } from '@/context/RecipesContext';
import { PlannerGridView } from '@/features/planner/components/PlannerGridView';
import { getWeekStart, weekDayToDate } from '@/features/planner/utils/date';

const PlannerPage = () => {
  const { recipes } = useRecipes();
  const {
    plannedMeals,
    handleAddToPlanning,
    handleRemoveFromPlanning,
    loadWeekMeals,
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
    <PlannerGridView
      recipes={recipes}
      plannedMeals={currentWeekMeals}
      weekStart={weekStart}
      onPrevWeek={() => setWeekOffset((o) => o - 1)}
      onNextWeek={() => setWeekOffset((o) => o + 1)}
      onCurrentWeek={() => setWeekOffset(0)}
      onAddToPlanning={handleAddToPlanning}
      onRemoveFromPlanning={handleRemoveFromPlanning}
    />
  );
};

export default PlannerPage;
