'use client';

import { useState } from 'react';

import {
  courseTypeLabels,
  mealPeriodLabels,
  mealPeriods,
  weekDayLabels,
  weekDays,
} from '@/features/planner/constants';
import type { CourseType, MealPeriod, WeekDay } from '@/features/planner/types';
import { weekDayToDate } from '@/features/planner/utils/date';

type Props = {
  isOpen: boolean;
  weekStart: Date;
  onClose: () => void;
  onAdd: (date: string, mealPeriod: MealPeriod, courseType: CourseType) => void;
};

export const AddToPlanningModal = ({
  isOpen,
  weekStart,
  onClose,
  onAdd,
}: Props) => {
  const [selectedDay, setSelectedDay] = useState<WeekDay>('monday');
  const [selectedMealPeriod, setSelectedMealPeriod] =
    useState<MealPeriod>('lunch');
  const [selectedCourseType, setSelectedCourseType] =
    useState<CourseType>('main');

  if (!isOpen) return null;

  const courseTypes: CourseType[] =
    selectedMealPeriod === 'breakfast'
      ? ['main']
      : ['starter', 'main', 'dessert'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold">Ajouter au planning</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 transition hover:text-slate-700"
          >
            Fermer
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Jour
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as WeekDay)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              {weekDays.map((day) => (
                <option key={day} value={day}>
                  {weekDayLabels[day]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Repas
            </label>
            <select
              value={selectedMealPeriod}
              onChange={(e) => {
                const period = e.target.value as MealPeriod;
                setSelectedMealPeriod(period);
                if (period === 'breakfast') setSelectedCourseType('main');
              }}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              {mealPeriods.map((period) => (
                <option key={period} value={period}>
                  {mealPeriodLabels[period]}
                </option>
              ))}
            </select>
          </div>

          {selectedMealPeriod !== 'breakfast' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Type
              </label>
              <select
                value={selectedCourseType}
                onChange={(e) =>
                  setSelectedCourseType(e.target.value as CourseType)
                }
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
              >
                {courseTypes.map((type) => (
                  <option key={type} value={type}>
                    {courseTypeLabels[type]}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
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
              );
              onClose();
            }}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};
