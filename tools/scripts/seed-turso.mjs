#!/usr/bin/env node
import { createClient } from '@libsql/client';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../../');

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
  process.exit(1);
}

const client = createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_AUTH_TOKEN });

const DATASETS = [
  'data/dataset_century-21_2026-05-16_22-22-15-621.json',
  'data/dataset_century-21_2026-05-17_03-59-36-791.json',
];

async function createTable() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS propiedades (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      product_name    TEXT,
      direction       TEXT,
      images          TEXT,
      price_dollars   REAL,
      price_bob       REAL,
      departamento    TEXT,
      metros_cuadrados REAL,
      unidad_medida   TEXT,
      num_recamaras   INTEGER,
      banios          INTEGER,
      estacionamiento INTEGER,
      mascotas        INTEGER,
      alberca         INTEGER,
      latitud         REAL,
      longitud        REAL,
      dataset_source  TEXT,
      created_at      TEXT DEFAULT (datetime('now'))
    )
  `);
  console.log('Table propiedades ready.');
}

async function insertBatch(records, source) {
  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const statements = batch.map((r) => ({
      sql: `INSERT INTO propiedades
              (product_name, direction, images, price_dollars, price_bob,
               departamento, metros_cuadrados, unidad_medida, num_recamaras,
               banios, estacionamiento, mascotas, alberca, latitud, longitud, dataset_source)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [
        r.ProductName ?? null,
        r.Direction ?? null,
        JSON.stringify(r.Images ?? []),
        r.PriceDolars ?? null,
        r.PriceBOB ?? null,
        r.Departamento ?? null,
        r.MetrosCuadrados ?? null,
        r.UnidadMedida ?? null,
        r.NumeroRecamaras ?? null,
        r.Banios ?? null,
        r.Estacionamiento ?? null,
        r.Mascotas === null ? null : r.Mascotas ? 1 : 0,
        r.Alberca === null ? null : r.Alberca ? 1 : 0,
        r.Latitud ?? null,
        r.Longitud ?? null,
        source,
      ],
    }));

    await client.batch(statements, 'write');
    inserted += batch.length;
    process.stdout.write(`\r  ${source}: ${inserted}/${records.length} registros`);
  }
  console.log('');
}

async function run() {
  console.log(`Conectando a ${TURSO_DATABASE_URL}`);
  await createTable();

  for (const relPath of DATASETS) {
    const absPath = resolve(ROOT, relPath);
    const records = JSON.parse(readFileSync(absPath, 'utf-8'));
    const source = relPath.split('/').pop();
    console.log(`\nCargando ${source} (${records.length} registros)...`);
    await insertBatch(records, source);
  }

  const { rows } = await client.execute('SELECT COUNT(*) as total FROM propiedades');
  console.log(`\nTotal en Turso: ${rows[0].total} propiedades`);
  client.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
