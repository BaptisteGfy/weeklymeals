export type IngredientUnit = 'g' | 'kg' | 'ml' | 'l' | 'cac' | 'cas' | 'unit';

export type IngredientCategory =
  | 'vegetables'
  | 'fruits'
  | 'meat'
  | 'fish'
  | 'dairy'
  | 'cereals'
  | 'legumes'
  | 'oils'
  | 'condiments'
  | 'spices'
  | 'nuts'
  | 'other';

export type RecipeCategory = 'breakfast' | 'lunch' | 'dinner' | 'dessert';

export type Ingredient = {
  id: string;
  name: string;
  quantity: number;
  unit: IngredientUnit;
  category: IngredientCategory;
};

export type IngredientDraft = {
  name: string;
  quantity: number;
  unit: IngredientUnit;
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
  prepTimeMinutes: number | undefined;
  cookTimeMinutes: number | undefined;
  restTimeMinutes: number | undefined;
  category: RecipeCategory;
};

export type RecipeFormValues = {
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  servings: number;
  prepTimeMinutes: number | undefined;
  cookTimeMinutes: number | undefined;
  restTimeMinutes: number | undefined;
  category: RecipeCategory;
};
