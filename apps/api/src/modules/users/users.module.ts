import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices, RequestContext } from '../../core/types/api.types.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';
import { ok, badRequest } from '../../shared/interceptors/response.interceptor.js';

export function createUsersModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/users',
      capabilities: ['profiles', 'tenant-membership', 'user-audit'],
      description: 'User profile and membership management.',
      name: ModuleName.Users,
      routes: [
        {
          method: 'GET',
          path: '/users/agents',
          handler: async (context: RequestContext) => {
            try {
              if (!services.turso) {
                return badRequest('Database not available');
              }
              const sql = `
                SELECT 
                  u.id, 
                  u.first_name || ' ' || u.last_name as name, 
                  u.agency, 
                  u.email,
                  u.phone,
                  (SELECT COUNT(*) FROM properties p WHERE p.agent_id = u.id AND p.publication_status = 'published') as activeListings,
                  (SELECT COUNT(*) FROM property_sales ps WHERE ps.agent_id = u.id) as soldListings
                FROM users u
                WHERE u.role = 'agent'
              `;
              const result = await services.turso.execute(sql);
              
              // Map to match frontend expected structure
              const agents = result.rows.map((row: any) => ({
                id: row.id,
                name: row.name,
                agency: row.agency || 'Agente Independiente',
                email: row.email,
                phone: row.phone,
                rating: (4.0 + Math.random()).toFixed(1), // Mock rating since not in DB
                reviews: Math.floor(Math.random() * 100) + 10,
                activeListings: Number(row.activeListings) || 0,
                soldListings: Number(row.soldListings) || 0,
                verified: true,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name as string)}&background=random`
              }));

              return ok({ items: agents, total: agents.length });
            } catch (error) {
              console.error('Error fetching agents:', error);
              return badRequest('Failed to fetch agents');
            }
          }
        }
      ]
    },
    services,
  );
}
