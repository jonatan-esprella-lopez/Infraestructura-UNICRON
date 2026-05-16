export class BullMqClient {
  isConfigured(): boolean {
    return Boolean(process.env.REDIS_URL);
  }
}
