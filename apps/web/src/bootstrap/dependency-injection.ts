import type { Service } from '@core/interfaces/service.interface';

const services = new Map<string, Service>();

export function registerService(service: Service) {
  services.set(service.name, service);
}

export function resolveService<TService extends Service>(name: string) {
  return services.get(name) as TService | undefined;
}

export async function initializeRegisteredServices() {
  await Promise.all([...services.values()].map((service) => service.initialize?.()));
}
