import { randomUUID } from 'node:crypto';
import type { PropertyMatch } from '../../../domain/entities/property-match.entity.js';
import type { IPropertyMatchingRepository } from '../../../domain/repositories/property-matching.repository.js';
import type { TursoService } from '../../../../../infrastructure/database/turso/turso.service.js';

function toMatch(row: Record<string, unknown>): PropertyMatch {
  const breakdown = JSON.parse((row['breakdown'] as string) || '{}') as PropertyMatch['scoreBreakdown'];
  return {
    id: row['id'] as string,
    clientId: row['client_id'] as string,
    propertyId: row['property_id'] as string,
    score: row['score'] as number,
    scoreBreakdown: breakdown,
    matchReason: row['notes'] as string | undefined,
    createdAt: new Date(row['created_at'] as string),
    updatedAt: new Date(row['updated_at'] as string),
  };
}

export class TursoPropertyMatchingRepository implements IPropertyMatchingRepository {
  constructor(private readonly db: TursoService) {}

  async findAll(): Promise<PropertyMatch[]> {
    const res = await this.db.execute(
      'SELECT * FROM property_matches ORDER BY created_at DESC',
      {},
    );
    return res.rows.map((r) => toMatch(r as Record<string, unknown>));
  }

  async findByClientId(clientId: string): Promise<PropertyMatch[]> {
    const res = await this.db.execute(
      'SELECT * FROM property_matches WHERE client_id = :clientId ORDER BY score DESC',
      { clientId },
    );
    return res.rows.map((r) => toMatch(r as Record<string, unknown>));
  }

  async findByPropertyId(propertyId: string): Promise<PropertyMatch[]> {
    const res = await this.db.execute(
      'SELECT * FROM property_matches WHERE property_id = :propertyId ORDER BY score DESC',
      { propertyId },
    );
    return res.rows.map((r) => toMatch(r as Record<string, unknown>));
  }

  async upsert(data: Omit<PropertyMatch, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyMatch> {
    const now = new Date().toISOString();

    const existing = await this.db.execute(
      'SELECT id FROM property_matches WHERE client_id = :clientId AND property_id = :propertyId',
      { clientId: data.clientId, propertyId: data.propertyId },
    );

    if (existing.rows.length > 0) {
      const id = (existing.rows[0] as Record<string, unknown>)['id'] as string;
      await this.db.execute(
        'UPDATE property_matches SET score = :score, breakdown = :breakdown, notes = :notes, updated_at = :updatedAt WHERE id = :id',
        {
          id,
          score: data.score,
          breakdown: JSON.stringify(data.scoreBreakdown),
          notes: data.matchReason ?? null,
          updatedAt: now,
        },
      );
      return (await this.findByClientId(data.clientId)).find((m) => m.id === id)!;
    }

    const id = randomUUID();
    await this.db.execute(
      `INSERT INTO property_matches (id, client_id, property_id, tenant_id, score, breakdown, status, notes, created_at, updated_at)
       VALUES (:id, :clientId, :propertyId, :tenantId, :score, :breakdown, 'pending', :notes, :createdAt, :updatedAt)`,
      {
        id,
        clientId: data.clientId,
        propertyId: data.propertyId,
        tenantId: '',
        score: data.score,
        breakdown: JSON.stringify(data.scoreBreakdown),
        notes: data.matchReason ?? null,
        createdAt: now,
        updatedAt: now,
      },
    );

    const res = await this.db.execute('SELECT * FROM property_matches WHERE id = :id', { id });
    return toMatch(res.rows[0] as Record<string, unknown>);
  }

  async deleteByClientId(clientId: string): Promise<void> {
    await this.db.execute('DELETE FROM property_matches WHERE client_id = :clientId', { clientId });
  }
}
