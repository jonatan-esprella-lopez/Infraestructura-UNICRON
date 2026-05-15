import type { ReactNode } from 'react';
import { cx } from '@shared/utils/class-name.utils';
import './Dropdown.css';

export interface DropdownProps {
  children?: ReactNode;
  className?: string;
}

export function Dropdown({ children, className = '' }: DropdownProps) {
  return <div className={cx('ui-dropdown', className)}>{children}</div>;
}
