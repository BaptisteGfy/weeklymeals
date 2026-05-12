'use client';

import { usePlanner } from '@/context/PlannerContext';
import { useRecipes } from '@/context/RecipesContext';
import { PlannerView } from '@/features/planner/components/PlannerView';
import { ShoppingListView } from '@/features/shopping-list/components/ShoppingListView';

const PlannerPage = () => {
  const { recipes } = useRecipes();
  const { plannedMeals, handleAddToPlanning, handleRemoveFromPlanning } =
    usePlanner();

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
