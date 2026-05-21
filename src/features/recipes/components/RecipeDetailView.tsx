'use client';

import { ArrowLeft, Check, Pencil, Trash2, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { RecipePlaceholder } from '@/components/ui/recipe-placeholder';
import { AddToPlanningModal } from '@/features/planner/components/AddToPlanningModal';
import { dateToWeekDay, getWeekStart } from '@/features/planner/utils/date';
import { useRecipeForm } from '@/features/recipes/hooks/useRecipeForm';
import { mealPeriodLabels, weekDayLabels } from '@/labels/planner';
import type { CourseType, MealPeriod } from '@/types/planner';
import { Recipe, RecipeFormValues } from '@/types/recipes';

import { IngredientsSection } from './IngredientsSection';
import { InstructionsSection } from './InstructionsSection';
import { RecipeInfoSection } from './RecipeInfoSection';

type Props = {
  recipe: Recipe;
  onSave: (values: RecipeFormValues) => void;
  onDelete?: () => void;
  onCancel?: () => void;
  initialIsEditing?: boolean;
  onAddToPlanning?: (
    date: string,
    mealPeriod: MealPeriod,
    courseType: CourseType,
  ) => void;
};

export const RecipeDetailView = ({
  recipe,
  onSave,
  onDelete,
  onCancel,
  initialIsEditing = false,
  onAddToPlanning,
}: Props) => {
  const [targetServings, setTargetServings] = useState(recipe.servings);
  const scalingMultiplier = targetServings / recipe.servings;
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    handlePublicToggle,
    handleIngredientChange,
    handleAddIngredient,
    handleDeleteIngredient,
    handleInstructionChange,
    handleInstructionTipChange,
    handleAddInstruction,
    handleDeleteInstruction,
    errors,
  } = useRecipeForm(recipe, { onSave, onCancel, initialIsEditing });

  const weekStart = getWeekStart();

  const handleStartEditing = () => {
    setTargetServings(recipe.servings);
    startEditing();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      noValidate
      className="relative"
    >
      {/* ── Sticky edit toolbar ── */}
      {isEditing && (
        <div className="bg-neutre-800 sticky top-0 z-10 mb-8 flex items-center justify-between rounded-xl px-6 py-4 shadow-md">
          <div className="flex items-center gap-4">
            <span className="bg-terracotta-500 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase">
              Édition
            </span>
            <span className="text-neutre-300 text-sm">Auto-save activé</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 px-4 py-1.5 text-sm text-white transition-colors hover:bg-white/10"
            >
              <X size={13} />
              Annuler les changements
            </button>
            <button
              type="submit"
              className="bg-terracotta-500 hover:bg-terracotta-400 flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-colors"
            >
              <Check size={13} />
              Terminer
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4">
        {/* ── Back link ── */}
        <Link
          href="/dashboard/recipes"
          className="text-neutre-400 hover:text-neutre-700 mb-5 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={14} />
          Retour à mes recettes
        </Link>

        {/* ── Hero grid : image (wider) | info ── */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.15fr_1fr]">
          {/* Image */}
          <div className="group relative h-130 overflow-hidden rounded-2xl">
            {recipe.imageUrl ? (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <RecipePlaceholder className="h-full w-full" iconSize={96} />
            )}

            {/* Image overlay actions */}
            <div className="absolute top-5 right-5 flex gap-2">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
                  >
                    <Pencil size={15} className="text-neutre-600" />
                  </button>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
                  >
                    <Trash2 size={15} className="text-neutre-600" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
                >
                  <span className="text-sm">♡</span>
                </button>
              )}
            </div>

            {/* Replace photo button — edit mode */}
            {isEditing && (
              <div className="absolute right-0 bottom-5 left-0 flex justify-center">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-sm font-medium shadow-md backdrop-blur-sm transition-colors hover:bg-white">
                  <Upload size={14} className="text-neutre-600" />
                  <span className="text-neutre-700">Remplacer la photo</span>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formValues.imageUrl ?? ''}
                    onChange={handleFieldChange}
                    className="sr-only"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Info column */}
          <RecipeInfoSection
            recipe={recipe}
            formValues={formValues}
            isEditing={isEditing}
            handleFieldChange={handleFieldChange}
            onPublicToggle={handlePublicToggle}
            targetServings={targetServings}
            onTargetServingsChange={setTargetServings}
            onStartEditing={handleStartEditing}
            onDelete={onDelete}
            onOpenPlanningModal={
              onAddToPlanning ? () => setIsModalOpen(true) : undefined
            }
            error={{
              title: errors.title,
              description: errors.description,
              servings: errors.servings,
            }}
          />
        </div>

        {/* ── Body grid : ingredients (sticky) | steps + notes ── */}
        <div className="border-neutre-100 mt-20 grid grid-cols-1 gap-12 border-t pt-12 lg:grid-cols-[340px_1fr]">
          {/* Ingredients — sticky */}
          <div className="lg:sticky lg:top-5">
            <IngredientsSection
              isEditing={isEditing}
              ingredients={formValues.ingredients}
              scalingMultiplier={scalingMultiplier}
              targetServings={targetServings}
              ingredientDraft={ingredientDraft}
              setIngredientDraft={setIngredientDraft}
              handleIngredientChange={handleIngredientChange}
              handleAddIngredient={handleAddIngredient}
              handleDeleteIngredient={handleDeleteIngredient}
              error={errors.ingredients}
            />
          </div>

          {/* Steps + notes */}
          <div>
            <InstructionsSection
              isEditing={isEditing}
              instructions={formValues.instructions}
              instructionDraft={instructionDraft}
              setInstructionDraft={setInstructionDraft}
              handleInstructionChange={handleInstructionChange}
              handleInstructionTipChange={handleInstructionTipChange}
              handleAddInstruction={handleAddInstruction}
              handleDeleteInstruction={handleDeleteInstruction}
              error={errors.instructions}
            />

            {/* Notes block — always visible */}
            <div className="bg-sable-50 border-sable-400 mt-12 rounded-r-xl border-l-4 p-6">
              <p className="text-sable-700 mb-3 text-[11px] font-semibold tracking-wider uppercase">
                Notes personnelles
              </p>
              {isEditing ? (
                <textarea
                  name="notes"
                  value={formValues.notes ?? ''}
                  onChange={handleFieldChange}
                  rows={4}
                  placeholder="Julien préfère sans ail. Tester la variante au speck pour Noël…"
                  className="text-neutre-700 placeholder:text-neutre-300 bg-sable-50 w-full resize-none font-serif text-lg leading-relaxed italic focus:outline-none"
                />
              ) : recipe.notes ? (
                <p className="text-neutre-700 font-serif text-lg leading-relaxed italic">
                  « {recipe.notes} »
                </p>
              ) : (
                <p className="text-neutre-300 font-serif text-lg italic">
                  Aucune note. Passez en mode édition pour en ajouter.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Planning modal */}
      {onAddToPlanning && (
        <AddToPlanningModal
          isOpen={isModalOpen}
          weekStart={weekStart}
          onClose={() => setIsModalOpen(false)}
          onAdd={(date, mealPeriod, courseType) => {
            onAddToPlanning(date, mealPeriod, courseType);
            toast.success(
              `${recipe.title} ajouté au planning du ${weekDayLabels[dateToWeekDay(date)]} ${mealPeriodLabels[mealPeriod]}`,
            );
            setIsModalOpen(false);
          }}
        />
      )}
    </form>
  );
};
