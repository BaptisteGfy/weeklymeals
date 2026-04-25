import type { IngredientUnit } from '../recipes/types';

export type ShoppingListItem = {
  name: string;
  quantity: number;
  unit: IngredientUnit;
};
