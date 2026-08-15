'use client';
import { useState } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { ChevronRight, ChevronLeft, Settings } from 'lucide-react';

interface RightSidebarProps {
  children: React.ReactNode;
  title?: string;
}

export default function RightSidebar({ children, title = 'Settings' }: RightSidebarProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(true);

  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors?.primary || '#3b82f6';

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          right: isOpen ? '340px' : '0',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 100,
          width: '28px',
          height: '56px',
          borderRadius: '8px 0 0 8px',
          border: `1px solid ${border}`,
          borderRight: 'none',
          backgroundColor: surface,
          color: textPrimary,
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

      <div style={{
        position: 'fixed',
        right: isOpen ? '0' : '-340px',
        top: 0,
        bottom: 0,
        width: '340px',
        backgroundColor: surface,
        borderLeft: `1px solid ${border}`,
        zIndex: 99,
        padding: '20px 16px',
        overflowY: 'auto',
        transition: 'right 0.3s ease',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.05)',
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={18} style={{ color: primary }} />
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
