import type { ReactNode } from 'react';
import { cx } from '@shared/utils/class-name.utils';
import './Avatar.css';

export interface AvatarProps {
  children?: ReactNode;
  className?: string;
}

export function Avatar({ children, className = '' }: AvatarProps) {
  return <span className={cx('ui-avatar', className)}>{children}</span>;
}
