'use server';

import type {
  CourseType,
  MealPeriod,
  PlannedMeal,
} from '@/features/planner/types';
import { getCurrentSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const toDateTime = (isoDate: string): Date => new Date(isoDate + 'T12:00:00Z');

const toISODate = (date: Date): string => date.toISOString().split('T')[0];

export const getPlannedMeals = async (
  weekStart: Date,
): Promise<PlannedMeal[]> => {
  const session = await getCurrentSession();
  if (!session) throw new Error('User is not authenticated');

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const meals = await prisma.plannedMeal.findMany({
    where: {
      userId: session.user.id,
      date: { gte: weekStart, lte: weekEnd },
    },
  });

  return meals.map((meal) => ({
    id: meal.id,
    date: toISODate(meal.date),
    mealPeriod: meal.mealPeriod as MealPeriod,
    courseType: meal.courseType as CourseType,
    recipeId: meal.recipeId,
  }));
};

export const addToPlanning = async (
  date: string,
  mealPeriod: MealPeriod,
  courseType: CourseType,
  recipeId: string,
): Promise<PlannedMeal> => {
  const session = await getCurrentSession();
  if (!session) throw new Error('User is not authenticated');

  const meal = await prisma.plannedMeal.upsert({
    where: {
      userId_date_mealPeriod_courseType: {
        userId: session.user.id,
        date: toDateTime(date),
        mealPeriod,
        courseType,
      },
    },
    update: { recipeId },
    create: {
      date: toDateTime(date),
      mealPeriod,
      courseType,
      recipeId,
      userId: session.user.id,
    },
  });

  return {
    id: meal.id,
    date: toISODate(meal.date),
    mealPeriod: meal.mealPeriod as MealPeriod,
    courseType: meal.courseType as CourseType,
    recipeId: meal.recipeId,
  };
};

export const removeFromPlanning = async (
  date: string,
  mealPeriod: MealPeriod,
  courseType: CourseType,
): Promise<void> => {
  const session = await getCurrentSession();
  if (!session) throw new Error('User is not authenticated');

  await prisma.plannedMeal.delete({
    where: {
      userId_date_mealPeriod_courseType: {
        userId: session.user.id,
        date: toDateTime(date),
        mealPeriod,
        courseType,
      },
    },
  });
};
