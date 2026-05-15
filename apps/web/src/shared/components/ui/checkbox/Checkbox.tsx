import type { ReactNode } from 'react';

export interface CheckboxProps {
  children?: ReactNode;
  className?: string;
}

export function Checkbox({ children, className = '' }: CheckboxProps) {
  return <label className={className}>{children}</label>;
}
