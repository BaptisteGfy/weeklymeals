-- CreateEnum
CREATE TYPE "MealPeriod" AS ENUM ('breakfast', 'lunch', 'dinner');

-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('starter', 'main', 'dessert');

-- DropIndex
DROP INDEX "PlannedMeal_userId_date_mealType_key";

-- Ajouter mealPeriod avec un default temporaire pour satisfaire NOT NULL sur les lignes existantes
ALTER TABLE "PlannedMeal" ADD COLUMN "mealPeriod" "MealPeriod" NOT NULL DEFAULT 'lunch';
ALTER TABLE "PlannedMeal" ADD COLUMN "courseType" "CourseType" NOT NULL DEFAULT 'main';

-- Migrer les valeurs existantes de mealType → mealPeriod (lunch → lunch, dinner → dinner)
UPDATE "PlannedMeal" SET "mealPeriod" = "mealType"::text::"MealPeriod";

-- Supprimer le default temporaire
ALTER TABLE "PlannedMeal" ALTER COLUMN "mealPeriod" DROP DEFAULT;

-- Supprimer l'ancienne colonne
ALTER TABLE "PlannedMeal" DROP COLUMN "mealType";

-- DropEnum
DROP TYPE "MealType";

-- CreateIndex
CREATE UNIQUE INDEX "PlannedMeal_userId_date_mealPeriod_courseType_key" ON "PlannedMeal"("userId", "date", "mealPeriod", "courseType");
