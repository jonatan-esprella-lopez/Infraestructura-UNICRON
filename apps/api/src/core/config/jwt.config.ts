export const jwtConfig = {
  accessTokenTtlSeconds: Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 900),
  issuer: process.env.JWT_ISSUER ?? 'unicron-api',
  refreshTokenTtlSeconds: Number(process.env.JWT_REFRESH_TTL_SECONDS ?? 2_592_000),
  secret: process.env.JWT_SECRET ?? 'development-only-secret',
};
