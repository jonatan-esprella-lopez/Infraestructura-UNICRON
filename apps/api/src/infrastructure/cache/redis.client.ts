export class RedisClient {
  isConfigured(): boolean {
    return Boolean(process.env.REDIS_URL);
  }
}
