import type {
  IngredientCategory,
  IngredientUnit,
} from '@/features/recipes/types';

export type ShoppingListItem = {
  name: string;
  quantity: number;
  unit: IngredientUnit;
  category: IngredientCategory;
};
