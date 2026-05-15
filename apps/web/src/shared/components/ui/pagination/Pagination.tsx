import type { ReactNode } from 'react';

export interface PaginationProps {
  children?: ReactNode;
  className?: string;
}

export function Pagination({ children, className = '' }: PaginationProps) {
  return <nav className={className}>{children}</nav>;
}
