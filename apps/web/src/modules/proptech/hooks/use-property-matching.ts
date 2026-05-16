import { useState } from 'react';
import type { MatchingResponse, ClientPreference } from '../types/property-matching.types';
import { propertyMatchingService } from '../services/property-matching.service';

export function usePropertyMatching() {
  const [result, setResult] = useState<MatchingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runMatching = async (clientId: string, preference: ClientPreference) => {
    setLoading(true);
    setError(null);
    try {
      const data = await propertyMatchingService.matchClient(clientId, preference);
      setResult(data);
      return data;
    } catch (err) {
      setError(String(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async (clientId: string) => {
    setLoading(true);
    try {
      const data = await propertyMatchingService.getRecommendations(clientId);
      setResult(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, runMatching, loadRecommendations };
}
