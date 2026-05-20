-- DropForeignKey
ALTER TABLE "MealIdea" DROP CONSTRAINT "MealIdea_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "PlannedMeal" DROP CONSTRAINT "PlannedMeal_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "SavedRecipe" DROP CONSTRAINT "SavedRecipe_recipeId_fkey";

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedMeal" ADD CONSTRAINT "PlannedMeal_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedRecipe" ADD CONSTRAINT "SavedRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealIdea" ADD CONSTRAINT "MealIdea_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
