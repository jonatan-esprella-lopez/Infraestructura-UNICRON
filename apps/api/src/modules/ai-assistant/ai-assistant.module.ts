import { EventName } from '../../core/enums/event.enum.js';
import { ModuleName } from '../../core/enums/module.enum.js';
import type { AppServices, DomainEvent } from '../../core/types/api.types.js';
import { createDomainEvent } from '../../events/event-bus.js';
import { createFeatureModule } from '../_shared/feature-module.factory.js';

export function createAiAssistantModule(services: AppServices) {
  return createFeatureModule(
    {
      basePath: '/ai-assistant',
      capabilities: ['classification', 'recommendation', 'generation', 'embeddings', 'ocr', 'speech-to-text'],
      description: 'AI orchestration boundary across model providers.',
      listeners: [
        {
          eventName: EventName.LeadScored,
          handle: (event) => classifyLeadIntent(services, event),
        },
      ],
      name: ModuleName.AiAssistant,
    },
    services,
  );
}

async function classifyLeadIntent(services: AppServices, event: DomainEvent): Promise<void> {
  const result = await services.ai.classifyIntent({
    tenantId: event.metadata.tenantId,
    text: JSON.stringify(event.payload),
  });

  await services.eventBus.publish(
    createDomainEvent(
      EventName.LeadIntentClassified,
      {
        ...event.payload,
        ...result,
      },
      {
        correlationId: event.metadata.correlationId ?? event.id,
        requestId: event.metadata.requestId,
        tenantId: event.metadata.tenantId,
      },
    ),
  );
}
