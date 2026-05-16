import type { ReactNode } from 'react';
import { cx } from '@shared/utils/class-name.utils';
import './DataGrid.css';

export interface DataGridProps {
  children?: ReactNode;
  className?: string;
}

export function DataGrid({ children, className = '' }: DataGridProps) {
  return <div className={cx('data-grid', className)}>{children}</div>;
}
