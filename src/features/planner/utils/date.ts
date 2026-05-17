import { weekDays } from '@/constants/planner';
import type { WeekDay } from '@/types/planner';

export const toDateTime = (isoDate: string): Date =>
  new Date(isoDate + 'T12:00:00Z');

export const toISODate = (date: Date): string =>
  date.toISOString().split('T')[0];

export const getWeekStart = (weekOffset = 0): Date => {
  const today = new Date();
  const diff = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff + weekOffset * 7);
  monday.setHours(12, 0, 0, 0);
  return monday;
};

export const getWeekLabel = (weekStart: Date): string => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const sameMonth = weekStart.getMonth() === weekEnd.getMonth();

  const endMonthYear = weekEnd.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  if (sameMonth) {
    return `Semaine du ${startDay} au ${endDay} ${endMonthYear}`;
  }

  const startMonthLabel = weekStart.toLocaleDateString('fr-FR', {
    month: 'long',
  });
  return `Semaine du ${startDay} ${startMonthLabel} au ${endDay} ${endMonthYear}`;
};

const weekDayOffsets: Record<WeekDay, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

export const weekDayToDate = (day: WeekDay, weekStart: Date): string => {
  const date = new Date(weekStart);
  date.setDate(weekStart.getDate() + weekDayOffsets[day]);
  return date.toISOString().split('T')[0];
};

export const getDayNumber = (day: WeekDay, weekStart: Date): number => {
  const date = new Date(weekStart);
  date.setDate(weekStart.getDate() + weekDayOffsets[day]);
  return date.getDate();
};

export const dateToWeekDay = (isoDate: string): WeekDay => {
  const date = new Date(isoDate + 'T12:00:00');
  const index = (date.getDay() + 6) % 7;
  return weekDays[index];
};
