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
      { id: 'ins-1', text: 'Faire cuire les spaghetti.' },
      { id: 'ins-2', text: 'Cuire la viande dans une poêle.' },
      { id: 'ins-3', text: 'Ajouter la sauce tomate et laisser mijoter.' },
      { id: 'ins-4', text: 'Servir la sauce sur les spaghetti.' },
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
      { id: 'ins-5', text: 'Mélanger tous les ingrédients dans un saladier.' },
      { id: 'ins-6', text: 'Faire chauffer une poêle.' },
      { id: 'ins-7', text: 'Verser un peu de pâte et cuire des deux côtés.' },
    ],
    servings: 2,
    prepTimeMinutes: 15,
    category: 'breakfast',
  },
];
