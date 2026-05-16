import type { ReactNode } from 'react';
import { cx } from '@shared/utils/class-name.utils';
import './Textarea.css';

export interface TextareaProps {
  children?: ReactNode;
  className?: string;
}

export function Textarea({ children, className = '' }: TextareaProps) {
  return <textarea className={cx('form-textarea', className)}>{children}</textarea>;
}
