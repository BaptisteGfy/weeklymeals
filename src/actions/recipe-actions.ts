'use server';

import { headers } from 'next/headers';

import {
  IngredientUnit,
  Recipe,
  RecipeCategory,
  RecipeFormValues,
} from '@/features/recipes/types';
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

export const createRecipe = async (
  values: RecipeFormValues,
): Promise<Recipe> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error('User is not authenticated');
  }
  const created = await prisma.recipe.create({
    data: {
      title: values.title,
      description: values.description,
      servings: values.servings,
      prepTimeMinutes: values.prepTimeMinutes,
      cookTimeMinutes: values.cookTimeMinutes,
      restTimeMinutes: values.restTimeMinutes,
      category: values.category,
      instructions: values.instructions.map((i) => i.text),
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

  return {
    id: created.id,
    title: created.title,
    description: created.description,
    servings: created.servings,
    prepTimeMinutes: created.prepTimeMinutes ?? undefined,
    cookTimeMinutes: created.cookTimeMinutes ?? undefined,
    restTimeMinutes: created.restTimeMinutes ?? undefined,
    category: created.category as RecipeCategory,
    ingredients: created.ingredients.map((ri) => ({
      id: ri.id,
      name: ri.ingredient.nameFr,
      quantity: ri.quantity,
      unit: ri.unit as IngredientUnit,
    })),
    instructions: created.instructions.map((text, index) => ({
      id: String(index),
      text,
    })),
  };
};

export const updateRecipe = async (
  id: string,
  values: RecipeFormValues,
): Promise<Recipe> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error('User is not authenticated');
  }

  const updated = await prisma.recipe.update({
    where: { id, userId: session.user.id },
    data: {
      title: values.title,
      description: values.description,
      servings: values.servings,
      prepTimeMinutes: values.prepTimeMinutes,
      cookTimeMinutes: values.cookTimeMinutes,
      restTimeMinutes: values.restTimeMinutes,
      category: values.category,
      instructions: values.instructions.map((i) => i.text),
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

  return {
    id: updated.id,
    imageUrl: updated.imageUrl ?? undefined,
    title: updated.title,
    description: updated.description,
    servings: updated.servings,
    prepTimeMinutes: updated.prepTimeMinutes ?? undefined,
    cookTimeMinutes: updated.cookTimeMinutes ?? undefined,
    restTimeMinutes: updated.restTimeMinutes ?? undefined,
    category: updated.category as RecipeCategory,
    ingredients: updated.ingredients.map((ri) => ({
      id: ri.id,
      name: ri.ingredient.nameFr,
      quantity: ri.quantity,
      unit: ri.unit as IngredientUnit,
    })),
    instructions: updated.instructions.map((text, index) => ({
      id: String(index),
      text,
    })),
  };
};

export const deleteRecipe = async (id: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error('User is not authenticated');
  }
  await prisma.recipe.delete({
    where: { id, userId: session.user.id },
  });
};
