import type { ApplicationModule, AppServices } from '../../core/types/api.types.js';
import { ModuleName } from '../../core/enums/module.enum.js';
import { InMemoryPropertyRepository } from './infrastructure/repositories/in-memory-property.repository.js';
import { InMemoryPropertyMediaRepository } from './infrastructure/repositories/in-memory-property-media.repository.js';
import { InMemoryPropertyDocumentRepository } from './infrastructure/repositories/in-memory-property-document.repository.js';
import { InMemoryPropertyVisitRepository } from './infrastructure/repositories/in-memory-property-visit.repository.js';
import { InMemoryPropertyOfferRepository } from './infrastructure/repositories/in-memory-property-offer.repository.js';
import { InMemoryPropertyContractRepository } from './infrastructure/repositories/in-memory-property-contract.repository.js';
import { InMemoryPropertyMatchingRepository } from './infrastructure/repositories/in-memory-property-matching.repository.js';
import { PropertyService } from './application/services/property.service.js';
import { PropertyVisitService } from './application/services/property-visit.service.js';
import { PropertyMatchingService } from './application/services/property-matching.service.js';
import { PropertyContractService } from './application/services/property-contract.service.js';
import { ProptechDashboardService } from './application/services/proptech-dashboard.service.js';
import { createProptechRoutes } from './presentation/routes/proptech.routes.js';
import { ProptechDashboardController } from './presentation/controllers/proptech-dashboard.controller.js';
import { createPropertyCreatedListener } from './listeners/property-created.listener.js';
import { createPropertyVisitScheduledListener } from './listeners/property-visit-scheduled.listener.js';
import { ok } from '../../shared/interceptors/response.interceptor.js';

export function createProptechModule(services: AppServices): ApplicationModule {
  const propertyRepository = new InMemoryPropertyRepository();
  const mediaRepository = new InMemoryPropertyMediaRepository();
  const documentRepository = new InMemoryPropertyDocumentRepository();
  const visitRepository = new InMemoryPropertyVisitRepository();
  const offerRepository = new InMemoryPropertyOfferRepository();
  const contractRepository = new InMemoryPropertyContractRepository();
  const matchingRepository = new InMemoryPropertyMatchingRepository();

  void mediaRepository;
  void documentRepository;

  const propertyService = new PropertyService(propertyRepository, services);
  const visitService = new PropertyVisitService(visitRepository, services);
  const matchingService = new PropertyMatchingService(matchingRepository, propertyRepository, services);
  const contractService = new PropertyContractService(contractRepository, services);
  const dashboardService = new ProptechDashboardService(
    propertyRepository,
    visitRepository,
    offerRepository,
    contractRepository,
    matchingRepository,
  );

  return {
    basePath: '/proptech',
    name: ModuleName.Proptech,
    listeners: [
      createPropertyCreatedListener(services.logger),
      createPropertyVisitScheduledListener(services.logger),
    ],
    routes: [
      {
        method: 'GET',
        path: '/proptech',
        handler: () =>
          ok({
            module: ModuleName.Proptech,
            status: 'active',
            capabilities: [
              'property-management',
              'property-media',
              'property-documents',
              'property-visits',
              'property-matching-ai',
              'property-contracts',
              'property-offers',
              'market-insights',
            ],
          }),
      },
      {
        method: 'GET',
        path: '/proptech/status',
        handler: () => ok({ module: ModuleName.Proptech, status: 'ready' }),
      },
      ...new ProptechDashboardController(dashboardService).routes(),
      ...createProptechRoutes({ propertyService, visitService, matchingService, contractService }),
    ],
  };
}
