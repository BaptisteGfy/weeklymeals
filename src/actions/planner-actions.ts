'use server';

import { toDateTime, toISODate } from '@/features/planner/utils/date';
import { getCurrentSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { CourseType, MealPeriod, PlannedMeal } from '@/types/planner';

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
    servings: meal.servings,
    recipeId: meal.recipeId,
  }));
};

export const addToPlanning = async (
  date: string,
  mealPeriod: MealPeriod,
  courseType: CourseType,
  recipeId: string,
  servings: number,
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
    update: { recipeId, servings },
    create: {
      date: toDateTime(date),
      mealPeriod,
      courseType,
      recipeId,
      servings,
      userId: session.user.id,
    },
  });

  return {
    id: meal.id,
    date: toISODate(meal.date),
    mealPeriod: meal.mealPeriod as MealPeriod,
    courseType: meal.courseType as CourseType,
    servings: meal.servings,
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
