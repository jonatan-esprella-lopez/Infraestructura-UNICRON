import type { ReactNode } from 'react';

export interface SwitchProps {
  children?: ReactNode;
  className?: string;
}

export function Switch({ children, className = '' }: SwitchProps) {
  return <label className={className}>{children}</label>;
}
