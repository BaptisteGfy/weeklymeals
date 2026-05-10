'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { AddToPlanningModal } from '@/features/planner/components/AddToPlanningModal';
import { mealTypeLabels, weekDayLabels } from '@/features/planner/constants';
import { MealType } from '@/features/planner/types';
import { dateToWeekDay, getWeekStart } from '@/features/planner/utils/date';

import { categoryLabels } from '../constants';
import { useRecipeForm } from '../hooks/useRecipeForm';
import { Recipe, RecipeFormValues } from '../types';
import { IngredientsSection } from './IngredientsSection';
import { InstructionsSection } from './InstructionsSection';

type Props = {
  recipe: Recipe;
  onSave: (values: RecipeFormValues) => void;
  onCancel?: () => void;
  initialIsEditing?: boolean;
  onAddToPlanning?: (date: string, mealType: MealType) => void;
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
    formValues,
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
  } = useRecipeForm(recipe, { onSave, onCancel, initialIsEditing });

  const weekStart = getWeekStart();

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
              value={formValues.title}
              onChange={handleFieldChange}
              aria-label="Titre de la recette"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
              className={clsx(
                'w-full rounded-md border px-3 py-2 text-3xl font-bold focus:ring-2 focus:outline-none',
                errors.title
                  ? 'border-red-400 focus:ring-red-200'
                  : 'focus:ring-blue-200',
              )}
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
                  value={formValues.category}
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
                  value={formValues.servings}
                  onChange={handleFieldChange}
                  aria-label="Nombre de portions"
                  aria-invalid={!!errors.servings}
                  aria-describedby={
                    errors.servings ? 'servings-error' : undefined
                  }
                  className={clsx(
                    'w-16 rounded-md border px-2 py-1 text-sm',
                    errors.servings && 'border-red-400',
                  )}
                />
                <span>portions ·</span>
                <input
                  name="prepTimeMinutes"
                  type="number"
                  min="1"
                  value={formValues.prepTimeMinutes}
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
              value={formValues.description}
              onChange={handleFieldChange}
              rows={3}
              aria-label="Description de la recette"
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? 'description-error' : undefined
              }
              className={clsx(
                'w-full rounded-md border px-3 py-2 text-sm leading-relaxed text-gray-600 focus:ring-2 focus:outline-none',
                errors.description
                  ? 'border-red-400 focus:ring-red-200'
                  : 'focus:ring-blue-200',
              )}
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

      <IngredientsSection
        isEditing={isEditing}
        ingredients={formValues.ingredients}
        ingredientDraft={ingredientDraft}
        setIngredientDraft={setIngredientDraft}
        handleIngredientChange={handleIngredientChange}
        handleAddIngredient={handleAddIngredient}
        handleDeleteIngredient={handleDeleteIngredient}
        error={errors.ingredients}
      />

      <InstructionsSection
        isEditing={isEditing}
        instructions={formValues.instructions}
        instructionDraft={instructionDraft}
        setInstructionDraft={setInstructionDraft}
        handleInstructionChange={handleInstructionChange}
        handleAddInstruction={handleAddInstruction}
        handleDeleteInstruction={handleDeleteInstruction}
        error={errors.instructions}
      />
      

      {onAddToPlanning && (
        <AddToPlanningModal
          isOpen={isModalOpen}
          weekStart={weekStart}
          onClose={() => setIsModalOpen(false)}
          onAdd={(date, mealType) => {
            onAddToPlanning(date, mealType);
            toast.success(
              `${recipe.title} ajouté au planning du ${weekDayLabels[dateToWeekDay(date)]} ${mealTypeLabels[mealType]}`,
            );
          }}
        />
      )}
    </form>
  );
};
