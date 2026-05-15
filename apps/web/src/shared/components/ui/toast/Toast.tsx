import type { ReactNode } from 'react';

export interface ToastProps {
  children?: ReactNode;
  className?: string;
}

export function Toast({ children, className = '' }: ToastProps) {
  return <div className={className}>{children}</div>;
}
