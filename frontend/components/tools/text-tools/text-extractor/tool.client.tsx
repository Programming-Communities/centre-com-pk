
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { 
  Copy, RotateCcw, Search, CheckCircle, AlertCircle, X,
  FileText, Download, Trash2, Eye, EyeOff, Hash,
  Mail, Link, Phone, HashIcon, Type, Code, Database,
  Settings, Plus, Minus, Filter, Sparkles,
  Calendar
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// Types
type ExtractionType = 'emails' | 'urls' | 'phones' | 'numbers' | 'words' | 'ips' | 'dates' | 'custom';

interface ExtractorHistory {
  id: number;
  timestamp: string;
  type: ExtractionType;
  matchCount: number;
  pattern?: string;
}

interface PatternInfo {
  id: ExtractionType;
  name: string;
  icon: React.ElementType;
  pattern: RegExp;
  description: string;
  example: string;
}

export default function TextExtractorClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'text-tools' });
  const [mounted, setMounted] = useState(false);
  
  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `text_extractor.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // State
  const [inputText, setInputText] = useState('');
  const [pattern, setPattern] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  const [extractionType, setExtractionType] = useState<ExtractionType>('emails');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'extractor' | 'preview' | 'history'>('extractor');
  const [history, setHistory] = useState<ExtractorHistory[]>([]);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [globalMatch, setGlobalMatch] = useState(true);
  const [multiline, setMultiline] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [uniqueCount, setUniqueCount] = useState(0);
  const [showHighlighted, setShowHighlighted] = useState(true);

  // Pattern definitions
  const patterns: PatternInfo[] = [
    { 
      id: 'emails', 
      name: t('emails', 'Email Addresses'), 
      icon: Mail,
      pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      description: t('emails_desc', 'Extract all email addresses from text'),
      example: 'user@example.com, admin@domain.co.uk'
    },
    { 
      id: 'urls', 
      name: t('urls', 'URLs'), 
      icon: Link,
      pattern: /https?:\/\/[^\s<>"{}|\\^`[\]]+/g,
      description: t('urls_desc', 'Extract HTTP/HTTPS URLs'),
      example: 'https://example.com, http://test.org/page'
    },
    { 
      id: 'phones', 
      name: t('phones', 'Phone Numbers'), 
      icon: Phone,
      pattern: /(\+?(\d{1,3})[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
      description: t('phones_desc', 'Extract phone numbers in various formats'),
      example: '(555) 123-4567, +1-555-123-4567'
    },
    { 
      id: 'numbers', 
      name: t('numbers', 'Numbers'), 
      icon: HashIcon,
      pattern: /\b\d+(?:\.\d+)?\b/g,
      description: t('numbers_desc', 'Extract all numeric values'),
      example: '123, 45.67, 1000'
    },
    { 
      id: 'words', 
      name: t('words', 'Words'), 
      icon: Type,
      pattern: /\b[a-zA-Z]+(?:[-\'][a-zA-Z]+)?\b/g,
      description: t('words_desc', 'Extract all words from text'),
      example: 'hello world programming'
    },
    { 
      id: 'ips', 
      name: t('ips', 'IP Addresses'), 
      icon: Hash,
      pattern: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
      description: t('ips_desc', 'Extract IPv4 addresses'),
      example: '192.168.1.1, 10.0.0.1'
    },
    { 
      id: 'dates', 
      name: t('dates', 'Dates'), 
      icon: Calendar,
      pattern: /\b\d{4}-\d{2}-\d{2}\b|\b\d{2}\/\d{2}\/\d{4}\b|\b\d{2}-\d{2}-\d{4}\b/g,
      description: t('dates_desc', 'Extract dates in various formats'),
      example: '2024-01-15, 01/15/2024'
    },
    { 
      id: 'custom', 
      name: t('custom', 'Custom Pattern'), 
      icon: Code,
      pattern: /(?:)/g,
      description: t('custom_desc', 'Use your own regular expression pattern'),
      example: '/pattern/flags'
    },
  ];

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
      const savedHistory = localStorage.getItem('text-extractor-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const saveToHistory = (type: ExtractionType, count: number, customPattern?: string) => {
    const entry: ExtractorHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: type,
      matchCount: count,
      pattern: customPattern,
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('text-extractor-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to history:', e);
    }
  };

  const buildRegex = (): RegExp | null => {
    let regexPattern: RegExp;
    
    if (extractionType === 'custom') {
      if (!pattern.trim()) {
        setError(t('enter_pattern', 'Please enter a custom pattern'));
        return null;
      }
      try {
        let flags = '';
        if (globalMatch) flags += 'g';
        if (caseSensitive) flags += 'i';
        if (multiline) flags += 'm';
        regexPattern = new RegExp(pattern, flags);
      } catch (err) {
        setError(t('invalid_regex', 'Invalid regular expression pattern'));
        return null;
      }
    } else {
      const selectedPattern = patterns.find(p => p.id === extractionType);
      if (!selectedPattern) return null;
      let flags = 'g';
      if (caseSensitive) flags += 'i';
      if (multiline) flags += 'm';
      regexPattern = new RegExp(selectedPattern.pattern.source, flags);
    }
    
    return regexPattern;
  };

  const extractText = () => {
    if (!inputText.trim()) {
      setError(t('no_text', 'Please enter some text to extract from'));
      return;
    }

    const regex = buildRegex();
    if (!regex) return;

    try {
      const foundMatches = inputText.match(regex) || [];
      const uniqueMatches = [...new Set(foundMatches)];
      
      setMatches(foundMatches);
      setMatchCount(foundMatches.length);
      setUniqueCount(uniqueMatches.length);
      setExtractedText(foundMatches.join('\n'));
      
      if (foundMatches.length === 0) {
        setSuccessMessage(t('no_matches', 'No matches found'));
      } else {
        setSuccessMessage(t('matches_found', `✓ Found ${foundMatches.length} match(es)`));
        saveToHistory(extractionType, foundMatches.length, extractionType === 'custom' ? pattern : undefined);
      }
      setError(null);
    } catch (err) {
      setError(t('extract_error', 'Error during extraction'));
    }
  };

  const copyToClipboard = async () => {
    if (!extractedText) {
      setError(t('no_results', 'No results to copy'));
      return;
    }
    
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setSuccessMessage(t('copied', '✓ Results copied to clipboard!'));
    } catch (err) {
      setError(t('copy_failed', 'Failed to copy results'));
    }
  };

  const downloadResults = () => {
    if (!extractedText) return;
    
    const content = `Text Extraction Results
Generated: ${new Date().toLocaleString()}
Type: ${getCurrentPattern()?.name || extractionType}
Matches Found: ${matchCount}
Unique Matches: ${uniqueCount}

Results:
${extractedText}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-results-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMessage(t('downloaded', '✓ Results downloaded successfully!'));
  };

  const resetAll = () => {
    setInputText('');
    setPattern('');
    setExtractedText('');
    setMatches([]);
    setMatchCount(0);
    setUniqueCount(0);
    setExtractionType('emails');
    setCaseSensitive(false);
    setGlobalMatch(true);
    setMultiline(false);
    setError(null);
    setSuccessMessage(null);
  };

  const loadSample = () => {
    const sample = `Contact Information:
- Email: john.doe@example.com, support@centre.com.pk, admin@website.co.uk
- Phone: (555) 123-4567, +1-555-987-6543
- Website: https://www.centre.com.pk, http://example.com/page
- IP Address: 192.168.1.1, 10.0.0.1
- Date: 2024-01-15, 01/15/2024

This text contains multiple data types for extraction testing.
Visit our website at https://www.centre.com.pk for more tools.
Contact support@centre.com.pk for assistance.`;
    
    setInputText(sample);
    setSuccessMessage(t('sample_loaded', '✓ Sample text loaded!'));
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('text-extractor-history');
      setSuccessMessage(t('history_cleared', '✓ History cleared successfully!'));
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  const getCurrentPattern = () => patterns.find(p => p.id === extractionType);

  const getHighlightedText = (): string => {
    if (!inputText || matches.length === 0 || !showHighlighted) return inputText;
    
    let result = inputText;
    const regex = buildRegex();
    if (!regex) return inputText;
    
    return result.replace(regex, (match) => 
      `<mark class="bg-primary/30 text-primary-foreground px-0.5 rounded">${escapeHtml(match)}</mark>`
    );
  };

  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

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
              <Filter className="h-10 w-10" style={{ color: themeColors.primary }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <GradientText>{t('title', 'Text Extractor')}</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Extract specific patterns from text including emails, URLs, phone numbers, IP addresses, dates, and custom regex patterns')}
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${successColor}15` }}>
              <Search className="h-3.5 w-3.5" style={{ color: successColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('pattern_matching', 'Pattern Matching')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${warningColor}15` }}>
              <Sparkles className="h-3.5 w-3.5" style={{ color: warningColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('custom_regex', 'Custom Regex')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Download className="h-3.5 w-3.5" style={{ color: themeColors.primary }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('export_results', 'Export Results')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'extractor', icon: Filter, label: t('tab_extractor', 'Extractor') },
            { id: 'preview', icon: Eye, label: t('tab_preview', 'Preview') },
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
            
            {/* EXTRACTOR TAB */}
            {activeTab === 'extractor' && (
              <>
                {/* Extraction Type */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Settings className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('extraction_type', 'Extraction Type')}
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {patterns.map((patternItem) => {
                      const Icon = patternItem.icon;
                      const isSelected = extractionType === patternItem.id;
                      return (
                        <button
                          key={patternItem.id}
                          onClick={() => setExtractionType(patternItem.id)}
                          className={`p-3 rounded-xl border text-center transition-all ${isSelected ? 'scale-105 shadow-lg' : 'hover:scale-102'}`}
                          style={{ 
                            backgroundColor: isSelected ? `${themeColors.primary}10` : themeColors.background,
                            borderColor: isSelected ? themeColors.primary : themeColors.border,
                          }}
                        >
                          <Icon className={`h-5 w-5 mx-auto mb-2 ${isSelected ? 'text-primary' : ''}`} 
                            style={{ color: isSelected ? themeColors.primary : themeColors.text.secondary }} />
                          <div className="text-xs font-medium" style={{ color: isSelected ? themeColors.primary : themeColors.text.primary }}>
                            {patternItem.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Pattern Input */}
                {extractionType === 'custom' && (
                  <div className="rounded-xl border p-6 animate-in fade-in slide-in-from-top-2 duration-300" 
                    style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <Code className="h-5 w-5" style={{ color: themeColors.primary }} />
                      {t('custom_pattern', 'Custom Pattern')}
                    </h2>
                    
                    <input
                      type="text"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      className="w-full p-4 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        backgroundColor: themeColors.background,
                        borderColor: themeColors.border,
                        color: themeColors.text.primary
                      }}
                      placeholder={t('pattern_placeholder', 'Enter regular expression pattern...')}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = themeColors.primary;
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.primary}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = themeColors.border;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    
                    <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: `${themeColors.primary}10` }}>
                      <p className="text-xs" style={{ color: themeColors.text.secondary }}>
                        <strong className="font-semibold" style={{ color: themeColors.primary }}>{t('examples', 'Examples')}:</strong><br />
                        {t('email_example', 'Email: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')}<br />
                        {t('url_example', 'URL: https?:\\/\\/[^\\s]+')}<br />
                        {t('phone_example', 'Phone: \\+?\\d{1,3}[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Regex Options */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Settings className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('regex_options', 'Regex Options')}
                  </h2>
                  
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={globalMatch}
                        onChange={(e) => setGlobalMatch(e.target.checked)}
                        className="rounded"
                        style={{ accentColor: themeColors.primary }}
                      />
                      <span className="text-sm" style={{ color: themeColors.text.primary }}>{t('global', 'Global (find all matches)')}</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={caseSensitive}
                        onChange={(e) => setCaseSensitive(e.target.checked)}
                        className="rounded"
                        style={{ accentColor: themeColors.primary }}
                      />
                      <span className="text-sm" style={{ color: themeColors.text.primary }}>{t('case_insensitive', 'Case Insensitive (i)')}</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={multiline}
                        onChange={(e) => setMultiline(e.target.checked)}
                        className="rounded"
                        style={{ accentColor: themeColors.primary }}
                      />
                      <span className="text-sm" style={{ color: themeColors.text.primary }}>{t('multiline', 'Multiline (m)')}</span>
                    </label>
                  </div>
                </div>

                {/* Input Area */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <FileText className="h-5 w-5" style={{ color: themeColors.primary }} />
                      {t('input_text', 'Input Text')}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={loadSample}
                        className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                      >
                        {t('load_sample', 'Load Sample')}
                      </button>
                      <button
                        onClick={() => setInputText('')}
                        className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                      >
                        {t('clear', 'Clear')}
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all font-mono text-sm"
                    style={{ 
                      backgroundColor: themeColors.background,
                      borderColor: themeColors.border,
                      color: themeColors.text.primary,
                      minHeight: '200px'
                    }}
                    placeholder={t('input_placeholder', 'Paste your text here to extract patterns...')}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = themeColors.primary;
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = themeColors.border;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  
                  {showHighlighted && matches.length > 0 && (
                    <div className="mt-3 p-3 rounded-lg border text-sm leading-relaxed max-h-32 overflow-y-auto"
                      style={{ backgroundColor: themeColors.background, borderColor: themeColors.border }}
                      dangerouslySetInnerHTML={{ __html: getHighlightedText() }} />
                  )}
                </div>

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={extractText}
                    disabled={!inputText.trim() || (extractionType === 'custom' && !pattern.trim())}
                    className="flex-1 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                  >
                    <Search className="h-4 w-4" />
                    {t('extract', 'Extract Text')}
                  </button>
                  <button
                    onClick={resetAll}
                    className="px-4 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('reset', 'Reset')}</span>
                  </button>
                </div>

                {/* Results Preview */}
                {extractedText && (
                  <div className="rounded-xl border p-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                        <Hash className="h-5 w-5" style={{ color: successColor }} />
                        {t('extracted_results', 'Extracted Results')}
                      </h2>
                      <div className="flex gap-2">
                        <button
                          onClick={copyToClipboard}
                          className="p-2 rounded-lg transition-all hover:scale-105"
                          style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                          title={t('copy', 'Copy')}
                        >
                          {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={downloadResults}
                          className="p-2 rounded-lg transition-all hover:scale-105"
                          style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                          title={t('download', 'Download')}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl border max-h-64 overflow-y-auto"
                      style={{ backgroundColor: themeColors.background, borderColor: themeColors.border }}>
                      <div className="space-y-2">
                        {matches.map((match, idx) => (
                          <div key={idx} className="p-2 rounded-lg font-mono text-sm"
                            style={{ backgroundColor: `${successColor}10`, color: successColor }}>
                            {match}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-between text-xs" style={{ color: themeColors.text.secondary }}>
                      <span>{t('total_matches', 'Total matches')}: {matchCount}</span>
                      <span>{t('unique_matches', 'Unique matches')}: {uniqueCount}</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* PREVIEW TAB */}
            {activeTab === 'preview' && extractedText && (
              <div className="rounded-xl border p-6 animate-in fade-in duration-300"
                style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                  <Eye className="h-5 w-5" style={{ color: themeColors.primary }} />
                  {t('extracted_preview', 'Extracted Preview')}
                </h2>
                
                <div className="p-6 rounded-xl border max-h-[400px] overflow-y-auto whitespace-pre-wrap font-mono text-sm"
                  style={{ backgroundColor: themeColors.background, borderColor: themeColors.border, color: themeColors.text.primary }}>
                  {extractedText}
                </div>
              </div>
            )}

            {/* PREVIEW TAB - No Data */}
            {activeTab === 'preview' && !extractedText && (
              <div className="rounded-xl border p-12 text-center" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                <p className="text-lg" style={{ color: themeColors.text.secondary }}>
                  {t('no_extractions', 'No extractions yet')}
                </p>
                <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                  {t('extract_first', 'Extract text first to see preview')}
                </p>
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
                        {t('extraction_history', 'Extraction History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_extractions', 'Your recent text extractions')}
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
                    {history.map((entry) => {
                      const patternInfo = patterns.find(p => p.id === entry.type);
                      const Icon = patternInfo?.icon || Filter;
                      return (
                        <div key={entry.id} className="p-4 hover:bg-surface-hover transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon className="h-4 w-4" style={{ color: themeColors.primary }} />
                                <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                  {patternInfo?.name || entry.type}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${successColor}15`, color: successColor }}>
                                  {entry.matchCount} {t('matches', 'matches')}
                                </span>
                              </div>
                              {entry.pattern && (
                                <div className="text-xs font-mono truncate" style={{ color: themeColors.text.secondary }}>
                                  {entry.pattern}
                                </div>
                              )}
                              <p className="text-xs mt-1 opacity-60" style={{ color: themeColors.text.secondary }}>
                                {formatTime(entry.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                    <p className="text-base" style={{ color: themeColors.text.secondary }}>
                      {t('no_history', 'No extraction history yet')}
                    </p>
                    <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your text extractions will appear here')}
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
