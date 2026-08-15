
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { 
  EyeOff, Copy, Check, Shield, FileText, Zap, Cpu, RefreshCw,
  Upload, Download, Trash2, AlertCircle, CheckCircle, X,
  Info, Lock, Key, Fingerprint, Database, Cloud, Globe,
  Plus, Minus, Settings, Save, FolderOpen, Clipboard
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// Types
type MaskingType = 'full' | 'partial' | 'reversible';

interface DataType {
  id: string;
  name: string;
  pattern: RegExp;
  enabled: boolean;
}

interface MaskingHistory {
  id: number;
  timestamp: string;
  inputLength: number;
  outputLength: number;
  maskingType: MaskingType;
  dataTypesCount: number;
}

export default function DataMaskingClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'security-tools' });
  const [mounted, setMounted] = useState(false);
  
  // ✅ STEP 1: Define t() function FIRST before using it
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `data_masking.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // State
  const [inputText, setInputText] = useState('');
  const [maskedText, setMaskedText] = useState('');
  const [maskingType, setMaskingType] = useState<MaskingType>('partial');
  const [preserveFormat, setPreserveFormat] = useState(true);
  const [showLastChars, setShowLastChars] = useState(3);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'masker' | 'history' | 'patterns'>('masker');
  const [history, setHistory] = useState<MaskingHistory[]>([]);
  const [customPatterns, setCustomPatterns] = useState<string[]>([]);
  
  // ✅ STEP 2: Now dataTypes can use t() function safely
  const [dataTypes, setDataTypes] = useState<DataType[]>([
    { id: 'email', name: t('email', 'Email Address'), pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, enabled: true },
    { id: 'phone', name: t('phone', 'Phone Number'), pattern: /(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g, enabled: true },
    { id: 'ssn', name: t('ssn', 'SSN'), pattern: /\d{3}-\d{2}-\d{4}/g, enabled: true },
    { id: 'creditcard', name: t('credit_card', 'Credit Card'), pattern: /\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}/g, enabled: true },
    { id: 'ip', name: t('ip', 'IP Address'), pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, enabled: true },
    { id: 'name', name: t('name', 'Person Name'), pattern: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, enabled: false },
  ]);

  useEffect(() => {
    setMounted(true);
    loadHistory();
  }, []);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('data-masking-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const saveToHistory = (inputLen: number, outputLen: number, typesCount: number) => {
    const entry: MaskingHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      inputLength: inputLen,
      outputLength: outputLen,
      maskingType: maskingType,
      dataTypesCount: typesCount,
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('data-masking-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to history:', e);
    }
  };

  const maskData = () => {
    if (!inputText.trim()) {
      setError(t('no_input', 'Please enter text to mask'));
      return;
    }

    let result = inputText;
    let matchedCount = 0;
    
    const enabledTypes = dataTypes.filter(dt => dt.enabled);
    
    enabledTypes.forEach((type) => {
      result = result.replace(type.pattern, (match) => {
        matchedCount++;
        
        if (maskingType === 'full') {
          return '*'.repeat(match.length);
        } else if (maskingType === 'partial') {
          if (preserveFormat) {
            const visibleChars = Math.min(showLastChars, match.length);
            const maskedPart = '*'.repeat(match.length - visibleChars);
            return maskedPart + match.slice(-visibleChars);
          } else {
            const visibleChars = Math.min(showLastChars, match.length);
            const maskedPart = '*'.repeat(match.length - visibleChars);
            return match.slice(0, visibleChars) + maskedPart;
          }
        } else {
          return `[MASKED:${btoa(match).substring(0, 20)}]`;
        }
      });
    });
    
    setMaskedText(result);
    setSuccessMessage(t('mask_success', `✓ Masked ${matchedCount} sensitive item(s) successfully!`));
    saveToHistory(inputText.length, result.length, matchedCount);
  };

  const handleCopy = () => {
    if (!maskedText) return;
    navigator.clipboard.writeText(maskedText);
    setCopied(true);
    setSuccessMessage(t('copied', '✓ Masked text copied to clipboard!'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setMaskedText('');
    setError(null);
    setSuccessMessage(null);
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('data-masking-history');
      setSuccessMessage(t('history_cleared', '✓ History cleared successfully!'));
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  const toggleDataType = (id: string) => {
    setDataTypes(prev => prev.map(dt => 
      dt.id === id ? { ...dt, enabled: !dt.enabled } : dt
    ));
  };

  const loadSample = () => {
    const sample = `John Smith
Email: john.smith@company.com
Phone: (555) 123-4567
SSN: 123-45-6789
Credit Card: 4111-1111-1111-1111
IP Address: 192.168.1.100

Another contact:
Jane Doe - jane.doe@example.org
Mobile: +1 (555) 987-6543
SSN: 987-65-4321
Card: 5555-5555-5555-4444
IP: 10.0.0.1`;
    
    setInputText(sample);
    setSuccessMessage(t('sample_loaded', '✓ Sample data loaded successfully!'));
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
              <EyeOff className="h-10 w-10" style={{ color: themeColors.primary }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <GradientText>{t('title', 'Data Masking Tool')}</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Protect sensitive information by masking PII, emails, phone numbers, and other confidential data while preserving format')}
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${successColor}15` }}>
              <Shield className="h-3.5 w-3.5" style={{ color: successColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('local_processing', 'Local Processing')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${warningColor}15` }}>
              <Lock className="h-3.5 w-3.5" style={{ color: warningColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('no_storage', 'No Data Storage')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Zap className="h-3.5 w-3.5" style={{ color: themeColors.primary }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('real_time', 'Real-Time Masking')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'masker', icon: EyeOff, label: t('tab_masker', 'Data Masker') },
            { id: 'patterns', icon: Fingerprint, label: t('tab_patterns', 'Patterns') },
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
            
            {/* MASKER TAB */}
            {activeTab === 'masker' && (
              <>
                {/* Masking Options */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Settings className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('masking_options', 'Masking Options')}
                  </h2>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { id: 'full' as MaskingType, name: t('full_mask', 'Full Mask'), icon: EyeOff },
                      { id: 'partial' as MaskingType, name: t('partial_mask', 'Partial'), icon: EyeOff },
                      { id: 'reversible' as MaskingType, name: t('reversible', 'Reversible'), icon: Key },
                    ].map((type) => {
                      const Icon = type.icon;
                      const isSelected = maskingType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setMaskingType(type.id)}
                          className={`p-3 rounded-xl border text-center transition-all ${isSelected ? 'scale-105 shadow-lg' : 'hover:scale-102'}`}
                          style={{ 
                            backgroundColor: isSelected ? `${themeColors.primary}10` : themeColors.background,
                            borderColor: isSelected ? themeColors.primary : themeColors.border,
                          }}
                        >
                          <Icon className={`h-5 w-5 mx-auto mb-2 ${isSelected ? 'text-primary' : ''}`} 
                            style={{ color: isSelected ? themeColors.primary : themeColors.text.secondary }} />
                          <div className="text-sm font-medium" style={{ color: isSelected ? themeColors.primary : themeColors.text.primary }}>
                            {type.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {maskingType === 'partial' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="preserveFormat"
                            checked={preserveFormat}
                            onChange={(e) => setPreserveFormat(e.target.checked)}
                            className="rounded"
                            style={{ accentColor: themeColors.primary }}
                          />
                          <label htmlFor="preserveFormat" className="text-sm" style={{ color: themeColors.text.primary }}>
                            {t('preserve_format', 'Preserve format (show last characters)')}
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                          {t('visible_chars', 'Visible Characters to Show')}: {showLastChars}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          value={showLastChars}
                          onChange={(e) => setShowLastChars(parseInt(e.target.value))}
                          className="w-full"
                          style={{ accentColor: themeColors.primary }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Data Types Selection */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Fingerprint className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('detect_mask', 'Detect & Mask')}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {dataTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => toggleDataType(type.id)}
                        className={`p-3 rounded-lg border flex items-center gap-2 transition-all ${
                          type.enabled ? 'opacity-100' : 'opacity-50'
                        }`}
                        style={{ 
                          backgroundColor: type.enabled ? `${themeColors.primary}10` : themeColors.background,
                          borderColor: type.enabled ? themeColors.primary : themeColors.border,
                        }}
                      >
                        <div className={`w-2 h-2 rounded-full ${type.enabled ? 'bg-primary' : 'bg-gray-400'}`} 
                          style={{ backgroundColor: type.enabled ? themeColors.primary : '#9CA3AF' }} />
                        <span className="text-sm" style={{ color: type.enabled ? themeColors.primary : themeColors.text.secondary }}>
                          {type.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <FileText className="h-5 w-5" style={{ color: themeColors.primary }} />
                      {t('input_text', 'Input Text')}
                    </h2>
                    <button
                      onClick={loadSample}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                      style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                    >
                      {t('load_sample', 'Load Sample')}
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
                    placeholder={t('input_placeholder', 'Enter text containing sensitive data...')}
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

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={maskData}
                    disabled={!inputText.trim()}
                    className="flex-1 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                  >
                    <EyeOff className="h-4 w-4" />
                    {t('mask_data', 'Mask Data')}
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-4 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('clear', 'Clear')}</span>
                  </button>
                </div>

                {/* Output Area */}
                {maskedText && (
                  <div className="rounded-xl border p-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                        <Shield className="h-5 w-5" style={{ color: successColor }} />
                        {t('masked_output', 'Masked Output')}
                      </h2>
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg transition-all hover:scale-105"
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                        title={t('copy', 'Copy')}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    <textarea
                      readOnly
                      value={maskedText}
                      className="w-full p-4 rounded-xl border resize-none"
                      style={{ 
                        backgroundColor: themeColors.background,
                        borderColor: themeColors.border,
                        color: themeColors.text.primary,
                        minHeight: '200px'
                      }}
                    />
                    
                    <div className="mt-3 text-xs text-right" style={{ color: themeColors.text.secondary }}>
                      {t('masked_length', 'Masked length')}: {maskedText.length} {t('characters', 'characters')}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* PATTERNS TAB */}
            {activeTab === 'patterns' && (
              <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                  <Fingerprint className="h-5 w-5" style={{ color: themeColors.primary }} />
                  {t('detection_patterns', 'Detection Patterns')}
                </h2>
                
                <div className="space-y-4">
                  {dataTypes.map((type) => (
                    <div key={type.id} className="p-4 rounded-lg border" style={{ borderColor: themeColors.border }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${type.enabled ? 'bg-primary' : 'bg-gray-400'}`} 
                            style={{ backgroundColor: type.enabled ? themeColors.primary : '#9CA3AF' }} />
                          <span className="font-medium" style={{ color: themeColors.text.primary }}>{type.name}</span>
                        </div>
                        <button
                          onClick={() => toggleDataType(type.id)}
                          className="text-xs px-2 py-1 rounded transition-all hover:scale-105"
                          style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                        >
                          {type.enabled ? t('enabled', 'Enabled') : t('disabled', 'Disabled')}
                        </button>
                      </div>
                      <div className="text-xs font-mono" style={{ color: themeColors.text.secondary }}>
                        {type.pattern.toString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${warningColor}10`, border: `1px solid ${warningColor}30` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4" style={{ color: warningColor }} />
                    <span className="text-sm font-medium" style={{ color: warningColor }}>{t('custom_patterns', 'Custom Patterns')}</span>
                  </div>
                  <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                    {t('custom_patterns_desc', 'Custom regex patterns can be added for organization-specific data formats like employee IDs, customer codes, etc.')}
                  </p>
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
                        {t('masking_history', 'Masking History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_masks', 'Your recent data masking operations')}
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
                              <EyeOff className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.maskingType === 'full' ? t('full_mask', 'Full Mask') : 
                                 entry.maskingType === 'partial' ? t('partial_mask', 'Partial Mask') : 
                                 t('reversible', 'Reversible')}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${successColor}15`, color: successColor }}>
                                {entry.dataTypesCount} {t('items', 'items')}
                              </span>
                            </div>
                            <div className="flex gap-3 text-xs" style={{ color: themeColors.text.secondary }}>
                              <span>{t('input', 'Input')}: {entry.inputLength} chars</span>
                              <span>{t('output', 'Output')}: {entry.outputLength} chars</span>
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
                      {t('no_history', 'No masking history yet')}
                    </p>
                    <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your masked data operations will appear here')}
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
