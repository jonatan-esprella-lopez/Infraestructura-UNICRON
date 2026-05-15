import type { ReactNode } from 'react';
import { cx } from '@shared/utils/class-name.utils';
import './Select.css';

export interface SelectProps {
  children?: ReactNode;
  className?: string;
}

export function Select({ children, className = '' }: SelectProps) {
  return <select className={cx('form-select', className)}>{children}</select>;
}
