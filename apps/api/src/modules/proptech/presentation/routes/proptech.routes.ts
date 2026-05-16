import type { RouteDefinition } from '../../../../core/types/api.types.js';
import type { PropertyService } from '../../application/services/property.service.js';
import type { PropertyVisitService } from '../../application/services/property-visit.service.js';
import type { PropertyMatchingService } from '../../application/services/property-matching.service.js';
import type { PropertyContractService } from '../../application/services/property-contract.service.js';
import type { SaleService } from '../../application/services/sale.service.js';
import type { ReportService } from '../../application/services/report.service.js';
import { PropertyController } from '../controllers/property.controller.js';
import { PropertyVisitController } from '../controllers/property-visit.controller.js';
import { PropertyMatchingController } from '../controllers/property-matching.controller.js';
import { PropertyContractController } from '../controllers/property-contract.controller.js';
import { SaleController } from '../controllers/sale.controller.js';
import { ReportController } from '../controllers/report.controller.js';

export interface ProptechRouteServices {
  propertyService: PropertyService;
  visitService: PropertyVisitService;
  matchingService: PropertyMatchingService;
  contractService: PropertyContractService;
  saleService: SaleService;
  reportService: ReportService;
}

export function createProptechRoutes(services: ProptechRouteServices): RouteDefinition[] {
  return [
    ...new PropertyController(services.propertyService).routes(),
    ...new PropertyVisitController(services.visitService).routes(),
    ...new PropertyMatchingController(services.matchingService).routes(),
    ...new PropertyContractController(services.contractService).routes(),
    ...new SaleController(services.saleService).routes(),
    ...new ReportController(services.reportService).routes(),
  ];
}
