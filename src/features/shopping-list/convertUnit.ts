import type { ShoppingListItem } from './types';

export const convertUnit = (ingredient: ShoppingListItem): ShoppingListItem => {
  if (ingredient.quantity >= 1000) {
    if (ingredient.unit === 'ml') {
      return {
        ...ingredient,
        quantity: ingredient.quantity / 1000,
        unit: 'l',
      };
    }
    if (ingredient.unit === 'g') {
      return {
        ...ingredient,
        quantity: ingredient.quantity / 1000,
        unit: 'kg',
      };
    }
  }

  return ingredient;
};
