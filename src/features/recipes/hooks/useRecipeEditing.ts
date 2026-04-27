import { useState } from 'react';

import {
  Ingredient,
  IngredientDraft,
  Recipe,
  RecipeFormValues,
} from '../types';

type Options = {
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

export const useRecipeEditing = (
  recipe: Recipe,
  { onSave, onCancel, initialIsEditing = false }: Options,
) => {
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

  return {
    isEditing,
    startEditing: () => setIsEditing(true),
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
  };
};
