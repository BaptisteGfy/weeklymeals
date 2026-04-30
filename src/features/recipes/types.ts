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

export type IngredientDraft = {
  name: string;
  quantity: number;
  unit: IngredientUnit;
};

export type RecipeCategory = 'breakfast' | 'lunch' | 'dinner' | 'dessert';


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
  category: RecipeCategory;
};

export type RecipeFormValues = {
  title: string;
  description: string;
  servings: number;
  prepTimeMinutes: number | undefined;
  category: RecipeCategory;
  ingredients: Ingredient[];
  instructions: Instruction[];
};
