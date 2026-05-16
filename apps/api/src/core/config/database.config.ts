export const databaseConfig = {
  provider: process.env.DATABASE_PROVIDER ?? 'postgres',
  url: process.env.DATABASE_URL ?? '',
};
