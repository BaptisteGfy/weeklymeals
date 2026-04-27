'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { AddToPlanningModal } from '@/features/planner/AddToPlanningModal';
import { mealTypeLabels, weekDayLabels } from '@/features/planner/constants';
import { MealType, WeekDay } from '@/features/planner/types';

import { useRecipeEditing } from '../hooks/useRecipeEditing';
import {
  categoryLabels,
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
  onAddToPlanning?: (day: WeekDay, mealType: MealType) => void;
};

export const RecipeDetailView = ({
  recipe,
  onSave,
  onCancel,
  initialIsEditing = false,
  onAddToPlanning,
}: Props) => {
  const {
    isEditing,
    startEditing,
    editValues,
    ingredientDraft,
    setIngredientDraft,
    instructionDraft,
    setInstructionDraft,
    handleCancel,
    handleSave,
    handleFieldChange,
    handleIngredientChange,
    handleAddIngredient,
    handleDeleteIngredient,
    handleInstructionChange,
    handleAddInstruction,
    handleDeleteInstruction,
    errors,
  } = useRecipeEditing(recipe, { onSave, onCancel, initialIsEditing });

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      noValidate
      className="mx-auto max-w-2xl px-4 py-6"
    >
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
              type="button"
              onClick={handleCancel}
              className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Sauvegarder
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={startEditing}
              className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
            >
              ✏️ Modifier
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
            >
              🕒 Ajouter à l'agenda
            </button>
          </>
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
          <div>
            <input
              name="title"
              value={editValues.title}
              onChange={handleFieldChange}
              aria-label="Titre de la recette"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
              className={`w-full rounded-md border px-3 py-2 text-3xl font-bold focus:ring-2 focus:outline-none ${
                errors.title
                  ? 'border-red-400 focus:ring-red-200'
                  : 'focus:ring-blue-200'
              }`}
            />
            {errors.title && (
              <p
                id="title-error"
                role="alert"
                className="mt-1 text-sm text-red-500"
              >
                {errors.title}
              </p>
            )}
          </div>
        ) : (
          <h1 className="text-3xl font-bold">{recipe.title}</h1>
        )}

        <div className="mt-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
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
                  aria-label="Nombre de portions"
                  aria-invalid={!!errors.servings}
                  aria-describedby={
                    errors.servings ? 'servings-error' : undefined
                  }
                  className={`w-16 rounded-md border px-2 py-1 text-sm ${
                    errors.servings ? 'border-red-400' : ''
                  }`}
                />
                <span>portions ·</span>
                <input
                  name="prepTimeMinutes"
                  type="number"
                  min="1"
                  value={editValues.prepTimeMinutes}
                  onChange={handleFieldChange}
                  aria-label="Temps de préparation en minutes"
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
          {/* Erreur servings sous la ligne inline, visible uniquement en mode édition */}
          {isEditing && errors.servings && (
            <p
              id="servings-error"
              role="alert"
              className="mt-1 text-sm text-red-500"
            >
              {errors.servings}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        {isEditing ? (
          <div>
            <textarea
              name="description"
              value={editValues.description}
              onChange={handleFieldChange}
              rows={3}
              aria-label="Description de la recette"
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? 'description-error' : undefined
              }
              className={`w-full rounded-md border px-3 py-2 text-sm leading-relaxed text-gray-600 focus:ring-2 focus:outline-none ${
                errors.description
                  ? 'border-red-400 focus:ring-red-200'
                  : 'focus:ring-blue-200'
              }`}
            />
            {errors.description && (
              <p
                id="description-error"
                role="alert"
                className="mt-1 text-sm text-red-500"
              >
                {errors.description}
              </p>
            )}
          </div>
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
        {/* Erreur au niveau de la section — couvre "liste vide" et "ingrédient invalide" */}
        {isEditing && errors.ingredients && (
          <p
            id="ingredients-error"
            role="alert"
            className="mt-2 text-sm text-red-500"
          >
            {errors.ingredients}
          </p>
        )}
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
                      type="button"
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
                  type="button"
                  onClick={handleAddInstruction}
                  className="mt-1 rounded border border-gray-300 px-2 py-1 text-sm text-gray-600 transition hover:bg-gray-50"
                >
                  Ajouter
                </button>
              </li>
            )}
          </ol>
        )}
        {/* Erreur au niveau de la section — couvre "liste vide" et "étape avec texte vide" */}
        {isEditing && errors.instructions && (
          <p
            id="instructions-error"
            role="alert"
            className="mt-2 text-sm text-red-500"
          >
            {errors.instructions}
          </p>
        )}
      </section>

      {onAddToPlanning && (
        <AddToPlanningModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={(day, mealType) => {
            onAddToPlanning(day, mealType);
            toast.success(
              `${recipe.title} ajouté au planning du ${weekDayLabels[day]} ${mealTypeLabels[mealType]}`,
            );
          }}
        />
      )}
    </form>
  );
};
