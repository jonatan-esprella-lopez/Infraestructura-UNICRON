import type { AuthenticatedUser } from '../../../../core/types/api.types.js';
import type { IPropertyRepository } from '../../domain/repositories/property.repository.js';
import type { IPropertyVisitRepository } from '../../domain/repositories/property-visit.repository.js';
import type { IPropertyOfferRepository } from '../../domain/repositories/property-offer.repository.js';
import type { IPropertyContractRepository } from '../../domain/repositories/property-contract.repository.js';
import type { IPropertyMatchingRepository } from '../../domain/repositories/property-matching.repository.js';

export interface AdminDashboardData {
  role: 'admin';
  totalProperties: number;
  publishedProperties: number;
  pendingProperties: number;
  totalLeads: number;
  totalVisits: number;
  scheduledVisits: number;
  totalOffers: number;
  contractsInReview: number;
  documentsPending: number;
  activeAgents: number;
  conversionRate: number;
}

export interface AgentDashboardData {
  role: 'agent';
  assignedProperties: number;
  newLeads: number;
  todayVisits: number;
  pendingTasks: number;
  hotClients: number;
  activeOffers: number;
  contractsPending: number;
  followUpsToday: number;
}

export interface OwnerDashboardData {
  role: 'owner';
  ownedProperties: number;
  publishedProperties: number;
  propertyViews: number;
  interestedClients: number;
  scheduledVisits: number;
  receivedOffers: number;
  documentsPending: number;
}

export interface ClientDashboardData {
  role: 'client';
  recommendedProperties: number;
  favoriteProperties: number;
  scheduledVisits: number;
  activeOffers: number;
  contractsPending: number;
  newMatches: number;
}

export type DashboardData = AdminDashboardData | AgentDashboardData | OwnerDashboardData | ClientDashboardData;

export class ProptechDashboardService {
  constructor(
    private readonly propertyRepository: IPropertyRepository,
    private readonly visitRepository: IPropertyVisitRepository,
    private readonly offerRepository: IPropertyOfferRepository,
    private readonly contractRepository: IPropertyContractRepository,
    private readonly matchingRepository: IPropertyMatchingRepository,
  ) {}

  async getDashboardForUser(user: AuthenticatedUser): Promise<DashboardData> {
    const roles = user.roles;

    if (roles.includes('admin') || roles.includes('manager') || roles.includes('agency_admin')) {
      return this.getAdminDashboard(user.tenantId);
    }

    if (roles.includes('agent')) {
      return this.getAgentDashboard(user.id);
    }

    if (roles.includes('owner')) {
      return this.getOwnerDashboard(user.id);
    }

    if (roles.includes('client')) {
      return this.getClientDashboard(user.id);
    }

    return this.getAdminDashboard(user.tenantId);
  }

  private async getAdminDashboard(tenantId?: string): Promise<AdminDashboardData> {
    const [allResult, publishedResult, pendingResult] = await Promise.all([
      this.propertyRepository.findAll({ tenantId, limit: 0, offset: 0 }),
      this.propertyRepository.findAll({ tenantId, publicationStatus: 'published', limit: 0, offset: 0 }),
      this.propertyRepository.findAll({ tenantId, publicationStatus: 'pending_review', limit: 0, offset: 0 }),
    ]);

    return {
      role: 'admin',
      totalProperties: allResult.total,
      publishedProperties: publishedResult.total,
      pendingProperties: pendingResult.total,
      totalLeads: 0,
      totalVisits: 0,
      scheduledVisits: 0,
      totalOffers: 0,
      contractsInReview: 0,
      documentsPending: 0,
      activeAgents: 0,
      conversionRate: publishedResult.total > 0 ? Math.round((publishedResult.total / (allResult.total || 1)) * 100) : 0,
    };
  }

  private async getAgentDashboard(agentId: string): Promise<AgentDashboardData> {
    const visits = await this.visitRepository.findByClientId(agentId).catch(() => []);
    const today = new Date().toDateString();
    const todayVisits = visits.filter((v) => new Date(v.scheduledAt).toDateString() === today);

    return {
      role: 'agent',
      assignedProperties: 0,
      newLeads: 0,
      todayVisits: todayVisits.length,
      pendingTasks: 0,
      hotClients: 0,
      activeOffers: 0,
      contractsPending: 0,
      followUpsToday: 0,
    };
  }

  private async getOwnerDashboard(ownerId: string): Promise<OwnerDashboardData> {
    const { items, total } = await this.propertyRepository.findAll({ limit: 100, offset: 0 });
    const owned = items.filter((p) => p.ownerId === ownerId);
    const published = owned.filter((p) => p.publicationStatus === 'published');

    return {
      role: 'owner',
      ownedProperties: owned.length,
      publishedProperties: published.length,
      propertyViews: 0,
      interestedClients: 0,
      scheduledVisits: 0,
      receivedOffers: 0,
      documentsPending: 0,
    };
  }

  private async getClientDashboard(clientId: string): Promise<ClientDashboardData> {
    const [matches, visits] = await Promise.all([
      this.matchingRepository.findByClientId(clientId).catch(() => []),
      this.visitRepository.findByClientId(clientId).catch(() => []),
    ]);

    const scheduledVisits = visits.filter((v) => v.status === 'scheduled' || v.status === 'confirmed');

    return {
      role: 'client',
      recommendedProperties: matches.length,
      favoriteProperties: 0,
      scheduledVisits: scheduledVisits.length,
      activeOffers: 0,
      contractsPending: 0,
      newMatches: matches.filter((m) => m.score >= 70).length,
    };
  }
}
