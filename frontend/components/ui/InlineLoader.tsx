'use client';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface InlineLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function InlineLoader({ size = 'md', text }: InlineLoaderProps) {
  const { themeColors, isDarkMode, fontFamily } = useTheme();
  const primary = themeColors.primary || (isDarkMode ? '#3b82f6' : '#2563eb');
  const secondary = themeColors.secondary || (isDarkMode ? '#8b5cf6' : '#7c3aed');
  const textSecondary = themeColors.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');

  const sizes = { sm: 18, md: 28, lg: 40 };
  const borders = { sm: 2, md: 3, lg: 4 };

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '10px',
      padding: '6px 14px', fontFamily: fontFamily || 'system-ui, sans-serif'
    }}>
      {/* Spinner */}
      <div style={{
        width: sizes[size] + 'px', height: sizes[size] + 'px',
        borderRadius: '50%',
        border: borders[size] + 'px solid transparent',
        borderTopColor: primary,
        borderRightColor: secondary,
        animation: 'inline-spin 0.7s linear infinite',
        flexShrink: 0
      }} />
      
      {/* Text */}
      {text && (
        <span style={{
          fontSize: size === 'sm' ? '12px' : '13px',
          color: textSecondary, fontWeight: 500
        }}>
          {text}
        </span>
      )}

      <style>{`
        @keyframes inline-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
