'use client';

import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Fragment, useState } from 'react';

import { PLANNER_ROWS, weekDays } from '@/constants/planner';
import {
  getDayNumber,
  getWeekLabel,
  weekDayToDate,
} from '@/features/planner/utils/date';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import { weekDayLabels } from '@/labels/planner';
import type {
  CourseType,
  GridRow,
  MealPeriod,
  MealSlot,
  PlannedMeal,
  WeekDay,
} from '@/types/planner';
import type { Recipe } from '@/types/recipes';

import { RecipePickerModal } from './RecipePickerModal';

type Props = {
  recipes: Recipe[];
  plannedMeals: PlannedMeal[];
  weekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onAddToPlanning: (
    date: string,
    mealPeriod: MealPeriod,
    courseType: CourseType,
    recipeId: string,
    servings: number,
  ) => Promise<void>;
  onRemoveFromPlanning: (
    date: string,
    mealPeriod: MealPeriod,
    courseType: CourseType,
  ) => Promise<void>;
};

const isFirstInGroup = (rows: GridRow[], index: number): boolean => {
  if (index === 0) return false;
  return rows[index - 1].mealPeriod !== rows[index].mealPeriod;
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
  const [showBreakfast, setShowBreakfast] = useState(false);
  const [showStarters, setShowStarters] = useState(false);
  const [showDesserts, setShowDesserts] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = (day: WeekDay) => weekDayToDate(day, weekStart) === todayStr;

  const visibleRows = PLANNER_ROWS.filter((row) => {
    if (row.mealPeriod === 'breakfast') return showBreakfast;
    if (row.courseType === 'starter') return showStarters;
    if (row.courseType === 'dessert') return showDesserts;
    return true;
  });

  const getPlannedMeal = (
    day: WeekDay,
    mealPeriod: MealPeriod,
    courseType: CourseType,
  ) => {
    const date = weekDayToDate(day, weekStart);
    return plannedMeals.find(
      (meal) =>
        meal.date === date &&
        meal.mealPeriod === mealPeriod &&
        meal.courseType === courseType,
    );
  };

  const getRecipeById = (id: string): Recipe | undefined =>
    recipes.find((r) => r.id === id);

  const handleSelectRecipe = (recipeId: string) => {
    if (!selectedSlot) return;
    const date = weekDayToDate(selectedSlot.day, weekStart);
    const recipe = getRecipeById(recipeId);
    onAddToPlanning(
      date,
      selectedSlot.mealPeriod,
      selectedSlot.courseType,
      recipeId,
      recipe?.servings ?? 1,
    );
    setSelectedSlot(null);
  };

  return (
    <section className="mt-10">
      <div className="mb-4 grid grid-cols-3 items-center">
        <div className="flex items-center gap-1.5">
          {[
            {
              label: 'Matin',
              active: showBreakfast,
              toggle: () => setShowBreakfast((v) => !v),
            },
            {
              label: 'Entrées',
              active: showStarters,
              toggle: () => setShowStarters((v) => !v),
            },
            {
              label: 'Desserts',
              active: showDesserts,
              toggle: () => setShowDesserts((v) => !v),
            },
          ].map(({ label, active, toggle }) => (
            <button
              key={label}
              onClick={toggle}
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-primary/40 text-primary/70 hover:bg-primary/5'
              }`}
            >
              {active ? label : `+ ${label}`}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onPrevWeek}
            className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md p-1.5 transition-colors"
            aria-label="Semaine précédente"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-muted-foreground text-center text-sm font-medium">
            {getWeekLabel(weekStart)}
          </span>
          <button
            onClick={onNextWeek}
            className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md p-1.5 transition-colors"
            aria-label="Semaine suivante"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div />
      </div>

      <div className="overflow-hidden rounded-xl border">
        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          {/* Coin supérieur gauche */}
          <div className="bg-primary/5 border-r border-b" />
          {weekDays.map((day, i) => {
            const today = isToday(day);
            return (
              <div
                key={day}
                className={`bg-primary/5 border-b p-3 text-center ${i < weekDays.length - 1 ? 'border-r' : ''}`}
              >
                <p
                  className={`text-xs font-medium uppercase ${today ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {weekDayLabels[day].slice(0, 3)}
                </p>
                <p
                  className={`text-lg font-semibold ${today ? 'text-primary' : 'text-foreground'}`}
                >
                  {getDayNumber(day, weekStart)}
                </p>
                {today && (
                  <div className="bg-primary mx-auto mt-0.5 h-1 w-1 rounded-full" />
                )}
              </div>
            );
          })}

          {/* Meal rows */}
          {visibleRows.map((row, rowIndex) => {
            const groupSeparator = isFirstInGroup(visibleRows, rowIndex);
            const isLastRow = rowIndex === visibleRows.length - 1;

            return (
              <Fragment key={`${row.mealPeriod}-${row.courseType}`}>
                <div
                  className={`bg-primary/5 flex items-center border-r px-3 py-4 ${!isLastRow ? 'border-b' : ''} ${groupSeparator ? 'border-primary/30 border-t-2' : ''}`}
                >
                  <span className="text-foreground/70 text-xs font-semibold tracking-wide uppercase">
                    {row.label}
                  </span>
                </div>

                {weekDays.map((day, colIndex) => {
                  const plannedMeal = getPlannedMeal(
                    day,
                    row.mealPeriod,
                    row.courseType,
                  );
                  const recipe = plannedMeal
                    ? getRecipeById(plannedMeal.recipeId)
                    : undefined;

                  return (
                    <div
                      key={day}
                      className={`p-2 ${!isLastRow ? 'border-b' : ''} ${colIndex < weekDays.length - 1 ? 'border-r' : ''} ${groupSeparator ? 'border-primary/30 border-t-2' : ''}`}
                    >
                      {recipe ? (
                        <div className="group relative">
                          <RecipeCard recipe={recipe} variant="mini" />
                          <button
                            onClick={() =>
                              onRemoveFromPlanning(
                                weekDayToDate(day, weekStart),
                                row.mealPeriod,
                                row.courseType,
                              )
                            }
                            className="bg-destructive absolute -top-1.5 -right-1.5 hidden h-5 w-5 items-center justify-center rounded-full text-xs text-white group-hover:flex"
                            aria-label={`Retirer ${recipe.title}`}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setSelectedSlot({
                              day,
                              mealPeriod: row.mealPeriod,
                              courseType: row.courseType,
                            })
                          }
                          className="border-border/50 text-muted-foreground/40 hover:border-primary/30 hover:text-primary/50 hover:bg-accent/10 flex h-16 w-full items-center justify-center rounded-lg border border-dashed transition-colors"
                          aria-label={`Ajouter — ${weekDayLabels[day]} ${row.pickerLabel}`}
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </Fragment>
            );
          })}
        </div>
      </div>

      {selectedSlot !== null && (
        <RecipePickerModal
          subtitle={`${weekDayLabels[selectedSlot.day]} — ${
            PLANNER_ROWS.find(
              (r) =>
                r.mealPeriod === selectedSlot.mealPeriod &&
                r.courseType === selectedSlot.courseType,
            )?.pickerLabel ?? ''
          }`}
          recipes={recipes}
          onSelectRecipe={handleSelectRecipe}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </section>
  );
};
