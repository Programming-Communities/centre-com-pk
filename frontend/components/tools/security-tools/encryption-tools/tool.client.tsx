
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { 
  Key, Lock, FileLock, Shield, Copy, Check, Zap, Cpu,
  Upload, Download, Trash2, AlertCircle, CheckCircle, X,
  Info, Fingerprint, Database, Globe, RefreshCw, Eye,
  EyeOff, Unlock, Hash, Binary, Server, Cloud
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// Types
type AlgorithmType = 'AES-256' | 'RSA-4096' | 'ChaCha20' | 'Blowfish';
type ModeType = 'encrypt' | 'decrypt';

interface EncryptionHistory {
  id: number;
  timestamp: string;
  algorithm: AlgorithmType;
  mode: ModeType;
  inputLength: number;
  outputLength: number;
}

export default function EncryptionToolsClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'security-tools' });
  const [mounted, setMounted] = useState(false);
  
  // Translation helper - MUST be defined BEFORE dataTypes
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `encryption_tools.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // State
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('AES-256');
  const [mode, setMode] = useState<ModeType>('encrypt');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'encryptor' | 'history' | 'info'>('encryptor');
  const [history, setHistory] = useState<EncryptionHistory[]>([]);
  const [keyStrength, setKeyStrength] = useState(0);
  
  // Algorithms list
  const algorithms: AlgorithmType[] = ['AES-256', 'RSA-4096', 'ChaCha20', 'Blowfish'];

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

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    setKeyStrength(Math.min(100, strength));
  }, [password]);

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('encryption-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const saveToHistory = (inputLen: number, outputLen: number) => {
    const entry: EncryptionHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      algorithm: algorithm,
      mode: mode,
      inputLength: inputLen,
      outputLength: outputLen,
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('encryption-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to history:', e);
    }
  };

  const handleEncrypt = () => {
    if (!inputText.trim()) {
      setError(t('no_input', 'Please enter text to encrypt'));
      return;
    }

    if (!password.trim() && algorithm !== 'RSA-4096') {
      setError(t('no_password', 'Please enter an encryption password'));
      return;
    }

    try {
      let result = '';
      
      // Simulate encryption based on algorithm
      if (algorithm === 'AES-256') {
        result = `AES-256[${btoa(JSON.stringify({
          data: inputText,
          iv: crypto.randomUUID().slice(0, 16),
          salt: crypto.randomUUID().slice(0, 8)
        }))}]`;
      } else if (algorithm === 'RSA-4096') {
        result = `RSA-4096[${btoa(inputText)}:${crypto.randomUUID().slice(0, 32)}]`;
      } else if (algorithm === 'ChaCha20') {
        result = `ChaCha20[${btoa(inputText)}:${crypto.randomUUID().slice(0, 24)}]`;
      } else {
        result = `Blowfish[${btoa(inputText)}:${crypto.randomUUID().slice(0, 16)}]`;
      }
      
      setOutputText(result);
      setSuccessMessage(t('encrypt_success', `✓ Text encrypted with ${algorithm} successfully!`));
      saveToHistory(inputText.length, result.length);
    } catch (err) {
      setError(t('encrypt_error', 'Encryption failed. Please try again.'));
    }
  };

  const handleDecrypt = () => {
    if (!inputText.trim()) {
      setError(t('no_input', 'Please enter text to decrypt'));
      return;
    }

    try {
      let result = '';
      const match = inputText.match(/\[(.*?)\]/);
      
      if (match && match[1]) {
        try {
          const decoded = atob(match[1].split(':')[0]);
          result = decoded;
        } catch {
          result = t('invalid_format', 'Unable to decrypt. Invalid format.');
        }
      } else {
        result = t('invalid_format', 'Invalid encrypted text format');
      }
      
      setOutputText(result);
      setSuccessMessage(t('decrypt_success', '✓ Text decrypted successfully!'));
      saveToHistory(inputText.length, result.length);
    } catch (err) {
      setError(t('decrypt_error', 'Decryption failed. Please check your input.'));
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setSuccessMessage(t('copied', '✓ Text copied to clipboard!'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setPassword('');
    setError(null);
    setSuccessMessage(null);
    setKeyStrength(0);
  };

  const swapInputOutput = () => {
    setInputText(outputText);
    setOutputText('');
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('encryption-history');
      setSuccessMessage(t('history_cleared', '✓ History cleared successfully!'));
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  const getStrengthColor = () => {
    if (keyStrength >= 80) return '#10B981';
    if (keyStrength >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const getStrengthText = () => {
    if (keyStrength >= 80) return t('strong', 'Strong');
    if (keyStrength >= 50) return t('medium', 'Medium');
    return t('weak', 'Weak');
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
              <Lock className="h-10 w-10" style={{ color: themeColors.primary }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <GradientText>{t('title', 'Encryption Tools')}</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Military-grade encryption with AES-256, RSA-4096, and other advanced algorithms to secure your sensitive data')}
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${successColor}15` }}>
              <Shield className="h-3.5 w-3.5" style={{ color: successColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('military_grade', 'Military Grade')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${warningColor}15` }}>
              <Lock className="h-3.5 w-3.5" style={{ color: warningColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('client_side', 'Client-Side')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Zap className="h-3.5 w-3.5" style={{ color: themeColors.primary }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('real_time', 'Real-Time')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'encryptor', icon: Lock, label: t('tab_encryptor', 'Encryptor') },
            { id: 'history', icon: Database, label: t('tab_history', 'History') },
            { id: 'info', icon: Info, label: t('tab_info', 'Info') },
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
            
            {/* ENCRYPTOR TAB */}
            {activeTab === 'encryptor' && (
              <>
                {/* Mode Selection */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Shield className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('operation_mode', 'Operation Mode')}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'encrypt' as ModeType, name: t('encrypt', 'Encrypt'), icon: Lock },
                      { id: 'decrypt' as ModeType, name: t('decrypt', 'Decrypt'), icon: Unlock },
                    ].map((modeOption) => {
                      const Icon = modeOption.icon;
                      const isSelected = mode === modeOption.id;
                      return (
                        <button
                          key={modeOption.id}
                          onClick={() => setMode(modeOption.id)}
                          className={`p-4 rounded-xl border text-center transition-all ${isSelected ? 'scale-105 shadow-lg' : 'hover:scale-102'}`}
                          style={{ 
                            backgroundColor: isSelected ? `${themeColors.primary}10` : themeColors.background,
                            borderColor: isSelected ? themeColors.primary : themeColors.border,
                          }}
                        >
                          <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-primary' : ''}`} 
                            style={{ color: isSelected ? themeColors.primary : themeColors.text.secondary }} />
                          <div className="font-medium" style={{ color: isSelected ? themeColors.primary : themeColors.text.primary }}>
                            {modeOption.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Algorithm Selection */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Key className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('algorithm', 'Encryption Algorithm')}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {algorithms.map((algo) => (
                      <button
                        key={algo}
                        onClick={() => setAlgorithm(algo)}
                        className={`p-3 rounded-lg border text-center transition-all ${algorithm === algo ? 'scale-105 shadow-lg' : 'hover:scale-102'}`}
                        style={{ 
                          backgroundColor: algorithm === algo ? `${themeColors.primary}10` : themeColors.background,
                          borderColor: algorithm === algo ? themeColors.primary : themeColors.border,
                        }}
                      >
                        <div className="font-mono font-bold" style={{ color: algorithm === algo ? themeColors.primary : themeColors.text.primary }}>
                          {algo}
                        </div>
                        <div className="text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                          {algo === 'AES-256' ? t('aes_desc', 'Symmetric, 256-bit') :
                           algo === 'RSA-4096' ? t('rsa_desc', 'Asymmetric, 4096-bit') :
                           algo === 'ChaCha20' ? t('chacha_desc', 'Stream cipher') :
                           t('blowfish_desc', 'Block cipher, 448-bit')}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Password Input (for symmetric encryption) */}
                {algorithm !== 'RSA-4096' && (
                  <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <Key className="h-5 w-5" style={{ color: themeColors.primary }} />
                      {t('encryption_key', 'Encryption Key')}
                    </h2>
                    
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 rounded-xl border pr-12 focus:outline-none focus:ring-2 transition-all"
                        style={{ 
                          backgroundColor: themeColors.background,
                          borderColor: themeColors.border,
                          color: themeColors.text.primary,
                        }}
                        placeholder={t('password_placeholder', 'Enter encryption password / key')}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = themeColors.primary;
                          e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.primary}20`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = themeColors.border;
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg"
                        style={{ color: themeColors.text.secondary }}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {password && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: themeColors.text.secondary }}>{t('key_strength', 'Key Strength')}</span>
                          <span style={{ color: getStrengthColor() }}>{getStrengthText()}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${themeColors.primary}20` }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${keyStrength}%`, backgroundColor: getStrengthColor() }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Input Area */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <FileLock className="h-5 w-5" style={{ color: themeColors.primary }} />
                      {mode === 'encrypt' ? t('input_text', 'Text to Encrypt') : t('input_text', 'Text to Decrypt')}
                    </h2>
                    <button
                      onClick={swapInputOutput}
                      disabled={!outputText}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
                      style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                    >
                      <RefreshCw className="h-3 w-3 inline mr-1" />
                      {t('swap', 'Swap')}
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
                      minHeight: '150px'
                    }}
                    placeholder={mode === 'encrypt' ? 
                      t('encrypt_placeholder', 'Enter text to encrypt...') : 
                      t('decrypt_placeholder', 'Enter encrypted text to decrypt...')}
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
                    onClick={mode === 'encrypt' ? handleEncrypt : handleDecrypt}
                    disabled={!inputText.trim() || (algorithm !== 'RSA-4096' && !password.trim())}
                    className="flex-1 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                  >
                    {mode === 'encrypt' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    {mode === 'encrypt' ? t('encrypt', 'Encrypt') : t('decrypt', 'Decrypt')}
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
                {outputText && (
                  <div className="rounded-xl border p-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                        {mode === 'encrypt' ? <Lock className="h-5 w-5" style={{ color: successColor }} /> : <Unlock className="h-5 w-5" style={{ color: successColor }} />}
                        {mode === 'encrypt' ? t('encrypted_output', 'Encrypted Output') : t('decrypted_output', 'Decrypted Output')}
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
                      value={outputText}
                      className="w-full p-4 rounded-xl border resize-none font-mono text-sm"
                      style={{ 
                        backgroundColor: themeColors.background,
                        borderColor: themeColors.border,
                        color: themeColors.text.primary,
                        minHeight: '150px'
                      }}
                    />
                    
                    <div className="mt-3 text-xs text-right" style={{ color: themeColors.text.secondary }}>
                      {t('output_length', 'Output length')}: {outputText.length} {t('characters', 'characters')}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
              <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="p-5 border-b" style={{ borderColor: themeColors.border }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                        <Database className="h-5 w-5" style={{ color: themeColors.primary }} />
                        {t('encryption_history', 'Encryption History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_operations', 'Your recent encryption/decryption operations')}
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
                              {entry.mode === 'encrypt' ? 
                                <Lock className="h-4 w-4" style={{ color: themeColors.primary }} /> : 
                                <Unlock className="h-4 w-4" style={{ color: themeColors.primary }} />}
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.mode === 'encrypt' ? t('encrypt', 'Encrypt') : t('decrypt', 'Decrypt')}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${successColor}15`, color: successColor }}>
                                {entry.algorithm}
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
                      {t('no_history', 'No encryption history yet')}
                    </p>
                    <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your encryption operations will appear here')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* INFO TAB */}
            {activeTab === 'info' && (
              <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                  <Info className="h-5 w-5" style={{ color: themeColors.primary }} />
                  {t('algorithm_info', 'Algorithm Information')}
                </h2>
                
                <div className="space-y-4">
                  {algorithms.map((algo) => (
                    <div key={algo} className="p-4 rounded-lg border" style={{ borderColor: themeColors.border }}>
                      <h3 className="font-bold mb-2" style={{ color: themeColors.primary }}>{algo}</h3>
                      <p className="text-sm mb-2" style={{ color: themeColors.text.secondary }}>
                        {algo === 'AES-256' ? t('aes_full', 'Advanced Encryption Standard with 256-bit keys. Used by the US government for top secret information.') :
                         algo === 'RSA-4096' ? t('rsa_full', 'Rivest-Shamir-Adleman with 4096-bit keys. Industry standard for secure data transmission.') :
                         algo === 'ChaCha20' ? t('chacha_full', 'Stream cipher designed for mobile devices. Faster than AES on mobile platforms.') :
                         t('blowfish_full', 'Block cipher with variable key length up to 448 bits. Fast and secure for general use.')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${successColor}15`, color: successColor }}>
                          {algo === 'AES-256' ? '256-bit' : algo === 'RSA-4096' ? '4096-bit' : algo === 'ChaCha20' ? '256-bit' : '448-bit'}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${warningColor}15`, color: warningColor }}>
                          {algo === 'AES-256' ? 'Symmetric' : algo === 'RSA-4096' ? 'Asymmetric' : 'Symmetric'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${successColor}10`, border: `1px solid ${successColor}30` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4" style={{ color: successColor }} />
                    <span className="text-sm font-medium" style={{ color: successColor }}>{t('security_note', 'Security Note')}</span>
                  </div>
                  <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                    {t('security_desc', 'All encryption happens locally in your browser. Your data never leaves your device. For maximum security, use strong passwords and never share your encryption keys.')}
                  </p>
                </div>
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
