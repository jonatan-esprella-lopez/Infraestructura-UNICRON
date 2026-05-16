import { randomUUID } from 'node:crypto';
import type { PropertySale } from '../../../domain/entities/property-sale.entity.js';
import type { IPropertySaleRepository, SaleFilters } from '../../../domain/repositories/property-sale.repository.js';
import type { TursoService } from '../../../../../infrastructure/database/turso/turso.service.js';

function toSale(row: Record<string, unknown>): PropertySale {
  return {
    id: row['id'] as string,
    tenantId: row['tenant_id'] as string,
    agentId: row['agent_id'] as string | undefined,
    clientId: row['client_id'] as string | undefined,
    propertyId: row['property_id'] as string | undefined,
    saleType: row['sale_type'] as PropertySale['saleType'],
    productOrService: row['product_or_service'] as string,
    amount: row['amount'] as number,
    currency: row['currency'] as string,
    paymentMethod: row['payment_method'] as PropertySale['paymentMethod'],
    saleLocation: row['sale_location'] as PropertySale['saleLocation'],
    saleChannel: row['sale_channel'] as PropertySale['saleChannel'],
    notes: row['notes'] as string | undefined,
    soldAt: new Date(row['sold_at'] as string),
    createdAt: new Date(row['created_at'] as string),
    updatedAt: new Date(row['updated_at'] as string),
  };
}

export class TursoPropertySaleRepository implements IPropertySaleRepository {
  constructor(private readonly db: TursoService) {}

  async findAll(filters: SaleFilters): Promise<PropertySale[]> {
    let sql = 'SELECT * FROM property_sales WHERE tenant_id = :tenantId';
    const args: Record<string, unknown> = { tenantId: filters.tenantId };

    if (filters.agentId) { sql += ' AND agent_id = :agentId'; args['agentId'] = filters.agentId; }
    if (filters.saleType) { sql += ' AND sale_type = :saleType'; args['saleType'] = filters.saleType; }
    if (filters.paymentMethod) { sql += ' AND payment_method = :paymentMethod'; args['paymentMethod'] = filters.paymentMethod; }
    if (filters.saleLocation) { sql += ' AND sale_location = :saleLocation'; args['saleLocation'] = filters.saleLocation; }
    if (filters.from) { sql += ' AND sold_at >= :from'; args['from'] = filters.from.toISOString(); }
    if (filters.to) { sql += ' AND sold_at <= :to'; args['to'] = filters.to.toISOString(); }

    sql += ' ORDER BY sold_at DESC';

    const res = await this.db.execute(sql, args);
    return res.rows.map((r) => toSale(r as Record<string, unknown>));
  }

  async findById(id: string): Promise<PropertySale | null> {
    const res = await this.db.execute('SELECT * FROM property_sales WHERE id = :id', { id });
    const row = res.rows[0];
    return row ? toSale(row as Record<string, unknown>) : null;
  }

  async create(data: Omit<PropertySale, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertySale> {
    const now = new Date().toISOString();
    const id = randomUUID();
    await this.db.execute(
      `INSERT INTO property_sales (id, tenant_id, agent_id, client_id, property_id, sale_type, product_or_service, amount, currency, payment_method, sale_location, sale_channel, notes, sold_at, created_at, updated_at)
       VALUES (:id, :tenantId, :agentId, :clientId, :propertyId, :saleType, :productOrService, :amount, :currency, :paymentMethod, :saleLocation, :saleChannel, :notes, :soldAt, :createdAt, :updatedAt)`,
      {
        id,
        tenantId: data.tenantId,
        agentId: data.agentId ?? null,
        clientId: data.clientId ?? null,
        propertyId: data.propertyId ?? null,
        saleType: data.saleType,
        productOrService: data.productOrService,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        saleLocation: data.saleLocation,
        saleChannel: data.saleChannel,
        notes: data.notes ?? null,
        soldAt: data.soldAt.toISOString(),
        createdAt: now,
        updatedAt: now,
      },
    );
    return (await this.findById(id))!;
  }

  async update(id: string, data: Partial<PropertySale>): Promise<PropertySale> {
    const fields: string[] = [];
    const args: Record<string, unknown> = { id };

    if (data.amount !== undefined) { fields.push('amount = :amount'); args['amount'] = data.amount; }
    if (data.notes !== undefined) { fields.push('notes = :notes'); args['notes'] = data.notes; }
    if (data.paymentMethod !== undefined) { fields.push('payment_method = :paymentMethod'); args['paymentMethod'] = data.paymentMethod; }
    if (data.saleLocation !== undefined) { fields.push('sale_location = :saleLocation'); args['saleLocation'] = data.saleLocation; }

    fields.push('updated_at = :updatedAt');
    args['updatedAt'] = new Date().toISOString();

    await this.db.execute(`UPDATE property_sales SET ${fields.join(', ')} WHERE id = :id`, args);
    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<void> {
    await this.db.execute('DELETE FROM property_sales WHERE id = :id', { id });
  }
}
