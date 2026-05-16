import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { TursoService } from '../infrastructure/database/turso/turso.service.js';
import { SCHEMA_SQL } from '../infrastructure/database/turso/schema.sql.js';

const TURSO_URL   = process.env['TURSO_DATABASE_URL'];
const TURSO_TOKEN = process.env['TURSO_AUTH_TOKEN'];
const HAS_CONFIG  = Boolean(TURSO_URL && TURSO_TOKEN);

// Minimal stub logger for tests
const logger = {
  info:  (msg: string) => console.log(`    [turso] ${msg}`),
  warn:  (msg: string) => console.warn(`    [turso] WARN: ${msg}`),
  error: (msg: string) => console.error(`    [turso] ERROR: ${msg}`),
  debug: () => {},
  audit: () => {},
};

describe('Turso Database', () => {
  if (!HAS_CONFIG) {
    it('OMITIDO — TURSO_DATABASE_URL y TURSO_AUTH_TOKEN no configurados', () => {
      console.log('    ⚠  Configura las variables de entorno para ejecutar este test.');
    });
    return;
  }

  let db: TursoService;

  before(async () => {
    db = new TursoService(logger);
    await db.connect(TURSO_URL!, TURSO_TOKEN!);
  });

  it('conexión exitosa → isReady() = true', () => {
    assert.equal(db.isReady(), true);
  });

  it('execute SELECT 1 → devuelve resultado', async () => {
    const res = await db.execute('SELECT 1 as val');
    assert.ok(res.rows.length > 0);
    const row = res.rows[0] as Record<string, unknown>;
    assert.equal(Number(row['val']), 1);
  });

  it('tablas del schema existen (o se crean con CREATE IF NOT EXISTS)', async () => {
    const expectedTables = [
      'properties',
      'property_visits',
      'property_offers',
      'property_contracts',
      'property_matches',
      'property_sales',
    ];

    // Aplicar schema
    const statements = SCHEMA_SQL
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => ({ sql: s + ';' }));
    await db.batch(statements);

    // Verificar que cada tabla existe haciendo un SELECT
    for (const table of expectedTables) {
      const res = await db.execute(`SELECT COUNT(*) as cnt FROM ${table}`);
      assert.ok(res.rows.length > 0, `Tabla '${table}' no existe o no es accesible`);
      console.log(`    ✓  Tabla '${table}' encontrada`);
    }
  });

  it('INSERT y SELECT en properties funciona correctamente', async () => {
    const testId = `test_${Date.now()}`;
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO properties (id, tenant_id, owner_id, title, description, property_type, operation_type,
        status, publication_status, legal_status, price, currency, area, address, city, is_featured,
        image_urls, features, created_at, updated_at)
       VALUES (:id, 'tenant_test', 'owner_test', 'Propiedad Test', 'Descripción test', 'apartment', 'sale',
        'draft', 'unpublished', 'clear', 50000, 'USD', 80, 'Calle Test 123', 'La Paz', 0,
        '[]', '[]', :createdAt, :updatedAt)`,
      { id: testId, createdAt: now, updatedAt: now },
    );

    const res = await db.execute('SELECT * FROM properties WHERE id = :id', { id: testId });
    assert.equal(res.rows.length, 1);
    const row = res.rows[0] as Record<string, unknown>;
    assert.equal(row['id'], testId);
    assert.equal(row['city'], 'La Paz');
    assert.equal(Number(row['price']), 50000);
    console.log(`    ✓  INSERT/SELECT de propiedad con id '${testId}'`);

    // Cleanup
    await db.execute('DELETE FROM properties WHERE id = :id', { id: testId });
    const after = await db.execute('SELECT * FROM properties WHERE id = :id', { id: testId });
    assert.equal(after.rows.length, 0, 'DELETE no funcionó');
    console.log(`    ✓  DELETE verificado`);
  });

  it('INSERT y SELECT en property_sales funciona correctamente', async () => {
    const testId = `sale_test_${Date.now()}`;
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO property_sales (id, tenant_id, sale_type, product_or_service, amount, currency,
        payment_method, sale_location, sale_channel, sold_at, created_at, updated_at)
       VALUES (:id, 'tenant_test', 'agent_commission', 'Comisión de venta', 1500, 'USD',
        'bank_transfer', 'office', 'in_person', :now, :now, :now)`,
      { id: testId, now },
    );

    const res = await db.execute('SELECT * FROM property_sales WHERE id = :id', { id: testId });
    assert.equal(res.rows.length, 1);
    const row = res.rows[0] as Record<string, unknown>;
    assert.equal(Number(row['amount']), 1500);
    console.log(`    ✓  INSERT/SELECT de venta con id '${testId}'`);

    // Cleanup
    await db.execute('DELETE FROM property_sales WHERE id = :id', { id: testId });
  });
});
