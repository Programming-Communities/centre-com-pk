
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { 
  Copy, RotateCcw, Eye, EyeOff, CheckCircle, AlertCircle, X,
  Bold, Italic, Link, Code, List, ListOrdered, Quote,
  Heading1, Heading2, Heading3, Table, Image, Download,
  Trash2, RefreshCw, Save, FileText, Maximize2, Minimize2,
  Database, Settings
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';
import { sanitizeHtml } from '@/lib/sanitize';

// Types
interface MarkdownHistory {
  id: number;
  timestamp: string;
  contentLength: number;
  wordCount: number;
}

export default function MarkdownEditorClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'text-tools' });
  const [mounted, setMounted] = useState(false);
  
  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `markdown_editor.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // Default markdown content
  const defaultMarkdown = `# ${t('welcome', 'Welcome to Markdown Editor')}

## ${t('features_title', 'Features')}
- **${t('bold', 'Bold text')}**
- *${t('italic', 'Italic text')}*
- \`${t('inline_code', 'Inline code')}\`
- [${t('links', 'Links')}](https://www.centre.com.pk)

## ${t('code_block', 'Code Block')}
\`\`\`javascript
function hello() {
  console.log("${t('hello_world', 'Hello, World!')}");
}
\`\`\`

## ${t('lists', 'Lists')}
1. ${t('first_item', 'First item')}
2. ${t('second_item', 'Second item')}
3. ${t('third_item', 'Third item')}

> ${t('blockquote', 'This is a blockquote')}

## ${t('tables', 'Tables')}
| ${t('header1', 'Header 1')} | ${t('header2', 'Header 2')} |
|-------------------------|-------------------------|
| ${t('cell1', 'Cell 1')} | ${t('cell2', 'Cell 2')} |
`;

  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [html, setHtml] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'html' | 'history'>('editor');
  const [history, setHistory] = useState<MarkdownHistory[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Convert markdown to HTML
  useEffect(() => {
    convertMarkdownToHtml();
    updateStats();
  }, [markdown]);

  useEffect(() => {
    setMounted(true);
    loadHistory();
  }, []);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
        setCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('markdown-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const saveToHistory = () => {
    if (markdown === defaultMarkdown) return;
    
    const entry: MarkdownHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      contentLength: markdown.length,
      wordCount: wordCount,
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('markdown-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to history:', e);
    }
  };

  const convertMarkdownToHtml = () => {
    let converted = markdown;
    
    // Escape HTML special characters first
    converted = converted.replace(/&/g, '&amp;');
    converted = converted.replace(/</g, '&lt;');
    converted = converted.replace(/>/g, '&gt;');
    
    // Headers
    converted = converted.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>');
    converted = converted.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-5 mb-3">$1</h2>');
    converted = converted.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>');
    
    // Bold and Italic
    converted = converted.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
    converted = converted.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    converted = converted.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    
    // Links
    converted = converted.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Images
    converted = converted.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" />');
    
    // Inline code
    converted = converted.replace(/`(.*?)`/gim, '<code class="px-1.5 py-0.5 rounded text-sm font-mono" style="background-color: ${themeColors.primary}10">$1</code>');
    
    // Code blocks
    converted = converted.replace(/```(\w*)\n([^`]+)```/gim, '<pre class="p-4 rounded-lg overflow-x-auto text-sm font-mono my-3" style="background-color: ${themeColors.primary}10"><code class="language-$1">$2</code></pre>');
    
    // Blockquotes
    converted = converted.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 pl-4 italic my-3" style="border-left-color: ${themeColors.primary}">$1</blockquote>');
    
    // Tables
    converted = converted.replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(cell => cell.trim());
      if (cells[0]?.includes('-')) return match;
      return `<tr>${cells.map(cell => `<td class="border px-3 py-1">${cell.trim()}</td>`).join('')}</tr>`;
    });
    
    // Lists
    converted = converted.replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>');
    converted = converted.replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>');
    converted = converted.replace(/^\d\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>');
    
    // Wrap lists
    converted = converted.replace(/(<li.*<\/li>)/gs, '<ul class="list-disc my-2">$1</ul>');
    
    // Horizontal rule
    converted = converted.replace(/^---$/gim, '<hr class="my-4" style="border-color: ${themeColors.border}" />');
    
    // Paragraphs
    converted = converted.replace(/^(?!<[^>]+>)(.+)$/gm, '<p class="my-2 leading-relaxed">$1</p>');
    
    // Line breaks
    converted = converted.replace(/\n$/gim, '<br />');
    
    setHtml(converted);
  };

  const updateStats = () => {
    const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(markdown.length);
  };

  const copyToClipboard = async (text: string, type: string) => {
    if (!text) {
      setError(t('no_text', 'No text to copy'));
      return;
    }
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setSuccessMessage(t('copied', `✓ ${type} copied to clipboard!`));
    } catch (err) {
      setError(t('copy_failed', 'Failed to copy text'));
    }
  };

  const downloadMarkdown = () => {
    if (!markdown) return;
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `markdown-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMessage(t('downloaded', '✓ File downloaded successfully!'));
  };

  const downloadHtml = () => {
    if (!html) return;
    
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Preview</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; padding: 2rem; max-width: 800px; margin: 0 auto; }
    h1 { color: ${themeColors.primary}; }
    code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 4px; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 8px; overflow-x: auto; }
    blockquote { border-left: 4px solid ${themeColors.primary}; margin: 1rem 0; padding-left: 1rem; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 0.5rem; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `markdown-preview-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMessage(t('downloaded', '✓ HTML file downloaded successfully!'));
  };

  const resetEditor = () => {
    setMarkdown(defaultMarkdown);
    setSuccessMessage(t('reset', '✓ Editor reset to default!'));
  };

  const clearEditor = () => {
    setMarkdown('');
    setSuccessMessage(t('cleared', '✓ Editor cleared!'));
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('saved-markdown', markdown);
    saveToHistory();
    setSuccessMessage(t('saved', '✓ Content saved locally!'));
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('saved-markdown');
    if (saved) {
      setMarkdown(saved);
      setSuccessMessage(t('loaded', '✓ Saved content loaded!'));
    } else {
      setError(t('no_saved', 'No saved content found'));
    }
  };

  const insertText = (syntax: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = markdown.substring(start, end);
      const newText = markdown.substring(0, start) + syntax.replace('{text}', selectedText) + markdown.substring(end);
      setMarkdown(newText);
      
      setTimeout(() => {
        textareaRef.current?.focus();
        const newCursorPos = start + syntax.indexOf('{text}') + (selectedText.length || 0);
        textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('markdown-history');
      setSuccessMessage(t('history_cleared', '✓ History cleared successfully!'));
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getFontSizeClass = () => {
    switch(fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const syntaxHelpers = [
    { label: t('h1', 'H1'), syntax: '# {text}', icon: Heading1 },
    { label: t('h2', 'H2'), syntax: '## {text}', icon: Heading2 },
    { label: t('h3', 'H3'), syntax: '### {text}', icon: Heading3 },
    { label: t('bold', 'Bold'), syntax: '**{text}**', icon: Bold },
    { label: t('italic', 'Italic'), syntax: '*{text}*', icon: Italic },
    { label: t('link', 'Link'), syntax: '[{text}](url)', icon: Link },
    { label: t('code', 'Code'), syntax: '`{text}`', icon: Code },
    { label: t('list', 'List'), syntax: '- {text}', icon: List },
    { label: t('ordered_list', 'Ordered List'), syntax: '1. {text}', icon: ListOrdered },
    { label: t('quote', 'Quote'), syntax: '> {text}', icon: Quote },
    { label: t('image', 'Image'), syntax: '![{text}](image-url)', icon: Image },
    { label: t('table', 'Table'), syntax: '| {text} |', icon: Table },
  ];

  const isRTL = lang === 'ur' || lang === 'ar';
  const isLoading = !mounted || toolsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4" 
               style={{ borderColor: themeColors.primary, borderTopColor: 'transparent' }} />
          <div className="animate-pulse" style={{ color: themeColors.primary }}>{t('loading', 'Loading...')}</div>
        </div>
      </div>
    );
  }

  const successColor = '#10B981';
  const errorColor = '#EF4444';
  const warningColor = '#F59E0B';

  const getDynamicStyles = () => ({
    '--primary': themeColors.primary || '#2563EB',
    '--primary-light': `${themeColors.primary || '#2563EB'}15`,
    '--background': themeColors.background || '#FFFFFF',
    '--surface': themeColors.surface || '#F8FAFC',
    '--surface-hover': isDarkMode ? '#1e293b' : '#f1f5f9',
    '--text-primary': themeColors.text?.primary || '#1E293B',
    '--text-secondary': themeColors.text?.secondary || '#475569',
    '--border': themeColors.border || '#E2E8F0',
    '--success': successColor,
    '--error': errorColor,
    '--warning': warningColor,
    '--font-family': fontFamily || 'system-ui, sans-serif',
  } as React.CSSProperties);

  const GradientText = ({ children }: { children: React.ReactNode }) => (
    <span style={{ 
      background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }}>
      {children}
    </span>
  );

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen"
      style={{ backgroundColor: themeColors.background, fontFamily: fontFamily }}
    >
      {/* Top Banner Ad */}

      <CentralAd position="top" size="banner" />
      
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12" style={getDynamicStyles()}>
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-5">
            <div className="rounded-2xl p-4 shadow-lg" style={{ 
              backgroundColor: `${themeColors.primary}15`,
              boxShadow: `0 10px 25px -5px ${themeColors.primary}30`
            }}>
              <FileText className="h-10 w-10" style={{ color: themeColors.primary }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <GradientText>{t('title', 'Markdown Editor')}</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Edit and preview Markdown text in real-time with syntax highlighting, live preview, and export options')}
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${successColor}15` }}>
              <Eye className="h-3.5 w-3.5" style={{ color: successColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('live_preview', 'Live Preview')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${warningColor}15` }}>
              <Copy className="h-3.5 w-3.5" style={{ color: warningColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('export_html', 'Export HTML')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Save className="h-3.5 w-3.5" style={{ color: themeColors.primary }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('auto_save', 'Auto Save')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'editor', icon: FileText, label: t('tab_editor', 'Editor') },
            { id: 'preview', icon: Eye, label: t('tab_preview', 'Preview') },
            { id: 'html', icon: Code, label: t('tab_html', 'HTML') },
            { id: 'history', icon: Database, label: t('tab_history', 'History') },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive ? 'scale-105 shadow-lg' : 'hover:scale-102 opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isActive ? themeColors.primary : themeColors.surface,
                  color: isActive ? '#ffffff' : themeColors.text.secondary,
                  border: isActive ? 'none' : `1px solid ${themeColors.border}`,
                  boxShadow: isActive ? `0 4px 12px ${themeColors.primary}40` : 'none',
                }}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages */}
        {(error || successMessage) && (
          <div className="mb-6 p-4 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300"
            style={{ 
              backgroundColor: error ? `${errorColor}15` : `${successColor}15`,
              border: `1px solid ${error ? errorColor : successColor}30`
            }}>
            <div className="flex items-center gap-3">
              {error ? <AlertCircle className="h-5 w-5" style={{ color: errorColor }} /> : <CheckCircle className="h-5 w-5" style={{ color: successColor }} />}
              <span className="text-sm" style={{ color: error ? errorColor : successColor }}>{error || successMessage}</span>
            </div>
            <button onClick={() => { setError(null); setSuccessMessage(null); }} className="p-1 rounded-lg hover:bg-black/5">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Main Content - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <CentralAd position="sidebar-left" size="skyscraper" />
            </div>
          </aside>
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* EDITOR TAB */}
            {activeTab === 'editor' && (
              <>
                {/* Syntax Helper Buttons */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Bold className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('quick_insert', 'Quick Insert')}
                  </h2>
                  
                  <div className="flex flex-wrap gap-2">
                    {syntaxHelpers.map((helper, index) => {
                      const Icon = helper.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => insertText(helper.syntax)}
                          className="px-3 py-1.5 text-sm rounded-lg transition-all hover:scale-105 flex items-center gap-1"
                          style={{ 
                            backgroundColor: `${themeColors.primary}10`,
                            color: themeColors.primary
                          }}
                          title={helper.label}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {helper.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Editor Toolbar */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={saveToLocalStorage}
                      className="px-3 py-1.5 text-xs rounded-lg transition-all hover:scale-105 flex items-center gap-1"
                      style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                    >
                      <Save className="h-3 w-3" />
                      {t('save', 'Save')}
                    </button>
                    <button
                      onClick={loadFromLocalStorage}
                      className="px-3 py-1.5 text-xs rounded-lg transition-all hover:scale-105 flex items-center gap-1"
                      style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                    >
                      <RefreshCw className="h-3 w-3" />
                      {t('load', 'Load')}
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="px-3 py-1.5 text-xs rounded-lg transition-all hover:scale-105 flex items-center gap-1"
                      style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                    >
                      {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                      {isFullscreen ? t('exit_fullscreen', 'Exit Fullscreen') : t('fullscreen', 'Fullscreen')}
                    </button>
                  </div>
                  <div className="text-xs" style={{ color: themeColors.text.secondary }}>
                    {t('words', 'Words')}: {wordCount} | {t('chars', 'Chars')}: {charCount}
                  </div>
                </div>

                {/* Editor Area */}
                <div className={`rounded-xl border ${isFullscreen ? 'fixed inset-0 z-50 m-4' : ''}`} style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <textarea
                    ref={textareaRef}
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className={`w-full p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all font-mono ${getFontSizeClass()}`}
                    style={{ 
                      backgroundColor: themeColors.background,
                      borderColor: themeColors.border,
                      color: themeColors.text.primary,
                      minHeight: isFullscreen ? 'calc(100vh - 200px)' : '400px'
                    }}
                    placeholder={t('placeholder', 'Start writing your markdown here...')}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = themeColors.primary;
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = themeColors.border;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => copyToClipboard(markdown, t('markdown', 'Markdown'))}
                    disabled={!markdown}
                    className="flex-1 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                  >
                    <Copy className="h-4 w-4" />
                    {t('copy_markdown', 'Copy Markdown')}
                  </button>
                  <button
                    onClick={downloadMarkdown}
                    disabled={!markdown}
                    className="px-4 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                    style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('download_md', 'Download .md')}</span>
                  </button>
                  <button
                    onClick={clearEditor}
                    className="px-4 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('clear', 'Clear')}</span>
                  </button>
                </div>

                {/* Tips Section */}
                <div className="rounded-xl p-5" style={{ backgroundColor: `${themeColors.primary}08`, border: `1px solid ${themeColors.primary}20` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5" style={{ color: themeColors.primary }} />
                    <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('markdown_tips', 'Markdown Tips')}</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_1', 'Use # for headings (## for subheadings)')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_2', 'Wrap text with ** for bold and * for italic')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_3', 'Create links with [text](url)')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_4', 'Use backticks ` for inline code')}</span>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* PREVIEW TAB */}
            {activeTab === 'preview' && (
              <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Eye className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('live_preview', 'Live Preview')}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(html, 'HTML')}
                      className="px-3 py-1.5 text-xs rounded-lg transition-all hover:scale-105 flex items-center gap-1"
                      style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                    >
                      <Copy className="h-3 w-3" />
                      {t('copy_html', 'Copy HTML')}
                    </button>
                    <button
                      onClick={downloadHtml}
                      className="px-3 py-1.5 text-xs rounded-lg transition-all hover:scale-105 flex items-center gap-1"
                      style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                    >
                      <Download className="h-3 w-3" />
                      {t('save_html', 'Save HTML')}
                    </button>
                  </div>
                </div>
                
                <div 
                  ref={previewRef}
                  className="p-6 rounded-xl border max-h-[500px] overflow-y-auto prose prose-sm max-w-none"
                  style={{ 
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                    color: themeColors.text.primary
                  }}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
                />
              </div>
            )}

            {/* HTML TAB */}
            {activeTab === 'html' && (
              <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Code className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('html_output', 'HTML Output')}
                  </h2>
                  <button
                    onClick={() => copyToClipboard(html, 'HTML')}
                    className="px-3 py-1.5 text-xs rounded-lg transition-all hover:scale-105 flex items-center gap-1"
                    style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                  >
                    <Copy className="h-3 w-3" />
                    {t('copy_html', 'Copy HTML')}
                  </button>
                </div>
                
                <textarea
                  value={html}
                  readOnly
                  className="w-full p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all font-mono text-sm"
                  style={{ 
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                    color: themeColors.text.primary,
                    minHeight: '400px'
                  }}
                  placeholder={t('html_placeholder', 'HTML output will appear here...')}
                />
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
              <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="p-5 border-b" style={{ borderColor: themeColors.border }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                        <Database className="h-5 w-5" style={{ color: themeColors.primary }} />
                        {t('edit_history', 'Edit History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_edits', 'Your recent markdown edits')}
                      </p>
                    </div>
                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                        style={{ backgroundColor: `${errorColor}10`, color: errorColor }}
                      >
                        {t('clear_history', 'Clear History')}
                      </button>
                    )}
                  </div>
                </div>

                {history.length > 0 ? (
                  <div className="divide-y max-h-96 overflow-y-auto" style={{ borderColor: themeColors.border }}>
                    {history.map((entry) => (
                      <div key={entry.id} className="p-4 hover:bg-surface-hover transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.contentLength} {t('chars', 'chars')} • {entry.wordCount} {t('words', 'words')}
                              </span>
                            </div>
                            <p className="text-xs mt-1 opacity-60" style={{ color: themeColors.text.secondary }}>
                              {formatTime(entry.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                    <p className="text-base" style={{ color: themeColors.text.secondary }}>
                      {t('no_history', 'No edit history yet')}
                    </p>
                    <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your markdown edits will appear here')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <CentralAd position="sidebar-right" size="skyscraper" />
            </div>
          </aside>
        </div>
        
        {/* Bottom Ad */}
        <div className="mt-10">

      {/* Related Blog Posts — SEO Internal Linking */}
      <div className="mt-8">
      </div>

          <CentralAd position="bottom" size="banner" />
        </div>
      </div>
    </div>
  );
}
