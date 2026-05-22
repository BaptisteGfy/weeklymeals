'use client';

import { Check, Coffee, Info, Minus, Moon, Plus, Sun, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { RecipePlaceholder } from '@/components/ui/recipe-placeholder';
import { weekDays } from '@/constants/planner';
import { getDayNumber, weekDayToDate } from '@/features/planner/utils/date';
import {
  courseTypeLabels,
  mealPeriodLabels,
  weekDayLabels,
} from '@/labels/planner';
import { cn } from '@/lib/utils';
import type { CourseType, MealPeriod, WeekDay } from '@/types/planner';

type RecipeInfo = {
  title: string;
  imageUrl?: string | null;
  servings: number;
  cookTimeMinutes?: number | null;
  ingredientCount?: number;
};

type Props = {
  isOpen: boolean;
  weekStart: Date;
  recipe: RecipeInfo;
  onClose: () => void;
  onAdd: (
    date: string,
    mealPeriod: MealPeriod,
    courseType: CourseType,
    servings: number,
  ) => void;
};

const mealPeriodIcons: Record<MealPeriod, React.ElementType> = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
};

export const AddToPlanningModal = ({
  isOpen,
  weekStart,
  recipe,
  onClose,
  onAdd,
}: Props) => {
  const [selectedDay, setSelectedDay] = useState<WeekDay>('monday');
  const [selectedMealPeriod, setSelectedMealPeriod] =
    useState<MealPeriod>('lunch');
  const [selectedCourseType, setSelectedCourseType] =
    useState<CourseType>('main');
  const [servings, setServings] = useState(recipe.servings);

  if (!isOpen) return null;

  const courseTypes: CourseType[] =
    selectedMealPeriod === 'breakfast'
      ? ['main']
      : ['starter', 'main', 'dessert'];

  const handleMealPeriodChange = (period: MealPeriod) => {
    setSelectedMealPeriod(period);
    if (period === 'breakfast') setSelectedCourseType('main');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-135 overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header recette */}
        <div className="border-neutre-100 flex items-center gap-4 border-b p-6">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
            {recipe.imageUrl ? (
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                fill
                className="object-cover"
              />
            ) : (
              <RecipePlaceholder className="h-16 w-16" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-neutre-800 mb-1 font-serif text-xl font-normal">
              {recipe.title}
            </h2>
            <div className="text-neutre-400 flex items-center gap-3 text-xs">
              {recipe.cookTimeMinutes && (
                <span>{recipe.cookTimeMinutes} min</span>
              )}
              <span>{recipe.servings} pers.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutre-400 hover:text-neutre-600 shrink-0 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Sélecteur jour */}
          <p className="text-neutre-400 mb-3 text-xs font-semibold tracking-wider uppercase">
            Quel jour ?
          </p>
          <div className="mb-6 grid grid-cols-7 gap-1">
            {weekDays.map((day) => {
              const dayNum = getDayNumber(day, weekStart);
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

        {/* Footer */}
        <div className="border-neutre-100 bg-neutre-50 flex items-center justify-between border-t px-6 py-4">
          <span className="text-neutre-400 flex items-center gap-1.5 text-xs">
            <Info size={12} />
            {recipe.ingredientCount
              ? `${recipe.ingredientCount} ingrédient${recipe.ingredientCount > 1 ? 's' : ''} seront ajoutés à votre liste`
              : 'Les ingrédients seront ajoutés à votre liste'}
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
              onClick={() => {
                onAdd(
                  weekDayToDate(selectedDay, weekStart),
                  selectedMealPeriod,
                  selectedCourseType,
                  servings,
                );
                onClose();
              }}
              className="bg-terracotta-500 hover:bg-terracotta-600 flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium whitespace-nowrap text-white transition"
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
