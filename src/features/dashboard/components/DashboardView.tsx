'use client';

import {
  CalendarDays,
  Pencil,
  Plus,
  ShoppingCart,
  Sparkles,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import {
  syncShoppingList,
  toggleCheckedItem,
} from '@/actions/shopping-list-actions';
import { RecipeCard } from '@/components/shared/RecipeCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { StatCard } from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import { RecipePlaceholder } from '@/components/ui/recipe-placeholder';
import { weekDays } from '@/constants/planner';
import { usePlanner } from '@/context/PlannerContext';
import { useRecipes } from '@/context/RecipesContext';
import {
  dateToWeekDay,
  getDayNumber,
  getWeekStart,
  toISODate,
  weekDayToDate,
} from '@/features/planner/utils/date';
import { buildShoppingList } from '@/features/shopping-list/utils/buildShoppingList';
import { mealPeriodLabels, weekDayLabels } from '@/labels/planner';
import { cn } from '@/lib/utils';
import type { MealPeriod, WeekDay } from '@/types/planner';
import type { ShoppingListItem } from '@/types/shopping-list';

const MEAL_TIMES: Record<MealPeriod, string> = {
  breakfast: '08:00',
  lunch: '12:30',
  dinner: '19:30',
};

const PERIOD_ORDER: MealPeriod[] = ['breakfast', 'lunch', 'dinner'];

type DashboardViewProps = { userName: string };

export const DashboardView = ({ userName }: DashboardViewProps) => {
  const { recipes } = useRecipes();
  const { plannedMeals } = usePlanner();

  const weekStart = useMemo(() => getWeekStart(), []);
  const todayDate = useMemo(() => toISODate(new Date()), []);
  const todayWeekDay = useMemo(() => dateToWeekDay(todayDate), [todayDate]);
  const firstName = userName.split(' ')[0] || 'vous';

  const [selectedDay, setSelectedDay] = useState<WeekDay>(todayWeekDay);
  const [syncedItems, setSyncedItems] = useState<ShoppingListItem[]>([]);
  const [, startTransition] = useTransition();

  const todayLabel = useMemo(() => {
    const label = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }, []);

  const weekMeals = useMemo(() => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const startStr = toISODate(weekStart);
    const endStr = toISODate(weekEnd);
    return plannedMeals.filter((m) => m.date >= startStr && m.date <= endStr);
  }, [plannedMeals, weekStart]);

  const selectedDayDate = useMemo(
    () => weekDayToDate(selectedDay, weekStart),
    [selectedDay, weekStart],
  );

  const displayedMeals = useMemo(
    () =>
      plannedMeals
        .filter((m) => m.date === selectedDayDate)
        .sort(
          (a, b) =>
            PERIOD_ORDER.indexOf(a.mealPeriod) -
            PERIOD_ORDER.indexOf(b.mealPeriod),
        ),
    [plannedMeals, selectedDayDate],
  );

  const recipeMap = useMemo(
    () => new Map(recipes.map((r) => [r.id, r])),
    [recipes],
  );

  useEffect(() => {
    const computed = buildShoppingList(weekMeals, recipes);
    let cancelled = false;
    syncShoppingList(weekStart, computed)
      .then((synced) => {
        if (!cancelled) setSyncedItems(synced);
      })
      .catch(() => {
        if (!cancelled) setSyncedItems(computed);
      });
    return () => {
      cancelled = true;
    };
  }, [weekMeals, recipes, weekStart]);

  const handleToggle = (name: string) => {
    const current = syncedItems.find((i) => i.name === name);
    if (!current) return;
    const newChecked = !current.isChecked;
    setSyncedItems((prev) =>
      prev.map((i) => (i.name === name ? { ...i, isChecked: newChecked } : i)),
    );
    startTransition(async () => {
      try {
        await toggleCheckedItem(weekStart, name, newChecked);
      } catch {
        setSyncedItems((prev) =>
          prev.map((i) =>
            i.name === name ? { ...i, isChecked: !newChecked } : i,
          ),
        );
        toast.error('Impossible de mettre à jour. Réessaie.');
      }
    });
  };

  const shoppingPreview = syncedItems.slice(0, 6);
  const totalShoppingItems = syncedItems.length;
  const checkedCount = syncedItems.filter((i) => i.isChecked).length;
  const progressPct =
    totalShoppingItems > 0
      ? Math.round((checkedCount / totalShoppingItems) * 100)
      : 0;

  const suggestedRecipes = useMemo(() => {
    const library = recipes.filter((r) => r.isLibrary);
    const others = recipes.filter((r) => !r.isLibrary);
    return [...library, ...others].slice(0, 4);
  }, [recipes]);

  const userCreatedCount = recipes.filter((r) => !r.isLibrary).length;
  const libraryCount = recipes.filter((r) => r.isLibrary).length;

  const filledSlots = useMemo(() => {
    const slots = new Set(weekMeals.map((m) => `${m.date}-${m.mealPeriod}`));
    return slots.size;
  }, [weekMeals]);

  const totalSlots = useMemo(() => {
    const activePeriods = new Set(weekMeals.map((m) => m.mealPeriod)).size;
    return weekDays.length * (activePeriods || PERIOD_ORDER.length);
  }, [weekMeals]);

  const coveredDays = useMemo(() => {
    const days = new Set(weekMeals.map((m) => m.date));
    return days.size;
  }, [weekMeals]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-terracotta-600 mb-1 text-xs font-semibold tracking-widest uppercase">
            {todayLabel}
          </p>
          <h1 className="text-neutre-800 font-serif text-3xl leading-tight font-semibold">
            Bonjour <em className="text-terracotta-600">{firstName}</em>,
            <br />
            qu&apos;est-ce qu&apos;on mange ce soir&nbsp;?
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-1">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/planner">
              <CalendarDays size={14} />
              Voir la semaine
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/planner">
              <Plus size={14} />
              Ajouter un repas
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={CalendarDays}
          label="Repas planifiés"
          value={`${filledSlots}/${totalSlots}`}
          badge={`${coveredDays}/7j`}
          delta="cette semaine"
        />
        <StatCard
          icon={ShoppingCart}
          label="Articles à acheter"
          value={totalShoppingItems || '—'}
          delta={
            totalShoppingItems
              ? `${checkedCount}/${totalShoppingItems} cochés`
              : 'Aucun repas planifié'
          }
        />
        <StatCard
          icon={Sparkles}
          label="Mes recettes"
          value={recipes.length}
          delta={`${userCreatedCount} créées · ${libraryCount} de la bibliothèque`}
        />
        <StatCard
          icon={Users}
          label="Membres du foyer"
          value={1}
          delta="Inviter un proche → (bientôt disponible)"
          deltaClassName="opacity-50"
        />
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
        {/* Left */}
        <div className="space-y-6">
          {/* Votre semaine */}
          <div className="border-neutre-100 rounded-xl border bg-white p-5">
            <SectionHeader
              title="Votre semaine"
              href="/dashboard/planner"
              linkLabel="Voir le planning complet"
              className="mb-4"
            />

            {/* Week strip */}
            <div className="mb-5 flex gap-1">
              {weekDays.map((day) => {
                const isToday = day === todayWeekDay;
                const isSelected = day === selectedDay;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      'flex flex-1 flex-col items-center rounded-xl py-2 text-center transition-colors',
                      isSelected
                        ? 'bg-olive-500 text-white'
                        : 'text-neutre-400 hover:bg-neutre-50 hover:text-neutre-700',
                    )}
                  >
                    <span
                      className={cn(
                        'text-[10px] font-medium tracking-wide uppercase',
                        isSelected ? 'text-white/70' : '',
                      )}
                    >
                      {weekDayLabels[day].slice(0, 3)}
                    </span>
                    <span
                      className={cn(
                        'text-sm leading-snug font-semibold',
                        isToday && !isSelected ? 'text-terracotta-500' : '',
                      )}
                    >
                      {getDayNumber(day, weekStart)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Timeline du jour sélectionné */}
            {displayedMeals.length === 0 ? (
              <div className="border-neutre-200 rounded-xl border border-dashed py-8 text-center">
                <p className="text-neutre-400 mb-3 text-sm">
                  Aucun repas planifié{' '}
                  {selectedDay === todayWeekDay ? "aujourd'hui" : 'ce jour-là'}
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/planner">
                    <Plus size={13} />
                    Ajouter un repas
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="divide-neutre-100 divide-y">
                {displayedMeals.map((meal) => {
                  const recipe = recipeMap.get(meal.recipeId);
                  if (!recipe) return null;
                  return (
                    <div
                      key={meal.id}
                      className="grid grid-cols-[52px_1fr_32px] items-center gap-3 py-3"
                    >
                      <div className="text-center">
                        <p className="text-neutre-700 text-xs font-semibold">
                          {MEAL_TIMES[meal.mealPeriod]}
                        </p>
                        <p className="text-neutre-400 text-[10px]">
                          {mealPeriodLabels[meal.mealPeriod]}
                        </p>
                      </div>

                      <div className="flex min-w-0 items-center gap-3">
                        {recipe.imageUrl ? (
                          <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <RecipePlaceholder
                            className="h-10 w-10 shrink-0 rounded-lg"
                            iconSize={14}
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-neutre-800 truncate text-sm font-medium">
                            {recipe.title}
                          </p>
                          <p className="text-neutre-400 text-xs">
                            {(recipe.prepTimeMinutes ?? 0) +
                              (recipe.cookTimeMinutes ?? 0)}{' '}
                            min
                            {recipe.servings
                              ? ` · ${recipe.servings} pers.`
                              : ''}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/dashboard/recipes/${recipe.id}`}
                        className="text-neutre-300 hover:text-terracotta-500 flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                        aria-label="Voir la recette"
                      >
                        <Pencil size={13} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Suggestions */}
          {suggestedRecipes.length > 0 && (
            <div className="border-neutre-100 rounded-xl border bg-white p-5">
              <SectionHeader
                title="Suggestions pour vous"
                href="/dashboard/library"
                className="mb-1"
              />
              <p className="text-neutre-400 mb-4 text-sm">
                Quelques idées de notre bibliothèque pour vous inspirer.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {suggestedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Liste de courses */}
          <div className="border-neutre-100 rounded-xl border bg-white p-5">
            <SectionHeader
              title="Liste de courses"
              href="/dashboard/shopping-list"
              className="mb-4"
            />

            {totalShoppingItems === 0 ? (
              <div className="py-4 text-center">
                <p className="text-neutre-400 mb-3 text-sm">
                  Planifiez des repas pour générer votre liste.
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/dashboard/planner">Voir le planning</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="text-neutre-400">Progression</span>
                    <span className="text-neutre-700 font-medium">
                      {checkedCount}/{totalShoppingItems} cochés
                    </span>
                  </div>
                  <div className="bg-neutre-100 h-1.5 overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full bg-olive-500 transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                <ul className="divide-neutre-100 divide-y">
                  {shoppingPreview.map((item) => (
                    <li key={item.name}>
                      <label className="flex cursor-pointer items-center gap-2.5 py-2">
                        <input
                          type="checkbox"
                          checked={item.isChecked}
                          onChange={() => handleToggle(item.name)}
                          className="border-neutre-300 h-4 w-4 shrink-0 cursor-pointer rounded border"
                        />
                        <span
                          className={cn(
                            'min-w-0 flex-1 truncate text-sm transition-colors',
                            item.isChecked
                              ? 'text-neutre-300 line-through'
                              : 'text-neutre-700',
                          )}
                        >
                          {item.name}
                        </span>
                        <span
                          className={cn(
                            'shrink-0 font-mono text-xs',
                            item.isChecked
                              ? 'text-neutre-300'
                              : 'text-neutre-400',
                          )}
                        >
                          {item.quantity}&nbsp;{item.unit}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full gap-1.5"
                >
                  <Link href="/dashboard/shopping-list">
                    <ShoppingCart size={13} />
                    Aller à la liste complète
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Foyer */}
          <div className="border-neutre-100 rounded-xl border bg-white p-5">
            <SectionHeader title="Foyer" className="mb-4" />
            <div className="flex items-center gap-3 py-1">
              <div className="bg-terracotta-500 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                {firstName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-neutre-800 text-sm font-medium">
                  {firstName}
                </p>
                <p className="text-neutre-400 text-xs">Admin · vous</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-neutre-400 mt-2 w-full justify-start gap-1.5 text-xs"
              disabled
            >
              <Plus size={12} />
              Inviter un membre (bientôt disponible)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
