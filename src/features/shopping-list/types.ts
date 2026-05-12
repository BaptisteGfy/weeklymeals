import type { IngredientUnit } from '@/features/recipes/types';

export type ShoppingListItem = {
  name: string;
  quantity: number;
  unit: IngredientUnit;
};
