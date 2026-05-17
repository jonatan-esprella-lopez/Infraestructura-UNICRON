import { readFileSync } from 'fs';
import { resolve } from 'path';
import { randomUUID } from 'crypto';
import { TursoService } from './turso.service.js';
import { SCHEMA_SQL } from './schema.sql.js';

// Dummy logger to satisfy TursoService constructor
const logger = {
  info: console.log,
  error: console.error,
  warn: console.warn,
  debug: console.log,
  audit: console.log,
};

async function run() {
  const dbUrl = process.env.DATABASE_URL || 'file:./local.db';
  const authToken = process.env.TURSO_AUTH_TOKEN || '';

  console.log(`Connecting to Turso: ${dbUrl}`);
  const db = new TursoService(logger);
  await db.connect(dbUrl, authToken);

  console.log('Running migrations to ensure tables exist...');
  const statements = SCHEMA_SQL
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => ({ sql: s + ';' }));
  
  try {
    await db.batch(statements);
    console.log('Migrations executed successfully.');
  } catch (err) {
    console.error('Error executing migrations:', err);
  }

  // Load JSON Data
  console.log('Loading dataset...');
  const jsonPath = resolve(process.cwd(), '../../data/dataset_century-21_2026-05-16_22-22-15-621.json');
  let data: any[] = [];
  try {
    data = JSON.parse(readFileSync(jsonPath, 'utf-8'));
    console.log(`Loaded ${data.length} records.`);
  } catch (err) {
    console.error(`Could not read dataset file at ${jsonPath}:`, err);
    process.exit(1);
  }

  const tenantId = 'intersim-default';
  const ownerIds: string[] = [];

  // Create 15 Propietarios
  console.log('Creating 15 Propietarios...');
  for (let i = 1; i <= 15; i++) {
    const ownerId = randomUUID();
    ownerIds.push(ownerId);
    
    await db.execute(
      `INSERT INTO users (id, tenant_id, first_name, last_name, email, password_hash, role, phone, created_at, updated_at) 
       VALUES (:id, :tenantId, :firstName, :lastName, :email, :passwordHash, :role, :phone, :createdAt, :updatedAt)
       ON CONFLICT(email) DO NOTHING`,
      {
        id: ownerId,
        tenantId: tenantId,
        firstName: `Propietario ${i}`,
        lastName: `Apellido ${i}`,
        email: `propietario${i}@intersim.bo`,
        passwordHash: 'hashed_password_mock',
        role: 'owner',
        phone: `+591 700000${i.toString().padStart(2, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );
  }

  // Helper to extract operation type
  const getOpType = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('renta') || t.includes('alquiler') || t.includes('arriendo')) return 'rent';
    if (t.includes('anticretico')) return 'anticretico';
    return 'sale';
  };

  // Helper to extract property type
  const getPropType = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('departamento')) return 'apartment';
    if (t.includes('casa')) return 'house';
    if (t.includes('terreno')) return 'land';
    if (t.includes('oficina')) return 'office';
    return 'house'; // fallback
  };

  console.log('Inserting properties...');
  let count = 0;
  for (const item of data) {
    const propId = randomUUID();
    const ownerId = ownerIds[Math.floor(Math.random() * ownerIds.length)]; // Random owner
    
    const title = item.ProductName || 'Inmueble sin título';
    const operation_type = getOpType(title);
    const property_type = getPropType(title);
    
    const price = item.PriceDolars || (item.PriceBOB ? item.PriceBOB / 6.96 : 0);
    const area = item.MetrosCuadrados || 0;
    const bedrooms = item.NumeroRecamaras || 0;
    const bathrooms = item.Banios || 0;
    const parking_spaces = item.Estacionamiento || 0;
    
    const address = item.Direction || '';
    const city = item.Departamento || '';
    const latitude = item.Latitud || 0;
    const longitude = item.Longitud || 0;
    const image_urls = JSON.stringify(item.Images || []);
    
    try {
      await db.execute(
        `INSERT INTO properties (
          id, tenant_id, owner_id, title, property_type, operation_type,
          status, publication_status, price, currency, area, bedrooms,
          bathrooms, parking_spaces, address, city, latitude, longitude,
          image_urls, created_at, updated_at
        ) VALUES (
          :id, :tenantId, :ownerId, :title, :propertyType, :operationType,
          :status, :publicationStatus, :price, :currency, :area, :bedrooms,
          :bathrooms, :parkingSpaces, :address, :city, :latitude, :longitude,
          :imageUrls, :createdAt, :updatedAt
        )`,
        {
          id: propId,
          tenantId: tenantId,
          ownerId: ownerId,
          title: title,
          propertyType: property_type,
          operationType: operation_type,
          status: 'available',
          publicationStatus: 'published',
          price: price,
          currency: 'USD',
          area: area,
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          parkingSpaces: parking_spaces,
          address: address,
          city: city,
          latitude: latitude,
          longitude: longitude,
          imageUrls: image_urls,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
      count++;
      if (count % 100 === 0) console.log(`Inserted ${count} properties...`);
    } catch (err) {
      console.error('Failed to insert property:', err);
    }
  }

  console.log(`Seeding complete! Successfully inserted ${count} properties into the database.`);
}

run().catch(console.error);
