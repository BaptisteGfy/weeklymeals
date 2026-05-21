-- Rename RecipeCategory enum values: lunch -> starter, dinner -> main.
-- PostgreSQL doesn't support renaming enum values directly, so we
-- create a new type, migrate the column, then swap.

CREATE TYPE "RecipeCategory_new" AS ENUM ('breakfast', 'starter', 'main', 'dessert');

ALTER TABLE "Recipe"
  ALTER COLUMN "category" TYPE "RecipeCategory_new"
  USING (
    CASE "category"::text
      WHEN 'lunch'  THEN 'starter'::"RecipeCategory_new"
      WHEN 'dinner' THEN 'main'::"RecipeCategory_new"
      ELSE "category"::text::"RecipeCategory_new"
    END
  );

DROP TYPE "RecipeCategory";
ALTER TYPE "RecipeCategory_new" RENAME TO "RecipeCategory";
