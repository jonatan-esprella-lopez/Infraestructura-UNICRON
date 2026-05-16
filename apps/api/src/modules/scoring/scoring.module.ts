import { EventName } from '../../core/enums/event.enum.js';
import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices, DomainEvent } from '../../core/types/api.types.js';
import { createDomainEvent } from '../../events/event-bus.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function createScoringModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/scoring',
      capabilities: ['lead-score', 'risk-score', 'rules-engine-ready'],
      description: 'Scoring boundary for leads, campaigns, and risk signals.',
      listeners: [
        {
          eventName: EventName.LeadCreated,
          handle: (event) => scoreLead(services, event),
        },
      ],
      name: ModuleName.Scoring,
    },
    services,
  );
}

async function scoreLead(services: AppServices, event: DomainEvent): Promise<void> {
  const lead = event.payload as { id?: string; score?: number };
  const score = typeof lead.score === 'number' ? lead.score : 50;

  await services.eventBus.publish(
    createDomainEvent(
      EventName.LeadScored,
      {
        leadId: lead.id,
        score,
      },
      {
        correlationId: event.metadata.correlationId ?? event.id,
        requestId: event.metadata.requestId,
        tenantId: event.metadata.tenantId,
      },
    ),
  );
}
