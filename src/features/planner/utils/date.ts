import { weekDays } from '@/features/planner/constants';
import type { WeekDay } from '@/features/planner/types';

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
  const fmt = (d: Date) =>
    d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  return `${fmt(weekStart)} – ${fmt(weekEnd)}`;
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
