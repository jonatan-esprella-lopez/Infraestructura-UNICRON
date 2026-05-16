import type { RouteDefinition } from '../../../../core/types/api.types.js';
import type { PropertyService } from '../../application/services/property.service.js';
import type { PropertyVisitService } from '../../application/services/property-visit.service.js';
import type { PropertyMatchingService } from '../../application/services/property-matching.service.js';
import type { PropertyContractService } from '../../application/services/property-contract.service.js';
import { PropertyController } from '../controllers/property.controller.js';
import { PropertyVisitController } from '../controllers/property-visit.controller.js';
import { PropertyMatchingController } from '../controllers/property-matching.controller.js';
import { PropertyContractController } from '../controllers/property-contract.controller.js';

export interface ProptechRouteServices {
  propertyService: PropertyService;
  visitService: PropertyVisitService;
  matchingService: PropertyMatchingService;
  contractService: PropertyContractService;
}

export function createProptechRoutes(services: ProptechRouteServices): RouteDefinition[] {
  return [
    ...new PropertyController(services.propertyService).routes(),
    ...new PropertyVisitController(services.visitService).routes(),
    ...new PropertyMatchingController(services.matchingService).routes(),
    ...new PropertyContractController(services.contractService).routes(),
  ];
}
