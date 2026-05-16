import { randomUUID } from 'node:crypto';
import type { PropertyVisit } from '../../../domain/entities/property-visit.entity.js';
import type { IPropertyVisitRepository } from '../../../domain/repositories/property-visit.repository.js';
import type { TursoService } from '../../../../../infrastructure/database/turso/turso.service.js';

function toVisit(row: Record<string, unknown>): PropertyVisit {
  return {
    id: row['id'] as string,
    propertyId: row['property_id'] as string,
    clientId: row['client_id'] as string,
    agentId: row['agent_id'] as string | undefined,
    scheduledAt: new Date(row['scheduled_at'] as string),
    status: row['status'] as PropertyVisit['status'],
    visitType: (row['visit_type'] ?? 'in_person') as PropertyVisit['visitType'],
    notes: row['notes'] as string | undefined,
    clientFeedback: row['feedback'] as string | undefined,
    result: row['result'] as PropertyVisit['result'] | undefined,
    createdAt: new Date(row['created_at'] as string),
    updatedAt: new Date(row['updated_at'] as string),
  };
}

export class TursoPropertyVisitRepository implements IPropertyVisitRepository {
  constructor(private readonly db: TursoService) {}

  async findByPropertyId(propertyId: string): Promise<PropertyVisit[]> {
    const res = await this.db.execute(
      'SELECT * FROM property_visits WHERE property_id = :propertyId ORDER BY scheduled_at DESC',
      { propertyId },
    );
    return res.rows.map((r) => toVisit(r as Record<string, unknown>));
  }

  async findByClientId(clientId: string): Promise<PropertyVisit[]> {
    const res = await this.db.execute(
      'SELECT * FROM property_visits WHERE client_id = :clientId ORDER BY scheduled_at DESC',
      { clientId },
    );
    return res.rows.map((r) => toVisit(r as Record<string, unknown>));
  }

  async findById(id: string): Promise<PropertyVisit | null> {
    const res = await this.db.execute('SELECT * FROM property_visits WHERE id = :id', { id });
    const row = res.rows[0];
    return row ? toVisit(row as Record<string, unknown>) : null;
  }

  async create(data: Omit<PropertyVisit, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyVisit> {
    const now = new Date().toISOString();
    const id = randomUUID();
    await this.db.execute(
      `INSERT INTO property_visits (id, property_id, client_id, agent_id, tenant_id, scheduled_at, status, notes, feedback, created_at, updated_at)
       VALUES (:id, :propertyId, :clientId, :agentId, :tenantId, :scheduledAt, :status, :notes, :feedback, :createdAt, :updatedAt)`,
      {
        id,
        propertyId: data.propertyId,
        clientId: data.clientId,
        agentId: data.agentId ?? null,
        tenantId: '',
        scheduledAt: data.scheduledAt.toISOString(),
        status: data.status,
        notes: data.notes ?? null,
        feedback: data.clientFeedback ?? null,
        createdAt: now,
        updatedAt: now,
      },
    );
    return (await this.findById(id))!;
  }

  async update(id: string, data: Partial<PropertyVisit>): Promise<PropertyVisit> {
    const fields: string[] = [];
    const args: Record<string, unknown> = { id };

    if (data.status !== undefined) { fields.push('status = :status'); args['status'] = data.status; }
    if (data.scheduledAt !== undefined) { fields.push('scheduled_at = :scheduledAt'); args['scheduledAt'] = data.scheduledAt.toISOString(); }
    if (data.notes !== undefined) { fields.push('notes = :notes'); args['notes'] = data.notes; }
    if (data.clientFeedback !== undefined) { fields.push('feedback = :feedback'); args['feedback'] = data.clientFeedback; }

    fields.push('updated_at = :updatedAt');
    args['updatedAt'] = new Date().toISOString();

    await this.db.execute(`UPDATE property_visits SET ${fields.join(', ')} WHERE id = :id`, args);
    return (await this.findById(id))!;
  }
}
