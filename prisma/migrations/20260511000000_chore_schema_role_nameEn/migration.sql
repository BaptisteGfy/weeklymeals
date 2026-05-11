CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

ALTER TABLE "user"
  ALTER COLUMN "role" DROP DEFAULT,
  ALTER COLUMN "role" TYPE "UserRole" USING role::"UserRole",
  ALTER COLUMN "role" SET DEFAULT 'user'::"UserRole";

ALTER TABLE "Ingredient" ALTER COLUMN "nameEn" DROP NOT NULL;
