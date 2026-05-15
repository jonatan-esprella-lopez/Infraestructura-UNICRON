import type { ReactNode } from 'react';

export interface AvatarProps {
  children?: ReactNode;
  className?: string;
}

export function Avatar({ children, className = '' }: AvatarProps) {
  return <span className={className}>{children}</span>;
}
