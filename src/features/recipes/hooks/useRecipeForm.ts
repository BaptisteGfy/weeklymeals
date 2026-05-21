import { useState } from 'react';

import {
  Ingredient,
  IngredientDraft,
  Recipe,
  RecipeFormValues,
} from '@/types/recipes';

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

const NUMERIC_FIELDS = [
  'servings',
  'prepTimeMinutes',
  'cookTimeMinutes',
  'restTimeMinutes',
];

const deriveGroups = (ingredients: Ingredient[]): string[] => [
  ...new Set(ingredients.map((i) => i.group).filter(Boolean) as string[]),
];

const recipeToFormValues = (recipe: Recipe): RecipeFormValues => ({
  imageUrl: recipe.imageUrl,
  title: recipe.title,
  description: recipe.description,
  notes: recipe.notes,
  servings: recipe.servings,
  prepTimeMinutes: recipe.prepTimeMinutes,
  cookTimeMinutes: recipe.cookTimeMinutes,
  restTimeMinutes: recipe.restTimeMinutes,
  category: recipe.category,
  isPublic: recipe.isPublic,
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
  const [ingredientGroups, setIngredientGroups] = useState<string[]>(() =>
    deriveGroups(recipe.ingredients),
  );
  const [instructionDraft, setInstructionDraft] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    setFormValues(recipeToFormValues(recipe));
    setIngredientGroups(deriveGroups(recipe.ingredients));
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
      [name]: NUMERIC_FIELDS.includes(name) ? Number(value) : value,
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

  const handleAddIngredient = (draft: IngredientDraft, group?: string) => {
    if (!draft.name.trim()) return;
    setFormValues((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          id: crypto.randomUUID(),
          category: 'other' as const,
          ...draft,
          name: draft.name.trim(),
          group,
        },
      ],
    }));
    setErrors((prev) => ({ ...prev, ingredients: undefined }));
  };

  const handleDeleteIngredient = (id: string) => {
    setFormValues((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((i) => i.id !== id),
    }));
  };

  const handleAddGroup = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || ingredientGroups.includes(trimmed)) return;
    setIngredientGroups((prev) => [...prev, trimmed]);
  };

  const handleRenameGroup = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setIngredientGroups((prev) =>
      prev.map((g) => (g === oldName ? trimmed : g)),
    );
    setFormValues((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((i) =>
        i.group === oldName ? { ...i, group: trimmed } : i,
      ),
    }));
  };

  const handleDeleteGroup = (name: string) => {
    setIngredientGroups((prev) => prev.filter((g) => g !== name));
    setFormValues((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((i) =>
        i.group === name ? { ...i, group: undefined } : i,
      ),
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

  const handleInstructionTipChange = (id: string, tip: string) => {
    setFormValues((prev) => ({
      ...prev,
      instructions: prev.instructions.map((i) =>
        i.id === id ? { ...i, tip: tip || undefined } : i,
      ),
    }));
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
    ingredientGroups,
    instructionDraft,
    setInstructionDraft,
    handleCancel,
    handleSave,
    handleFieldChange,
    handlePublicToggle: (value: boolean) =>
      setFormValues((prev) => ({ ...prev, isPublic: value })),
    handleIngredientChange,
    handleAddIngredient,
    handleDeleteIngredient,
    handleAddGroup,
    handleRenameGroup,
    handleDeleteGroup,
    handleInstructionChange,
    handleInstructionTipChange,
    handleAddInstruction,
    handleDeleteInstruction,
    errors,
  };
};
