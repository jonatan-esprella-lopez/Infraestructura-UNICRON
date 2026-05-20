import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const [tables, total, bySource, byDept, sample] = await Promise.all([
  client.execute("SELECT name FROM sqlite_master WHERE type='table'"),
  client.execute('SELECT COUNT(*) AS total FROM propiedades'),
  client.execute('SELECT dataset_source, COUNT(*) AS cantidad FROM propiedades GROUP BY dataset_source'),
  client.execute('SELECT departamento, COUNT(*) AS cantidad FROM propiedades GROUP BY departamento ORDER BY cantidad DESC LIMIT 10'),
  client.execute('SELECT id, product_name, price_dollars, departamento FROM propiedades LIMIT 3'),
]);

console.log('=== TABLAS EN TURSO ===');
tables.rows.forEach((r) => console.log(' -', r.name));

console.log('\n=== CONTEO TOTAL ===');
console.log('Total propiedades:', total.rows[0].total);

console.log('\n=== POR DATASET ===');
bySource.rows.forEach((r) => console.log(' ', r.dataset_source, '->', r.cantidad, 'registros'));

console.log('\n=== POR DEPARTAMENTO ===');
byDept.rows.forEach((r) => console.log(' ', r.departamento ?? '(null)', '->', r.cantidad));

console.log('\n=== MUESTRA 3 REGISTROS ===');
sample.rows.forEach((r) => console.log(JSON.stringify(r)));

client.close();
