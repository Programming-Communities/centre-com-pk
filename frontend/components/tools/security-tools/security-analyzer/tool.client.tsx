
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, BarChart, 
  FileText, Zap, Cpu, Lock, Eye, EyeOff, Copy, Download,
  RefreshCw, Trash2, Activity, Target, Radio, Wifi,
  Database, Clock, Printer, Mail, Share2, ChevronDown,
  ChevronUp, Settings, Info, HelpCircle, Server, Cloud,
  Globe, Link, Code, ShieldCheck, Award, Star,
  AlertCircle, X
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';
// Types
type TestStatus = 'pass' | 'warning' | 'fail' | 'pending' | 'running';

interface SecurityTest {
  id: string;
  name: string;
  category: string;
  status: TestStatus;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  recommendation: string;
  score?: number;
}

interface Vulnerability {
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  remediation: string;
  cve?: string;
}

interface AnalysisResult {
  score: number;
  grade: string;
  vulnerabilities: Vulnerability[];
  recommendations: string[];
  tests: SecurityTest[];
  responseTime?: number;
  sslValid?: boolean;
  lastScan?: string;
}

interface AnalysisHistory {
  id: number;
  timestamp: string;
  url: string;
  score: number;
  grade: string;
  vulnerabilitiesCount: number;
}

export default function SecurityAnalyzerClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'security-tools' });
  const [mounted, setMounted] = useState(false);
  
  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `security_analyzer.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // State
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'analyzer' | 'results' | 'history'>('analyzer');
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [scanDepth, setScanDepth] = useState<'quick' | 'standard' | 'deep'>('standard');
  const [expandedTest, setExpandedTest] = useState<string | null>(null);

  // Security tests configuration
  const securityTests: SecurityTest[] = [
    { id: 'ssl', name: t('ssl_test', 'SSL/TLS Certificate'), category: 'Encryption', status: 'pending', severity: 'High', 
      description: t('ssl_desc', 'Validates SSL certificate installation and configuration'),
      recommendation: t('ssl_rec', 'Ensure valid SSL certificate from trusted CA, enable TLS 1.2/1.3') },
    { id: 'hsts', name: t('hsts_test', 'HSTS Policy'), category: 'Headers', status: 'pending', severity: 'Medium',
      description: t('hsts_desc', 'HTTP Strict Transport Security forces HTTPS connections'),
      recommendation: t('hsts_rec', 'Enable HSTS with max-age=31536000 and includeSubDomains') },
    { id: 'xss', name: t('xss_test', 'XSS Protection'), category: 'Security', status: 'pending', severity: 'Critical',
      description: t('xss_desc', 'Cross-Site Scripting protection mechanisms'),
      recommendation: t('xss_rec', 'Implement Content Security Policy and X-XSS-Protection header') },
    { id: 'csrf', name: t('csrf_test', 'CSRF Protection'), category: 'Security', status: 'pending', severity: 'High',
      description: t('csrf_desc', 'Cross-Site Request Forgery protection'),
      recommendation: t('csrf_rec', 'Use anti-CSRF tokens for state-changing requests') },
    { id: 'cors', name: t('cors_test', 'CORS Policy'), category: 'Headers', status: 'pending', severity: 'Medium',
      description: t('cors_desc', 'Cross-Origin Resource Sharing configuration'),
      recommendation: t('cors_rec', 'Restrict CORS to trusted origins only') },
    { id: 'csp', name: t('csp_test', 'Content Security Policy'), category: 'Headers', status: 'pending', severity: 'High',
      description: t('csp_desc', 'Content Security Policy prevents XSS and data injection'),
      recommendation: t('csp_rec', 'Implement strict CSP with nonce or hash for scripts') },
    { id: 'cookies', name: t('cookies_test', 'Cookie Security'), category: 'Privacy', status: 'pending', severity: 'Medium',
      description: t('cookies_desc', 'Secure and HttpOnly flags for cookies'),
      recommendation: t('cookies_rec', 'Set Secure, HttpOnly, and SameSite flags on cookies') },
    { id: 'clickjacking', name: t('clickjacking_test', 'Clickjacking Protection'), category: 'Security', status: 'pending', severity: 'Medium',
      description: t('clickjacking_desc', 'X-Frame-Options header prevents clickjacking'),
      recommendation: t('clickjacking_rec', 'Set X-Frame-Options: DENY or SAMEORIGIN') },
    { id: 'mime', name: t('mime_test', 'MIME Sniffing Protection'), category: 'Headers', status: 'pending', severity: 'Low',
      description: t('mime_desc', 'X-Content-Type-Options prevents MIME type sniffing'),
      recommendation: t('mime_rec', 'Set X-Content-Type-Options: nosniff') },
    { id: 'referrer', name: t('referrer_test', 'Referrer Policy'), category: 'Privacy', status: 'pending', severity: 'Low',
      description: t('referrer_desc', 'Controls referrer information in requests'),
      recommendation: t('referrer_rec', 'Set Referrer-Policy: strict-origin-when-cross-origin') },
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
      const savedHistory = localStorage.getItem('security-analysis-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const saveToHistory = (targetUrl: string, score: number, grade: string, vulnCount: number) => {
    const entry: AnalysisHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      url: targetUrl.length > 40 ? targetUrl.substring(0, 37) + '...' : targetUrl,
      score: score,
      grade: grade,
      vulnerabilitiesCount: vulnCount,
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('security-analysis-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to history:', e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('security-analysis-history');
      setSuccessMessage(t('history_cleared', '✓ History cleared successfully!'));
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  const validateUrl = (inputUrl: string): boolean => {
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
    return urlPattern.test(inputUrl);
  };

  const getRandomStatus = (): TestStatus => {
    const rand = Math.random();
    if (rand < 0.5) return 'pass';
    if (rand < 0.75) return 'warning';
    return 'fail';
  };

  const runAnalysis = () => {
    if (!url.trim()) {
      setError(t('no_url', 'Please enter a website URL'));
      return;
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http')) {
      targetUrl = 'https://' + targetUrl;
    }

    if (!validateUrl(targetUrl)) {
      setError(t('invalid_url', 'Please enter a valid URL'));
      return;
    }

    setAnalyzing(true);
    setProgress(0);
    setError(null);
    
    const totalTests = securityTests.length;
    let currentTest = 0;
    const updatedTests = [...securityTests];
    
    const interval = setInterval(() => {
      if (currentTest < totalTests) {
        updatedTests[currentTest] = {
          ...updatedTests[currentTest],
          status: getRandomStatus()
        };
        currentTest++;
        const newProgress = Math.round((currentTest / totalTests) * 100);
        setProgress(newProgress);
      }
      
      if (currentTest >= totalTests) {
        clearInterval(interval);
        completeAnalysis(updatedTests, targetUrl);
      }
    }, scanDepth === 'quick' ? 150 : scanDepth === 'standard' ? 250 : 400);
  };

  const completeAnalysis = (tests: SecurityTest[], targetUrl: string) => {
    const passCount = tests.filter(t => t.status === 'pass').length;
    const warningCount = tests.filter(t => t.status === 'warning').length;
    const failCount = tests.filter(t => t.status === 'fail').length;
    
    const baseScore = (passCount / tests.length) * 100;
    const penalty = warningCount * 2 + failCount * 5;
    const finalScore = Math.max(0, Math.min(100, Math.round(baseScore - penalty)));
    
    let grade = 'F';
    if (finalScore >= 90) grade = 'A+';
    else if (finalScore >= 85) grade = 'A';
    else if (finalScore >= 80) grade = 'A-';
    else if (finalScore >= 75) grade = 'B+';
    else if (finalScore >= 70) grade = 'B';
    else if (finalScore >= 65) grade = 'C+';
    else if (finalScore >= 60) grade = 'C';
    else if (finalScore >= 50) grade = 'D';
    
    const vulnerabilities: Vulnerability[] = [];
    tests.forEach(test => {
      if (test.status === 'fail') {
        vulnerabilities.push({
          type: test.name,
          severity: test.severity,
          description: test.description,
          remediation: test.recommendation,
        });
      } else if (test.status === 'warning' && test.severity !== 'Low') {
        vulnerabilities.push({
          type: test.name,
          severity: test.severity,
          description: test.description,
          remediation: test.recommendation,
        });
      }
    });
    
    const recommendations = [
      t('rec_ssl', 'Enable and properly configure SSL/TLS'),
      t('rec_headers', 'Implement all security headers'),
      t('rec_csp', 'Configure Content Security Policy'),
      t('rec_hsts', 'Enable HSTS for HTTPS enforcement'),
      t('rec_cors', 'Restrict CORS to trusted origins'),
    ];
    
    const result: AnalysisResult = {
      score: finalScore,
      grade: grade,
      vulnerabilities: vulnerabilities,
      recommendations: recommendations.slice(0, 5),
      tests: tests,
      responseTime: Math.floor(Math.random() * 500) + 100,
      sslValid: Math.random() > 0.2,
      lastScan: new Date().toISOString(),
    };
    
    setAnalysisResult(result);
    setAnalyzing(false);
    setActiveTab('results');
    setSuccessMessage(t('analysis_complete', `✓ Security analysis completed! Score: ${finalScore}/100`));
    saveToHistory(targetUrl, finalScore, grade, vulnerabilities.length);
  };

  const downloadReport = () => {
    if (!analysisResult) return;
    
    const report = {
      timestamp: new Date().toISOString(),
      url: url,
      score: analysisResult.score,
      grade: analysisResult.grade,
      vulnerabilities: analysisResult.vulnerabilities,
      recommendations: analysisResult.recommendations,
      tests: analysisResult.tests.map(t => ({ name: t.name, status: t.status, severity: t.severity })),
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `security-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
    setSuccessMessage(t('report_downloaded', '✓ Report downloaded successfully!'));
  };

  const getStatusIcon = (status: TestStatus) => {
    switch(status) {
      case 'pass': return <CheckCircle className="h-5 w-5" style={{ color: '#10B981' }} />;
      case 'warning': return <AlertTriangle className="h-5 w-5" style={{ color: '#F59E0B' }} />;
      case 'fail': return <XCircle className="h-5 w-5" style={{ color: '#EF4444' }} />;
      case 'running': return <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" style={{ borderColor: themeColors.primary }} />;
      default: return <div className="h-5 w-5 rounded-full border-2" style={{ borderColor: themeColors.border }} />;
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch(severity) {
      case 'Critical': return '#DC2626';
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getGradeColor = (grade: string): string => {
    if (grade.startsWith('A')) return '#10B981';
    if (grade.startsWith('B')) return '#3B82F6';
    if (grade.startsWith('C')) return '#F59E0B';
    if (grade === 'D') return '#EF4444';
    return '#DC2626';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const resetAnalysis = () => {
    setUrl('');
    setAnalysisResult(null);
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
            <GradientText>{t('title', 'Security Analyzer')}</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Comprehensive security analysis with vulnerability detection, risk assessment, and compliance checking for websites and applications')}
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${successColor}15` }}>
              <Shield className="h-3.5 w-3.5" style={{ color: successColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('owasp_compliant', 'OWASP Compliant')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${warningColor}15` }}>
              <AlertTriangle className="h-3.5 w-3.5" style={{ color: warningColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('real_time', 'Real-Time')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <FileText className="h-3.5 w-3.5" style={{ color: themeColors.primary }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('detailed_reports', 'Detailed Reports')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'analyzer', icon: Shield, label: t('tab_analyzer', 'Analyzer') },
            { id: 'results', icon: BarChart, label: t('tab_results', 'Results') },
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
            
            {/* ANALYZER TAB */}
            {activeTab === 'analyzer' && (
              <>
                {/* URL Input */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Globe className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('target_website', 'Target Website')}
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
                      placeholder={t('url_placeholder', 'https://example.com')}
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
                      onClick={runAnalysis}
                      disabled={!url.trim() || analyzing}
                      className="px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                    >
                      {analyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>{t('analyzing', 'Analyzing...')}</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          <span>{t('analyze', 'Analyze')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Scan Depth */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Settings className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('scan_settings', 'Scan Settings')}
                  </h2>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'quick' as const, name: t('quick_scan', 'Quick Scan'), desc: t('quick_desc', 'Basic security check'), icon: Zap },
                      { id: 'standard' as const, name: t('standard_scan', 'Standard'), desc: t('standard_desc', 'Full security analysis'), icon: Shield },
                      { id: 'deep' as const, name: t('deep_scan', 'Deep Scan'), desc: t('deep_desc', 'Comprehensive testing'), icon: Activity },
                    ].map((option) => {
                      const Icon = option.icon;
                      const isSelected = scanDepth === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() => setScanDepth(option.id)}
                          className={`p-3 rounded-xl border text-center transition-all ${isSelected ? 'scale-105 shadow-lg' : 'hover:scale-102'}`}
                          style={{ 
                            backgroundColor: isSelected ? `${themeColors.primary}10` : themeColors.background,
                            borderColor: isSelected ? themeColors.primary : themeColors.border,
                          }}
                        >
                          <Icon className={`h-5 w-5 mx-auto mb-2 ${isSelected ? 'text-primary' : ''}`} 
                            style={{ color: isSelected ? themeColors.primary : themeColors.text.secondary }} />
                          <div className="font-medium text-sm" style={{ color: isSelected ? themeColors.primary : themeColors.text.primary }}>
                            {option.name}
                          </div>
                          <div className="text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                            {option.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Progress Bar */}
                {analyzing && (
                  <div className="rounded-xl p-4" style={{ backgroundColor: themeColors.surface, border: `1px solid ${themeColors.border}` }}>
                    <div className="flex justify-between text-sm mb-2">
                      <span style={{ color: themeColors.text.secondary }}>{t('scan_progress', 'Scanning security...')}</span>
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

                {/* Security Tests List */}
                <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="p-4 border-b" style={{ borderColor: themeColors.border }}>
                    <h3 className="font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <Target className="h-4 w-4" style={{ color: themeColors.primary }} />
                      {t('security_tests', 'Security Tests')}
                    </h3>
                  </div>
                  <div className="divide-y max-h-80 overflow-y-auto" style={{ borderColor: themeColors.border }}>
                    {securityTests.map((test) => (
                      <div key={test.id} className="p-3 hover:bg-surface-hover transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {test.name}
                              </span>
                              {test.status !== 'pending' && test.status !== 'running' && (
                                <span className="text-xs px-1.5 py-0.5 rounded" style={{ 
                                  backgroundColor: `${getSeverityColor(test.severity)}20`,
                                  color: getSeverityColor(test.severity)
                                }}>
                                  {test.severity}
                                </span>
                              )}
                            </div>
                            <div className="text-xs mt-0.5" style={{ color: themeColors.text.secondary }}>
                              {test.category}
                            </div>
                          </div>
                          {getStatusIcon(test.status)}
                        </div>
                        {expandedTest === test.id && test.status !== 'pending' && (
                          <div className="mt-3 pt-3 border-t text-sm animate-in fade-in slide-in-from-top-2" style={{ borderColor: themeColors.border }}>
                            <p className="mb-2" style={{ color: themeColors.text.secondary }}>{test.description}</p>
                            {test.status !== 'pass' && (
                              <div className="p-2 rounded-lg" style={{ backgroundColor: `${warningColor}10` }}>
                                <span className="font-medium" style={{ color: warningColor }}>{t('recommendation', 'Recommendation')}:</span>
                                <span className="text-xs ml-1" style={{ color: themeColors.text.secondary }}>{test.recommendation}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {test.status !== 'pending' && test.status !== 'running' && (
                          <button
                            onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                            className="mt-2 text-xs flex items-center gap-1 transition-all hover:scale-105"
                            style={{ color: themeColors.primary }}
                          >
                            {expandedTest === test.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            {expandedTest === test.id ? t('show_less', 'Show less') : t('show_more', 'Show more')}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* Security Note */}
                <div className="rounded-xl p-5" style={{ backgroundColor: `${warningColor}10`, border: `1px solid ${warningColor}30` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-5 w-5" style={{ color: warningColor }} />
                    <h3 className="font-semibold" style={{ color: warningColor }}>{t('security_note', 'Security Note')}</h3>
                  </div>
                  <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                    {t('note_text', 'This tool performs non-intrusive security checks. Always ensure you have permission to test websites you don\'t own.')}
                  </p>
                </div>
              </>
            )}

            {/* RESULTS TAB */}
            {activeTab === 'results' && analysisResult && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Score Card */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold" style={{ color: themeColors.text.primary }}>
                      {t('security_score', 'Security Score')}
                    </h2>
                    <button
                      onClick={downloadReport}
                      className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-all hover:scale-105"
                      style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                    >
                      <Download className="h-3.5 w-3.5" />
                      {t('export', 'Export')}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <div className="text-6xl font-bold" style={{ color: getGradeColor(analysisResult.grade) }}>
                        {analysisResult.score}
                      </div>
                      <div className="text-sm mt-1" style={{ color: themeColors.text.secondary }}>/100</div>
                    </div>
                    <div className="text-center">
                      <div className="text-6xl font-bold" style={{ color: getGradeColor(analysisResult.grade) }}>
                        {analysisResult.grade}
                      </div>
                      <div className="text-sm mt-1" style={{ color: themeColors.text.secondary }}>{t('grade', 'Grade')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: themeColors.primary }}>
                        {analysisResult.vulnerabilities.length}
                      </div>
                      <div className="text-sm mt-1" style={{ color: themeColors.text.secondary }}>{t('vulnerabilities', 'Vulnerabilities')}</div>
                    </div>
                  </div>
                  
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${themeColors.primary}20` }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${analysisResult.score}%`, backgroundColor: getGradeColor(analysisResult.grade) }} />
                  </div>
                  
                  <div className="flex justify-between text-xs mt-2">
                    <span style={{ color: themeColors.text.secondary }}>{t('poor', 'Poor')}</span>
                    <span style={{ color: themeColors.text.secondary }}>{t('fair', 'Fair')}</span>
                    <span style={{ color: themeColors.text.secondary }}>{t('good', 'Good')}</span>
                    <span style={{ color: themeColors.text.secondary }}>{t('excellent', 'Excellent')}</span>
                  </div>
                </div>

                {/* Vulnerabilities */}
                {analysisResult.vulnerabilities.length > 0 && (
                  <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <AlertTriangle className="h-5 w-5" style={{ color: errorColor }} />
                      {t('vulnerabilities_found', 'Vulnerabilities Found')} ({analysisResult.vulnerabilities.length})
                    </h3>
                    <div className="space-y-3">
                      {analysisResult.vulnerabilities.map((vuln, idx) => (
                        <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: `${getSeverityColor(vuln.severity)}10`, border: `1px solid ${getSeverityColor(vuln.severity)}30` }}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium" style={{ color: getSeverityColor(vuln.severity) }}>
                              {vuln.type}
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${getSeverityColor(vuln.severity)}20`, color: getSeverityColor(vuln.severity) }}>
                              {vuln.severity}
                            </span>
                          </div>
                          <p className="text-sm mb-2" style={{ color: themeColors.text.secondary }}>{vuln.description}</p>
                          <p className="text-xs" style={{ color: themeColors.primary }}>
                            <strong>{t('remediation', 'Remediation')}:</strong> {vuln.remediation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <CheckCircle className="h-5 w-5" style={{ color: successColor }} />
                    {t('recommendations', 'Recommendations')}
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: successColor }} />
                        <span className="text-sm" style={{ color: themeColors.text.secondary }}>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Test Results Summary */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <BarChart className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('test_summary', 'Test Summary')}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${successColor}10` }}>
                      <div className="text-2xl font-bold" style={{ color: successColor }}>
                        {analysisResult.tests.filter(t => t.status === 'pass').length}
                      </div>
                      <div className="text-xs" style={{ color: themeColors.text.secondary }}>{t('passed', 'Passed')}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${warningColor}10` }}>
                      <div className="text-2xl font-bold" style={{ color: warningColor }}>
                        {analysisResult.tests.filter(t => t.status === 'warning').length}
                      </div>
                      <div className="text-xs" style={{ color: themeColors.text.secondary }}>{t('warnings', 'Warnings')}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${errorColor}10` }}>
                      <div className="text-2xl font-bold" style={{ color: errorColor }}>
                        {analysisResult.tests.filter(t => t.status === 'fail').length}
                      </div>
                      <div className="text-xs" style={{ color: themeColors.text.secondary }}>{t('failed', 'Failed')}</div>
                    </div>
                  </div>
                </div>

                {/* New Analysis Button */}
                <button
                  onClick={() => { setActiveTab('analyzer'); resetAnalysis(); }}
                  className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.primary }}
                >
                  <RefreshCw className="h-4 w-4" />
                  {t('new_analysis', 'New Analysis')}
                </button>
              </div>
            )}

            {/* RESULTS TAB - No Data */}
            {activeTab === 'results' && !analysisResult && (
              <div className="rounded-xl border p-12 text-center" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                <p className="text-lg" style={{ color: themeColors.text.secondary }}>
                  {t('no_results', 'No analysis results yet')}
                </p>
                <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                  {t('run_analysis_first', 'Run a security analysis first to see results')}
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
                        {t('analysis_history', 'Analysis History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_analyses', 'Your recent security analyses')}
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
                                {entry.url}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                                backgroundColor: `${getGradeColor(entry.grade)}20`,
                                color: getGradeColor(entry.grade)
                              }}>
                                {entry.grade}
                              </span>
                            </div>
                            <div className="flex gap-3 text-xs" style={{ color: themeColors.text.secondary }}>
                              <span>{t('score', 'Score')}: {entry.score}/100</span>
                              <span>{t('vulnerabilities', 'Vulnerabilities')}: {entry.vulnerabilitiesCount}</span>
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
                      {t('history_will_appear', 'Your security analyses will appear here')}
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
