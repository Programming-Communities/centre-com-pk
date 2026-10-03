'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { ChevronRight, ChevronLeft, Settings } from 'lucide-react';

interface RightSidebarProps {
  children: React.ReactNode;
  title?: string;
}

export default function RightSidebar({ children, title = 'Settings' }: RightSidebarProps) {
  const { themeColors } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const staticColors = {
    surface: '#ffffff',
    textPrimary: '#0f172a',
    border: '#e2e8f0',
    primary: '#3b82f6',
  };

  const colors = mounted ? {
    surface: themeColors?.surface || staticColors.surface,
    textPrimary: themeColors?.text?.primary || staticColors.textPrimary,
    border: themeColors?.border || staticColors.border,
    primary: themeColors?.primary || staticColors.primary,
  } : staticColors;

  return (
    <div suppressHydrationWarning style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        suppressHydrationWarning
        style={{
          position: 'fixed',
          right: isOpen ? '340px' : '0',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 100,
          width: '28px',
          height: '56px',
          borderRadius: '8px 0 0 8px',
          border: `1px solid ${colors.border}`,
          borderRight: 'none',
          backgroundColor: colors.surface,
          color: colors.textPrimary,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'right 0.3s ease',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.05)',
        }}
      >
        {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <div suppressHydrationWarning style={{
        position: 'fixed',
        right: isOpen ? '0' : '-340px',
        top: 0,
        bottom: 0,
        width: '340px',
        backgroundColor: colors.surface,
        borderLeft: `1px solid ${colors.border}`,
        zIndex: 99,
        padding: '20px 16px',
        overflowY: 'auto',
        transition: 'right 0.3s ease',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.05)',
      }}>
        <h2 suppressHydrationWarning style={{ fontSize: '16px', fontWeight: 700, color: colors.textPrimary, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={18} style={{ color: colors.primary }} />
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
