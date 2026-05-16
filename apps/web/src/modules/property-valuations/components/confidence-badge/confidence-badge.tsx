import type { ConfidenceLevel } from "../../types/land-valuation.types";
import "./confidence-badge.css";

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
}

const LEVEL_MAP = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

export function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  return (
    <span className={`confidence-badge confidence-badge--${level}`}>
      Confianza {LEVEL_MAP[level]}
    </span>
  );
}
