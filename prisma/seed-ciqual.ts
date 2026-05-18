import 'dotenv/config';

import XLSX from 'xlsx';

import { IngredientCategory } from '../src/generated/prisma/client';
import { prisma } from '../src/lib/prisma';

// Indices des colonnes dans le fichier CIQUAL (vérifiés sur la version 2024)
const COL = {
  grpCode: 0,
  ssgrpNom: 4,
  nameFr: 7,
  energyKj: 9,
  energyKcal: 10,
  proteins: 14,
  carbs: 16,
  fats: 17,
  sugars: 18,
  fiber: 26,
  saturatedFats: 31,
  salt: 49,
  calcium: 50,
  iron: 53,
  vitaminD: 65,
} as const;

// Groupes CIQUAL à ignorer (plats composés, aliments infantiles, moyennes générales)
const SKIPPED_GROUPS = new Set(['00', '01', '11']);

// CIQUAL utilise la virgule comme séparateur décimal (format français)
// Les valeurs manquantes sont représentées par "-"
function parseValue(val: unknown): number | null {
  if (val === undefined || val === null) return null;
  const str = String(val).trim();
  if (str === '-' || str === '' || str.startsWith('<')) return null;
  const parsed = parseFloat(str.replace(',', '.'));
  return isNaN(parsed) ? null : parsed;
}

function mapCategory(
  grpCode: string,
  ssgrpNom: string,
): IngredientCategory | null {
  if (SKIPPED_GROUPS.has(grpCode)) return null;

  const ssgrp = ssgrpNom.toLowerCase();

  switch (grpCode) {
    case '02':
      if (ssgrp.includes('légumineuses')) return IngredientCategory.legumes;
      if (ssgrp.includes('fruits à coque') || ssgrp.includes('oléagineux'))
        return IngredientCategory.nuts;
      if (ssgrp.includes('fruits')) return IngredientCategory.fruits;
      if (ssgrp.includes('pomme de terre') || ssgrp.includes('tubercule'))
        return IngredientCategory.tubers;
      return IngredientCategory.vegetables;

    case '03':
      if (ssgrp.includes('pain')) return IngredientCategory.bread;
      if (ssgrp.includes('pâte') && ssgrp.includes('tarte'))
        return IngredientCategory.pastry;
      return IngredientCategory.cereals;

    case '04':
      if (ssgrp.includes('mollusque') || ssgrp.includes('crustacé'))
        return IngredientCategory.shellfish;
      if (ssgrp.includes('poisson')) return IngredientCategory.fish;
      if (ssgrp.includes('oeuf') || ssgrp.includes('œuf'))
        return IngredientCategory.eggs;
      if (ssgrp.includes('charcuterie')) return IngredientCategory.deli;
      return IngredientCategory.meat;

    case '05':
      return IngredientCategory.dairy;

    case '06':
      if (ssgrp.includes('alcool')) return IngredientCategory.alcohol;
      return IngredientCategory.beverages;

    case '07':
      if (ssgrp.includes('sucre') || ssgrp.includes('miel'))
        return IngredientCategory.sweeteners;
      if (ssgrp.includes('céréale') || ssgrp.includes('barre'))
        return IngredientCategory.cereals;
      if (
        ssgrp.includes('viennoiserie') ||
        ssgrp.includes('biscuit') ||
        ssgrp.includes('gâteau') ||
        ssgrp.includes('pâtisserie')
      )
        return IngredientCategory.pastry;
      return IngredientCategory.sweets;

    case '08':
      return IngredientCategory.sweets;

    case '09':
      if (ssgrp.includes('beurre') || ssgrp.includes('margarine'))
        return IngredientCategory.fats;
      return IngredientCategory.oils;

    case '10':
      if (ssgrp.includes('épice')) return IngredientCategory.spices;
      if (ssgrp.includes('herbe')) return IngredientCategory.herbs;
      if (ssgrp.includes('algue')) return IngredientCategory.vegetables;
      if (ssgrp.includes('végétarien') || ssgrp.includes('végétal'))
        return IngredientCategory.plant_proteins;
      return IngredientCategory.condiments;

    default:
      return IngredientCategory.other;
  }
}

async function main() {
  const wb = XLSX.readFile('./prisma/Table-Ciqual.xlsx');
  const ws = wb.Sheets['composition nutritionnelle'];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][];

  const headers = (rows[0] as string[]).map((h) =>
    String(h).replace(/\r\n/g, ' ').trim(),
  );
  const nutritionHeaders = headers.slice(9);

  let inserted = 0;
  let skipped = 0;
  const BATCH_SIZE = 50;
  const batch: Parameters<typeof prisma.ingredient.upsert>[0][] = [];

  const flush = async () => {
    await Promise.all(batch.map((args) => prisma.ingredient.upsert(args)));
    inserted += batch.length;
    batch.length = 0;
    process.stdout.write(`\r${inserted} ingrédients insérés...`);
  };

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] as unknown[];
    const grpCode = String(row[COL.grpCode] ?? '').trim();
    const ssgrpNom = String(row[COL.ssgrpNom] ?? '');
    const nameFr = String(row[COL.nameFr] ?? '').trim();

    if (!nameFr) {
      skipped++;
      continue;
    }

    const category = mapCategory(grpCode, ssgrpNom);
    if (!category) {
      skipped++;
      continue;
    }

    // Stocke toutes les valeurs CIQUAL dans nutritionFull (clés = noms de colonnes nettoyés)
    // On exclut les valeurs nulles pour garder le JSON compact
    const nutritionFull: Record<string, number> = {};
    for (let c = 9; c < headers.length; c++) {
      const val = parseValue(row[c]);
      if (val !== null) nutritionFull[nutritionHeaders[c - 9]] = val;
    }

    const nutritionData = {
      energyKj: parseValue(row[COL.energyKj]),
      energyKcal: parseValue(row[COL.energyKcal]),
      proteins: parseValue(row[COL.proteins]),
      carbs: parseValue(row[COL.carbs]),
      fats: parseValue(row[COL.fats]),
      sugars: parseValue(row[COL.sugars]),
      fiber: parseValue(row[COL.fiber]),
      saturatedFats: parseValue(row[COL.saturatedFats]),
      salt: parseValue(row[COL.salt]),
      calcium: parseValue(row[COL.calcium]),
      iron: parseValue(row[COL.iron]),
      vitaminD: parseValue(row[COL.vitaminD]),
      nutritionFull,
    };

    batch.push({
      where: { nameFr },
      create: { nameFr, category, ...nutritionData },
      update: { category, ...nutritionData },
    });

    if (batch.length >= BATCH_SIZE) await flush();
  }

  if (batch.length > 0) await flush();

  console.log(
    `\n\nTerminé : ${inserted} ingrédients insérés/mis à jour, ${skipped} ignorés.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
