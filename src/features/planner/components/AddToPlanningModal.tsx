'use client';

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Info,
  Minus,
  Moon,
  Plus,
  Search,
  Sun,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { RecipePlaceholder } from '@/components/ui/recipe-placeholder';
import { weekDays } from '@/constants/planner';
import {
  getDayNumber,
  getWeekLabel,
  getWeekStart,
  weekDayToDate,
} from '@/features/planner/utils/date';
import {
  courseTypeLabels,
  mealPeriodLabels,
  weekDayLabels,
} from '@/labels/planner';
import { cn } from '@/lib/utils';
import type { CourseType, MealPeriod, WeekDay } from '@/types/planner';
import type { Recipe } from '@/types/recipes';

type RecipeInfo = {
  id?: string;
  title: string;
  imageUrl?: string | null;
  servings: number;
  cookTimeMinutes?: number | null;
  ingredientCount?: number;
};

type Props = {
  isOpen: boolean;
  recipe?: RecipeInfo;
  recipes?: Recipe[];
  defaultServings?: number;
  initialDay?: WeekDay;
  initialMealPeriod?: MealPeriod;
  initialCourseType?: CourseType;
  onClose: () => void;
  onAdd: (
    date: string,
    mealPeriod: MealPeriod,
    courseType: CourseType,
    servings: number,
    recipeId?: string,
  ) => void;
};

const mealPeriodIcons: Record<MealPeriod, React.ElementType> = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
};

export const AddToPlanningModal = ({
  isOpen,
  recipe: recipeProp,
  recipes,
  defaultServings,
  initialDay,
  initialMealPeriod,
  initialCourseType,
  onClose,
  onAdd,
}: Props) => {
  const [pickedRecipe, setPickedRecipe] = useState<RecipeInfo | null>(
    recipeProp ?? null,
  );
  const [search, setSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState<WeekDay>(
    initialDay ?? 'monday',
  );
  const [selectedMealPeriod, setSelectedMealPeriod] = useState<MealPeriod>(
    initialMealPeriod ?? 'lunch',
  );
  const [selectedCourseType, setSelectedCourseType] = useState<CourseType>(
    initialCourseType ?? 'main',
  );
  const [servings, setServings] = useState(
    defaultServings ?? recipeProp?.servings ?? 1,
  );
  const [weekOffset, setWeekOffset] = useState(0);
  const displayedWeekStart = getWeekStart(weekOffset);

  if (!isOpen) return null;

  const activeRecipe = pickedRecipe ?? recipeProp ?? null;
  const isPickerMode = !!recipes && !recipeProp;

  const normalize = (s: string) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  const filteredRecipes = (recipes ?? []).filter((r) =>
    normalize(r.title).includes(normalize(search.trim())),
  );

  const courseTypes: CourseType[] =
    selectedMealPeriod === 'breakfast'
      ? ['main']
      : ['starter', 'main', 'dessert'];

  const handleMealPeriodChange = (period: MealPeriod) => {
    setSelectedMealPeriod(period);
    if (period === 'breakfast') setSelectedCourseType('main');
  };

  const handlePickRecipe = (recipe: Recipe) => {
    setPickedRecipe({
      id: recipe.id,
      title: recipe.title,
      imageUrl: recipe.imageUrl,
      servings: defaultServings ?? recipe.servings,
      cookTimeMinutes: recipe.cookTimeMinutes,
      ingredientCount: recipe.ingredients.length,
    });
    setServings(defaultServings ?? recipe.servings);
    setSearch('');
  };

  const handleConfirm = () => {
    if (!activeRecipe) return;
    onAdd(
      weekDayToDate(selectedDay, displayedWeekStart),
      selectedMealPeriod,
      selectedCourseType,
      servings,
      activeRecipe.id,
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-135 rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER : search OU recette ── */}
        <div className="border-neutre-100 border-b">
          {!activeRecipe && isPickerMode ? (
            /* Mode recherche */
            <div className="relative p-6">
              {/* Search input */}
              <div className="border-neutre-200 flex items-center gap-3 rounded-xl border px-4 py-3">
                <Search size={15} className="text-neutre-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher une recette…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  className="text-neutre-800 placeholder:text-neutre-400 flex-1 bg-transparent text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="text-neutre-400 hover:text-neutre-600 shrink-0 transition"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Dropdown flottant */}
              {search.trim() && (
                <div className="border-neutre-200 absolute top-full right-6 left-6 z-20 max-h-64 overflow-y-auto rounded-xl border bg-white shadow-lg">
                  {filteredRecipes.length === 0 ? (
                    <p className="text-neutre-400 py-4 text-center text-sm">
                      Aucune recette trouvée.
                    </p>
                  ) : (
                    filteredRecipes.map((recipe) => (
                      <button
                        key={recipe.id}
                        type="button"
                        onClick={() => handlePickRecipe(recipe)}
                        className="hover:bg-neutre-50 flex w-full items-center gap-3 px-4 py-2.5 text-left transition first:pt-3 last:pb-3"
                      >
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md">
                          {recipe.imageUrl ? (
                            <Image
                              src={recipe.imageUrl}
                              alt={recipe.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <RecipePlaceholder
                              className="h-9 w-9"
                              iconSize={12}
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-neutre-800 truncate text-sm font-medium">
                            {recipe.title}
                          </p>
                          {recipe.cookTimeMinutes && (
                            <p className="text-neutre-400 text-xs">
                              {recipe.cookTimeMinutes} min
                            </p>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : activeRecipe ? (
            /* Recette sélectionnée */
            <div className="flex items-center gap-4 p-6">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                {activeRecipe.imageUrl ? (
                  <Image
                    src={activeRecipe.imageUrl}
                    alt={activeRecipe.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <RecipePlaceholder className="h-16 w-16" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-neutre-800 mb-1 font-serif text-xl font-normal">
                  {activeRecipe.title}
                </h2>
                <div className="text-neutre-400 flex items-center gap-3 text-xs">
                  {activeRecipe.cookTimeMinutes && (
                    <span>{activeRecipe.cookTimeMinutes} min</span>
                  )}
                  <span>{activeRecipe.servings} pers.</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {isPickerMode && (
                  <button
                    type="button"
                    onClick={() => setPickedRecipe(null)}
                    className="text-terracotta-500 hover:text-terracotta-700 text-xs font-medium transition"
                  >
                    Changer
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="text-neutre-400 hover:text-neutre-600 transition"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* ── BODY : formulaire — toujours affiché ── */}
        <div className="p-6">
          {/* Sélecteur jour */}
          <div className="mb-3 flex items-center justify-between">
            <p className="text-neutre-400 text-xs font-semibold tracking-wider uppercase">
              Quel jour ?
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setWeekOffset((o) => o - 1)}
                className="text-neutre-400 hover:text-neutre-700 hover:bg-neutre-100 rounded-md p-1 transition"
                aria-label="Semaine précédente"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="text-neutre-500 min-w-32 text-center text-xs">
                {getWeekLabel(displayedWeekStart)}
              </span>
              <button
                type="button"
                onClick={() => setWeekOffset((o) => o + 1)}
                className="text-neutre-400 hover:text-neutre-700 hover:bg-neutre-100 rounded-md p-1 transition"
                aria-label="Semaine suivante"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
          <div className="mb-6 grid grid-cols-7 gap-1">
            {weekDays.map((day) => {
              const dayNum = getDayNumber(day, displayedWeekStart);
              const isActive = day === selectedDay;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'flex flex-col items-center rounded-lg border py-3 text-center transition',
                    isActive
                      ? 'border-terracotta-500 bg-terracotta-500 text-white'
                      : 'border-neutre-200 text-neutre-700 hover:border-neutre-300 bg-white',
                  )}
                >
                  <span className="text-[10px] tracking-wider uppercase opacity-80">
                    {weekDayLabels[day].slice(0, 3)}
                  </span>
                  <span className="font-serif text-base">{dayNum}</span>
                </button>
              );
            })}
          </div>

          {/* Sélecteur créneau */}
          <p className="text-neutre-400 mb-3 text-xs font-semibold tracking-wider uppercase">
            Quel repas ?
          </p>
          <div className="mb-6 grid grid-cols-3 gap-2">
            {(['breakfast', 'lunch', 'dinner'] as MealPeriod[]).map(
              (period) => {
                const Icon = mealPeriodIcons[period];
                const isActive = period === selectedMealPeriod;
                return (
                  <button
                    key={period}
                    type="button"
                    onClick={() => handleMealPeriodChange(period)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-lg border p-4 text-sm font-medium transition',
                      isActive
                        ? 'border-olive-500 bg-olive-50 text-olive-700'
                        : 'border-neutre-200 text-neutre-600 hover:border-neutre-300 bg-white',
                    )}
                  >
                    <Icon size={20} />
                    {mealPeriodLabels[period]}
                  </button>
                );
              },
            )}
          </div>

          {/* Course type */}
          {selectedMealPeriod !== 'breakfast' && (
            <>
              <p className="text-neutre-400 mb-3 text-xs font-semibold tracking-wider uppercase">
                Type de plat
              </p>
              <div className="mb-6 flex gap-3">
                {courseTypes.map((type) => (
                  <label
                    key={type}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition',
                      selectedCourseType === type
                        ? 'border-terracotta-300 bg-terracotta-50 text-terracotta-700'
                        : 'border-neutre-200 text-neutre-700 hover:border-neutre-300',
                    )}
                  >
                    <input
                      type="radio"
                      name="courseType"
                      value={type}
                      checked={selectedCourseType === type}
                      onChange={() => setSelectedCourseType(type)}
                      className="accent-olive-600"
                    />
                    {courseTypeLabels[type]}
                  </label>
                ))}
              </div>
            </>
          )}

          {/* Stepper portions */}
          <p className="text-neutre-400 mb-3 text-xs font-semibold tracking-wider uppercase">
            Pour combien de personnes ?
          </p>
          <div className="border-neutre-200 flex items-center gap-4 rounded-xl border bg-white p-4">
            <span className="text-neutre-500 flex-1 text-sm">
              Les quantités s&apos;ajusteront automatiquement
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setServings(Math.max(1, servings - 1))}
                disabled={servings <= 1}
                className="border-neutre-200 bg-neutre-50 hover:bg-neutre-100 flex h-9 w-9 items-center justify-center rounded-full border transition disabled:opacity-40"
              >
                <Minus size={14} />
              </button>
              <span className="text-neutre-800 w-15 text-center font-serif text-2xl">
                {servings}
              </span>
              <button
                type="button"
                onClick={() => setServings(Math.min(20, servings + 1))}
                disabled={servings >= 20}
                className="border-neutre-200 bg-neutre-50 hover:bg-neutre-100 flex h-9 w-9 items-center justify-center rounded-full border transition disabled:opacity-40"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="border-neutre-100 bg-neutre-50 flex items-center justify-between border-t px-6 py-4">
          <span className="text-neutre-400 flex items-center gap-1.5 text-xs">
            <Info size={12} />
            {activeRecipe?.ingredientCount
              ? `${activeRecipe.ingredientCount} ingrédient${activeRecipe.ingredientCount > 1 ? 's' : ''} seront ajoutés à votre liste`
              : 'Sélectionnez une recette pour continuer'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-neutre-600 hover:text-neutre-800 px-4 py-2 text-sm transition"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!activeRecipe}
              className="bg-terracotta-500 hover:bg-terracotta-600 flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium whitespace-nowrap text-white transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check size={14} />
              Ajouter au planning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
