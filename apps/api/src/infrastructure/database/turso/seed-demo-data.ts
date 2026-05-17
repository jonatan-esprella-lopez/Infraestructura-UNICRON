/**
 * seed-demo-data.ts
 *
 * Populates the 4 default demo users with rich, realistic data:
 *   admin@intersim.bo    → administrador del sistema
 *   agente@intersim.bo   → agente Diamante con 15 propiedades y suscripción activa
 *   propietario@intersim.bo → propietario con 6 propiedades propias
 *   cliente@intersim.bo  → cliente con visitas y ofertas generadas
 *
 * También inserta las 200 propiedades del dataset Century-21 nuevo.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { randomUUID } from 'crypto';
import { createClient } from '@libsql/client';
import { SCHEMA_SQL } from './schema.sql.js';

const DB_URL   = process.env['TURSO_DATABASE_URL'] || process.env['DATABASE_URL'] || 'file:./local.db';
const AUTH_TOKEN = process.env['TURSO_AUTH_TOKEN'] || '';
const db = createClient({ url: DB_URL, authToken: AUTH_TOKEN });

const TENANT = 'intersim-default';

function now() { return new Date().toISOString(); }
function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

/* ── Demo user definitions (must match auth.module.ts DEMO_USERS) ─────────── */
const DEMO_USERS = [
  {
    id: 'usr_admin_01',
    email: 'admin@intersim.bo',
    firstName: 'Carlos',
    lastName: 'Mendoza',
    role: 'admin',
    phone: '+591 70099001',
    agency: 'INTERSIM PropTech',
    password: 'admin123',
  },
  {
    id: 'usr_agent_01',
    email: 'agente@intersim.bo',
    firstName: 'María',
    lastName: 'García',
    role: 'agent',
    phone: '+591 70099002',
    agency: 'Century 21 Bolivia',
    password: 'agente123',
  },
  {
    id: 'usr_owner_01',
    email: 'propietario@intersim.bo',
    firstName: 'Roberto',
    lastName: 'Vargas',
    role: 'owner',
    phone: '+591 70099003',
    agency: null,
    password: 'prop123',
  },
  {
    id: 'usr_client_01',
    email: 'cliente@intersim.bo',
    firstName: 'Ana',
    lastName: 'López',
    role: 'client',
    phone: '+591 70099004',
    agency: null,
    password: 'cliente123',
  },
];

/* ── Dataset helpers ──────────────────────────────────────────────────────── */
function getOpType(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('renta') || t.includes('alquiler') || t.includes('arriendo')) return 'rent';
  if (t.includes('anticretico') || t.includes('anticrético')) return 'anticretico';
  return 'sale';
}

function getPropType(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('departamento')) return 'apartment';
  if (t.includes('terreno')) return 'land';
  if (t.includes('oficina')) return 'office';
  if (t.includes('comercial') || t.includes('local')) return 'commercial';
  if (t.includes('casa') || t.includes('condominio')) return 'house';
  return 'house';
}

function getZone(direction: string): string {
  const parts = direction.split(',').map((s) => s.trim());
  return parts[0] || '';
}

/* ── Additional property owners to distribute load ─────────────────────────── */
const EXTRA_OWNERS = [
  { id: 'own_extra_01', name: 'Jorge Quispe',    email: 'j.quispe.owner@intersim.bo',  phone: '+591 71100001' },
  { id: 'own_extra_02', name: 'Teresa Blanco',   email: 't.blanco.owner@intersim.bo',  phone: '+591 71100002' },
  { id: 'own_extra_03', name: 'Mario Alonzo',    email: 'm.alonzo.owner@intersim.bo',  phone: '+591 71100003' },
  { id: 'own_extra_04', name: 'Silvia Romero',   email: 's.romero.owner@intersim.bo',  phone: '+591 71100004' },
  { id: 'own_extra_05', name: 'Pedro Zenteno',   email: 'p.zenteno.owner@intersim.bo', phone: '+591 71100005' },
  { id: 'own_extra_06', name: 'Lorena Salguero', email: 'l.salguero.owner@intersim.bo',phone: '+591 71100006' },
];

/* ── Main ─────────────────────────────────────────────────────────────────── */
async function run() {
  console.log('🚀 Iniciando seed de datos demo...\n');

  /* 1. Asegurar tablas */
  console.log('📦 Ejecutando migraciones...');
  const statements = SCHEMA_SQL.split(';').map((s) => s.trim()).filter((s) => s.length > 0);
  for (const sql of statements) {
    try { await db.execute(sql + ';'); } catch { /* tabla ya existe */ }
  }
  console.log('✅ Migraciones OK\n');

  /* 2. Insertar / actualizar demo users en DB */
  console.log('👤 Insertando usuarios demo en DB...');
  for (const u of DEMO_USERS) {
    await db.execute({
      sql: `INSERT OR REPLACE INTO users
              (id, tenant_id, first_name, last_name, email, password_hash, role, phone, agency, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [u.id, TENANT, u.firstName, u.lastName, u.email, `plain:${u.password}`, u.role, u.phone, u.agency, now(), now()],
    });
    console.log(`  ✓ ${u.role.padEnd(6)} ${u.firstName} ${u.lastName} <${u.email}>`);
  }
  console.log('');

  /* 3. Insertar propietarios extra */
  console.log('🏠 Insertando propietarios adicionales...');
  for (const o of EXTRA_OWNERS) {
    const [fn, ln] = o.name.split(' ');
    await db.execute({
      sql: `INSERT OR IGNORE INTO users
              (id, tenant_id, first_name, last_name, email, password_hash, role, phone, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [o.id, TENANT, fn, ln, o.email, 'plain:owner123', 'owner', o.phone, now(), now()],
    });
  }
  console.log(`  ✓ ${EXTRA_OWNERS.length} propietarios extra registrados\n`);

  /* 4. Insertar plan Diamante si no existe */
  await db.execute({
    sql: `INSERT OR IGNORE INTO agent_plans
            (id, name, slug, price_usd, duration_days, max_active_properties, max_leads, features, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: ['plan-diamante', 'Diamante', 'diamante', 100, 30, 20, 500,
           JSON.stringify(['Máxima visibilidad','Hasta 20 propiedades','IA matching','CRM avanzado','Soporte 24/7']),
           now()],
  });

  /* 5. Suscripción Diamante para agente@intersim.bo */
  console.log('💎 Creando suscripción Diamante para agente@intersim.bo...');
  const agentSubId = 'sub_agent_demo_01';
  await db.execute({
    sql: `INSERT OR REPLACE INTO agent_subscriptions
            (id, agent_id, plan_id, status, started_at, expires_at, active_properties_count, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [agentSubId, 'usr_agent_01', 'plan-diamante', 'active', daysAgo(5), daysFromNow(25), 15, now(), now()],
  });
  console.log('  ✓ Suscripción activa (Plan Diamante, vence en 25 días)\n');

  /* 6. Cargar dataset nuevo */
  console.log('📂 Cargando dataset Century-21 (2026-05-17)...');
  const jsonPath = resolve(process.cwd(), '../../data/dataset_century-21_2026-05-17_03-59-36-791.json');
  let rawData: any[] = [];
  try {
    rawData = JSON.parse(readFileSync(jsonPath, 'utf-8'));
    console.log(`  ✓ ${rawData.length} registros cargados\n`);
  } catch (err) {
    console.error('  ✗ No se pudo leer el dataset:', err);
    process.exit(1);
  }

  /* 7. Insertar propiedades */
  console.log('🏡 Insertando propiedades...');

  // Los primeros 6 van al propietario@intersim.bo
  const OWNER_PROP_COUNT = 6;
  // Las siguientes 15 tienen agente@intersim.bo como agent
  const AGENT_PROP_COUNT = 15;
  // El resto se distribuye entre los extra owners

  const propIds: string[] = [];
  let inserted = 0;

  for (let i = 0; i < rawData.length; i++) {
    const item = rawData[i];
    const propId = randomUUID();
    propIds.push(propId);

    const title = item.ProductName || 'Inmueble sin título';
    const opType = getOpType(title);
    const propType = getPropType(title);
    const price = Math.round(item.PriceDolars || (item.PriceBOB ? item.PriceBOB / 6.96 : 0));
    const area = item.MetrosCuadrados || 0;
    const bedrooms = item.NumeroRecamaras || null;
    const bathrooms = item.Banios || null;
    const parking = item.Estacionamiento || null;
    const address = item.Direction || '';
    const city = item.Departamento || 'Santa Cruz';
    const zone = getZone(address);
    const lat = item.Latitud || null;
    const lng = item.Longitud || null;
    const images = JSON.stringify(item.Images || []);
    const features = JSON.stringify(item.Mascotas ? ['pets_allowed'] : []);
    const isFeatured = i < 12 ? 1 : 0; // primeras 12 son destacadas

    // Asignar owner
    let ownerId: string;
    let agentId: string | null = null;

    if (i < OWNER_PROP_COUNT) {
      // Propiedades del propietario demo
      ownerId = 'usr_owner_01';
    } else {
      // Distribuir entre extra owners
      ownerId = EXTRA_OWNERS[i % EXTRA_OWNERS.length].id;
    }

    // Asignar agente a las propiedades 6..20 → agente@intersim.bo
    if (i >= OWNER_PROP_COUNT && i < OWNER_PROP_COUNT + AGENT_PROP_COUNT) {
      agentId = 'usr_agent_01';
    } else if (i >= OWNER_PROP_COUNT + AGENT_PROP_COUNT) {
      // Resto: algunos quedan sin agente, otros con agentes existentes del seed anterior
      agentId = null;
    }

    try {
      await db.execute({
        sql: `INSERT OR IGNORE INTO properties
                (id, tenant_id, owner_id, agent_id, title, description, property_type, operation_type,
                 status, publication_status, legal_status, price, currency, area, bedrooms, bathrooms,
                 parking_spaces, address, city, zone, latitude, longitude, is_featured, image_urls,
                 features, published_at, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          propId, TENANT, ownerId, agentId,
          title, `Propiedad ubicada en ${address}. ${propType === 'apartment' ? 'Departamento moderno' : propType === 'house' ? 'Casa familiar' : 'Terreno'} en ${city}.`,
          propType, opType,
          'available', 'published', 'clear',
          price, 'USD', area, bedrooms, bathrooms, parking,
          address, city, zone, lat, lng,
          isFeatured, images, features,
          daysAgo(Math.floor(Math.random() * 30)),
          daysAgo(Math.floor(Math.random() * 60)),
          now(),
        ],
      });
      inserted++;
    } catch (err: any) {
      // ignore duplicates
    }
  }
  console.log(`  ✓ ${inserted} propiedades insertadas de ${rawData.length}\n`);

  /* 8. Crear visitas para cliente@intersim.bo */
  console.log('📅 Creando visitas para cliente@intersim.bo...');
  const visitProps = propIds.slice(0, 5); // primeras 5 propiedades
  const visitStatuses = ['completed', 'completed', 'scheduled', 'scheduled', 'cancelled'];
  const visitDays     = [-10, -5, 3, 7, -15];
  let visitsCreated = 0;

  for (let i = 0; i < visitProps.length; i++) {
    const visitId = randomUUID();
    const status = visitStatuses[i];
    const scheduledAt = daysFromNow(visitDays[i]);
    const feedback = status === 'completed'
      ? ['Propiedad en excelente estado, muy interesado.', 'Amplia y bien ubicada, quiero hacer una oferta.'][i % 2]
      : null;

    try {
      await db.execute({
        sql: `INSERT OR IGNORE INTO property_visits
                (id, property_id, client_id, agent_id, tenant_id, scheduled_at, status, notes, feedback, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          visitId, visitProps[i], 'usr_client_01', 'usr_agent_01', TENANT,
          scheduledAt, status,
          'Visita coordinada por la plataforma INTERSIM',
          feedback,
          daysAgo(12), now(),
        ],
      });
      visitsCreated++;
    } catch { /* ignore */ }
  }
  console.log(`  ✓ ${visitsCreated} visitas creadas\n`);

  /* 9. Crear ofertas para cliente@intersim.bo */
  console.log('💰 Creando ofertas para cliente@intersim.bo...');
  const offerProps = propIds.slice(0, 3);
  const offerData = [
    { amount: 0.92, status: 'pending',  note: 'Oferta inicial, dispuesto a negociar.' },
    { amount: 0.88, status: 'countered', note: 'Oferta revisada según evaluación del estado del inmueble.' },
    { amount: 0.95, status: 'accepted', note: 'Oferta aceptada por ambas partes. Pendiente contrato.' },
  ];
  let offersCreated = 0;

  for (let i = 0; i < offerProps.length; i++) {
    // Get price for this property
    const propRes = await db.execute({ sql: 'SELECT price FROM properties WHERE id = ?', args: [offerProps[i]] });
    const propPrice = (propRes.rows[0] as any)?.price as number ?? 100000;
    const offerAmount = Math.round(propPrice * offerData[i].amount);

    const offerId = randomUUID();
    try {
      await db.execute({
        sql: `INSERT OR IGNORE INTO property_offers
                (id, property_id, client_id, agent_id, amount, currency, offer_type, status, notes, expires_at, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          offerId, offerProps[i], 'usr_client_01', 'usr_agent_01',
          offerAmount, 'USD', 'buy',
          offerData[i].status, offerData[i].note,
          daysFromNow(7),
          daysAgo(8 - i * 2), now(),
        ],
      });
      offersCreated++;
    } catch { /* ignore */ }
  }
  console.log(`  ✓ ${offersCreated} ofertas creadas\n`);

  /* 10. Marcar algunas propiedades del propietario como destacadas */
  const ownerProps = propIds.slice(0, OWNER_PROP_COUNT);
  for (let i = 0; i < Math.min(3, ownerProps.length); i++) {
    await db.execute({
      sql: 'UPDATE properties SET is_featured = 1 WHERE id = ?',
      args: [ownerProps[i]],
    });
  }

  /* 11. Verificación final */
  console.log('─────────────────────────────────────────────');
  const counts = await Promise.all([
    db.execute("SELECT COUNT(*) as c FROM users WHERE role = 'admin'"),
    db.execute("SELECT COUNT(*) as c FROM users WHERE role = 'agent'"),
    db.execute("SELECT COUNT(*) as c FROM users WHERE role = 'owner'"),
    db.execute("SELECT COUNT(*) as c FROM users WHERE role = 'client'"),
    db.execute("SELECT COUNT(*) as c FROM properties WHERE publication_status = 'published'"),
    db.execute("SELECT COUNT(*) as c FROM properties WHERE owner_id = 'usr_owner_01'"),
    db.execute("SELECT COUNT(*) as c FROM properties WHERE agent_id = 'usr_agent_01'"),
    db.execute("SELECT COUNT(*) as c FROM property_visits WHERE client_id = 'usr_client_01'"),
    db.execute("SELECT COUNT(*) as c FROM property_offers WHERE client_id = 'usr_client_01'"),
    db.execute("SELECT COUNT(*) as c FROM agent_subscriptions WHERE status = 'active'"),
  ]);

  const [admins, agents, owners, clients, published, ownerProps2, agentProps, visits, offers, subs] = counts.map(
    (r) => (r.rows[0] as any).c as number,
  );

  console.log('\n✅ Seed completado:');
  console.log(`   👑 Admins      : ${admins}`);
  console.log(`   🤝 Agentes     : ${agents} (con ${subs} suscripciones activas)`);
  console.log(`   🏠 Propietarios: ${owners}`);
  console.log(`   👤 Clientes    : ${clients}`);
  console.log(`   🏡 Publicadas  : ${published}`);
  console.log(`   📌 Propietario demo (propietario@intersim.bo): ${ownerProps2} propiedades`);
  console.log(`   🔑 Agente demo (agente@intersim.bo): ${agentProps} propiedades gestionadas`);
  console.log(`   📅 Visitas cliente demo: ${visits}`);
  console.log(`   💰 Ofertas cliente demo: ${offers}`);

  await db.close();
}

run().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
