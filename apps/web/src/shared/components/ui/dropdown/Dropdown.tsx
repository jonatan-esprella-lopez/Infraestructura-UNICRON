import type { ReactNode } from 'react';

export interface DropdownProps {
  children?: ReactNode;
  className?: string;
}

export function Dropdown({ children, className = '' }: DropdownProps) {
  return <div className={className}>{children}</div>;
}
