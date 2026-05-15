'use server';

import type { IngredientCategory, IngredientUnit } from '@/features/recipes/types';
import type { ShoppingListItem } from '@/features/shopping-list/types';
import { getCurrentSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export type PersistedShoppingListItem = ShoppingListItem & { isChecked: boolean };

export const syncShoppingList = async (
  weekStart: Date,
  items: ShoppingListItem[],
): Promise<PersistedShoppingListItem[]> => {
  const session = await getCurrentSession();
  if (!session) throw new Error('User is not authenticated');

  const userId = session.user.id;

  await prisma.$transaction(async (tx) => {
    // Upsert tous les items calculés (préserve isChecked si l'item existait déjà)
    for (const item of items) {
      await tx.shoppingList.upsert({
        where: { userId_weekStart_name: { userId, weekStart, name: item.name } },
        update: { quantity: item.quantity, unit: item.unit, category: item.category },
        create: {
          userId,
          weekStart,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          isChecked: false,
        },
      });
    }

    // Supprime les items qui ne sont plus dans la liste calculée
    const currentNames = items.map((i) => i.name);
    await tx.shoppingList.deleteMany({
      where: { userId, weekStart, name: { notIn: currentNames } },
    });
  });

  const rows = await prisma.shoppingList.findMany({
    where: { userId, weekStart },
    orderBy: { name: 'asc' },
  });

  return rows.map((row) => ({
    name: row.name,
    quantity: row.quantity,
    unit: row.unit as IngredientUnit,
    category: row.category as IngredientCategory,
    isChecked: row.isChecked,
  }));
};

export const toggleCheckedItem = async (
  weekStart: Date,
  name: string,
  isChecked: boolean,
): Promise<void> => {
  const session = await getCurrentSession();
  if (!session) throw new Error('User is not authenticated');

  await prisma.shoppingList.update({
    where: {
      userId_weekStart_name: {
        userId: session.user.id,
        weekStart,
        name,
      },
    },
    data: { isChecked },
  });
};

export const resetCheckedItems = async (weekStart: Date): Promise<void> => {
  const session = await getCurrentSession();
  if (!session) throw new Error('User is not authenticated');

  await prisma.shoppingList.updateMany({
    where: { userId: session.user.id, weekStart },
    data: { isChecked: false },
  });
};

export const checkAllItems = async (weekStart: Date): Promise<void> => {
  const session = await getCurrentSession();
  if (!session) throw new Error('User is not authenticated');

  await prisma.shoppingList.updateMany({
    where: { userId: session.user.id, weekStart },
    data: { isChecked: true },
  });
};
