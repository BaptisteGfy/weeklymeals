'use client';

import { useDashboard } from '@/context/DashboardContext';
import { PlannerView } from '@/features/planner/components/PlannerView';
import { ShoppingListView } from '@/features/shopping-list/components/ShoppingListView';

const PlannerPage = () => {
  const {
    recipes,
    plannedMeals,
    handleAddToPlanning,
    handleRemoveFromPlanning,
  } = useDashboard();

  return (
    <>
      <PlannerView
        recipes={recipes}
        plannedMeals={plannedMeals}
        onAddToPlanning={handleAddToPlanning}
        onRemoveFromPlanning={handleRemoveFromPlanning}
      />
      <ShoppingListView recipes={recipes} plannedMeals={plannedMeals} />
    </>
  );
};

export default PlannerPage;
