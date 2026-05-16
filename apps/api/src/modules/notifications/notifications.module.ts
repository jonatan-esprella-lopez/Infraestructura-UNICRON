import { QUEUES } from '../../core/constants/queue.constants.js';
import { EventName } from '../../core/enums/event.enum.js';
import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices, DomainEvent } from '../../core/types/api.types.js';
import { createDomainEvent } from '../../events/event-bus.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function createNotificationsModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/notifications',
      capabilities: ['email', 'whatsapp', 'sms', 'push', 'templates'],
      description: 'Notification orchestration across delivery providers.',
      listeners: [
        {
          eventName: EventName.CampaignFollowupScheduled,
          handle: (event) => notify(services, event, 'followup'),
        },
        {
          eventName: EventName.WalletPointsAssigned,
          handle: (event) => notify(services, event, 'reward'),
        },
      ],
      name: ModuleName.Notifications,
    },
    services,
  );
}

async function notify(services: AppServices, event: DomainEvent, template: string): Promise<void> {
  await services.queue.enqueue(QUEUES.NOTIFICATIONS, {
    payload: event.payload,
    template,
    tenantId: event.metadata.tenantId,
  });

  await services.eventBus.publish(
    createDomainEvent(
      EventName.NotificationSent,
      { template },
      {
        correlationId: event.metadata.correlationId ?? event.id,
        requestId: event.metadata.requestId,
        tenantId: event.metadata.tenantId,
      },
    ),
  );
}
