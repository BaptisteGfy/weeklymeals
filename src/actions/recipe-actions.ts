'use server';

import { Prisma } from '@/generated/prisma/client';
import { getCurrentSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { IngredientCategory } from '@/types/recipes';
import {
  IngredientUnit,
  Recipe,
  RecipeCategory,
  RecipeFormValues,
} from '@/types/recipes';

type RecipeWithIngredients = Prisma.RecipeGetPayload<{
  include: {
    ingredients: { include: { ingredient: true } };
  };
}>;

const transformRecipeFromDB = (recipe: RecipeWithIngredients): Recipe => {
  return {
    id: recipe.id,
    imageUrl: recipe.imageUrl ?? undefined,
    title: recipe.title,
    description: recipe.description,
    servings: recipe.servings,
    prepTimeMinutes: recipe.prepTimeMinutes ?? undefined,
    cookTimeMinutes: recipe.cookTimeMinutes ?? undefined,
    restTimeMinutes: recipe.restTimeMinutes ?? undefined,
    category: recipe.category as RecipeCategory,
    isLibrary: recipe.isLibrary,
    isPublic: recipe.isPublic,
    ingredients: recipe.ingredients.map((ri) => ({
      id: ri.id,
      name: ri.ingredient.nameFr,
      quantity: ri.quantity,
      unit: ri.unit as IngredientUnit,
      category: ri.ingredient.category as IngredientCategory,
    })),
    instructions: recipe.instructions.map((text) => ({
      id: crypto.randomUUID(),
      text,
    })),
  };
};

export const getRecipes = async () => {
  const session = await getCurrentSession();
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

  return recipes.map(transformRecipeFromDB);
};

export const createRecipe = async (
  values: RecipeFormValues,
): Promise<Recipe> => {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error('User is not authenticated');
  }
  const created = await prisma.recipe.create({
    data: {
      imageUrl: values.imageUrl,
      title: values.title,
      description: values.description,
      servings: values.servings,
      prepTimeMinutes: values.prepTimeMinutes,
      cookTimeMinutes: values.cookTimeMinutes,
      restTimeMinutes: values.restTimeMinutes,
      category: values.category,
      instructions: values.instructions.map((i) => i.text),
      isPublic: values.isPublic,
      userId: session.user.id,
      ingredients: {
        create: values.ingredients.map((ing) => ({
          quantity: ing.quantity,
          unit: ing.unit,
          ingredient: {
            connectOrCreate: {
              where: { nameFr: ing.name },
              create: { nameFr: ing.name, nameEn: ing.name, category: 'other' },
            },
          },
        })),
      },
    },
    include: {
      ingredients: {
        include: { ingredient: true },
      },
    },
  });

  return transformRecipeFromDB(created);
};

export const updateRecipe = async (
  id: string,
  values: RecipeFormValues,
): Promise<Recipe> => {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error('User is not authenticated');
  }

  const updated = await prisma.recipe.update({
    where: { id, userId: session.user.id },
    data: {
      imageUrl: values.imageUrl,
      title: values.title,
      description: values.description,
      servings: values.servings,
      prepTimeMinutes: values.prepTimeMinutes,
      cookTimeMinutes: values.cookTimeMinutes,
      restTimeMinutes: values.restTimeMinutes,
      category: values.category,
      instructions: values.instructions.map((i) => i.text),
      isPublic: values.isPublic,
      ingredients: {
        deleteMany: {},
        create: values.ingredients.map((ing) => ({
          quantity: ing.quantity,
          unit: ing.unit,
          ingredient: {
            connectOrCreate: {
              where: { nameFr: ing.name },
              create: { nameFr: ing.name, nameEn: ing.name, category: 'other' },
            },
          },
        })),
      },
    },
    include: {
      ingredients: {
        include: { ingredient: true },
      },
    },
  });

  return transformRecipeFromDB(updated);
};

export const deleteRecipe = async (id: string) => {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error('User is not authenticated');
  }
  await prisma.recipe.delete({
    where: { id, userId: session.user.id },
  });
};
