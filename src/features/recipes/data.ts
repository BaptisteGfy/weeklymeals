import type { Recipe } from './types';

export const recipes: Recipe[] = [
  {
    id: 'recipe-1',
    title: 'Spaghetti bolognese',
    description: 'Un classique avec viande hachée et sauce tomate.',
    ingredients: [
      { id: 'ing-1', name: 'Spaghetti', quantity: 400, unit: 'g' },
      { id: 'ing-2', name: 'Viande hachée', quantity: 500, unit: 'g' },
      { id: 'ing-3', name: 'Sauce tomate', quantity: 500, unit: 'ml' },
    ],
    instructions: [
      'Faire cuire les spaghetti.',
      'Cuire la viande dans une poêle.',
      'Ajouter la sauce tomate et laisser mijoter.',
      'Servir la sauce sur les spaghetti.',
    ],
    servings: 4,
    prepTimeMinutes: 30,
    category: 'dinner',
  },
  {
    id: 'recipe-2',
    title: 'Pancakes',
    description: 'Des pancakes rapides pour le petit-déjeuner.',
    ingredients: [
      { id: 'ing-4', name: 'Farine', quantity: 250, unit: 'g' },
      { id: 'ing-5', name: 'Lait', quantity: 300, unit: 'ml' },
      { id: 'ing-6', name: 'Œufs', quantity: 2, unit: 'unit' },
      { id: 'ing-7', name: 'Sucre', quantity: 1, unit: 'cas' },
    ],
    instructions: [
      'Mélanger tous les ingrédients dans un saladier.',
      'Faire chauffer une poêle.',
      'Verser un peu de pâte et cuire des deux côtés.',
    ],
    servings: 2,
    prepTimeMinutes: 15,
    category: 'breakfast',
  },
];