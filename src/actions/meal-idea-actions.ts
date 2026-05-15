'use server';

import { getCurrentSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { MealIdea } from '@/types/planner';

export const getMealIdeas = async (): Promise<MealIdea[]> => {
  const session = await getCurrentSession();
  if (!session) throw new Error('User is not authenticated');

  const ideas = await prisma.mealIdea.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
  });

  return ideas.map((idea) => ({
    id: idea.id,
    recipeId: idea.recipeId,
  }));
};

export const addMealIdea = async (recipeId: string): Promise<MealIdea> => {
  const session = await getCurrentSession();
  if (!session) throw new Error('User is not authenticated');

  const idea = await prisma.mealIdea.create({
    data: { userId: session.user.id, recipeId },
  });

  return { id: idea.id, recipeId: idea.recipeId };
};

export const removeMealIdea = async (recipeId: string): Promise<void> => {
  const session = await getCurrentSession();
  if (!session) throw new Error('User is not authenticated');

  await prisma.mealIdea.delete({
    where: {
      userId_recipeId: { userId: session.user.id, recipeId },
    },
  });
};
