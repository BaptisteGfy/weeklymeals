import type { MealType, WeekDay } from './types';

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

export const mealTypes: MealType[] = ['lunch', 'dinner'];

export const mealTypeLabels: Record<MealType, string> = {
  lunch: 'Midi',
  dinner: 'Soir',
};
