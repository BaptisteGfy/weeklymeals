import { getPlannedMeals } from '@/actions/planner-actions';
import { getRecipes } from '@/actions/recipe-actions';
import { syncShoppingList } from '@/actions/shopping-list-actions';
import { getWeekStart } from '@/features/planner/utils/date';
import { ShoppingListPageView } from '@/features/shopping-list/components/ShoppingListPageView';
import { buildShoppingList } from '@/features/shopping-list/utils/buildShoppingList';

export default async function ShoppingListPage() {
  const weekStart = getWeekStart(0);

  const [recipes, plannedMeals] = await Promise.all([
    getRecipes(),
    getPlannedMeals(weekStart),
  ]);

  const computed = buildShoppingList(plannedMeals, recipes);
  const items = await syncShoppingList(weekStart, computed);

  return (
    <ShoppingListPageView
      initialItems={items}
      initialPlannedMeals={plannedMeals}
      recipes={recipes}
    />
  );
}
