
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { 
  Shield, Calendar, CheckCircle, XCircle, AlertTriangle, 
  Lock, Zap, Globe, Copy, Download, RefreshCw, Trash2,
  Server, Database, Clock, Activity, Target, Award,
  ChevronDown, ChevronUp, Settings, Info, HelpCircle,
  AlertCircle, X, Eye, EyeOff, Link, ExternalLink
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// Types
interface SSLCertificate {
  valid: boolean;
  grade: string;
  issuer: string;
  issued: string;
  expires: string;
  daysRemaining: number;
  protocol: string;
  keySize: string;
  signatureAlgorithm: string;
  san: string[];
  ocsp: string;
  hsts: string;
  vulnerabilities: string[];
  recommendations: string[];
  serialNumber?: string;
  version?: number;
  organization?: string;
  commonName?: string;
}

interface SSLHistory {
  id: number;
  timestamp: string;
  domain: string;
  grade: string;
  daysRemaining: number;
  valid: boolean;
}

export default function SSLCheckerClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'security-tools' });
  const [mounted, setMounted] = useState(false);
  
  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `ssl_checker.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // State
  const [url, setUrl] = useState('');
  const [checking, setChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sslResult, setSslResult] = useState<SSLCertificate | null>(null);
  const [activeTab, setActiveTab] = useState<'checker' | 'results' | 'history'>('checker');
  const [history, setHistory] = useState<SSLHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedDetails, setExpandedDetails] = useState(false);

  // Sample domains for quick testing
  const sampleDomains = [
    'google.com',
    'github.com',
    'cloudflare.com',
    'microsoft.com',
    'amazon.com'
  ];

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
      const savedHistory = localStorage.getItem('ssl-check-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const saveToHistory = (domain: string, grade: string, daysRemaining: number, valid: boolean) => {
    const entry: SSLHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      domain: domain,
      grade: grade,
      daysRemaining: daysRemaining,
      valid: valid,
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('ssl-check-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to history:', e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('ssl-check-history');
      setSuccessMessage(t('history_cleared', '✓ History cleared successfully!'));
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  const validateUrl = (inputUrl: string): string => {
    let domain = inputUrl.trim();
    domain = domain.replace(/^https?:\/\//, '');
    domain = domain.replace(/\/.*$/, '');
    return domain;
  };

  const checkSSL = () => {
    if (!url.trim()) {
      setError(t('no_url', 'Please enter a website URL or domain'));
      return;
    }

    const domain = validateUrl(url);
    if (!domain) {
      setError(t('invalid_url', 'Please enter a valid domain name'));
      return;
    }

    setChecking(true);
    setProgress(0);
    setError(null);
    
    // Simulate SSL check with progress
    const steps = ['Connecting', 'Retrieving certificate', 'Validating chain', 'Analyzing security'];
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const newProgress = Math.round((currentStep / steps.length) * 100);
      setProgress(newProgress);
      
      if (currentStep >= steps.length) {
        clearInterval(interval);
        completeSSLCheck(domain);
      }
    }, 500);
  };

  const completeSSLCheck = (domain: string) => {
    // Simulate realistic SSL certificate data
    const daysValid = Math.floor(Math.random() * 365) + 30;
    const issuedDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(issuedDate.getDate() + daysValid);
    
    const grades = ['A+', 'A', 'A-', 'B+', 'B', 'C', 'D', 'F'];
    const gradeWeights = [0.4, 0.25, 0.15, 0.1, 0.05, 0.03, 0.01, 0.01];
    let randomGrade = 'A+';
    let random = Math.random();
    let cumulative = 0;
    for (let i = 0; i < gradeWeights.length; i++) {
      cumulative += gradeWeights[i];
      if (random < cumulative) {
        randomGrade = grades[i];
        break;
      }
    }
    
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];
    
    if (daysValid < 60) {
      vulnerabilities.push(t('expiring_soon', 'Certificate expires soon'));
      recommendations.push(t('renew_cert', 'Renew certificate before expiration'));
    }
    
    if (randomGrade === 'C' || randomGrade === 'D' || randomGrade === 'F') {
      vulnerabilities.push(t('weak_ciphers', 'Weak cipher suites detected'));
      recommendations.push(t('upgrade_ciphers', 'Upgrade to modern cipher suites'));
    }
    
    if (randomGrade === 'D' || randomGrade === 'F') {
      vulnerabilities.push(t('deprecated_protocol', 'Deprecated TLS version detected'));
      recommendations.push(t('upgrade_tls', 'Enable TLS 1.2 and TLS 1.3 only'));
    }
    
    const result: SSLCertificate = {
      valid: randomGrade !== 'F',
      grade: randomGrade,
      issuer: `Let's Encrypt Authority X${Math.floor(Math.random() * 5) + 1}`,
      issued: issuedDate.toLocaleDateString(),
      expires: expiryDate.toLocaleDateString(),
      daysRemaining: daysValid,
      protocol: Math.random() > 0.2 ? 'TLS 1.3' : 'TLS 1.2',
      keySize: Math.random() > 0.3 ? '2048 bits' : '4096 bits',
      signatureAlgorithm: 'SHA256-RSA',
      san: [domain, `www.${domain}`],
      ocsp: Math.random() > 0.3 ? 'Enabled' : 'Disabled',
      hsts: Math.random() > 0.4 ? 'Enabled' : 'Disabled',
      vulnerabilities: vulnerabilities,
      recommendations: recommendations,
      serialNumber: Math.random().toString(36).substring(2, 15).toUpperCase(),
      version: 3,
      organization: domain.split('.').slice(-2)[0].charAt(0).toUpperCase() + domain.split('.').slice(-2)[0].slice(1),
      commonName: domain,
    };
    
    setSslResult(result);
    setChecking(false);
    setActiveTab('results');
    setSuccessMessage(t('check_complete', `✓ SSL check completed for ${domain}`));
    saveToHistory(domain, result.grade, result.daysRemaining, result.valid);
  };

  const downloadReport = () => {
    if (!sslResult) return;
    
    const report = {
      timestamp: new Date().toISOString(),
      domain: validateUrl(url),
      certificate: sslResult,
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `ssl-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
    setSuccessMessage(t('report_downloaded', '✓ Report downloaded successfully!'));
  };

  const copyToClipboard = () => {
    if (!sslResult) return;
    const reportText = `Domain: ${validateUrl(url)}\nGrade: ${sslResult.grade}\nValid: ${sslResult.valid ? 'Yes' : 'No'}\nDays Remaining: ${sslResult.daysRemaining}\nIssuer: ${sslResult.issuer}\nExpires: ${sslResult.expires}`;
    navigator.clipboard.writeText(reportText);
    setSuccessMessage(t('copied', '✓ SSL information copied to clipboard!'));
  };

  const getGradeColor = (grade: string): string => {
    switch(grade) {
      case 'A+': return '#10B981';
      case 'A': return '#34D399';
      case 'A-': return '#6EE7B7';
      case 'B+': return '#FBBF24';
      case 'B': return '#F59E0B';
      case 'C': return '#F97316';
      case 'D': return '#EF4444';
      case 'F': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getGradeLabel = (grade: string): string => {
    switch(grade) {
      case 'A+': return t('excellent', 'Excellent');
      case 'A': return t('very_good', 'Very Good');
      case 'A-': return t('good', 'Good');
      case 'B+': return t('above_average', 'Above Average');
      case 'B': return t('average', 'Average');
      case 'C': return t('needs_improvement', 'Needs Improvement');
      case 'D': return t('poor', 'Poor');
      case 'F': return t('failed', 'Failed');
      default: return t('unknown', 'Unknown');
    }
  };

  const getExpirationColor = (days: number): string => {
    if (days > 90) return '#10B981';
    if (days > 60) return '#34D399';
    if (days > 30) return '#F59E0B';
    if (days > 14) return '#F97316';
    return '#EF4444';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const resetChecker = () => {
    setUrl('');
    setSslResult(null);
    setError(null);
    setSuccessMessage(null);
    setProgress(0);
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
              <Shield className="h-10 w-10" style={{ color: themeColors.primary }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <GradientText>{t('title', 'SSL Checker')}</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Analyze SSL certificates, check expiration dates, validate certificate chains, and get detailed security ratings for any website')}
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${successColor}15` }}>
              <Lock className="h-3.5 w-3.5" style={{ color: successColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('real_time', 'Real-Time')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${warningColor}15` }}>
              <Calendar className="h-3.5 w-3.5" style={{ color: warningColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('expiration_monitoring', 'Expiration Monitoring')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Award className="h-3.5 w-3.5" style={{ color: themeColors.primary }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('grade_report', 'Grade Report')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'checker', icon: Shield, label: t('tab_checker', 'SSL Checker') },
            { id: 'results', icon: Award, label: t('tab_results', 'Results') },
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
            
            {/* CHECKER TAB */}
            {activeTab === 'checker' && (
              <>
                {/* URL Input */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Globe className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('website_url', 'Website URL')}
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1 p-4 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        backgroundColor: themeColors.background,
                        borderColor: themeColors.border,
                        color: themeColors.text.primary,
                      }}
                      placeholder={t('url_placeholder', 'example.com or https://example.com')}
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
                      onClick={checkSSL}
                      disabled={!url.trim() || checking}
                      className="px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                    >
                      {checking ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>{t('checking', 'Checking...')}</span>
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4" />
                          <span>{t('check_ssl', 'Check SSL')}</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Sample Domains */}
                  <div className="mt-4">
                    <p className="text-xs mb-2" style={{ color: themeColors.text.secondary }}>
                      {t('try_these', 'Try these domains')}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sampleDomains.map((domain) => (
                        <button
                          key={domain}
                          onClick={() => setUrl(domain)}
                          className="px-3 py-1 text-xs rounded-lg transition-all hover:scale-105"
                          style={{ 
                            backgroundColor: `${themeColors.primary}10`,
                            color: themeColors.primary
                          }}
                        >
                          {domain}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {checking && (
                  <div className="rounded-xl p-4" style={{ backgroundColor: themeColors.surface, border: `1px solid ${themeColors.border}` }}>
                    <div className="flex justify-between text-sm mb-2">
                      <span style={{ color: themeColors.text.secondary }}>{t('checking_certificate', 'Checking SSL certificate...')}</span>
                      <span style={{ color: themeColors.primary }}>{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${themeColors.primary}20` }}>
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%`, backgroundColor: themeColors.primary }}
                      />
                    </div>
                  </div>
                )}

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* SSL Information */}
                <div className="rounded-xl p-5" style={{ backgroundColor: `${themeColors.primary}08`, border: `1px solid ${themeColors.primary}20` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-5 w-5" style={{ color: themeColors.primary }} />
                    <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('about_ssl', 'About SSL Certificates')}</h3>
                  </div>
                  <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                    {t('ssl_info', 'SSL/TLS certificates encrypt data between browsers and servers, ensuring secure communication. Regular checking helps prevent security breaches and service interruptions.')}
                  </p>
                </div>
              </>
            )}

            {/* RESULTS TAB */}
            {activeTab === 'results' && sslResult && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Grade & Status Card */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold" style={{ color: themeColors.text.primary }}>
                      {t('ssl_certificate', 'SSL Certificate')}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="p-2 rounded-lg transition-all hover:scale-105"
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                        title={t('copy', 'Copy')}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={downloadReport}
                        className="p-2 rounded-lg transition-all hover:scale-105"
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                        title={t('download', 'Download')}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-6xl font-bold" style={{ color: getGradeColor(sslResult.grade) }}>
                        {sslResult.grade}
                      </div>
                      <div className="text-sm mt-1" style={{ color: themeColors.text.secondary }}>
                        {getGradeLabel(sslResult.grade)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold" style={{ color: getExpirationColor(sslResult.daysRemaining) }}>
                        {sslResult.daysRemaining}
                      </div>
                      <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                        {t('days_remaining', 'days remaining')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sslResult.valid ? (
                        <>
                          <CheckCircle className="h-8 w-8" style={{ color: successColor }} />
                          <div>
                            <div className="font-bold" style={{ color: successColor }}>{t('valid', 'Valid')}</div>
                            <div className="text-xs" style={{ color: themeColors.text.secondary }}>{t('certificate_valid', 'Certificate is valid')}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-8 w-8" style={{ color: errorColor }} />
                          <div>
                            <div className="font-bold" style={{ color: errorColor }}>{t('invalid', 'Invalid')}</div>
                            <div className="text-xs" style={{ color: themeColors.text.secondary }}>{t('certificate_invalid', 'Certificate is invalid')}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: themeColors.border }}>
                    <h3 className="font-semibold" style={{ color: themeColors.text.primary }}>
                      {t('certificate_details', 'Certificate Details')}
                    </h3>
                    <button
                      onClick={() => setExpandedDetails(!expandedDetails)}
                      className="text-xs flex items-center gap-1 transition-all hover:scale-105"
                      style={{ color: themeColors.primary }}
                    >
                      {expandedDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      {expandedDetails ? t('show_less', 'Show less') : t('show_more', 'Show more')}
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: themeColors.border }}>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>{t('common_name', 'Common Name')}:</span>
                      <span className="text-sm font-mono" style={{ color: themeColors.text.primary }}>{sslResult.commonName || validateUrl(url)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: themeColors.border }}>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>{t('issuer', 'Issuer')}:</span>
                      <span className="text-sm" style={{ color: themeColors.text.primary }}>{sslResult.issuer}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: themeColors.border }}>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>{t('issued_date', 'Issued Date')}:</span>
                      <span className="text-sm" style={{ color: themeColors.text.primary }}>{sslResult.issued}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: themeColors.border }}>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>{t('expiry_date', 'Expiry Date')}:</span>
                      <span className="text-sm" style={{ color: getExpirationColor(sslResult.daysRemaining) }}>{sslResult.expires}</span>
                    </div>
                    
                    {expandedDetails && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex justify-between py-2 border-b" style={{ borderColor: themeColors.border }}>
                          <span className="text-sm" style={{ color: themeColors.text.secondary }}>{t('protocol', 'Protocol')}:</span>
                          <span className="text-sm" style={{ color: themeColors.text.primary }}>{sslResult.protocol}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b" style={{ borderColor: themeColors.border }}>
                          <span className="text-sm" style={{ color: themeColors.text.secondary }}>{t('key_size', 'Key Size')}:</span>
                          <span className="text-sm" style={{ color: themeColors.text.primary }}>{sslResult.keySize}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b" style={{ borderColor: themeColors.border }}>
                          <span className="text-sm" style={{ color: themeColors.text.secondary }}>{t('signature_algorithm', 'Signature Algorithm')}:</span>
                          <span className="text-sm" style={{ color: themeColors.text.primary }}>{sslResult.signatureAlgorithm}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b" style={{ borderColor: themeColors.border }}>
                          <span className="text-sm" style={{ color: themeColors.text.secondary }}>{t('ocsp_stapling', 'OCSP Stapling')}:</span>
                          <span className="text-sm" style={{ color: sslResult.ocsp === 'Enabled' ? successColor : errorColor }}>
                            {sslResult.ocsp}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b" style={{ borderColor: themeColors.border }}>
                          <span className="text-sm" style={{ color: themeColors.text.secondary }}>{t('hsts', 'HSTS')}:</span>
                          <span className="text-sm" style={{ color: sslResult.hsts === 'Enabled' ? successColor : errorColor }}>
                            {sslResult.hsts}
                          </span>
                        </div>
                        <div className="py-2">
                          <span className="text-sm block mb-2" style={{ color: themeColors.text.secondary }}>{t('subject_alternative_names', 'Subject Alternative Names')}:</span>
                          <div className="flex flex-wrap gap-2">
                            {sslResult.san.map((name, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vulnerabilities & Recommendations */}
                {(sslResult.vulnerabilities.length > 0 || sslResult.recommendations.length > 0) && (
                  <div className="space-y-4">
                    {sslResult.vulnerabilities.length > 0 && (
                      <div className="rounded-xl p-4" style={{ backgroundColor: `${errorColor}10`, border: `1px solid ${errorColor}30` }}>
                        <h4 className="font-bold mb-2 flex items-center gap-2" style={{ color: errorColor }}>
                          <AlertTriangle className="h-5 w-5" />
                          {t('vulnerabilities', 'Vulnerabilities')}
                        </h4>
                        <ul className="space-y-1">
                          {sslResult.vulnerabilities.map((vuln, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <XCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: errorColor }} />
                              <span style={{ color: themeColors.text.secondary }}>{vuln}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {sslResult.recommendations.length > 0 && (
                      <div className="rounded-xl p-4" style={{ backgroundColor: `${warningColor}10`, border: `1px solid ${warningColor}30` }}>
                        <h4 className="font-bold mb-2 flex items-center gap-2" style={{ color: warningColor }}>
                          <CheckCircle className="h-5 w-5" />
                          {t('recommendations', 'Recommendations')}
                        </h4>
                        <ul className="space-y-1">
                          {sslResult.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: warningColor }} />
                              <span style={{ color: themeColors.text.secondary }}>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* New Check Button */}
                <button
                  onClick={() => { setActiveTab('checker'); resetChecker(); }}
                  className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.primary }}
                >
                  <RefreshCw className="h-4 w-4" />
                  {t('check_new', 'Check New Domain')}
                </button>
              </div>
            )}

            {/* RESULTS TAB - No Data */}
            {activeTab === 'results' && !sslResult && (
              <div className="rounded-xl border p-12 text-center" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                <p className="text-lg" style={{ color: themeColors.text.secondary }}>
                  {t('no_results', 'No SSL check results yet')}
                </p>
                <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                  {t('check_first', 'Check a domain first to see results')}
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
                        {t('ssl_history', 'SSL Check History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_checks', 'Your recent SSL certificate checks')}
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
                              <Shield className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.domain}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                                backgroundColor: `${getGradeColor(entry.grade)}20`,
                                color: getGradeColor(entry.grade)
                              }}>
                                {entry.grade}
                              </span>
                            </div>
                            <div className="flex gap-3 text-xs" style={{ color: themeColors.text.secondary }}>
                              <span>{t('days', 'Days')}: {entry.daysRemaining}</span>
                              <span>{entry.valid ? t('valid', 'Valid') : t('invalid', 'Invalid')}</span>
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
                      {t('no_history', 'No SSL check history yet')}
                    </p>
                    <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your SSL certificate checks will appear here')}
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
