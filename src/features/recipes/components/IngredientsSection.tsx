import { Dispatch, SetStateAction } from 'react';

import { unitLabels } from '../constants';
import { Ingredient, IngredientDraft, IngredientUnit } from '../types';

type Props = {
  isEditing: boolean;
  ingredients: Ingredient[];
  ingredientDraft: IngredientDraft;
  setIngredientDraft: Dispatch<SetStateAction<IngredientDraft>>;
  handleIngredientChange: (
    id: string,
    field: keyof Omit<Ingredient, 'id'>,
    value: string | number | IngredientUnit,
  ) => void;
  handleAddIngredient: () => void;
  handleDeleteIngredient: (id: string) => void;
  error?: string;
};

export const IngredientsSection = ({
  isEditing,
  ingredients,
  ingredientDraft,
  setIngredientDraft,
  handleIngredientChange,
  handleAddIngredient,
  handleDeleteIngredient,
  error,
}: Props) => {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-xl font-semibold">Ingrédients</h2>
      <ul className="space-y-2">
        {ingredients.map((ingredient) => (
          <li key={ingredient.id} className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">•</span>
            {isEditing ? (
              <>
                <input
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(
                      ingredient.id,
                      'name',
                      e.target.value,
                    )
                  }
                  className="min-w-0 flex-1 rounded border px-2 py-1 text-sm"
                />
                <input
                  type="number"
                  min="1"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    handleIngredientChange(
                      ingredient.id,
                      'quantity',
                      Number(e.target.value),
                    )
                  }
                  className="w-16 rounded border px-2 py-1 text-sm"
                />
                <select
                  value={ingredient.unit}
                  onChange={(e) =>
                    handleIngredientChange(
                      ingredient.id,
                      'unit',
                      e.target.value as IngredientUnit,
                    )
                  }
                  className="rounded border px-2 py-1 text-sm"
                >
                  {(Object.keys(unitLabels) as IngredientUnit[]).map((unit) => (
                    <option key={unit} value={unit}>
                      {unitLabels[unit]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleDeleteIngredient(ingredient.id)}
                  className="text-gray-400 transition hover:text-red-500"
                >
                  ✕
                </button>
              </>
            ) : (
              <span className="text-gray-700">
                {ingredient.name} — {ingredient.quantity}{' '}
                {unitLabels[ingredient.unit]}
              </span>
            )}
          </li>
        ))}

        {isEditing && (
          <li className="flex items-center gap-2 pt-1">
            <span className="text-gray-300">+</span>
            <input
              value={ingredientDraft.name}
              onChange={(e) =>
                setIngredientDraft((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Nouvel ingrédient"
              className="min-w-0 flex-1 rounded border px-2 py-1 text-sm placeholder-gray-300"
            />
            <input
              type="number"
              min="1"
              value={ingredientDraft.quantity}
              onChange={(e) =>
                setIngredientDraft((prev) => ({
                  ...prev,
                  quantity: Number(e.target.value),
                }))
              }
              className="w-16 rounded border px-2 py-1 text-sm"
            />
            <select
              value={ingredientDraft.unit}
              onChange={(e) =>
                setIngredientDraft((prev) => ({
                  ...prev,
                  unit: e.target.value as IngredientUnit,
                }))
              }
              className="rounded border px-2 py-1 text-sm"
            >
              {(Object.keys(unitLabels) as IngredientUnit[]).map((unit) => (
                <option key={unit} value={unit}>
                  {unitLabels[unit]}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="rounded border border-gray-300 px-2 py-1 text-sm text-gray-600 transition hover:bg-gray-50"
            >
              Ajouter
            </button>
          </li>
        )}
      </ul>
      {isEditing && error && (
        <p
          id="ingredients-error"
          role="alert"
          className="mt-2 text-sm text-red-500"
        >
          {error}
        </p>
      )}
    </section>
  );
};
