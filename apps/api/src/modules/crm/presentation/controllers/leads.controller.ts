import type { RequestContext, RouteDefinition } from '../../../../core/types/api.types.js';
import { created, ok } from '../../../../shared/interceptors/response.interceptor.js';
import { ensureObject, ensureString } from '../../../../shared/pipes/validation.pipe.js';
import type { CrmRepository } from '../../domain/repositories/crm.repository.interface.js';
import { CreateLeadUseCase } from '../../application/use-cases/create-lead.usecase.js';
import { LeadScoringService } from '../../application/services/lead-scoring.service.js';
import { presentLead } from '../presenters/lead.presenter.js';

export class LeadsController {
  constructor(private readonly repository: CrmRepository) {}

  routes(): RouteDefinition[] {
    return [
      {
        method: 'GET',
        path: '/crm/leads',
        handler: (context) => this.index(context),
      },
      {
        method: 'POST',
        path: '/crm/leads',
        handler: (context) => this.create(context),
      },
    ];
  }

  private async index(context: RequestContext) {
    const leads = await this.repository.findAll(context.tenantId);
    return ok({ data: leads.map(presentLead) });
  }

  private async create(context: RequestContext) {
    const body = ensureObject(context.body);
    const useCase = new CreateLeadUseCase(this.repository, new LeadScoringService(), context.services.eventBus);
    const lead = await useCase.execute({
      email: typeof body.email === 'string' ? body.email : undefined,
      name: ensureString(body.name, 'name'),
      phone: typeof body.phone === 'string' ? body.phone : undefined,
      requestId: context.requestId,
      source: typeof body.source === 'string' ? body.source : 'api',
      tenantId: context.tenantId,
    });

    return created({ data: presentLead(lead) });
  }
}
