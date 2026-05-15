import type { ReactNode } from 'react';
import { cx } from '@shared/utils/class-name.utils';
import './Toast.css';

export interface ToastProps {
  children?: ReactNode;
  className?: string;
}

export function Toast({ children, className = '' }: ToastProps) {
  return <div className={cx('ui-toast', className)}>{children}</div>;
}
