'use client';

import Link from 'next/link';
import { useState } from 'react';

import {
  categoryLabels,
  Ingredient,
  IngredientDraft,
  IngredientUnit,
  Recipe,
  RecipeFormValues,
  unitLabels,
} from '../types';

type Props = {
  recipe: Recipe;
  onSave: (values: RecipeFormValues) => void;
  onCancel?: () => void;
  initialIsEditing?: boolean;
};

const initialIngredientDraft: IngredientDraft = {
  name: '',
  quantity: 1,
  unit: 'unit',
};

const toFormValues = (recipe: Recipe): RecipeFormValues => ({
  title: recipe.title,
  description: recipe.description,
  servings: recipe.servings,
  prepTimeMinutes: recipe.prepTimeMinutes,
  category: recipe.category,
  ingredients: recipe.ingredients,
  instructions: recipe.instructions,
});

export const RecipeDetailView = ({
  recipe,
  onSave,
  onCancel,
  initialIsEditing = false,
}: Props) => {
  const [isEditing, setIsEditing] = useState(initialIsEditing);
  const [editValues, setEditValues] = useState<RecipeFormValues>(
    toFormValues(recipe),
  );
  const [ingredientDraft, setIngredientDraft] = useState<IngredientDraft>(
    initialIngredientDraft,
  );
  const [instructionDraft, setInstructionDraft] = useState('');

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    setEditValues(toFormValues(recipe));
    setIngredientDraft(initialIngredientDraft);
    setInstructionDraft('');
    setIsEditing(false);
  };

  const handleSave = () => {
    onSave(editValues);
    setIsEditing(false);
  };

  const handleFieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({
      ...prev,
      [name]:
        name === 'servings' || name === 'prepTimeMinutes'
          ? Number(value)
          : value,
    }));
  };

  const handleIngredientChange = (
    id: string,
    field: keyof Omit<Ingredient, 'id'>,
    value: string | number,
  ) => {
    setEditValues((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((i) =>
        i.id === id ? { ...i, [field]: value } : i,
      ),
    }));
  };

  const handleAddIngredient = () => {
    if (!ingredientDraft.name.trim()) return;
    setEditValues((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          id: crypto.randomUUID(),
          ...ingredientDraft,
          name: ingredientDraft.name.trim(),
        },
      ],
    }));
    setIngredientDraft(initialIngredientDraft);
  };

  const handleDeleteIngredient = (id: string) => {
    setEditValues((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((i) => i.id !== id),
    }));
  };

  const handleInstructionChange = (id: string, text: string) => {
    setEditValues((prev) => ({
      ...prev,
      instructions: prev.instructions.map((i) =>
        i.id === id ? { ...i, text } : i,
      ),
    }));
  };

  const handleAddInstruction = () => {
    if (!instructionDraft.trim()) return;
    setEditValues((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { id: crypto.randomUUID(), text: instructionDraft.trim() },
      ],
    }));
    setInstructionDraft('');
  };

  const handleDeleteInstruction = (id: string) => {
    setEditValues((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((i) => i.id !== id),
    }));
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard/recipes"
          className="text-sm text-gray-500 transition hover:text-gray-800"
        >
          ← Mes recettes
        </Link>

        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Sauvegarder
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
          >
            ✏️ Modifier
          </button>
        )}
      </div>

      <div className="h-64 w-full overflow-hidden rounded-xl bg-gray-100">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl text-gray-300">
            🍽️
          </div>
        )}
      </div>

      <div className="mt-6">
        {isEditing ? (
          <input
            name="title"
            value={editValues.title}
            onChange={handleFieldChange}
            className="w-full rounded-md border px-3 py-2 text-3xl font-bold focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
        ) : (
          <h1 className="text-3xl font-bold">{recipe.title}</h1>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          {isEditing ? (
            <>
              <select
                name="category"
                value={editValues.category}
                onChange={handleFieldChange}
                className="rounded-md border px-2 py-1 text-sm"
              >
                <option value="breakfast">Petit-déjeuner</option>
                <option value="lunch">Déjeuner</option>
                <option value="dinner">Dîner</option>
                <option value="dessert">Dessert</option>
              </select>
              <span>·</span>
              <input
                name="servings"
                type="number"
                min="1"
                value={editValues.servings}
                onChange={handleFieldChange}
                className="w-16 rounded-md border px-2 py-1 text-sm"
              />
              <span>portions ·</span>
              <input
                name="prepTimeMinutes"
                type="number"
                min="1"
                value={editValues.prepTimeMinutes}
                onChange={handleFieldChange}
                className="w-16 rounded-md border px-2 py-1 text-sm"
              />
              <span>min</span>
            </>
          ) : (
            <>
              <span>{categoryLabels[recipe.category]}</span>
              <span>·</span>
              <span>{recipe.servings} portions</span>
              <span>·</span>
              <span>{recipe.prepTimeMinutes} min</span>
            </>
          )}
        </div>
      </div>

      <div className="mt-4">
        {isEditing ? (
          <textarea
            name="description"
            value={editValues.description}
            onChange={handleFieldChange}
            rows={3}
            className="w-full rounded-md border px-3 py-2 text-sm leading-relaxed text-gray-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
        ) : (
          recipe.description && (
            <p className="leading-relaxed text-gray-600">
              {recipe.description}
            </p>
          )
        )}
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-xl font-semibold">Ingrédients</h2>
        <ul className="space-y-2">
          {editValues.ingredients.map((ingredient) => (
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
                    {(Object.keys(unitLabels) as IngredientUnit[]).map(
                      (unit) => (
                        <option key={unit} value={unit}>
                          {unitLabels[unit]}
                        </option>
                      ),
                    )}
                  </select>
                  <button
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
                onClick={handleAddIngredient}
                className="rounded border border-gray-300 px-2 py-1 text-sm text-gray-600 transition hover:bg-gray-50"
              >
                Ajouter
              </button>
            </li>
          )}
        </ul>
      </section>

      <section className="mt-8 pb-12">
        <h2 className="mb-3 text-xl font-semibold">Préparation</h2>
        {editValues.instructions.length === 0 && !isEditing ? (
          <p className="text-sm text-gray-400">
            Aucune instruction renseignée.
          </p>
        ) : (
          <ol className="space-y-3">
            {editValues.instructions.map((instruction, index) => (
              <li
                key={instruction.id}
                className="flex items-start gap-3 text-sm"
              >
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
                  {index + 1}
                </span>
                {isEditing ? (
                  <>
                    <textarea
                      value={instruction.text}
                      onChange={(e) =>
                        handleInstructionChange(instruction.id, e.target.value)
                      }
                      rows={2}
                      className="min-w-0 flex-1 rounded border px-2 py-1 text-sm leading-relaxed"
                    />
                    <button
                      onClick={() => handleDeleteInstruction(instruction.id)}
                      className="mt-1 text-gray-400 transition hover:text-red-500"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <span className="leading-relaxed text-gray-700">
                    {instruction.text}
                  </span>
                )}
              </li>
            ))}

            {isEditing && (
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-300">
                  {editValues.instructions.length + 1}
                </span>
                <textarea
                  value={instructionDraft}
                  onChange={(e) => setInstructionDraft(e.target.value)}
                  placeholder="Nouvelle étape..."
                  rows={2}
                  className="min-w-0 flex-1 rounded border px-2 py-1 text-sm placeholder-gray-300"
                />
                <button
                  onClick={handleAddInstruction}
                  className="mt-1 rounded border border-gray-300 px-2 py-1 text-sm text-gray-600 transition hover:bg-gray-50"
                >
                  Ajouter
                </button>
              </li>
            )}
          </ol>
        )}
      </section>
    </div>
  );
};
