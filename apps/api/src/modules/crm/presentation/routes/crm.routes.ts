import type { RouteDefinition } from '../../../../core/types/api.types.js';
import type { CrmRepository } from '../../domain/repositories/crm.repository.interface.js';
import { CrmController } from '../controllers/crm.controller.js';
import { LeadsController } from '../controllers/leads.controller.js';

export function createCrmRoutes(repository: CrmRepository): RouteDefinition[] {
  return [...new CrmController().routes(), ...new LeadsController(repository).routes()];
}
