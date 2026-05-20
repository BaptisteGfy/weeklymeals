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

export const categoryLabels: Record<RecipeCategory, string> = {
  breakfast: 'Petit-déjeuner',
  lunch: 'Déjeuner',
  dinner: 'Dîner',
  dessert: 'Dessert',
};


export const categoryDotStyles: Record<RecipeCategory, string> = {
  dinner: 'bg-primary',
  lunch: 'bg-accent',
  dessert: 'bg-amber-400',
  breakfast: 'bg-sky-400',
};
