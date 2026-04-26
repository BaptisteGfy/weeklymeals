import { categoryLabels, Recipe, unitLabels } from '../types';

type Props = { recipe: Recipe };

export const RecipeDetailView = ({ recipe }: Props) => {
  return (
    <div>
      <p>{recipe.title}</p>
      <ul>
        <li>servings : {recipe.servings} </li>
        <li>{recipe.prepTimeMinutes} minutes</li>
        <li>{categoryLabels[recipe.category]}</li>
      </ul>
      <p>{recipe.description}</p>
      <h3>Ingrédients</h3>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            {ingredient.name} - {ingredient.quantity}{' '}
            {unitLabels[ingredient.unit]}
          </li>
        ))}
      </ul>
      <h3>Instructions</h3>
      <ol>
        {recipe.instructions.map((instruction) => (
          <li key={instruction.id}>{instruction.text}</li>
        ))}
      </ol>
      <button>Modifier</button>
    </div>
  );
};
