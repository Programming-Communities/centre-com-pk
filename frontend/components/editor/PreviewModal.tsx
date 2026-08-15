'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { X, Code, Eye, Copy, Check } from 'lucide-react';
import { renderContent } from '@/lib/content-renderer';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  title: string;
  lang?: string;
}

export default function PreviewModal({ isOpen, onClose, content, title, lang = 'en' }: PreviewModalProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [viewMode, setViewMode] = useState<'preview' | 'html'>('preview');
  const [copied, setCopied] = useState(false);

  const bg = themeColors?.background || (isDarkMode ? '#0f172a' : '#ffffff');
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors?.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors?.primary || '#3b82f6';

  // ✅ RENDER CONTENT TO HTML
  const htmlContent = renderContent(content, 'auto');
  
  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
      <div style={{ backgroundColor: bg, borderRadius: '16px', maxWidth: '900px', width: '100%', maxHeight: '90vh', overflow: 'hidden', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${border}` }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: textPrimary, margin: 0 }}>👁️ Preview — {title || 'Post'}</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setViewMode('preview')}
              style={{ padding: '4px 12px', borderRadius: '6px', border: `1px solid ${viewMode === 'preview' ? primary : border}`, backgroundColor: viewMode === 'preview' ? `${primary}15` : 'transparent', color: viewMode === 'preview' ? primary : textSecondary, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Eye size={14} /> Preview
            </button>
            <button
              onClick={() => setViewMode('html')}
              style={{ padding: '4px 12px', borderRadius: '6px', border: `1px solid ${viewMode === 'html' ? primary : border}`, backgroundColor: viewMode === 'html' ? `${primary}15` : 'transparent', color: viewMode === 'html' ? primary : textSecondary, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Code size={14} /> HTML
            </button>
            <button onClick={handleCopy} style={{ padding: '4px 8px', borderRadius: '6px', border: `1px solid ${border}`, backgroundColor: 'transparent', color: textSecondary, cursor: 'pointer' }} title="Copy HTML">
              {copied ? <Check size={16} style={{ color: '#10b981' }} /> : <Copy size={16} />}
            </button>
            <button onClick={onClose} style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', overflowY: 'auto', maxHeight: 'calc(90vh - 80px)' }}>
          {viewMode === 'preview' ? (
            <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : (
            <pre style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9', padding: '16px', borderRadius: '8px', overflow: 'auto', fontSize: '13px', fontFamily: 'monospace', color: textPrimary, maxHeight: '500px' }}>
              <code>{htmlContent}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
