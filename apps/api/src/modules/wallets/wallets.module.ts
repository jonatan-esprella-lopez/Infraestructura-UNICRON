import { EventName } from '../../core/enums/event.enum.js';
import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices, DomainEvent } from '../../core/types/api.types.js';
import { createDomainEvent } from '../../events/event-bus.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function createWalletsModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/wallets',
      capabilities: ['points', 'rewards', 'balance-ledger'],
      description: 'Wallet and rewards boundary.',
      listeners: [
        {
          eventName: EventName.CampaignMissionValidated,
          handle: (event) => assignPoints(services, event),
        },
      ],
      name: ModuleName.Wallets,
    },
    services,
  );
}

async function assignPoints(services: AppServices, event: DomainEvent): Promise<void> {
  const payload = event.payload as { points?: number; userId?: string };

  await services.eventBus.publish(
    createDomainEvent(
      EventName.WalletPointsAssigned,
      {
        points: payload.points ?? 0,
        userId: payload.userId,
      },
      {
        correlationId: event.metadata.correlationId ?? event.id,
        requestId: event.metadata.requestId,
        tenantId: event.metadata.tenantId,
      },
    ),
  );
}
