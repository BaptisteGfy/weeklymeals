import {
  mealTypeLabels,
  mealTypes,
  weekDayLabels,
  weekDays,
} from './constants';
import type { MealType, PlannedMeal, WeekDay } from './types';
import { useState } from 'react';
import type { Recipe } from '../recipes/types';

type Props = {
  recipes: Recipe[];
};

export function PlannerSection({ recipes }: Props) {
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]);
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

                    <button
                      onClick={() => {
                        setSelectedSlot({ day, mealType });
                        setIsModalOpen(true);
                      }}
                      className="mt-3 text-sm text-blue-600 hover:underline"
                    >
                      Choisir une recette
                    </button>
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
