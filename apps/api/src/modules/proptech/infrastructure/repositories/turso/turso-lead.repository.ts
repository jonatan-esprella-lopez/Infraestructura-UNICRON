import { randomUUID } from 'node:crypto';
import type { Lead, LeadFilters } from '../../../domain/entities/lead.entity.js';
import type { ILeadRepository } from '../../../domain/repositories/lead.repository.js';
import type { TursoService } from '../../../../../infrastructure/database/turso/turso.service.js';

function toLead(row: Record<string, unknown>): Lead {
  return {
    id: row['id'] as string,
    tenantId: row['tenant_id'] as string,
    agentId: row['agent_id'] as string | undefined,
    firstName: row['first_name'] as string,
    lastName: row['last_name'] as string,
    email: row['email'] as string | undefined,
    phone: row['phone'] as string | undefined,
    source: row['source'] as Lead['source'],
    status: row['status'] as Lead['status'],
    operationType: row['operation_type'] as string | undefined,
    propertyType: row['property_type'] as string | undefined,
    budgetMin: row['budget_min'] as number | undefined,
    budgetMax: row['budget_max'] as number | undefined,
    currency: (row['currency'] as string) ?? 'BOB',
    preferredCity: row['preferred_city'] as string | undefined,
    notes: row['notes'] as string | undefined,
    convertedAt: row['converted_at'] ? new Date(row['converted_at'] as string) : undefined,
    createdAt: new Date(row['created_at'] as string),
    updatedAt: new Date(row['updated_at'] as string),
  };
}

export class TursoLeadRepository implements ILeadRepository {
  constructor(private readonly db: TursoService) {}

  async findAll(filters: LeadFilters): Promise<{ items: Lead[]; total: number }> {
    let sql = 'SELECT * FROM leads WHERE 1=1';
    const args: Record<string, unknown> = {};

    if (filters.tenantId) { sql += ' AND tenant_id = :tenantId'; args['tenantId'] = filters.tenantId; }
    if (filters.agentId) { sql += ' AND agent_id = :agentId'; args['agentId'] = filters.agentId; }
    if (filters.status) { sql += ' AND status = :status'; args['status'] = filters.status; }

    const countRes = await this.db.execute(`SELECT COUNT(*) as cnt FROM (${sql})`, args);
    const total = Number((countRes.rows[0] as Record<string, unknown>)['cnt'] ?? 0);

    sql += ' ORDER BY created_at DESC';
    const limit = filters.limit ?? 50;
    const offset = filters.offset ?? 0;
    sql += ' LIMIT :limit OFFSET :offset';
    args['limit'] = limit;
    args['offset'] = offset;

    const res = await this.db.execute(sql, args);
    return { items: res.rows.map((r) => toLead(r as Record<string, unknown>)), total };
  }

  async findById(id: string): Promise<Lead | null> {
    const res = await this.db.execute('SELECT * FROM leads WHERE id = :id', { id });
    const row = res.rows[0];
    return row ? toLead(row as Record<string, unknown>) : null;
  }

  async create(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const now = new Date().toISOString();
    const id = randomUUID();
    await this.db.execute(
      `INSERT INTO leads (id, tenant_id, agent_id, first_name, last_name, email, phone, source, status,
        operation_type, property_type, budget_min, budget_max, currency, preferred_city, notes, converted_at,
        created_at, updated_at)
       VALUES (:id, :tenantId, :agentId, :firstName, :lastName, :email, :phone, :source, :status,
        :operationType, :propertyType, :budgetMin, :budgetMax, :currency, :preferredCity, :notes, :convertedAt,
        :createdAt, :updatedAt)`,
      {
        id,
        tenantId: data.tenantId,
        agentId: data.agentId ?? null,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email ?? null,
        phone: data.phone ?? null,
        source: data.source,
        status: data.status,
        operationType: data.operationType ?? null,
        propertyType: data.propertyType ?? null,
        budgetMin: data.budgetMin ?? null,
        budgetMax: data.budgetMax ?? null,
        currency: data.currency,
        preferredCity: data.preferredCity ?? null,
        notes: data.notes ?? null,
        convertedAt: data.convertedAt ? data.convertedAt.toISOString() : null,
        createdAt: now,
        updatedAt: now,
      },
    );
    return (await this.findById(id))!;
  }

  async update(id: string, data: Partial<Lead>): Promise<Lead> {
    const fields: string[] = [];
    const args: Record<string, unknown> = { id };

    if (data.agentId !== undefined) { fields.push('agent_id = :agentId'); args['agentId'] = data.agentId; }
    if (data.firstName !== undefined) { fields.push('first_name = :firstName'); args['firstName'] = data.firstName; }
    if (data.lastName !== undefined) { fields.push('last_name = :lastName'); args['lastName'] = data.lastName; }
    if (data.email !== undefined) { fields.push('email = :email'); args['email'] = data.email; }
    if (data.phone !== undefined) { fields.push('phone = :phone'); args['phone'] = data.phone; }
    if (data.source !== undefined) { fields.push('source = :source'); args['source'] = data.source; }
    if (data.status !== undefined) { fields.push('status = :status'); args['status'] = data.status; }
    if (data.operationType !== undefined) { fields.push('operation_type = :operationType'); args['operationType'] = data.operationType; }
    if (data.propertyType !== undefined) { fields.push('property_type = :propertyType'); args['propertyType'] = data.propertyType; }
    if (data.budgetMin !== undefined) { fields.push('budget_min = :budgetMin'); args['budgetMin'] = data.budgetMin; }
    if (data.budgetMax !== undefined) { fields.push('budget_max = :budgetMax'); args['budgetMax'] = data.budgetMax; }
    if (data.currency !== undefined) { fields.push('currency = :currency'); args['currency'] = data.currency; }
    if (data.preferredCity !== undefined) { fields.push('preferred_city = :preferredCity'); args['preferredCity'] = data.preferredCity; }
    if (data.notes !== undefined) { fields.push('notes = :notes'); args['notes'] = data.notes; }
    if (data.convertedAt !== undefined) { fields.push('converted_at = :convertedAt'); args['convertedAt'] = data.convertedAt.toISOString(); }

    fields.push('updated_at = :updatedAt');
    args['updatedAt'] = new Date().toISOString();

    await this.db.execute(`UPDATE leads SET ${fields.join(', ')} WHERE id = :id`, args);
    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<void> {
    await this.db.execute('DELETE FROM leads WHERE id = :id', { id });
  }
}
