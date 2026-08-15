
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { 
  Copy, RotateCcw, CheckCircle, AlertCircle, X,
  FileText, Hash, AlignLeft, Type, Bold, Italic,
  Download, Trash2, RefreshCw, Eye, EyeOff, Printer,
  Layers, BookOpen, Sparkles, Wand2,
  Database, Settings
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// Types
type GenerationType = 'words' | 'sentences' | 'paragraphs';

interface LoremHistory {
  id: number;
  timestamp: string;
  type: GenerationType;
  quantity: number;
  length: number;
}

export default function LoremIpsumClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'text-tools' });
  const [mounted, setMounted] = useState(false);
  
  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `lorem_ipsum.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // State
  const [quantity, setQuantity] = useState(3);
  const [type, setType] = useState<GenerationType>('paragraphs');
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generator' | 'preview' | 'history'>('generator');
  const [history, setHistory] = useState<LoremHistory[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Expanded Lorem Ipsum word list
  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur',
    'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui',
    'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'voluptatem',
    'accusantium', 'doloremque', 'laudantium', 'totam', 'aperiam', 'eaque', 'ipsa',
    'quae', 'ab', 'illo', 'inventore', 'veritatis', 'et', 'quasi', 'architecto',
    'beatae', 'vitae', 'dicta', 'sunt', 'explicabo', 'nemo', 'enim', 'ipsam'
  ];

  useEffect(() => {
    setMounted(true);
    loadHistory();
  }, []);

  useEffect(() => {
    if (generatedText) {
      setWordCount(generatedText.split(/\s+/).length);
      setCharCount(generatedText.length);
    }
  }, [generatedText]);

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
      const savedHistory = localStorage.getItem('lorem-ipsum-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const saveToHistory = (genType: GenerationType, genQuantity: number, textLength: number) => {
    const entry: LoremHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: genType,
      quantity: genQuantity,
      length: textLength,
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('lorem-ipsum-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to history:', e);
    }
  };

  const getRandomWord = (capitalize = false): string => {
    const word = loremWords[Math.floor(Math.random() * loremWords.length)];
    return capitalize ? word.charAt(0).toUpperCase() + word.slice(1) : word;
  };

  const getRandomSentence = (): string => {
    const sentenceLength = Math.floor(Math.random() * 12) + 6; // 6-18 words
    const words = [];
    for (let i = 0; i < sentenceLength; i++) {
      words.push(getRandomWord(i === 0));
    }
    return words.join(' ') + '.';
  };

  const getRandomParagraph = (): string => {
    const sentenceCount = Math.floor(Math.random() * 5) + 3; // 3-8 sentences
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(getRandomSentence());
    }
    return sentences.join(' ');
  };

  const generateLoremIpsum = () => {
    let text = '';
    
    if (type === 'words') {
      const words = [];
      for (let i = 0; i < quantity; i++) {
        words.push(getRandomWord(i === 0));
      }
      text = words.join(' ');
    } else if (type === 'sentences') {
      const sentences = [];
      for (let i = 0; i < quantity; i++) {
        sentences.push(getRandomSentence());
      }
      text = sentences.join(' ');
    } else if (type === 'paragraphs') {
      const paragraphs = [];
      for (let i = 0; i < quantity; i++) {
        paragraphs.push(getRandomParagraph());
      }
      text = paragraphs.join('\n\n');
    }
    
    setGeneratedText(text);
    setSuccessMessage(t('generated', `✓ Lorem Ipsum ${type} generated successfully!`));
    saveToHistory(type, quantity, text.length);
  };

  const copyToClipboard = async () => {
    if (!generatedText) {
      setError(t('no_text', 'No text to copy'));
      return;
    }
    
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setSuccessMessage(t('copied', '✓ Text copied to clipboard!'));
    } catch (err) {
      setError(t('copy_failed', 'Failed to copy text'));
    }
  };

  const downloadText = () => {
    if (!generatedText) return;
    
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lorem-ipsum-${type}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMessage(t('downloaded', '✓ File downloaded successfully!'));
  };

  const resetGenerator = () => {
    setQuantity(3);
    setType('paragraphs');
    setGeneratedText('');
    setError(null);
    setSuccessMessage(null);
    setCopied(false);
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('lorem-ipsum-history');
      setSuccessMessage(t('history_cleared', '✓ History cleared successfully!'));
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  const getMaxValue = (): number => {
    switch(type) {
      case 'words': return 200;
      case 'sentences': return 50;
      case 'paragraphs': return 20;
      default: return 20;
    }
  };

  const getTypeLabel = (typeValue: GenerationType): string => {
    switch(typeValue) {
      case 'words': return t('words', 'Words');
      case 'sentences': return t('sentences', 'Sentences');
      case 'paragraphs': return t('paragraphs', 'Paragraphs');
      default: return typeValue;
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
              <BookOpen className="h-10 w-10" style={{ color: themeColors.primary }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <GradientText>{t('title', 'Lorem Ipsum Generator')}</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Generate professional placeholder text for your designs, mockups, and development projects with customizable options')}
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${successColor}15` }}>
              <Sparkles className="h-3.5 w-3.5" style={{ color: successColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('realistic', 'Realistic Text')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${warningColor}15` }}>
              <Wand2 className="h-3.5 w-3.5" style={{ color: warningColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('customizable', 'Customizable')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Layers className="h-3.5 w-3.5" style={{ color: themeColors.primary }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('bulk_generation', 'Bulk Generation')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'generator', icon: Wand2, label: t('tab_generator', 'Generator') },
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
            
            {/* GENERATOR TAB */}
            {activeTab === 'generator' && (
              <>
                {/* Controls */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Settings className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('generation_settings', 'Generation Settings')}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Type Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('type', 'Type')}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'words' as GenerationType, label: t('words', 'Words'), icon: Type },
                          { id: 'sentences' as GenerationType, label: t('sentences', 'Sentences'), icon: AlignLeft },
                          { id: 'paragraphs' as GenerationType, label: t('paragraphs', 'Paragraphs'), icon: Layers },
                        ].map((option) => {
                          const Icon = option.icon;
                          const isSelected = type === option.id;
                          return (
                            <button
                              key={option.id}
                              onClick={() => setType(option.id)}
                              className={`p-3 rounded-xl border text-center transition-all ${isSelected ? 'scale-105 shadow-lg' : 'hover:scale-102'}`}
                              style={{ 
                                backgroundColor: isSelected ? `${themeColors.primary}10` : themeColors.background,
                                borderColor: isSelected ? themeColors.primary : themeColors.border,
                              }}
                            >
                              <Icon className={`h-5 w-5 mx-auto mb-2 ${isSelected ? 'text-primary' : ''}`} 
                                style={{ color: isSelected ? themeColors.primary : themeColors.text.secondary }} />
                              <div className="text-sm font-medium" style={{ color: isSelected ? themeColors.primary : themeColors.text.primary }}>
                                {option.label}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quantity Slider */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('quantity', 'Quantity')}: <span style={{ color: themeColors.primary }}>{quantity}</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max={getMaxValue()}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full"
                        style={{ accentColor: themeColors.primary }}
                      />
                      <div className="flex justify-between text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                        <span>1</span>
                        <span>{getMaxValue()}</span>
                      </div>
                      <p className="text-xs mt-2" style={{ color: themeColors.text.secondary }}>
                        {type === 'words' ? t('words_desc', 'Number of words to generate') :
                         type === 'sentences' ? t('sentences_desc', 'Number of sentences to generate') :
                         t('paragraphs_desc', 'Number of paragraphs to generate')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateLoremIpsum}
                  className="w-full py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                >
                  <Sparkles className="h-5 w-5" />
                  {t('generate', 'Generate Lorem Ipsum')}
                </button>

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* Generated Text Preview */}
                {generatedText && (
                  <div className="rounded-xl border p-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                        <FileText className="h-5 w-5" style={{ color: successColor }} />
                        {t('generated_text', 'Generated Text')}
                      </h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowPreview(!showPreview)}
                          className="p-2 rounded-lg transition-all hover:scale-105"
                          style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                          title={showPreview ? t('hide', 'Hide') : t('show', 'Show')}
                        >
                          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    {showPreview ? (
                      <div className="p-4 rounded-xl border max-h-96 overflow-y-auto"
                        style={{ 
                          backgroundColor: themeColors.background,
                          borderColor: themeColors.border
                        }}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: themeColors.text.primary }}>
                          {generatedText}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border font-mono text-sm break-all whitespace-pre-wrap max-h-96 overflow-y-auto"
                        style={{ 
                          backgroundColor: themeColors.background,
                          borderColor: themeColors.border,
                          color: themeColors.text.primary
                        }}
                      >
                        {generatedText.substring(0, 500)}
                        {generatedText.length > 500 && '...'}
                      </div>
                    )}
                    
                    <div className="mt-3 flex justify-between text-xs" style={{ color: themeColors.text.secondary }}>
                      <span>{t('words_count', 'Words')}: {wordCount}</span>
                      <span>{t('characters_count', 'Characters')}: {charCount}</span>
                      <span>{t('type', 'Type')}: {getTypeLabel(type)}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {generatedText && (
                  <div className="flex gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                    >
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? t('copied', 'Copied!') : t('copy_text', 'Copy Text')}
                    </button>
                    <button
                      onClick={downloadText}
                      className="px-4 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">{t('download', 'Download')}</span>
                    </button>
                    <button
                      onClick={resetGenerator}
                      className="px-4 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="hidden sm:inline">{t('reset', 'Reset')}</span>
                    </button>
                  </div>
                )}

                {/* Info Section */}
                <div className="rounded-xl p-5" style={{ backgroundColor: `${themeColors.primary}08`, border: `1px solid ${themeColors.primary}20` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-5 w-5" style={{ color: themeColors.primary }} />
                    <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('about', 'About Lorem Ipsum')}</h3>
                  </div>
                  <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                    {t('about_text', 'Lorem Ipsum is dummy text used in printing and typesetting. It has been the industry\'s standard dummy text since the 1500s.')}
                  </p>
                </div>
              </>
            )}

            {/* PREVIEW TAB */}
            {activeTab === 'preview' && generatedText && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Eye className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('text_preview', 'Text Preview')}
                  </h2>
                  
                  <div className="p-6 rounded-xl border max-h-[500px] overflow-y-auto"
                    style={{ 
                      backgroundColor: themeColors.background,
                      borderColor: themeColors.border
                    }}
                  >
                    <div className="whitespace-pre-wrap text-base leading-relaxed" style={{ color: themeColors.text.primary }}>
                      {generatedText}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                    >
                      <Copy className="h-4 w-4" />
                      {t('copy_text', 'Copy Text')}
                    </button>
                    <button
                      onClick={downloadText}
                      className="px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                    >
                      <Download className="h-4 w-4" />
                      {t('download', 'Download')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW TAB - No Data */}
            {activeTab === 'preview' && !generatedText && (
              <div className="rounded-xl border p-12 text-center" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                <p className="text-lg" style={{ color: themeColors.text.secondary }}>
                  {t('no_text', 'No text generated yet')}
                </p>
                <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                  {t('generate_first', 'Generate Lorem Ipsum first to see preview')}
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
                        {t('generation_history', 'Generation History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_generations', 'Your recent Lorem Ipsum generations')}
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
                              <BookOpen className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.quantity} {getTypeLabel(entry.type)}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${successColor}15`, color: successColor }}>
                                {entry.length} {t('chars', 'chars')}
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
                      {t('no_history', 'No generation history yet')}
                    </p>
                    <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your generated Lorem Ipsum will appear here')}
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
