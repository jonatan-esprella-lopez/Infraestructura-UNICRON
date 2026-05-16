import { EventName } from '../../core/enums/event.enum.js';
import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices, DomainEvent } from '../../core/types/api.types.js';
import { createDomainEvent } from '../../events/event-bus.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function createCampaignsModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/campaigns',
      capabilities: ['followups', 'missions', 'audience-segments', 'automation'],
      description: 'Campaign automation and mission validation boundary.',
      listeners: [
        {
          eventName: EventName.LeadIntentClassified,
          handle: (event) => scheduleFollowup(services, event),
        },
        {
          eventName: EventName.QrScanned,
          handle: (event) => validateMission(services, event),
        },
      ],
      name: ModuleName.Campaigns,
    },
    services,
  );
}

async function scheduleFollowup(services: AppServices, event: DomainEvent): Promise<void> {
  await services.eventBus.publish(
    createDomainEvent(
      EventName.CampaignFollowupScheduled,
      {
        ...event.payload,
        channel: 'whatsapp',
      },
      {
        correlationId: event.metadata.correlationId ?? event.id,
        requestId: event.metadata.requestId,
        tenantId: event.metadata.tenantId,
      },
    ),
  );
}

async function validateMission(services: AppServices, event: DomainEvent): Promise<void> {
  await services.eventBus.publish(
    createDomainEvent(
      EventName.CampaignMissionValidated,
      {
        ...event.payload,
        points: 25,
        valid: true,
      },
      {
        correlationId: event.metadata.correlationId ?? event.id,
        requestId: event.metadata.requestId,
        tenantId: event.metadata.tenantId,
      },
    ),
  );
}
