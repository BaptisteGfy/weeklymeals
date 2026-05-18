-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "IngredientCategory" ADD VALUE 'tubers';
ALTER TYPE "IngredientCategory" ADD VALUE 'mushrooms';
ALTER TYPE "IngredientCategory" ADD VALUE 'deli';
ALTER TYPE "IngredientCategory" ADD VALUE 'eggs';
ALTER TYPE "IngredientCategory" ADD VALUE 'shellfish';
ALTER TYPE "IngredientCategory" ADD VALUE 'bread';
ALTER TYPE "IngredientCategory" ADD VALUE 'fats';
ALTER TYPE "IngredientCategory" ADD VALUE 'sweeteners';
ALTER TYPE "IngredientCategory" ADD VALUE 'sweets';
ALTER TYPE "IngredientCategory" ADD VALUE 'pastry';
ALTER TYPE "IngredientCategory" ADD VALUE 'beverages';
ALTER TYPE "IngredientCategory" ADD VALUE 'alcohol';
ALTER TYPE "IngredientCategory" ADD VALUE 'herbs';
ALTER TYPE "IngredientCategory" ADD VALUE 'plant_proteins';
