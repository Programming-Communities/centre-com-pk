'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hoverable = false,
  onClick,
}: CardProps) {
  const { themeColors, isDarkMode } = useTheme();

  const variantStyles = {
    default: {
      bg: themeColors.surface || (isDarkMode ? '#1e293b' : '#ffffff'),
      border: themeColors.border || (isDarkMode ? '#334155' : '#e2e8f0'),
      shadow: '0 1px 3px rgba(0,0,0,0.06)',
    },
    elevated: {
      bg: themeColors.surface || (isDarkMode ? '#1e293b' : '#ffffff'),
      border: themeColors.border || (isDarkMode ? '#334155' : '#e2e8f0'),
      shadow: '0 8px 30px rgba(0,0,0,0.08)',
    },
    outlined: {
      bg: 'transparent',
      border: themeColors.border || (isDarkMode ? '#334155' : '#e2e8f0'),
      shadow: 'none',
    },
    glass: {
      bg: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.6)',
      border: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      shadow: '0 4px 20px rgba(0,0,0,0.05)',
    },
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-7',
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`
        rounded-xl transition-all duration-200
        ${paddingStyles[padding]}
        ${hoverable ? 'hover:scale-[1.01] hover:shadow-xl cursor-pointer' : ''}
        ${className}
      `}
      style={{
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        boxShadow: style.shadow,
        backdropFilter: variant === 'glass' ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: variant === 'glass' ? 'blur(12px)' : 'none',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { themeColors } = useTheme();
  return (
    <h3 className={`text-lg sm:text-xl font-bold ${className}`} style={{ color: themeColors.text?.primary }}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { themeColors } = useTheme();
  return (
    <p className={`text-sm ${className}`} style={{ color: themeColors.text?.secondary }}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mt-4 pt-4 border-t ${className}`} style={{ borderColor: 'var(--border)' }}>{children}</div>;
}
