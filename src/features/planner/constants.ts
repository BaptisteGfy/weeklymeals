import type { CourseType, MealPeriod, WeekDay } from './types';

export const weekDays: WeekDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const weekDayLabels: Record<WeekDay, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

export const mealPeriods: MealPeriod[] = ['breakfast', 'lunch', 'dinner'];

export const mealPeriodLabels: Record<MealPeriod, string> = {
  breakfast: 'Matin',
  lunch: 'Midi',
  dinner: 'Soir',
};

export const courseTypeLabels: Record<CourseType, string> = {
  starter: 'Entrée',
  main: 'Plat',
  dessert: 'Dessert',
};

export type GridRow = {
  mealPeriod: MealPeriod;
  courseType: CourseType;
  label: string;
  pickerLabel: string;
};

export const PLANNER_ROWS: GridRow[] = [
  {
    mealPeriod: 'breakfast',
    courseType: 'main',
    label: 'Matin',
    pickerLabel: 'Matin',
  },
  {
    mealPeriod: 'lunch',
    courseType: 'starter',
    label: 'Entrée',
    pickerLabel: 'Entrée (midi)',
  },
  {
    mealPeriod: 'lunch',
    courseType: 'main',
    label: 'Midi',
    pickerLabel: 'Midi',
  },
  {
    mealPeriod: 'lunch',
    courseType: 'dessert',
    label: 'Dessert',
    pickerLabel: 'Dessert (midi)',
  },
  {
    mealPeriod: 'dinner',
    courseType: 'starter',
    label: 'Entrée',
    pickerLabel: 'Entrée (soir)',
  },
  {
    mealPeriod: 'dinner',
    courseType: 'main',
    label: 'Soir',
    pickerLabel: 'Soir',
  },
  {
    mealPeriod: 'dinner',
    courseType: 'dessert',
    label: 'Dessert',
    pickerLabel: 'Dessert (soir)',
  },
];

// Utilisé dans le dashboard (aperçu simplifié : midi + soir uniquement)
export const dashboardMealPeriods: MealPeriod[] = ['lunch', 'dinner'];
