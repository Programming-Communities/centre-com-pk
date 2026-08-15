'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { List, ChevronUp, ChevronDown } from 'lucide-react';

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const matches = content.match(/<h2[^>]*>.*?<\/h2>/g) || [];
    const items = matches.map((h: string, i: number) => ({
      id: `heading-${i}`,
      text: h.replace(/<[^>]*>/g, ''),
      level: 2,
    }));
    setHeadings(items);
  }, [content]);

  if (headings.length < 2) return null;

  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors?.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors?.primary || '#3b82f6';

  return (
    <div style={{ border: `1px solid ${border}`, borderRadius: '10px', padding: '16px 20px', marginBottom: '24px', backgroundColor: surface }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <List size={16} style={{ color: primary }} />
          Table of Contents
        </h3>
        <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textSecondary }}>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      {isOpen && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {headings.map((item) => (
            <li key={item.id} style={{ padding: '6px 0', borderBottom: `1px solid ${border}20` }}>
              <a href={`#${item.id}`} style={{ color: primary, textDecoration: 'none', fontSize: '13px' }}>
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
