/**
 * Seed: 10 agentes inmobiliarios bolivianos adicionales
 */
import { randomUUID } from 'crypto';
import { createClient } from '@libsql/client';

const DB_URL = process.env['TURSO_DATABASE_URL'] || process.env['DATABASE_URL'] || 'file:./local.db';
const db = createClient({ url: DB_URL, authToken: process.env['TURSO_AUTH_TOKEN'] || '' });

function now() { return new Date().toISOString(); }
function addDays(days: number) {
  const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString();
}

const PLANS = [
  { id: 'plan-basico',   slug: 'basico',   price_usd: 40,  duration_days: 30, max_active_properties: 3,  max_leads: 50  },
  { id: 'plan-platino',  slug: 'platino',  price_usd: 60,  duration_days: 30, max_active_properties: 8,  max_leads: 150 },
  { id: 'plan-diamante', slug: 'diamante', price_usd: 100, duration_days: 30, max_active_properties: 20, max_leads: 500 },
];

const NEW_AGENTS = [
  { first_name: 'Alejandro José',   last_name: 'Pedraza Ruiz',      email: 'a.pedraza@intersim.bo',   phone: '+591 70012321', agency: 'RE/MAX Bolivia',          city: 'Santa Cruz',  plan_id: 'plan-platino'  },
  { first_name: 'Mónica Patricia',  last_name: 'Soto Guzmán',       email: 'm.soto@intersim.bo',       phone: '+591 70012322', agency: 'Century 21 Bolivia',      city: 'La Paz',      plan_id: 'plan-basico'   },
  { first_name: 'Héctor Rodrigo',   last_name: 'Núñez Camacho',     email: 'h.nunez@intersim.bo',      phone: '+591 70012323', agency: 'Keller Williams Bolivia', city: 'Cochabamba',  plan_id: 'plan-diamante' },
  { first_name: 'Gabriela Ximena',  last_name: 'Pinto Aranda',      email: 'g.pinto@intersim.bo',      phone: '+591 70012324', agency: 'PropBolivia',             city: 'Santa Cruz',  plan_id: 'plan-platino'  },
  { first_name: 'Marcelo Iván',     last_name: 'Arias Torrico',     email: 'ma.arias@intersim.bo',     phone: '+591 70012325', agency: 'InmoBolivia',             city: 'Oruro',       plan_id: 'plan-basico'   },
  { first_name: 'Lorena Beatriz',   last_name: 'Medina Pacheco',    email: 'l.medina@intersim.bo',     phone: '+591 70012326', agency: 'RE/MAX Cochabamba',       city: 'Cochabamba',  plan_id: 'plan-platino'  },
  { first_name: 'Álvaro Santiago',  last_name: 'Fuentes Barrios',   email: 'al.fuentes@intersim.bo',   phone: '+591 70012327', agency: 'Century 21 Bolivia',      city: 'Santa Cruz',  plan_id: 'plan-diamante' },
  { first_name: 'Cecilia Paola',    last_name: 'Cárdenas Salazar',  email: 'ce.cardenas@intersim.bo',  phone: '+591 70012328', agency: 'Intersim',                city: 'La Paz',      plan_id: 'plan-platino'  },
  { first_name: 'Rafael Eduardo',   last_name: 'Miranda Campos',    email: 'r.miranda@intersim.bo',    phone: '+591 70012329', agency: 'Independiente',           city: 'Sucre',       plan_id: 'plan-basico'   },
  { first_name: 'Valeria Luciana',  last_name: 'Burgos Montaño',    email: 'v.burgos@intersim.bo',     phone: '+591 70012330', agency: 'Keller Williams Bolivia', city: 'Santa Cruz',  plan_id: 'plan-diamante' },
];

async function run() {
  console.log('🚀 Registrando 10 agentes adicionales...\n');
  const tenantId = 'intersim-default';
  let created = 0;

  for (let i = 0; i < NEW_AGENTS.length; i++) {
    const agent = NEW_AGENTS[i];

    // Verificar si ya existe
    const exists = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [agent.email] });
    if (exists.rows.length > 0) {
      console.log(`  ⚠️  Ya existe: ${agent.email}`);
      continue;
    }

    const agentId = randomUUID();
    const plan = PLANS.find((p) => p.id === agent.plan_id)!;
    const planEmoji = plan.slug === 'diamante' ? '💎' : plan.slug === 'platino' ? '🥈' : '🥉';

    await db.execute({
      sql: `INSERT INTO users
              (id, tenant_id, first_name, last_name, email, password_hash, role, phone, agency, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 'agent', ?, ?, ?, ?)`,
      args: [agentId, tenantId, agent.first_name, agent.last_name, agent.email,
             `$2b$10$mockHashExtra${i + 1}`, agent.phone, agent.agency, now(), now()],
    });

    await db.execute({
      sql: `INSERT INTO agent_subscriptions
              (id, agent_id, plan_id, status, started_at, expires_at, active_properties_count, created_at, updated_at)
            VALUES (?, ?, ?, 'active', ?, ?, 0, ?, ?)`,
      args: [randomUUID(), agentId, plan.id, now(), addDays(plan.duration_days), now(), now()],
    });

    console.log(`  ${planEmoji} [${plan.slug.charAt(0).toUpperCase() + plan.slug.slice(1)}] ${agent.first_name} ${agent.last_name} | ${agent.agency} | ${agent.city}`);
    created++;
  }

  const total = await db.execute("SELECT COUNT(*) as c FROM users WHERE role = 'agent'");
  console.log(`\n✅ ${created} agentes nuevos registrados`);
  console.log(`   Total agentes en BD: ${(total.rows[0] as Record<string, unknown>)['c']}`);
  await db.close();
}

run().catch((err) => { console.error('❌ Error:', err); process.exit(1); });
