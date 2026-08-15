'use client';
import { useState, useCallback } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { 
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Code, Link, Heading1, Heading2, Heading3,
  Heading4, Heading5, Heading6, Table, Image, Youtube, Undo, Redo,
  Maximize2, Minimize2, Loader2
} from 'lucide-react';
import dynamic from 'next/dynamic';

const LexicalEditor = dynamic(() => import('@/components/editor/LexicalEditor'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
      <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 16px', display: 'block' }} />
      Loading Editor...
    </div>
  ),
});

interface BlogEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  lang?: string;
  readOnly?: boolean;
  placeholder?: string;
}

export default function BlogEditor({
  initialContent = '<p></p>',
  onChange,
  lang = 'en',
  readOnly = false,
  placeholder = 'Start writing your blog post...'
}: BlogEditorProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleChange = useCallback((newContent: string, plainText: string) => {
    setWordCount(plainText.trim() ? plainText.trim().split(/\s+/).length : 0);
    setCharCount(plainText.length);
    if (onChange) onChange(newContent);
  }, [onChange]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    document.documentElement.style.overflow = isFullScreen ? '' : 'hidden';
  };

  const bg = themeColors?.background || (isDarkMode ? '#0f172a' : '#ffffff');
  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#f8fafc');
  const textSecondary = themeColors?.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors?.primary || '#3b82f6';

  return (
    <div style={{
      backgroundColor: bg,
      border: `1px solid ${border}`,
      borderRadius: '12px',
      overflow: 'hidden',
      position: isFullScreen ? 'fixed' : 'relative',
      top: isFullScreen ? 0 : 'auto',
      left: isFullScreen ? 0 : 'auto',
      right: isFullScreen ? 0 : 'auto',
      bottom: isFullScreen ? 0 : 'auto',
      zIndex: isFullScreen ? 9999 : 1,
      width: isFullScreen ? '100vw' : '100%',
      height: isFullScreen ? '100vh' : 'auto',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '8px 12px',
        borderBottom: `1px solid ${border}`, backgroundColor: surface,
        position: 'sticky', top: 0, zIndex: 10, alignItems: 'center',
      }}>
        {['bold','italic','underline','strikethrough'].map(cmd => (
          <ToolbarButton key={cmd} icon={<Bold size={16} />} command={cmd} />
        ))}
        <ToolbarDivider />
        {['h1','h2','h3'].map(cmd => (
          <ToolbarButton key={cmd} icon={<Heading1 size={16} />} command={cmd} />
        ))}
        <ToolbarDivider />
        {['bulletList','orderedList','blockquote','codeBlock'].map(cmd => (
          <ToolbarButton key={cmd} icon={<List size={16} />} command={cmd} />
        ))}
        <ToolbarDivider />
        {['alignLeft','alignCenter','alignRight'].map(cmd => (
          <ToolbarButton key={cmd} icon={<AlignLeft size={16} />} command={cmd} />
        ))}
        <ToolbarDivider />
        {['image','youtube','table','link'].map(cmd => (
          <ToolbarButton key={cmd} icon={<Image size={16} />} command={cmd} />
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={toggleFullScreen} style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', background: 'transparent', color: textSecondary, cursor: 'pointer' }}>
          {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      <div style={{ flex: 1, padding: '16px', minHeight: '400px' }}>
        <LexicalEditor initialContent={initialContent} onChange={handleChange} lang={lang} readOnly={readOnly} placeholder={placeholder} />
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', padding: '6px 16px',
        borderTop: `1px solid ${border}`, fontSize: '11px', color: textSecondary, backgroundColor: surface,
      }}>
        <span>📝 Words: {wordCount}</span>
        <span>📏 Characters: {charCount}</span>
        <span>⏱️ Read Time: {Math.max(1, Math.round(wordCount / 200))} min</span>
        <span style={{ color: primary }}>{isFullScreen ? '🔓 Fullscreen' : '📄 Normal'}</span>
      </div>
    </div>
  );
}

function ToolbarButton({ icon, command }: { icon: React.ReactNode; command: string }) {
  return (
    <button style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </button>
  );
}

function ToolbarDivider() {
  return <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0', margin: '0 2px' }} />;
}
