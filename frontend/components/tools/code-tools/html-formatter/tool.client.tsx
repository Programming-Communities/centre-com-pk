
// components/tools/code-tools/html-formatter/tool.client.tsx
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';


import { useState, useEffect } from "react";
import { Code, Copy, Download, Settings, History, Share2, CheckCircle, Trash2, FileCode, RefreshCw, Eye } from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

interface HistoryEntry {
  id: number;
  input: string;
  output: string;
  indentSize: number;
  indentWith: 'spaces' | 'tabs';

  timestamp: string;
}

export default function HtmlFormatterClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'code-tools' });
  const [mounted, setMounted] = useState(false);
  
  const [inputHtml, setInputHtml] = useState<string>(`<!DOCTYPE html>
<html>
<head>
<title>Sample Page</title>
</head>
<body>
<div class="container"><h1>Hello World</h1><p>This is a sample HTML page.</p></div>
</body>
</html>`);
  
  const [formattedHtml, setFormattedHtml] = useState<string>("");
  const [indentSize, setIndentSize] = useState<number>(2);
  const [indentWith, setIndentWith] = useState<'spaces' | 'tabs'>('spaces');
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'formatter' | 'history'>('formatter');
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `html_formatter.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    // Load history from localStorage
    const savedHistory = localStorage.getItem('html-formatter-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
  }, []);

  const formatHtml = () => {
    if (!inputHtml.trim()) {
      setFormattedHtml("");
      setError("");
      return;
    }
    
    try {
      let formatted = inputHtml;
      
      // Add newlines between tags
      formatted = formatted.replace(/>\s+</g, '>\n<');
      
      // Clean up whitespace
      formatted = formatted.replace(/\s+/g, ' ').trim();

      // Add indentation
      let indentLevel = 0;
      const lines = formatted.split('\n');
      const formattedLines = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';

        // Decrease indent for closing tags
        if (trimmed.startsWith('</')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        const indent = indentWith === 'spaces' 
          ? ' '.repeat(indentLevel * indentSize)
          : '\t'.repeat(indentLevel);
        
        const result = indent + trimmed;

        // Increase indent for opening tags (that don't self-close)
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && 
            !trimmed.includes('/>') && !trimmed.endsWith('/>')) {
          indentLevel++;
        }

        return result;
      });

      const output = formattedLines.filter(line => line !== '').join('\n');
      setFormattedHtml(output);
      setError("");
      
      // Save to history
      if (inputHtml.trim()) {
        const historyEntry: HistoryEntry = {
          id: Date.now(),
          input: inputHtml,
          output: output,
          indentSize,
          indentWith,
          timestamp: new Date().toISOString()
        };
        const newHistory = [historyEntry, ...history.slice(0, 9)];
        setHistory(newHistory);
        try {
          localStorage.setItem('html-formatter-history', JSON.stringify(newHistory));
        } catch (e) {
          console.error('Error saving to localStorage:', e);
        }
      }
    } catch (error) {
      setError(t('error', 'Error formatting HTML. Please check your input.'));
      setFormattedHtml("");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert(t('copy_failed', 'Failed to copy HTML'));
    }
  };

  const downloadHtml = () => {
    const blob = new Blob([formattedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsText = () => {
    const text = `${t('export_header', '=== HTML FORMATTING REPORT ===')}\n` +
                 `${t('date', 'Date')}: ${new Date().toLocaleDateString()}\n` +
                 `${t('indent_size', 'Indent Size')}: ${indentSize} ${indentWith === 'spaces' ? t('spaces', 'spaces') : t('tabs', 'tabs')}\n` +
                 `${t('input_length', 'Input Length')}: ${inputHtml.length} ${t('characters', 'characters')}\n` +
                 `${t('output_length', 'Output Length')}: ${formattedHtml.length} ${t('characters', 'characters')}\n\n` +
                 `${t('formatted_code', 'Formatted Code')}:\n${formattedHtml}\n\n` +
                 `${t('generated_by', '=== Generated by Centre.com.pk HTML Formatter ===')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `html-formatted-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    const shareText = `${t('share_text', 'HTML Formatted')}: ${formattedHtml.substring(0, 200)}...`;
    if (navigator.share) {
      navigator.share({
        title: t('share_title', 'HTML Formatting Result'),
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert(t('copied_to_clipboard', 'Results copied to clipboard!'));
    }
  };

  const clearAll = () => {
    setInputHtml('');
    setFormattedHtml('');
    setError('');
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('html-formatter-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setInputHtml(entry.input);
    setIndentSize(entry.indentSize);
    setIndentWith(entry.indentWith);
    setFormattedHtml(entry.output);
    setActiveTab('formatter');
  };

  const sampleData = [
    {
      name: t('sample_basic', 'Basic HTML Page'),
      code: `<!DOCTYPE html><html><head><title>Page Title</title></head><body><h1>Heading</h1><p>Paragraph text.</p></body></html>`
    },
    {
      name: t('sample_form', 'Form with Inputs'),
      code: `<form><div><label>Name:</label><input type="text"></div><div><label>Email:</label><input type="email"></div><button type="submit">Submit</button></form>`
    },
    {
      name: t('sample_list', 'HTML List'),
      code: `<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>`
    },
    {
      name: t('sample_table', 'HTML Table'),
      code: `<table><tr><th>Name</th><th>Age</th></tr><tr><td>John</td><td>25</td></tr></table>`
    }
  ];

  useEffect(() => {
    if (mounted && inputHtml) {
      formatHtml();
    }
  }, [inputHtml, indentSize, indentWith, mounted]);

  const isRTL = lang === 'ur' || lang === 'ar';
  const isLoading = !mounted || toolsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <div className="animate-pulse text-primary">{t('loading', 'Loading...')}</div>
      </div>
    );
  }

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen"
      style={{ 
        backgroundColor: themeColors.background,
        color: themeColors.text.primary,
        fontFamily: fontFamily
      }}
    >
      {/* Top Banner Ad */}
      
      <CentralAd position="top" size="banner" />

      
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="rounded-full p-3" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <FileCode className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'HTML Formatter')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Beautify and format your HTML code with proper indentation')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('formatter')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'formatter' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'formatter' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'formatter' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'formatter' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Code className="h-4 w-4" />
            {t('tab_formatter', 'Formatter')}
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'history' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'history' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'history' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'history' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <History className="h-4 w-4" />
            {t('tab_history', 'History')}
          </button>
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${showPreview ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: showPreview ? themeColors.primary : themeColors.surface,
              color: showPreview ? '#ffffff' : themeColors.text.secondary,
              border: showPreview ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Eye className="h-4 w-4" />
            {t('tab_preview', 'Preview')}
          </button>
        </div>

        {/* Main Content - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <CentralAd position="sidebar-left" size="skyscraper" />
            </div>
          </aside>
          
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            
            {/* Formatter Tab */}
            {activeTab === 'formatter' && (
              <div className="space-y-6">
                {/* Input Section */}
                <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: themeColors.border }}>
                    <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <Code className="h-5 w-5" style={{ color: themeColors.primary }} />
                      {t('input_html', 'Input HTML')}
                    </h2>
                    <button
                      onClick={clearAll}
                      className="text-sm hover:opacity-80 transition-colors"
                      style={{ color: themeColors.error }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    value={inputHtml}
                    onChange={(e) => setInputHtml(e.target.value)}
                    className="w-full h-80 p-4 font-mono text-sm focus:outline-none resize-none"
                    placeholder={t('paste_html', 'Paste your HTML code here...')}
                    spellCheck="false"
                    style={{ 
                      backgroundColor: themeColors.background,
                      color: themeColors.text.primary,
                      caretColor: themeColors.primary
                    }}
                  />
                </div>

                {/* Formatting Options */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Settings className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('formatting_options', 'Formatting Options')}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('indent_size', 'Indent Size')}
                      </label>
                      <select
                        value={indentSize}
                        onChange={(e) => setIndentSize(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                        style={{ 
                          backgroundColor: themeColors.background,
                          color: themeColors.text.primary,
                          borderColor: themeColors.border
                        }}
                      >
                        <option value="2">2 {t('spaces', 'spaces')}</option>
                        <option value="4">4 {t('spaces', 'spaces')}</option>
                        <option value="8">8 {t('spaces', 'spaces')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('indent_with', 'Indent With')}
                      </label>
                      <select
                        value={indentWith}
                        onChange={(e) => setIndentWith(e.target.value as 'spaces' | 'tabs')}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                        style={{ 
                          backgroundColor: themeColors.background,
                          color: themeColors.text.primary,
                          borderColor: themeColors.border
                        }}
                      >
                        <option value="spaces">{t('spaces', 'Spaces')}</option>
                        <option value="tabs">{t('tabs', 'Tabs')}</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={formatHtml}
                    className="w-full mt-4 py-3 px-4 rounded-lg hover:opacity-90 transition-colors font-semibold flex items-center justify-center gap-2"
                    style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    {t('format_html', 'Format HTML')}
                  </button>
                </div>

                {/* Sample Data */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                    {t('try_sample', 'Try Sample HTML')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sampleData.map((sample, index) => (
                      <button
                        key={index}
                        onClick={() => setInputHtml(sample.code)}
                        className="p-3 rounded-lg border text-left hover:opacity-90 transition-opacity text-sm"
                        style={{ 
                          backgroundColor: themeColors.background,
                          borderColor: themeColors.border
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = themeColors.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = themeColors.border;
                        }}
                      >
                        <div className="font-medium mb-1" style={{ color: themeColors.text.primary }}>
                          {sample.name}
                        </div>
                        <div className="text-xs font-mono truncate" style={{ color: themeColors.text.secondary }}>
                          {sample.code.substring(0, 60)}...
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output Section */}
                <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: themeColors.border }}>
                    <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <FileCode className="h-5 w-5" style={{ color: themeColors.primary }} />
                      {t('formatted_html', 'Formatted HTML')}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        disabled={!formattedHtml}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs hover:opacity-80 transition-colors disabled:opacity-50"
                        style={{ 
                          backgroundColor: copied ? themeColors.success : `${themeColors.primary}15`,
                          color: copied ? themeColors.text.accent : themeColors.primary,
                          border: `1px solid ${copied ? 'transparent' : `${themeColors.primary}30`}`
                        }}
                      >
                        {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? t('copied', 'Copied!') : t('copy', 'Copy')}
                      </button>
                      <button
                        onClick={downloadHtml}
                        disabled={!formattedHtml}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs hover:opacity-80 transition-colors disabled:opacity-50"
                        style={{ 
                          backgroundColor: `${themeColors.primary}15`,
                          color: themeColors.primary,
                          border: `1px solid ${themeColors.primary}30`
                        }}
                      >
                        <Download className="h-3 w-3" />
                        {t('download', 'Download')}
                      </button>
                      <button
                        onClick={exportAsText}
                        disabled={!formattedHtml}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs hover:opacity-80 transition-colors disabled:opacity-50"
                        style={{ 
                          backgroundColor: `${themeColors.primary}15`,
                          color: themeColors.primary,
                          border: `1px solid ${themeColors.primary}30`
                        }}
                      >
                        <Share2 className="h-3 w-3" />
                        {t('export', 'Export')}
                      </button>
                    </div>
                  </div>
                  {showPreview && formattedHtml ? (
                    <div 
                      className="w-full h-96 p-4 overflow-auto"
                      style={{ 
                        backgroundColor: themeColors.background,
                        color: themeColors.text.primary
                      }}
                      dangerouslySetInnerHTML={{ __html: formattedHtml }}
                    />
                  ) : (
                    <pre 
                      className="w-full h-96 p-4 overflow-auto text-sm font-mono whitespace-pre-wrap"
                      style={{ 
                        backgroundColor: themeColors.background,
                        color: themeColors.text.primary
                      }}
                    >
                      {formattedHtml || t('output_placeholder', 'Formatted HTML will appear here...')}
                    </pre>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg flex items-center gap-2" style={{ 
                    backgroundColor: `${themeColors.error}10`,
                    color: themeColors.error,
                    border: `1px solid ${themeColors.error}30`
                  }}>
                    <div className="h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: themeColors.error, color: themeColors.text.accent }}>
                      !
                    </div>
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* HTML Tips */}
                <div className="rounded-xl p-6" style={{ 
                  backgroundColor: `${themeColors.primary}10`,
                  border: `1px solid ${themeColors.primary}30`
                }}>
                  <h3 className="font-semibold mb-2" style={{ color: themeColors.primary }}>
                    {t('html_tips', 'HTML Formatting Tips')}
                  </h3>
                  <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: themeColors.primary }}>
                    <li>{t('tip_1', 'Proper indentation makes HTML code more readable and maintainable')}</li>
                    <li>{t('tip_2', 'Use consistent spacing (2 or 4 spaces are common)')}</li>
                    <li>{t('tip_3', 'Nest child elements with increased indentation')}</li>
                    <li>{t('tip_4', 'Keep line length reasonable for better readability')}</li>
                    <li>{t('tip_5', 'Always close your tags properly')}</li>
                  </ul>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="p-4 sm:p-6 border-b" style={{ borderColor: themeColors.border }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold" style={{ color: themeColors.text.primary }}>
                        {t('formatting_history', 'Formatting History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_formats', 'Your recent HTML formatting operations')}
                      </p>
                    </div>
                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="px-4 py-2 border rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                        style={{ borderColor: themeColors.error, color: themeColors.error }}
                      >
                        {t('clear_history', 'Clear History')}
                      </button>
                    )}
                  </div>
                </div>

                {history.length > 0 ? (
                  <div className="divide-y" style={{ borderColor: themeColors.border }}>
                    {history.map((entry) => (
                      <div key={entry.id} className="p-4 hover:opacity-80 transition-opacity">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <FileCode className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {t('html_format', 'HTML Format')}
                              </span>
                            </div>
                            <p className="text-sm font-mono truncate" style={{ color: themeColors.text.secondary }}>
                              {entry.input.substring(0, 80)}...
                            </p>
                            <p className="text-xs mt-1 opacity-60" style={{ color: themeColors.text.secondary }}>
                              {new Date(entry.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => loadHistoryEntry(entry)}
                            className="px-3 py-1 text-xs rounded hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                          >
                            {t('load', 'Load')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 sm:p-12 text-center">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                    <p className="text-sm opacity-80 mb-2" style={{ color: themeColors.text.secondary }}>
                      {t('no_history', 'No formatting history yet')}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your HTML formatting operations will appear here')}
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
      {/* Related Blog Posts — SEO Internal Linking */}
      <div className="mt-8">
      </div>
      </div>
    </div>
  );

}
