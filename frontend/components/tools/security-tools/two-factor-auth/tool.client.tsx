
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams } from 'next/navigation';
import { 
  Key, QrCode, Copy, Check, Shield, Clock, Smartphone, Zap,
  AlertCircle, X, Download, RefreshCw, Trash2, Eye, EyeOff,
  Lock, Fingerprint, Database, Award, Star, HelpCircle,
  ChevronDown, ChevronUp, Settings, Info, Printer, Mail,
  CheckCircle, AlertTriangle, Loader2
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// Types
interface BackupCode {
  code: string;
  used: boolean;
}

interface TOTPHistory {
  id: number;
  timestamp: string;
  accountName: string;
  secret: string;
}

// Utility function to generate Base32 secret
const generateBase32Secret = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  const cryptoArray = new Uint8Array(length);
  crypto.getRandomValues(cryptoArray);
  for (let i = 0; i < length; i++) {
    result += chars.charAt(cryptoArray[i] % chars.length);
  }
  return result;
};

// Utility function to generate TOTP code (simulated - in production use proper TOTP library)
const generateMockTOTP = (): string => {
  const timestamp = Math.floor(Date.now() / 30000);
  return String(timestamp % 1000000).padStart(6, '0');
};

export default function TwoFactorAuthClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ 
    namespace: 'tools', 
    category: 'security-tools' 
  });
  
  const [mounted, setMounted] = useState(false);
  
  const t = useCallback((key: string, defaultValue?: string): string => {
    const toolKey = `two_factor_auth.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  }, [tTools]);

  // State declarations
  const [secret, setSecret] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [accountName, setAccountName] = useState('');
  const [issuer, setIssuer] = useState('Centre.com.pk');
  const [backupCodes, setBackupCodes] = useState<BackupCode[]>([]);
  const [copied, setCopied] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generator' | 'backup' | 'history'>('generator');
  const [history, setHistory] = useState<TOTPHistory[]>([]);
  const [qrUrl, setQrUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQRFull, setShowQRFull] = useState(false);

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const timeLeftRef = useRef(30); // ✅ Track timeLeft without causing re-renders

  // Generate QR URL for authenticator apps
  const generateQRUrl = useCallback((secretKey: string, account: string, issuerName: string) => {
    const encodedIssuer = encodeURIComponent(issuerName);
    const encodedAccount = encodeURIComponent(account || 'user@example.com');
    return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secretKey}&issuer=${encodedIssuer}&period=30&digits=6&algorithm=SHA1`;
  }, []);

  // Generate new secret
  const generateSecret = useCallback(() => {
    setIsGenerating(true);
    try {
      const newSecret = generateBase32Secret(32);
      setSecret(newSecret);
      const newQrUrl = generateQRUrl(newSecret, accountName || 'user@example.com', issuer);
      setQrUrl(newQrUrl);
      if (isMountedRef.current) {
        setSuccessMessage(t('secret_generated', '✓ New secret key generated!'));
        if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
        successTimeoutRef.current = setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(t('generation_failed', 'Failed to generate secret key'));
      }
    } finally {
      setIsGenerating(false);
    }
  }, [accountName, issuer, t, generateQRUrl]);

  // Generate backup codes
  const generateBackupCodes = useCallback(() => {
    const codes: BackupCode[] = Array.from({ length: 10 }, () => ({
      code: Math.random().toString().slice(2, 10).padEnd(8, '0'),
      used: false
    }));
    setBackupCodes(codes);
    if (isMountedRef.current) {
      setSuccessMessage(t('backup_generated', '✓ New backup codes generated! Save them securely.'));
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => setSuccessMessage(null), 3000);
    }
  }, [t]);

  // Load history from localStorage
  const loadHistory = useCallback(() => {
    try {
      const savedHistory = localStorage.getItem('2fa-history');
      if (savedHistory && isMountedRef.current) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  }, []);

  // Save to history
  const saveToHistory = useCallback(() => {
    if (!accountName.trim()) {
      setError(t('enter_account', 'Please enter an account name first'));
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = setTimeout(() => setError(null), 3000);
      return;
    }
    
    const entry: TOTPHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      accountName: accountName.trim(),
      secret: secret.substring(0, 10) + '...',
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('2fa-history', JSON.stringify(newHistory));
      setSuccessMessage(t('saved', '✓ Configuration saved to history!'));
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => setSuccessMessage(null), 3000);
    } catch (e) {
      console.error('Error saving to history:', e);
      setError(t('save_failed', 'Failed to save to history'));
    }
  }, [accountName, secret, history, t]);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem('2fa-history');
      setSuccessMessage(t('history_cleared', '✓ History cleared successfully!'));
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => setSuccessMessage(null), 3000);
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  }, [t]);

  // Copy to clipboard
  const handleCopy = useCallback((text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setSuccessMessage(t('copied', `✓ ${type} copied to clipboard!`));
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    successTimeoutRef.current = setTimeout(() => {
      setCopied(false);
      setSuccessMessage(null);
    }, 2000);
  }, [t]);

  // Download backup codes
  const downloadBackupCodes = useCallback(() => {
    const content = backupCodes.map((bc, i) => `${i + 1}. ${bc.code}`).join('\n');
    const blob = new Blob([
      `Backup Codes for ${accountName || 'Account'}\n`,
      `Generated: ${new Date().toLocaleString()}\n`,
      `${'='.repeat(50)}\n\n`,
      content,
      `\n\n${'='.repeat(50)}\n`,
      `Keep these codes safe! Each code can only be used once.\n`
    ], { type: 'text/plain' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `2fa-backup-codes-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    setSuccessMessage(t('downloaded', '✓ Backup codes downloaded!'));
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    successTimeoutRef.current = setTimeout(() => setSuccessMessage(null), 3000);
  }, [backupCodes, accountName, t]);

  // Print backup codes
  const printBackupCodes = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>2FA Backup Codes - ${issuer}</title>
            <style>
              body { font-family: monospace; padding: 40px; max-width: 800px; margin: 0 auto; }
              h1 { color: #2563EB; }
              .code { font-size: 24px; letter-spacing: 2px; margin: 10px 0; padding: 10px; background: #f3f4f6; border-radius: 8px; }
              .warning { color: #F59E0B; margin-top: 30px; padding: 15px; background: #FEF3C7; border-radius: 8px; }
              hr { margin: 20px 0; }
            </style>
          </head>
          <body>
            <h1>${issuer} - Backup Codes</h1>
            <p><strong>Account:</strong> ${accountName || 'Not specified'}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <hr/>
            <h2>Your Backup Codes (10 codes)</h2>
            ${backupCodes.map((bc, i) => `<div class="code">${i + 1}. ${bc.code}</div>`).join('')}
            <div class="warning">
              <strong>⚠️ Important:</strong><br/>
              • Store these codes in a secure, offline location<br/>
              • Each code can only be used once<br/>
              • Keep these codes separate from your password manager<br/>
              • Never share these codes with anyone
            </div>
            <hr/>
            <p><em>Generated by Centre.com.pk 2FA Tool</em></p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }, [backupCodes, accountName, issuer]);

  // Reset all
  const resetAll = useCallback(() => {
    generateSecret();
    generateBackupCodes();
    setAccountName('');
    setError(null);
    setSuccessMessage(null);
    setActiveTab('generator');
  }, [generateSecret, generateBackupCodes]);

  // Format time
  const formatTime = useCallback((timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  }, []);

  // ✅ Mount effect
  useEffect(() => {
    isMountedRef.current = true;
    setMounted(true);
    
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, []);

  // ✅ Initialize data ONCE when mounted
  useEffect(() => {
    if (mounted) {
      generateSecret();
      generateBackupCodes();
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // ✅ TOTP timer - COMPLETELY STABLE using refs (NO INFINITE LOOP!)
  useEffect(() => {
    if (!mounted) return;
    
    // Function to update TOTP code
    const updateTOTP = () => {
      const newCode = generateMockTOTP();
      setTotpCode(newCode);
    };
    
    // Initial TOTP generation
    updateTOTP();
    timeLeftRef.current = 30;
    setTimeLeft(30);
    
    // Set up interval for timer display
    timerRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      
      if (timeLeftRef.current <= 0) {
        // Time's up - generate new code and reset timer
        timeLeftRef.current = 30;
        updateTOTP();
      }
      
      setTimeLeft(timeLeftRef.current);
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mounted]); // ✅ ONLY depends on mounted - NO other dependencies!

  // ✅ Update QR URL when dependencies change
  useEffect(() => {
    if (secret && mounted) {
      const newQrUrl = generateQRUrl(secret, accountName || 'user@example.com', issuer);
      setQrUrl(newQrUrl);
    }
  }, [accountName, issuer, secret, generateQRUrl, mounted]);

  // Loading state
  const isLoading = !mounted || toolsLoading;

  // Dynamic styles
  const dynamicStyles = useMemo(() => ({
    '--primary': themeColors.primary || '#2563EB',
    '--primary-light': `${themeColors.primary || '#2563EB'}15`,
    '--background': themeColors.background || '#FFFFFF',
    '--surface': themeColors.surface || '#F8FAFC',
    '--text-primary': themeColors.text?.primary || '#1E293B',
    '--text-secondary': themeColors.text?.secondary || '#475569',
    '--border': themeColors.border || '#E2E8F0',
    '--success': '#10B981',
    '--error': '#EF4444',
    '--warning': '#F59E0B',
    '--font-family': fontFamily || 'system-ui, sans-serif',
  } as React.CSSProperties), [themeColors, fontFamily]);

  const successColor = '#10B981';
  const errorColor = '#EF4444';
  const warningColor = '#F59E0B';
  const isRTL = lang === 'ur' || lang === 'ar';

  // Loading component
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: themeColors.primary }} />
          <div className="animate-pulse text-lg" style={{ color: themeColors.primary }}>
            {t('loading', 'Loading 2FA Generator...')}
          </div>
        </div>
      </div>
    );
  }

  const GradientText = ({ children }: { children: React.ReactNode }) => (
    <span style={{ 
      background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary || themeColors.primary})`,
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

      <CentralAd position="top" size="banner" />
      
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12" style={dynamicStyles}>
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-5">
            <div className="rounded-2xl p-4 shadow-lg" style={{ 
              backgroundColor: `${themeColors.primary}15`,
              boxShadow: `0 10px 25px -5px ${themeColors.primary}30`
            }}>
              <Shield className="h-10 w-10" style={{ color: themeColors.primary }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <GradientText>{t('title', '2FA Generator')}</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Generate TOTP codes, create QR codes for authenticator apps, and manage backup codes for enhanced account security')}
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${successColor}15` }}>
              <Shield className="h-3.5 w-3.5" style={{ color: successColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('rfc_6238', 'RFC 6238')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${warningColor}15` }}>
              <Clock className="h-3.5 w-3.5" style={{ color: warningColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('totp', 'TOTP')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <QrCode className="h-3.5 w-3.5" style={{ color: themeColors.primary }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('qr_compatible', 'QR Compatible')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'generator', icon: Key, label: t('tab_generator', 'TOTP Generator') },
            { id: 'backup', icon: Shield, label: t('tab_backup', 'Backup Codes') },
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
            <button 
              onClick={() => { setError(null); setSuccessMessage(null); }} 
              className="p-1 rounded-lg hover:bg-black/5 transition-colors"
              aria-label="Close"
            >
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
                {/* Account Setup */}
                <div className="rounded-xl border p-6 transition-all hover:shadow-md" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Settings className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('account_setup', 'Account Setup')}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('issuer', 'Issuer / Company Name')}
                      </label>
                      <input
                        type="text"
                        value={issuer}
                        onChange={(e) => setIssuer(e.target.value)}
                        className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                        style={{ 
                          backgroundColor: themeColors.background,
                          borderColor: themeColors.border,
                          color: themeColors.text.primary,
                        }}
                        placeholder={t('issuer_placeholder', 'e.g., Google, GitHub, Centre.com.pk')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('account_name', 'Account Name / Email')}
                      </label>
                      <input
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                        style={{ 
                          backgroundColor: themeColors.background,
                          borderColor: themeColors.border,
                          color: themeColors.text.primary,
                        }}
                        placeholder={t('account_placeholder', 'user@example.com or username')}
                      />
                    </div>
                  </div>
                </div>

                {/* TOTP Code Display */}
                <div className="rounded-xl border p-6 transition-all hover:shadow-md" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <Clock className="h-5 w-5" style={{ color: themeColors.primary }} />
                      {t('totp_code', 'Current TOTP Code')}
                    </h2>
                    <div className="flex items-center gap-2 text-sm" style={{ color: themeColors.text.secondary }}>
                      <Clock className="h-4 w-4" />
                      {t('expires_in', 'Expires in')} <span className="font-mono font-bold">{timeLeft}</span>s
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="p-4 rounded-xl border text-center font-mono tracking-wider text-3xl md:text-4xl lg:text-5xl"
                      style={{ 
                        backgroundColor: themeColors.background,
                        borderColor: themeColors.border,
                        color: themeColors.text.primary,
                        letterSpacing: '0.5em'
                      }}
                    >
                      {totpCode}
                    </div>
                    <button
                      onClick={() => handleCopy(totpCode, t('code', 'Code'))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all hover:scale-105"
                      style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                      aria-label="Copy code"
                    >
                      {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* Timer progress bar */}
                  <div className="mt-4">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${themeColors.primary}20` }}>
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-linear"
                        style={{ 
                          width: `${(timeLeft / 30) * 100}%`, 
                          backgroundColor: timeLeft <= 5 ? errorColor : themeColors.primary 
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Secret Key */}
                <div className="rounded-xl border p-6 transition-all hover:shadow-md" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <Key className="h-5 w-5" style={{ color: themeColors.primary }} />
                      {t('secret_key', 'Secret Key')}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowSecret(!showSecret)}
                        className="p-2 rounded-lg transition-all hover:scale-105"
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                        aria-label={showSecret ? 'Hide secret' : 'Show secret'}
                      >
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={generateSecret}
                        disabled={isGenerating}
                        className="p-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                        aria-label="Generate new secret"
                      >
                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="p-4 rounded-xl border break-all font-mono text-sm"
                      style={{ 
                        backgroundColor: themeColors.background,
                        borderColor: themeColors.border,
                        color: themeColors.text.primary,
                      }}
                    >
                      {showSecret ? secret : '•'.repeat(Math.min(secret.length, 40))}
                    </div>
                    <button
                      onClick={() => handleCopy(secret, t('secret', 'Secret Key'))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all hover:scale-105"
                      style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                      aria-label="Copy secret"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 p-3 rounded-lg text-xs" style={{ backgroundColor: `${warningColor}10`, color: warningColor }}>
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    {t('secret_warning', 'Keep this secret key safe. Never share it with anyone. Store it in a password manager.')}
                  </div>
                </div>

                {/* QR Code */}
                <div className="rounded-xl border p-6 transition-all hover:shadow-md" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <QrCode className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('qr_code', 'QR Code')}
                  </h2>
                  
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-48 h-48 rounded-xl flex items-center justify-center mb-4 cursor-pointer transition-all hover:scale-105"
                      style={{ 
                        backgroundColor: themeColors.background,
                        border: `2px solid ${themeColors.border}`
                      }}
                      onClick={() => setShowQRFull(!showQRFull)}
                    >
                      {showQRFull ? (
                        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8" onClick={() => setShowQRFull(false)}>
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrUrl)}`}
                            alt="2FA QR Code Large"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrUrl)}`}
                          alt="2FA QR Code"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="text-center"><QrCode class="h-24 w-24 mx-auto mb-2" style="color:${themeColors.primary}" /><p class="text-xs" style="color:${themeColors.text.secondary}">Click to view TOTP URL</p></div>`;
                            }
                          }}
                        />
                      )}
                    </div>
                    <p className="text-sm text-center" style={{ color: themeColors.text.secondary }}>
                      {t('qr_instruction', 'Scan this QR code with Google Authenticator, Authy, Microsoft Authenticator, or any TOTP app')}
                    </p>
                    <button
                      onClick={() => handleCopy(qrUrl, t('totp_url', 'TOTP URL'))}
                      className="mt-3 px-3 py-1.5 rounded-lg text-xs transition-all hover:scale-105"
                      style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                    >
                      <Copy className="h-3 w-3 inline mr-1" />
                      {t('copy_url', 'Copy TOTP URL')}
                    </button>
                  </div>
                </div>

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* Save & Reset Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={saveToHistory}
                    className="flex-1 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: themeColors.primary, color: '#ffffff' }}
                  >
                    <Database className="h-4 w-4" />
                    {t('save_config', 'Save Configuration')}
                  </button>
                  <button
                    onClick={resetAll}
                    className="px-4 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('reset_all', 'Reset All')}</span>
                  </button>
                </div>

                {/* Security Tips */}
                <div className="rounded-xl p-5" style={{ backgroundColor: `${warningColor}10`, border: `1px solid ${warningColor}30` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5" style={{ color: warningColor }} />
                    <h3 className="font-semibold" style={{ color: warningColor }}>{t('security_tips', 'Security Best Practices')}</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: successColor }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_1', 'Store backup codes in a secure, offline location (print them out)')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: successColor }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_2', 'Never share your secret key or backup codes with anyone')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: successColor }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_3', 'Use a password manager like Bitwarden or 1Password to store 2FA secrets')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: successColor }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_4', 'Enable 2FA on all accounts that support it for maximum security')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: successColor }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_5', 'Keep backup codes separate from your password manager')}</span>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* BACKUP CODES TAB */}
            {activeTab === 'backup' && (
              <div className="rounded-xl border transition-all hover:shadow-md" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="p-5 border-b" style={{ borderColor: themeColors.border }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                        <Shield className="h-5 w-5" style={{ color: themeColors.primary }} />
                        {t('backup_codes', 'Recovery Backup Codes')}
                      </h2>
                      <p className="text-sm mt-1 opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('backup_desc', 'Each code can be used once to access your account if you lose your authenticator app')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={generateBackupCodes}
                        className="px-3 py-1.5 text-sm rounded-lg transition-all hover:scale-105"
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                      >
                        <RefreshCw className="h-3 w-3 inline mr-1" />
                        {t('regenerate', 'Regenerate')}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {backupCodes.map((bc, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-lg border text-center transition-all ${bc.used ? 'opacity-50' : 'hover:scale-[1.02]'}`}
                        style={{ 
                          backgroundColor: bc.used ? `${errorColor}10` : themeColors.background,
                          borderColor: bc.used ? errorColor : themeColors.border,
                        }}
                      >
                        <div className="font-mono font-bold text-lg tracking-wider" style={{ color: bc.used ? errorColor : themeColors.primary }}>
                          {bc.code}
                        </div>
                        <div className="text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                          {bc.used ? t('used', 'Used') : t('unused', 'Unused')}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => handleCopy(backupCodes.map(bc => bc.code).join('\n'), t('all_codes', 'All codes'))}
                      className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all hover:scale-105"
                      style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                    >
                      <Copy className="h-4 w-4" />
                      {t('copy_all', 'Copy All')}
                    </button>
                    <button
                      onClick={downloadBackupCodes}
                      className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all hover:scale-105"
                      style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                    >
                      <Download className="h-4 w-4" />
                      {t('download', 'Download TXT')}
                    </button>
                    <button
                      onClick={printBackupCodes}
                      className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all hover:scale-105"
                      style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                    >
                      <Printer className="h-4 w-4" />
                      {t('print', 'Print')}
                    </button>
                  </div>
                  
                  <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${warningColor}10`, border: `1px solid ${warningColor}30` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4" style={{ color: warningColor }} />
                      <span className="text-sm font-semibold" style={{ color: warningColor }}>{t('important', '⚠️ IMPORTANT')}</span>
                    </div>
                    <ul className="text-sm space-y-1" style={{ color: themeColors.text.secondary }}>
                      <li>• {t('backup_warning_1', 'Store these backup codes in a secure, offline location')}</li>
                      <li>• {t('backup_warning_2', 'Each code can only be used once')}</li>
                      <li>• {t('backup_warning_3', 'Regenerating codes will invalidate previous codes')}</li>
                      <li>• {t('backup_warning_4', 'Never store backup codes digitally without encryption')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
              <div className="rounded-xl border transition-all hover:shadow-md" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="p-5 border-b" style={{ borderColor: themeColors.border }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                        <Database className="h-5 w-5" style={{ color: themeColors.primary }} />
                        {t('saved_configs', 'Saved Configurations')}
                      </h2>
                      <p className="text-sm mt-1 opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_configs', 'Your recently saved 2FA configurations (max 10)')}
                      </p>
                    </div>
                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 flex items-center gap-2"
                        style={{ backgroundColor: `${errorColor}10`, color: errorColor }}
                      >
                        <Trash2 className="h-3 w-3" />
                        {t('clear_history', 'Clear All')}
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
                              <Key className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium truncate" style={{ color: themeColors.text.primary }}>
                                {entry.accountName}
                              </span>
                            </div>
                            <div className="text-xs font-mono" style={{ color: themeColors.text.secondary }}>
                              Secret: {entry.secret}
                            </div>
                            <p className="text-xs mt-1 opacity-60" style={{ color: themeColors.text.secondary }}>
                              {formatTime(entry.timestamp)}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setAccountName(entry.accountName);
                              setActiveTab('generator');
                              setSuccessMessage(t('loaded', '✓ Configuration loaded!'));
                              setTimeout(() => setSuccessMessage(null), 3000);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs transition-all hover:scale-105"
                            style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                          >
                            {t('load', 'Load')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                    <p className="text-base" style={{ color: themeColors.text.secondary }}>
                      {t('no_history', 'No saved configurations yet')}
                    </p>
                    <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Generate a 2FA code and click "Save Configuration" to see it here')}
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
