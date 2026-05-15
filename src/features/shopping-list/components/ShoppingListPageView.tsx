'use client';

import clsx from 'clsx';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  RotateCcw,
} from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { getPlannedMeals } from '@/actions/planner-actions';
import {
  checkAllItems,
  type PersistedShoppingListItem,
  resetCheckedItems,
  syncShoppingList,
  toggleCheckedItem,
} from '@/actions/shopping-list-actions';
import type { PlannedMeal } from '@/features/planner/types';
import { getWeekLabel, getWeekStart } from '@/features/planner/utils/date';
import {
  ingredientCategoryLabels,
  unitLabels,
} from '@/features/recipes/constants';
import type { IngredientCategory, Recipe } from '@/features/recipes/types';
import { buildShoppingList } from '@/features/shopping-list/utils/buildShoppingList';

// Groupes d'affichage : viandes + poissons fusionnes visuellement
const SHOPPING_LIST_GROUPS: {
  label: string;
  emoji: string;
  cats: IngredientCategory[];
}[] = [
  { label: 'Legumes', emoji: '🥦', cats: ['vegetables'] },
  { label: 'Fruits', emoji: '🍎', cats: ['fruits'] },
  { label: 'Viandes & Poissons', emoji: '🥩', cats: ['meat', 'fish'] },
  { label: 'Produits laitiers', emoji: '🧀', cats: ['dairy'] },
  { label: 'Cereales & feculents', emoji: '🌾', cats: ['cereals'] },
  { label: 'Legumineuses', emoji: '🫘', cats: ['legumes'] },
  { label: 'Huiles & matieres grasses', emoji: '🫙', cats: ['oils'] },
  { label: 'Condiments', emoji: '🧴', cats: ['condiments'] },
  { label: 'Epices & herbes', emoji: '🌿', cats: ['spices'] },
  { label: 'Fruits secs & noix', emoji: '🥜', cats: ['nuts'] },
  { label: 'Autres', emoji: '🛒', cats: ['other'] },
];

// Labels avec accents corrects pour l'affichage
const GROUP_DISPLAY_LABELS: Record<string, string> = {
  Legumes: 'Légumes',
  Fruits: 'Fruits',
  'Viandes & Poissons': 'Viandes & Poissons',
  'Produits laitiers': 'Produits laitiers',
  'Cereales & feculents': 'Céréales & féculents',
  Legumineuses: 'Légumineuses',
  'Huiles & matieres grasses': 'Huiles & matières grasses',
  Condiments: 'Condiments',
  'Epices & herbes': 'Épices & herbes',
  'Fruits secs & noix': 'Fruits secs & noix',
  Autres: 'Autres',
};

const COMPACT_UNITS = new Set(['g', 'kg', 'ml', 'l']);

const formatQuantity = (item: PersistedShoppingListItem): string => {
  if (item.unit === 'unit') {
    return `${item.quantity} piece${item.quantity > 1 ? 's' : ''}`;
  }
  const sep = COMPACT_UNITS.has(item.unit) ? '' : ' ';
  return `${item.quantity}${sep}${unitLabels[item.unit]}`;
};

const formatExportLabel = (item: PersistedShoppingListItem): string => {
  if (item.unit === 'unit') return `${item.quantity} ${item.name}`;
  const sep = COMPACT_UNITS.has(item.unit) ? '' : ' ';
  return `${item.quantity}${sep}${unitLabels[item.unit]} de ${item.name}`;
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
      titles.size === 1 ? [...titles][0] : 'Plusieurs recettes',
    ]),
  );
};

type Props = {
  initialItems: PersistedShoppingListItem[];
  initialPlannedMeals: PlannedMeal[];
  recipes: Recipe[];
};

export const ShoppingListPageView = ({
  initialItems,
  initialPlannedMeals,
  recipes,
}: Props) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [items, setItems] = useState<PersistedShoppingListItem[]>(initialItems);
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
    const lines = [
      `Liste de courses — ${weekLabel}`,
      '',
      ...SHOPPING_LIST_GROUPS.filter((g) =>
        unchecked.some((i) => g.cats.includes(i.category)),
      ).flatMap((g) => {
        const groupItems = unchecked.filter((i) => g.cats.includes(i.category));
        const label = GROUP_DISPLAY_LABELS[g.label] ?? g.label;
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-1 flex items-start justify-between gap-4">
        <h1 className="font-heading text-foreground text-2xl font-semibold">
          Liste de courses
        </h1>
        <div className="flex shrink-0 items-center gap-2">
          {totalCount > 0 && (
            <button
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors"
            >
              <ClipboardCopy className="h-4 w-4" />
              Copier la liste
            </button>
          )}
          {totalCount > 0 && (
            <button
              onClick={handleToggleAll}
              className={clsx(
                'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
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
        </div>
      </div>

      {/* Semaine + navigation */}
      <div className="mb-5 flex items-center gap-1">
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
              planifi
              {uniqueRecipeCount > 1 ? 'ées' : 'ée'}
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

      {/* Barre de progression */}
      {totalCount > 0 && (
        <div className="mb-6">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-foreground font-medium">
              {checkedCount} / {totalCount} articles cochés
            </span>
            <span className="text-muted-foreground">{progressPct}%</span>
          </div>
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Liste */}
      {totalCount === 0 ? (
        <div className="text-muted-foreground py-16 text-center text-sm">
          Aucun repas planifié cette semaine.
        </div>
      ) : (
        <div
          className={clsx(
            'space-y-5',
            isPending && 'opacity-60 transition-opacity',
          )}
        >
          {SHOPPING_LIST_GROUPS.map((group) => {
            const groupItems = items.filter((i) =>
              group.cats.includes(i.category),
            );
            if (groupItems.length === 0) return null;
            const remaining = groupItems.filter((i) => !i.isChecked).length;
            const displayLabel =
              GROUP_DISPLAY_LABELS[group.label] ?? group.label;
            return (
              <section key={group.label}>
                <h2 className="text-foreground mb-2 flex items-center gap-2 text-sm font-semibold">
                  <span>{group.emoji}</span>
                  <span>{displayLabel}</span>
                  {remaining > 0 && (
                    <span className="text-muted-foreground font-normal">
                      ({remaining} restant{remaining > 1 ? 's' : ''})
                    </span>
                  )}
                </h2>
                <ul className="divide-border bg-muted divide-y overflow-hidden rounded-xl border">
                  {groupItems.map((item) => {
                    const source = recipeSources[item.name];
                    const isMultiple = source === 'Plusieurs recettes';
                    return (
                      <li
                        key={item.name}
                        className={clsx(
                          'transition-colors',
                          item.isChecked && 'bg-black/4',
                        )}
                      >
                        <label className="flex cursor-pointer items-center gap-3 px-4 py-3">
                          <input
                            type="checkbox"
                            checked={item.isChecked}
                            onChange={() => toggle(item.name)}
                            className="text-primary h-4 w-4 shrink-0 cursor-pointer rounded"
                          />
                          <span
                            className={clsx(
                              'flex-1 text-sm capitalize transition-colors',
                              item.isChecked
                                ? 'text-muted-foreground line-through'
                                : 'text-foreground',
                            )}
                          >
                            {item.name}
                          </span>
                          {source && (
                            <span
                              className={clsx(
                                'max-w-35 min-w-0 shrink-0 truncate text-right text-xs',
                                isMultiple
                                  ? 'bg-muted text-muted-foreground rounded-full px-2 py-0.5'
                                  : 'text-muted-foreground/70',
                              )}
                            >
                              {source}
                            </span>
                          )}
                          <span
                            className={clsx(
                              'w-16 shrink-0 text-right text-sm tabular-nums',
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
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
