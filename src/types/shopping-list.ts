import type { IngredientCategory, IngredientUnit } from './recipes';

export type ShoppingListItem = {
  name: string;
  quantity: number;
  unit: IngredientUnit;
  category: IngredientCategory;
  isChecked: boolean;
};
