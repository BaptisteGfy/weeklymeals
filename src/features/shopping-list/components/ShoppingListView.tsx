'use client';

import clsx from 'clsx';
import { useState } from 'react';

import type { PlannedMeal } from '../../planner/types';
import { unitLabels } from '../../recipes/constants';
import type { Recipe } from '../../recipes/types';
import { buildShoppingList } from '../utils/buildShoppingList';

type Props = {
  plannedMeals: PlannedMeal[];
  recipes: Recipe[];
};

export const ShoppingListView = ({ recipes, plannedMeals }: Props) => {
  const shoppingList = buildShoppingList(plannedMeals, recipes);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (name: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-2xl font-semibold">Liste de courses</h2>
      {shoppingList.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun ingrédient</p>
      ) : (
        <ul className="mt-2 space-y-2 text-sm">
          {shoppingList.map((item) => {
            const isChecked = checkedItems.has(item.name);
            const label =
              item.unit !== 'unit'
                ? `${item.quantity} ${unitLabels[item.unit]} de ${item.name}`
                : `${item.quantity} ${item.name}`;
            return (
              <li key={item.name}>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleItem(item.name)}
                    className="h-4 w-4 cursor-pointer"
                  />
                  <span
                    className={clsx(isChecked && 'text-slate-400 line-through')}
                  >
                    {label}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
