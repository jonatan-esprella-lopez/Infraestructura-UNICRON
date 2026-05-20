import { useState } from 'react';
import type { ContractAiReview } from '../types/property-contract.types';
import { propertyContractService } from '../services/property-contract.service';

export function usePropertyContractReview() {
  const [review, setReview] = useState<ContractAiReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

<<<<<<< HEAD
  const reviewWithAi = async (draftText: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await propertyContractService.reviewTextWithAi(draftText);
=======
  const reviewWithAi = async (contractId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await propertyContractService.reviewWithAi(contractId);
>>>>>>> origin/exp/pres
      setReview(data);
      return data;
    } catch (err) {
      setError(String(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { review, loading, error, reviewWithAi };
}
