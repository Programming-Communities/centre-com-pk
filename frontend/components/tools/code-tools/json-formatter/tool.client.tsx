
// components/tools/code-tools/json-formatter/tool.client.tsx
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';


import { useState, useEffect } from "react";
import { Copy, RotateCcw, CheckCircle, XCircle, History, Download, Share2, Code, FileCode, Trash2, Eye, RefreshCw } from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

interface HistoryEntry {
  id: number;
  input: string;
  output: string;
  isValid: boolean;

  timestamp: string;
}

export default function JSONFormatterClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'code-tools' });
  const [mounted, setMounted] = useState(false);
  
  const [inputJSON, setInputJSON] = useState<string>('{"name":"John","age":30,"city":"New York"}');
  const [formattedJSON, setFormattedJSON] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'formatter' | 'history'>('formatter');
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `json_formatter.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    // Load history from localStorage
    const savedHistory = localStorage.getItem('json-formatter-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
  }, []);

  const formatJSON = () => {
    try {
      if (!inputJSON.trim()) {
        setFormattedJSON('');
        setIsValid(true);
        setError('');
        return;
      }

      const parsed = JSON.parse(inputJSON);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJSON(formatted);
      setIsValid(true);
      setError('');
      
      // Save to history
      const historyEntry: HistoryEntry = {
        id: Date.now(),
        input: inputJSON,
        output: formatted,
        isValid: true,
        timestamp: new Date().toISOString()
      };
      const newHistory = [historyEntry, ...history.slice(0, 9)];
      setHistory(newHistory);
      try {
        localStorage.setItem('json-formatter-history', JSON.stringify(newHistory));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    } catch (err) {
      setIsValid(false);
      const errorMsg = err instanceof Error ? err.message : 'Invalid JSON';
      setError(errorMsg);
      setFormattedJSON('');
    }
  };

  const minifyJSON = () => {
    try {
      if (!inputJSON.trim()) return;

      const parsed = JSON.parse(inputJSON);
      const minified = JSON.stringify(parsed);
      setFormattedJSON(minified);
      setIsValid(true);
      setError('');
      
      // Save to history
      const historyEntry: HistoryEntry = {
        id: Date.now(),
        input: inputJSON,
        output: minified,
        isValid: true,
        timestamp: new Date().toISOString()
      };
      const newHistory = [historyEntry, ...history.slice(0, 9)];
      setHistory(newHistory);
      try {
        localStorage.setItem('json-formatter-history', JSON.stringify(newHistory));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    } catch (err) {
      setIsValid(false);
      const errorMsg = err instanceof Error ? err.message : 'Invalid JSON';
      setError(errorMsg);
    }
  };

  const validateJSON = () => {
    try {
      if (!inputJSON.trim()) {
        setIsValid(true);
        setError('');
        return;
      }
      JSON.parse(inputJSON);
      setIsValid(true);
      setError('');
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert(t('copy_failed', 'Failed to copy JSON'));
    }
  };

  const exportAsText = () => {
    const text = `${t('export_header', '=== JSON FORMATTING REPORT ===')}\n` +
                 `${t('date', 'Date')}: ${new Date().toLocaleDateString()}\n` +
                 `${t('status', 'Status')}: ${isValid ? t('valid', 'Valid JSON') : t('invalid', 'Invalid JSON')}\n` +
                 `${t('input_length', 'Input Length')}: ${inputJSON.length} ${t('characters', 'characters')}\n` +
                 `${t('output_length', 'Output Length')}: ${formattedJSON.length} ${t('characters', 'characters')}\n\n` +
                 `${t('formatted_json', 'Formatted JSON')}:\n${formattedJSON}\n\n` +
                 `${t('generated_by', '=== Generated by Centre.com.pk JSON Formatter ===')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `json-formatted-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    const shareText = `${t('share_text', 'JSON Formatted')}: ${formattedJSON.substring(0, 200)}...`;
    if (navigator.share) {
      navigator.share({
        title: t('share_title', 'JSON Formatting Result'),
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert(t('copied_to_clipboard', 'Results copied to clipboard!'));
    }
  };

  const resetTool = () => {
    setInputJSON('{"name":"John","age":30,"city":"New York"}');
    setFormattedJSON('');
    setIsValid(true);
    setError('');
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('json-formatter-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setInputJSON(entry.input);
    setFormattedJSON(entry.output);
    setIsValid(entry.isValid);
    setActiveTab('formatter');
  };

  const sampleJSONs = [
    { name: t('sample_simple', 'Simple Object'), value: '{"name":"John","age":30,"city":"New York"}' },
    { name: t('sample_array', 'Array'), value: '["apple","banana","cherry"]' },
    { name: t('sample_nested', 'Nested Object'), value: '{"user":{"name":"Alice","preferences":{"theme":"dark"}}}' },
    { name: t('sample_api', 'API Response'), value: '{"status":"success","data":{"id":1,"title":"Sample","completed":false},"message":"Operation completed"}' }
  ];

  useEffect(() => {
    if (mounted && inputJSON) {
      validateJSON();
    }
  }, [inputJSON, mounted]);

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
              <Code className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'JSON Formatter')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Format, validate, and beautify JSON data')}
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
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${showPreview && formattedJSON ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: showPreview && formattedJSON ? themeColors.primary : themeColors.surface,
              color: showPreview && formattedJSON ? '#ffffff' : themeColors.text.secondary,
              border: showPreview && formattedJSON ? 'none' : `1px solid ${themeColors.border}`
            }}
            disabled={!formattedJSON}
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
                {/* Sample JSON Buttons */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <label className="block text-sm font-medium mb-3" style={{ color: themeColors.text.primary }}>
                    {t('sample_json', 'Sample JSON')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sampleJSONs.map((sample, index) => (
                      <button
                        key={index}
                        onClick={() => setInputJSON(sample.value)}
                        className="px-3 py-1 text-sm rounded border hover:opacity-90 transition-colors"
                        style={{ 
                          backgroundColor: `${themeColors.primary}10`,
                          color: themeColors.primary,
                          borderColor: `${themeColors.primary}30`
                        }}
                      >
                        {sample.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input and Output Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Input Area */}
                  <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: themeColors.border }}>
                      <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                        <FileCode className="h-5 w-5" style={{ color: themeColors.primary }} />
                        {t('input_json', 'Input JSON')}
                      </h2>
                      <button
                        onClick={() => copyToClipboard(inputJSON)}
                        disabled={!inputJSON}
                        className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:opacity-90 transition-colors disabled:opacity-50"
                        style={{ 
                          backgroundColor: copied ? themeColors.success : themeColors.primary,
                          color: themeColors.text.accent
                        }}
                      >
                        {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? t('copied', 'Copied!') : t('copy', 'Copy')}
                      </button>
                    </div>
                    <textarea
                      value={inputJSON}
                      onChange={(e) => setInputJSON(e.target.value)}
                      className="w-full h-80 p-4 font-mono text-sm focus:outline-none resize-none"
                      placeholder={t('paste_json', 'Paste your JSON here...')}
                      spellCheck="false"
                      style={{ 
                        backgroundColor: themeColors.background,
                        color: themeColors.text.primary,
                        caretColor: themeColors.primary
                      }}
                    />
                  </div>

                  {/* Output Area */}
                  <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: themeColors.border }}>
                      <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                        <Code className="h-5 w-5" style={{ color: themeColors.primary }} />
                        {t('formatted_json', 'Formatted JSON')}
                      </h2>
                      <div className="flex gap-2">
                        {formattedJSON && (
                          <button
                            onClick={() => copyToClipboard(formattedJSON)}
                            className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:opacity-90 transition-colors"
                            style={{ 
                              backgroundColor: themeColors.primary,
                              color: themeColors.text.accent
                            }}
                          >
                            <Copy className="h-3 w-3" />
                            {t('copy', 'Copy')}
                          </button>
                        )}
                      </div>
                    </div>
                    {showPreview && formattedJSON && isValid ? (
                      <pre 
                        className="w-full h-80 p-4 overflow-auto text-sm font-mono whitespace-pre-wrap"
                        style={{ 
                          backgroundColor: themeColors.background,
                          color: themeColors.text.primary
                        }}
                      >
                        {formattedJSON}
                      </pre>
                    ) : (
                      <textarea
                        value={formattedJSON}
                        readOnly
                        className="w-full h-80 p-4 font-mono text-sm resize-none focus:outline-none"
                        style={{ 
                          backgroundColor: themeColors.background,
                          color: themeColors.text.primary
                        }}
                        placeholder={t('output_placeholder', 'Formatted JSON will appear here...')}
                      />
                    )}
                  </div>
                </div>

                {/* Validation Status */}
                {inputJSON && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg`}
                    style={{ 
                      backgroundColor: isValid ? `${themeColors.success}10` : `${themeColors.error}10`,
                      color: isValid ? themeColors.success : themeColors.error,
                      border: `1px solid ${isValid ? `${themeColors.success}30` : `${themeColors.error}30`}`
                    }}>
                    {isValid ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {isValid ? t('valid_json', 'Valid JSON') : `${t('invalid_json', 'Invalid JSON')}: ${error}`}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={formatJSON}
                    disabled={!inputJSON.trim()}
                    className="flex-1 py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    {t('format_json', 'Format JSON')}
                  </button>
                  <button
                    onClick={minifyJSON}
                    disabled={!inputJSON.trim()}
                    className="flex-1 py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ backgroundColor: `${themeColors.primary}80`, color: themeColors.text.accent }}
                  >
                    <Code className="h-4 w-4" />
                    {t('minify_json', 'Minify JSON')}
                  </button>
                  <button
                    onClick={resetTool}
                    className="px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center gap-2"
                    style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                  >
                    <RotateCcw className="h-4 w-4" />
                    {t('reset', 'Reset')}
                  </button>
                </div>

                {/* Export & Share Buttons */}
                {formattedJSON && (
                  <div className="flex gap-3">
                    <button
                      onClick={exportAsText}
                      className="flex-1 py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                      style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                    >
                      <Download className="h-4 w-4" />
                      {t('export', 'Export')}
                    </button>
                    <button
                      onClick={shareResults}
                      className="flex-1 py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                      style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                    >
                      <Share2 className="h-4 w-4" />
                      {t('share', 'Share')}
                    </button>
                  </div>
                )}

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* JSON Tips */}
                <div className="rounded-xl p-6" style={{ 
                  backgroundColor: `${themeColors.primary}10`,
                  border: `1px solid ${themeColors.primary}30`
                }}>
                  <h3 className="font-semibold mb-2" style={{ color: themeColors.primary }}>
                    {t('json_tips', 'JSON Tips & Best Practices')}
                  </h3>
                  <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: themeColors.primary }}>
                    <li>{t('tip_1', 'Always use double quotes for keys and string values')}</li>
                    <li>{t('tip_2', 'Avoid trailing commas in arrays and objects')}</li>
                    <li>{t('tip_3', 'Use consistent indentation (2 or 4 spaces)')}</li>
                    <li>{t('tip_4', 'Validate JSON before parsing in production')}</li>
                    <li>{t('tip_5', 'Use JSON schema for complex data validation')}</li>
                    <li>{t('tip_6', 'Keep JSON structure flat when possible')}</li>
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
                        {t('recent_formats', 'Your recent JSON formatting operations')}
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
                              <Code className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {t('json_format', 'JSON Format')}
                              </span>
                              {entry.isValid ? (
                                <CheckCircle className="h-3 w-3" style={{ color: themeColors.success }} />
                              ) : (
                                <XCircle className="h-3 w-3" style={{ color: themeColors.error }} />
                              )}
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
                      {t('history_will_appear', 'Your JSON formatting operations will appear here')}
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
