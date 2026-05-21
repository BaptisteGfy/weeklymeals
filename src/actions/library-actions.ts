'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { RecipeCategory } from '@/types/recipes';

export type LibraryRecipe = {
  id: string;
  title: string;
  description: string;
  category: RecipeCategory;
  servings: number;
  prepTimeMinutes: number | undefined;
  cookTimeMinutes: number | undefined;
  imageUrl: string | undefined;
  isLibrary: boolean;
  isPublic: boolean;
  authorName: string | null;
};

export const getLibraryRecipes = async (): Promise<{
  recipes: LibraryRecipe[];
  savedRecipeIds: string[];
}> => {
  const session = await getCurrentSession();
  if (!session) throw new Error('Non authentifié');

  const [recipes, savedRecipes] = await Promise.all([
    prisma.recipe.findMany({
      where: { OR: [{ isLibrary: true }, { isPublic: true }] },
      include: { user: { select: { name: true } } },
      orderBy: [{ isLibrary: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.savedRecipe.findMany({
      where: { userId: session.user.id },
      select: { recipeId: true },
    }),
  ]);

  return {
    recipes: recipes.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category,
      servings: r.servings,
      prepTimeMinutes: r.prepTimeMinutes ?? undefined,
      cookTimeMinutes: r.cookTimeMinutes ?? undefined,
      imageUrl: r.imageUrl ?? undefined,
      isLibrary: r.isLibrary,
      isPublic: r.isPublic,
      authorName: r.isLibrary ? null : r.user.name,
    })),
    savedRecipeIds: savedRecipes.map((s) => s.recipeId),
  };
};

export const saveRecipe = async (recipeId: string) => {
  const session = await getCurrentSession();
  if (!session) throw new Error('Non authentifié');

  await prisma.savedRecipe.upsert({
    where: { userId_recipeId: { userId: session.user.id, recipeId } },
    create: { userId: session.user.id, recipeId },
    update: {},
  });

  revalidatePath('/dashboard/library');
  revalidatePath('/dashboard/recipes');
};

export const unsaveRecipe = async (recipeId: string) => {
  const session = await getCurrentSession();
  if (!session) throw new Error('Non authentifié');

  await prisma.savedRecipe.deleteMany({
    where: { userId: session.user.id, recipeId },
  });

  revalidatePath('/dashboard/library');
  revalidatePath('/dashboard/recipes');
};
