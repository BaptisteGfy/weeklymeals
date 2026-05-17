import type { CourseType, MealPeriod, WeekDay } from '@/types/planner';

export const weekDayLabels: Record<WeekDay, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

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
