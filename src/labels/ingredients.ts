import type { IngredientCategory } from '@/types/recipes';

export const ingredientCategoryLabels: Record<IngredientCategory, string> = {
  vegetables: 'Légumes',
  fruits: 'Fruits',
  meat: 'Viandes',
  fish: 'Poissons',
  dairy: 'Produits laitiers',
  cereals: 'Céréales & féculents',
  legumes: 'Légumineuses',
  oils: 'Huiles & matières grasses',
  condiments: 'Condiments',
  spices: 'Épices & herbes',
  nuts: 'Fruits secs & noix',
  other: 'Autres',
};

export const ingredientCategoryEmojis: Record<IngredientCategory, string> = {
  vegetables: '🥦',
  fruits: '🍎',
  meat: '🥩',
  fish: '🐟',
  dairy: '🧀',
  cereals: '🌾',
  legumes: '🫘',
  oils: '🫙',
  condiments: '🧴',
  spices: '🌿',
  nuts: '🥜',
  other: '🛒',
};
