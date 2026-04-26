'use client';

import { useDashboard } from '@/context/DashboardContext';
import { PlannerSection } from '@/features/planner/PlannerSection';
import { ShoppingListSection } from '@/features/shopping-list/ShoppingListSection';

const PlannerPage = () => {
  const { recipeList, plannedMeals, setPlannedMeals } = useDashboard();
  return (
    <>
      <PlannerSection
        recipes={recipeList}
        plannedMeals={plannedMeals}
        setPlannedMeals={setPlannedMeals}
      />

      <ShoppingListSection recipes={recipeList} plannedMeals={plannedMeals} />
    </>
  );
};

export default PlannerPage;
