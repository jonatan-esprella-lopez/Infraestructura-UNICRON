export function tenantCacheKey(tenantId: string, key: string): string {
  return `tenant:${tenantId}:${key}`;
}
