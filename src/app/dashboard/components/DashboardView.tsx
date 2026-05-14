'use client';

import { useMemo } from 'react';

import { BookOpen, CalendarDays, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { usePlanner } from '@/context/PlannerContext';
import { useRecipes } from '@/context/RecipesContext';
import { mealTypes, weekDays } from '@/features/planner/constants';
import type { MealType, WeekDay } from '@/features/planner/types';
import type { RecipeCategory } from '@/features/recipes/types';
import {
  getDayNumber,
  getWeekStart,
  weekDayToDate,
} from '@/features/planner/utils/date';
import { cn } from '@/lib/utils';

const DAY_SHORT: Record<WeekDay, string> = {
  monday: 'Lun',
  tuesday: 'Mar',
  wednesday: 'Mer',
  thursday: 'Jeu',
  friday: 'Ven',
  saturday: 'Sam',
  sunday: 'Dim',
};

const MEAL_LABEL: Record<MealType, string> = {
  lunch: 'Déj.',
  dinner: 'Dîner',
};

const CATEGORY_DOT: Record<RecipeCategory, string> = {
  breakfast: 'bg-amber-400',
  lunch: 'bg-emerald-500',
  dinner: 'bg-primary',
  dessert: 'bg-violet-400',
};

const CATEGORY_LABEL: Record<RecipeCategory, string> = {
  breakfast: 'Petit-déj',
  lunch: 'Déjeuner',
  dinner: 'Dîner',
  dessert: 'Dessert',
};

type DashboardViewProps = { userName: string };

export const DashboardView = ({ userName }: DashboardViewProps) => {
  const { recipes } = useRecipes();
  const { plannedMeals } = usePlanner();

  const weekStart = useMemo(() => getWeekStart(), []);

  const todayLabel = useMemo(() => {
    const label = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }, []);

  const weekMeals = useMemo(() => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const startStr = weekStart.toISOString().split('T')[0];
    const endStr = weekEnd.toISOString().split('T')[0];
    return plannedMeals.filter((m) => m.date >= startStr && m.date <= endStr);
  }, [plannedMeals, weekStart]);

  const recipeMap = useMemo(
    () => new Map(recipes.map((r) => [r.id, r])),
    [recipes],
  );

  const getMealRecipe = (day: WeekDay, mealType: MealType) => {
    const date = weekDayToDate(day, weekStart);
    const meal = weekMeals.find((m) => m.date === date && m.mealType === mealType);
    return meal ? (recipeMap.get(meal.recipeId) ?? null) : null;
  };

  const totalSlots = weekDays.length * mealTypes.length;
  const firstName = userName.split(' ')[0];

  return (
    <div className="grid grid-cols-[1fr_280px] gap-6">

      {/* Colonne gauche */}
      <div className="min-w-0 space-y-5">

        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Bonjour {firstName} 👋
          </h1>
          <p className="text-sm text-muted-foreground">{todayLabel}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Cette semaine</h2>
          <div className="grid grid-cols-[2.5rem_repeat(7,1fr)] gap-x-1 gap-y-2">
            <div />
            {weekDays.map((day) => (
              <div key={day} className="text-center">
                <span className="block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {DAY_SHORT[day]}
                </span>
                <span className="block text-sm font-semibold text-foreground">
                  {getDayNumber(day, weekStart)}
                </span>
              </div>
            ))}

            {mealTypes.map((mealType) => (
              <>
                <div
                  key={`label-${mealType}`}
                  className="flex items-center justify-end text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {MEAL_LABEL[mealType]}
                </div>
                {weekDays.map((day) => {
                  const recipe = getMealRecipe(day, mealType);
                  return (
                    <Link key={`${day}-${mealType}`} href="/dashboard/planner">
                      <div
                        className={cn(
                          'truncate rounded-md px-1 py-1.5 text-center text-[10px] leading-tight transition-colors',
                          recipe
                            ? 'bg-secondary text-foreground hover:bg-secondary/70'
                            : 'border border-dashed border-border text-muted-foreground/30 hover:border-primary/30',
                        )}
                      >
                        {recipe ? recipe.title : '+'}
                      </div>
                    </Link>
                  );
                })}
              </>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <BookOpen className="mb-2 h-4 w-4 text-primary" strokeWidth={1.5} />
            <p className="text-xl font-bold text-foreground">{recipes.length}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">recettes sauvegardées</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <CalendarDays className="mb-2 h-4 w-4 text-primary" strokeWidth={1.5} />
            <p className="text-xl font-bold text-foreground">
              {weekMeals.length}
              <span className="text-sm font-normal text-muted-foreground">
                /{totalSlots}
              </span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">repas planifiés</p>
            <div className="mt-2 h-1 w-full rounded-full bg-secondary">
              <div
                className="h-1 rounded-full bg-primary transition-all"
                style={{ width: `${(weekMeals.length / totalSlots) * 100}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <ShoppingCart className="mb-2 h-4 w-4 text-primary" strokeWidth={1.5} />
            <p className="text-xl font-bold text-foreground">—</p>
            <Link
              href="/dashboard/shopping-list"
              className="mt-0.5 block text-xs text-primary hover:underline"
            >
              Voir la liste →
            </Link>
          </div>
        </div>

      </div>

      {/* Colonne droite */}
      <div className="sticky top-6 self-start space-y-4">

        <div className="flex flex-col gap-2">
          <Button asChild className="w-full justify-start">
            <Link href="/dashboard/recipes/new">+ Nouvelle recette</Link>
          </Button>
          <Button variant="outline" asChild className="w-full justify-start">
            <Link href="/dashboard/planner">
              <CalendarDays className="mr-2 h-4 w-4" />
              Voir le planning
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full justify-start">
            <Link href="/dashboard/shopping-list">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Liste de courses
            </Link>
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">
              Mes recettes{' '}
              <span className="font-normal text-muted-foreground">({recipes.length})</span>
            </h2>
          </div>
          <ul className="max-h-[calc(100vh-16rem)] divide-y divide-border overflow-y-auto">
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <Link
                  href={`/dashboard/recipes/${recipe.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/50"
                >
                  <span
                    className={cn('h-2 w-2 shrink-0 rounded-full', CATEGORY_DOT[recipe.category])}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                    {recipe.title}
                  </span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {CATEGORY_LABEL[recipe.category]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};
