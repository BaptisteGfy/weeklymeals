/*
  Warnings:

  - You are about to drop the column `isFavorite` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "isFavorite";

-- CreateTable
CREATE TABLE "UserFavoriteRecipe" (
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavoriteRecipe_pkey" PRIMARY KEY ("userId","recipeId")
);

-- AddForeignKey
ALTER TABLE "UserFavoriteRecipe" ADD CONSTRAINT "UserFavoriteRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteRecipe" ADD CONSTRAINT "UserFavoriteRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
