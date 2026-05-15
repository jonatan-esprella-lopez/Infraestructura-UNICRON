import type { ReactNode } from 'react';

export interface SelectProps {
  children?: ReactNode;
  className?: string;
}

export function Select({ children, className = '' }: SelectProps) {
  return <select className={className}>{children}</select>;
}
