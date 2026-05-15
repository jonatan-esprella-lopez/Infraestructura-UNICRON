import type { MetricsLike } from '../../core/types/api.types.js';

export class MetricsService implements MetricsLike {
  private readonly counters = new Map<string, number>();
  private readonly observations = new Map<string, number[]>();
  private readonly startedAt = Date.now();

  increment(name: string, labels?: Record<string, string>): void {
    const key = metricKey(name, labels);
    this.counters.set(key, (this.counters.get(key) ?? 0) + 1);
  }

  observe(name: string, value: number, labels?: Record<string, string>): void {
    const key = metricKey(name, labels);
    const values = this.observations.get(key) ?? [];
    values.push(value);
    this.observations.set(key, values.slice(-100));
  }

  snapshot(): Record<string, unknown> {
    return {
      counters: Object.fromEntries(this.counters.entries()),
      observations: Object.fromEntries(
        [...this.observations.entries()].map(([key, values]) => [key, summarize(values)]),
      ),
      uptimeSeconds: Math.round((Date.now() - this.startedAt) / 1000),
    };
  }
}

function metricKey(name: string, labels?: Record<string, string>): string {
  if (!labels || Object.keys(labels).length === 0) {
    return name;
  }

  return `${name}{${Object.entries(labels)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join(',')}}`;
}

function summarize(values: number[]): Record<string, number> {
  const count = values.length;
  const sum = values.reduce((total, value) => total + value, 0);

  return {
    avg: count ? sum / count : 0,
    count,
    max: count ? Math.max(...values) : 0,
    min: count ? Math.min(...values) : 0,
  };
}
