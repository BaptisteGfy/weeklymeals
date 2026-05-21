import { Block } from '@//app/dashboard/admin/design-system/components/ds-helpers';
import { RecipeCard } from '@/components/shared/RecipeCard';

const MOCK_BASE = {
  servings: 4,
  prepTimeMinutes: 15,
  cookTimeMinutes: 25,
  description:
    'Une recette savoureuse et facile à préparer, idéale pour toute la famille.',
};

const mockRecipes = [
  {
    id: '1',
    title: 'Risotto champignons & thym',
    category: 'dinner' as const,
    imageUrl:
      'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop',
    ...MOCK_BASE,
  },
  {
    id: '2',
    title: 'Curry pois chiches',
    category: 'lunch' as const,
    imageUrl:
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    ...MOCK_BASE,
  },
  {
    id: '3',
    title: 'Tarte aux poireaux',
    category: 'dinner' as const,
    imageUrl: null,
    ...MOCK_BASE,
  },
  {
    id: '4',
    title: 'Granola maison & fruits rouges',
    category: 'breakfast' as const,
    imageUrl:
      'https://images.unsplash.com/photo-1517093728432-a0440f8d45af?w=400&h=300&fit=crop',
    ...MOCK_BASE,
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
  },
];

export const RecipeCardDisplay = () => (
  <div className="space-y-8">
    <Block title="Mes recettes (menu 3 points au hover)">
      <div className="grid grid-cols-4 gap-4">
        {mockRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onDelete={(id) => console.log('delete', id)}
          />
        ))}
      </div>
    </Block>

    <Block title="Bibliothèque (bouton save)">
      <div className="grid grid-cols-4 gap-4">
        <RecipeCard
          recipe={mockRecipes[0]}
          onSave={() => {}}
          isSaved={false}
          badge={{ label: 'WeeklyMeals', variant: 'library' }}
        />
        <RecipeCard
          recipe={mockRecipes[1]}
          onSave={() => {}}
          isSaved={true}
          badge={{ label: 'WeeklyMeals', variant: 'library' }}
        />
        <RecipeCard recipe={mockRecipes[2]} onSave={() => {}} isSaved={false} />
        <RecipeCard
          recipe={mockRecipes[3]}
          onSave={() => {}}
          isSaved={false}
          badge={{ label: 'Marine D.', variant: 'user' }}
        />
      </div>
    </Block>

    <Block title="Compact — suggestions dashboard & planning (grille 2-3 cols en contexte réel)">
      <div className="grid grid-cols-2 gap-4">
        {mockRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} variant="compact" />
        ))}
      </div>
    </Block>

    <Block title="Mini — listes & RecipePickerModal">
      <div className="flex max-w-sm flex-col gap-2">
        {mockRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} variant="mini" />
        ))}
      </div>
    </Block>
  </div>
);
