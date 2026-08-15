
// components/tools/code-tools/base64-encoder/tool.client.tsx
"use client";



import { useState, useEffect } from "react";
import { Copy, RefreshCw, Lock, Unlock, FileText, Code, ArrowRightLeft, History, Download, Share2, CheckCircle } from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

interface HistoryEntry {
  id: number;
  mode: "encode" | "decode";
  input: string;
  output: string;

  timestamp: string;
}

export default function Base64EncoderClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
 
  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'code-tools' });
  const [mounted, setMounted] = useState(false);
  
  const [inputText, setInputText] = useState<string>("Hello, World!");
  const [outputText, setOutputText] = useState<string>("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copiedInput, setCopiedInput] = useState<boolean>(false);
  const [copiedOutput, setCopiedOutput] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'converter' | 'history'>('converter');

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `base64_encoder.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    // Load history from localStorage
    const savedHistory = localStorage.getItem('base64-encoder-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
  }, []);

  // ✅ FIX: Return string from encodeBase64
  const encodeBase64 = (text: string): string => {
    try {
      if (!text.trim()) {
        setOutputText("");
        setError("");
        return "";
      }
      const encoded = btoa(unescape(encodeURIComponent(text)));
      setOutputText(encoded);
      setError("");
      return encoded;
    } catch (err) {
      setError(t('encode_error', 'Failed to encode text. Check for special characters.'));
      setOutputText("");
      return "";
    }
  };

  // ✅ FIX: Return string from decodeBase64
  const decodeBase64 = (text: string): string => {
    try {
      if (!text.trim()) {
        setOutputText("");
        setError("");
        return "";
      }
      const cleaned = text.replace(/\s/g, '');
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
        throw new Error("Invalid Base64 string");
      }
      const decoded = decodeURIComponent(escape(atob(cleaned)));
      setOutputText(decoded);
      setError("");
      return decoded;
    } catch (err) {
      setError(t('decode_error', 'Invalid Base64 string. Please check your input.'));
      setOutputText("");
      return "";
    }
  };

  // ✅ FIX: Now result will always be string (not undefined)
  const handleInputChange = (text: string) => {
    setInputText(text);
    let result = "";
    if (mode === "encode") {
      result = encodeBase64(text);
    } else {
      result = decodeBase64(text);
    }
    
    // Save to history when there's valid output
    if (result && text.trim()) {
      const historyEntry: HistoryEntry = {
        id: Date.now(),
        mode,
        input: text,
        output: result,
        timestamp: new Date().toISOString()
      };
      const newHistory = [historyEntry, ...history.slice(0, 9)];
      setHistory(newHistory);
      try {
        localStorage.setItem('base64-encoder-history', JSON.stringify(newHistory));
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
      encodeBase64(outputText || "");
    } else {
      decodeBase64(outputText || "");
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
    const text = `${t('export_header', '=== BASE64 ENCODE/DECODE REPORT ===')}\n` +
                 `${t('date', 'Date')}: ${new Date().toLocaleDateString()}\n` +
                 `${t('mode', 'Mode')}: ${mode === "encode" ? t('encode', 'Encode') : t('decode', 'Decode')}\n` +
                 `${t('input', 'Input')}: ${inputText}\n` +
                 `${t('output', 'Output')}: ${outputText}\n` +
                 `\n${t('generated_by', '=== Generated by Centre.com.pk Base64 Encoder ===')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `base64-${mode}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    const shareText = `${t('share_text', 'Base64 conversion result')}: ${mode === "encode" ? t('encoded', 'Encoded') : t('decoded', 'Decoded')} - ${outputText.substring(0, 100)}`;
    if (navigator.share) {
      navigator.share({
        title: t('share_title', 'Base64 Conversion Result'),
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
      localStorage.removeItem('base64-encoder-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setMode(entry.mode);
    setInputText(entry.input);
    setOutputText(entry.output);
    setActiveTab('converter');
  };

  const sampleData = [
    { name: t('sample_simple', 'Simple Text'), text: "Hello, World!", base64: "SGVsbG8sIFdvcmxkIQ==" },
    { name: t('sample_json', 'JSON Example'), text: '{"name":"John","age":30}', base64: "eyJuYW1lIjoiSm9obiIsImFnZSI6MzB9" },
    { name: t('sample_email', 'Email'), text: "user@example.com", base64: "dXNlckBleGFtcGxlLmNvbQ==" },
    { name: t('sample_numbers', 'Numbers'), text: "1234567890", base64: "MTIzNDU2Nzg5MA==" }
  ];

  useEffect(() => {
    if (mounted) {
      encodeBase64(inputText);
    }
  }, [mounted]);

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
            {t('title', 'Base64 Encoder / Decoder')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Encode text to Base64 or decode Base64 back to text')}
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
            <Code className="h-4 w-4" />
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
                      <ArrowRightLeft className="h-6 w-6" style={{ color: themeColors.primary }} />
                      <h2 className="text-xl font-semibold" style={{ color: themeColors.text.primary }}>
                        {t('encoding_mode', 'Encoding Mode')}
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
                        <Lock className="h-4 w-4" />
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
                        <Unlock className="h-4 w-4" />
                        {t('decode', 'Decode')}
                      </button>
                    </div>
                  </div>

                  {/* Current Mode Info */}
                  <div className="p-4 rounded-lg" style={{ backgroundColor: `${themeColors.primary}10` }}>
                    <div className="flex items-center gap-3">
                      {mode === "encode" ? (
                        <>
                          <Lock className="h-5 w-5" style={{ color: themeColors.primary }} />
                          <div>
                            <div className="font-medium" style={{ color: themeColors.text.primary }}>
                              {t('encode_active', 'Encoding Mode Active')}
                            </div>
                            <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                              {t('encode_desc', 'Text → Base64 conversion')}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <Unlock className="h-5 w-5" style={{ color: themeColors.primary }} />
                          <div>
                            <div className="font-medium" style={{ color: themeColors.text.primary }}>
                              {t('decode_active', 'Decoding Mode Active')}
                            </div>
                            <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                              {t('decode_desc', 'Base64 → Text conversion')}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sample Data */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                    {t('try_sample', 'Try Sample Data')}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sampleData.map((sample, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (mode === "encode") {
                            setInputText(sample.text);
                            encodeBase64(sample.text);
                          } else {
                            setInputText(sample.base64);
                            decodeBase64(sample.base64);
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
                          {mode === "encode" ? sample.text.substring(0, 20) : sample.base64.substring(0, 20)}...
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
                          {mode === "encode" ? t('text_to_encode', 'Text to Encode') : t('base64_to_decode', 'Base64 to Decode')}
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
                        placeholder={mode === "encode" ? t('enter_text', 'Enter text to encode to Base64...') : t('enter_base64', 'Enter Base64 string to decode...')}
                        spellCheck="false"
                      />
                      <div className="text-xs mt-1 flex justify-between" style={{ color: themeColors.text.secondary }}>
                        <span>{t('characters', 'Characters')}: {inputText.length}</span>
                        <span>{t('bytes', 'Bytes')}: {new Blob([inputText]).size}</span>
                      </div>
                    </div>

                    {/* Output Area */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium" style={{ color: themeColors.text.primary }}>
                          {mode === "encode" ? t('base64_output', 'Base64 Output') : t('decoded_text', 'Decoded Text')}
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
                        placeholder={mode === "encode" ? t('output_placeholder', 'Base64 encoded text will appear here...') : t('output_placeholder_decode', 'Decoded text will appear here...')}
                      />
                      <div className="text-xs mt-1 flex justify-between" style={{ color: themeColors.text.secondary }}>
                        <span>{t('characters', 'Characters')}: {outputText.length}</span>
                        {mode === "encode" && <span>{t('size_increase', 'Size increase')}: {Math.round((outputText.length / Math.max(1, inputText.length)) * 100)}%</span>}
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

                {/* Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* What is Base64 */}
                  <div className="p-6 rounded-xl border" style={{ 
                    backgroundColor: `${themeColors.primary}10`,
                    borderColor: `${themeColors.primary}30`
                  }}>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.primary }}>
                      {t('what_is_base64', 'What is Base64?')}
                    </h3>
                    <ul className="text-sm space-y-2" style={{ color: themeColors.text.secondary }}>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: themeColors.primary }} />
                        <span>{t('base64_desc_1', 'Base64 is an encoding scheme that converts binary data to ASCII text')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: themeColors.primary }} />
                        <span>{t('base64_desc_2', 'Used for transmitting data over media that are designed to deal with textual data')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: themeColors.primary }} />
                        <span>{t('base64_desc_3', 'Commonly used for email attachments, data URLs, and encoding credentials')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: themeColors.primary }} />
                        <span>{t('base64_desc_4', 'Increases data size by approximately 33%')}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Usage Tips */}
                  <div className="p-6 rounded-xl border" style={{ 
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.border
                  }}>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: themeColors.text.primary }}>
                      {t('usage_tips', 'Usage Tips')}
                    </h3>
                    <ul className="text-sm space-y-2" style={{ color: themeColors.text.secondary }}>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: themeColors.success }} />
                        <span>{t('tip_1', 'Use for encoding images, files, or binary data in text format')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: themeColors.success }} />
                        <span>{t('tip_2', 'Perfect for storing complex data in cookies or localStorage')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: themeColors.success }} />
                        <span>{t('tip_3', 'Base64 strings always have length divisible by 4 (with padding =)')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: themeColors.success }} />
                        <span>{t('tip_4', 'Works with UTF-8 characters and special symbols')}</span>
                      </li>
                    </ul>
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
                        {t('recent_conversions', 'Your recent Base64 conversions')}
                      </p>
                    </div>
                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="px-4 py-2 border rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                        style={{ 
                          borderColor: themeColors.error,
                          color: themeColors.error
                        }}
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
                                <Lock className="h-4 w-4" style={{ color: themeColors.primary }} />
                              ) : (
                                <Unlock className="h-4 w-4" style={{ color: themeColors.primary }} />
                              )}
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.mode === "encode" ? t('encode', 'Encode') : t('decode', 'Decode')}
                              </span>
                            </div>
                            <p className="text-sm font-mono truncate" style={{ color: themeColors.text.secondary }}>
                              {entry.input.substring(0, 50)}...
                            </p>
                            <p className="text-xs mt-1 opacity-60" style={{ color: themeColors.text.secondary }}>
                              {new Date(entry.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => loadHistoryEntry(entry)}
                            className="px-3 py-1 text-xs rounded hover:opacity-80 transition-opacity"
                            style={{ 
                              backgroundColor: themeColors.primary,
                              color: themeColors.text.accent
                            }}
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
                      {t('history_will_appear', 'Your Base64 conversions will appear here')}
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
