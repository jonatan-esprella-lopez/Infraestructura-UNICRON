import type { ReactNode } from 'react';

export interface ModalProps {
  children?: ReactNode;
  className?: string;
}

export function Modal({ children, className = '' }: ModalProps) {
  return <dialog className={className}>{children}</dialog>;
}
