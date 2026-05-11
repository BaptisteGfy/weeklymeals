'use server';

import { prisma } from '@/lib/prisma';

export const getAdminStats = async () => {
  const [userCount, recipeCount, plannedMealCount] = await Promise.all([
    prisma.user.count(),
    prisma.recipe.count(),
    prisma.plannedMeal.count(),
  ]);

  return { userCount, recipeCount, plannedMealCount };
};
