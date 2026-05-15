import type { IngredientCategory, IngredientUnit } from './recipes';

export type ShoppingListItem = {
  name: string;
  quantity: number;
  unit: IngredientUnit;
  category: IngredientCategory;
};

export type PersistedShoppingListItem = ShoppingListItem & {
  isChecked: boolean;
};
