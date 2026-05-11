'use server';

import { getCurrentSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const getAdminStats = async () => {
  const session = await getCurrentSession();

  if (!session || session.user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const [userCount, recipeCount, plannedMealCount] = await Promise.all([
    prisma.user.count(),
    prisma.recipe.count(),
    prisma.plannedMeal.count(),
  ]);

  return { userCount, recipeCount, plannedMealCount };
};
