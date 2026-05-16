import type { ReactNode } from 'react';
import { cx } from '@shared/utils/class-name.utils';
import './Pagination.css';

export interface PaginationProps {
  children?: ReactNode;
  className?: string;
}

export function Pagination({ children, className = '' }: PaginationProps) {
  return <nav className={cx('ui-pagination', className)}>{children}</nav>;
}
