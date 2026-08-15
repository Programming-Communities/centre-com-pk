'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const { themeColors, isDarkMode } = useTheme();

  const variantStyles: Record<string, { bg: string; hover: string; text: string; border: string }> = {
    primary: {
      bg: themeColors.primary || '#3b82f6',
      hover: themeColors.secondary || '#2563eb',
      text: '#ffffff',
      border: 'transparent',
    },
    secondary: {
      bg: themeColors.secondary || '#64748b',
      hover: themeColors.text?.secondary || '#475569',
      text: '#ffffff',
      border: 'transparent',
    },
    outline: {
      bg: 'transparent',
      hover: themeColors.primary + '15',
      text: themeColors.primary || '#3b82f6',
      border: themeColors.primary || '#3b82f6',
    },
    ghost: {
      bg: 'transparent',
      hover: isDarkMode ? '#1e293b' : '#f1f5f9',
      text: themeColors.text?.primary || '#0f172a',
      border: 'transparent',
    },
    danger: {
      bg: '#ef4444',
      hover: '#dc2626',
      text: '#ffffff',
      border: 'transparent',
    },
    success: {
      bg: '#10b981',
      hover: '#059669',
      text: '#ffffff',
      border: 'transparent',
    },
    warning: {
      bg: '#f59e0b',
      hover: '#d97706',
      text: '#000000',
      border: 'transparent',
    },
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  const style = variantStyles[variant];

  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-xl
        transition-all duration-200 ease-in-out
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'}
        ${className}
      `}
      style={{
        backgroundColor: isDisabled ? (isDarkMode ? '#1e293b' : '#e2e8f0') : style.bg,
        color: isDisabled ? (isDarkMode ? '#94a3b8' : '#64748b') : style.text,
        border: `1px solid ${style.border}`,
      }}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
}
