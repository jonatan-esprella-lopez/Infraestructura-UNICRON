export interface JwtPayload {
  permissions: string[];
  roles: string[];
  sessionId: string;
  sub: string;
  tenantId?: string;
}

export interface RefreshTokenSession {
  expiresAt: string;
  id: string;
  revokedAt?: string;
  userId: string;
}
