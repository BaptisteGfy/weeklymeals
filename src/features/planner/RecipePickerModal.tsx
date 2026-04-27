'use client';

import type { Recipe } from '../recipes/types';
import { mealTypeLabels, weekDayLabels } from './constants';
import type { MealType, WeekDay } from './types';

type Props = {
  selectedSlot: { day: WeekDay; mealType: MealType };
  recipes: Recipe[];
  onSelectRecipe: (recipeId: string) => void;
  onClose: () => void;
};

export const RecipePickerModal = ({
  selectedSlot,
  recipes,
  onSelectRecipe,
  onClose,
}: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Choisir une recette</h3>
            <p className="mt-1 text-sm text-slate-500">
              {weekDayLabels[selectedSlot.day]} —{' '}
              {mealTypeLabels[selectedSlot.mealType]}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            Fermer
          </button>
        </div>

        <div className="mt-4 max-h-60 overflow-y-auto">
          {recipes.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune recette disponible</p>
          ) : (
            <ul className="space-y-2">
              {recipes.map((recipe) => (
                <li key={recipe.id}>
                  <button
                    type="button"
                    onClick={() => onSelectRecipe(recipe.id)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-left text-sm transition hover:bg-slate-50"
                  >
                    {recipe.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
