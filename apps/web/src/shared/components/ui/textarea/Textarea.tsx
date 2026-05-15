import type { ReactNode } from 'react';

export interface TextareaProps {
  children?: ReactNode;
  className?: string;
}

export function Textarea({ children, className = '' }: TextareaProps) {
  return <textarea className={className}>{children}</textarea>;
}
