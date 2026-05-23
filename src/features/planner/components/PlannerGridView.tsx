'use client';

import {
  ChevronLeft,
  ChevronRight,
  Coffee,
  Minus,
  Moon,
  Plus,
  ShoppingCart,
  Sun,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { weekDays } from '@/constants/planner';
import {
  dateToWeekDay,
  getDayNumber,
  getWeekEyebrow,
  weekDayToDate,
} from '@/features/planner/utils/date';
import { mealPeriodLabels, weekDayLabels } from '@/labels/planner';
import { cn } from '@/lib/utils';
import type {
  CourseType,
  MealPeriod,
  PlannedMeal,
  WeekDay,
} from '@/types/planner';
import type { Recipe } from '@/types/recipes';

import { AddToPlanningModal } from './AddToPlanningModal';

type Props = {
  recipes: Recipe[];
  plannedMeals: PlannedMeal[];
  weekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
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

const PERIOD_ICONS: Record<MealPeriod, React.ElementType> = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
};

const PERIOD_LABELS: Record<MealPeriod, string> = {
  breakfast: 'Petit-déj',
  lunch: 'Midi',
  dinner: 'Soir',
};

const PERIOD_COURSE_TYPES: Record<MealPeriod, CourseType[]> = {
  breakfast: ['main'],
  lunch: ['starter', 'main', 'dessert'],
  dinner: ['starter', 'main', 'dessert'],
};

const COURSE_BORDER: Record<string, string> = {
  'breakfast-main': 'border-l-sable-400',
  'lunch-starter': 'border-l-olive-400',
  'lunch-main': 'border-l-terracotta-400',
  'lunch-dessert': 'border-l-sable-400',
  'dinner-starter': 'border-l-olive-400',
  'dinner-main': 'border-l-terracotta-400',
  'dinner-dessert': 'border-l-sable-400',
};

const COURSE_SHORT: Record<CourseType, string> = {
  starter: 'Entrée',
  main: 'Plat',
  dessert: 'Dessert',
};

const mealPeriods: MealPeriod[] = ['breakfast', 'lunch', 'dinner'];

export const PlannerGridView = ({
  recipes,
  plannedMeals,
  weekStart,
  onPrevWeek,
  onNextWeek,
  onCurrentWeek,
  onAddToPlanning,
  onRemoveFromPlanning,
}: Props) => {
  // null = fermée ; {} = global (pas de pré-sélection) ; slot = pré-sélection jour/créneau
  const [modalSlot, setModalSlot] = useState<{
    day?: WeekDay;
    mealPeriod?: MealPeriod;
    courseType?: CourseType;
  } | null>(null);
  const [defaultServings, setDefaultServings] = useState(4);

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = (day: WeekDay) => weekDayToDate(day, weekStart) === todayStr;

  const getMealsForCell = (
    day: WeekDay,
    mealPeriod: MealPeriod,
  ): PlannedMeal[] => {
    const date = weekDayToDate(day, weekStart);
    return plannedMeals.filter(
      (m) => m.date === date && m.mealPeriod === mealPeriod,
    );
  };

  const getRecipeById = (id: string) => recipes.find((r) => r.id === id);

  const totalMeals = plannedMeals.length;
  const coveredDays = new Set(plannedMeals.map((m) => m.date)).size;
  const distinctRecipes = new Set(plannedMeals.map((m) => m.recipeId)).size;
  const totalCookMinutes = plannedMeals.reduce((sum, meal) => {
    const recipe = getRecipeById(meal.recipeId);
    if (!recipe) return sum;
    return sum + (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0);
  }, 0);

  const formatCookTime = (minutes: number): string => {
    if (minutes === 0) return '—';
    if (minutes < 60) return `~${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `~${h} h ${m}` : `~${h} h`;
  };

  return (
    <div>
      {/* Eyebrow */}
      <p className="text-neutre-400 mb-1 text-xs font-medium tracking-widest uppercase">
        {getWeekEyebrow(weekStart)}
      </p>

      {/* Titre + actions sur la même ligne */}
      <div className="mb-3 flex items-center justify-between gap-4">
        <h1 className="text-neutre-800 font-serif text-3xl font-semibold">
          Mon <em className="text-terracotta-600 italic">planning</em>.
        </h1>

        <div className="flex items-center gap-2">
          {/* Nav semaine */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg bg-white"
              onClick={onPrevWeek}
              aria-label="Semaine précédente"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg bg-white px-4 text-xs"
              onClick={onCurrentWeek}
            >
              Cette semaine
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg bg-white"
              onClick={onNextWeek}
              aria-label="Semaine suivante"
            >
              <ChevronRight size={16} />
            </Button>
          </div>

          {/* Réglage portions par défaut */}
          <div className="border-neutre-200 flex h-9 items-center overflow-hidden rounded-lg border bg-white">
            <button
              onClick={() => setDefaultServings((v) => Math.max(1, v - 1))}
              className="text-neutre-400 hover:bg-neutre-50 hover:text-neutre-700 flex h-full items-center px-2.5 transition-colors"
              aria-label="Réduire le nombre de personnes"
            >
              <Minus size={12} />
            </button>
            <span className="text-neutre-600 flex items-center gap-1.5 px-1 text-xs font-medium">
              <Users size={12} />
              {defaultServings} pers.
            </span>
            <button
              onClick={() => setDefaultServings((v) => Math.min(12, v + 1))}
              className="text-neutre-400 hover:bg-neutre-50 hover:text-neutre-700 flex h-full items-center px-2.5 transition-colors"
              aria-label="Augmenter le nombre de personnes"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Ajouter un repas */}
          <Button
            size="sm"
            className="h-9 rounded-lg"
            onClick={() => setModalSlot({})}
          >
            <Plus size={14} />
            Ajouter un repas
          </Button>
        </div>
      </div>

      <div className="border-neutre-200 bg-neutre-100 grid grid-cols-[100px_repeat(7,1fr)] gap-px overflow-hidden rounded-xl border">
        {/* Header row — coin haut-gauche légèrement plus foncé */}
        <div className="bg-neutre-100 px-3 py-4" />
        {weekDays.map((day) => {
          const today = isToday(day);
          return (
            <div key={day} className="bg-neutre-50 px-3 py-4 text-center">
              <p
                className={cn(
                  'mb-1 text-[10px] font-medium tracking-widest uppercase',
                  today ? 'text-olive-600' : 'text-neutre-400',
                )}
              >
                {weekDayLabels[day].slice(0, 3)}
              </p>
              <p
                className={cn(
                  'font-serif text-2xl leading-none',
                  today ? 'text-olive-600' : 'text-neutre-800',
                )}
              >
                {getDayNumber(day, weekStart)}
              </p>
              {today && (
                <div className="mx-auto mt-1.5 h-1.5 w-1.5 rounded-full bg-olive-500" />
              )}
            </div>
          );
        })}

        {/* Meal period rows */}
        {mealPeriods.map((period) => {
          const Icon = PERIOD_ICONS[period];
          return (
            <Fragment key={period}>
              {/* Row label */}
              <div className="bg-neutre-50 flex flex-col items-center justify-center gap-1.5 px-2 py-4 text-center">
                <Icon size={15} className="text-neutre-400" />
                <span className="text-neutre-500 text-xs leading-tight font-medium">
                  {PERIOD_LABELS[period]}
                </span>
              </div>

              {/* Day cells */}
              {weekDays.map((day) => {
                const meals = getMealsForCell(day, period);
                const courseTypes = PERIOD_COURSE_TYPES[period];
                const hasMeals = meals.length > 0;

                return (
                  <div key={day} className="min-h-22 bg-white p-2">
                    {!hasMeals ? (
                      <button
                        onClick={() =>
                          setModalSlot({
                            day,
                            mealPeriod: period,
                            courseType: 'main',
                          })
                        }
                        className="border-neutre-200 text-neutre-300 hover:border-terracotta-200 hover:text-terracotta-400 flex h-full min-h-17 w-full items-center justify-center rounded-md border border-dashed transition-colors"
                        aria-label={`Ajouter ${PERIOD_LABELS[period]} — ${weekDayLabels[day]}`}
                      >
                        <Plus size={14} />
                      </button>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {courseTypes.map((courseType) => {
                          const meal = meals.find(
                            (m) => m.courseType === courseType,
                          );
                          const recipe = meal
                            ? getRecipeById(meal.recipeId)
                            : undefined;

                          if (recipe) {
                            return (
                              <div
                                key={courseType}
                                className={cn(
                                  'group bg-neutre-50 relative rounded-sm border-l-[3px] px-2 py-1.5',
                                  COURSE_BORDER[`${period}-${courseType}`],
                                )}
                              >
                                <p className="text-neutre-400 mb-0.5 text-[9px] font-medium tracking-wider uppercase">
                                  {COURSE_SHORT[courseType]}
                                </p>
                                <p className="text-neutre-800 text-xs leading-snug font-medium">
                                  {recipe.title}
                                </p>
                                <button
                                  onClick={() =>
                                    onRemoveFromPlanning(
                                      weekDayToDate(day, weekStart),
                                      period,
                                      courseType,
                                    )
                                  }
                                  className="bg-bordeaux-50 text-bordeaux-500 hover:bg-bordeaux-100 absolute top-1 right-1 hidden h-4 w-4 items-center justify-center rounded-full group-hover:flex"
                                  aria-label={`Retirer ${recipe.title}`}
                                >
                                  <X size={8} />
                                </button>
                              </div>
                            );
                          }

                          return (
                            <button
                              key={courseType}
                              onClick={() =>
                                setModalSlot({
                                  day,
                                  mealPeriod: period,
                                  courseType,
                                })
                              }
                              className="border-neutre-200 text-neutre-300 hover:border-terracotta-200 hover:text-terracotta-400 flex w-full items-center justify-center gap-1 rounded-sm border border-dashed py-1.5 text-[10px] transition-colors"
                              aria-label={`Ajouter ${COURSE_SHORT[courseType]}`}
                            >
                              <Plus size={9} />
                              {COURSE_SHORT[courseType]}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </Fragment>
          );
        })}
      </div>

      {/* Bas de page : Suggestions + Récap semaine */}
      <div className="mt-8 grid grid-cols-[1.5fr_1fr] gap-6">
        {/* Suggestions — placeholder */}
        <div className="border-neutre-200 rounded-xl border bg-white p-6">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-serif text-xl font-normal">
              Suggestions pour compléter
            </h2>
          </div>
          <p className="text-neutre-400 mb-4 text-sm">
            Bientôt — des idées de recettes pour remplir les créneaux vides de
            votre semaine.
          </p>
        </div>

        {/* Récap semaine */}
        <div className="border-neutre-200 rounded-xl border bg-white p-6">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-serif text-xl font-normal">Récap semaine</h2>
          </div>

          <div className="divide-neutre-100 divide-y">
            {[
              { label: 'Repas planifiés', value: String(totalMeals) },
              { label: 'Jours couverts', value: `${coveredDays} / 7` },
              { label: 'Recettes distinctes', value: String(distinctRecipes) },
              {
                label: 'Temps total cuisine',
                value: formatCookTime(totalCookMinutes),
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-3 text-sm">
                <span className="text-neutre-600">{label}</span>
                <span className="text-neutre-400 font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modale unifiée — slots "+" et bouton "Ajouter un repas" */}
      <AddToPlanningModal
        key={modalSlot ? JSON.stringify(modalSlot) : 'closed'}
        isOpen={modalSlot !== null}
        recipes={recipes}
        defaultServings={defaultServings}
        initialDay={modalSlot?.day}
        initialMealPeriod={modalSlot?.mealPeriod}
        initialCourseType={modalSlot?.courseType}
        onClose={() => setModalSlot(null)}
        onAdd={(date, mealPeriod, courseType, servings, recipeId) => {
          if (!recipeId) return;
          onAddToPlanning(date, mealPeriod, courseType, recipeId, servings);
          toast.success(
            `Repas ajouté — ${weekDayLabels[dateToWeekDay(date)]} ${mealPeriodLabels[mealPeriod]}`,
          );
          setModalSlot(null);
        }}
      />
    </div>
  );
};
