'use client';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
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
  const { themeColors, isDarkMode } = useTheme();

  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors?.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors?.primary || '#3b82f6';

  if (history.length === 0) {
    return (
      <div style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${border}`, backgroundColor: surface, textAlign: 'center' }}>
        <History size={24} style={{ color: textSecondary, margin: '0 auto 8px', display: 'block' }} />
        <p style={{ fontSize: '13px', color: textSecondary }}>No history yet</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${border}`, backgroundColor: surface }}>
      <h4 style={{ fontSize: '14px', fontWeight: 600, color: textPrimary, marginBottom: '12px' }}>
        <History size={14} style={{ display: 'inline', marginRight: '6px', color: primary }} />
        Revision History
      </h4>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {history.map((entry) => (
          <div key={entry.version} style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: `1px solid ${border}20` }}>
            <span style={{ fontWeight: 600, color: primary, fontSize: '12px' }}>v{entry.version}</span>
            <span style={{ fontSize: '12px', color: textSecondary }}>{new Date(entry.date).toLocaleString()}</span>
            <span style={{ fontSize: '12px', color: textSecondary, flex: 1 }}>{entry.changes}</span>
            <span style={{ fontSize: '11px', color: textSecondary }}>by {entry.user}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
