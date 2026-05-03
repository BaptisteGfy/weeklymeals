/*
  Warnings:

  - You are about to drop the column `day` on the `PlannedMeal` table. All the data in the column will be lost.
  - You are about to drop the `Instruction` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,date,mealType]` on the table `PlannedMeal` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `PlannedMeal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Instruction" DROP CONSTRAINT "Instruction_recipeId_fkey";

-- AlterTable
ALTER TABLE "PlannedMeal" DROP COLUMN "day",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "cookTimeMinutes" INTEGER,
ADD COLUMN     "instructions" TEXT[],
ADD COLUMN     "restTimeMinutes" INTEGER;

-- AlterTable
ALTER TABLE "RecipeIngredient" ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- DropTable
DROP TABLE "Instruction";

-- DropEnum
DROP TYPE "WeekDay";

-- CreateTable
CREATE TABLE "SavedRecipe" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "SavedRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedRecipe_userId_recipeId_key" ON "SavedRecipe"("userId", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "PlannedMeal_userId_date_mealType_key" ON "PlannedMeal"("userId", "date", "mealType");

-- AddForeignKey
ALTER TABLE "SavedRecipe" ADD CONSTRAINT "SavedRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedRecipe" ADD CONSTRAINT "SavedRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
