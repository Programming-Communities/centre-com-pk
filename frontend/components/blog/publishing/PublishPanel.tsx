'use client';
import { useState } from 'react';
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
  const { themeColors, isDarkMode } = useTheme();
  const [scheduledDate, setScheduledDate] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);

  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors?.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors?.primary || '#3b82f6';
  const success = '#10b981';
  const warning = '#f59e0b';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${border}`, backgroundColor: surface }}>
        <h4 style={{ fontSize: '14px', fontWeight: 600, color: textPrimary, marginBottom: '12px' }}>
          <Settings size={14} style={{ display: 'inline', marginRight: '6px', color: primary }} />
          Publishing
        </h4>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: textSecondary, display: 'block', marginBottom: '4px' }}>Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as any)}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: '8px',
              border: `1px solid ${border}`, backgroundColor: 'transparent',
              color: textPrimary, fontSize: '13px', outline: 'none'
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
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: '6px', border: `1px solid ${border}`,
              background: 'transparent', color: textSecondary, cursor: 'pointer',
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
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '8px',
                border: `1px solid ${border}`, backgroundColor: 'transparent',
                color: textPrimary, fontSize: '13px', outline: 'none',
                marginTop: '8px'
              }}
            />
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={onSave}
            disabled={saving}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: '8px',
              border: `1px solid ${border}`, backgroundColor: 'transparent',
              color: textPrimary, cursor: 'pointer', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={onPreview}
            style={{
              padding: '10px 16px', borderRadius: '8px',
              border: `1px solid ${border}`, backgroundColor: 'transparent',
              color: textSecondary, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <Eye size={16} />
          </button>
          <button
            onClick={onPublish}
            disabled={saving}
            style={{
              padding: '10px 20px', borderRadius: '8px',
              border: 'none', backgroundColor: status === 'published' ? warning : primary,
              color: '#fff', cursor: 'pointer', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <Send size={16} /> {status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>

        {status === 'published' && (
          <div style={{ marginTop: '12px', padding: '10px', borderRadius: '8px', backgroundColor: `${success}15`, border: `1px solid ${success}30` }}>
            <p style={{ fontSize: '12px', color: success, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} /> Post is published and visible to public
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
