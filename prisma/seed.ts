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

  // Reset des recettes de bibliothèque existantes pour garantir un état propre
  const existingLibrary = await prisma.recipe.findMany({
    where: { isLibrary: true },
    select: { id: true },
  });
  if (existingLibrary.length > 0) {
    const ids = existingLibrary.map((r) => r.id);
    await prisma.plannedMeal.deleteMany({ where: { recipeId: { in: ids } } });
    await prisma.savedRecipe.deleteMany({ where: { recipeId: { in: ids } } });
    await prisma.recipeIngredient.deleteMany({ where: { recipeId: { in: ids } } });
    await prisma.recipe.deleteMany({ where: { isLibrary: true } });
    console.log(`${ids.length} recette(s) de bibliothèque réinitialisée(s).`);
  }

  // Recettes de la bibliothèque
  const libraryRecipes = [
    {
      title: 'Spaghetti bolognese',
      description: 'Un grand classique italien : une sauce mijotée à base de bœuf haché et de tomates, généreuse et réconfortante.',
      category: 'dinner' as const,
      servings: 4,
      prepTimeMinutes: 15,
      cookTimeMinutes: 25,
      ingredients: [
        { nameFr: 'Spaghetti', nameEn: 'Spaghetti', quantity: 400, unit: 'g' as IngredientUnit, category: 'cereals' as const },
        { nameFr: 'Viande hachée de bœuf', nameEn: 'Ground beef', quantity: 500, unit: 'g' as IngredientUnit, category: 'meat' as const },
        { nameFr: 'Sauce tomate', nameEn: 'Tomato sauce', quantity: 500, unit: 'ml' as IngredientUnit, category: 'condiments' as const },
        { nameFr: 'Oignon', nameEn: 'Onion', quantity: 1, unit: 'unit' as IngredientUnit, category: 'vegetables' as const },
        { nameFr: 'Ail', nameEn: 'Garlic', quantity: 3, unit: 'unit' as IngredientUnit, category: 'vegetables' as const },
        { nameFr: 'Huile d\'olive', nameEn: 'Olive oil', quantity: 2, unit: 'cas' as IngredientUnit, category: 'oils' as const },
      ],
      instructions: [
        'Éplucher et émincer finement l\'oignon et l\'ail.',
        'Faire revenir l\'oignon dans l\'huile d\'olive à feu moyen pendant 5 minutes, ajouter l\'ail et cuire 1 minute supplémentaire.',
        'Ajouter la viande hachée et la faire dorer en l\'émiettant à la spatule, environ 8 minutes.',
        'Verser la sauce tomate, assaisonner de sel et de poivre, et laisser mijoter à feu doux pendant 20 minutes.',
        'Faire cuire les spaghetti al dente dans une grande casserole d\'eau bouillante salée selon les indications du paquet.',
        'Égoutter les pâtes et servir avec la sauce bolognese.',
      ],
    },
    {
      title: 'Pancakes moelleux',
      description: 'Des pancakes épais et moelleux, parfaits pour un brunch ou un petit-déjeuner du week-end.',
      category: 'breakfast' as const,
      servings: 4,
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      ingredients: [
        { nameFr: 'Farine', nameEn: 'Flour', quantity: 250, unit: 'g' as IngredientUnit, category: 'cereals' as const },
        { nameFr: 'Lait', nameEn: 'Milk', quantity: 300, unit: 'ml' as IngredientUnit, category: 'dairy' as const },
        { nameFr: 'Œufs', nameEn: 'Eggs', quantity: 2, unit: 'unit' as IngredientUnit, category: 'dairy' as const },
        { nameFr: 'Sucre', nameEn: 'Sugar', quantity: 2, unit: 'cas' as IngredientUnit, category: 'condiments' as const },
        { nameFr: 'Beurre', nameEn: 'Butter', quantity: 30, unit: 'g' as IngredientUnit, category: 'dairy' as const },
        { nameFr: 'Levure chimique', nameEn: 'Baking powder', quantity: 1, unit: 'cac' as IngredientUnit, category: 'other' as const },
      ],
      instructions: [
        'Dans un saladier, mélanger la farine, le sucre et la levure chimique.',
        'Creuser un puits au centre, y ajouter les œufs et le lait progressivement en fouettant pour obtenir une pâte lisse sans grumeaux.',
        'Incorporer le beurre fondu et laisser reposer 5 minutes.',
        'Chauffer une poêle antiadhésive à feu moyen et la graisser légèrement avec un peu de beurre.',
        'Verser une louche de pâte par pancake et cuire environ 2 minutes jusqu\'à ce que des bulles se forment en surface, puis retourner et cuire encore 1 minute.',
      ],
    },
    {
      title: 'Poulet rôti aux herbes',
      description: 'Un poulet entier doré au four avec des herbes de Provence et de l\'ail, croustillant dehors et juteux dedans.',
      category: 'dinner' as const,
      servings: 4,
      prepTimeMinutes: 15,
      cookTimeMinutes: 60,
      ingredients: [
        { nameFr: 'Poulet entier', nameEn: 'Whole chicken', quantity: 1, unit: 'unit' as IngredientUnit, category: 'meat' as const },
        { nameFr: 'Herbes de Provence', nameEn: 'Herbes de Provence', quantity: 2, unit: 'cas' as IngredientUnit, category: 'spices' as const },
        { nameFr: 'Huile d\'olive', nameEn: 'Olive oil', quantity: 3, unit: 'cas' as IngredientUnit, category: 'oils' as const },
        { nameFr: 'Ail', nameEn: 'Garlic', quantity: 4, unit: 'unit' as IngredientUnit, category: 'vegetables' as const },
        { nameFr: 'Citron', nameEn: 'Lemon', quantity: 1, unit: 'unit' as IngredientUnit, category: 'fruits' as const },
      ],
      instructions: [
        'Préchauffer le four à 200°C.',
        'Éplucher les gousses d\'ail. En glisser quelques-unes sous la peau du poulet sur la poitrine. Couper le citron en deux et le placer dans la cavité.',
        'Badigeonner l\'ensemble du poulet d\'huile d\'olive, saupoudrer généreusement d\'herbes de Provence, saler et poivrer.',
        'Placer le poulet dans un plat allant au four, côté poitrine vers le haut. Enfourner 60 minutes en arrosant toutes les 20 minutes avec le jus de cuisson.',
        'Vérifier la cuisson en piquant la cuisse : le jus doit ressortir clair. Laisser reposer 10 minutes avant de découper et servir.',
      ],
    },
    {
      title: 'Quiche lorraine',
      description: 'La quiche lorraine traditionnelle avec ses lardons fumés et son appareil crémeux, une valeur sûre pour le déjeuner.',
      category: 'lunch' as const,
      servings: 6,
      prepTimeMinutes: 20,
      cookTimeMinutes: 35,
      restTimeMinutes: 30,
      ingredients: [
        { nameFr: 'Pâte brisée', nameEn: 'Shortcrust pastry', quantity: 1, unit: 'unit' as IngredientUnit, category: 'other' as const },
        { nameFr: 'Lardons fumés', nameEn: 'Smoked bacon lardons', quantity: 200, unit: 'g' as IngredientUnit, category: 'meat' as const },
        { nameFr: 'Crème fraîche épaisse', nameEn: 'Heavy cream', quantity: 200, unit: 'ml' as IngredientUnit, category: 'dairy' as const },
        { nameFr: 'Œufs', nameEn: 'Eggs', quantity: 3, unit: 'unit' as IngredientUnit, category: 'dairy' as const },
        { nameFr: 'Gruyère râpé', nameEn: 'Grated gruyère', quantity: 80, unit: 'g' as IngredientUnit, category: 'dairy' as const },
      ],
      instructions: [
        'Étaler la pâte brisée dans un moule à tarte, piquer le fond à la fourchette et réfrigérer 30 minutes.',
        'Préchauffer le four à 180°C. Faire revenir les lardons à sec dans une poêle jusqu\'à légère coloration, puis les égoutter.',
        'Dans un bol, fouetter les œufs avec la crème fraîche. Assaisonner de sel, poivre et d\'une pincée de noix de muscade.',
        'Déposer les lardons sur le fond de tarte, verser l\'appareil crémeux et parsemer de gruyère râpé.',
        'Enfourner 35 minutes jusqu\'à ce que la quiche soit gonflée et bien dorée. Servir tiède.',
      ],
    },
    {
      title: 'Salade niçoise',
      description: 'La salade niçoise authentique : thon, haricots verts, œufs durs et anchois, sans cuisson de légumes superflue.',
      category: 'lunch' as const,
      servings: 2,
      prepTimeMinutes: 20,
      cookTimeMinutes: 12,
      ingredients: [
        { nameFr: 'Thon en boîte', nameEn: 'Canned tuna', quantity: 200, unit: 'g' as IngredientUnit, category: 'fish' as const },
        { nameFr: 'Haricots verts', nameEn: 'Green beans', quantity: 200, unit: 'g' as IngredientUnit, category: 'vegetables' as const },
        { nameFr: 'Tomates', nameEn: 'Tomatoes', quantity: 3, unit: 'unit' as IngredientUnit, category: 'vegetables' as const },
        { nameFr: 'Olives noires', nameEn: 'Black olives', quantity: 80, unit: 'g' as IngredientUnit, category: 'condiments' as const },
        { nameFr: 'Œufs', nameEn: 'Eggs', quantity: 2, unit: 'unit' as IngredientUnit, category: 'dairy' as const },
        { nameFr: 'Filets d\'anchois', nameEn: 'Anchovy fillets', quantity: 30, unit: 'g' as IngredientUnit, category: 'fish' as const },
        { nameFr: 'Huile d\'olive', nameEn: 'Olive oil', quantity: 3, unit: 'cas' as IngredientUnit, category: 'oils' as const },
      ],
      instructions: [
        'Faire cuire les haricots verts 8 minutes dans l\'eau bouillante salée, puis les plonger immédiatement dans de l\'eau froide pour stopper la cuisson et préserver leur couleur.',
        'Faire cuire les œufs 10 minutes dans l\'eau bouillante pour les avoir durs. Les refroidir, les écaler et les couper en quartiers.',
        'Couper les tomates en quartiers. Égoutter le thon et les anchois.',
        'Disposer tous les ingrédients harmonieusement dans un plat de service. Arroser d\'huile d\'olive, assaisonner et servir sans mélanger.',
      ],
    },
    {
      title: 'Tarte aux pommes',
      description: 'Une tarte aux pommes classique et élégante, avec des lamelles dorées disposées en rosace sur une pâte croustillante.',
      category: 'dessert' as const,
      servings: 6,
      prepTimeMinutes: 20,
      cookTimeMinutes: 35,
      ingredients: [
        { nameFr: 'Pâte brisée', nameEn: 'Shortcrust pastry', quantity: 1, unit: 'unit' as IngredientUnit, category: 'other' as const },
        { nameFr: 'Pommes', nameEn: 'Apples', quantity: 4, unit: 'unit' as IngredientUnit, category: 'fruits' as const },
        { nameFr: 'Sucre', nameEn: 'Sugar', quantity: 80, unit: 'g' as IngredientUnit, category: 'condiments' as const },
        { nameFr: 'Beurre', nameEn: 'Butter', quantity: 30, unit: 'g' as IngredientUnit, category: 'dairy' as const },
        { nameFr: 'Cannelle', nameEn: 'Cinnamon', quantity: 1, unit: 'cac' as IngredientUnit, category: 'spices' as const },
      ],
      instructions: [
        'Préchauffer le four à 180°C. Étaler la pâte brisée dans un moule à tarte et piquer le fond à la fourchette.',
        'Éplucher et épépiner les pommes, puis les couper en fines lamelles régulières.',
        'Disposer les lamelles en rosace sur le fond de tarte en les faisant légèrement se chevaucher.',
        'Mélanger le sucre et la cannelle et en saupoudrer les pommes. Parsemer de petits morceaux de beurre sur toute la surface.',
        'Enfourner 35 minutes jusqu\'à ce que la tarte soit bien dorée et les pommes fondantes. Servir tiède ou froide.',
      ],
    },
    {
      title: 'Soupe de lentilles corail',
      description: 'Une soupe veloutée et épicée aux lentilles corail, rapide à préparer et très nourrissante.',
      category: 'dinner' as const,
      servings: 4,
      prepTimeMinutes: 10,
      cookTimeMinutes: 25,
      ingredients: [
        { nameFr: 'Lentilles corail', nameEn: 'Red lentils', quantity: 250, unit: 'g' as IngredientUnit, category: 'legumes' as const },
        { nameFr: 'Tomates pelées en boîte', nameEn: 'Canned peeled tomatoes', quantity: 400, unit: 'g' as IngredientUnit, category: 'vegetables' as const },
        { nameFr: 'Oignon', nameEn: 'Onion', quantity: 1, unit: 'unit' as IngredientUnit, category: 'vegetables' as const },
        { nameFr: 'Cumin moulu', nameEn: 'Ground cumin', quantity: 2, unit: 'cac' as IngredientUnit, category: 'spices' as const },
        { nameFr: 'Curcuma', nameEn: 'Turmeric', quantity: 1, unit: 'cac' as IngredientUnit, category: 'spices' as const },
        { nameFr: 'Bouillon de légumes', nameEn: 'Vegetable stock', quantity: 1, unit: 'l' as IngredientUnit, category: 'condiments' as const },
        { nameFr: 'Huile d\'olive', nameEn: 'Olive oil', quantity: 2, unit: 'cas' as IngredientUnit, category: 'oils' as const },
      ],
      instructions: [
        'Éplucher et émincer l\'oignon. Le faire revenir dans l\'huile d\'olive à feu moyen jusqu\'à ce qu\'il soit translucide, environ 5 minutes.',
        'Ajouter le cumin et le curcuma, mélanger et faire revenir 1 minute pour libérer les arômes.',
        'Rincer les lentilles corail, puis les ajouter avec les tomates pelées écrasées et le bouillon. Porter à ébullition.',
        'Réduire le feu, couvrir et laisser mijoter 20 minutes jusqu\'à ce que les lentilles soient complètement fondues.',
        'Mixer la soupe jusqu\'à obtenir une consistance lisse et veloutée. Rectifier l\'assaisonnement et servir.',
      ],
    },
    {
      title: 'Omelette aux champignons',
      description: 'Une omelette baveuse et crémeuse garnie de champignons sautés, prête en 20 minutes.',
      category: 'lunch' as const,
      servings: 2,
      prepTimeMinutes: 10,
      cookTimeMinutes: 10,
      ingredients: [
        { nameFr: 'Œufs', nameEn: 'Eggs', quantity: 4, unit: 'unit' as IngredientUnit, category: 'dairy' as const },
        { nameFr: 'Champignons de Paris', nameEn: 'Button mushrooms', quantity: 200, unit: 'g' as IngredientUnit, category: 'vegetables' as const },
        { nameFr: 'Crème fraîche épaisse', nameEn: 'Heavy cream', quantity: 2, unit: 'cas' as IngredientUnit, category: 'dairy' as const },
        { nameFr: 'Beurre', nameEn: 'Butter', quantity: 30, unit: 'g' as IngredientUnit, category: 'dairy' as const },
        { nameFr: 'Persil frais', nameEn: 'Fresh parsley', quantity: 5, unit: 'g' as IngredientUnit, category: 'spices' as const },
      ],
      instructions: [
        'Nettoyer et émincer les champignons. Les faire sauter dans la moitié du beurre à feu vif jusqu\'à évaporation complète de l\'eau, assaisonner et réserver.',
        'Battre les œufs avec la crème fraîche, saler et poivrer généreusement.',
        'Faire fondre le reste du beurre dans une poêle antiadhésive à feu moyen-vif. Verser la préparation aux œufs et remuer doucement avec une spatule.',
        'Déposer les champignons sur une moitié de l\'omelette. Lorsque le dessous est cuit mais le dessus encore légèrement baveux, replier et faire glisser dans l\'assiette.',
        'Parsemer de persil haché et servir immédiatement.',
      ],
    },
    {
      title: 'Risotto aux champignons',
      description: 'Un risotto crémeux et parfumé aux champignons, préparé dans les règles de l\'art avec la technique de la mantecatura.',
      category: 'dinner' as const,
      servings: 4,
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      ingredients: [
        { nameFr: 'Riz arborio', nameEn: 'Arborio rice', quantity: 320, unit: 'g' as IngredientUnit, category: 'cereals' as const },
        { nameFr: 'Champignons de Paris', nameEn: 'Button mushrooms', quantity: 300, unit: 'g' as IngredientUnit, category: 'vegetables' as const },
        { nameFr: 'Bouillon de légumes', nameEn: 'Vegetable stock', quantity: 1, unit: 'l' as IngredientUnit, category: 'condiments' as const },
        { nameFr: 'Vin blanc sec', nameEn: 'Dry white wine', quantity: 150, unit: 'ml' as IngredientUnit, category: 'condiments' as const },
        { nameFr: 'Parmesan râpé', nameEn: 'Grated parmesan', quantity: 60, unit: 'g' as IngredientUnit, category: 'dairy' as const },
        { nameFr: 'Oignon', nameEn: 'Onion', quantity: 1, unit: 'unit' as IngredientUnit, category: 'vegetables' as const },
        { nameFr: 'Beurre', nameEn: 'Butter', quantity: 40, unit: 'g' as IngredientUnit, category: 'dairy' as const },
      ],
      instructions: [
        'Faire chauffer le bouillon dans une casserole à part et le maintenir frémissant tout au long de la cuisson.',
        'Émincer finement l\'oignon. Le faire fondre dans la moitié du beurre à feu doux sans coloration, environ 5 minutes.',
        'Ajouter le riz et le faire nacrer 2 minutes en remuant jusqu\'à ce qu\'il devienne translucide. Verser le vin blanc et laisser absorber.',
        'Ajouter le bouillon chaud louche par louche en remuant constamment, en attendant l\'absorption complète de chaque louche avant d\'en ajouter une autre. Poursuivre 18 minutes.',
        'En parallèle, faire sauter les champignons émincés dans une poêle à feu vif avec un peu de beurre, assaisonner.',
        'Hors du feu, incorporer le reste du beurre et le parmesan en remuant vigoureusement (mantecatura). Ajouter les champignons, rectifier l\'assaisonnement et servir aussitôt.',
      ],
    },
    {
      title: 'Crêpes maison',
      description: 'La pâte à crêpes inratable : fine, souple et légèrement dorée. Idéale sucrée ou salée.',
      category: 'breakfast' as const,
      servings: 4,
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      restTimeMinutes: 30,
      ingredients: [
        { nameFr: 'Farine', nameEn: 'Flour', quantity: 250, unit: 'g' as IngredientUnit, category: 'cereals' as const },
        { nameFr: 'Lait', nameEn: 'Milk', quantity: 500, unit: 'ml' as IngredientUnit, category: 'dairy' as const },
        { nameFr: 'Œufs', nameEn: 'Eggs', quantity: 3, unit: 'unit' as IngredientUnit, category: 'dairy' as const },
        { nameFr: 'Beurre', nameEn: 'Butter', quantity: 30, unit: 'g' as IngredientUnit, category: 'dairy' as const },
        { nameFr: 'Sucre', nameEn: 'Sugar', quantity: 1, unit: 'cas' as IngredientUnit, category: 'condiments' as const },
      ],
      instructions: [
        'Dans un saladier, mélanger la farine et le sucre. Former un puits et y casser les œufs.',
        'Fouetter en incorporant progressivement la moitié du lait pour obtenir une pâte lisse et sans grumeaux, puis ajouter le reste du lait et le beurre fondu.',
        'Laisser reposer la pâte 30 minutes à température ambiante : elle sera plus homogène et les crêpes plus souples.',
        'Chauffer une poêle à crêpes légèrement huilée à feu moyen. Verser une fine couche de pâte en inclinant rapidement la poêle pour couvrir le fond.',
        'Cuire environ 1 minute jusqu\'à ce que les bords se décollent et que la surface soit prise, retourner et cuire 30 secondes. Répéter jusqu\'à épuisement de la pâte.',
      ],
    },
  ];

  for (const recipeData of libraryRecipes) {
    const { ingredients, ...recipeFields } = recipeData;

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

    console.log(`Recette créée : ${recipe.title}`);
  }
}

seed()
  .catch(console.error)
  .finally(() => process.exit(0));
