import type { ReactNode } from 'react';
import { cx } from '@shared/utils/class-name.utils';
import './Switch.css';

export interface SwitchProps {
  children?: ReactNode;
  className?: string;
}

export function Switch({ children, className = '' }: SwitchProps) {
  return <label className={cx('form-switch', className)}>{children}</label>;
}
