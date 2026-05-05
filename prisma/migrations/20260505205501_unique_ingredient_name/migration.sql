/*
  Warnings:

  - A unique constraint covering the columns `[nameFr]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_nameFr_key" ON "Ingredient"("nameFr");
