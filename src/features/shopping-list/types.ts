import type { IngredientUnit } from '../recipes/types';

export type ShoppingListItem = {
  id: string;
  name: string;
  quantity: number;
  unit: IngredientUnit;
};
