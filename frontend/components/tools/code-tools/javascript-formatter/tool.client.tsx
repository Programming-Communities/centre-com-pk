
// components/tools/code-tools/javascript-formatter/tool.client.tsx
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';


import { useState, useEffect } from "react";
import { Code, Copy, Download, Settings, History, Share2, CheckCircle, Trash2, FileCode, RefreshCw } from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

interface HistoryEntry {
  id: number;
  input: string;
  output: string;
  indentSize: number;
  semicolons: boolean;

  timestamp: string;
}

export default function JavaScriptFormatterClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'code-tools' });
  const [mounted, setMounted] = useState(false);
  
  const [inputJs, setInputJs] = useState<string>(`function calculateTotal(price,tax){return price+(price*tax);}const items=[1,2,3,4,5];const doubled=items.map(item=>item*2);class Person{constructor(name,age){this.name=name;this.age=age;}greet(){return"Hello, my name is " + this.name;}}`);
  const [formattedJs, setFormattedJs] = useState<string>("");
  const [indentSize, setIndentSize] = useState<number>(2);
  const [semicolons, setSemicolons] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'formatter' | 'history'>('formatter');

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `javascript_formatter.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    // Load history from localStorage
    const savedHistory = localStorage.getItem('javascript-formatter-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
  }, []);

  const formatJavaScript = () => {
    if (!inputJs.trim()) {
      setFormattedJs("");
      setError("");
      return;
    }
    
    try {
      let formatted = inputJs;
      
      // Basic JavaScript formatting
      formatted = formatted
        .replace(/\s*{\s*/g, ' {\n')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/\s*;\s*/g, ';\n')
        .replace(/\s*,\s*/g, ', ')
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        .replace(/\s*=>\s*/g, ' => ')
        .replace(/\s+/g, ' ')
        .trim();

      // Add/remove semicolons based on preference
      if (!semicolons) {
        formatted = formatted.replace(/;\n/g, '\n');
      }

      // Add indentation
      let indentLevel = 0;
      const lines = formatted.split('\n');
      const formattedLines = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';

        // Decrease indent for closing braces
        if (trimmed === '}' || trimmed === '];' || trimmed === ');' || trimmed === ']' || trimmed === ')') {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        const indent = ' '.repeat(indentLevel * indentSize);
        const result = indent + trimmed;

        // Increase indent after opening braces, brackets, parens
        if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
          indentLevel++;
        }

        return result;
      });

      const output = formattedLines.filter(line => line !== '').join('\n');
      setFormattedJs(output);
      setError("");
      
      // Save to history
      if (inputJs.trim()) {
        const historyEntry: HistoryEntry = {
          id: Date.now(),
          input: inputJs,
          output: output,
          indentSize,
          semicolons,
          timestamp: new Date().toISOString()
        };
        const newHistory = [historyEntry, ...history.slice(0, 9)];
        setHistory(newHistory);
        try {
          localStorage.setItem('javascript-formatter-history', JSON.stringify(newHistory));
        } catch (e) {
          console.error('Error saving to localStorage:', e);
        }
      }
    } catch (error) {
      setError(t('error', 'Error formatting JavaScript. Please check your input.'));
      setFormattedJs("");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedJs);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert(t('copy_failed', 'Failed to copy JavaScript'));
    }
  };

  const downloadJs = () => {
    const blob = new Blob([formattedJs], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsText = () => {
    const text = `${t('export_header', '=== JAVASCRIPT FORMATTING REPORT ===')}\n` +
                 `${t('date', 'Date')}: ${new Date().toLocaleDateString()}\n` +
                 `${t('indent_size', 'Indent Size')}: ${indentSize} ${t('spaces', 'spaces')}\n` +
                 `${t('semicolons', 'Semicolons')}: ${semicolons ? t('yes', 'Yes') : t('no', 'No')}\n` +
                 `${t('input_length', 'Input Length')}: ${inputJs.length} ${t('characters', 'characters')}\n` +
                 `${t('output_length', 'Output Length')}: ${formattedJs.length} ${t('characters', 'characters')}\n\n` +
                 `${t('formatted_code', 'Formatted Code')}:\n${formattedJs}\n\n` +
                 `${t('generated_by', '=== Generated by Centre.com.pk JavaScript Formatter ===')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `javascript-formatted-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    const shareText = `${t('share_text', 'JavaScript Formatted')}: ${formattedJs.substring(0, 200)}...`;
    if (navigator.share) {
      navigator.share({
        title: t('share_title', 'JavaScript Formatting Result'),
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert(t('copied_to_clipboard', 'Results copied to clipboard!'));
    }
  };

  const clearAll = () => {
    setInputJs('');
    setFormattedJs('');
    setError('');
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('javascript-formatter-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setInputJs(entry.input);
    setIndentSize(entry.indentSize);
    setSemicolons(entry.semicolons);
    setFormattedJs(entry.output);
    setActiveTab('formatter');
  };

  const sampleData = [
    {
      name: t('sample_function', 'Function Example'),
      code: `function calculateCircleArea(radius){return Math.PI*radius*radius;}function calculateTotal(items){return items.reduce((total,item)=>total+item.price,0);}const user={name:'John',age:30,city:'New York'};console.log(calculateCircleArea(5));`
    },
    {
      name: t('sample_array', 'Array Methods'),
      code: `const numbers=[1,2,3,4,5];const evenNumbers=numbers.filter(n=>n%2===0);const doubled=numbers.map(n=>n*2);const sum=numbers.reduce((acc,curr)=>acc+curr,0);console.log('Even:',evenNumbers);console.log('Doubled:',doubled);console.log('Sum:',sum);`
    },
    {
      name: t('sample_class', 'Class Example'),
      code: `class Animal{constructor(name){this.name=name;}speak(){console.log(this.name+'makes a sound.');}}class Dog extends Animal{constructor(name){super(name);}speak(){console.log(this.name+'barks.');}}const dog=new Dog('Rex');dog.speak();`
    },
    {
      name: t('sample_async', 'Async/Await'),
      code: `async function fetchData(url){try{const response=await fetch(url);const data=await response.json();return data;}catch(error){console.error('Error:',error);}}fetchData('https://api.example.com/data').then(data=>console.log(data));`
    }
  ];

  useEffect(() => {
    if (mounted && inputJs) {
      formatJavaScript();
    }
  }, [inputJs, indentSize, semicolons, mounted]);

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
            {t('title', 'JavaScript Formatter')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Beautify and organize your JavaScript code with proper formatting')}
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
                      {t('input_javascript', 'Input JavaScript')}
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
                    value={inputJs}
                    onChange={(e) => setInputJs(e.target.value)}
                    className="w-full h-80 p-4 font-mono text-sm focus:outline-none resize-none"
                    placeholder={t('paste_js', 'Paste your JavaScript code here...')}
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
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('indent_size', 'Indent Size')}: {indentSize} {t('spaces', 'spaces')}
                      </label>
                      <input
                        type="range"
                        min="2"
                        max="8"
                        step="2"
                        value={indentSize}
                        onChange={(e) => setIndentSize(Number(e.target.value))}
                        className="w-full"
                        style={{ accentColor: themeColors.primary }}
                      />
                      <div className="flex justify-between text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                        <span>2 {t('spaces', 'spaces')}</span>
                        <span>4 {t('spaces', 'spaces')}</span>
                        <span>8 {t('spaces', 'spaces')}</span>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={semicolons}
                          onChange={(e) => setSemicolons(e.target.checked)}
                          className="rounded"
                          style={{ accentColor: themeColors.primary }}
                        />
                        <span className="text-sm" style={{ color: themeColors.text.primary }}>
                          {t('add_semicolons', 'Add semicolons')}
                        </span>
                      </label>
                    </div>

                    <button
                      onClick={formatJavaScript}
                      className="w-full mt-4 py-3 px-4 rounded-lg hover:opacity-90 transition-colors font-semibold flex items-center justify-center gap-2"
                      style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                    >
                      <RefreshCw className="h-4 w-4" />
                      {t('format_js', 'Format JavaScript')}
                    </button>
                  </div>
                </div>

                {/* Sample Data */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                    {t('try_sample', 'Try Sample JavaScript')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sampleData.map((sample, index) => (
                      <button
                        key={index}
                        onClick={() => setInputJs(sample.code)}
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
                      {t('formatted_javascript', 'Formatted JavaScript')}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        disabled={!formattedJs}
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
                        onClick={downloadJs}
                        disabled={!formattedJs}
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
                        disabled={!formattedJs}
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
                  <pre 
                    className="w-full h-96 p-4 overflow-auto text-sm font-mono whitespace-pre-wrap"
                    style={{ 
                      backgroundColor: themeColors.background,
                      color: themeColors.text.primary
                    }}
                  >
                    {formattedJs || t('output_placeholder', 'Formatted JavaScript will appear here...')}
                  </pre>
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

                {/* JavaScript Tips */}
                <div className="rounded-xl p-6" style={{ 
                  backgroundColor: `${themeColors.primary}10`,
                  border: `1px solid ${themeColors.primary}30`
                }}>
                  <h3 className="font-semibold mb-2" style={{ color: themeColors.primary }}>
                    {t('js_tips', 'JavaScript Formatting Guidelines')}
                  </h3>
                  <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: themeColors.primary }}>
                    <li>{t('tip_1', 'Use consistent indentation (2 spaces is common in JavaScript)')}</li>
                    <li>{t('tip_2', 'Place braces on the same line as statements')}</li>
                    <li>{t('tip_3', 'Use meaningful variable and function names')}</li>
                    <li>{t('tip_4', 'Add spaces around operators and after commas')}</li>
                    <li>{t('tip_5', 'Break long lines for better readability')}</li>
                    <li>{t('tip_6', 'Be consistent with semicolon usage')}</li>
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
                        {t('recent_formats', 'Your recent JavaScript formatting operations')}
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
                                {t('js_format', 'JavaScript Format')}
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
                      {t('history_will_appear', 'Your JavaScript formatting operations will appear here')}
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
