/*
  Warnings:

  - You are about to drop the column `calories` on the `Ingredient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "calories",
ADD COLUMN     "calcium" DOUBLE PRECISION,
ADD COLUMN     "energyKcal" DOUBLE PRECISION,
ADD COLUMN     "energyKj" DOUBLE PRECISION,
ADD COLUMN     "iron" DOUBLE PRECISION,
ADD COLUMN     "nutritionFull" JSONB,
ADD COLUMN     "salt" DOUBLE PRECISION,
ADD COLUMN     "saturatedFats" DOUBLE PRECISION,
ADD COLUMN     "sugars" DOUBLE PRECISION,
ADD COLUMN     "vitaminD" DOUBLE PRECISION;
