import type { InputHTMLAttributes } from 'react';
import { cx } from '@shared/utils/class-name.utils';
import './Input.css';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx('form-input', props.disabled && 'form-input--disabled', className)} {...props} />;
}
