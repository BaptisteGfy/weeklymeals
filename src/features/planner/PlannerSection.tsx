import {
  mealTypeLabels,
  mealTypes,
  weekDayLabels,
  weekDays,
} from './constants';
import type { PlannedMeal } from './types';
import { useState } from 'react';
import type { Recipe } from '../recipes/types';

type Props = {
  recipes: Recipe[];
};

export function PlannerSection({ recipes }: Props) {
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]);

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-2xl font-semibold">Planning de la semaine</h2>

      <div className="grid gap-4">
        {weekDays.map((day) => (
          <article key={day} className="rounded-xl border p-4 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">{weekDayLabels[day]}</h3>

            <div className="grid gap-3 md:grid-cols-2">
              {mealTypes.map((mealType) => {
                const plannedMeal = plannedMeals.find(
                  (meal) => meal.day === day && meal.mealType === mealType,
                );

                return (
                  <div
                    key={mealType}
                    className="rounded-lg border border-dashed p-3"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      {mealTypeLabels[mealType]}
                    </p>

                    {plannedMeal ? (
                      <p className="mt-2 text-sm text-green-600">
                        Recette planifiée
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">
                        Aucun repas planifié
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
