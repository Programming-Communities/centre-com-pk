
// components/tools/code-tools/xml-formatter/tool.client.tsx
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useEffect } from "react";
import { Code, Copy, Download, Settings, CheckCircle, XCircle, History, Share2, Trash2, FileCode, RefreshCw, Eye } from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

interface HistoryEntry {
  id: number;
  input: string;
  output: string;
  indentSize: number;
  isValid: boolean;

  timestamp: string;
}

export default function XMLFormatterClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'code-tools' });
  const [mounted, setMounted] = useState(false);
  
  const [inputXML, setInputXML] = useState<string>(`<root><person><name>John</name><age>30</age><city>New York</city></person><items><item id="1">Apple</item><item id="2">Banana</item><item id="3">Cherry</item></items></root>`);
  const [formattedXML, setFormattedXML] = useState<string>("");
  const [indentSize, setIndentSize] = useState<number>(2);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'formatter' | 'history'>('formatter');
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `xml_formatter.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    // Load history from localStorage
    const savedHistory = localStorage.getItem('xml-formatter-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
  }, []);

  const formatXMLString = (xml: string, indent: number): string => {
    const PADDING = ' '.repeat(indent);
    const reg = /(>)(<)(\/*)/g;
    let formatted = '';
    let pad = 0;

    xml = xml.replace(reg, '$1\r\n$2$3');
    const nodes = xml.split('\r\n');

    nodes.forEach((node) => {
      let indentChange = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indentChange = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) {
          pad -= 1;
        }
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indentChange = 1;
      } else {
        indentChange = 0;
      }

      formatted += PADDING.repeat(pad) + node + '\r\n';
      pad += indentChange;
    });

    return formatted.trim();
  };

  const formatXML = (xmlString: string) => {
    try {
      if (!xmlString.trim()) {
        setFormattedXML("");
        setIsValid(true);
        setError("");
        return "";
      }

      // Validate XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      
      if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
        throw new Error(t('invalid_xml', 'Invalid XML format'));
      }

      // Format XML with proper indentation
      const formatted = formatXMLString(xmlString, indentSize);
      setFormattedXML(formatted);
      setIsValid(true);
      setError("");
      
      // Save to history
      const historyEntry: HistoryEntry = {
        id: Date.now(),
        input: xmlString,
        output: formatted,
        indentSize,
        isValid: true,
        timestamp: new Date().toISOString()
      };
      const newHistory = [historyEntry, ...history.slice(0, 9)];
      setHistory(newHistory);
      try {
        localStorage.setItem('xml-formatter-history', JSON.stringify(newHistory));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
      
      return formatted;
    } catch (err) {
      setIsValid(false);
      const errorMsg = err instanceof Error ? err.message : t('invalid_xml', 'Invalid XML');
      setError(errorMsg);
      setFormattedXML("");
      return "";
    }
  };

  const minifyXML = () => {
    try {
      if (!inputXML.trim()) return;

      const minified = inputXML
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
      
      setFormattedXML(minified);
      setIsValid(true);
      setError("");
      
      // Save to history
      const historyEntry: HistoryEntry = {
        id: Date.now(),
        input: inputXML,
        output: minified,
        indentSize,
        isValid: true,
        timestamp: new Date().toISOString()
      };
      const newHistory = [historyEntry, ...history.slice(0, 9)];
      setHistory(newHistory);
      try {
        localStorage.setItem('xml-formatter-history', JSON.stringify(newHistory));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    } catch (err) {
      setIsValid(false);
      setError(t('minify_error', 'Failed to minify XML'));
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert(t('copy_failed', 'Failed to copy XML'));
    }
  };

  const downloadXML = () => {
    const blob = new Blob([formattedXML], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsText = () => {
    const text = `${t('export_header', '=== XML FORMATTING REPORT ===')}\n` +
                 `${t('date', 'Date')}: ${new Date().toLocaleDateString()}\n` +
                 `${t('indent_size', 'Indent Size')}: ${indentSize} ${t('spaces', 'spaces')}\n` +
                 `${t('status', 'Status')}: ${isValid ? t('valid', 'Valid XML') : t('invalid', 'Invalid XML')}\n` +
                 `${t('input_length', 'Input Length')}: ${inputXML.length} ${t('characters', 'characters')}\n` +
                 `${t('output_length', 'Output Length')}: ${formattedXML.length} ${t('characters', 'characters')}\n\n` +
                 `${t('formatted_xml', 'Formatted XML')}:\n${formattedXML}\n\n` +
                 `${t('generated_by', '=== Generated by Centre.com.pk XML Formatter ===')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xml-formatted-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    const shareText = `${t('share_text', 'XML Formatted')}: ${formattedXML.substring(0, 200)}...`;
    if (navigator.share) {
      navigator.share({
        title: t('share_title', 'XML Formatting Result'),
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert(t('copied_to_clipboard', 'Results copied to clipboard!'));
    }
  };

  const clearAll = () => {
    setInputXML('');
    setFormattedXML('');
    setIsValid(true);
    setError('');
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('xml-formatter-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setInputXML(entry.input);
    setFormattedXML(entry.output);
    setIsValid(entry.isValid);
    setIndentSize(entry.indentSize);
    setActiveTab('formatter');
  };

  const sampleXMLs = [
    { name: t('sample_simple', 'Simple XML'), value: `<books><book id="1"><title>JavaScript Basics</title><author>John Doe</author><year>2023</year></book><book id="2"><title>React Mastery</title><author>Jane Smith</author><year>2024</year></book></books>` },
    { name: t('sample_config', 'Configuration'), value: `<configuration><database><host>localhost</host><port>3306</port><name>myapp</name><username>root</username></database><server><port>3000</port><environment>development</environment></server></configuration>` },
    { name: t('sample_user', 'User Data'), value: `<users><user><id>101</id><name>Alice</name><email>alice@example.com</email><role>admin</role></user><user><id>102</id><name>Bob</name><email>bob@example.com</email><role>user</role></user></users>` },
    { name: t('sample_nested', 'Nested Elements'), value: `<catalog><product id="P001"><name>Wireless Mouse</name><price currency="USD">29.99</price><specifications><weight>0.2kg</weight><color>Black</color><brand>TechCorp</brand></specifications></product></catalog>` }
  ];

  useEffect(() => {
    if (mounted && inputXML) {
      formatXML(inputXML);
    }
  }, [indentSize, mounted]);

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
            {t('title', 'XML Formatter')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Format, validate, and beautify XML documents')}
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
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${showPreview && formattedXML ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: showPreview && formattedXML ? themeColors.primary : themeColors.surface,
              color: showPreview && formattedXML ? '#ffffff' : themeColors.text.secondary,
              border: showPreview && formattedXML ? 'none' : `1px solid ${themeColors.border}`
            }}
            disabled={!formattedXML}
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
                {/* Sample XML Buttons */}
                <div className="rounded-xl border p-4" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <label className="block text-sm font-medium mb-3" style={{ color: themeColors.text.primary }}>
                    {t('try_sample', 'Try Sample XML')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sampleXMLs.map((sample, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInputXML(sample.value);
                          formatXML(sample.value);
                        }}
                        className="px-3 py-2 text-sm rounded-lg border transition-colors hover:opacity-90"
                        style={{ 
                          backgroundColor: `${themeColors.primary}10`,
                          borderColor: `${themeColors.primary}30`,
                          color: themeColors.primary
                        }}
                      >
                        {sample.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input and Output Areas */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input Area */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium" style={{ color: themeColors.text.primary }}>
                          {t('input_xml', 'Input XML')}
                        </label>
                        <button
                          onClick={() => copyToClipboard(inputXML)}
                          disabled={!inputXML}
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
                        value={inputXML}
                        onChange={(e) => {
                          setInputXML(e.target.value);
                          formatXML(e.target.value);
                        }}
                        className="w-full h-80 px-3 py-2 rounded-lg focus:ring-2 resize-none font-mono text-sm"
                        style={{ 
                          borderColor: themeColors.border,
                          backgroundColor: themeColors.background,
                          color: themeColors.text.primary,
                          outlineColor: themeColors.primary
                        }}
                        placeholder={t('paste_xml', 'Paste your XML here...')}
                        spellCheck="false"
                      />
                      <div className="text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                        {t('characters', 'Characters')}: {inputXML.length}
                      </div>
                    </div>

                    {/* Output Area */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium" style={{ color: themeColors.text.primary }}>
                          {t('formatted_xml', 'Formatted XML')}
                        </label>
                        <div className="flex gap-2">
                          {formattedXML && (
                            <>
                              <button
                                onClick={() => copyToClipboard(formattedXML)}
                                className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:opacity-90 transition-colors"
                                style={{ 
                                  backgroundColor: themeColors.primary,
                                  color: themeColors.text.accent
                                }}
                              >
                                <Copy className="h-3 w-3" />
                                {t('copy', 'Copy')}
                              </button>
                              <button
                                onClick={downloadXML}
                                className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:opacity-90 transition-colors"
                                style={{ 
                                  backgroundColor: `${themeColors.primary}80`,
                                  color: themeColors.text.accent
                                }}
                              >
                                <Download className="h-3 w-3" />
                                {t('download', 'Download')}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {showPreview && formattedXML && isValid ? (
                        <pre 
                          className="w-full h-80 p-3 rounded-lg overflow-auto font-mono whitespace-pre-wrap text-sm"
                          style={{ 
                            border: `1px solid ${themeColors.border}`,
                            backgroundColor: themeColors.background,
                            color: themeColors.text.primary
                          }}
                        >
                          {formattedXML}
                        </pre>
                      ) : (
                        <textarea
                          value={formattedXML}
                          readOnly
                          className="w-full h-80 px-3 py-2 rounded-lg resize-none font-mono text-sm"
                          style={{ 
                            borderColor: themeColors.border,
                            backgroundColor: themeColors.background,
                            color: themeColors.text.primary
                          }}
                          placeholder={t('output_placeholder', 'Formatted XML will appear here...')}
                        />
                      )}
                      <div className="text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                        {t('characters', 'Characters')}: {formattedXML.length}
                      </div>
                    </div>
                  </div>

                  {/* Validation Status */}
                  {inputXML && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg mt-4`}
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
                        {isValid ? t('valid_xml', 'Valid XML') : `${t('invalid_xml', 'Invalid XML')}: ${error}`}
                      </span>
                    </div>
                  )}

                  {/* Formatting Options */}
                  <div className="p-4 rounded-lg border mt-4" style={{ 
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border
                  }}>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <Settings className="h-4 w-4" />
                      {t('formatting_options', 'Formatting Options')}
                    </h3>
                    
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
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={() => formatXML(inputXML)}
                      className="flex-1 py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                      style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                    >
                      <RefreshCw className="h-4 w-4" />
                      {t('format_xml', 'Format XML')}
                    </button>
                    <button
                      onClick={minifyXML}
                      disabled={!inputXML.trim()}
                      className="flex-1 py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{ backgroundColor: `${themeColors.primary}80`, color: themeColors.text.accent }}
                    >
                      <Code className="h-4 w-4" />
                      {t('minify_xml', 'Minify XML')}
                    </button>
                    <button
                      onClick={clearAll}
                      className="px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center gap-2"
                      style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                    >
                      <Trash2 className="h-4 w-4" />
                      {t('clear', 'Clear All')}
                    </button>
                    <button
                      onClick={exportAsText}
                      disabled={!formattedXML}
                      className="px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
                      style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                    >
                      <Download className="h-4 w-4" />
                      {t('export', 'Export')}
                    </button>
                    <button
                      onClick={shareResults}
                      disabled={!formattedXML}
                      className="px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
                      style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                    >
                      <Share2 className="h-4 w-4" />
                      {t('share', 'Share')}
                    </button>
                  </div>
                </div>

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* XML Tips */}
                <div className="rounded-xl p-6" style={{ 
                  backgroundColor: `${themeColors.primary}10`,
                  border: `1px solid ${themeColors.primary}30`
                }}>
                  <h3 className="font-semibold mb-2" style={{ color: themeColors.primary }}>
                    {t('xml_tips', 'XML Formatting Guidelines')}
                  </h3>
                  <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: themeColors.primary }}>
                    <li>{t('tip_1', 'Always include a root element')}</li>
                    <li>{t('tip_2', 'All XML elements must have a closing tag')}</li>
                    <li>{t('tip_3', 'XML tags are case sensitive')}</li>
                    <li>{t('tip_4', 'XML elements must be properly nested')}</li>
                    <li>{t('tip_5', 'Attribute values must be quoted')}</li>
                    <li>{t('tip_6', 'Use consistent indentation (2 or 4 spaces)')}</li>
                    <li>{t('tip_7', 'Avoid special characters in tag names')}</li>
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
                        {t('recent_formats', 'Your recent XML formatting operations')}
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
                                {t('xml_format', 'XML Format')}
                              </span>
                              {entry.isValid ? (
                                <CheckCircle className="h-3 w-3" style={{ color: themeColors.success }} />
                              ) : (
                                <XCircle className="h-3 w-3" style={{ color: themeColors.error }} />
                              )}
                            </div>
                            <p className="text-sm font-mono truncate" style={{ color: themeColors.text.secondary }}>
                              {entry.input.substring(0, 60)}...
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
                      {t('history_will_appear', 'Your XML formatting operations will appear here')}
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
