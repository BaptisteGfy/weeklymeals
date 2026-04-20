import { useState } from 'react';
import type { RecipeCategory } from '../types';

export type RecipeFormValues = {
  title: string;
  description: string;
  servings: number;
  prepTimeMinutes: number;
  category: RecipeCategory;
};

const initialFormValues: RecipeFormValues = {
  title: '',
  description: '',
  servings: 1,
  prepTimeMinutes: 10,
  category: 'dinner',
};

type Props = {
  onSubmit: (values: RecipeFormValues) => void;
  onCancel?: () => void;
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

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit(formValues);
    setFormValues(initialFormValues);
  };

  return (
    <section className="mb-8 rounded-xl border p-4 shadow-sm">
      <h2 className="mb-4 text-2xl font-semibold">
        {isEditing ? 'Modifier la recette' : 'Ajouter une recette'}
      </h2>

      <form className="grid gap-4" onSubmit={handleSubmit}>
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
        // center buttons if editing, align to the left if creating
        <div className="flex gap-2 mt-4 m-auto">
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
