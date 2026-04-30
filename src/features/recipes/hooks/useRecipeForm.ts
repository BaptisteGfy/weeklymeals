import { useState } from 'react';

import {
  Ingredient,
  IngredientDraft,
  Recipe,
  RecipeFormValues,
} from '../types';

type UseRecipeFormOptions = {
  onSave: (values: RecipeFormValues) => void;
  onCancel?: () => void;
  initialIsEditing?: boolean;
};

type FormErrors = {
  title?: string;
  description?: string;
  servings?: string;
  prepTimeMinutes?: string;
  ingredients?: string;
  instructions?: string;
};

const validate = (values: RecipeFormValues): FormErrors => {
  const errors: FormErrors = {};

  if (!values.title.trim()) {
    errors.title = 'Le titre est requis';
  }

  if (!values.description.trim()) {
    errors.description = 'La description ne peut pas être vide';
  }

  if (values.servings <= 0) {
    errors.servings = 'Le nombre de portions doit être supérieur à 0';
  }

  if (values.ingredients.length === 0) {
    errors.ingredients = 'Au moins un ingrédient est requis';
  } else {
    for (const [index, ingredient] of values.ingredients.entries()) {
      if (!ingredient.name.trim()) {
        errors.ingredients = `Le nom de l'ingrédient #${index + 1} est requis`;
        break;
      }
      if (ingredient.quantity <= 0) {
        errors.ingredients = `La quantité de l'ingrédient #${index + 1} doit être > 0`;
        break;
      }
    }
  }

  if (values.instructions.length === 0) {
    errors.instructions = 'Au moins une étape de préparation est requise';
  } else {
    for (const [index, instruction] of values.instructions.entries()) {
      if (!instruction.text.trim()) {
        errors.instructions = `Le texte de l'étape #${index + 1} est requis`;
        break;
      }
    }
  }

  return errors;
};

const initialIngredientDraft: IngredientDraft = {
  name: '',
  quantity: 1,
  unit: 'unit',
};

const recipeToFormValues = (recipe: Recipe): RecipeFormValues => ({
  title: recipe.title,
  description: recipe.description,
  servings: recipe.servings,
  prepTimeMinutes: recipe.prepTimeMinutes,
  category: recipe.category,
  ingredients: recipe.ingredients,
  instructions: recipe.instructions,
});

export const useRecipeForm = (
  recipe: Recipe,
  { onSave, onCancel, initialIsEditing = false }: UseRecipeFormOptions,
) => {
  const [isEditing, setIsEditing] = useState(initialIsEditing);
  const [formValues, setFormValues] = useState<RecipeFormValues>(
    recipeToFormValues(recipe),
  );
  const [ingredientDraft, setIngredientDraft] = useState<IngredientDraft>(
    initialIngredientDraft,
  );
  const [instructionDraft, setInstructionDraft] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    setFormValues(recipeToFormValues(recipe));
    setIngredientDraft(initialIngredientDraft);
    setInstructionDraft('');
    setIsEditing(false);
    setErrors({});
  };

  const handleSave = () => {
    const validationErrors = validate(formValues);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSave(formValues);
      setIsEditing(false);
    }
  };

  const handleFieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]:
        name === 'servings' || name === 'prepTimeMinutes'
          ? Number(value)
          : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleIngredientChange = (
    id: string,
    field: keyof Omit<Ingredient, 'id'>,
    value: string | number,
  ) => {
    setFormValues((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((i) =>
        i.id === id ? { ...i, [field]: value } : i,
      ),
    }));
    setErrors((prev) => ({ ...prev, ingredients: undefined }));
  };

  const handleAddIngredient = () => {
    if (!ingredientDraft.name.trim()) return;
    setFormValues((prev) => ({
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
    setErrors((prev) => ({ ...prev, ingredients: undefined }));
  };

  const handleDeleteIngredient = (id: string) => {
    setFormValues((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((i) => i.id !== id),
    }));
  };

  const handleInstructionChange = (id: string, text: string) => {
    setFormValues((prev) => ({
      ...prev,
      instructions: prev.instructions.map((i) =>
        i.id === id ? { ...i, text } : i,
      ),
    }));
    setErrors((prev) => ({ ...prev, instructions: undefined }));
  };

  const handleAddInstruction = () => {
    if (!instructionDraft.trim()) return;
    setFormValues((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { id: crypto.randomUUID(), text: instructionDraft.trim() },
      ],
    }));
    setInstructionDraft('');
    setErrors((prev) => ({ ...prev, instructions: undefined }));
  };

  const handleDeleteInstruction = (id: string) => {
    setFormValues((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((i) => i.id !== id),
    }));
  };

  return {
    isEditing,
    startEditing: () => setIsEditing(true),
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
  };
};
