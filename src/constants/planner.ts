import type { GridRow, MealPeriod, WeekDay } from '@/types/planner';

export const weekDays: WeekDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const mealPeriods: MealPeriod[] = ['breakfast', 'lunch', 'dinner'];

export const dashboardMealPeriods: MealPeriod[] = ['lunch', 'dinner'];

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
