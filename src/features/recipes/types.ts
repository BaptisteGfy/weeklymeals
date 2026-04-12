export type IngredientUnit =
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'cac' // cuillère à café
  | 'cas' // cuillère à soupe
  | 'unit';

export type Ingredient = {
  id: string;
  name: string;
  quantity: number;
  unit: IngredientUnit;
};

export type RecipeCategory = 'breakfast' | 'lunch' | 'dinner' | 'dessert';

export type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  servings: number;
  prepTimeMinutes: number;
  category: RecipeCategory;
};
