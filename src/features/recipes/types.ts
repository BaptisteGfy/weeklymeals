export type IngredientUnit =
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'cac' // cuillère à café
  | 'cas' // cuillère à soupe
  | 'unit';

export const unitLabels: Record<IngredientUnit, string> = {
  g: 'g',
  kg: 'kg',
  ml: 'ml',
  l: 'l',
  cac: 'cuillère à café',
  cas: 'cuillère à soupe',
  unit: 'pièce',
};

export type Ingredient = {
  id: string;
  name: string;
  quantity: number;
  unit: IngredientUnit;
};

export type IngredientDraft = {
  name: string;
  quantity: number;
  unit: IngredientUnit;
};

export type RecipeCategory = 'breakfast' | 'lunch' | 'dinner' | 'dessert';

export const categoryLabels: Record<RecipeCategory, string> = {
  breakfast: 'Petit-déjeuner',
  lunch: 'Déjeuner',
  dinner: 'Dîner',
  dessert: 'Dessert',
};

export type Instruction = {
  id: string;
  text: string;
};

export type Recipe = {
  id: string;
  imageUrl?: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  servings: number;
  prepTimeMinutes: number;
  category: RecipeCategory;
};

export type RecipeFormValues = {
  title: string;
  description: string;
  servings: number;
  prepTimeMinutes: number;
  category: RecipeCategory;
  ingredients: Ingredient[];
  instructions: Instruction[];
};
