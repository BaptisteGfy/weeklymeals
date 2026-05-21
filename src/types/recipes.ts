export type IngredientUnit = 'g' | 'kg' | 'ml' | 'l' | 'cac' | 'cas' | 'unit';

export type IngredientCategory =
  | 'vegetables'
  | 'tubers'
  | 'fruits'
  | 'legumes'
  | 'nuts'
  | 'mushrooms'
  | 'meat'
  | 'deli'
  | 'eggs'
  | 'fish'
  | 'shellfish'
  | 'dairy'
  | 'cereals'
  | 'bread'
  | 'oils'
  | 'fats'
  | 'sweeteners'
  | 'sweets'
  | 'pastry'
  | 'beverages'
  | 'alcohol'
  | 'spices'
  | 'herbs'
  | 'condiments'
  | 'plant_proteins'
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
  isLibrary: boolean;
  isPublic: boolean;
  isSaved: boolean;
  createdAt: string;
};

export type RecipeFormValues = {
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
  isPublic: boolean;
};
