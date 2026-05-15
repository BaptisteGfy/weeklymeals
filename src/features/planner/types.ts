export type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type MealPeriod = 'breakfast' | 'lunch' | 'dinner';
export type CourseType = 'starter' | 'main' | 'dessert';

export type MealSlot = {
  day: WeekDay;
  mealPeriod: MealPeriod;
  courseType: CourseType;
};

export type PlannedMeal = {
  id: string;
  date: string;
  mealPeriod: MealPeriod;
  courseType: CourseType;
  recipeId: string;
};

export type MealIdea = {
  id: string;
  recipeId: string;
};
