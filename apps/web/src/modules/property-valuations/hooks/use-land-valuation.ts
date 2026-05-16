import { useMemo, useState } from "react";
import type {
  LandValuationInput,
  LandValuationResult,
} from "../types/land-valuation.types";
import { MockLandValuationRepository } from "../repositories/mock-land-valuation.repository";
import { LandValuationService } from "../services/land-valuation.service";

interface UseLandValuationState {
  result: LandValuationResult | null;
  isLoading: boolean;
  error: string | null;
}

export function useLandValuation() {
  const [state, setState] = useState<UseLandValuationState>({
    result: null,
    isLoading: false,
    error: null,
  });

  const service = useMemo(() => {
    // using mock as requested
    const repository = new MockLandValuationRepository();
    return new LandValuationService(repository);
  }, []);

  const estimate = async (input: LandValuationInput) => {
    setState({
      result: null,
      isLoading: true,
      error: null,
    });

    try {
      const result = await service.estimate(input);

      setState({
        result,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        result: null,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado.",
      });
    }
  };

  const reset = () => {
    setState({
      result: null,
      isLoading: false,
      error: null,
    });
  };

  return {
    ...state,
    estimate,
    reset,
  };
}
