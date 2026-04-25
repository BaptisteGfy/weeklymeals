import { useState } from 'react';

import type { Recipe } from '../recipes/types';
import {
  mealTypeLabels,
  mealTypes,
  weekDayLabels,
  weekDays,
} from './constants';
import { RecipePickerModal } from './RecipePickerModal';
import type { MealType, PlannedMeal, WeekDay } from './types';

type Props = {
  recipes: Recipe[];
  plannedMeals: PlannedMeal[];
  setPlannedMeals: React.Dispatch<React.SetStateAction<PlannedMeal[]>>;
};

export const PlannerSection = ({
  recipes,
  plannedMeals,
  setPlannedMeals,
}: Props) => {
  const [selectedSlot, setSelectedSlot] = useState<{
    day: WeekDay;
    mealType: MealType;
  } | null>(null);

  const getPlannedMeal = (
    day: WeekDay,
    mealType: MealType,
  ): PlannedMeal | undefined => {
    return plannedMeals.find(
      (meal) => meal.day === day && meal.mealType === mealType,
    );
  };

  const getRecipeById = (id: string): Recipe | undefined => {
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

    setSelectedSlot(null);
  };

  const handleRemoveMeal = (day: WeekDay, mealType: MealType) => {
    setPlannedMeals((prev) =>
      prev.filter((meal) => !(meal.day === day && meal.mealType === mealType)),
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
                        onClick={() => setSelectedSlot({ day, mealType })}
                        className="inline-flex items-center gap-2 rounded-md border border-blue-300 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:border-blue-400 hover:bg-blue-50"
                      >
                        Choisir une recette
                      </button>

                      {plannedMeal ? (
                        <button
                          className="inline-flex items-center gap-2 rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:border-red-400 hover:bg-red-50"
                          onClick={() => handleRemoveMeal(day, mealType)}
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

      {selectedSlot !== null && (
        <RecipePickerModal
          selectedSlot={selectedSlot}
          recipes={recipes}
          onSelectRecipe={handleSelectRecipe}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </section>
  );
};
