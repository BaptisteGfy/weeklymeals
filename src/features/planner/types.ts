export type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type MealType = 'lunch' | 'dinner';

export type MealSlot = {
  day: WeekDay;
  mealType: MealType;
};

export type PlannedMeal = {
  id: string;
  date: string; 
  mealType: MealType;
  recipeId: string;
};
