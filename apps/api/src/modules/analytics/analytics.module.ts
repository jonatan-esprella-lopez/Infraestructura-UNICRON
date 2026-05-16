import { EventName } from '../../core/enums/event.enum.js';
import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices, DomainEvent } from '../../core/types/api.types.js';
import { createDomainEvent } from '../../events/event-bus.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function createAnalyticsModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/analytics',
      capabilities: ['conversion-tracking', 'engagement-metrics', 'business-events'],
      description: 'Analytics collection and metrics aggregation.',
      listeners: [
        {
          eventName: EventName.LeadCreated,
          handle: (event) => recordAnalytics(services, event, 'lead_created'),
        },
        {
          eventName: EventName.NotificationSent,
          handle: (event) => recordAnalytics(services, event, 'notification_sent'),
        },
        {
          eventName: EventName.QrScanned,
          handle: (event) => recordAnalytics(services, event, 'qr_scanned'),
        },
        {
          eventName: EventName.WalletPointsAssigned,
          handle: (event) => recordAnalytics(services, event, 'wallet_points_assigned'),
        },
      ],
      name: ModuleName.Analytics,
    },
    services,
  );
}

async function recordAnalytics(services: AppServices, event: DomainEvent, type: string): Promise<void> {
  services.metrics.increment('business.event', { type });
  await services.eventBus.publish(
    createDomainEvent(
      EventName.AnalyticsRecorded,
      { sourceEventId: event.id, type },
      {
        correlationId: event.metadata.correlationId ?? event.id,
        requestId: event.metadata.requestId,
        tenantId: event.metadata.tenantId,
      },
    ),
  );
}
