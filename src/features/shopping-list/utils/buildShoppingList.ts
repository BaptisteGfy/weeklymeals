import type { PlannedMeal } from '../../planner/types';
import type { Recipe } from '../../recipes/types';
import type { ShoppingListItem } from '../types';
import { convertUnit } from './convertUnit';

export const buildShoppingList = (
  plannedMeals: PlannedMeal[],
  recipes: Recipe[],
): ShoppingListItem[] => {
  const allIngredients = plannedMeals.flatMap((meal) => {
    const recipe = recipes.find((r) => r.id === meal.recipeId);
    if (!recipe) return [];
    return recipe.ingredients.map(({ name, quantity, unit }) => ({
      name,
      quantity,
      unit,
    }));
  });

  const grouped = allIngredients.reduce(
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
  );

  return Object.values(grouped).map(convertUnit);
};
