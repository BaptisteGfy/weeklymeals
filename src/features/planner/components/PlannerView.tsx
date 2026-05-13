'use client';

import clsx from 'clsx';
import { useState } from 'react';

import {
  mealTypeLabels,
  mealTypes,
  weekDayLabels,
  weekDays,
} from '@/features/planner/constants';

import type { MealSlot, MealType, PlannedMeal, WeekDay } from '@/features/planner/types';
import {
  getDayNumber,
  getWeekLabel,
  weekDayToDate,
} from '@/features/planner/utils/date';
import type { Recipe } from '@/features/recipes/types';

import { RecipePickerModal } from './RecipePickerModal';

type Props = {
  recipes: Recipe[];
  plannedMeals: PlannedMeal[];
  weekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onAddToPlanning: (
    date: string,
    mealType: MealType,
    recipeId: string,
  ) => Promise<void>;
  onRemoveFromPlanning: (date: string, mealType: MealType) => Promise<void>;
};

export const PlannerView = ({
  recipes,
  plannedMeals,
  weekStart,
  onPrevWeek,
  onNextWeek,
  onAddToPlanning,
  onRemoveFromPlanning,
}: Props) => {
  const [selectedSlot, setSelectedSlot] = useState<MealSlot | null>(null);

  const getPlannedMeal = (day: WeekDay, mealType: MealType) => {
    const date = weekDayToDate(day, weekStart);
    return plannedMeals.find(
      (meal) => meal.date === date && meal.mealType === mealType,
    );
  };

  const getRecipeById = (id: string): Recipe | undefined =>
    recipes.find((r) => r.id === id);

  const handleSelectRecipe = (recipeId: string) => {
    if (!selectedSlot) return;
    const date = weekDayToDate(selectedSlot.day, weekStart);
    onAddToPlanning(date, selectedSlot.mealType, recipeId);
    setSelectedSlot(null);
  };

  return (
    <section className="mt-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Planning de la semaine</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevWeek}
            className="rounded-md border px-3 py-1.5 text-sm font-medium transition hover:bg-slate-50"
          >
            ←
          </button>
          <span className="min-w-40 text-center text-sm font-medium text-slate-700">
            {getWeekLabel(weekStart)}
          </span>
          <button
            onClick={onNextWeek}
            className="rounded-md border px-3 py-1.5 text-sm font-medium transition hover:bg-slate-50"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {weekDays.map((day) => (
          <article key={day} className="rounded-xl border p-4 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">
              {weekDayLabels[day]} {getDayNumber(day, weekStart)}
            </h3>

            <div className="grid gap-3 md:grid-cols-2">
              {mealTypes.map((mealType) => {
                const plannedMeal = getPlannedMeal(day, mealType);
                const recipe = plannedMeal
                  ? getRecipeById(plannedMeal.recipeId)
                  : undefined;

                return (
                  <div
                    key={mealType}
                    className="rounded-lg border border-dashed p-3"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      {mealTypeLabels[mealType]}
                    </p>

                    {plannedMeal ? (
                      <p className="mt-2 text-sm font-medium text-slate-900">
                        {recipe?.title ?? 'Recette inconnue'}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">
                        Aucun repas planifié
                      </p>
                    )}

                    <div className="mt-2 flex justify-start gap-2">
                      <button
                        onClick={() => setSelectedSlot({ day, mealType })}
                        className={clsx(
                          'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition',
                          'border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50',
                        )}
                      >
                        Choisir une recette
                      </button>

                      {plannedMeal && (
                        <button
                          onClick={() =>
                            onRemoveFromPlanning(
                              weekDayToDate(day, weekStart),
                              mealType,
                            )
                          }
                          className={clsx(
                            'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition',
                            'border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50',
                          )}
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      {selectedSlot !== null && (
        <RecipePickerModal
          subtitle={`${weekDayLabels[selectedSlot.day]} — ${mealTypeLabels[selectedSlot.mealType]}`}
          recipes={recipes}
          onSelectRecipe={handleSelectRecipe}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </section>
  );
};
