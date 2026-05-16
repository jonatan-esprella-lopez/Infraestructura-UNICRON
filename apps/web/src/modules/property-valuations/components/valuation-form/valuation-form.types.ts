import type { LandValuationInput } from "../../types/land-valuation.types";

export interface ValuationFormProps {
  isLoading?: boolean;
  onSubmit: (input: LandValuationInput) => void | Promise<void>;
  onReset?: () => void;
}
