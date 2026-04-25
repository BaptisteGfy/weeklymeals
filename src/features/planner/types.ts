export type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type MealType = 'lunch' | 'dinner';

export type PlannedMeal = {
  id: string;
  day: WeekDay;
  mealType: MealType;
  recipeId: string;
};
