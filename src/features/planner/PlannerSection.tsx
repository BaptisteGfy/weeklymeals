import { useState } from 'react';

import type { Recipe } from '../recipes/types';
import {
  mealTypeLabels,
  mealTypes,
  weekDayLabels,
  weekDays,
} from './constants';
import type { MealType, PlannedMeal, WeekDay } from './types';

type Props = {
  recipes: Recipe[];
  plannedMeals: PlannedMeal[];
  setPlannedMeals: React.Dispatch<React.SetStateAction<PlannedMeal[]>>;
};

export function PlannerSection({
  recipes,
  plannedMeals,
  setPlannedMeals,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    day: WeekDay;
    mealType: MealType;
  } | null>(null);

  const getPlannedMeal = (day: WeekDay, mealType: MealType) => {
    return plannedMeals.find(
      (meal) => meal.day === day && meal.mealType === mealType,
    );
  };

  const getRecipeById = (id: string) => {
    return recipes.find((r) => r.id === id);
  };

  const handleSelectRecipe = (recipeId: string) => {
    if (!selectedSlot) return;

    setPlannedMeals((prev) => {
      const filtered = prev.filter(
        (meal) =>
          !(
            meal.day === selectedSlot.day &&
            meal.mealType === selectedSlot.mealType
          ),
      );

      return [
        ...filtered,
        {
          id: crypto.randomUUID(),
          day: selectedSlot.day,
          mealType: selectedSlot.mealType,
          recipeId,
        },
      ];
    });

    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleRemoveMeal = (day: WeekDay, mealType: MealType) => {
    setPlannedMeals((prev) =>
      prev.filter((meal) => meal.day !== day || meal.mealType !== mealType),
    );
  };

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-2xl font-semibold">Planning de la semaine</h2>

      <div className="grid gap-4">
        {weekDays.map((day) => (
          <article key={day} className="rounded-xl border p-4 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">{weekDayLabels[day]}</h3>

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
                        onClick={() => {
                          setSelectedSlot({ day, mealType });
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-md border border-blue-300 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:border-blue-400 hover:bg-blue-50"
                      >
                        Choisir une recette
                      </button>

                      {plannedMeal ? (
                        <button
                          className="inline-flex items-center gap-2 rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:border-red-400 hover:bg-red-50"
                          onClick={() => {
                            handleRemoveMeal(day, mealType);
                          }}
                        >
                          Supprimer
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      {isModalOpen && selectedSlot && (
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
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedSlot(null);
                }}
                className="text-sm text-slate-500 transition hover:text-slate-700"
              >
                Fermer
              </button>
            </div>

            <div className="mt-4 max-h-60 overflow-y-auto">
              {recipes.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Aucune recette disponible
                </p>
              ) : (
                <ul className="space-y-2">
                  {recipes.map((recipe) => (
                    <li key={recipe.id}>
                      <button
                        onClick={() => handleSelectRecipe(recipe.id)}
                        className="w-full rounded-md border px-3 py-2 text-left text-sm hover:bg-slate-100"
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
      )}
    </section>
  );
}
