import { randomUUID } from 'node:crypto';
import type { PropertyOffer } from '../../../domain/entities/property-offer.entity.js';
import type { IPropertyOfferRepository } from '../../../domain/repositories/property-offer.repository.js';
import type { TursoService } from '../../../../../infrastructure/database/turso/turso.service.js';

function toOffer(row: Record<string, unknown>): PropertyOffer {
  return {
    id: row['id'] as string,
    propertyId: row['property_id'] as string,
    clientId: row['client_id'] as string,
    agentId: row['agent_id'] as string | undefined,
    amount: row['amount'] as number,
    currency: row['currency'] as string,
    status: row['status'] as PropertyOffer['status'],
    message: row['notes'] as string | undefined,
    expiresAt: row['expires_at'] ? new Date(row['expires_at'] as string) : undefined,
    createdAt: new Date(row['created_at'] as string),
    updatedAt: new Date(row['updated_at'] as string),
  };
}

export class TursoPropertyOfferRepository implements IPropertyOfferRepository {
  constructor(private readonly db: TursoService) {}

  async findByPropertyId(propertyId: string): Promise<PropertyOffer[]> {
    const res = await this.db.execute(
      'SELECT * FROM property_offers WHERE property_id = :propertyId ORDER BY created_at DESC',
      { propertyId },
    );
    return res.rows.map((r) => toOffer(r as Record<string, unknown>));
  }

  async findByClientId(clientId: string): Promise<PropertyOffer[]> {
    const res = await this.db.execute(
      'SELECT * FROM property_offers WHERE client_id = :clientId ORDER BY created_at DESC',
      { clientId },
    );
    return res.rows.map((r) => toOffer(r as Record<string, unknown>));
  }

  async findById(id: string): Promise<PropertyOffer | null> {
    const res = await this.db.execute('SELECT * FROM property_offers WHERE id = :id', { id });
    const row = res.rows[0];
    return row ? toOffer(row as Record<string, unknown>) : null;
  }

  async create(data: Omit<PropertyOffer, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyOffer> {
    const now = new Date().toISOString();
    const id = randomUUID();
    await this.db.execute(
      `INSERT INTO property_offers (id, property_id, client_id, agent_id, amount, currency, offer_type, status, notes, expires_at, created_at, updated_at)
       VALUES (:id, :propertyId, :clientId, :agentId, :amount, :currency, 'buy', :status, :notes, :expiresAt, :createdAt, :updatedAt)`,
      {
        id,
        propertyId: data.propertyId,
        clientId: data.clientId,
        agentId: data.agentId ?? null,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        notes: data.message ?? null,
        expiresAt: data.expiresAt ? data.expiresAt.toISOString() : null,
        createdAt: now,
        updatedAt: now,
      },
    );
    return (await this.findById(id))!;
  }

  async update(id: string, data: Partial<PropertyOffer>): Promise<PropertyOffer> {
    const fields: string[] = [];
    const args: Record<string, unknown> = { id };

    if (data.status !== undefined) { fields.push('status = :status'); args['status'] = data.status; }
    if (data.amount !== undefined) { fields.push('amount = :amount'); args['amount'] = data.amount; }
    if (data.message !== undefined) { fields.push('notes = :notes'); args['notes'] = data.message; }

    fields.push('updated_at = :updatedAt');
    args['updatedAt'] = new Date().toISOString();

    await this.db.execute(`UPDATE property_offers SET ${fields.join(', ')} WHERE id = :id`, args);
    return (await this.findById(id))!;
  }
}
