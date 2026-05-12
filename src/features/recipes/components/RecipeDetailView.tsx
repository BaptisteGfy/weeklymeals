'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { AddToPlanningModal } from '@/features/planner/components/AddToPlanningModal';
import { mealTypeLabels, weekDayLabels } from '@/features/planner/constants';
import { MealType } from '@/features/planner/types';
import { dateToWeekDay, getWeekStart } from '@/features/planner/utils/date';
import { useRecipeForm } from '@/features/recipes/hooks/useRecipeForm';
import { Recipe, RecipeFormValues } from '@/features/recipes/types';

import { IngredientsSection } from './IngredientsSection';
import { InstructionsSection } from './InstructionsSection';
import { RecipeActionBar } from './RecipeActionBar';
import { RecipeInfoSection } from './RecipeInfoSection';

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
      <RecipeActionBar
        isEditing={isEditing}
        startEditing={startEditing}
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
        error={{
          title: errors.title,
          description: errors.description,
          servings: errors.servings,
        }}
      />

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
