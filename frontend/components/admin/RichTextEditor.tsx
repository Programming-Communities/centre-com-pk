'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const { themeColors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        suppressHydrationWarning
        style={{
          width: '100%',
          minHeight: '200px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
        }}
      />
    );
  }

  const bgColor = themeColors.surface || '#f8fafc';
  const borderColor = themeColors.border || '#e2e8f0';
  const textColor = themeColors.text?.primary || '#0f172a';

  const btnStyle = {
    background: bgColor,
    border: `1px solid ${borderColor}`,
    color: textColor,
    padding: '4px 8px',
    margin: '0 2px',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div suppressHydrationWarning>
      <div style={{ marginBottom: '8px' }}>
        <button style={btnStyle} title="Bold">B</button>
        <button style={btnStyle} title="Italic">I</button>
        <button style={btnStyle} title="Link">🔗</button>
      </div>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          minHeight: '200px',
          padding: '8px',
          background: bgColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '4px',
        }}
      />
    </div>
  );
}
