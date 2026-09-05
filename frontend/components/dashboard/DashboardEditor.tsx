'use client';

import { useState, useEffect, useRef } from 'react';

interface DashboardEditorProps {
  documentId?: string;
  initialTitle?: string;
  initialContent?: string;
  onSave?: (data: { title: string; content: string; plainText: string }) => void;
  readOnly?: boolean;
}

export default function DashboardEditor({ 
  documentId, 
  initialTitle = '', 
  initialContent = '',
  onSave,
  readOnly = false 
}: DashboardEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSave = () => {
    if (!onSave) return;
    setIsSaving(true);
    
    onSave({
      title: title || 'Untitled',
      content,
      plainText: content,
    });
    
    setLastSaved(new Date().toLocaleTimeString());
    setIsSaving(false);
  };

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, content]);

  // Quick insert toolbar actions
  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = before + selectedText + after;
    
    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selectedText.length;
    }, 0);
  };

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  const toolbarButtons = [
    { label: 'B', title: 'Bold', action: () => insertText('**', '**') },
    { label: 'I', title: 'Italic', action: () => insertText('*', '*') },
    { label: 'U', title: 'Underline', action: () => insertText('__', '__') },
    { label: 'H1', title: 'Heading 1', action: () => insertText('# ', '') },
    { label: 'H2', title: 'Heading 2', action: () => insertText('## ', '') },
    { label: 'H3', title: 'Heading 3', action: () => insertText('### ', '') },
    { label: '•', title: 'Bullet List', action: () => insertText('- ', '') },
    { label: '1.', title: 'Numbered List', action: () => insertText('1. ', '') },
    { label: '"', title: 'Quote', action: () => insertText('> ', '') },
    { label: '</>', title: 'Code', action: () => insertText('`', '`') },
    { label: '—', title: 'Divider', action: () => insertText('\n---\n', '') },
  ];

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`} style={{ backgroundColor: 'var(--background)' }}>
      {/* TOOLBAR */}
      <div className="flex items-center justify-between gap-2 p-3 border-b flex-wrap" 
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Document Title..."
          className="flex-1 min-w-[120px] text-base font-bold bg-transparent border-none outline-none px-2"
          style={{ color: 'var(--text-primary)' }}
        />
        <div className="flex items-center gap-1.5">
          {lastSaved && (
            <span className="text-xs hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
              Saved {lastSaved}
            </span>
          )}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md text-xs"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            title="Toggle fullscreen"
          >
            {isFullscreen ? '✕' : '⛶'}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {isSaving ? 'Saving...' : '💾 Save'}
          </button>
        </div>
      </div>

      {/* FORMATTING TOOLBAR */}
      <div className="flex items-center gap-1 p-2 border-b flex-wrap" 
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
        {toolbarButtons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            className="px-2.5 py-1 rounded text-xs font-bold transition-colors"
            style={{ 
              color: 'var(--text-secondary)', 
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            title={btn.title}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* EDITOR TEXTAREA */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleContentChange}
        readOnly={readOnly}
        placeholder="Start writing your document... (Ctrl+S to save)"
        className="flex-1 w-full p-4 text-sm resize-none focus:outline-none"
        style={{ 
          minHeight: isFullscreen ? 'calc(100vh - 140px)' : '400px',
          backgroundColor: 'var(--background)',
          color: 'var(--text-primary)',
          lineHeight: 1.7,
          border: 'none',
        }}
      />

      {/* STATS BAR */}
      <div className="flex items-center gap-3 p-2 text-xs flex-wrap border-t"
        style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
        <span>📄 {charCount} chars</span>
        <span>📝 {wordCount} words</span>
        <span className="ml-auto hidden sm:block">Ctrl+S to save</span>
      </div>
    </div>
  );
}
