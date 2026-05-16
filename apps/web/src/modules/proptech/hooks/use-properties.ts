import { useState, useEffect } from 'react';
import type { Property, PropertyFilters, PropertyListResponse } from '../types/property.types';
import { propertyService } from '../services/property.service';

export function useProperties(filters: PropertyFilters = {}) {
  const [data, setData] = useState<PropertyListResponse>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    propertyService
      .findAll(filters)
      .then(setData)
      .catch((err: unknown) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  return { properties: data.items, total: data.total, loading, error };
}

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    propertyService
      .findById(id)
      .then(setProperty)
      .catch((err: unknown) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [id]);

  return { property, loading, error };
}
