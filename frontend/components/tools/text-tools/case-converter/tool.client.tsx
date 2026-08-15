
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { 
  Copy, RotateCcw, CheckCircle, AlertCircle, X,
  Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  ArrowUp, ArrowDown, Trash2, RefreshCw, Download, Eye, EyeOff,
  Activity, Database, BarChart3
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// Types
type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab';

interface CaseHistory {
  id: number;
  timestamp: string;
  inputLength: number;
  outputLength: number;
  caseType: CaseType;
}

export default function CaseConverterClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'text-tools' });
  const [mounted, setMounted] = useState(false);
  
  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `case_converter.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // State
  const [inputText, setInputText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [activeCase, setActiveCase] = useState<CaseType | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'converter' | 'stats' | 'history'>('converter');
  const [history, setHistory] = useState<CaseHistory[]>([]);
  const [showPreview, setShowPreview] = useState(true);

  // Case buttons configuration
  const caseButtons: { id: CaseType; label: string; icon: React.ElementType; description: string }[] = [
    { id: 'upper', label: t('uppercase', 'UPPERCASE'), icon: ArrowUp, description: t('upper_desc', 'ALL LETTERS CAPITALIZED') },
    { id: 'lower', label: t('lowercase', 'lowercase'), icon: ArrowDown, description: t('lower_desc', 'all letters lowercase') },
    { id: 'title', label: t('title_case', 'Title Case'), icon: Type, description: t('title_desc', 'First Letter Of Each Word Capitalized') },
    { id: 'sentence', label: t('sentence_case', 'Sentence case'), icon: AlignLeft, description: t('sentence_desc', 'First letter of sentence capitalized') },
    { id: 'camel', label: t('camel_case', 'camelCase'), icon: Italic, description: t('camel_desc', 'firstLetterLowercaseThenCapitalized') },
    { id: 'pascal', label: t('pascal_case', 'PascalCase'), icon: Bold, description: t('pascal_desc', 'EveryWordStartsWithCapitalLetter') },
    { id: 'snake', label: t('snake_case', 'snake_case'), icon: Underline, description: t('snake_desc', 'words_separated_by_underscores') },
    { id: 'kebab', label: t('kebab_case', 'kebab-case'), icon: AlignCenter, description: t('kebab_desc', 'words-separated-by-hyphens') },
  ];

  // Update counts when input text changes
  useEffect(() => {
    setCharacterCount(inputText.length);
    setWordCount(inputText.trim() ? inputText.trim().split(/\s+/).length : 0);
    setLineCount(inputText ? inputText.split(/\r\n|\r|\n/).length : 0);
  }, [inputText]);

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
      const savedHistory = localStorage.getItem('case-converter-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const saveToHistory = (inputLen: number, outputLen: number, caseType: CaseType) => {
    const entry: CaseHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      inputLength: inputLen,
      outputLength: outputLen,
      caseType: caseType,
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('case-converter-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to history:', e);
    }
  };

  const convertCase = (caseType: CaseType) => {
    if (!inputText.trim()) {
      setError(t('no_text', 'Please enter some text to convert'));
      return;
    }

    let result = '';
    
    switch (caseType) {
      case 'upper':
        result = inputText.toUpperCase();
        break;
      case 'lower':
        result = inputText.toLowerCase();
        break;
      case 'title':
        result = inputText.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
        );
        break;
      case 'sentence':
        result = inputText.charAt(0).toUpperCase() + inputText.slice(1).toLowerCase();
        break;
      case 'camel':
        result = inputText
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          )
          .replace(/\s+/g, '');
        break;
      case 'pascal':
        result = inputText
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/\s+/g, '');
        break;
      case 'snake':
        result = inputText.toLowerCase().replace(/\s+/g, '_');
        break;
      case 'kebab':
        result = inputText.toLowerCase().replace(/\s+/g, '-');
        break;
      default:
        result = inputText;
    }
    
    setConvertedText(result);
    setActiveCase(caseType);
    setSuccessMessage(t('converted', `✓ Text converted to ${caseButtons.find(c => c.id === caseType)?.label}!`));
    saveToHistory(inputText.length, result.length, caseType);
  };

  const copyToClipboard = async () => {
    if (!convertedText) {
      setError(t('no_converted', 'No converted text to copy'));
      return;
    }
    
    try {
      await navigator.clipboard.writeText(convertedText);
      setCopied(true);
      setSuccessMessage(t('copied', '✓ Text copied to clipboard!'));
    } catch (err) {
      setError(t('copy_failed', 'Failed to copy text'));
    }
  };

  const resetText = () => {
    setInputText('');
    setConvertedText('');
    setActiveCase(null);
    setError(null);
    setSuccessMessage(null);
    setCopied(false);
  };

  const swapText = () => {
    if (!convertedText) return;
    setInputText(convertedText);
    setConvertedText('');
    setActiveCase(null);
    setSuccessMessage(t('swapped', '✓ Text swapped!'));
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('case-converter-history');
      setSuccessMessage(t('history_cleared', '✓ History cleared successfully!'));
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  const downloadText = () => {
    if (!convertedText) return;
    
    const blob = new Blob([convertedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-text-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMessage(t('downloaded', '✓ File downloaded successfully!'));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getCaseLabel = (caseType: CaseType): string => {
    const found = caseButtons.find(c => c.id === caseType);
    return found ? found.label : caseType;
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
              <Type className="h-10 w-10" style={{ color: themeColors.primary }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <GradientText>{t('title', 'Case Converter')}</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Convert text between different cases: uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, and kebab-case')}
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${successColor}15` }}>
              <Type className="h-3.5 w-3.5" style={{ color: successColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('real_time', 'Real-Time')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${warningColor}15` }}>
              <Copy className="h-3.5 w-3.5" style={{ color: warningColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('instant_copy', 'Instant Copy')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <RefreshCw className="h-3.5 w-3.5" style={{ color: themeColors.primary }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('bulk_processing', 'Bulk Processing')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'converter', icon: Type, label: t('tab_converter', 'Converter') },
            { id: 'stats', icon: Activity, label: t('tab_stats', 'Statistics') },
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
            
            {/* CONVERTER TAB */}
            {activeTab === 'converter' && (
              <>
                {/* Case Buttons Grid */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Type className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('case_options', 'Case Options')}
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {caseButtons.map((button) => {
                      const Icon = button.icon;
                      const isActiveCase = activeCase === button.id;
                      return (
                        <button
                          key={button.id}
                          onClick={() => convertCase(button.id)}
                          className={`p-3 rounded-xl border text-center transition-all ${isActiveCase ? 'scale-105 shadow-lg' : 'hover:scale-102'}`}
                          style={{ 
                            backgroundColor: isActiveCase ? `${themeColors.primary}10` : themeColors.background,
                            borderColor: isActiveCase ? themeColors.primary : themeColors.border,
                          }}
                        >
                          <Icon className={`h-5 w-5 mx-auto mb-2 ${isActiveCase ? 'text-primary' : ''}`} 
                            style={{ color: isActiveCase ? themeColors.primary : themeColors.text.secondary }} />
                          <div className="text-sm font-medium" style={{ color: isActiveCase ? themeColors.primary : themeColors.text.primary }}>
                            {button.label}
                          </div>
                          <div className="text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                            {button.description}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Input & Output Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Input Area */}
                  <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                        <Type className="h-5 w-5" style={{ color: themeColors.primary }} />
                        {t('input_text', 'Input Text')}
                      </h2>
                      <button
                        onClick={() => setInputText('')}
                        className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                      >
                        {t('clear', 'Clear')}
                      </button>
                    </div>
                    
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        backgroundColor: themeColors.background,
                        borderColor: themeColors.border,
                        color: themeColors.text.primary,
                        minHeight: '200px'
                      }}
                      placeholder={t('input_placeholder', 'Enter or paste your text here...')}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = themeColors.primary;
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.primary}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = themeColors.border;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    
                    <div className="mt-3 text-xs text-right" style={{ color: themeColors.text.secondary }}>
                      {t('characters', 'Characters')}: {characterCount} | {t('words', 'Words')}: {wordCount} | {t('lines', 'Lines')}: {lineCount}
                    </div>
                  </div>

                  {/* Output Area */}
                  <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                        <CheckCircle className="h-5 w-5" style={{ color: successColor }} />
                        {t('converted_text', 'Converted Text')}
                      </h2>
                      <div className="flex gap-2">
                        <button
                          onClick={swapText}
                          disabled={!convertedText}
                          className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
                          style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                        >
                          <RefreshCw className="h-3 w-3 inline mr-1" />
                          {t('swap', 'Swap')}
                        </button>
                        <button
                          onClick={() => setShowPreview(!showPreview)}
                          className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                          style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                        >
                          {showPreview ? <EyeOff className="h-3 w-3 inline mr-1" /> : <Eye className="h-3 w-3 inline mr-1" />}
                          {showPreview ? t('hide', 'Hide') : t('show', 'Show')}
                        </button>
                      </div>
                    </div>
                    
                    {showPreview ? (
                      <textarea
                        value={convertedText}
                        readOnly
                        className="w-full p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all"
                        style={{ 
                          backgroundColor: themeColors.background,
                          borderColor: themeColors.border,
                          color: themeColors.text.primary,
                          minHeight: '200px'
                        }}
                        placeholder={t('output_placeholder', 'Converted text will appear here...')}
                      />
                    ) : (
                      <div className="w-full p-4 rounded-xl border font-mono text-sm break-all whitespace-pre-wrap"
                        style={{ 
                          backgroundColor: themeColors.background,
                          borderColor: themeColors.border,
                          color: themeColors.text.primary,
                          minHeight: '200px',
                          maxHeight: '200px',
                          overflowY: 'auto'
                        }}
                      >
                        {convertedText || t('output_placeholder', 'Converted text will appear here...')}
                      </div>
                    )}
                    
                    <div className="mt-3 text-xs text-right" style={{ color: themeColors.text.secondary }}>
                      {convertedText && (
                        <>
                          {t('characters', 'Characters')}: {convertedText.length} | {t('words', 'Words')}: {convertedText.trim() ? convertedText.trim().split(/\s+/).length : 0}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={copyToClipboard}
                    disabled={!convertedText}
                    className="flex-1 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? t('copied', 'Copied!') : t('copy_text', 'Copy Converted Text')}
                  </button>
                  <button
                    onClick={downloadText}
                    disabled={!convertedText}
                    className="px-4 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                    style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('download', 'Download')}</span>
                  </button>
                  <button
                    onClick={resetText}
                    className="px-4 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('reset', 'Reset')}</span>
                  </button>
                </div>

                {/* Tips Section */}
                <div className="rounded-xl p-5" style={{ backgroundColor: `${themeColors.primary}08`, border: `1px solid ${themeColors.primary}20` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Type className="h-5 w-5" style={{ color: themeColors.primary }} />
                    <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('tips', 'Tips')}</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_1', 'Use UPPERCASE for headings and emphasis')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_2', 'Title Case is perfect for article headlines')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_3', 'camelCase and PascalCase are for programming variables')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_4', 'snake_case and kebab-case are for URLs and filenames')}</span>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* STATISTICS TAB */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                {/* Current Text Stats */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <BarChart3 className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('current_text_stats', 'Current Text Statistics')}
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: themeColors.background }}>
                      <div className="text-3xl font-bold" style={{ color: themeColors.primary }}>{characterCount}</div>
                      <div className="text-sm" style={{ color: themeColors.text.secondary }}>{t('characters', 'Characters')}</div>
                    </div>
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: themeColors.background }}>
                      <div className="text-3xl font-bold" style={{ color: themeColors.primary }}>{wordCount}</div>
                      <div className="text-sm" style={{ color: themeColors.text.secondary }}>{t('words', 'Words')}</div>
                    </div>
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: themeColors.background }}>
                      <div className="text-3xl font-bold" style={{ color: themeColors.primary }}>{lineCount}</div>
                      <div className="text-sm" style={{ color: themeColors.text.secondary }}>{t('lines', 'Lines')}</div>
                    </div>
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: themeColors.background }}>
                      <div className="text-3xl font-bold" style={{ color: themeColors.primary }}>{inputText.split(/\s+/).filter(w => w.length > 0).length}</div>
                      <div className="text-sm" style={{ color: themeColors.text.secondary }}>{t('paragraphs', 'Paragraphs')}</div>
                    </div>
                  </div>
                  
                  {convertedText && (
                    <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: `${successColor}10` }}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium" style={{ color: successColor }}>{t('converted_stats', 'Converted Text Stats')}</span>
                        <span className="text-sm" style={{ color: themeColors.text.secondary }}>
                          {t('reduction', 'Reduction')}: {((characterCount - convertedText.length) / characterCount * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Character Distribution */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h3 className="font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                    {t('character_distribution', 'Character Distribution')}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: themeColors.text.secondary }}>{t('uppercase_letters', 'Uppercase Letters')}</span>
                        <span style={{ color: themeColors.primary }}>{(inputText.match(/[A-Z]/g) || []).length}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${themeColors.primary}20` }}>
                        <div className="h-full rounded-full" style={{ width: `${((inputText.match(/[A-Z]/g) || []).length / Math.max(characterCount, 1)) * 100}%`, backgroundColor: themeColors.primary }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: themeColors.text.secondary }}>{t('lowercase_letters', 'Lowercase Letters')}</span>
                        <span style={{ color: themeColors.primary }}>{(inputText.match(/[a-z]/g) || []).length}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${themeColors.primary}20` }}>
                        <div className="h-full rounded-full" style={{ width: `${((inputText.match(/[a-z]/g) || []).length / Math.max(characterCount, 1)) * 100}%`, backgroundColor: themeColors.primary }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: themeColors.text.secondary }}>{t('numbers', 'Numbers')}</span>
                        <span style={{ color: themeColors.primary }}>{(inputText.match(/[0-9]/g) || []).length}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${themeColors.primary}20` }}>
                        <div className="h-full rounded-full" style={{ width: `${((inputText.match(/[0-9]/g) || []).length / Math.max(characterCount, 1)) * 100}%`, backgroundColor: themeColors.primary }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: themeColors.text.secondary }}>{t('spaces', 'Spaces')}</span>
                        <span style={{ color: themeColors.primary }}>{(inputText.match(/\s/g) || []).length}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${themeColors.primary}20` }}>
                        <div className="h-full rounded-full" style={{ width: `${((inputText.match(/\s/g) || []).length / Math.max(characterCount, 1)) * 100}%`, backgroundColor: themeColors.primary }} />
                      </div>
                    </div>
                  </div>
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
                        {t('conversion_history', 'Conversion History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_conversions', 'Your recent text conversions')}
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
                              <Type className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {getCaseLabel(entry.caseType)}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${successColor}15`, color: successColor }}>
                                {entry.inputLength} → {entry.outputLength}
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
                      {t('no_history', 'No conversion history yet')}
                    </p>
                    <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your converted text will appear here')}
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
