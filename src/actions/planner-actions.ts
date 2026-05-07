'use server';

import { headers } from 'next/headers';

import type { MealType, PlannedMeal } from '@/features/planner/types';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const toDateTime = (isoDate: string): Date => new Date(isoDate + 'T12:00:00');

const toISODate = (date: Date): string => date.toISOString().split('T')[0];

export const getPlannedMeals = async (weekStart: Date): Promise<PlannedMeal[]> => {
  const session = await auth.api.getSession({ headers: await headers() });
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
    mealType: meal.mealType as MealType,
    recipeId: meal.recipeId,
  }));
};

export const addToPlanning = async (
  date: string,
  mealType: MealType,
  recipeId: string,
): Promise<PlannedMeal> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('User is not authenticated');

  const meal = await prisma.plannedMeal.upsert({
    where: {
      userId_date_mealType: {
        userId: session.user.id,
        date: toDateTime(date),
        mealType,
      },
    },
    update: { recipeId },
    create: {
      date: toDateTime(date),
      mealType,
      recipeId,
      userId: session.user.id,
    },
  });

  return {
    id: meal.id,
    date: toISODate(meal.date),
    mealType: meal.mealType as MealType,
    recipeId: meal.recipeId,
  };
};

export const removeFromPlanning = async (
  date: string,
  mealType: MealType,
): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('User is not authenticated');

  await prisma.plannedMeal.delete({
    where: {
      userId_date_mealType: {
        userId: session.user.id,
        date: toDateTime(date),
        mealType,
      },
    },
  });
};
