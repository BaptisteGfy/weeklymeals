import { useState } from 'react';
import type { Ingredient, IngredientUnit, RecipeCategory } from '../types';

export type RecipeFormValues = {
  title: string;
  description: string;
  servings: number;
  prepTimeMinutes: number;
  category: RecipeCategory;
  ingredients: Ingredient[];
};

const initialFormValues: RecipeFormValues = {
  title: '',
  description: '',
  servings: 1,
  prepTimeMinutes: 10,
  category: 'dinner',
  ingredients: [],
};

type IngredientDraft = {
  name: string;
  quantity: number;
  unit: IngredientUnit;
};

const initialIngredientDraft: IngredientDraft = {
  name: '',
  quantity: 1,
  unit: 'unit',
};

const unitLabels: Record<IngredientUnit, string> = {
  g: 'g',
  kg: 'kg',
  ml: 'ml',
  l: 'l',
  cac: 'cuillère à café',
  cas: 'cuillère à soupe',
  unit: 'pièce',
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
  };

  return (
    <section className="mb-8 rounded-xl border p-4 shadow-sm">
      <h2 className="mb-4 text-2xl font-semibold">
        {isEditing ? 'Modifier la recette' : 'Ajouter une recette'}
      </h2>

      <form className="grid gap-6" onSubmit={handleSubmit}>
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
              <label className="text-sm font-medium" htmlFor="prepTimeMinutes">
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

        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-lg font-semibold">Ingrédients</h3>

          <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto]">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="ingredient-name">
                Nom
              </label>
              <input
                id="ingredient-name"
                name="name"
                type="text"
                value={ingredientValues.name}
                onChange={handleIngredientInputChange}
                className="rounded-md border px-3 py-2 text-sm"
                placeholder="Ex : Farine"
              />
            </div>

            <div className="grid gap-2">
              <label
                className="text-sm font-medium"
                htmlFor="ingredient-quantity"
              >
                Quantité
              </label>
              <input
                id="ingredient-quantity"
                name="quantity"
                type="number"
                min="1"
                value={ingredientValues.quantity}
                onChange={handleIngredientInputChange}
                className="rounded-md border px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="ingredient-unit">
                Unité
              </label>
              <select
                id="ingredient-unit"
                name="unit"
                value={ingredientValues.unit}
                onChange={handleIngredientInputChange}
                className="rounded-md border px-3 py-2 text-sm"
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="cac">Cuillère à café</option>
                <option value="cas">Cuillère à soupe</option>
                <option value="unit">Pièce</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddIngredient}
                className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Ajouter
              </button>
            </div>
          </div>

          <div className="mt-4">
            {formValues.ingredients.length === 0 ? (
              <p className="text-sm text-slate-500">
                Aucun ingrédient ajouté pour le moment.
              </p>
            ) : (
              <ul className="grid gap-2">
                {formValues.ingredients.map((ingredient) => (
                  <li
                    key={ingredient.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <span>
                      {ingredient.name} — {ingredient.quantity}{' '}
                      {unitLabels[ingredient.unit]}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteIngredient(ingredient.id)}
                      className="inline-flex items-center gap-2 rounded-md border border-red-300 px-3 py-1 text-sm font-medium text-red-600 transition hover:border-red-400 hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            {isEditing ? 'Mettre à jour la recette' : 'Ajouter la recette'}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </section>
  );
};
