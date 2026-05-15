import { cx } from '@shared/utils/class-name.utils';
import { buttonVariants } from './button.variant';
import type { ButtonProps } from './Button.types';
import './Button.css';

export function Button({
  children,
  className,
  disabled,
  icon,
  isLoading = false,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(
        'btn',
        buttonVariants[variant],
        isLoading && 'btn--loading',
        disabled && 'btn--disabled',
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {icon ? <span className="btn__icon">{icon}</span> : null}
      <span className="btn__label">{children}</span>
    </button>
  );
}
