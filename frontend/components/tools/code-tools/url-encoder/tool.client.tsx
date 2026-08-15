
// components/tools/code-tools/url-encoder/tool.client.tsx
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';


import { useState, useEffect } from "react";
import { Copy, RefreshCw, Link, Unlink, Globe, FileText, ArrowRightLeft, History, Download, Share2, CheckCircle, Trash2, Code, Info } from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

interface HistoryEntry {
  id: number;
  mode: "encode" | "decode";
  input: string;
  output: string;
  encodeComponents: boolean;

  timestamp: string;
}

export default function URLEncoderClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'code-tools' });
  const [mounted, setMounted] = useState(false);
  
  const [inputText, setInputText] = useState<string>("https://example.com/search?q=hello world&page=1");
  const [outputText, setOutputText] = useState<string>("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copiedInput, setCopiedInput] = useState<boolean>(false);
  const [copiedOutput, setCopiedOutput] = useState<boolean>(false);
  const [encodeComponents, setEncodeComponents] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'converter' | 'history'>('converter');
  const [showInfo, setShowInfo] = useState<boolean>(false);

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `url_encoder.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    // Load history from localStorage
    const savedHistory = localStorage.getItem('url-encoder-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
  }, []);

  const encodeURL = (text: string): string => {
    try {
      if (!text.trim()) {
        setOutputText("");
        setError("");
        return "";
      }
      
      let encoded = "";
      if (encodeComponents) {
        encoded = encodeURIComponent(text);
      } else {
        encoded = encodeURI(text);
      }
      setOutputText(encoded);
      setError("");
      return encoded;
    } catch (err) {
      setError(t('encode_error', 'Error: Invalid characters in input'));
      setOutputText("");
      return "";
    }
  };

  const decodeURL = (text: string): string => {
    try {
      if (!text.trim()) {
        setOutputText("");
        setError("");
        return "";
      }
      
      let decoded = "";
      try {
        decoded = decodeURIComponent(text);
      } catch {
        decoded = decodeURI(text);
      }
      setOutputText(decoded);
      setError("");
      return decoded;
    } catch (err) {
      setError(t('decode_error', 'Error: Invalid encoded URL'));
      setOutputText("");
      return "";
    }
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    let result = "";
    if (mode === "encode") {
      result = encodeURL(text);
    } else {
      result = decodeURL(text);
    }
    
    // Save to history when there's valid output
    if (result && text.trim()) {
      const historyEntry: HistoryEntry = {
        id: Date.now(),
        mode,
        input: text,
        output: result,
        encodeComponents,
        timestamp: new Date().toISOString()
      };
      const newHistory = [historyEntry, ...history.slice(0, 9)];
      setHistory(newHistory);
      try {
        localStorage.setItem('url-encoder-history', JSON.stringify(newHistory));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    }
  };

  const toggleMode = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInputText(outputText || "");
    if (newMode === "encode") {
      encodeURL(outputText || "");
    } else {
      decodeURL(outputText || "");
    }
  };

  const copyToClipboard = async (text: string, type: "input" | "output") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "input") {
        setCopiedInput(true);
        setTimeout(() => setCopiedInput(false), 2000);
      } else {
        setCopiedOutput(true);
        setTimeout(() => setCopiedOutput(false), 2000);
      }
    } catch (err) {
      alert(t('copy_failed', 'Failed to copy text'));
    }
  };

  const clearAll = () => {
    setInputText("");
    setOutputText("");
    setError("");
  };

  const exportAsText = () => {
    const text = `${t('export_header', '=== URL ENCODE/DECODE REPORT ===')}\n` +
                 `${t('date', 'Date')}: ${new Date().toLocaleDateString()}\n` +
                 `${t('mode', 'Mode')}: ${mode === "encode" ? t('encode', 'Encode') : t('decode', 'Decode')}\n` +
                 `${t('method', 'Method')}: ${encodeComponents ? 'encodeURIComponent()' : 'encodeURI()'}\n` +
                 `${t('input', 'Input')}: ${inputText}\n` +
                 `${t('output', 'Output')}: ${outputText}\n` +
                 `${t('input_length', 'Input Length')}: ${inputText.length} ${t('characters', 'characters')}\n` +
                 `${t('output_length', 'Output Length')}: ${outputText.length} ${t('characters', 'characters')}\n\n` +
                 `${t('generated_by', '=== Generated by Centre.com.pk URL Encoder ===')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `url-${mode}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    const shareText = `${t('share_text', 'URL conversion result')}: ${mode === "encode" ? t('encoded', 'Encoded') : t('decoded', 'Decoded')} - ${outputText.substring(0, 100)}`;
    if (navigator.share) {
      navigator.share({
        title: t('share_title', 'URL Conversion Result'),
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert(t('copied_to_clipboard', 'Results copied to clipboard!'));
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('url-encoder-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setMode(entry.mode);
    setEncodeComponents(entry.encodeComponents);
    setInputText(entry.input);
    setOutputText(entry.output);
    setActiveTab('converter');
  };

  const sampleData = [
    { name: t('sample_search', 'Search Query'), url: "https://example.com/search?q=hello world&sort=price", encoded: "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26sort%3Dprice" },
    { name: t('sample_email', 'Email Link'), url: "mailto:user@example.com?subject=Hello&body=How are you?", encoded: "mailto%3Auser%40example.com%3Fsubject%3DHello%26body%3DHow%20are%20you%3F" },
    { name: t('sample_special', 'Special Characters'), url: "https://site.com/path/file#section&param=value", encoded: "https%3A%2F%2Fsite.com%2Fpath%2Ffile%23section%26param%3Dvalue" },
    { name: t('sample_unicode', 'Unicode Text'), url: "https://example.com/search?q=مرحبا بالعالم", encoded: "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3D%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D8%A8%D8%A7%D9%84%D8%B9%D8%A7%D9%84%D9%85" }
  ];

  const specialCharacters = [
    { char: t('char_space', 'Space'), encoded: "%20", example: "hello world" },
    { char: t('char_ampersand', 'Ampersand (&)'), encoded: "%26", example: "a&b" },
    { char: t('char_question', 'Question Mark (?)'), encoded: "%3F", example: "q=test" },
    { char: t('char_equals', 'Equals (=)'), encoded: "%3D", example: "key=value" },
    { char: t('char_slash', 'Slash (/)'), encoded: "%2F", example: "path/to/file" },
    { char: t('char_colon', 'Colon (:)'), encoded: "%3A", example: "https:" },
    { char: t('char_at', 'At sign (@)'), encoded: "%40", example: "user@example.com" },
    { char: t('char_hash', 'Hash (#)'), encoded: "%23", example: "section#id" }
  ];

  useEffect(() => {
    if (mounted && inputText && mode === "encode") {
      encodeURL(inputText);
    }
  }, [encodeComponents, mounted]);

  useEffect(() => {
    if (mounted && inputText && mode === "encode") {
      encodeURL(inputText);
    }
  }, [inputText, mode, mounted]);

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
              <Link className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'URL Encoder / Decoder')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Encode URLs for web or decode encoded URLs back to readable format')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('converter')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'converter' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'converter' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'converter' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'converter' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Link className="h-4 w-4" />
            {t('tab_converter', 'Converter')}
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
            onClick={() => setShowInfo(!showInfo)}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${showInfo ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: showInfo ? themeColors.primary : themeColors.surface,
              color: showInfo ? '#ffffff' : themeColors.text.secondary,
              border: showInfo ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Info className="h-4 w-4" />
            {t('tab_info', 'Info')}
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
            
            {/* Converter Tab */}
            {activeTab === 'converter' && (
              <div className="space-y-6">
                {/* Mode Toggle */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Link className="h-6 w-6" style={{ color: themeColors.primary }} />
                      <h2 className="text-xl font-semibold" style={{ color: themeColors.text.primary }}>
                        {t('encoding_mode', 'URL Encoding Mode')}
                      </h2>
                    </div>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={() => setMode("encode")}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${mode === "encode" ? '' : 'opacity-70'}`}
                        style={{ 
                          backgroundColor: mode === "encode" ? themeColors.primary : `${themeColors.primary}10`,
                          color: mode === "encode" ? themeColors.text.accent : themeColors.primary
                        }}
                      >
                        <Link className="h-4 w-4" />
                        {t('encode', 'Encode')}
                      </button>
                      <button
                        onClick={() => setMode("decode")}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${mode === "decode" ? '' : 'opacity-70'}`}
                        style={{ 
                          backgroundColor: mode === "decode" ? themeColors.primary : `${themeColors.primary}10`,
                          color: mode === "decode" ? themeColors.text.accent : themeColors.primary
                        }}
                      >
                        <Unlink className="h-4 w-4" />
                        {t('decode', 'Decode')}
                      </button>
                    </div>
                  </div>

                  {/* Encoding Options */}
                  {mode === "encode" && (
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: themeColors.background, borderColor: themeColors.border }}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5" style={{ color: themeColors.primary }} />
                          <div>
                            <div className="font-medium" style={{ color: themeColors.text.primary }}>
                              {t('encoding_type', 'Encoding Type')}
                            </div>
                            <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                              {t('encoding_desc', 'Choose how to encode your URL')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-4">
                          <button
                            onClick={() => setEncodeComponents(true)}
                            className={`px-4 py-1 text-sm rounded transition-colors ${encodeComponents ? 'font-semibold' : ''}`}
                            style={{ 
                              backgroundColor: encodeComponents ? themeColors.primary : `${themeColors.primary}10`,
                              color: encodeComponents ? themeColors.text.accent : themeColors.primary,
                              border: `1px solid ${encodeComponents ? 'transparent' : `${themeColors.primary}30`}`
                            }}
                          >
                            encodeURIComponent()
                          </button>
                          <button
                            onClick={() => setEncodeComponents(false)}
                            className={`px-4 py-1 text-sm rounded transition-colors ${!encodeComponents ? 'font-semibold' : ''}`}
                            style={{ 
                              backgroundColor: !encodeComponents ? themeColors.primary : `${themeColors.primary}10`,
                              color: !encodeComponents ? themeColors.text.accent : themeColors.primary,
                              border: `1px solid ${!encodeComponents ? 'transparent' : `${themeColors.primary}30`}`
                            }}
                          >
                            encodeURI()
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm" style={{ color: themeColors.text.secondary }}>
                        {encodeComponents ? 
                          t('encode_components_desc', 'Encodes all characters except: A-Z a-z 0-9 - _ . ! ~ * \' ( )') :
                          t('encode_uri_desc', 'Encodes special characters but keeps URL structure intact (:/?#[]@)')
                        }
                      </div>
                    </div>
                  )}
                </div>

                {/* Sample Data */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                    {t('try_sample', 'Try Sample URLs')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sampleData.map((sample, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (mode === "encode") {
                            setInputText(sample.url);
                            encodeURL(sample.url);
                          } else {
                            setInputText(sample.encoded);
                            decodeURL(sample.encoded);
                          }
                        }}
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
                          {mode === "encode" ? sample.url.substring(0, 40) : sample.encoded.substring(0, 40)}...
                        </div>
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
                          {mode === "encode" ? t('url_to_encode', 'URL to Encode') : t('encoded_to_decode', 'Encoded URL to Decode')}
                        </label>
                        <button
                          onClick={() => copyToClipboard(inputText, "input")}
                          disabled={!inputText}
                          className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:opacity-90 transition-colors disabled:opacity-50"
                          style={{ 
                            backgroundColor: copiedInput ? themeColors.success : themeColors.primary,
                            color: themeColors.text.accent
                          }}
                        >
                          {copiedInput ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copiedInput ? t('copied', 'Copied!') : t('copy', 'Copy')}
                        </button>
                      </div>
                      <textarea
                        value={inputText}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="w-full h-64 px-3 py-2 rounded-lg focus:ring-2 resize-none font-mono text-sm"
                        style={{ 
                          borderColor: themeColors.border,
                          backgroundColor: themeColors.background,
                          color: themeColors.text.primary,
                          outlineColor: themeColors.primary
                        }}
                        placeholder={mode === "encode" ? t('enter_url', 'Enter URL to encode...') : t('enter_encoded', 'Enter encoded URL to decode...')}
                        spellCheck="false"
                      />
                      <div className="text-xs mt-1 flex justify-between" style={{ color: themeColors.text.secondary }}>
                        <span>{t('characters', 'Characters')}: {inputText.length}</span>
                        {mode === "encode" && <span>{t('encoded_length', 'Encoded length')}: {encodeURIComponent(inputText).length}</span>}
                      </div>
                    </div>

                    {/* Output Area */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium" style={{ color: themeColors.text.primary }}>
                          {mode === "encode" ? t('encoded_url', 'Encoded URL') : t('decoded_url', 'Decoded URL')}
                        </label>
                        <button
                          onClick={() => copyToClipboard(outputText, "output")}
                          disabled={!outputText}
                          className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:opacity-90 transition-colors disabled:opacity-50"
                          style={{ 
                            backgroundColor: copiedOutput ? themeColors.success : themeColors.primary,
                            color: themeColors.text.accent
                          }}
                        >
                          {copiedOutput ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copiedOutput ? t('copied', 'Copied!') : t('copy', 'Copy')}
                        </button>
                      </div>
                      <textarea
                        value={outputText}
                        readOnly
                        className="w-full h-64 px-3 py-2 rounded-lg resize-none font-mono text-sm"
                        style={{ 
                          borderColor: themeColors.border,
                          backgroundColor: themeColors.background,
                          color: themeColors.text.primary
                        }}
                        placeholder={mode === "encode" ? t('output_placeholder', 'Encoded URL will appear here...') : t('output_placeholder_decode', 'Decoded URL will appear here...')}
                      />
                      <div className="text-xs mt-1 flex justify-between" style={{ color: themeColors.text.secondary }}>
                        <span>{t('characters', 'Characters')}: {outputText.length}</span>
                        {mode === "encode" && inputText && (
                          <span>{t('size_increase', 'Size increase')}: {Math.round(((outputText.length - inputText.length) / inputText.length) * 100)}%</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 rounded-lg mt-4 flex items-center gap-2" style={{ 
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

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={toggleMode}
                      className="flex-1 py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                      style={{ 
                        backgroundColor: `${themeColors.primary}80`,
                        color: themeColors.text.accent
                      }}
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                      {t('switch_to', 'Switch to')} {mode === "encode" ? t('decode', 'Decode') : t('encode', 'Encode')}
                    </button>
                    <button
                      onClick={clearAll}
                      className="px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center gap-2"
                      style={{ 
                        backgroundColor: themeColors.background,
                        border: `1px solid ${themeColors.border}`,
                        color: themeColors.text.secondary
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                      {t('clear', 'Clear All')}
                    </button>
                    <button
                      onClick={exportAsText}
                      disabled={!outputText}
                      className="px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
                      style={{ 
                        backgroundColor: themeColors.background,
                        border: `1px solid ${themeColors.border}`,
                        color: themeColors.text.secondary
                      }}
                    >
                      <Download className="h-4 w-4" />
                      {t('export', 'Export')}
                    </button>
                    <button
                      onClick={shareResults}
                      disabled={!outputText}
                      className="px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
                      style={{ 
                        backgroundColor: themeColors.background,
                        border: `1px solid ${themeColors.border}`,
                        color: themeColors.text.secondary
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                      {t('share', 'Share')}
                    </button>
                  </div>
                </div>

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* URL Encoding Guide */}
                {showInfo && (
                  <div className="rounded-xl p-6" style={{ 
                    backgroundColor: `${themeColors.primary}10`,
                    border: `1px solid ${themeColors.primary}30`
                  }}>
                    <h3 className="font-semibold mb-3" style={{ color: themeColors.primary }}>
                      {t('url_guide', 'URL Encoding Guide')}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="font-medium mb-1" style={{ color: themeColors.text.primary }}>
                          {t('encode_vs', 'encodeURI() vs encodeURIComponent()')}
                        </div>
                        <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                          <div className="mb-1">
                            <span className="font-medium" style={{ color: themeColors.primary }}>encodeURI():</span> {t('encode_uri_use', 'Use for complete URLs. Preserves ://, ?, &, =, etc.')}
                          </div>
                          <div>
                            <span className="font-medium" style={{ color: themeColors.primary }}>encodeURIComponent():</span> {t('encode_component_use', 'Use for URL components like query parameters.')}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium mb-1" style={{ color: themeColors.text.primary }}>
                          {t('when_to_use', 'When to URL Encode')}
                        </div>
                        <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: themeColors.text.secondary }}>
                          <li>{t('when_1', 'Query parameters with spaces or special characters')}</li>
                          <li>{t('when_2', 'File paths in URLs')}</li>
                          <li>{t('when_3', 'Email addresses in mailto: links')}</li>
                          <li>{t('when_4', 'Unicode/Non-ASCII characters in URLs')}</li>
                          <li>{t('when_5', 'JSON data in URL parameters')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Special Characters Table */}
                <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="p-4 border-b" style={{ borderColor: themeColors.border }}>
                    <h3 className="text-lg font-semibold" style={{ color: themeColors.text.primary }}>
                      {t('special_chars', 'URL Special Characters')}
                    </h3>
                  </div>
                  <div className="overflow-x-auto p-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${themeColors.border}` }}>
                          <th className="text-left py-2 font-medium" style={{ color: themeColors.text.primary }}>{t('character', 'Character')}</th>
                          <th className="text-left py-2 font-medium" style={{ color: themeColors.text.primary }}>{t('encoded', 'Encoded')}</th>
                          <th className="text-left py-2 font-medium" style={{ color: themeColors.text.primary }}>{t('example', 'Example')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {specialCharacters.map((char, index) => (
                          <tr key={index} style={{ borderBottom: `1px solid ${themeColors.border}` }}>
                            <td className="py-2 font-mono" style={{ color: themeColors.text.primary }}>{char.char}</td>
                            <td className="py-2 font-mono" style={{ color: themeColors.primary }}>{char.encoded}</td>
                            <td className="py-2 font-mono" style={{ color: themeColors.text.secondary }}>{char.example}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                        {t('conversion_history', 'Conversion History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_conversions', 'Your recent URL conversions')}
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
                              {entry.mode === "encode" ? (
                                <Link className="h-4 w-4" style={{ color: themeColors.primary }} />
                              ) : (
                                <Unlink className="h-4 w-4" style={{ color: themeColors.primary }} />
                              )}
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.mode === "encode" ? t('encode', 'Encode') : t('decode', 'Decode')}
                                {entry.mode === "encode" && ` (${entry.encodeComponents ? 'encodeURIComponent' : 'encodeURI'})`}
                              </span>
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
                      {t('no_history', 'No conversion history yet')}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your URL conversions will appear here')}
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
