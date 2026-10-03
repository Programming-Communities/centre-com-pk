'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Send, Save, Calendar, Clock, Eye, Settings, AlertCircle, CheckCircle } from 'lucide-react';

interface PublishPanelProps {
  status: 'draft' | 'published' | 'archived';
  onStatusChange: (status: 'draft' | 'published' | 'archived') => void;
  onPublish: () => void;
  onSave: () => void;
  onPreview: () => void;
  saving?: boolean;
}

export default function PublishPanel({
  status,
  onStatusChange,
  onPublish,
  onSave,
  onPreview,
  saving = false,
}: PublishPanelProps) {
  const { themeColors } = useTheme();
  const [scheduledDate, setScheduledDate] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const staticColors = {
    surface: '#ffffff',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
  };

  const colors = mounted ? {
    surface: themeColors?.surface || staticColors.surface,
    textPrimary: themeColors?.text?.primary || staticColors.textPrimary,
    textSecondary: themeColors?.text?.secondary || staticColors.textSecondary,
    border: themeColors?.border || staticColors.border,
    primary: themeColors?.primary || staticColors.primary,
    success: staticColors.success,
    warning: staticColors.warning,
  } : staticColors;

  return (
    <div suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div suppressHydrationWarning style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${colors.border}`, backgroundColor: colors.surface }}>
        <h4 suppressHydrationWarning style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary, marginBottom: '12px' }}>
          <Settings size={14} style={{ display: 'inline', marginRight: '6px', color: colors.primary }} />
          Publishing
        </h4>

        <div style={{ marginBottom: '12px' }}>
          <label suppressHydrationWarning style={{ fontSize: '12px', fontWeight: 600, color: colors.textSecondary, display: 'block', marginBottom: '4px' }}>Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as any)}
            suppressHydrationWarning
            style={{
              width: '100%', padding: '8px 12px', borderRadius: '8px',
              border: `1px solid ${colors.border}`, backgroundColor: 'transparent',
              color: colors.textPrimary, fontSize: '13px', outline: 'none'
            }}
          >
            <option value="draft">📄 Draft</option>
            <option value="published">🚀 Published</option>
            <option value="archived">📦 Archived</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            suppressHydrationWarning
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: '6px', border: `1px solid ${colors.border}`,
              background: 'transparent', color: colors.textSecondary, cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            <Calendar size={14} /> Schedule Publishing
          </button>
          {showSchedule && (
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              suppressHydrationWarning
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '8px',
                border: `1px solid ${colors.border}`, backgroundColor: 'transparent',
                color: colors.textPrimary, fontSize: '13px', outline: 'none',
                marginTop: '8px'
              }}
            />
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={onSave}
            disabled={saving}
            suppressHydrationWarning
            style={{
              flex: 1, padding: '10px 16px', borderRadius: '8px',
              border: `1px solid ${colors.border}`, backgroundColor: 'transparent',
              color: colors.textPrimary, cursor: 'pointer', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={onPreview}
            suppressHydrationWarning
            style={{
              padding: '10px 16px', borderRadius: '8px',
              border: `1px solid ${colors.border}`, backgroundColor: 'transparent',
              color: colors.textSecondary, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <Eye size={16} />
          </button>
          <button
            onClick={onPublish}
            disabled={saving}
            suppressHydrationWarning
            style={{
              padding: '10px 20px', borderRadius: '8px',
              border: 'none', backgroundColor: status === 'published' ? colors.warning : colors.primary,
              color: '#fff', cursor: 'pointer', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <Send size={16} /> {status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>

        {status === 'published' && (
          <div suppressHydrationWarning style={{ marginTop: '12px', padding: '10px', borderRadius: '8px', backgroundColor: `${colors.success}15`, border: `1px solid ${colors.success}30` }}>
            <p style={{ fontSize: '12px', color: colors.success, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} /> Post is published and visible to public
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
