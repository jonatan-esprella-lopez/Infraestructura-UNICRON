import { randomUUID } from 'node:crypto';
import type { Property } from '../../../domain/entities/property.entity.js';
import type { IPropertyRepository, PropertyFilters } from '../../../domain/repositories/property.repository.js';
import type { TursoService } from '../../../../../infrastructure/database/turso/turso.service.js';

function parseJsonArray(raw: unknown): string[] {
  if (!raw) return [];
  try { return JSON.parse(raw as string) as string[]; } catch { return []; }
}

function toProperty(row: Record<string, unknown>): Property {
  return {
    id: row['id'] as string,
    tenantId: row['tenant_id'] as string,
    ownerId: row['owner_id'] as string,
    agentId: row['agent_id'] as string | undefined,
    title: row['title'] as string,
    description: row['description'] as string,
    propertyType: row['property_type'] as Property['propertyType'],
    operationType: row['operation_type'] as Property['operationType'],
    status: row['status'] as Property['status'],
    publicationStatus: row['publication_status'] as Property['publicationStatus'],
    legalStatus: row['legal_status'] as Property['legalStatus'],
    price: row['price'] as number,
    currency: row['currency'] as Property['currency'],
    areaTotal: (row['area'] as number) ?? 0,
    areaBuilt: row['area_built'] as number | undefined,
    bedrooms: row['bedrooms'] as number | undefined,
    bathrooms: row['bathrooms'] as number | undefined,
    parkingSpaces: row['parking_spaces'] as number | undefined,
    floorNumber: row['floor'] as number | undefined,
    yearBuilt: row['year_built'] as number | undefined,
    address: row['address'] as string,
    city: row['city'] as string,
    zone: row['zone'] as string | undefined,
    latitude: row['latitude'] as number | undefined,
    longitude: row['longitude'] as number | undefined,
    isFeatured: (row['is_featured'] as number) === 1,
    imageUrls: parseJsonArray(row['image_urls']),
    // Agent info (populated by findById JOIN)
    ...(row['agent_first_name'] ? {
      agentName: `${row['agent_first_name']} ${row['agent_last_name']}`,
      agentPhone: row['agent_phone'] as string | undefined,
      agentAgency: row['agent_agency'] as string | undefined,
      agentEmail: row['agent_email'] as string | undefined,
    } : {}),
    publishedAt: row['published_at'] ? new Date(row['published_at'] as string) : undefined,
    deletedAt: row['deleted_at'] ? new Date(row['deleted_at'] as string) : undefined,
    createdAt: new Date(row['created_at'] as string),
    updatedAt: new Date(row['updated_at'] as string),
  };
}

export class TursoPropertyRepository implements IPropertyRepository {
  constructor(private readonly db: TursoService) {}

  async findAll(filters: PropertyFilters): Promise<{ items: Property[]; total: number }> {
    let sql = 'SELECT * FROM properties WHERE deleted_at IS NULL';
    const args: Record<string, unknown> = {};

    if (filters.tenantId) { sql += ' AND tenant_id = :tenantId'; args['tenantId'] = filters.tenantId; }
    if (filters.ownerId) { sql += ' AND owner_id = :ownerId'; args['ownerId'] = filters.ownerId; }
    if (filters.operationType) { sql += ' AND operation_type = :opType'; args['opType'] = filters.operationType; }
    if (filters.propertyType) { sql += ' AND property_type = :propType'; args['propType'] = filters.propertyType; }
    if (filters.status) { sql += ' AND status = :status'; args['status'] = filters.status; }
    if (filters.city) { sql += ' AND city = :city'; args['city'] = filters.city; }
    if (filters.zone) { sql += ' AND zone LIKE :zone'; args['zone'] = `%${filters.zone}%`; }
    if (filters.publicationStatus) { sql += ' AND publication_status = :pubStatus'; args['pubStatus'] = filters.publicationStatus; }
    if (filters.agentId) { sql += ' AND agent_id = :agentId'; args['agentId'] = filters.agentId; }
    if (filters.minPrice !== undefined) { sql += ' AND price >= :minPrice'; args['minPrice'] = filters.minPrice; }
    if (filters.maxPrice !== undefined) { sql += ' AND price <= :maxPrice'; args['maxPrice'] = filters.maxPrice; }
    if (filters.minBedrooms !== undefined) { sql += ' AND bedrooms >= :minBedrooms'; args['minBedrooms'] = filters.minBedrooms; }
    if (filters.petsAllowed !== undefined) {
      if (filters.petsAllowed) {
        sql += ' AND features LIKE :pets'; args['pets'] = '%pets_allowed%';
      }
    }
    if (filters.query) {
      sql += ' AND (title LIKE :query OR address LIKE :query OR city LIKE :query OR zone LIKE :query)';
      args['query'] = `%${filters.query}%`;
    }

    const countRes = await this.db.execute(`SELECT COUNT(*) as cnt FROM (${sql})`, args);
    const total = Number((countRes.rows[0] as Record<string, unknown>)['cnt'] ?? 0);

    sql += ' ORDER BY created_at DESC';
    if (filters.limit !== undefined) { sql += ' LIMIT :limit'; args['limit'] = filters.limit; }
    if (filters.offset !== undefined) { sql += ' OFFSET :offset'; args['offset'] = filters.offset; }

    const res = await this.db.execute(sql, args);
    return { items: res.rows.map((r) => toProperty(r as Record<string, unknown>)), total };
  }

  async findById(id: string): Promise<Property | null> {
    const res = await this.db.execute(
      `SELECT p.*,
              u.first_name  AS agent_first_name,
              u.last_name   AS agent_last_name,
              u.phone       AS agent_phone,
              u.agency      AS agent_agency,
              u.email       AS agent_email
       FROM properties p
       LEFT JOIN users u ON u.id = p.agent_id
       WHERE p.id = :id AND p.deleted_at IS NULL`,
      { id },
    );
    const row = res.rows[0];
    return row ? toProperty(row as Record<string, unknown>) : null;
  }

  async create(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    const now = new Date().toISOString();
    const id = randomUUID();
    await this.db.execute(
      `INSERT INTO properties (id, tenant_id, owner_id, agent_id, title, description, property_type,
        operation_type, status, publication_status, legal_status, price, currency, area, area_built, bedrooms,
        bathrooms, parking_spaces, floor, year_built, address, city, zone, latitude, longitude, is_featured,
        image_urls, features, published_at, deleted_at, created_at, updated_at)
       VALUES (:id, :tenantId, :ownerId, :agentId, :title, :description, :propertyType,
        :operationType, :status, :publicationStatus, :legalStatus, :price, :currency, :area, :areaBuilt,
        :bedrooms, :bathrooms, :parkingSpaces, :floor, :yearBuilt, :address, :city, :zone, :latitude,
        :longitude, :isFeatured, '[]', '[]', :publishedAt, NULL, :createdAt, :updatedAt)`,
      {
        id, tenantId: data.tenantId, ownerId: data.ownerId, agentId: data.agentId ?? null,
        title: data.title, description: data.description, propertyType: data.propertyType,
        operationType: data.operationType, status: data.status, publicationStatus: data.publicationStatus,
        legalStatus: data.legalStatus, price: data.price, currency: data.currency,
        area: data.areaTotal ?? 0, areaBuilt: data.areaBuilt ?? null,
        bedrooms: data.bedrooms ?? null, bathrooms: data.bathrooms ?? null,
        parkingSpaces: data.parkingSpaces ?? null, floor: data.floorNumber ?? null,
        yearBuilt: data.yearBuilt ?? null,
        address: data.address, city: data.city, zone: data.zone ?? null,
        latitude: data.latitude ?? null, longitude: data.longitude ?? null,
        isFeatured: data.isFeatured ? 1 : 0,
        publishedAt: data.publishedAt ? data.publishedAt.toISOString() : null,
        createdAt: now, updatedAt: now,
      },
    );
    return (await this.findById(id))!;
  }

  async update(id: string, data: Partial<Property>): Promise<Property> {
    const fields: string[] = [];
    const args: Record<string, unknown> = { id };

    if (data.title !== undefined) { fields.push('title = :title'); args['title'] = data.title; }
    if (data.description !== undefined) { fields.push('description = :description'); args['description'] = data.description; }
    if (data.status !== undefined) { fields.push('status = :status'); args['status'] = data.status; }
    if (data.publicationStatus !== undefined) { fields.push('publication_status = :pubStatus'); args['pubStatus'] = data.publicationStatus; }
    if (data.price !== undefined) { fields.push('price = :price'); args['price'] = data.price; }
    if (data.isFeatured !== undefined) { fields.push('is_featured = :isFeatured'); args['isFeatured'] = data.isFeatured ? 1 : 0; }
    if (data.publishedAt !== undefined) { fields.push('published_at = :publishedAt'); args['publishedAt'] = data.publishedAt.toISOString(); }
    if (data.agentId !== undefined) { fields.push('agent_id = :agentId'); args['agentId'] = data.agentId; }
    if (data.legalStatus !== undefined) { fields.push('legal_status = :legalStatus'); args['legalStatus'] = data.legalStatus; }

    fields.push('updated_at = :updatedAt');
    args['updatedAt'] = new Date().toISOString();

    await this.db.execute(`UPDATE properties SET ${fields.join(', ')} WHERE id = :id`, args);
    return (await this.findById(id))!;
  }

  async softDelete(id: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db.execute(
      'UPDATE properties SET deleted_at = :deletedAt, updated_at = :updatedAt WHERE id = :id',
      { id, deletedAt: now, updatedAt: now },
    );
  }

  async publish(id: string): Promise<Property> {
    return this.update(id, { publicationStatus: 'published', publishedAt: new Date(), status: 'active' });
  }

  async unpublish(id: string): Promise<Property> {
    return this.update(id, { publicationStatus: 'unpublished' });
  }

  async archive(id: string): Promise<Property> {
    return this.update(id, { status: 'archived', publicationStatus: 'unpublished' });
  }

  async findByOwner(ownerId: string): Promise<Property[]> {
    const res = await this.db.execute(
      'SELECT * FROM properties WHERE owner_id = :ownerId AND deleted_at IS NULL ORDER BY created_at DESC',
      { ownerId },
    );
    return res.rows.map((r) => toProperty(r as Record<string, unknown>));
  }

  async countByTenant(tenantId: string): Promise<number> {
    const res = await this.db.execute(
      'SELECT COUNT(*) as cnt FROM properties WHERE tenant_id = :tenantId AND deleted_at IS NULL',
      { tenantId },
    );
    return Number((res.rows[0] as Record<string, unknown>)['cnt'] ?? 0);
  }
}
