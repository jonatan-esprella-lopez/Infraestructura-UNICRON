import type { ReactNode } from 'react';

export interface TooltipProps {
  children?: ReactNode;
  className?: string;
}

export function Tooltip({ children, className = '' }: TooltipProps) {
  return <span className={className}>{children}</span>;
}
