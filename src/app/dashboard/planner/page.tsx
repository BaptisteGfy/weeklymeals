'use client';

import { useDashboard } from '@/context/DashboardContext';
import { PlannerView } from '@/features/planner/PlannerView';
import { ShoppingListView } from '@/features/shopping-list/ShoppingListView';

const PlannerPage = () => {
  const {
    recipeList,
    plannedMeals,
    handleAddToPlanning,
    handleRemoveFromPlanning,
  } = useDashboard();

  return (
    <>
      <PlannerView
        recipes={recipeList}
        plannedMeals={plannedMeals}
        onAddToPlanning={handleAddToPlanning}
        onRemoveFromPlanning={handleRemoveFromPlanning}
      />
      <ShoppingListView recipes={recipeList} plannedMeals={plannedMeals} />
    </>
  );
};

export default PlannerPage;
