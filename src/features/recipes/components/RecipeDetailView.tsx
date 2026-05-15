'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { AddToPlanningModal } from '@/features/planner/components/AddToPlanningModal';
import { dateToWeekDay, getWeekStart } from '@/features/planner/utils/date';
import { useRecipeForm } from '@/features/recipes/hooks/useRecipeForm';
import { mealPeriodLabels, weekDayLabels } from '@/labels/planner';
import type { CourseType, MealPeriod } from '@/types/planner';
import { Recipe, RecipeFormValues } from '@/types/recipes';

import { IngredientsSection } from './IngredientsSection';
import { InstructionsSection } from './InstructionsSection';
import { RecipeActionBar } from './RecipeActionBar';
import { RecipeInfoSection } from './RecipeInfoSection';

type Props = {
  recipe: Recipe;
  onSave: (values: RecipeFormValues) => void;
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
  onCancel,
  initialIsEditing = false,
  onAddToPlanning,
}: Props) => {
  const [targetServings, setTargetServings] = useState(recipe.servings);
  const scalingMultiplier = targetServings / recipe.servings;

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
      className="mx-auto max-w-2xl px-4 py-6"
    >
      <RecipeActionBar
        isEditing={isEditing}
        startEditing={handleStartEditing}
        handleCancel={handleCancel}
        showPlanningButton={!!onAddToPlanning}
        onOpenModal={() => setIsModalOpen(true)}
      />

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

      <RecipeInfoSection
        recipe={recipe}
        formValues={formValues}
        isEditing={isEditing}
        handleFieldChange={handleFieldChange}
        targetServings={targetServings}
        onTargetServingsChange={setTargetServings}
        error={{
          title: errors.title,
          description: errors.description,
          servings: errors.servings,
        }}
      />

      <IngredientsSection
        isEditing={isEditing}
        ingredients={formValues.ingredients}
        scalingMultiplier={scalingMultiplier}
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
          onAdd={(date, mealPeriod, courseType) => {
            onAddToPlanning(date, mealPeriod, courseType);
            toast.success(
              `${recipe.title} ajouté au planning du ${weekDayLabels[dateToWeekDay(date)]} ${mealPeriodLabels[mealPeriod]}`,
            );
          }}
        />
      )}
    </form>
  );
};
