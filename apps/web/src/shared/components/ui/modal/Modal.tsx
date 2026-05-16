import type { ReactNode } from 'react';
import { cx } from '@shared/utils/class-name.utils';
import './Modal.css';

export interface ModalProps {
  children?: ReactNode;
  className?: string;
}

export function Modal({ children, className = '' }: ModalProps) {
  return <dialog className={cx('ui-modal', className)}>{children}</dialog>;
}
