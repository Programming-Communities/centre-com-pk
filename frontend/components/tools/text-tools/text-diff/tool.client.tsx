
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { 
  Copy, RotateCcw, GitCompare, CheckCircle, AlertCircle, X,
  FileText, Download, Trash2, Eye, EyeOff, ArrowRight,
  Plus, Minus, Equal, Code, Database, Settings
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// Types
interface DiffLine {
  lineNumber: number;
  text1: string;
  text2: string;
  status: 'same' | 'different' | 'only1' | 'only2';
}

interface DiffHistory {
  id: number;
  timestamp: string;
  text1Length: number;
  text2Length: number;
  differences: number;
}

export default function TextDiffClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'text-tools' });
  const [mounted, setMounted] = useState(false);
  
  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `text_diff.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // State
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffLines, setDiffLines] = useState<DiffLine[]>([]);
  const [differences, setDifferences] = useState<string[]>([]);
  const [diffStats, setDiffStats] = useState({ added: 0, removed: 0, changed: 0, same: 0 });
  const [similarity, setSimilarity] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'diff' | 'unified' | 'stats' | 'history'>('diff');
  const [history, setHistory] = useState<DiffHistory[]>([]);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);

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
      const savedHistory = localStorage.getItem('text-diff-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const saveToHistory = (t1Len: number, t2Len: number, diffCount: number) => {
    const entry: DiffHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      text1Length: t1Len,
      text2Length: t2Len,
      differences: diffCount,
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('text-diff-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to history:', e);
    }
  };

  const findDifferences = () => {
    if (!text1 && !text2) {
      setError(t('no_text', 'Please enter text in at least one field'));
      return;
    }

    let processedText1 = text1;
    let processedText2 = text2;
    
    if (ignoreWhitespace) {
      processedText1 = processedText1.replace(/\s+/g, ' ').trim();
      processedText2 = processedText2.replace(/\s+/g, ' ').trim();
    }
    
    if (!caseSensitive) {
      processedText1 = processedText1.toLowerCase();
      processedText2 = processedText2.toLowerCase();
    }

    const lines1 = processedText1.split('\n');
    const lines2 = processedText2.split('\n');
    const maxLength = Math.max(lines1.length, lines2.length);
    const diffs: string[] = [];
    const detailedDiffs: DiffLine[] = [];
    let added = 0, removed = 0, changed = 0, same = 0;

    // Use diff algorithm for better comparison
    const diffLinesResult: DiffLine[] = [];
    
    for (let i = 0; i < maxLength; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      const originalLine1 = text1.split('\n')[i] || '';
      const originalLine2 = text2.split('\n')[i] || '';

      if (line1 === line2) {
        diffLinesResult.push({
          lineNumber: i + 1,
          text1: originalLine1,
          text2: originalLine2,
          status: 'same'
        });
        same++;
      } else {
        if (line1 && !line2) {
          diffLinesResult.push({
            lineNumber: i + 1,
            text1: originalLine1,
            text2: '',
            status: 'only1'
          });
          removed++;
          diffs.push(t('line_only_first', `Line ${i + 1}: Only in first text: "${originalLine1.substring(0, 50)}"`));
        } else if (!line1 && line2) {
          diffLinesResult.push({
            lineNumber: i + 1,
            text1: '',
            text2: originalLine2,
            status: 'only2'
          });
          added++;
          diffs.push(t('line_only_second', `Line ${i + 1}: Only in second text: "${originalLine2.substring(0, 50)}"`));
        } else {
          diffLinesResult.push({
            lineNumber: i + 1,
            text1: originalLine1,
            text2: originalLine2,
            status: 'different'
          });
          changed++;
          diffs.push(t('line_different', `Line ${i + 1}: "${originalLine1.substring(0, 50)}" ≠ "${originalLine2.substring(0, 50)}"`));
        }
      }
    }

    if (lines1.length !== lines2.length) {
      diffs.push(t('line_count', `Line count: ${lines1.length} vs ${lines2.length}`));
    }

    // Calculate similarity percentage
    const totalChars = Math.max(text1.length, text2.length);
    let similarChars = 0;
    for (let i = 0; i < Math.min(text1.length, text2.length); i++) {
      if (text1[i] === text2[i]) similarChars++;
    }
    const similarityPercent = totalChars > 0 ? Math.round((similarChars / totalChars) * 100) : 100;
    setSimilarity(similarityPercent);

    setDiffLines(diffLinesResult);
    setDifferences(diffs.length > 0 ? diffs : [t('no_differences', 'No differences found!')]);
    setDiffStats({ added, removed, changed, same });
    
    if (diffs.length > 0) {
      saveToHistory(text1.length, text2.length, diffs.length);
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

  const downloadDiff = () => {
    if (differences.length === 0 || differences[0] === t('no_differences', 'No differences found!')) return;
    
    const content = `Text Diff Report
Generated: ${new Date().toLocaleString()}

Statistics:
- Similarity: ${similarity}%
- Same lines: ${diffStats.same}
- Changed lines: ${diffStats.changed}
- Added lines: ${diffStats.added}
- Removed lines: ${diffStats.removed}

Differences:
${differences.join('\n')}

First Text:
${text1}

Second Text:
${text2}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `text-diff-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMessage(t('downloaded', '✓ Diff report downloaded successfully!'));
  };

  const resetAll = () => {
    setText1('');
    setText2('');
    setDiffLines([]);
    setDifferences([]);
    setDiffStats({ added: 0, removed: 0, changed: 0, same: 0 });
    setSimilarity(0);
    setError(null);
    setSuccessMessage(null);
  };

  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
    setSuccessMessage(t('swapped', '✓ Texts swapped!'));
  };

  const loadSample = () => {
    const sample1 = `The quick brown fox jumps over the lazy dog.
This is a sample text for comparison.
It contains multiple lines.
We can see the differences clearly.`;

    const sample2 = `The quick brown fox jumps over the lazy cat.
This is a modified sample text for comparison.
It contains multiple lines with changes.
We can see what has been modified.`;
    
    setText1(sample1);
    setText2(sample2);
    setSuccessMessage(t('sample_loaded', '✓ Sample texts loaded!'));
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('text-diff-history');
      setSuccessMessage(t('history_cleared', '✓ History cleared successfully!'));
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'same': return '#10B981';
      case 'different': return '#F59E0B';
      case 'only1': return '#EF4444';
      case 'only2': return '#3B82F6';
      default: return themeColors.text.secondary;
    }
  };

  const getStatusBg = (status: string) => {
    switch(status) {
      case 'same': return `${successColor}10`;
      case 'different': return `${warningColor}10`;
      case 'only1': return `${errorColor}10`;
      case 'only2': return `${themeColors.primary}10`;
      default: return 'transparent';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'same': return <Equal className="h-4 w-4" style={{ color: successColor }} />;
      case 'different': return <GitCompare className="h-4 w-4" style={{ color: warningColor }} />;
      case 'only1': return <Minus className="h-4 w-4" style={{ color: errorColor }} />;
      case 'only2': return <Plus className="h-4 w-4" style={{ color: themeColors.primary }} />;
      default: return null;
    }
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
              <GitCompare className="h-10 w-10" style={{ color: themeColors.primary }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <GradientText>{t('title', 'Text Diff Checker')}</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Compare two texts and find differences with detailed line-by-line analysis, similarity scoring, and export options')}
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${successColor}15` }}>
              <GitCompare className="h-3.5 w-3.5" style={{ color: successColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('line_by_line', 'Line by Line')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${warningColor}15` }}>
              <Eye className="h-3.5 w-3.5" style={{ color: warningColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('highlighting', 'Highlighting')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Download className="h-3.5 w-3.5" style={{ color: themeColors.primary }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('export', 'Export')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'diff', icon: GitCompare, label: t('tab_diff', 'Diff') },
            { id: 'unified', icon: Code, label: t('tab_unified', 'Unified View') },
            { id: 'stats', icon: Database, label: t('tab_stats', 'Statistics') },
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
            
            {/* DIFF TAB */}
            {activeTab === 'diff' && (
              <>
                {/* Options */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Settings className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('comparison_options', 'Comparison Options')}
                  </h2>
                  
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showLineNumbers}
                        onChange={(e) => setShowLineNumbers(e.target.checked)}
                        className="rounded"
                        style={{ accentColor: themeColors.primary }}
                      />
                      <span className="text-sm" style={{ color: themeColors.text.primary }}>{t('show_line_numbers', 'Show line numbers')}</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={ignoreWhitespace}
                        onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                        className="rounded"
                        style={{ accentColor: themeColors.primary }}
                      />
                      <span className="text-sm" style={{ color: themeColors.text.primary }}>{t('ignore_whitespace', 'Ignore whitespace')}</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={caseSensitive}
                        onChange={(e) => setCaseSensitive(e.target.checked)}
                        className="rounded"
                        style={{ accentColor: themeColors.primary }}
                      />
                      <span className="text-sm" style={{ color: themeColors.text.primary }}>{t('case_sensitive', 'Case sensitive')}</span>
                    </label>
                  </div>
                </div>

                {/* Text Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Text 1 */}
                  <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: themeColors.border }}>
                      <h3 className="font-semibold" style={{ color: themeColors.text.primary }}>{t('text_1', 'Text 1')}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(text1, t('text_1', 'Text 1'))}
                          disabled={!text1}
                          className="text-xs px-2 py-1 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
                          style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                        >
                          <Copy className="h-3 w-3 inline mr-1" />
                          {t('copy', 'Copy')}
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={text1}
                      onChange={(e) => setText1(e.target.value)}
                      className="w-full p-4 rounded-b-xl resize-none focus:outline-none focus:ring-2 transition-all font-mono text-sm"
                      style={{ 
                        backgroundColor: themeColors.background,
                        color: themeColors.text.primary,
                        minHeight: '250px'
                      }}
                      placeholder={t('placeholder_1', 'Enter first text here...')}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.primary}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Text 2 */}
                  <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: themeColors.border }}>
                      <h3 className="font-semibold" style={{ color: themeColors.text.primary }}>{t('text_2', 'Text 2')}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(text2, t('text_2', 'Text 2'))}
                          disabled={!text2}
                          className="text-xs px-2 py-1 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
                          style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                        >
                          <Copy className="h-3 w-3 inline mr-1" />
                          {t('copy', 'Copy')}
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={text2}
                      onChange={(e) => setText2(e.target.value)}
                      className="w-full p-4 rounded-b-xl resize-none focus:outline-none focus:ring-2 transition-all font-mono text-sm"
                      style={{ 
                        backgroundColor: themeColors.background,
                        color: themeColors.text.primary,
                        minHeight: '250px'
                      }}
                      placeholder={t('placeholder_2', 'Enter second text here...')}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.primary}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={findDifferences}
                    disabled={!text1 && !text2}
                    className="flex-1 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                  >
                    <GitCompare className="h-4 w-4" />
                    {t('compare', 'Compare Texts')}
                  </button>
                  <button
                    onClick={swapTexts}
                    disabled={!text1 && !text2}
                    className="px-4 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                    style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('swap', 'Swap')}</span>
                  </button>
                  <button
                    onClick={loadSample}
                    className="px-4 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('sample', 'Sample')}</span>
                  </button>
                </div>

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* Results */}
                {differences.length > 0 && (
                  <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                        <GitCompare className="h-5 w-5" style={{ color: themeColors.primary }} />
                        {t('differences_found', 'Differences Found')}: {differences.length === 1 && differences[0] === t('no_differences', 'No differences found!') ? 0 : differences.length}
                      </h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(differences.join('\n'), t('differences', 'Differences'))}
                          className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                          style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                        >
                          <Copy className="h-3 w-3 inline mr-1" />
                          {t('copy_all', 'Copy All')}
                        </button>
                        <button
                          onClick={downloadDiff}
                          className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                          style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                        >
                          <Download className="h-3 w-3 inline mr-1" />
                          {t('download', 'Download')}
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl border max-h-64 overflow-y-auto" 
                      style={{ backgroundColor: themeColors.background, borderColor: themeColors.border }}>
                      {differences.map((diff, index) => (
                        <div
                          key={index}
                          className={`p-2 mb-2 rounded-lg text-sm ${
                            diff.includes('≠') || diff.includes(t('line_different', 'Line')) 
                              ? 'bg-orange-100 text-orange-800' 
                              : diff.includes(t('line_only_first', 'Only in first')) 
                                ? 'bg-red-100 text-red-800'
                                : diff.includes(t('line_only_second', 'Only in second'))
                                  ? 'bg-blue-100 text-blue-800'
                                  : diff.includes(t('no_differences', 'No differences found'))
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {diff}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reset Button */}
                <div className="flex gap-3">
                  <button
                    onClick={resetAll}
                    className="flex-1 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('reset_all', 'Reset All')}
                  </button>
                </div>

                {/* Tips */}
                <div className="rounded-xl p-5" style={{ backgroundColor: `${themeColors.primary}08`, border: `1px solid ${themeColors.primary}20` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <GitCompare className="h-5 w-5" style={{ color: themeColors.primary }} />
                    <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('diff_tips', 'Diff Tips')}</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_1', 'Red lines indicate text only in first document')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_2', 'Blue lines indicate text only in second document')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_3', 'Yellow lines show differences in content')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_4', 'Use ignore whitespace for cleaner comparison')}</span>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* UNIFIED VIEW TAB */}
            {activeTab === 'unified' && diffLines.length > 0 && (
              <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="p-4 border-b" style={{ borderColor: themeColors.border }}>
                  <h2 className="font-semibold" style={{ color: themeColors.text.primary }}>{t('unified_view', 'Unified Diff View')}</h2>
                </div>
                <div className="divide-y max-h-[500px] overflow-y-auto" style={{ borderColor: themeColors.border }}>
                  {diffLines.map((line, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 font-mono text-sm"
                      style={{ backgroundColor: getStatusBg(line.status) }}
                    >
                      <div className="flex items-start gap-3">
                        {showLineNumbers && (
                          <span className="text-xs w-12 shrink-0" style={{ color: themeColors.text.secondary }}>
                            {line.lineNumber}
                          </span>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(line.status)}
                            <span className="text-xs font-medium" style={{ color: getStatusColor(line.status) }}>
                              {line.status === 'same' ? t('same', 'Same') :
                               line.status === 'different' ? t('different', 'Different') :
                               line.status === 'only1' ? t('only_in_first', 'Only in first') :
                               t('only_in_second', 'Only in second')}
                            </span>
                          </div>
                          {line.text1 && (
                            <div className="p-1 rounded" style={{ backgroundColor: line.status === 'only1' ? `${errorColor}10` : 'transparent' }}>
                              <span className="text-xs" style={{ color: errorColor }}>- </span>
                              <span style={{ color: themeColors.text.primary }}>{line.text1 || ' '}</span>
                            </div>
                          )}
                          {line.text2 && (
                            <div className="p-1 rounded mt-1" style={{ backgroundColor: line.status === 'only2' ? `${themeColors.primary}10` : 'transparent' }}>
                              <span className="text-xs" style={{ color: themeColors.primary }}>+ </span>
                              <span style={{ color: themeColors.text.primary }}>{line.text2 || ' '}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* UNIFIED VIEW - No Data */}
            {activeTab === 'unified' && diffLines.length === 0 && (
              <div className="rounded-xl border p-12 text-center" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <GitCompare className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                <p className="text-lg" style={{ color: themeColors.text.secondary }}>
                  {t('no_diff', 'No diff results yet')}
                </p>
                <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                  {t('compare_first', 'Compare texts first to see unified view')}
                </p>
              </div>
            )}

            {/* STATISTICS TAB */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                {/* Similarity Score */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Database className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('similarity_analysis', 'Similarity Analysis')}
                  </h2>
                  
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold" style={{ color: similarity >= 80 ? successColor : similarity >= 50 ? warningColor : errorColor }}>
                      {similarity}%
                    </div>
                    <div className="text-sm mt-1" style={{ color: themeColors.text.secondary }}>{t('similarity_score', 'Similarity Score')}</div>
                  </div>
                  
                  <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: `${themeColors.primary}20` }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${similarity}%`, backgroundColor: similarity >= 80 ? successColor : similarity >= 50 ? warningColor : errorColor }} />
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h3 className="font-semibold mb-4" style={{ color: themeColors.text.primary }}>{t('detailed_statistics', 'Detailed Statistics')}</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${successColor}10` }}>
                      <div className="text-2xl font-bold" style={{ color: successColor }}>{diffStats.same}</div>
                      <div className="text-sm" style={{ color: themeColors.text.secondary }}>{t('same_lines', 'Same Lines')}</div>
                    </div>
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${warningColor}10` }}>
                      <div className="text-2xl font-bold" style={{ color: warningColor }}>{diffStats.changed}</div>
                      <div className="text-sm" style={{ color: themeColors.text.secondary }}>{t('changed_lines', 'Changed Lines')}</div>
                    </div>
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${errorColor}10` }}>
                      <div className="text-2xl font-bold" style={{ color: errorColor }}>{diffStats.removed}</div>
                      <div className="text-sm" style={{ color: themeColors.text.secondary }}>{t('removed_lines', 'Removed Lines')}</div>
                    </div>
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${themeColors.primary}10` }}>
                      <div className="text-2xl font-bold" style={{ color: themeColors.primary }}>{diffStats.added}</div>
                      <div className="text-sm" style={{ color: themeColors.text.secondary }}>{t('added_lines', 'Added Lines')}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${themeColors.primary}10` }}>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: themeColors.text.secondary }}>{t('total_lines_1', 'Total lines (Text 1)')}:</span>
                      <span className="font-medium" style={{ color: themeColors.primary }}>{text1.split('\n').length}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span style={{ color: themeColors.text.secondary }}>{t('total_lines_2', 'Total lines (Text 2)')}:</span>
                      <span className="font-medium" style={{ color: themeColors.primary }}>{text2.split('\n').length}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span style={{ color: themeColors.text.secondary }}>{t('characters_1', 'Characters (Text 1)')}:</span>
                      <span className="font-medium" style={{ color: themeColors.primary }}>{text1.length}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span style={{ color: themeColors.text.secondary }}>{t('characters_2', 'Characters (Text 2)')}:</span>
                      <span className="font-medium" style={{ color: themeColors.primary }}>{text2.length}</span>
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
                        {t('comparison_history', 'Comparison History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_comparisons', 'Your recent text comparisons')}
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
                              <GitCompare className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.text1Length} {t('chars', 'chars')} vs {entry.text2Length} {t('chars', 'chars')}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${warningColor}15`, color: warningColor }}>
                                {entry.differences} {t('diffs', 'diffs')}
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
                      {t('no_history', 'No comparison history yet')}
                    </p>
                    <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your text comparisons will appear here')}
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
