import type { ReactNode } from 'react';
import { cx } from '@shared/utils/class-name.utils';
import './Checkbox.css';

export interface CheckboxProps {
  children?: ReactNode;
  className?: string;
}

export function Checkbox({ children, className = '' }: CheckboxProps) {
  return <label className={cx('form-checkbox', className)}>{children}</label>;
}
