
"use client";


import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { 
  Copy, RefreshCw, Shield, CheckCircle, Lock, Key, Settings,
  AlertCircle, X, Eye, EyeOff, Download, Trash2,
  Star, Award, Zap, Clock, Database, Fingerprint
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// Types
interface PasswordHistory {
  id: number;
  timestamp: string;
  password: string;
  length: number;
  strength: string;
  strengthScore: number;
}

export default function PasswordGeneratorClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'security-tools' });
  const [mounted, setMounted] = useState(false);
  
  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `password_generator.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // State
  const [password, setPassword] = useState<string>("");
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
  const [strength, setStrength] = useState<string>("");
  const [strengthScore, setStrengthScore] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generator' | 'history'>('generator');
  const [history, setHistory] = useState<PasswordHistory[]>([]);

  // Character sets
  const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijkmnpqrstuvwxyz";
  const numberChars = "23456789";
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const ambiguousChars = "O0Il1|";

  const uppercaseCharsFull = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseCharsFull = "abcdefghijklmnopqrstuvwxyz";
  const numberCharsFull = "0123456789";
  const symbolCharsFull = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const getCharSet = () => {
    let chars = "";
    
    if (includeUppercase) {
      chars += excludeAmbiguous ? uppercaseChars : uppercaseCharsFull;
    }
    if (includeLowercase) {
      chars += excludeAmbiguous ? lowercaseChars : lowercaseCharsFull;
    }
    if (includeNumbers) {
      chars += excludeAmbiguous ? numberChars : numberCharsFull;
    }
    if (includeSymbols) {
      chars += symbolChars;
    }
    
    return chars;
  };

  const generatePassword = () => {
    const chars = getCharSet();
    
    if (chars === "") {
      setError(t('no_chars', "Please select at least one character type!"));
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      generatedPassword += chars[randomIndex];
    }

    // Shuffle the password for better randomness
    generatedPassword = generatedPassword.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(generatedPassword);
    calculateStrength(generatedPassword);
    setCopied(false);
    setError(null);
  };

  const calculateStrength = (pass: string) => {
    let score = 0;
    
    // Length score (up to 5 points)
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (pass.length >= 16) score += 1;
    if (pass.length >= 24) score += 1;
    if (pass.length >= 32) score += 1;
    
    // Character variety score (up to 5 points)
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    // Bonus for mixed case and symbols
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 0.5;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 0.5;
    if (/[a-z]/.test(pass) && /[0-9]/.test(pass)) score += 0.5;
    if (/[^A-Za-z0-9]/.test(pass) && pass.length >= 12) score += 1;
    
    const finalScore = Math.min(10, Math.round(score * 1.5));
    setStrengthScore(finalScore);
    
    if (finalScore <= 3) setStrength(t('weak', "Weak"));
    else if (finalScore <= 5) setStrength(t('medium', "Medium"));
    else if (finalScore <= 7) setStrength(t('strong', "Strong"));
    else if (finalScore <= 9) setStrength(t('very_strong', "Very Strong"));
    else setStrength(t('extreme', "Extreme"));
    
    // Save to history only if password is strong enough (score >= 6)
    if (finalScore >= 6 && pass.length > 0) {
      saveToHistory(pass, finalScore);
    }
  };

  const saveToHistory = (pass: string, score: number) => {
    const entry: PasswordHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      password: pass.substring(0, 20) + (pass.length > 20 ? '...' : ''),
      length: pass.length,
      strength: strength,
      strengthScore: score,
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('password-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to history:', e);
    }
  };

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('password-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('password-history');
      setSuccessMessage(t('history_cleared', '✓ History cleared successfully!'));
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  const loadHistoryPassword = (entry: PasswordHistory) => {
    setPassword(entry.password);
    setLength(entry.length);
    calculateStrength(entry.password);
    setActiveTab('generator');
  };

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setSuccessMessage(t('copied', '✓ Password copied to clipboard!'));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError(t('copy_failed', "Failed to copy password"));
    }
  };

  const downloadPassword = () => {
    if (!password) return;
    
    const content = `Password: ${password}\nLength: ${length} characters\nStrength: ${strength}\nGenerated: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `password-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMessage(t('downloaded', '✓ Password saved to file!'));
  };

  const getStrengthColor = () => {
    if (strengthScore <= 3) return themeColors.error || '#EF4444';
    if (strengthScore <= 5) return themeColors.warning || '#F59E0B';
    if (strengthScore <= 7) return themeColors.success || '#10B981';
    if (strengthScore <= 9) return '#3B82F6';
    return '#8B5CF6';
  };

  const getStrengthLabel = () => {
    if (strengthScore <= 3) return t('weak', 'Weak');
    if (strengthScore <= 5) return t('medium', 'Medium');
    if (strengthScore <= 7) return t('strong', 'Strong');
    if (strengthScore <= 9) return t('very_strong', 'Very Strong');
    return t('extreme', 'Extreme');
  };

  const getEstimatedCrackTime = () => {
    if (strengthScore >= 10) return t('centuries_plus', 'Centuries+');
    if (strengthScore >= 9) return t('centuries', 'Centuries');
    if (strengthScore >= 7) return t('years', 'Years');
    if (strengthScore >= 5) return t('months', 'Months');
    if (strengthScore >= 3) return t('days', 'Days');
    return t('hours', 'Hours');
  };

  const getPasswordTips = () => {
    const tips = [];
    if (password.length < 12) tips.push(t('tip_length', "Use at least 12 characters"));
    if (!/[A-Z]/.test(password)) tips.push(t('tip_uppercase', "Include uppercase letters"));
    if (!/[a-z]/.test(password)) tips.push(t('tip_lowercase', "Include lowercase letters"));
    if (!/[0-9]/.test(password)) tips.push(t('tip_numbers', "Include numbers"));
    if (!/[^A-Za-z0-9]/.test(password)) tips.push(t('tip_symbols', "Include special characters"));
    if (password.length < 16) tips.push(t('tip_longer', "Make it longer for better security"));
    return tips;
  };

  const predefinedLengths = [
    { label: t('short', 'Short (12)'), value: 12 },
    { label: t('medium', 'Medium (16)'), value: 16 },
    { label: t('long', 'Long (24)'), value: 24 },
    { label: t('very_long', 'Very Long (32)'), value: 32 },
    { label: t('extreme', 'Extreme (64)'), value: 64 },
  ];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  useEffect(() => {
    setMounted(true);
    loadHistory();
    generatePassword();
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
      {/* <ToolContentRenderer content={PasswordGeneratorContent} /> */}
      <CentralAd position="top" size="banner" />
      
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12" style={getDynamicStyles()}>
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-5">
            <div className="rounded-2xl p-4 shadow-lg" style={{ 
              backgroundColor: `${themeColors.primary}15`,
              boxShadow: `0 10px 25px -5px ${themeColors.primary}30`
            }}>
              <Key className="h-10 w-10" style={{ color: themeColors.primary }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <GradientText>{t('title', 'Password Generator')}</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Create strong, secure, and random passwords up to 500 characters with customizable options')}
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${successColor}15` }}>
              <Shield className="h-3.5 w-3.5" style={{ color: successColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('cryptographically_secure', 'Cryptographically Secure')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${warningColor}15` }}>
              <Lock className="h-3.5 w-3.5" style={{ color: warningColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('client_side', 'Client-Side')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Zap className="h-3.5 w-3.5" style={{ color: themeColors.primary }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('instant', 'Instant Generation')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'generator', icon: Key, label: t('tab_generator', 'Generator') },
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
                {/* Generated Password Display */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Key className="h-6 w-6" style={{ color: themeColors.primary }} />
                    <h2 className="text-xl font-semibold" style={{ color: themeColors.text.primary }}>
                      {t('generated_password', 'Generated Password')}
                    </h2>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="flex-1 relative">
                      <div 
                        className="p-4 rounded-xl border font-mono text-lg tracking-wider break-all min-h-[80px] pr-12"
                        style={{ 
                          backgroundColor: themeColors.background,
                          borderColor: themeColors.border,
                          color: themeColors.text.primary
                        }}
                      >
                        {showPassword ? password : '•'.repeat(Math.min(password.length, 30))}
                      </div>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors"
                        style={{ color: themeColors.text.secondary }}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        disabled={!password}
                        className="px-4 py-3 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                        style={{ 
                          backgroundColor: copied ? successColor : themeColors.primary,
                          color: themeColors.text.accent
                        }}
                      >
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? t('copied', 'Copied!') : t('copy', 'Copy')}
                      </button>
                      <button
                        onClick={downloadPassword}
                        disabled={!password}
                        className="px-4 py-3 rounded-xl transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Password Strength */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                        {t('password_strength', 'Password Strength')}:
                      </span>
                      <span className="font-semibold" style={{ color: getStrengthColor() }}>
                        {getStrengthLabel()}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: themeColors.background }}>
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(strengthScore / 10) * 100}%`,
                          backgroundColor: getStrengthColor()
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Options */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex items-center gap-3 mb-6">
                    <Settings className="h-6 w-6" style={{ color: themeColors.primary }} />
                    <h2 className="text-xl font-semibold" style={{ color: themeColors.text.primary }}>
                      {t('password_options', 'Password Options')}
                    </h2>
                  </div>

                  {/* Length Selection */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                        {t('password_length', 'Password Length')}: <span style={{ color: themeColors.primary }}>{length}</span> {t('characters', 'characters')}
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {predefinedLengths.map((item) => (
                          <button
                            key={item.value}
                            onClick={() => setLength(item.value)}
                            className={`px-3 py-1 text-sm rounded-lg transition-all ${length === item.value ? 'scale-105' : 'hover:scale-102'}`}
                            style={{ 
                              backgroundColor: length === item.value ? themeColors.primary : `${themeColors.primary}10`,
                              color: length === item.value ? themeColors.text.accent : themeColors.primary,
                            }}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <input
                        type="range"
                        min="4"
                        max="128"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="flex-1"
                        style={{ accentColor: themeColors.primary }}
                      />
                      <input
                        type="number"
                        min="4"
                        max="128"
                        value={length}
                        onChange={(e) => setLength(Math.min(128, Math.max(4, Number(e.target.value))))}
                        className="w-20 px-3 py-1 text-center border rounded-lg"
                        style={{ 
                          backgroundColor: themeColors.background,
                          borderColor: themeColors.border,
                          color: themeColors.text.primary
                        }}
                      />
                    </div>
                  </div>

                  {/* Character Options */}
                  <div className="space-y-4 mb-8">
                    <h3 className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                      {t('include_characters', 'Include Characters')}:
                    </h3>
                    
                    {[
                      { id: 'uppercase', label: t('uppercase', 'Uppercase Letters (A-Z)'), checked: includeUppercase, setter: setIncludeUppercase, example: "ABCDEFGH" },
                      { id: 'lowercase', label: t('lowercase', 'Lowercase Letters (a-z)'), checked: includeLowercase, setter: setIncludeLowercase, example: "abcdefgh" },
                      { id: 'numbers', label: t('numbers', 'Numbers (0-9)'), checked: includeNumbers, setter: setIncludeNumbers, example: "0123456789" },
                      { id: 'symbols', label: t('symbols', 'Symbols (!@#$%^&*)'), checked: includeSymbols, setter: setIncludeSymbols, example: "!@#$%^&*" },
                    ].map((option) => (
                      <div key={option.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: themeColors.border }}>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={option.checked}
                            onChange={(e) => option.setter(e.target.checked)}
                            className="h-4 w-4 rounded"
                            style={{ accentColor: themeColors.primary }}
                          />
                          <div>
                            <label className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                              {option.label}
                            </label>
                            <div className="text-xs font-mono" style={{ color: themeColors.text.secondary }}>
                              {option.example}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 rounded-lg" style={{ 
                          backgroundColor: option.checked ? `${successColor}10` : `${errorColor}10`,
                          color: option.checked ? successColor : errorColor
                        }}>
                          {option.checked ? t('enabled', 'Enabled') : t('disabled', 'Disabled')}
                        </div>
                      </div>
                    ))}
                    
                    {/* Exclude Ambiguous Characters */}
                    <div className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: themeColors.border }}>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={excludeAmbiguous}
                          onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                          className="h-4 w-4 rounded"
                          style={{ accentColor: themeColors.primary }}
                        />
                        <div>
                          <label className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                            {t('exclude_ambiguous', 'Exclude Ambiguous Characters')}
                          </label>
                          <div className="text-xs font-mono" style={{ color: themeColors.text.secondary }}>
                            {t('ambiguous_example', 'O, 0, I, l, 1, |')}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs px-2 py-1 rounded-lg" style={{ 
                        backgroundColor: excludeAmbiguous ? `${successColor}10` : `${errorColor}10`,
                        color: excludeAmbiguous ? successColor : errorColor
                      }}>
                        {excludeAmbiguous ? t('enabled', 'Enabled') : t('disabled', 'Disabled')}
                      </div>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={generatePassword}
                    className="w-full py-3.5 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ 
                      backgroundColor: themeColors.primary,
                      color: themeColors.text.accent
                    }}
                  >
                    <RefreshCw className="h-5 w-5" />
                    {t('generate_new', 'Generate New Password')}
                  </button>
                </div>

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* Password Analysis & Tips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Security Tips */}
                  <div className="rounded-xl p-5" style={{ 
                    backgroundColor: `${themeColors.primary}10`,
                    border: `1px solid ${themeColors.primary}30`
                  }}>
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="h-5 w-5" style={{ color: themeColors.primary }} />
                      <h3 className="font-semibold" style={{ color: themeColors.primary }}>
                        {t('security_tips', 'Security Tips')}
                      </h3>
                    </div>
                    <ul className="space-y-2 text-sm" style={{ color: themeColors.text.secondary }}>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: successColor }} />
                        <span>{t('tip_1', 'Use 16+ characters for maximum security')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: successColor }} />
                        <span>{t('tip_2', 'Combine all character types')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: successColor }} />
                        <span>{t('tip_3', 'Avoid common words or patterns')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: successColor }} />
                        <span>{t('tip_4', 'Use unique passwords for each account')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: successColor }} />
                        <span>{t('tip_5', 'Consider using a password manager')}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Password Analysis */}
                  <div className="rounded-xl border p-5" style={{ 
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.border
                  }}>
                    <div className="flex items-center gap-3 mb-4">
                      <Fingerprint className="h-5 w-5" style={{ color: themeColors.primary }} />
                      <h3 className="font-semibold" style={{ color: themeColors.text.primary }}>
                        {t('password_analysis', 'Password Analysis')}
                      </h3>
                    </div>
                    {password ? (
                      <div className="space-y-3">
                        <div className="text-sm">
                          <div className="flex justify-between mb-2">
                            <span style={{ color: themeColors.text.secondary }}>{t('length', 'Length')}:</span>
                            <span className="font-medium" style={{ 
                              color: password.length >= 32 ? '#8B5CF6' : 
                                     password.length >= 24 ? '#3B82F6' : 
                                     password.length >= 16 ? successColor : 
                                     password.length >= 12 ? warningColor : errorColor 
                            }}>
                              {password.length} {t('characters', 'chars')}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span style={{ color: themeColors.text.secondary }}>{t('character_variety', 'Character variety')}:</span>
                            <span className="font-medium" style={{ color: strengthScore >= 8 ? successColor : warningColor }}>
                              {[includeUppercase, includeLowercase, includeNumbers, includeSymbols].filter(Boolean).length}/4 {t('types', 'types')}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span style={{ color: themeColors.text.secondary }}>{t('estimated_crack_time', 'Estimated crack time')}:</span>
                            <span className="font-medium" style={{ color: getStrengthColor() }}>
                              {getEstimatedCrackTime()}
                            </span>
                          </div>
                        </div>
                        
                        {getPasswordTips().length > 0 && (
                          <div className="mt-3 pt-3 border-t" style={{ borderColor: themeColors.border }}>
                            <div className="text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                              {t('suggestions', 'Suggestions to improve')}:
                            </div>
                            <ul className="text-xs space-y-1">
                              {getPasswordTips().map((tip, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: errorColor }} />
                                  <span style={{ color: themeColors.text.secondary }}>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                        {t('generate_to_analyze', 'Generate a password to see analysis')}
                      </p>
                    )}
                  </div>
                </div>
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
                        {t('password_history', 'Password History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_passwords', 'Your recently generated strong passwords')}
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
                      <div key={entry.id} className="p-4 hover:bg-surface-hover transition-colors cursor-pointer"
                        onClick={() => loadHistoryPassword(entry)}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Key className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-mono" style={{ color: themeColors.text.primary }}>
                                {entry.password}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                                backgroundColor: `${getStrengthColor()}15`, 
                                color: getStrengthColor() 
                              }}>
                                {entry.strength}
                              </span>
                            </div>
                            <div className="flex gap-3 text-xs" style={{ color: themeColors.text.secondary }}>
                              <span>{entry.length} {t('chars', 'chars')}</span>
                              <span>{t('score', 'Score')}: {entry.strengthScore}/10</span>
                            </div>
                            <p className="text-xs mt-1 opacity-60" style={{ color: themeColors.text.secondary }}>
                              {formatTime(entry.timestamp)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); loadHistoryPassword(entry); }}
                            className="px-3 py-1.5 text-xs rounded-lg transition-all hover:scale-105"
                            style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                          >
                            {t('use', 'Use')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                    <p className="text-base" style={{ color: themeColors.text.secondary }}>
                      {t('no_history', 'No password history yet')}
                    </p>
                    <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your generated strong passwords will appear here')}
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
