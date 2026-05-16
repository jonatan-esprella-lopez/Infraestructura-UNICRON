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
