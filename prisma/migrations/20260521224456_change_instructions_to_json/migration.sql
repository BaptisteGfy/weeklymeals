-- Convert instructions from text[] to jsonb array of {text, tip?} objects.
-- PostgreSQL doesn't allow subqueries in ALTER COLUMN ... USING, so we use
-- add / update / rename instead.

ALTER TABLE "Recipe" ADD COLUMN "instructions_json" JSONB;

UPDATE "Recipe"
SET "instructions_json" = COALESCE(
  (SELECT jsonb_agg(jsonb_build_object('text', elem))
   FROM unnest(instructions) AS elem),
  '[]'::jsonb
);

ALTER TABLE "Recipe" ALTER COLUMN "instructions_json" SET NOT NULL;
ALTER TABLE "Recipe" DROP COLUMN "instructions";
ALTER TABLE "Recipe" RENAME COLUMN "instructions_json" TO "instructions";
