'use client';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { History, Clock, CheckCircle, Edit3 } from 'lucide-react';

interface HistoryEntry {
  version: number;
  date: string;
  changes: string;
  user: string;
}

interface PostHistoryProps {
  history: HistoryEntry[];
}

export default function PostHistory({ history }: PostHistoryProps) {
  const { themeColors } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const staticColors = {
    surface: '#ffffff',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    primary: '#3b82f6',
  };

  const colors = mounted ? {
    surface: themeColors?.surface || staticColors.surface,
    textPrimary: themeColors?.text?.primary || staticColors.textPrimary,
    textSecondary: themeColors?.text?.secondary || staticColors.textSecondary,
    border: themeColors?.border || staticColors.border,
    primary: themeColors?.primary || staticColors.primary,
  } : staticColors;

  if (history.length === 0) {
    return (
      <div suppressHydrationWarning style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${colors.border}`, backgroundColor: colors.surface, textAlign: 'center' }}>
        <History size={24} style={{ color: colors.textSecondary, margin: '0 auto 8px', display: 'block' }} />
        <p style={{ fontSize: '13px', color: colors.textSecondary }}>No history yet</p>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${colors.border}`, backgroundColor: colors.surface }}>
      <h4 suppressHydrationWarning style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary, marginBottom: '12px' }}>
        <History size={14} style={{ display: 'inline', marginRight: '6px', color: colors.primary }} />
        Revision History
      </h4>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {history.map((entry) => (
          <div key={entry.version} suppressHydrationWarning style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: `1px solid ${colors.border}20` }}>
            <span style={{ fontWeight: 600, color: colors.primary, fontSize: '12px' }}>v{entry.version}</span>
            <span suppressHydrationWarning style={{ fontSize: '12px', color: colors.textSecondary }}>{mounted ? new Date(entry.date).toLocaleString() : entry.date}</span>
            <span suppressHydrationWarning style={{ fontSize: '12px', color: colors.textSecondary, flex: 1 }}>{entry.changes}</span>
            <span suppressHydrationWarning style={{ fontSize: '11px', color: colors.textSecondary }}>by {entry.user}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
