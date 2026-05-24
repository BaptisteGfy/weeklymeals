'use server';

import { getCurrentSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { IngredientCategory, IngredientUnit } from '@/types/recipes';
import type { ShoppingListItem } from '@/types/shopping-list';

const mapRow = (row: {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isChecked: boolean;
  isManual: boolean;
}): ShoppingListItem => ({
  name: row.name,
  quantity: row.quantity,
  unit: row.unit as IngredientUnit,
  category: row.category as IngredientCategory,
  isChecked: row.isChecked,
  isManual: row.isManual,
});

export const syncShoppingList = async (
  weekStart: Date,
  items: ShoppingListItem[],
): Promise<ShoppingListItem[]> => {
  const session = await getCurrentSession();
  if (!session) throw new Error('User is not authenticated');

  const userId = session.user.id;

  await prisma.$transaction(async (tx) => {
    for (const item of items) {
      await tx.shoppingList.upsert({
        where: {
          userId_weekStart_name: { userId, weekStart, name: item.name },
        },
        update: {
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
        },
        create: {
          userId,
          weekStart,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          isChecked: false,
          isManual: false,
        },
      });
    }

    const currentNames = items.map((i) => i.name);
    await tx.shoppingList.deleteMany({
      where: {
        userId,
        weekStart,
        name: { notIn: currentNames },
        isManual: false,
      },
    });
  });

  const rows = await prisma.shoppingList.findMany({
    where: { userId, weekStart },
    orderBy: { name: 'asc' },
  });

  return rows.map(mapRow);
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

export const addManualItem = async (
  weekStart: Date,
  name: string,
  quantity: number,
  unit: IngredientUnit,
  category: IngredientCategory,
): Promise<ShoppingListItem> => {
  const session = await getCurrentSession();
  if (!session) throw new Error('User is not authenticated');

  const row = await prisma.shoppingList.create({
    data: {
      userId: session.user.id,
      weekStart,
      name,
      quantity,
      unit,
      category,
      isManual: true,
    },
  });

  return mapRow(row);
};

export const deleteManualItem = async (
  weekStart: Date,
  name: string,
): Promise<void> => {
  const session = await getCurrentSession();
  if (!session) throw new Error('User is not authenticated');

  await prisma.shoppingList.delete({
    where: {
      userId_weekStart_name: {
        userId: session.user.id,
        weekStart,
        name,
      },
    },
  });
};
