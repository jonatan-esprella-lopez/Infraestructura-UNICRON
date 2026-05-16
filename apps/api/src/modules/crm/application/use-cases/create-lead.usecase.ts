import type { UseCase } from '../../../../core/interfaces/usecase.interface.js';
import type { EventBusLike } from '../../../../core/types/api.types.js';
import { Lead, type LeadSnapshot } from '../../domain/entities/lead.entity.js';
import type { CrmRepository } from '../../domain/repositories/crm.repository.interface.js';
import { leadCreatedEvent } from '../../domain/events/lead-created.event.js';
import type { CreateLeadDto } from '../dto/create-lead.dto.js';
import { LeadScoringService } from '../services/lead-scoring.service.js';

export class CreateLeadUseCase implements UseCase<CreateLeadDto & { requestId?: string }, LeadSnapshot> {
  constructor(
    private readonly repository: CrmRepository,
    private readonly scoringService: LeadScoringService,
    private readonly eventBus: EventBusLike,
  ) {}

  async execute(input: CreateLeadDto & { requestId?: string }): Promise<LeadSnapshot> {
    const lead = Lead.create({
      contact: {
        email: input.email,
        name: input.name,
        phone: input.phone,
      },
      source: input.source ?? 'api',
      tenantId: input.tenantId,
    });

    lead.setScore(this.scoringService.score(input));

    const saved = await this.repository.save(lead);
    const snapshot = saved.toJSON();

    await this.eventBus.publish(
      leadCreatedEvent(snapshot, {
        requestId: input.requestId,
        tenantId: input.tenantId,
      }),
    );

    return snapshot;
  }
}
