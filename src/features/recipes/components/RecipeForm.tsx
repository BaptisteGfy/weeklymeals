import { useState } from 'react';

import type {
  Ingredient,
  IngredientDraft,
  Instruction,
  RecipeCategory,
} from '../types';
import { IngredientSection } from './IngredientSection';
import { InstructionSection } from './InstructionSection';

export type RecipeFormValues = {
  title: string;
  description: string;
  servings: number;
  prepTimeMinutes: number;
  category: RecipeCategory;
  ingredients: Ingredient[];
  instructions: Instruction[];
};

const initialFormValues: RecipeFormValues = {
  title: '',
  description: '',
  servings: 1,
  prepTimeMinutes: 10,
  category: 'dinner',
  ingredients: [],
  instructions: [],
};

const initialIngredientDraft: IngredientDraft = {
  name: '',
  quantity: 1,
  unit: 'unit',
};

type Props = {
  onSubmit: (values: RecipeFormValues) => void;
  onCancel: () => void;
  initialValues?: RecipeFormValues;
  isEditing?: boolean;
};

export const RecipeForm = ({
  onSubmit,
  onCancel,
  initialValues,
  isEditing = false,
}: Props) => {
  const [formValues, setFormValues] = useState<RecipeFormValues>(
    initialValues ?? initialFormValues,
  );
  const [ingredientValues, setIngredientValues] = useState<IngredientDraft>(
    initialIngredientDraft,
  );
  const [instruction, setInstruction] = useState('');

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]:
        name === 'servings' || name === 'prepTimeMinutes'
          ? Number(value)
          : value,
    }));
  };

  const handleIngredientInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setIngredientValues((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleAddIngredient = () => {
    if (!ingredientValues.name.trim()) {
      return;
    }

    const newIngredient: Ingredient = {
      id: crypto.randomUUID(),
      name: ingredientValues.name.trim(),
      quantity: ingredientValues.quantity,
      unit: ingredientValues.unit,
    };

    setFormValues((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient],
    }));

    setIngredientValues(initialIngredientDraft);
  };

  const handleAddInstruction = () => {
    if (!instruction.trim()) return;

    const newInstruction: Instruction = {
      id: crypto.randomUUID(),
      text: instruction.trim(),
    };

    setFormValues((prev) => ({
      ...prev,
      instructions: [...prev.instructions, newInstruction],
    }));

    setInstruction('');
  };

  const handleDeleteInstruction = (id: string) => {
    setFormValues((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((ins) => ins.id !== id),
    }));
  };

  const handleDeleteIngredient = (ingredientId: string) => {
    setFormValues((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter(
        (ingredient) => ingredient.id !== ingredientId,
      ),
    }));
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit(formValues);
    setFormValues(initialFormValues);
    setIngredientValues(initialIngredientDraft);
    setInstruction('');
  };

  return (
    <section className="mb-8 rounded-xl border p-4 shadow-sm">
      <h2 className="mb-4 text-2xl font-semibold">
        {isEditing ? 'Modifier la recette' : 'Ajouter une recette'}
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-lg font-semibold">Informations générales</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="title">
                Titre
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formValues.title}
                onChange={handleInputChange}
                className="rounded-md border px-3 py-2 text-sm"
                placeholder="Ex : Gratin de pâtes"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                className="min-h-24 rounded-md border px-3 py-2 text-sm"
                placeholder="Décris rapidement la recette"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="servings">
                  Portions
                </label>
                <input
                  id="servings"
                  name="servings"
                  type="number"
                  min="1"
                  value={formValues.servings}
                  onChange={handleInputChange}
                  className="rounded-md border px-3 py-2 text-sm"
                />
              </div>

              <div className="grid gap-2">
                <label
                  className="text-sm font-medium"
                  htmlFor="prepTimeMinutes"
                >
                  Préparation (min)
                </label>
                <input
                  id="prepTimeMinutes"
                  name="prepTimeMinutes"
                  type="number"
                  min="1"
                  value={formValues.prepTimeMinutes}
                  onChange={handleInputChange}
                  className="rounded-md border px-3 py-2 text-sm"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="category">
                  Catégorie
                </label>
                <select
                  id="category"
                  name="category"
                  value={formValues.category}
                  onChange={handleInputChange}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  <option value="breakfast">Petit-déjeuner</option>
                  <option value="lunch">Déjeuner</option>
                  <option value="dinner">Dîner</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <IngredientSection
          ingredients={formValues.ingredients}
          ingredientValues={ingredientValues}
          onIngredientInputChange={handleIngredientInputChange}
          onAddIngredient={handleAddIngredient}
          onDeleteIngredient={handleDeleteIngredient}
        />
        <InstructionSection
          instruction={instruction}
          instructions={formValues.instructions}
          onInstructionChange={setInstruction}
          onAddInstruction={handleAddInstruction}
          onDeleteInstruction={handleDeleteInstruction}
        />

        <div className="flex items-center justify-end gap-3 pt-4">
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Annuler
            </button>
          )}

          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            {isEditing ? 'Mettre à jour la recette' : 'Ajouter la recette'}
          </button>
        </div>
      </form>
    </section>
  );
};
