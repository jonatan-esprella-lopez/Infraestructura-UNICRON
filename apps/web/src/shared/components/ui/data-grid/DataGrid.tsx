import type { ReactNode } from 'react';

export interface DataGridProps {
  children?: ReactNode;
  className?: string;
}

export function DataGrid({ children, className = '' }: DataGridProps) {
  return <div className={className}>{children}</div>;
}
