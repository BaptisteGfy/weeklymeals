import { Trash2 } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

import { unitLabels, unitShortLabels } from '@/labels/recipes';
import { Ingredient, IngredientDraft, IngredientUnit } from '@/types/recipes';

const formatQuantity = (value: number): string => {
  if (Number.isInteger(value)) return String(value);
  const rounded = Math.round(value * 10) / 10;
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
};

type Props = {
  isEditing: boolean;
  ingredients: Ingredient[];
  scalingMultiplier?: number;
  targetServings?: number;
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
  scalingMultiplier = 1,
  targetServings,
  ingredientDraft,
  setIngredientDraft,
  handleIngredientChange,
  handleAddIngredient,
  handleDeleteIngredient,
  error,
}: Props) => {
  return (
    <div className="border-neutre-100 flex h-full flex-col rounded-xl border bg-white p-5">
      {/* Section title — italic terracotta, text-2xl (30px) */}
      <h2 className="text-terracotta-600 mb-5 font-serif text-3xl font-normal italic">
        Ingrédients
      </h2>

      {!isEditing && ingredients.length > 0 && targetServings && (
        <p className="text-neutre-400 -mt-3 mb-4 text-sm">
          Pour {targetServings} personne{targetServings > 1 ? 's' : ''}
        </p>
      )}

      <ul className="divide-neutre-100 divide-y">
        {ingredients.map((ingredient) => (
          <li
            key={ingredient.id}
            className="group flex items-center gap-2 py-2"
          >
            {isEditing ? (
              <>
                {/* Drag handle — visible on hover */}
                <span className="text-neutre-300 cursor-grab opacity-0 transition-opacity select-none group-hover:opacity-100">
                  ⋮⋮
                </span>
                <input
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(
                      ingredient.id,
                      'name',
                      e.target.value,
                    )
                  }
                  className="border-neutre-200 text-neutre-700 min-w-0 flex-1 rounded-lg border px-2 py-1 text-sm focus:outline-none"
                />
                <input
                  type="number"
                  min="0"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    handleIngredientChange(
                      ingredient.id,
                      'quantity',
                      Number(e.target.value),
                    )
                  }
                  className="border-neutre-200 w-16 rounded-lg border px-2 py-1 text-sm focus:outline-none"
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
                  className="border-neutre-200 w-20 rounded-lg border px-2 py-1 text-sm focus:outline-none"
                >
                  {(Object.keys(unitLabels) as IngredientUnit[]).map((unit) => (
                    <option key={unit} value={unit}>
                      {unitShortLabels[unit]}
                    </option>
                  ))}
                </select>
                {/* Delete — visible on hover */}
                <button
                  type="button"
                  onClick={() => handleDeleteIngredient(ingredient.id)}
                  className="text-neutre-300 hover:text-bordeaux-500 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg opacity-0 transition-all group-hover:opacity-100"
                >
                  <Trash2 size={13} />
                </button>
              </>
            ) : (
              <>
                <span className="text-neutre-700 min-w-0 flex-1 text-sm">
                  {ingredient.name}
                </span>
                <span className="text-neutre-400 shrink-0 font-mono text-xs">
                  {formatQuantity(ingredient.quantity * scalingMultiplier)}{' '}
                  {unitLabels[ingredient.unit]}
                </span>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Add ingredient — dashed terracotta button */}
      {isEditing && (
        <>
          <div className="mt-3 flex items-center gap-2">
            <input
              value={ingredientDraft.name}
              onChange={(e) =>
                setIngredientDraft((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              onKeyDown={(e) =>
                e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())
              }
              placeholder="Nouvel ingrédient…"
              className="border-neutre-200 text-neutre-700 placeholder:text-neutre-300 min-w-0 flex-1 rounded-lg border px-2 py-1.5 text-sm focus:outline-none"
            />
            <input
              type="number"
              min="0"
              value={ingredientDraft.quantity}
              onChange={(e) =>
                setIngredientDraft((prev) => ({
                  ...prev,
                  quantity: Number(e.target.value),
                }))
              }
              className="border-neutre-200 w-16 rounded-lg border px-2 py-1.5 text-sm focus:outline-none"
            />
            <select
              value={ingredientDraft.unit}
              onChange={(e) =>
                setIngredientDraft((prev) => ({
                  ...prev,
                  unit: e.target.value as IngredientUnit,
                }))
              }
              className="border-neutre-200 w-20 rounded-lg border px-2 py-1.5 text-sm focus:outline-none"
            >
              {(Object.keys(unitLabels) as IngredientUnit[]).map((unit) => (
                <option key={unit} value={unit}>
                  {unitShortLabels[unit]}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleAddIngredient}
            className="border-terracotta-300 text-terracotta-600 hover:bg-terracotta-50 mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-2 text-sm font-medium transition-colors"
          >
            + Ajouter un ingrédient
          </button>
        </>
      )}

      {isEditing && error && (
        <p role="alert" className="text-bordeaux-500 mt-2 text-xs">
          {error}
        </p>
      )}
    </div>
  );
};
