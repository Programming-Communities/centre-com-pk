'use client';

import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, iconPosition = 'left', containerClassName = '', className = '', ...props }, ref) => {
    const { themeColors, isDarkMode } = useTheme();

    const textPrimary = themeColors.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
    const textSecondary = themeColors.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
    const border = themeColors.border || (isDarkMode ? '#334155' : '#e2e8f0');
    const surface = themeColors.surface || (isDarkMode ? '#1e293b' : '#ffffff');
    const primary = themeColors.primary || '#3b82f6';
    const errorColor = '#ef4444';

    const hasError = !!error;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium mb-1.5" style={{ color: textSecondary }}>
            {label}
            {props.required && <span className="ml-1" style={{ color: errorColor }}>*</span>}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: textSecondary }}>
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full rounded-xl border bg-transparent
              px-4 py-2.5 text-sm
              placeholder:text-text-secondary/50
              focus:outline-none focus:ring-2
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all duration-200
              ${icon && iconPosition === 'left' ? 'pl-10' : ''}
              ${icon && iconPosition === 'right' ? 'pr-10' : ''}
              ${hasError ? 'border-red-500 focus:ring-red-500/30' : 'focus:ring-primary/30'}
              ${className}
            `}
            style={{
              backgroundColor: surface,
              borderColor: hasError ? errorColor : border,
              color: textPrimary,
              '--tw-ring-color': hasError ? errorColor : primary,
            } as React.CSSProperties}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: textSecondary }}>
              {icon}
            </span>
          )}
        </div>
        {hasError && (
          <p className="mt-1 text-xs" style={{ color: errorColor }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
