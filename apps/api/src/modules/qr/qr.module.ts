import { EventName } from '../../core/enums/event.enum.js';
import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices, RouteDefinition } from '../../core/types/api.types.js';
import { createDomainEvent } from '../../events/event-bus.js';
import { created } from '../../shared/interceptors/response.interceptor.js';
import { ensureObject, ensureString } from '../../shared/pipes/validation.pipe.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function createQrModule(services: AppServices) {
  const scanRoute: RouteDefinition = {
    method: 'POST',
    path: '/qr/scan',
    handler: async (context) => {
      const body = ensureObject(context.body);
      const code = ensureString(body.code, 'code');
      const userId = typeof body.userId === 'string' ? body.userId : undefined;

      await context.services.eventBus.publish(
        createDomainEvent(
          EventName.QrScanned,
          { code, userId },
          {
            requestId: context.requestId,
            tenantId: context.tenantId,
          },
        ),
      );

      return created({ data: { code, status: 'accepted' } });
    },
  };

  return createFeatureModule(
    {
      basePath: '/qr',
      capabilities: ['scan', 'campaign-validation', 'reward-trigger'],
      description: 'QR scanning and redemption boundary.',
      name: ModuleName.Qr,
      routes: [scanRoute],
    },
    services,
  );
}
