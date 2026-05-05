'use server';

import { headers } from 'next/headers';

import { IngredientUnit, RecipeCategory } from '@/features/recipes/types';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const getRecipes = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error('User is not authenticated');
  }
  const recipes = await prisma.recipe.findMany({
    where: { userId: session.user.id },
    include: {
      ingredients: {
        include: { ingredient: true },
      },
    },
  });

  return recipes.map((recipe) => ({
    id: recipe.id,
    imageUrl: recipe.imageUrl ?? undefined,
    title: recipe.title,
    description: recipe.description,
    servings: recipe.servings,
    prepTimeMinutes: recipe.prepTimeMinutes ?? undefined,
    cookTimeMinutes: recipe.cookTimeMinutes ?? undefined,
    restTimeMinutes: recipe.restTimeMinutes ?? undefined,
    category: recipe.category as RecipeCategory,
    ingredients: recipe.ingredients.map((ri) => ({
      id: ri.id,
      name: ri.ingredient.nameFr, // ou nameEn selon la langue que tu veux afficher
      quantity: ri.quantity,
      unit: ri.unit as IngredientUnit,
    })),
    instructions: recipe.instructions.map((text, index) => ({
      id: String(index),
      text,
    })),
  }));
};
