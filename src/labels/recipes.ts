import type { IngredientUnit, RecipeCategory } from '@/types/recipes';

export const unitLabels: Record<IngredientUnit, string> = {
  g: 'g',
  kg: 'kg',
  ml: 'ml',
  l: 'l',
  cac: 'cuillère à café',
  cas: 'cuillère à soupe',
  unit: 'pièce',
};

export const unitShortLabels: Record<IngredientUnit, string> = {
  g: 'g',
  kg: 'kg',
  ml: 'ml',
  l: 'l',
  cac: 'c. à c.',
  cas: 'c. à s.',
  unit: 'pcs',
};

export const categoryLabels: Record<RecipeCategory, string> = {
  breakfast: 'Petit-déjeuner',
  starter: 'Entrée',
  main: 'Plat principal',
  dessert: 'Dessert',
};

export const categoryDotStyles: Record<RecipeCategory, string> = {
  main: 'bg-primary',
  starter: 'bg-accent',
  dessert: 'bg-amber-400',
  breakfast: 'bg-sky-400',
};
