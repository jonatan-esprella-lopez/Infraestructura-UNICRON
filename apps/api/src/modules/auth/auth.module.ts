import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices } from '../../core/types/api.types.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';
import { ok, badRequest } from '../../shared/interceptors/response.interceptor.js';

interface DemoUser {
  id: string;
  email: string;
  password: string;
  name: string;
  roles: string[];
  tenantId: string;
}

const DEMO_USERS: DemoUser[] = [
  { id: 'usr_admin_01', email: 'admin@intersim.bo', password: 'admin123', name: 'Carlos Mendoza', roles: ['admin'], tenantId: 'tenant_intersim' },
  { id: 'usr_agent_01', email: 'agente@intersim.bo', password: 'agente123', name: 'María García', roles: ['agent'], tenantId: 'tenant_intersim' },
  { id: 'usr_owner_01', email: 'propietario@intersim.bo', password: 'prop123', name: 'Roberto Vargas', roles: ['owner'], tenantId: 'tenant_intersim' },
  { id: 'usr_client_01', email: 'cliente@intersim.bo', password: 'cliente123', name: 'Ana López', roles: ['client'], tenantId: 'tenant_intersim' },
];

function createToken(user: Omit<DemoUser, 'password'>): string {
  const payload = { id: user.id, email: user.email, name: user.name, roles: user.roles, tenantId: user.tenantId, permissions: [] };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}
export function createAuthModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/auth',
      capabilities: ['jwt-access', 'refresh-tokens', 'session-revocation', 'api-keys'],
      description: 'Authentication and session boundary for users and integrations.',
      name: ModuleName.Auth,
      routes: [
        {
          method: 'POST',
          path: '/auth/login',
          public: true,
          handler: async (ctx) => {
            const body = ctx.body as Record<string, string>;
            const email = body['email']?.toLowerCase().trim();
            const password = body['password'];
            if (!email || !password) return badRequest('Email y contraseña requeridos');

            // 1. Check demo users first
            const demo = DEMO_USERS.find((u) => u.email === email && u.password === password);
            if (demo) {
              const { password: _pw, ...safeUser } = demo;
              return ok({ token: createToken(safeUser), user: safeUser });
            }

            // 2. Check real DB users
            if (services.turso) {
              const res = await services.turso.execute(
                'SELECT id, first_name, last_name, email, password_hash, role, agency FROM users WHERE email = :email',
                { email },
              );
              const row = res.rows[0] as Record<string, unknown> | undefined;
              if (row) {
                const storedHash = row['password_hash'] as string;
                const matches = storedHash === password || storedHash === `plain:${password}`;
                if (!matches) return badRequest('Credenciales incorrectas');
                const dbUser = {
                  id: row['id'] as string,
                  email: row['email'] as string,
                  name: `${row['first_name']} ${row['last_name']}`,
                  roles: [row['role'] as string],
                  tenantId: 'tenant_intersim',
                };
                return ok({ token: createToken(dbUser), user: dbUser });
              }
            }

            return badRequest('Credenciales incorrectas');
          },
        },

        /* ── Register ───────────────────────────────────────────────────── */
        {
          method: 'POST',
          path: '/auth/register',
          public: true,
          handler: async (ctx) => {
            const body = ctx.body as Record<string, string>;
            const firstName = (body['firstName'] ?? '').trim();
            const lastName  = (body['lastName']  ?? '').trim();
            const email     = (body['email']     ?? '').toLowerCase().trim();
            const password  = body['password']   ?? '';
            const phone     = (body['phone']     ?? '').trim();
            const agency    = (body['agency']    ?? '').trim();

            if (!firstName || !lastName || !email || !password) {
              return badRequest('Nombre, apellido, email y contraseña son requeridos');
            }
            if (password.length < 6) return badRequest('La contraseña debe tener al menos 6 caracteres');
            if (!services.turso) return badRequest('Servicio no disponible');

            // Check existing email (demo users + DB)
            const inDemo = DEMO_USERS.some((u) => u.email === email);
            if (inDemo) return badRequest('El email ya está registrado');

            const existing = await services.turso.execute(
              'SELECT id FROM users WHERE email = :email',
              { email },
            );
            if (existing.rows.length > 0) return badRequest('El email ya está registrado');

            // Create user
            const id  = randomUUID();
            const now = new Date().toISOString();
            await services.turso.execute(
              `INSERT INTO users (id, tenant_id, first_name, last_name, email, password_hash, role, phone, agency, created_at, updated_at)
               VALUES (:id, :tenantId, :firstName, :lastName, :email, :passwordHash, 'agent', :phone, :agency, :createdAt, :updatedAt)`,
              { id, tenantId: TENANT_ID, firstName, lastName, email, passwordHash: `plain:${password}`, phone, agency: agency || 'Independiente', createdAt: now, updatedAt: now },
            );

            const newUser = { id, email, name: `${firstName} ${lastName}`, roles: ['agent'], tenantId: 'tenant_intersim' };
            return ok({ token: createToken(newUser), user: newUser });
          },
        },

        /* ── Me ─────────────────────────────────────────────────────────── */
=======
          handler: (ctx) => {
            const body = ctx.body as Record<string, string>;
            const email = body['email']?.toLowerCase().trim();
            const password = body['password'];
            const user = DEMO_USERS.find((u) => u.email === email && u.password === password);
            if (!user) return badRequest('Credenciales incorrectas');
            const { password: _pw, ...safeUser } = user;
            return ok({ token: createToken(safeUser), user: safeUser });
          },
        },
>>>>>>> origin/exp/pres
        {
          method: 'GET',
          path: '/auth/me',
          handler: (ctx) => {
            if (!ctx.user) return badRequest('No autenticado');
            return ok(ctx.user);
          },
        },
        {
          method: 'POST',
          path: '/auth/logout',
          handler: () => ok({ message: 'Sesión cerrada' }),
        },
      ],
    },
    services,
  );
}
