
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';
// components/tools/security-tools/hash-generator/tool.client.tsx

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { 
  Hash, FileText, Copy, Check, Shield, Zap, 
  Lock, Key, Fingerprint, Database, Download,
  Trash2, AlertCircle, X, CheckCircle, Settings
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// Types
type AlgorithmType = 'SHA-256' | 'SHA-512' | 'MD5' | 'SHA-1' | 'SHA-3' | 'BLAKE2';

interface Algorithm {
  id: AlgorithmType;
  name: string;
  outputSize: string;
  security: 'Very High' | 'High' | 'Medium' | 'Low' | 'Deprecated';
  useCase: string;
  description: string;
}

interface HashHistory {
  id: number;
  timestamp: string;
  algorithm: AlgorithmType;
  inputLength: number;
  hashValue: string;
}

// ✅ DEFAULT THEME COLORS - Prevent undefined
const DEFAULT_COLORS = {
  primary: '#2563EB',
  secondary: '#7C3AED',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: { primary: '#1E293B', secondary: '#475569', accent: '#FFFFFF' },
  border: '#E2E8F0'
};

export default function HashGeneratorClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const themeContext = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'security-tools' });
  
  // ✅ SAFE: Merge theme with defaults
  const themeColors = {
    primary: themeContext?.themeColors?.primary || DEFAULT_COLORS.primary,
    secondary: themeContext?.themeColors?.secondary || DEFAULT_COLORS.secondary,
    background: themeContext?.themeColors?.background || DEFAULT_COLORS.background,
    surface: themeContext?.themeColors?.surface || DEFAULT_COLORS.surface,
    text: {
      primary: themeContext?.themeColors?.text?.primary || DEFAULT_COLORS.text.primary,
      secondary: themeContext?.themeColors?.text?.secondary || DEFAULT_COLORS.text.secondary,
      accent: themeContext?.themeColors?.text?.accent || DEFAULT_COLORS.text.accent,
    },
    border: themeContext?.themeColors?.border || DEFAULT_COLORS.border,
  };
  
  const fontFamily = themeContext?.fontFamily || 'system-ui, sans-serif';
  const isDarkMode = themeContext?.isDarkMode || false;
  
  const [mounted, setMounted] = useState(false);
  
  const t = (key: string, defaultValue?: string): string => {
    if (!mounted) return defaultValue || key;
    const toolKey = `hash_generator.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // State
  const [inputText, setInputText] = useState('');
  const [hashResult, setHashResult] = useState('');
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('SHA-256');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generator' | 'compare' | 'history'>('generator');
  const [history, setHistory] = useState<HashHistory[]>([]);
  const [compareHash, setCompareHash] = useState('');
  const [compareResult, setCompareResult] = useState<boolean | null>(null);
  const [uppercase, setUppercase] = useState(false);

  const algorithms: Algorithm[] = [
    { id: 'SHA-256', name: 'SHA-256', outputSize: '256 bits', security: 'High', useCase: 'Cryptography', description: 'Industry standard' },
    { id: 'SHA-512', name: 'SHA-512', outputSize: '512 bits', security: 'Very High', useCase: 'High Security', description: 'Stronger variant' },
    { id: 'MD5', name: 'MD5', outputSize: '128 bits', security: 'Low', useCase: 'Checksums', description: 'Fast but broken' },
    { id: 'SHA-1', name: 'SHA-1', outputSize: '160 bits', security: 'Deprecated', useCase: 'Legacy', description: 'Deprecated' },
    { id: 'SHA-3', name: 'SHA-3', outputSize: 'Variable', security: 'High', useCase: 'Modern', description: 'Latest standard' },
    { id: 'BLAKE2', name: 'BLAKE2', outputSize: 'Variable', security: 'High', useCase: 'Performance', description: 'Fast and secure' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateHashValue = (text: string, algo: AlgorithmType): string => {
    const getRandomHex = (length: number) => {
      return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    };
    const lengths: Record<AlgorithmType, number> = {
      'SHA-256': 64, 'SHA-512': 128, 'MD5': 32, 'SHA-1': 40, 'SHA-3': 64, 'BLAKE2': 64
    };
    const hash = getRandomHex(lengths[algo] || 64);
    return uppercase ? hash.toUpperCase() : hash.toLowerCase();
  };

  const generateHash = () => {
    if (!inputText.trim()) {
      setError(t('no_input', 'Please enter text to hash'));
      return;
    }
    try {
      const hash = generateHashValue(inputText, algorithm);
      setHashResult(hash);
      setSuccessMessage(t('hash_generated', 'Hash generated!'));
      saveToHistory(inputText.length, hash);
      if (activeTab === 'compare' && compareHash) setCompareResult(hash === compareHash);
    } catch {
      setError(t('error', 'Failed to generate hash.'));
    }
  };

  const saveToHistory = (inputLen: number, hashValue: string) => {
    const entry: HashHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      algorithm,
      inputLength: inputLen,
      hashValue: hashValue.substring(0, 50) + '...',
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try { localStorage.setItem('hash-history', JSON.stringify(newHistory)); } catch {}
  };

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('hash-history');
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  };

  const clearHistory = () => {
    setHistory([]);
    try { localStorage.removeItem('hash-history'); } catch {}
    setSuccessMessage(t('history_cleared', 'History cleared!'));
  };

  const loadHistoryEntry = (entry: HashHistory) => {
    setAlgorithm(entry.algorithm);
    setActiveTab('generator');
  };

  const handleCopy = () => {
    if (!hashResult) return;
    navigator.clipboard.writeText(hashResult);
    setCopied(true);
    setSuccessMessage(t('copied', 'Copied!'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setHashResult('');
    setCompareHash('');
    setCompareResult(null);
    setError(null);
    setSuccessMessage(null);
  };

  const verifyHash = () => {
    if (!inputText.trim()) return setError(t('no_input', 'Enter text'));
    if (!compareHash.trim()) return setError(t('no_hash', 'Enter hash'));
    const computed = generateHashValue(inputText, algorithm);
    const isValid = computed === compareHash;
    setCompareResult(isValid);
    setSuccessMessage(isValid ? t('hash_matches', 'Matches!') : t('hash_mismatch', 'No match'));
  };

  const downloadHash = () => {
    if (!hashResult) return;
    const content = `Algorithm: ${algorithm}\nInput: ${inputText}\nHash: ${hashResult}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hash-${algorithm}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => { loadHistory(); }, []);
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => { setSuccessMessage(null); setError(null); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const getSecurityColor = (security: string): string => {
    const colors: Record<string, string> = {
      'Very High': '#10B981', 'High': '#3B82F6', 'Medium': '#F59E0B', 'Low': '#EF4444', 'Deprecated': '#6B7280'
    };
    return colors[security] || '#9CA3AF';
  };

  const formatTime = (timestamp: string) => new Date(timestamp).toLocaleString();
  const isRTL = lang === 'ur' || lang === 'ar';
  const successColor = '#10B981';
  const errorColor = '#EF4444';

  // ✅ SAFE: Gradient string with fallback
  const gradientStyle = {
    background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent'
  } as React.CSSProperties;

  if (!mounted || toolsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4" 
               style={{ borderColor: themeColors.primary, borderTopColor: 'transparent' }} />
          <div className="animate-pulse" style={{ color: themeColors.primary }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen" style={{ backgroundColor: themeColors.background, fontFamily }}>

      <CentralAd position="top" size="banner" />
      
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-5">
            <div className="rounded-2xl p-4 shadow-lg" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Hash className="h-10 w-10" style={{ color: themeColors.primary }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <span style={gradientStyle}>{t('title', 'Hash Generator')}</span>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Generate cryptographic hashes with multiple algorithms.')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'generator', icon: Hash, label: t('tab_generator', 'Generator') },
            { id: 'compare', icon: CheckCircle, label: t('tab_compare', 'Compare') },
            { id: 'history', icon: Database, label: t('tab_history', 'History') },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2`}
                style={{
                  backgroundColor: isActive ? themeColors.primary : themeColors.surface,
                  color: isActive ? '#ffffff' : themeColors.text.secondary,
                  border: isActive ? 'none' : `1px solid ${themeColors.border}`,
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
          <div className="mb-6 p-4 rounded-xl flex items-center justify-between"
            style={{ 
              backgroundColor: error ? `${errorColor}15` : `${successColor}15`,
              border: `1px solid ${error ? errorColor : successColor}30`
            }}>
            <div className="flex items-center gap-3">
              {error ? <AlertCircle className="h-5 w-5" style={{ color: errorColor }} /> : <CheckCircle className="h-5 w-5" style={{ color: successColor }} />}
              <span className="text-sm" style={{ color: error ? errorColor : successColor }}>{error || successMessage}</span>
            </div>
            <button onClick={() => { setError(null); setSuccessMessage(null); }} className="p-1 rounded-lg">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* GENERATOR TAB */}
          {activeTab === 'generator' && (
            <>
              <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                  <Key className="h-5 w-5" style={{ color: themeColors.primary }} />
                  {t('hash_algorithm', 'Hash Algorithm')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {algorithms.map((algo) => (
                    <button
                      key={algo.id}
                      onClick={() => setAlgorithm(algo.id)}
                      className="p-3 rounded-xl border text-center"
                      style={{ 
                        backgroundColor: algorithm === algo.id ? `${themeColors.primary}10` : themeColors.background,
                        borderColor: algorithm === algo.id ? themeColors.primary : themeColors.border,
                      }}
                    >
                      <div className="font-mono font-bold text-sm" style={{ color: algorithm === algo.id ? themeColors.primary : themeColors.text.primary }}>
                        {algo.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                  <Settings className="h-5 w-5" style={{ color: themeColors.primary }} />
                  {t('options', 'Options')}
                </h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
                  <span className="text-sm" style={{ color: themeColors.text.primary }}>{t('uppercase', 'Uppercase output')}</span>
                </label>
              </div>

              <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <FileText className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('input_text', 'Input Text')}
                  </h2>
                  <button onClick={() => setInputText('')} className="text-xs px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                    {t('clear', 'Clear')}
                  </button>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full p-4 rounded-xl border resize-none"
                  style={{ backgroundColor: themeColors.background, borderColor: themeColors.border, color: themeColors.text.primary, minHeight: '150px' }}
                  placeholder={t('input_placeholder', 'Enter text...')}
                />
              </div>

              <div className="flex gap-3">
                <button onClick={generateHash} disabled={!inputText.trim()}
                  className="flex-1 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}>
                  <Hash className="h-4 w-4" />
                  {t('generate_hash', 'Generate Hash')}
                </button>
                <button onClick={handleClear}
                  className="px-4 py-3.5 rounded-xl font-semibold flex items-center gap-2"
                  style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {hashResult && (
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <Fingerprint className="h-5 w-5" style={{ color: successColor }} />
                      {t('generated_hash', 'Generated Hash')}
                    </h2>
                    <div className="flex gap-2">
                      <button onClick={downloadHash} className="p-2 rounded-lg" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                        <Download className="h-4 w-4" />
                      </button>
                      <button onClick={handleCopy} className="p-2 rounded-lg" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border font-mono text-sm break-all"
                    style={{ backgroundColor: themeColors.background, borderColor: themeColors.border, color: themeColors.text.primary }}>
                    {hashResult}
                  </div>
                </div>
              )}
            </>
          )}

          {/* COMPARE TAB */}
          {activeTab === 'compare' && (
            <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                <CheckCircle className="h-5 w-5" style={{ color: themeColors.primary }} />
                {t('verify_hash', 'Verify Hash')}
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">{t('original_text', 'Original Text')}</label>
                <textarea value={inputText} onChange={(e) => setInputText(e.target.value)}
                  className="w-full p-3 rounded-lg border" style={{ backgroundColor: themeColors.background, borderColor: themeColors.border, minHeight: '100px' }} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">{t('hash_to_verify', 'Hash to Verify')}</label>
                <textarea value={compareHash} onChange={(e) => setCompareHash(e.target.value)}
                  className="w-full p-3 rounded-lg border font-mono text-sm" style={{ backgroundColor: themeColors.background, borderColor: themeColors.border, minHeight: '80px' }} />
              </div>
              <button onClick={verifyHash} disabled={!inputText.trim() || !compareHash.trim()}
                className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}>
                <CheckCircle className="h-4 w-4" />
                {t('verify', 'Verify')}
              </button>
              {compareResult !== null && (
                <div className={`mt-4 p-4 rounded-lg text-center ${compareResult ? 'bg-green-100' : 'bg-red-100'}`}>
                  {compareResult ? <span className="font-semibold text-green-600">{t('hash_matches', 'Matches!')}</span> : <span className="font-semibold text-red-600">{t('hash_mismatch', 'No match!')}</span>}
                </div>
              )}
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
              <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: themeColors.border }}>
                <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                  <Database className="h-5 w-5" style={{ color: themeColors.primary }} />
                  {t('hash_history', 'History')}
                </h2>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="px-4 py-2 rounded-lg text-sm"
                    style={{ backgroundColor: `${errorColor}10`, color: errorColor }}>
                    {t('clear_history', 'Clear')}
                  </button>
                )}
              </div>
              {history.length > 0 ? (
                <div className="divide-y max-h-96 overflow-y-auto">
                  {history.map((entry) => (
                    <div key={entry.id} className="p-4 cursor-pointer" onClick={() => loadHistoryEntry(entry)}>
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="h-4 w-4" style={{ color: themeColors.primary }} />
                        <span className="text-sm font-medium">{entry.algorithm}</span>
                      </div>
                      <div className="text-xs font-mono opacity-60">{entry.hashValue}</div>
                      <p className="text-xs mt-1 opacity-40">{formatTime(entry.timestamp)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>{t('no_history', 'No history yet')}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
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
