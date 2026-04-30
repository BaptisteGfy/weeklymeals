import { useState } from 'react';

import {
  mealTypeLabels,
  mealTypes,
  weekDayLabels,
  weekDays,
} from '../constants';
import { MealType, WeekDay } from '../types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (day: WeekDay, mealType: MealType) => void;
};

export const AddToPlanningModal = ({ isOpen, onClose, onAdd }: Props) => {
  const [selectedDay, setSelectedDay] = useState<WeekDay>('monday');
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch');

  if (!isOpen) return null;

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
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value as MealType)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              {mealTypes.map((type) => (
                <option key={type} value={type}>
                  {mealTypeLabels[type]}
                </option>
              ))}
            </select>
          </div>
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
              onAdd(selectedDay, selectedMealType);
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
