import type { IngredientCategory } from '@/types/recipes';

export type ShoppingListGroup = {
  label: string;
  emoji: string;
  cats: IngredientCategory[];
};

export const SHOPPING_LIST_GROUPS: ShoppingListGroup[] = [
  { label: 'Légumes', emoji: '🥦', cats: ['vegetables'] },
  { label: 'Fruits', emoji: '🍎', cats: ['fruits'] },
  { label: 'Viandes & Poissons', emoji: '🥩', cats: ['meat', 'fish'] },
  { label: 'Produits laitiers', emoji: '🧀', cats: ['dairy'] },
  { label: 'Céréales & féculents', emoji: '🌾', cats: ['cereals'] },
  { label: 'Légumineuses', emoji: '🫘', cats: ['legumes'] },
  { label: 'Huiles & matières grasses', emoji: '🫙', cats: ['oils'] },
  { label: 'Condiments', emoji: '🧴', cats: ['condiments'] },
  { label: 'Épices & herbes', emoji: '🌿', cats: ['spices'] },
  { label: 'Fruits secs & noix', emoji: '🥜', cats: ['nuts'] },
  { label: 'Autres', emoji: '🛒', cats: ['other'] },
];

export const COMPACT_UNITS = new Set<string>(['g', 'kg', 'ml', 'l']);
