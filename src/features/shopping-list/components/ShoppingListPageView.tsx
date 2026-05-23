'use client';

import clsx from 'clsx';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Info,
  RotateCcw,
  Share2,
  Trash2,
} from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { getPlannedMeals } from '@/actions/planner-actions';
import {
  checkAllItems,
  resetCheckedItems,
  syncShoppingList,
  toggleCheckedItem,
} from '@/actions/shopping-list-actions';
import { getWeekLabel, getWeekStart } from '@/features/planner/utils/date';
import { buildShoppingList } from '@/features/shopping-list/utils/buildShoppingList';
import {
  ingredientCategoryEmojis,
  ingredientCategoryLabels,
} from '@/labels/ingredients';
import { unitLabels } from '@/labels/recipes';
import type { PlannedMeal } from '@/types/planner';
import type { IngredientCategory, Recipe } from '@/types/recipes';
import type { ShoppingListItem } from '@/types/shopping-list';

// ─── Color theming ────────────────────────────────────────────────────────────

type CategoryTheme = 'olive' | 'terracotta' | 'sable' | 'bordeaux';

const CATEGORY_THEMES: Partial<Record<IngredientCategory, CategoryTheme>> = {
  vegetables: 'olive',
  tubers: 'olive',
  fruits: 'olive',
  legumes: 'olive',
  nuts: 'olive',
  mushrooms: 'olive',
  herbs: 'olive',
  plant_proteins: 'olive',
  meat: 'bordeaux',
  fish: 'bordeaux',
  deli: 'bordeaux',
  shellfish: 'bordeaux',
  dairy: 'sable',
  eggs: 'sable',
};

const getCategoryTheme = (cat: IngredientCategory): CategoryTheme =>
  CATEGORY_THEMES[cat] ?? 'terracotta';

const THEME_COLORS: Record<CategoryTheme, { bg: string; text: string }> = {
  olive: { bg: 'var(--olive-50)', text: 'var(--olive-600)' },
  terracotta: { bg: 'var(--terracotta-50)', text: 'var(--terracotta-600)' },
  sable: { bg: 'var(--sable-50)', text: 'var(--sable-600)' },
  bordeaux: { bg: 'var(--bordeaux-50)', text: 'var(--bordeaux-600)' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatQuantity = (item: ShoppingListItem): string => {
  if (item.unit === 'unit')
    return `${item.quantity} pièce${item.quantity > 1 ? 's' : ''}`;
  return `${item.quantity} ${unitLabels[item.unit]}`;
};

const formatExportLabel = (item: ShoppingListItem): string => {
  if (item.unit === 'unit') return `${item.quantity} ${item.name}`;
  return `${item.quantity} ${unitLabels[item.unit]} de ${item.name}`;
};

const computeRecipeSources = (
  plannedMeals: PlannedMeal[],
  recipes: Recipe[],
): Record<string, string> => {
  const sources: Record<string, Set<string>> = {};
  for (const meal of plannedMeals) {
    const recipe = recipes.find((r) => r.id === meal.recipeId);
    if (!recipe) continue;
    for (const ing of recipe.ingredients) {
      if (!sources[ing.name]) sources[ing.name] = new Set();
      sources[ing.name].add(recipe.title);
    }
  }
  return Object.fromEntries(
    Object.entries(sources).map(([name, titles]) => [
      name,
      [...titles].join(', '),
    ]),
  );
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  initialItems: ShoppingListItem[];
  initialPlannedMeals: PlannedMeal[];
  recipes: Recipe[];
};

// ─── Component ────────────────────────────────────────────────────────────────

export const ShoppingListPageView = ({
  initialItems,
  initialPlannedMeals,
  recipes,
}: Props) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [items, setItems] = useState<ShoppingListItem[]>(initialItems);
  const [plannedMeals, setPlannedMeals] =
    useState<PlannedMeal[]>(initialPlannedMeals);
  const [isPending, startTransition] = useTransition();

  const weekStart = getWeekStart(weekOffset);
  const weekLabel = getWeekLabel(weekStart);
  const recipeSources = computeRecipeSources(plannedMeals, recipes);
  const uniqueRecipeCount = new Set(plannedMeals.map((m) => m.recipeId)).size;

  const checkedCount = items.filter((i) => i.isChecked).length;
  const totalCount = items.length;
  const allChecked = totalCount > 0 && checkedCount === totalCount;
  const progressPct =
    totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // ── Actions ───────────────────────────────────────────────────────────────

  const changeWeek = (delta: number) => {
    const newOffset = weekOffset + delta;
    startTransition(async () => {
      const newWeekStart = getWeekStart(newOffset);
      const newMeals = await getPlannedMeals(newWeekStart);
      const computed = buildShoppingList(newMeals, recipes);
      const synced = await syncShoppingList(newWeekStart, computed);
      setPlannedMeals(newMeals);
      setItems(synced);
      setWeekOffset(newOffset);
    });
  };

  const toggle = (name: string) => {
    const current = items.find((i) => i.name === name);
    if (!current) return;
    const newChecked = !current.isChecked;
    setItems((prev) =>
      prev.map((i) => (i.name === name ? { ...i, isChecked: newChecked } : i)),
    );
    startTransition(async () => {
      try {
        await toggleCheckedItem(weekStart, name, newChecked);
      } catch {
        setItems((prev) =>
          prev.map((i) =>
            i.name === name ? { ...i, isChecked: !newChecked } : i,
          ),
        );
        toast.error('Impossible de mettre à jour. Réessaie.');
      }
    });
  };

  const handleToggleAll = () => {
    if (allChecked) {
      setItems((prev) => prev.map((i) => ({ ...i, isChecked: false })));
      startTransition(async () => {
        try {
          await resetCheckedItems(weekStart);
        } catch {
          toast.error('Impossible de réinitialiser. Réessaie.');
        }
      });
    } else {
      setItems((prev) => prev.map((i) => ({ ...i, isChecked: true })));
      startTransition(async () => {
        try {
          await checkAllItems(weekStart);
        } catch {
          toast.error('Impossible de tout cocher. Réessaie.');
        }
      });
    }
  };

  const handleCopy = async () => {
    const unchecked = items.filter((i) => !i.isChecked);
    const categories = Object.keys(
      ingredientCategoryLabels,
    ) as IngredientCategory[];
    const lines = [
      `Liste de courses — ${weekLabel}`,
      '',
      ...categories
        .filter((cat) => cat !== 'fish')
        .flatMap((cat) => {
          const cats: IngredientCategory[] =
            cat === 'meat' ? ['meat', 'fish'] : [cat];
          const label =
            cat === 'meat'
              ? 'Viandes & Poissons'
              : ingredientCategoryLabels[cat];
          const groupItems = unchecked.filter((i) => cats.includes(i.category));
          if (groupItems.length === 0) return [];
          return [
            label,
            ...groupItems.map((i) => `- ${formatExportLabel(i)}`),
            '',
          ];
        }),
    ].join('\n');
    await navigator.clipboard.writeText(lines);
    toast.success('Liste copiée !');
  };

  // ── Derived data ──────────────────────────────────────────────────────────

  const categoryGroups = (
    Object.keys(ingredientCategoryLabels) as IngredientCategory[]
  )
    .filter((cat) => cat !== 'fish')
    .map((cat) => {
      const cats: IngredientCategory[] =
        cat === 'meat' ? ['meat', 'fish'] : [cat];
      const label =
        cat === 'meat' ? 'Viandes & Poissons' : ingredientCategoryLabels[cat];
      const emoji = ingredientCategoryEmojis[cat];
      const groupItems = items.filter((i) => cats.includes(i.category));
      const theme = getCategoryTheme(cat);
      const colors = THEME_COLORS[theme];
      const doneCount = groupItems.filter((i) => i.isChecked).length;
      return { cat, label, emoji, groupItems, colors, doneCount };
    })
    .filter(({ groupItems }) => groupItems.length > 0);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="px-6 py-8">
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-widest uppercase">
            {weekLabel}
          </p>
          <h1 className="font-heading text-foreground mb-1.5 text-3xl leading-tight font-semibold">
            Ma liste de{' '}
            <em className="text-terracotta-500 not-italic">courses</em>.
          </h1>
          <p className="text-muted-foreground text-sm">
            Générée depuis votre planning. Cochez au fur et à mesure.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-sm transition-colors">
            <Share2 className="h-4 w-4" />
            Partager
          </button>
          {totalCount > 0 && (
            <button
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-sm transition-colors"
            >
              <ClipboardCopy className="h-4 w-4" />
              Copier
            </button>
          )}
          <button className="bg-terracotta-500 hover:bg-terracotta-600 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors">
            Mode courses
          </button>
        </div>
      </div>

      {/* Week navigation */}
      <div className="mb-6 flex items-center gap-1">
        <button
          onClick={() => changeWeek(-1)}
          disabled={isPending}
          className="text-muted-foreground hover:text-foreground rounded p-0.5 transition-colors disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-muted-foreground text-sm">
          {weekLabel}
          {uniqueRecipeCount > 0 && (
            <>
              {' · '}
              {uniqueRecipeCount} recette{uniqueRecipeCount > 1 ? 's' : ''}{' '}
              planifi{uniqueRecipeCount > 1 ? 'ées' : 'ée'}
            </>
          )}
        </span>
        <button
          onClick={() => changeWeek(1)}
          disabled={isPending}
          className="text-muted-foreground hover:text-foreground rounded p-0.5 transition-colors disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Main content */}
      {totalCount === 0 ? (
        <div className="text-muted-foreground py-16 text-center text-sm">
          Aucun repas planifié cette semaine.
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_280px] items-start gap-6">
          {/* Categories */}
          <div
            className={clsx(
              'space-y-4',
              isPending && 'opacity-60 transition-opacity',
            )}
          >
            {categoryGroups.map(
              ({ cat, label, emoji, groupItems, colors, doneCount }) => (
                <div
                  key={cat}
                  className="overflow-hidden rounded-xl border bg-white shadow-sm"
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-base"
                        style={{
                          background: colors.bg,
                          color: colors.text,
                        }}
                      >
                        {emoji}
                      </span>
                      <span className="text-foreground text-sm font-semibold">
                        {label}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {doneCount} / {groupItems.length} cochés
                    </span>
                  </div>

                  {/* Items */}
                  <ul className="divide-border divide-y border-t">
                    {groupItems.map((item) => {
                      const source = recipeSources[item.name];
                      return (
                        <li
                          key={item.name}
                          className={clsx(
                            'transition-colors',
                            item.isChecked && 'bg-black/2',
                          )}
                        >
                          <label className="flex cursor-pointer items-center gap-3 px-4 py-3">
                            <input
                              type="checkbox"
                              checked={item.isChecked}
                              onChange={() => toggle(item.name)}
                              className="text-primary h-4 w-4 shrink-0 cursor-pointer rounded"
                            />
                            <div className="min-w-0 flex-1">
                              <p
                                className={clsx(
                                  'text-sm capitalize',
                                  item.isChecked
                                    ? 'text-muted-foreground line-through'
                                    : 'text-foreground',
                                )}
                              >
                                {item.name}
                              </p>
                              {source && (
                                <p className="text-muted-foreground/70 mt-0.5 text-xs">
                                  depuis {source}
                                </p>
                              )}
                            </div>
                            <span
                              className={clsx(
                                'shrink-0 text-right text-sm tabular-nums',
                                item.isChecked
                                  ? 'text-muted-foreground/60'
                                  : 'text-muted-foreground',
                              )}
                            >
                              {formatQuantity(item)}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ),
            )}
          </div>

          {/* Summary aside */}
          <aside className="sticky top-4 rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="text-foreground mb-4 text-sm font-semibold">
              Récap
            </h3>

            <div className="space-y-2.5">
              {[
                { label: 'Total articles', value: totalCount },
                { label: 'Déjà cochés', value: checkedCount },
                { label: 'Restants', value: totalCount - checkedCount },
                { label: 'Recettes couvertes', value: uniqueRecipeCount },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground font-semibold">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progression</span>
                <span className="text-foreground font-semibold">
                  {progressPct}%
                </span>
              </div>
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="bg-neutre-50 mt-5 rounded-xl p-4">
              <div className="mb-1.5 flex items-center gap-2">
                <Info className="text-muted-foreground h-4 w-4" />
                <span className="text-foreground text-xs font-semibold">
                  Astuce
                </span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Activez le « Mode courses » pour un affichage optimisé sur
                téléphone.
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {totalCount > 0 && (
                <button
                  onClick={handleToggleAll}
                  className={clsx(
                    'flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    allChecked
                      ? 'text-muted-foreground hover:text-foreground border'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90',
                  )}
                >
                  {allChecked ? (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      Tout décocher
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Tout cocher
                    </>
                  )}
                </button>
              )}
              <button className="text-muted-foreground hover:text-foreground flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors">
                <Trash2 className="h-4 w-4" />
                Vider la liste
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
