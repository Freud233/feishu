'use client';

import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react';
import { useEffect, useId, useRef } from 'react';

/* ==========================================================================
   Material Design 3 基础组件
   全部基于原生元素 + 设计令牌，保证视觉一致、无额外运行时依赖。
   ========================================================================== */

type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text' | 'danger';

/**
 * 变体类名必须写成字面量：这些样式定义在 Tailwind 的 @layer components 中，
 * 动态拼接（如 `md-btn--${variant}`）会让摇树优化误判为未使用而移除规则。
 */
const buttonVariantClass: Record<ButtonVariant, string> = {
  filled: 'md-btn--filled',
  tonal: 'md-btn--tonal',
  outlined: 'md-btn--outlined',
  text: 'md-btn--text',
  danger: 'md-btn--danger',
};

/* ------------------------------- Icons ---------------------------------- */

type IconProps = { className?: string };

const Glyph = ({ className, children }: IconProps & { children: ReactNode }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

export const AddIcon = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </Glyph>
);

export const PlayIcon = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M8 5v14l11-7z" />
  </Glyph>
);

export const PauseIcon = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
  </Glyph>
);

export const ReplayIcon = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
  </Glyph>
);

export const LogoutIcon = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </Glyph>
);

export const CloseIcon = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </Glyph>
);

export const ChevronDownIcon = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
  </Glyph>
);

export const SunIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

export const MoonIcon = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M20.3 14.6A8.5 8.5 0 0 1 9.4 3.7a8.5 8.5 0 1 0 10.9 10.9z" />
  </Glyph>
);

export const TimerIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2.5 2M9 2h6M12 2v3" />
  </svg>
);

export const TaskIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
  </svg>
);

/* ------------------------------- Buttons -------------------------------- */

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> & {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  icon?: ReactNode;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
};

export function Button({
  variant = 'filled',
  size = 'md',
  icon,
  loading = false,
  type = 'button',
  className = '',
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`md-btn md-state ${buttonVariantClass[variant]} ${size === 'sm' ? 'md-btn--sm' : ''} ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="md-spinner" aria-hidden="true" />
      ) : icon ? (
        <span className="md-btn__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
}

type LinkButtonProps = {
  href: string;
  variant?: ButtonVariant;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function LinkButton({ href, variant = 'filled', icon, className = '', children }: LinkButtonProps) {
  return (
    <a href={href} className={`md-btn md-state ${buttonVariantClass[variant]} ${className}`}>
      {icon && (
        <span className="md-btn__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </a>
  );
}

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label: string;
  variant?: 'standard' | 'tonal';
  children: ReactNode;
};

export function IconButton({ label, variant = 'standard', className = '', children, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`md-icon-btn md-state ${variant === 'tonal' ? 'md-icon-btn--tonal' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ------------------------------- Surfaces -------------------------------- */

type CardVariant = 'filled' | 'outlined' | 'elevated' | 'hero';

// 同 Button：保持字面量，避免 @layer components 中的规则被摇树移除
const cardVariantClass: Record<CardVariant, string> = {
  filled: 'md-card--filled',
  outlined: 'md-card--outlined',
  elevated: 'md-card--elevated',
  hero: 'md-card--hero',
};

type CardProps = HTMLAttributes<HTMLElement> & {
  variant?: CardVariant;
};

export function Card({ variant = 'filled', className = '', children, ...rest }: CardProps) {
  return (
    <section className={`md-card ${cardVariantClass[variant]} ${className}`} {...rest}>
      {children}
    </section>
  );
}

export function Chip({
  children,
  variant = 'input',
  className = '',
}: {
  children: ReactNode;
  variant?: 'input' | 'assist';
  className?: string;
}) {
  return (
    <span className={`md-chip ${variant === 'assist' ? 'md-chip--assist' : ''} ${className}`}>{children}</span>
  );
}

export function LinearProgress({ value, max = 100, label }: { value: number; max?: number; label: string }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className="md-progress"
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.min(value, max)}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className="md-progress__indicator" style={{ width: `${percent}%` }} />
    </div>
  );
}

/* ------------------------------- Fields ---------------------------------- */

type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'placeholder' | 'className' | 'children'
> & {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  clearable?: boolean;
  supportingText?: string;
  className?: string;
};

export function TextField({
  label,
  value,
  onValueChange,
  clearable = false,
  supportingText,
  className = '',
  id,
  ...rest
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`md-field ${className}`}>
      <div className="md-field__box">
        <input
          {...rest}
          id={inputId}
          ref={inputRef}
          className="md-field__input"
          placeholder=" "
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
        />
        <label htmlFor={inputId} className="md-field__label">
          {label}
        </label>
        {clearable && value ? (
          <button
            type="button"
            aria-label="清空输入"
            className="md-field__clear md-state"
            onClick={() => {
              onValueChange('');
              inputRef.current?.focus();
            }}
          >
            <CloseIcon />
          </button>
        ) : null}
      </div>
      {supportingText ? <p className="md-field__supporting">{supportingText}</p> : null}
    </div>
  );
}

type SelectOption = { value: string; label: string };

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'className' | 'value'> & {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
};

export function SelectField({
  label,
  value,
  onValueChange,
  options,
  className = '',
  id,
  ...rest
}: SelectFieldProps) {
  const autoId = useId();
  const selectId = id ?? autoId;

  return (
    <div className={`md-field md-field--static ${className}`}>
      <div className="md-field__box">
        <select
          {...rest}
          id={selectId}
          className="md-field__select"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label htmlFor={selectId} className="md-field__label">
          {label}
        </label>
        <ChevronDownIcon className="md-field__chevron" />
      </div>
    </div>
  );
}

type MdCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
};

export function MdCheckbox({ checked, onChange, label, className = '' }: MdCheckboxProps) {
  return (
    <label className={`md-checkbox md-state ${checked ? 'md-checkbox--done' : ''} ${className}`}>
      <input
        type="checkbox"
        className="md-checkbox__input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="md-checkbox__box" aria-hidden="true" />
      <span className="md-checkbox__label">{label}</span>
    </label>
  );
}

/* ------------------------------- Dialog ---------------------------------- */

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions: ReactNode;
};

export function Dialog({ open, onClose, title, children, actions }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.querySelector<HTMLInputElement>('input')?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="md-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div ref={dialogRef} className="md-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId} className="md-dialog__headline">
          {title}
        </h2>
        <div className="md-dialog__body">{children}</div>
        <div className="md-dialog__actions">{actions}</div>
      </div>
    </div>
  );
}
