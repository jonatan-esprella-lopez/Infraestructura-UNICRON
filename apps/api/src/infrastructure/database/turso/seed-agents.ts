/**
 * Seed script: 20 agentes inmobiliarios bolivianos
 *
 * - Crea 3 planes de membresía (Básico, Platino, Diamante)
 * - Registra 20 agentes con datos reales completos
 * - Asigna una suscripción activa a cada agente según su plan
 * - Distribuye las 100 propiedades existentes entre los agentes
 *   respetando el límite de propiedades del plan
 * - Actualiza publication_status y status a 'published' / 'active'
 *   en las propiedades asignadas
 */

import { randomUUID } from 'crypto';
import { createClient } from '@libsql/client';
import { SCHEMA_SQL } from './schema.sql.js';

const DB_URL = process.env['TURSO_DATABASE_URL'] || process.env['DATABASE_URL'] || 'file:./local.db';
const AUTH_TOKEN = process.env['TURSO_AUTH_TOKEN'] || '';

const db = createClient({ url: DB_URL, authToken: AUTH_TOKEN });

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function now() { return new Date().toISOString(); }
function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/* ── Planes de membresía ────────────────────────────────────────────────── */
const PLANS = [
  {
    id: 'plan-basico',
    name: 'Básico',
    slug: 'basico',
    price_usd: 40,
    duration_days: 30,
    max_active_properties: 3,
    max_leads: 50,
    features: JSON.stringify(['Listado básico', 'Hasta 3 propiedades activas', 'Soporte por email']),
  },
  {
    id: 'plan-platino',
    name: 'Platino',
    slug: 'platino',
    price_usd: 60,
    duration_days: 30,
    max_active_properties: 8,
    max_leads: 150,
    features: JSON.stringify(['Listado destacado', 'Hasta 8 propiedades activas', 'CRM incluido', 'Soporte prioritario']),
  },
  {
    id: 'plan-diamante',
    name: 'Diamante',
    slug: 'diamante',
    price_usd: 100,
    duration_days: 30,
    max_active_properties: 20,
    max_leads: 500,
    features: JSON.stringify(['Máxima visibilidad', 'Hasta 20 propiedades activas', 'IA matching', 'CRM avanzado', 'Soporte 24/7', 'Reportes mensuales']),
  },
];

/* ── Agentes (20 bolivianos con datos completos) ─────────────────────────── */
const AGENTS: {
  first_name: string; last_name: string; email: string; phone: string;
  agency: string; city: string; plan_id: string; props_to_assign: number;
}[] = [
  // ── Básico (8 agentes, 3 propiedades c/u = 24) ───────────────────────────
  {
    first_name: 'Carlos Alberto', last_name: 'Mendoza Quiroga',
    email: 'c.mendoza@intersim.bo', phone: '+591 70012301',
    agency: 'Century 21 Bolivia', city: 'Santa Cruz', plan_id: 'plan-basico', props_to_assign: 3,
  },
  {
    first_name: 'Laura Beatriz', last_name: 'Vargas Flores',
    email: 'l.vargas@intersim.bo', phone: '+591 70012302',
    agency: 'RE/MAX Bolivia', city: 'Santa Cruz', plan_id: 'plan-basico', props_to_assign: 3,
  },
  {
    first_name: 'Diego Ramón', last_name: 'Torres Salinas',
    email: 'd.torres@intersim.bo', phone: '+591 70012303',
    agency: 'Independiente', city: 'Santa Cruz', plan_id: 'plan-basico', props_to_assign: 3,
  },
  {
    first_name: 'Patricia Elena', last_name: 'Vásquez Condori',
    email: 'p.vasquez@intersim.bo', phone: '+591 70012304',
    agency: 'PropBolivia', city: 'Santa Cruz', plan_id: 'plan-basico', props_to_assign: 3,
  },
  {
    first_name: 'Carmen Rosa', last_name: 'Reyes Molina',
    email: 'c.reyes@intersim.bo', phone: '+591 70012305',
    agency: 'InmoBolivia', city: 'Santa Cruz', plan_id: 'plan-basico', props_to_assign: 3,
  },
  {
    first_name: 'Ricardo Enrique', last_name: 'Suárez Villegas',
    email: 'r.suarez@intersim.bo', phone: '+591 70012306',
    agency: 'Independiente', city: 'Beni', plan_id: 'plan-basico', props_to_assign: 3,
  },
  {
    first_name: 'Verónica Luz', last_name: 'Aguilar Delgado',
    email: 'v.aguilar@intersim.bo', phone: '+591 70012307',
    agency: 'Century 21 Bolivia', city: 'Tarija', plan_id: 'plan-basico', props_to_assign: 3,
  },
  {
    first_name: 'Claudia Fernanda', last_name: 'Rojas Quispe',
    email: 'c.rojas@intersim.bo', phone: '+591 70012308',
    agency: 'RE/MAX Bolivia', city: 'Cochabamba', plan_id: 'plan-basico', props_to_assign: 3,
  },

  // ── Platino (8 agentes, 6 propiedades c/u = 48) ──────────────────────────
  {
    first_name: 'Marco Antonio', last_name: 'Gutiérrez Alvarado',
    email: 'm.gutierrez@intersim.bo', phone: '+591 70012309',
    agency: 'Century 21 Bolivia', city: 'Santa Cruz', plan_id: 'plan-platino', props_to_assign: 6,
  },
  {
    first_name: 'Sofía Alejandra', last_name: 'Chávez Huanca',
    email: 's.chavez@intersim.bo', phone: '+591 70012310',
    agency: 'Keller Williams Bolivia', city: 'Cochabamba', plan_id: 'plan-platino', props_to_assign: 6,
  },
  {
    first_name: 'Fernando Luis', last_name: 'Espinoza Orellana',
    email: 'f.espinoza@intersim.bo', phone: '+591 70012311',
    agency: 'PropBolivia', city: 'Santa Cruz', plan_id: 'plan-platino', props_to_assign: 6,
  },
  {
    first_name: 'Sebastián Andrés', last_name: 'Vargas Ponce',
    email: 's.vargas@intersim.bo', phone: '+591 70012312',
    agency: 'RE/MAX Bolivia', city: 'Santa Cruz', plan_id: 'plan-platino', props_to_assign: 6,
  },
  {
    first_name: 'Natalia Paola', last_name: 'Jiménez Soliz',
    email: 'n.jimenez@intersim.bo', phone: '+591 70012313',
    agency: 'Intersim', city: 'Cochabamba', plan_id: 'plan-platino', props_to_assign: 6,
  },
  {
    first_name: 'Juan Pablo', last_name: 'Morales Arce',
    email: 'jp.morales@intersim.bo', phone: '+591 70012314',
    agency: 'RE/MAX Cochabamba', city: 'Cochabamba', plan_id: 'plan-platino', props_to_assign: 6,
  },
  {
    first_name: 'Valentina Isabel', last_name: 'Cruz Aliaga',
    email: 'v.cruz@intersim.bo', phone: '+591 70012315',
    agency: 'Keller Williams Bolivia', city: 'La Paz', plan_id: 'plan-platino', props_to_assign: 6,
  },
  {
    first_name: 'Roberto Javier', last_name: 'Castro Mamani',
    email: 'r.castro@intersim.bo', phone: '+591 70012316',
    agency: 'Century 21 Bolivia', city: 'La Paz', plan_id: 'plan-platino', props_to_assign: 6,
  },

  // ── Diamante (4 agentes, 7 propiedades c/u = 28) ─────────────────────────
  {
    first_name: 'Ana María', last_name: 'Silva Pérez',
    email: 'a.silva@intersim.bo', phone: '+591 70012317',
    agency: 'Keller Williams Bolivia', city: 'La Paz', plan_id: 'plan-diamante', props_to_assign: 7,
  },
  {
    first_name: 'Gonzalo Miguel', last_name: 'Herrera Vidal',
    email: 'g.herrera@intersim.bo', phone: '+591 70012318',
    agency: 'Century 21 Bolivia', city: 'Santa Cruz', plan_id: 'plan-diamante', props_to_assign: 7,
  },
  {
    first_name: 'Ignacio Manuel', last_name: 'Ordóñez Peña',
    email: 'i.ordonez@intersim.bo', phone: '+591 70012319',
    agency: 'PropBolivia', city: 'La Paz', plan_id: 'plan-diamante', props_to_assign: 7,
  },
  {
    first_name: 'Daniela Carmen', last_name: 'López Hinojosa',
    email: 'd.lopez@intersim.bo', phone: '+591 70012320',
    agency: 'Keller Williams Bolivia', city: 'Santa Cruz', plan_id: 'plan-diamante', props_to_assign: 7,
  },
];

/* ── Main ─────────────────────────────────────────────────────────────────── */
async function run() {
  console.log('🚀 Iniciando seed de agentes...\n');

  // 1. Ejecutar migraciones para crear las nuevas tablas
  console.log('📦 Ejecutando migraciones...');
  const statements = SCHEMA_SQL
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const sql of statements) {
    try {
      await db.execute(sql + ';');
    } catch {
      // IF NOT EXISTS — ignorar errores de tabla/índice ya existente
    }
  }
  console.log('✅ Migraciones OK\n');

  // 2. Insertar planes de suscripción
  console.log('📋 Creando planes de membresía...');
  for (const plan of PLANS) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO agent_plans
              (id, name, slug, price_usd, duration_days, max_active_properties, max_leads, features, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [plan.id, plan.name, plan.slug, plan.price_usd, plan.duration_days,
             plan.max_active_properties, plan.max_leads, plan.features, now()],
    });
    console.log(`  ✓ Plan ${plan.name}: max ${plan.max_active_properties} props — $${plan.price_usd}/mes`);
  }
  console.log('');

  // 3. Cargar todas las propiedades publicadas existentes (sin agente asignado)
  const propsRes = await db.execute(
    "SELECT id FROM properties WHERE publication_status = 'published' AND (agent_id IS NULL OR agent_id = '') ORDER BY created_at ASC"
  );
  const unassignedProps = propsRes.rows.map((r) => r['id'] as string);
  console.log(`🏠 ${unassignedProps.length} propiedades sin agente disponibles para asignar\n`);

  let propIndex = 0;

  // 4. Crear agentes, suscripciones y asignar propiedades
  console.log('👤 Registrando agentes...\n');
  const tenantId = 'intersim-default';

  for (let i = 0; i < AGENTS.length; i++) {
    const agent = AGENTS[i];
    const agentId = randomUUID();
    const subscriptionId = randomUUID();

    // 4a. Insertar usuario agente
    await db.execute({
      sql: `INSERT OR IGNORE INTO users
              (id, tenant_id, first_name, last_name, email, password_hash, role, phone, agency, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        agentId, tenantId, agent.first_name, agent.last_name, agent.email,
        '$2b$10$mockHashForAgente' + (i + 1),   // hash ficticio
        'agent', agent.phone, agent.agency, now(), now(),
      ],
    });

    // 4b. Insertar suscripción activa
    const plan = PLANS.find((p) => p.id === agent.plan_id)!;
    await db.execute({
      sql: `INSERT OR IGNORE INTO agent_subscriptions
              (id, agent_id, plan_id, status, started_at, expires_at, active_properties_count, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        subscriptionId, agentId, plan.id, 'active',
        now(), addDays(plan.duration_days),
        agent.props_to_assign,   // contamos las que vamos a asignar
        now(), now(),
      ],
    });

    // 4c. Asignar propiedades al agente dentro del límite del plan
    const toAssign = unassignedProps.slice(propIndex, propIndex + agent.props_to_assign);
    propIndex += agent.props_to_assign;

    for (const propId of toAssign) {
      await db.execute({
        sql: `UPDATE properties
              SET agent_id = ?,
                  status = 'active',
                  publication_status = 'published',
                  published_at = ?,
                  updated_at = ?
              WHERE id = ?`,
        args: [agentId, now(), now(), propId],
      });
    }

    const planEmoji = plan.slug === 'diamante' ? '💎' : plan.slug === 'platino' ? '🥈' : '🥉';
    console.log(
      `  ${planEmoji} [${plan.name}] ${agent.first_name} ${agent.last_name}` +
      ` | ${agent.agency} | ${agent.city}` +
      ` | ${toAssign.length} propiedades asignadas`
    );
  }

  // 5. Verificación final
  console.log('\n─────────────────────────────────────────────');
  const agentsCount = await db.execute("SELECT COUNT(*) as c FROM users WHERE role = 'agent'");
  const subsCount   = await db.execute("SELECT COUNT(*) as c FROM agent_subscriptions WHERE status = 'active'");
  const assignedCount = await db.execute("SELECT COUNT(*) as c FROM properties WHERE agent_id IS NOT NULL AND agent_id != ''");
  const publishedCount = await db.execute("SELECT COUNT(*) as c FROM properties WHERE publication_status = 'published'");

  console.log(`\n✅ Seed completado exitosamente:`);
  console.log(`   👤 Agentes creados    : ${(agentsCount.rows[0] as any).c}`);
  console.log(`   📋 Suscripciones      : ${(subsCount.rows[0] as any).c} activas`);
  console.log(`   🔗 Props con agente   : ${(assignedCount.rows[0] as any).c}`);
  console.log(`   🌐 Props publicadas   : ${(publishedCount.rows[0] as any).c}`);

  // Distribución por plan
  console.log('\n   Distribución por plan:');
  const dist = await db.execute(`
    SELECT ap.name, COUNT(*) as agents, SUM(s.active_properties_count) as props
    FROM agent_subscriptions s
    JOIN agent_plans ap ON ap.id = s.plan_id
    WHERE s.status = 'active'
    GROUP BY ap.name
    ORDER BY ap.price_usd
  `);
  for (const row of dist.rows) {
    const r = row as any;
    console.log(`     • ${r.name}: ${r.agents} agentes — ${r.props} propiedades gestionadas`);
  }

  await db.close();
}

run().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
