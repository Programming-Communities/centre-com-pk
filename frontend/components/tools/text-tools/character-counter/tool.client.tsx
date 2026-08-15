
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { 
  Type, RotateCcw, Copy, CheckCircle, AlertCircle, X,
  BarChart3, Activity, Database, FileText, Hash, 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic,
  Download, Trash2, RefreshCw, Eye, EyeOff, Printer
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// Types
interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  letters: number;
  digits: number;
  spaces: number;
  punctuation: number;
  readingTime: number;
  speakingTime: number;
}

interface CounterHistory {
  id: number;
  timestamp: string;
  characters: number;
  words: number;
  sentences: number;
}

export default function CharacterCounterClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'text-tools' });
  const [mounted, setMounted] = useState(false);
  
  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `character_counter.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // State
  const [text, setText] = useState('');
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    letters: 0,
    digits: 0,
    spaces: 0,
    punctuation: 0,
    readingTime: 0,
    speakingTime: 0,
  });
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'counter' | 'details' | 'history'>('counter');
  const [history, setHistory] = useState<CounterHistory[]>([]);
  const [wordDensity, setWordDensity] = useState<{ word: string; count: number }[]>([]);
  const [showWordDensity, setShowWordDensity] = useState(false);

  // Update statistics when text changes
  useEffect(() => {
    calculateStats();
  }, [text]);

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
      const savedHistory = localStorage.getItem('character-counter-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const saveToHistory = () => {
    if (text.length === 0) return;
    
    const entry: CounterHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      characters: stats.characters,
      words: stats.words,
      sentences: stats.sentences,
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('character-counter-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to history:', e);
    }
  };

  const calculateStats = () => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
    const lines = text ? text.split('\n').length : 0;
    
    // Advanced stats
    const letters = (text.match(/[A-Za-z]/g) || []).length;
    const digits = (text.match(/[0-9]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const punctuation = (text.match(/[.!?;:,"'()\[\]{}<>]/g) || []).length;
    
    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);
    // Speaking time (average 130 words per minute)
    const speakingTime = Math.ceil(words / 130);
    
    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      letters,
      digits,
      spaces,
      punctuation,
      readingTime,
      speakingTime,
    });
    
    // Calculate word frequency for density
    if (words > 0 && showWordDensity) {
      calculateWordDensity();
    }
    
    // Save to history if text is significant
    if (text.length > 0 && text.length !== stats.characters) {
      saveToHistory();
    }
  };

  const calculateWordDensity = () => {
    if (!text.trim()) {
      setWordDensity([]);
      return;
    }
    
    const wordList = text.toLowerCase().match(/\b\w+\b/g) || [];
    const frequency: { [key: string]: number } = {};
    
    wordList.forEach(word => {
      if (word.length > 2) { // Skip very short words
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });
    
    const sorted = Object.entries(frequency)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    setWordDensity(sorted);
  };

  const copyToClipboard = async () => {
    if (!text) {
      setError(t('no_text', 'No text to copy'));
      return;
    }
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setSuccessMessage(t('copied', '✓ Text copied to clipboard!'));
    } catch (err) {
      setError(t('copy_failed', 'Failed to copy text'));
    }
  };

  const resetText = () => {
    setText('');
    setError(null);
    setSuccessMessage(null);
    setCopied(false);
  };

  const loadSample = () => {
    const sampleText = `The quick brown fox jumps over the lazy dog. This is a sample text to demonstrate the character counter tool. It includes multiple sentences. Each sentence ends with a period. There are also numbers like 123 and punctuation marks like commas, exclamation marks! Question marks? This should give you a good idea of how the tool works.

You can also add multiple paragraphs. Just like this one. The tool will count characters, words, sentences, and paragraphs automatically as you type or paste text.`;
    
    setText(sampleText);
    setSuccessMessage(t('sample_loaded', '✓ Sample text loaded!'));
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('character-counter-history');
      setSuccessMessage(t('history_cleared', '✓ History cleared successfully!'));
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  const downloadReport = () => {
    if (!text) return;
    
    const report = `Text Analysis Report
Generated: ${new Date().toLocaleString()}

STATISTICS:
- Characters: ${stats.characters}
- Characters (no spaces): ${stats.charactersNoSpaces}
- Words: ${stats.words}
- Sentences: ${stats.sentences}
- Paragraphs: ${stats.paragraphs}
- Lines: ${stats.lines}
- Letters: ${stats.letters}
- Digits: ${stats.digits}
- Spaces: ${stats.spaces}
- Punctuation: ${stats.punctuation}
- Reading Time: ${stats.readingTime} minute(s)
- Speaking Time: ${stats.speakingTime} minute(s)

TEXT:
${text}`;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `text-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMessage(t('report_downloaded', '✓ Report downloaded successfully!'));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatColor = (value: number, type: string) => {
    if (value === 0) return themeColors.text.secondary;
    if (type === 'characters' && value > 1000) return '#F59E0B';
    if (type === 'words' && value > 500) return '#F59E0B';
    return themeColors.primary;
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
              <Hash className="h-10 w-10" style={{ color: themeColors.primary }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <GradientText>{t('title', 'Character Counter')}</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Count characters, words, sentences, paragraphs, and analyze your text with detailed statistics and insights')}
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${successColor}15` }}>
              <Hash className="h-3.5 w-3.5" style={{ color: successColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('real_time', 'Real-Time')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${warningColor}15` }}>
              <Activity className="h-3.5 w-3.5" style={{ color: warningColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('detailed_stats', 'Detailed Stats')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <FileText className="h-3.5 w-3.5" style={{ color: themeColors.primary }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('bulk_analysis', 'Bulk Analysis')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'counter', icon: Hash, label: t('tab_counter', 'Counter') },
            { id: 'details', icon: BarChart3, label: t('tab_details', 'Details') },
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
            
            {/* COUNTER TAB */}
            {activeTab === 'counter' && (
              <>
                {/* Stats Grid */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Activity className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('text_statistics', 'Text Statistics')}
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-xl" style={{ backgroundColor: `${themeColors.primary}10` }}>
                      <div className="text-3xl font-bold" style={{ color: getStatColor(stats.characters, 'characters') }}>
                        {stats.characters.toLocaleString()}
                      </div>
                      <div className="text-sm mt-1" style={{ color: themeColors.text.secondary }}>
                        {t('characters', 'Characters')}
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-xl" style={{ backgroundColor: `${successColor}10` }}>
                      <div className="text-3xl font-bold" style={{ color: successColor }}>
                        {stats.charactersNoSpaces.toLocaleString()}
                      </div>
                      <div className="text-sm mt-1" style={{ color: themeColors.text.secondary }}>
                        {t('no_spaces', 'No Spaces')}
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-xl" style={{ backgroundColor: `${warningColor}10` }}>
                      <div className="text-3xl font-bold" style={{ color: getStatColor(stats.words, 'words') }}>
                        {stats.words.toLocaleString()}
                      </div>
                      <div className="text-sm mt-1" style={{ color: themeColors.text.secondary }}>
                        {t('words', 'Words')}
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-xl" style={{ backgroundColor: `${themeColors.primary}10` }}>
                      <div className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                        {stats.sentences}
                      </div>
                      <div className="text-sm mt-1" style={{ color: themeColors.text.secondary }}>
                        {t('sentences', 'Sentences')}
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-xl" style={{ backgroundColor: `${successColor}10` }}>
                      <div className="text-3xl font-bold" style={{ color: successColor }}>
                        {stats.paragraphs}
                      </div>
                      <div className="text-sm mt-1" style={{ color: themeColors.text.secondary }}>
                        {t('paragraphs', 'Paragraphs')}
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-xl" style={{ backgroundColor: `${warningColor}10` }}>
                      <div className="text-3xl font-bold" style={{ color: warningColor }}>
                        {stats.lines}
                      </div>
                      <div className="text-sm mt-1" style={{ color: themeColors.text.secondary }}>
                        {t('lines', 'Lines')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Reading Time */}
                  <div className="mt-4 pt-4 border-t flex justify-between text-sm" style={{ borderColor: themeColors.border }}>
                    <span style={{ color: themeColors.text.secondary }}>{t('reading_time', 'Reading Time')}:</span>
                    <span className="font-medium" style={{ color: themeColors.primary }}>
                      {stats.readingTime} {t('minute', 'minute(s)')}
                    </span>
                    <span style={{ color: themeColors.text.secondary }}>{t('speaking_time', 'Speaking Time')}:</span>
                    <span className="font-medium" style={{ color: themeColors.primary }}>
                      {stats.speakingTime} {t('minute', 'minute(s)')}
                    </span>
                  </div>
                </div>

                {/* Text Area */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <FileText className="h-5 w-5" style={{ color: themeColors.primary }} />
                      {t('your_text', 'Your Text')}
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
                        onClick={() => setShowWordDensity(!showWordDensity)}
                        className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                      >
                        {showWordDensity ? t('hide_density', 'Hide Density') : t('show_density', 'Show Density')}
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all"
                    style={{ 
                      backgroundColor: themeColors.background,
                      borderColor: themeColors.border,
                      color: themeColors.text.primary,
                      minHeight: '300px'
                    }}
                    placeholder={t('textarea_placeholder', 'Start typing or paste your text here...')}
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

                {/* Word Density */}
                {showWordDensity && wordDensity.length > 0 && (
                  <div className="rounded-xl border p-6 animate-in fade-in slide-in-from-top-2 duration-300"
                    style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <BarChart3 className="h-4 w-4" style={{ color: themeColors.primary }} />
                      {t('word_density', 'Word Density')}
                    </h3>
                    <div className="space-y-2">
                      {wordDensity.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-sm w-32 truncate" style={{ color: themeColors.text.primary }}>{item.word}</span>
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${themeColors.primary}20` }}>
                            <div className="h-full rounded-full" style={{ width: `${(item.count / wordDensity[0].count) * 100}%`, backgroundColor: themeColors.primary }} />
                          </div>
                          <span className="text-sm font-medium" style={{ color: themeColors.primary }}>{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={copyToClipboard}
                    disabled={!text}
                    className="flex-1 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? t('copied', 'Copied!') : t('copy_text', 'Copy Text')}
                  </button>
                  <button
                    onClick={downloadReport}
                    disabled={!text}
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
                    <span className="hidden sm:inline">{t('clear', 'Clear')}</span>
                  </button>
                </div>

                {/* Tips Section */}
                <div className="rounded-xl p-5" style={{ backgroundColor: `${themeColors.primary}08`, border: `1px solid ${themeColors.primary}20` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Hash className="h-5 w-5" style={{ color: themeColors.primary }} />
                    <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('tips', 'Tips')}</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_1', 'Character count includes all letters, numbers, spaces, and punctuation')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_2', 'Word count helps estimate reading and speaking time')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_3', 'Use word density to identify frequently used keywords')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_4', 'Perfect for SEO optimization and content analysis')}</span>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* DETAILS TAB */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Detailed Statistics */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <BarChart3 className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('detailed_statistics', 'Detailed Statistics')}
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: themeColors.border }}>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>{t('letters', 'Letters (A-Z, a-z)')}:</span>
                      <span className="text-sm font-medium" style={{ color: themeColors.primary }}>{stats.letters.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: themeColors.border }}>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>{t('digits', 'Digits (0-9)')}:</span>
                      <span className="text-sm font-medium" style={{ color: themeColors.primary }}>{stats.digits.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: themeColors.border }}>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>{t('spaces', 'Spaces')}:</span>
                      <span className="text-sm font-medium" style={{ color: themeColors.primary }}>{stats.spaces.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: themeColors.border }}>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>{t('punctuation', 'Punctuation')}:</span>
                      <span className="text-sm font-medium" style={{ color: themeColors.primary }}>{stats.punctuation.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Reading Analysis */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h3 className="font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                    {t('reading_analysis', 'Reading Analysis')}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl text-center" style={{ backgroundColor: `${successColor}10` }}>
                      <div className="text-2xl font-bold" style={{ color: successColor }}>{stats.readingTime}</div>
                      <div className="text-sm" style={{ color: themeColors.text.secondary }}>{t('minutes_to_read', 'Minutes to Read')}</div>
                    </div>
                    <div className="p-4 rounded-xl text-center" style={{ backgroundColor: `${warningColor}10` }}>
                      <div className="text-2xl font-bold" style={{ color: warningColor }}>{stats.speakingTime}</div>
                      <div className="text-sm" style={{ color: themeColors.text.secondary }}>{t('minutes_to_speak', 'Minutes to Speak')}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${themeColors.primary}10` }}>
                    <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                      {stats.words < 200 
                        ? t('short_text', 'Short text - perfect for social media posts and quick messages.')
                        : stats.words < 500 
                          ? t('medium_text', 'Medium length - good for blog posts and articles.')
                          : t('long_text', 'Long text - great for in-depth content and detailed analysis.')}
                    </p>
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
                        {t('analysis_history', 'Analysis History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_analyses', 'Your recent text analyses')}
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
                              <Hash className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.characters.toLocaleString()} {t('chars', 'chars')} • {entry.words} {t('words', 'words')}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${successColor}15`, color: successColor }}>
                                {entry.sentences} {t('sentences', 'sentences')}
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
                      {t('no_history', 'No analysis history yet')}
                    </p>
                    <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your text analyses will appear here')}
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
