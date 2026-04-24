import type { PlannedMeal } from '../planner/types';
import type { Recipe } from '../recipes/types';
import type { ShoppingListItem } from './types';

export const buildShoppingList = (
  plannedMeals: PlannedMeal[],
  recipes: Recipe[],
): ShoppingListItem[] => {
  return Object.values(
    plannedMeals
      .flatMap((meal) => {
        const recipe = recipes.find((r) => r.id === meal.recipeId);

        if (!recipe) return [];

        return recipe.ingredients.map((ingredient) => ({
          id: crypto.randomUUID(),
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        }));
      })
      .reduce(
        (acc, item) => {
          if (acc[item.name]) {
            acc[item.name] = {
              ...acc[item.name],
              quantity: acc[item.name].quantity + item.quantity,
            };
          } else {
            acc[item.name] = { ...item };
          }
          return acc;
        },
        {} as Record<string, ShoppingListItem>,
      ),
  );
};
