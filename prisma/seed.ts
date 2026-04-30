import 'dotenv/config';

import type { IngredientUnit } from '../src/generated/prisma/client';
import { auth } from '../src/lib/auth';
import { prisma } from '../src/lib/prisma';

async function seed() {
  // Compte admin — skip si déjà existant
  let adminId: string;

  const existingAdmin = await prisma.user.findUnique({
    where: { email: process.env.ADMIN_EMAIL! },
  });

  if (!existingAdmin) {
    const result = await auth.api.signUpEmail({
      body: {
        email: process.env.ADMIN_EMAIL!,
        password: process.env.ADMIN_PASSWORD!,
        name: process.env.ADMIN_NAME!,
      },
    });
    adminId = result.user.id;
    console.log('Compte admin créé :', result.user.email);
  } else {
    adminId = existingAdmin.id;
    console.log('Compte admin existant :', existingAdmin.email);
  }

  // Recettes de la bibliothèque
  const libraryRecipes = [
    {
      title: 'Spaghetti bolognese',
      description: 'Un classique italien avec viande hachée et sauce tomate mijotée.',
      servings: 4,
      prepTimeMinutes: 30,
      category: 'dinner' as const,
      ingredients: [
        { nameFr: 'Spaghetti', nameEn: 'Spaghetti', quantity: 400, unit: 'g' as IngredientUnit, category: 'cereals' as const },
        { nameFr: 'Viande hachée', nameEn: 'Ground beef', quantity: 500, unit: 'g' as IngredientUnit, category: 'meat' as const },
        { nameFr: 'Sauce tomate', nameEn: 'Tomato sauce', quantity: 500, unit: 'ml' as IngredientUnit, category: 'condiments' as const },
      ],
      instructions: [
        { text: 'Faire cuire les spaghetti al dente selon les indications du paquet.', position: 1 },
        { text: "Faire revenir la viande hachée dans une poêle avec un filet d'huile.", position: 2 },
        { text: 'Ajouter la sauce tomate et laisser mijoter 15 minutes à feu doux.', position: 3 },
        { text: 'Servir la sauce bolognese sur les spaghetti égouttés.', position: 4 },
      ],
    },
    {
      title: 'Pancakes moelleux',
      description: 'Des pancakes rapides et moelleux pour bien démarrer la journée.',
      servings: 2,
      prepTimeMinutes: 15,
      category: 'breakfast' as const,
      ingredients: [
        { nameFr: 'Farine', nameEn: 'Flour', quantity: 250, unit: 'g' as IngredientUnit, category: 'cereals' as const },
        { nameFr: 'Lait', nameEn: 'Milk', quantity: 300, unit: 'ml' as IngredientUnit, category: 'dairy' as const },
        { nameFr: 'Œufs', nameEn: 'Eggs', quantity: 2, unit: 'unit' as IngredientUnit, category: 'dairy' as const },
        { nameFr: 'Sucre', nameEn: 'Sugar', quantity: 1, unit: 'cas' as IngredientUnit, category: 'condiments' as const },
      ],
      instructions: [
        { text: 'Mélanger la farine et le sucre dans un saladier.', position: 1 },
        { text: 'Ajouter les œufs et le lait progressivement en fouettant pour éviter les grumeaux.', position: 2 },
        { text: 'Chauffer une poêle antiadhésive à feu moyen avec une noix de beurre.', position: 3 },
        { text: "Verser une louche de pâte et cuire 2 minutes de chaque côté jusqu'à dorure.", position: 4 },
      ],
    },
  ];

  for (const recipeData of libraryRecipes) {
    const existing = await prisma.recipe.findFirst({
      where: { title: recipeData.title, isLibrary: true },
    });

    if (existing) {
      console.log(`Recette existante : ${recipeData.title}`);
      continue;
    }

    const { ingredients, instructions, ...recipeFields } = recipeData;

    const recipe = await prisma.recipe.create({
      data: { ...recipeFields, isLibrary: true, userId: adminId },
    });

    for (const ing of ingredients) {
      const { quantity, unit, ...ingredientData } = ing;

      let ingredient = await prisma.ingredient.findFirst({
        where: { nameFr: ingredientData.nameFr },
      });

      if (!ingredient) {
        ingredient = await prisma.ingredient.create({
          data: ingredientData,
        });
      }

      await prisma.recipeIngredient.create({
        data: { recipeId: recipe.id, ingredientId: ingredient.id, quantity, unit },
      });
    }

    await prisma.instruction.createMany({
      data: instructions.map((inst) => ({ ...inst, recipeId: recipe.id })),
    });

    console.log(`Recette créée : ${recipe.title}`);
  }
}

seed()
  .catch(console.error)
  .finally(() => process.exit(0));
