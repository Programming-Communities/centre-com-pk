
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { 
  Copy, RotateCcw, Zap, CheckCircle, AlertCircle, X,
  Info, HelpCircle, Database, Settings, Search, Code,
  Hash, FileText, Eye, EyeOff, Download, Trash2
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// Types
interface RegexHistory {
  id: number;
  timestamp: string;
  pattern: string;
  flags: string;
  matchCount: number;
}

interface CommonPattern {
  name: string;
  pattern: string;
  description: string;
  example: string;
}

export default function RegexTesterClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'text-tools' });
  const [mounted, setMounted] = useState(false);
  
  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `regex_tester.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // Default values
  const defaultRegex = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
  const defaultText = 'Contact us at email@example.com or support@test.org for help. Also try admin@website.co.uk for international emails.';

  const [regex, setRegex] = useState(defaultRegex);
  const [testText, setTestText] = useState(defaultText);
  const [matches, setMatches] = useState<string[]>([]);
  const [matchPositions, setMatchPositions] = useState<{ start: number; end: number; text: string }[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [flags, setFlags] = useState('g');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tester' | 'explanation' | 'history'>('tester');
  const [history, setHistory] = useState<RegexHistory[]>([]);
  const [highlightedText, setHighlightedText] = useState('');
  const [showHighlighted, setShowHighlighted] = useState(true);
  const [replacement, setReplacement] = useState('');
  const [replacedText, setReplacedText] = useState('');
  const [showReplacement, setShowReplacement] = useState(false);

  // Common regex patterns with examples
  const commonPatterns: CommonPattern[] = [
    { name: t('email', 'Email'), pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', description: t('email_desc', 'Matches email addresses'), example: 'user@example.com' },
    { name: t('url', 'URL'), pattern: 'https?:\\/\\/[^\\s]+', description: t('url_desc', 'Matches HTTP/HTTPS URLs'), example: 'https://example.com' },
    { name: t('phone', 'Phone'), pattern: '\\+?\\d{1,3}[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}', description: t('phone_desc', 'Matches phone numbers'), example: '+1 (555) 123-4567' },
    { name: t('number', 'Number'), pattern: '\\d+', description: t('number_desc', 'Matches digits'), example: '12345' },
    { name: t('word', 'Word'), pattern: '\\b\\w+\\b', description: t('word_desc', 'Matches whole words'), example: 'hello world' },
    { name: t('ip', 'IP Address'), pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', description: t('ip_desc', 'Matches IPv4 addresses'), example: '192.168.1.1' },
    { name: t('date', 'Date'), pattern: '\\d{4}-\\d{2}-\\d{2}', description: t('date_desc', 'Matches YYYY-MM-DD dates'), example: '2024-01-15' },
    { name: t('hex', 'Hex Color'), pattern: '#[0-9A-Fa-f]{6}\\b', description: t('hex_desc', 'Matches hex color codes'), example: '#FF5733' },
    { name: t('html_tag', 'HTML Tag'), pattern: '<[^>]+>', description: t('html_tag_desc', 'Matches HTML/XML tags'), example: '<div class="test">' },
    { name: t('username', 'Username'), pattern: '@\\w+', description: t('username_desc', 'Matches social media usernames'), example: '@username' },
  ];

  // Flag options
  const flagOptions = [
    { value: 'g', label: 'g (global)', description: t('global_desc', 'Find all matches, not just first') },
    { value: 'i', label: 'i (case-insensitive)', description: t('case_desc', 'Case insensitive matching') },
    { value: 'm', label: 'm (multiline)', description: t('multiline_desc', 'Treat beginning/end as line boundaries') },
    { value: 's', label: 's (dotall)', description: t('dotall_desc', 'Dot matches newlines as well') },
    { value: 'u', label: 'u (unicode)', description: t('unicode_desc', 'Enable Unicode matching') },
    { value: 'y', label: 'y (sticky)', description: t('sticky_desc', 'Matches only from lastIndex') },
  ];

  useEffect(() => {
    testRegex();
  }, [regex, testText, flags]);

  useEffect(() => {
    if (showReplacement && replacement) {
      applyReplacement();
    }
  }, [replacement, regex, testText, flags, showReplacement]);

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
      const savedHistory = localStorage.getItem('regex-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const saveToHistory = (pattern: string, flagValue: string, matchCount: number) => {
    const entry: RegexHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      pattern: pattern.length > 40 ? pattern.substring(0, 37) + '...' : pattern,
      flags: flagValue,
      matchCount: matchCount,
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('regex-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to history:', e);
    }
  };

  const testRegex = () => {
    try {
      const regexObj = new RegExp(regex, flags);
      const foundMatches = testText.match(regexObj) || [];
      setMatches(foundMatches);
      setIsValid(true);
      setErrorMessage('');
      
      // Calculate match positions for highlighting
      const positions: { start: number; end: number; text: string }[] = [];
      let match;
      const execRegex = new RegExp(regex, flags.includes('g') ? flags : flags + 'g');
      while ((match = execRegex.exec(testText)) !== null) {
        positions.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0]
        });
      }
      setMatchPositions(positions);
      
      // Generate highlighted text
      generateHighlightedText(positions);
      
      // Save to history if matches found
      if (foundMatches.length > 0) {
        saveToHistory(regex, flags, foundMatches.length);
      }
    } catch (err) {
      setMatches([]);
      setMatchPositions([]);
      setIsValid(false);
      setErrorMessage((err as Error).message);
      setHighlightedText(testText);
    }
  };

  const generateHighlightedText = (positions: { start: number; end: number; text: string }[]) => {
    if (positions.length === 0) {
      setHighlightedText(testText);
      return;
    }
    
    let result = '';
    let lastIndex = 0;
    
    for (const pos of positions) {
      result += escapeHtml(testText.substring(lastIndex, pos.start));
      result += `<mark class="bg-primary/30 text-primary-foreground px-0.5 rounded">${escapeHtml(pos.text)}</mark>`;
      lastIndex = pos.end;
    }
    result += escapeHtml(testText.substring(lastIndex));
    
    setHighlightedText(result);
  };

  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const applyReplacement = () => {
    try {
      const regexObj = new RegExp(regex, flags);
      const replaced = testText.replace(regexObj, replacement);
      setReplacedText(replaced);
    } catch (err) {
      setReplacedText('');
    }
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

  const downloadMatches = () => {
    if (matches.length === 0) return;
    
    const content = matches.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `regex-matches-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMessage(t('downloaded', '✓ Matches downloaded successfully!'));
  };

  const resetTester = () => {
    setRegex(defaultRegex);
    setTestText(defaultText);
    setFlags('g');
    setReplacement('');
    setShowReplacement(false);
    setError(null);
    setSuccessMessage(null);
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('regex-history');
      setSuccessMessage(t('history_cleared', '✓ History cleared successfully!'));
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  const loadPattern = (pattern: string) => {
    setRegex(pattern);
    setSuccessMessage(t('pattern_loaded', '✓ Pattern loaded!'));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getFlagLabel = (flagValue: string): string => {
    const found = flagOptions.find(f => f.value === flagValue);
    return found ? found.label : flagValue;
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
              <Code className="h-10 w-10" style={{ color: themeColors.primary }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <GradientText>{t('title', 'Regex Tester')}</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Test and debug regular expressions with live matching, highlighting, and replacement functionality')}
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${successColor}15` }}>
              <Zap className="h-3.5 w-3.5" style={{ color: successColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('live_matching', 'Live Matching')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${warningColor}15` }}>
              <Search className="h-3.5 w-3.5" style={{ color: warningColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('highlighting', 'Highlighting')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Copy className="h-3.5 w-3.5" style={{ color: themeColors.primary }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('replace', 'Replace')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'tester', icon: Code, label: t('tab_tester', 'Tester') },
            { id: 'explanation', icon: HelpCircle, label: t('tab_explanation', 'Explanation') },
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
            
            {/* TESTER TAB */}
            {activeTab === 'tester' && (
              <>
                {/* Common Patterns */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Zap className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('common_patterns', 'Common Patterns')}
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonPatterns.map((pattern, index) => (
                      <button
                        key={index}
                        onClick={() => loadPattern(pattern.pattern)}
                        className="p-2 text-sm rounded-lg transition-all hover:scale-105 truncate"
                        style={{ 
                          backgroundColor: `${themeColors.primary}10`,
                          color: themeColors.primary
                        }}
                        title={`${pattern.name}: ${pattern.description}`}
                      >
                        {pattern.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Regex Input */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Search className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('regular_expression', 'Regular Expression')}
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={regex}
                      onChange={(e) => setRegex(e.target.value)}
                      className={`flex-1 p-4 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 transition-all ${
                        isValid ? '' : 'border-error'
                      }`}
                      style={{ 
                        backgroundColor: themeColors.background,
                        borderColor: isValid ? themeColors.border : errorColor,
                        color: themeColors.text.primary
                      }}
                      placeholder={t('regex_placeholder', 'Enter your regex pattern...')}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = isValid ? themeColors.primary : errorColor;
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${isValid ? themeColors.primary : errorColor}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = isValid ? themeColors.border : errorColor;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    <select
                      value={flags}
                      onChange={(e) => setFlags(e.target.value)}
                      className="px-4 py-4 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        backgroundColor: themeColors.background,
                        borderColor: themeColors.border,
                        color: themeColors.text.primary
                      }}
                    >
                      {flagOptions.map((flag) => (
                        <option key={flag.value} value={flag.value}>
                          {flag.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {!isValid && (
                    <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: `${errorColor}10` }}>
                      <p className="text-sm" style={{ color: errorColor }}>
                        <strong>{t('error', 'Error')}:</strong> {errorMessage}
                      </p>
                    </div>
                  )}
                </div>

                {/* Test Text */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <FileText className="h-5 w-5" style={{ color: themeColors.primary }} />
                      {t('test_text', 'Test Text')}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowHighlighted(!showHighlighted)}
                        className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                      >
                        {showHighlighted ? <EyeOff className="h-3 w-3 inline mr-1" /> : <Eye className="h-3 w-3 inline mr-1" />}
                        {showHighlighted ? t('hide_highlights', 'Hide Highlights') : t('show_highlights', 'Show Highlights')}
                      </button>
                      <button
                        onClick={() => setShowReplacement(!showReplacement)}
                        className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                      >
                        {showReplacement ? 'Hide Replace' : 'Replace'}
                      </button>
                    </div>
                  </div>
                  
                  {showReplacement && (
                    <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: `${themeColors.primary}10` }}>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('replace_with', 'Replace with')}
                      </label>
                      <input
                        type="text"
                        value={replacement}
                        onChange={(e) => setReplacement(e.target.value)}
                        className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all font-mono text-sm"
                        style={{ 
                          backgroundColor: themeColors.background,
                          borderColor: themeColors.border,
                          color: themeColors.text.primary
                        }}
                        placeholder={t('replace_placeholder', 'Enter replacement text...')}
                      />
                    </div>
                  )}
                  
                  <textarea
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    className="w-full p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all font-mono text-sm"
                    style={{ 
                      backgroundColor: themeColors.background,
                      borderColor: themeColors.border,
                      color: themeColors.text.primary,
                      minHeight: '150px'
                    }}
                    placeholder={t('text_placeholder', 'Enter text to test against...')}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = themeColors.primary;
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = themeColors.border;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  
                  {showHighlighted && matchPositions.length > 0 && (
                    <div className="mt-3 p-3 rounded-lg border text-sm leading-relaxed" 
                         style={{ backgroundColor: themeColors.background, borderColor: themeColors.border }}
                         dangerouslySetInnerHTML={{ __html: highlightedText }} />
                  )}
                </div>

                {/* Results */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <Hash className="h-5 w-5" style={{ color: themeColors.primary }} />
                      {t('matches_found', 'Matches Found')}: {matches.length}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(matches.join('\n'), t('matches', 'Matches'))}
                        disabled={matches.length === 0}
                        className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                      >
                        <Copy className="h-3 w-3 inline mr-1" />
                        {t('copy_all', 'Copy All')}
                      </button>
                      <button
                        onClick={downloadMatches}
                        disabled={matches.length === 0}
                        className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                      >
                        <Download className="h-3 w-3 inline mr-1" />
                        {t('download', 'Download')}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl border max-h-48 overflow-y-auto" 
                    style={{ backgroundColor: themeColors.background, borderColor: themeColors.border }}>
                    {matches.length > 0 ? (
                      <div className="space-y-2">
                        {matches.map((match, index) => (
                          <div
                            key={index}
                            className="p-2 rounded-lg font-mono text-sm"
                            style={{ backgroundColor: `${successColor}10`, color: successColor }}
                          >
                            {match}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center" style={{ color: themeColors.text.secondary }}>
                        {isValid ? t('no_matches', 'No matches found') : t('invalid_regex', 'Invalid regular expression')}
                      </p>
                    )}
                  </div>
                  
                  {showReplacement && replacedText && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                          {t('replaced_text', 'Replaced Text')}
                        </label>
                        <button
                          onClick={() => copyToClipboard(replacedText, t('replaced', 'Replaced'))}
                          className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                          style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                        >
                          <Copy className="h-3 w-3 inline mr-1" />
                          {t('copy', 'Copy')}
                        </button>
                      </div>
                      <div className="p-4 rounded-xl border font-mono text-sm max-h-32 overflow-y-auto whitespace-pre-wrap"
                        style={{ backgroundColor: themeColors.background, borderColor: themeColors.border, color: themeColors.text.primary }}>
                        {replacedText}
                      </div>
                    </div>
                  )}
                </div>

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => copyToClipboard(regex, t('regex', 'Regex'))}
                    className="flex-1 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                  >
                    <Copy className="h-4 w-4" />
                    {t('copy_regex', 'Copy Regex')}
                  </button>
                  <button
                    onClick={resetTester}
                    className="px-4 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('reset', 'Reset')}</span>
                  </button>
                </div>

                {/* Regex Tips */}
                <div className="rounded-xl p-5" style={{ backgroundColor: `${themeColors.primary}08`, border: `1px solid ${themeColors.primary}20` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-5 w-5" style={{ color: themeColors.primary }} />
                    <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('regex_tips', 'Regex Tips')}</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_1', 'Use \\d for digits, \\w for word characters, \\s for whitespace')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_2', 'Use + for one or more, * for zero or more, ? for zero or one')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_3', 'Use parentheses () for capturing groups')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_4', 'Use ^ for start and $ for end of string')}</span>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* EXPLANATION TAB */}
            {activeTab === 'explanation' && (
              <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                  <HelpCircle className="h-5 w-5" style={{ color: themeColors.primary }} />
                  {t('regex_metacharacters', 'Regex Metacharacters')}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { char: '.', name: t('dot', 'Dot'), description: t('dot_desc', 'Any character (except newline)') },
                    { char: '\\d', name: t('digit', 'Digit'), description: t('digit_desc', 'Any digit (0-9)') },
                    { char: '\\D', name: t('non_digit', 'Non-digit'), description: t('non_digit_desc', 'Any non-digit character') },
                    { char: '\\w', name: t('word', 'Word'), description: t('word_desc', 'Any word character (a-z, A-Z, 0-9, _)') },
                    { char: '\\W', name: t('non_word', 'Non-word'), description: t('non_word_desc', 'Any non-word character') },
                    { char: '\\s', name: t('whitespace', 'Whitespace'), description: t('whitespace_desc', 'Any whitespace character') },
                    { char: '\\S', name: t('non_whitespace', 'Non-whitespace'), description: t('non_whitespace_desc', 'Any non-whitespace character') },
                    { char: '^', name: t('caret', 'Caret'), description: t('caret_desc', 'Start of string') },
                    { char: '$', name: t('dollar', 'Dollar'), description: t('dollar_desc', 'End of string') },
                    { char: '*', name: t('star', 'Star'), description: t('star_desc', '0 or more times') },
                    { char: '+', name: t('plus', 'Plus'), description: t('plus_desc', '1 or more times') },
                    { char: '?', name: t('question', 'Question'), description: t('question_desc', '0 or 1 time') },
                    { char: '{n}', name: t('exact', 'Exact'), description: t('exact_desc', 'Exactly n times') },
                    { char: '{n,}', name: t('at_least', 'At least'), description: t('at_least_desc', 'At least n times') },
                    { char: '{n,m}', name: t('range', 'Range'), description: t('range_desc', 'Between n and m times') },
                    { char: '|', name: t('alternation', 'Alternation'), description: t('alternation_desc', 'OR operator') },
                    { char: '()', name: t('group', 'Group'), description: t('group_desc', 'Capturing group') },
                    { char: '(?:)', name: t('non_capturing', 'Non-capturing'), description: t('non_capturing_desc', 'Non-capturing group') },
                    { char: '[]', name: t('character_class', 'Character Class'), description: t('character_class_desc', 'Match any character in set') },
                    { char: '[^]', name: t('negated_class', 'Negated Class'), description: t('negated_class_desc', 'Match any character not in set') },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg border" style={{ borderColor: themeColors.border }}>
                      <div className="flex items-center gap-2 mb-1">
                        <code className="px-2 py-0.5 rounded text-sm font-mono" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                          {item.char}
                        </code>
                        <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>{item.name}</span>
                      </div>
                      <p className="text-xs" style={{ color: themeColors.text.secondary }}>{item.description}</p>
                    </div>
                  ))}
                </div>
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
                        {t('regex_history', 'Regex History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_patterns', 'Your recent regex patterns')}
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
                              <Code className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-mono" style={{ color: themeColors.text.primary }}>
                                {entry.pattern}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${successColor}15`, color: successColor }}>
                                {entry.flags}
                              </span>
                            </div>
                            <div className="flex gap-3 text-xs" style={{ color: themeColors.text.secondary }}>
                              <span>{entry.matchCount} {t('matches', 'matches')}</span>
                            </div>
                            <p className="text-xs mt-1 opacity-60" style={{ color: themeColors.text.secondary }}>
                              {formatTime(entry.timestamp)}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setRegex(entry.pattern);
                              setFlags(entry.flags);
                              setActiveTab('tester');
                              setSuccessMessage(t('pattern_restored', '✓ Pattern restored!'));
                            }}
                            className="px-3 py-1.5 text-xs rounded-lg transition-all hover:scale-105"
                            style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                          >
                            {t('restore', 'Restore')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                    <p className="text-base" style={{ color: themeColors.text.secondary }}>
                      {t('no_history', 'No regex history yet')}
                    </p>
                    <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your tested regex patterns will appear here')}
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
