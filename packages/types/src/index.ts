export interface TenantScoped {
  tenantId?: string;
}

export interface ApiEnvelope<TData> {
  data: TData;
  requestId?: string;
}

export type EntityId = string;
