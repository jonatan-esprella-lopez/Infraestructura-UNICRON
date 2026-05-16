import { randomUUID } from 'node:crypto';
import type { PropertyContract } from '../../../domain/entities/property-contract.entity.js';
import type { IPropertyContractRepository } from '../../../domain/repositories/property-contract.repository.js';
import type { TursoService } from '../../../../../infrastructure/database/turso/turso.service.js';

function toContract(row: Record<string, unknown>): PropertyContract {
  return {
    id: row['id'] as string,
    propertyId: row['property_id'] as string,
    clientId: row['client_id'] as string,
    ownerId: row['owner_id'] as string,
    agentId: row['agent_id'] as string | undefined,
    contractType: row['contract_type'] as PropertyContract['contractType'],
    status: row['status'] as PropertyContract['status'],
    fileUrl: row['file_url'] as string | undefined,
    draftText: row['draft_text'] as string | undefined,
    totalAmount: row['total_amount'] as number,
    currency: row['currency'] as string,
    startDate: row['start_date'] ? new Date(row['start_date'] as string) : undefined,
    endDate: row['end_date'] ? new Date(row['end_date'] as string) : undefined,
    createdAt: new Date(row['created_at'] as string),
    updatedAt: new Date(row['updated_at'] as string),
  };
}

export class TursoPropertyContractRepository implements IPropertyContractRepository {
  constructor(private readonly db: TursoService) {}

  async findByPropertyId(propertyId: string): Promise<PropertyContract[]> {
    const res = await this.db.execute(
      'SELECT * FROM property_contracts WHERE property_id = :propertyId ORDER BY created_at DESC',
      { propertyId },
    );
    return res.rows.map((r) => toContract(r as Record<string, unknown>));
  }

  async findById(id: string): Promise<PropertyContract | null> {
    const res = await this.db.execute('SELECT * FROM property_contracts WHERE id = :id', { id });
    const row = res.rows[0];
    return row ? toContract(row as Record<string, unknown>) : null;
  }

  async create(data: Omit<PropertyContract, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyContract> {
    const now = new Date().toISOString();
    const id = randomUUID();
    await this.db.execute(
      `INSERT INTO property_contracts (id, property_id, client_id, owner_id, agent_id, contract_type, status, draft_text, file_url, total_amount, currency, start_date, end_date, created_at, updated_at)
       VALUES (:id, :propertyId, :clientId, :ownerId, :agentId, :contractType, :status, :draftText, :fileUrl, :totalAmount, :currency, :startDate, :endDate, :createdAt, :updatedAt)`,
      {
        id,
        propertyId: data.propertyId,
        clientId: data.clientId,
        ownerId: data.ownerId,
        agentId: data.agentId ?? null,
        contractType: data.contractType,
        status: data.status,
        draftText: data.draftText ?? null,
        fileUrl: data.fileUrl ?? null,
        totalAmount: data.totalAmount,
        currency: data.currency,
        startDate: data.startDate ? data.startDate.toISOString() : null,
        endDate: data.endDate ? data.endDate.toISOString() : null,
        createdAt: now,
        updatedAt: now,
      },
    );
    return (await this.findById(id))!;
  }

  async update(id: string, data: Partial<PropertyContract>): Promise<PropertyContract> {
    const fields: string[] = [];
    const args: Record<string, unknown> = { id };

    if (data.status !== undefined) { fields.push('status = :status'); args['status'] = data.status; }
    if (data.draftText !== undefined) { fields.push('draft_text = :draftText'); args['draftText'] = data.draftText; }
    if (data.fileUrl !== undefined) { fields.push('file_url = :fileUrl'); args['fileUrl'] = data.fileUrl; }
    if (data.totalAmount !== undefined) { fields.push('total_amount = :totalAmount'); args['totalAmount'] = data.totalAmount; }
    if (data.startDate !== undefined) { fields.push('start_date = :startDate'); args['startDate'] = data.startDate.toISOString(); }
    if (data.endDate !== undefined) { fields.push('end_date = :endDate'); args['endDate'] = data.endDate.toISOString(); }

    fields.push('updated_at = :updatedAt');
    args['updatedAt'] = new Date().toISOString();

    await this.db.execute(`UPDATE property_contracts SET ${fields.join(', ')} WHERE id = :id`, args);
    return (await this.findById(id))!;
  }
}
