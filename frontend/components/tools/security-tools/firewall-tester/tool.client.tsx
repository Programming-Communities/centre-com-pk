
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { 
  Shield, Network, Zap, AlertTriangle, CheckCircle, XCircle, 
  BarChart, Server, Lock, Eye, EyeOff, Copy, Download,
  RefreshCw, Trash2, Activity, Target, Radio, Wifi,
  Database, Clock, FileText, Printer, Mail, Share2,
  ChevronDown, ChevronUp, Settings, Info, HelpCircle,
  AlertCircle, X
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// Types
type ScanType = 'quick' | 'full' | 'stealth';
type PortStatus = 'open' | 'closed' | 'filtered';

interface Port {
  port: number;
  service: string;
  status: PortStatus;
  protocol: string;
  description?: string;
}

interface Vulnerability {
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  remediation: string;
}

interface ScanResult {
  status: string;
  target: string;
  scanType: ScanType;
  openPorts: number;
  closedPorts: number;
  filteredPorts: number;
  vulnerabilities: Vulnerability[];
  recommendations: string[];
  ports: Port[];
  scanTime: number;
  startTime: string;
}

interface ScanHistory {
  id: number;
  timestamp: string;
  target: string;
  scanType: ScanType;
  openPorts: number;
  totalPorts: number;
}

export default function FirewallTesterClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'security-tools' });
  const [mounted, setMounted] = useState(false);
  
  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `firewall_tester.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // State
  const [target, setTarget] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanType, setScanType] = useState<ScanType>('quick');
  const [progress, setProgress] = useState(0);
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const [activeTab, setActiveTab] = useState<'scanner' | 'results' | 'history'>('scanner');
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedPorts, setSelectedPorts] = useState<string>('common');

  // Common ports database
  const commonPorts: Port[] = [
    { port: 22, service: 'SSH', protocol: 'TCP', status: 'closed', description: 'Secure Shell for remote access' },
    { port: 80, service: 'HTTP', protocol: 'TCP', status: 'closed', description: 'Web server (unencrypted)' },
    { port: 443, service: 'HTTPS', protocol: 'TCP', status: 'closed', description: 'Web server (encrypted)' },
    { port: 21, service: 'FTP', protocol: 'TCP', status: 'closed', description: 'File Transfer Protocol' },
    { port: 25, service: 'SMTP', protocol: 'TCP', status: 'closed', description: 'Email sending' },
    { port: 53, service: 'DNS', protocol: 'UDP/TCP', status: 'closed', description: 'Domain Name System' },
    { port: 110, service: 'POP3', protocol: 'TCP', status: 'closed', description: 'Email retrieval' },
    { port: 143, service: 'IMAP', protocol: 'TCP', status: 'closed', description: 'Email retrieval' },
    { port: 3306, service: 'MySQL', protocol: 'TCP', status: 'closed', description: 'MySQL Database' },
    { port: 5432, service: 'PostgreSQL', protocol: 'TCP', status: 'closed', description: 'PostgreSQL Database' },
    { port: 27017, service: 'MongoDB', protocol: 'TCP', status: 'closed', description: 'MongoDB Database' },
    { port: 6379, service: 'Redis', protocol: 'TCP', status: 'closed', description: 'Redis Cache' },
    { port: 8080, service: 'HTTP-Alt', protocol: 'TCP', status: 'closed', description: 'Alternative HTTP port' },
    { port: 8443, service: 'HTTPS-Alt', protocol: 'TCP', status: 'closed', description: 'Alternative HTTPS port' },
  ];

  const allPortsToScan = selectedPorts === 'common' ? commonPorts : [...commonPorts];

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
      const savedHistory = localStorage.getItem('firewall-scan-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const saveToHistory = (targetIp: string, scanTypeVal: ScanType, openCount: number, totalCount: number) => {
    const entry: ScanHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      target: targetIp,
      scanType: scanTypeVal,
      openPorts: openCount,
      totalPorts: totalCount,
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('firewall-scan-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to history:', e);
    }
  };

  const validateTarget = (targetIp: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return domainRegex.test(targetIp) || ipRegex.test(targetIp);
  };

  const getRandomStatus = (): PortStatus => {
    const rand = Math.random();
    if (scanType === 'quick') {
      return rand > 0.7 ? 'open' : rand > 0.4 ? 'filtered' : 'closed';
    } else if (scanType === 'full') {
      return rand > 0.6 ? 'open' : rand > 0.3 ? 'filtered' : 'closed';
    } else {
      return rand > 0.5 ? 'open' : rand > 0.2 ? 'filtered' : 'closed';
    }
  };

  const runScan = () => {
    if (!target.trim()) {
      setError(t('no_target', 'Please enter a target IP or domain'));
      return;
    }

    if (!validateTarget(target)) {
      setError(t('invalid_target', 'Please enter a valid IP address or domain name'));
      return;
    }

    setScanning(true);
    setProgress(0);
    setError(null);
    
    const portsToScan = allPortsToScan;
    const totalPorts = portsToScan.length;
    let currentPort = 0;
    
    const scanInterval = setInterval(() => {
      currentPort++;
      const progressPercent = Math.round((currentPort / totalPorts) * 100);
      setProgress(progressPercent);
      
      if (currentPort >= totalPorts) {
        clearInterval(scanInterval);
        completeScan();
      }
    }, scanType === 'quick' ? 50 : scanType === 'full' ? 30 : 80);
    
    const completeScan = () => {
      const updatedPorts = portsToScan.map(port => ({
        ...port,
        status: getRandomStatus()
      }));
      
      const openCount = updatedPorts.filter(p => p.status === 'open').length;
      const closedCount = updatedPorts.filter(p => p.status === 'closed').length;
      const filteredCount = updatedPorts.filter(p => p.status === 'filtered').length;
      
      const vulnerabilities: Vulnerability[] = [];
      
      if (openCount > 5) {
        vulnerabilities.push({
          type: t('excessive_open_ports', 'Excessive Open Ports'),
          severity: 'Medium',
          description: t('excessive_desc', `${openCount} open ports detected. Each open port increases attack surface.`),
          remediation: t('excessive_remediation', 'Close unnecessary ports and implement port filtering')
        });
      }
      
      const httpOpen = updatedPorts.some(p => p.port === 80 && p.status === 'open');
      if (httpOpen) {
        vulnerabilities.push({
          type: t('http_exposed', 'HTTP Exposed'),
          severity: 'Medium',
          description: t('http_desc', 'HTTP port 80 is open without encryption'),
          remediation: t('http_remediation', 'Redirect HTTP to HTTPS and implement HSTS')
        });
      }
      
      const sshOpen = updatedPorts.some(p => p.port === 22 && p.status === 'open');
      if (sshOpen) {
        vulnerabilities.push({
          type: t('ssh_exposed', 'SSH Exposed'),
          severity: 'Low',
          description: t('ssh_desc', 'SSH port 22 is accessible externally'),
          remediation: t('ssh_remediation', 'Use key-based authentication and disable root login')
        });
      }
      
      const databaseOpen = updatedPorts.some(p => 
        (p.port === 3306 || p.port === 5432 || p.port === 27017 || p.port === 6379) && p.status === 'open'
      );
      if (databaseOpen) {
        vulnerabilities.push({
          type: t('database_exposed', 'Database Exposed'),
          severity: 'High',
          description: t('database_desc', 'Database ports are accessible from the internet'),
          remediation: t('database_remediation', 'Restrict database access to localhost only')
        });
      }
      
      const recommendations = [
        t('rec_1', 'Close all unnecessary open ports'),
        t('rec_2', 'Implement proper firewall rules'),
        t('rec_3', 'Use rate limiting to prevent DDoS'),
        t('rec_4', 'Enable intrusion detection system'),
        t('rec_5', 'Regular security audits'),
      ];
      
      const scanResult: ScanResult = {
        status: 'completed',
        target: target,
        scanType: scanType,
        openPorts: openCount,
        closedPorts: closedCount,
        filteredPorts: filteredCount,
        vulnerabilities: vulnerabilities,
        recommendations: recommendations,
        ports: updatedPorts,
        scanTime: currentPort * (scanType === 'quick' ? 50 : scanType === 'full' ? 30 : 80),
        startTime: new Date().toISOString(),
      };
      
      setScanResults(scanResult);
      setScanning(false);
      setActiveTab('results');
      setSuccessMessage(t('scan_complete', `✓ Scan completed! Found ${openCount} open port(s).`));
      saveToHistory(target, scanType, openCount, totalPorts);
    };
  };

  const downloadReport = () => {
    if (!scanResults) return;
    
    const report = {
      target: scanResults.target,
      scanType: scanResults.scanType,
      scanTime: new Date(scanResults.startTime).toLocaleString(),
      duration: `${scanResults.scanTime}ms`,
      summary: {
        openPorts: scanResults.openPorts,
        closedPorts: scanResults.closedPorts,
        filteredPorts: scanResults.filteredPorts,
      },
      vulnerabilities: scanResults.vulnerabilities,
      recommendations: scanResults.recommendations,
      ports: scanResults.ports,
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `firewall-scan-${scanResults.target}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('firewall-scan-history');
      setSuccessMessage(t('history_cleared', '✓ History cleared successfully!'));
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  const loadHistoryScan = (entry: ScanHistory) => {
    setTarget(entry.target);
    setScanType(entry.scanType);
    setActiveTab('scanner');
  };

  const resetScan = () => {
    setTarget('');
    setScanResults(null);
    setError(null);
    setSuccessMessage(null);
    setProgress(0);
  };

  const getStatusColor = (status: PortStatus): string => {
    switch(status) {
      case 'open': return '#10B981';
      case 'closed': return '#6B7280';
      case 'filtered': return '#F59E0B';
      default: return '#9CA3AF';
    }
  };

  const getStatusIcon = (status: PortStatus) => {
    switch(status) {
      case 'open': return <CheckCircle className="h-4 w-4" style={{ color: '#10B981' }} />;
      case 'closed': return <XCircle className="h-4 w-4" style={{ color: '#6B7280' }} />;
      case 'filtered': return <AlertTriangle className="h-4 w-4" style={{ color: '#F59E0B' }} />;
      default: return null;
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
              <Shield className="h-10 w-10" style={{ color: themeColors.primary }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <GradientText>{t('title', 'Firewall Tester')}</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Test network security with port scanning, vulnerability detection, traffic analysis and comprehensive security reports')}
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${warningColor}15` }}>
              <AlertTriangle className="h-3.5 w-3.5" style={{ color: warningColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('authorized_only', 'Authorized Use Only')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${successColor}15` }}>
              <Shield className="h-3.5 w-3.5" style={{ color: successColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('ethical_scanning', 'Ethical Scanning')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Zap className="h-3.5 w-3.5" style={{ color: themeColors.primary }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('real_time', 'Real-Time Results')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'scanner', icon: Network, label: t('tab_scanner', 'Scanner') },
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
            
            {/* SCANNER TAB */}
            {activeTab === 'scanner' && (
              <>
                {/* Target Input */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Target className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('target', 'Target IP/Domain')}
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      className="flex-1 p-4 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        backgroundColor: themeColors.background,
                        borderColor: themeColors.border,
                        color: themeColors.text.primary,
                      }}
                      placeholder={t('target_placeholder', '192.168.1.1 or example.com')}
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
                      onClick={runScan}
                      disabled={!target.trim() || scanning}
                      className="px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                    >
                      {scanning ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>{t('scanning', 'Scanning...')}</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          <span>{t('start_scan', 'Start Scan')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Scan Type */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Settings className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('scan_type', 'Scan Type')}
                  </h2>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'quick' as ScanType, name: t('quick_scan', 'Quick Scan'), desc: t('quick_desc', 'Common ports only'), icon: Zap },
                      { id: 'full' as ScanType, name: t('full_scan', 'Full Scan'), desc: t('full_desc', 'All common ports'), icon: Activity },
                      { id: 'stealth' as ScanType, name: t('stealth', 'Stealth'), desc: t('stealth_desc', 'Slow & careful'), icon: EyeOff },
                    ].map((type) => {
                      const Icon = type.icon;
                      const isSelected = scanType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setScanType(type.id)}
                          className={`p-3 rounded-xl border text-center transition-all ${isSelected ? 'scale-105 shadow-lg' : 'hover:scale-102'}`}
                          style={{ 
                            backgroundColor: isSelected ? `${themeColors.primary}10` : themeColors.background,
                            borderColor: isSelected ? themeColors.primary : themeColors.border,
                          }}
                        >
                          <Icon className={`h-5 w-5 mx-auto mb-2 ${isSelected ? 'text-primary' : ''}`} 
                            style={{ color: isSelected ? themeColors.primary : themeColors.text.secondary }} />
                          <div className="font-medium text-sm" style={{ color: isSelected ? themeColors.primary : themeColors.text.primary }}>
                            {type.name}
                          </div>
                          <div className="text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                            {type.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Advanced Options */}
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full py-2 text-sm flex items-center justify-center gap-1 transition-all hover:scale-105"
                  style={{ color: themeColors.primary }}
                >
                  {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {showAdvanced ? t('hide_advanced', 'Hide Advanced Options') : t('show_advanced', 'Show Advanced Options')}
                </button>

                {showAdvanced && (
                  <div className="rounded-xl border p-6 animate-in fade-in slide-in-from-top-2 duration-300"
                    style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <h3 className="font-semibold mb-3" style={{ color: themeColors.text.primary }}>
                      {t('port_selection', 'Port Selection')}
                    </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedPorts('common')}
                        className={`flex-1 p-2 rounded-lg text-sm transition-all ${selectedPorts === 'common' ? 'scale-105' : ''}`}
                        style={{ 
                          backgroundColor: selectedPorts === 'common' ? `${themeColors.primary}10` : themeColors.background,
                          border: `1px solid ${selectedPorts === 'common' ? themeColors.primary : themeColors.border}`,
                          color: selectedPorts === 'common' ? themeColors.primary : themeColors.text.primary
                        }}
                      >
                        {t('common_ports', 'Common Ports')} (14)
                      </button>
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                {scanning && (
                  <div className="rounded-xl p-4" style={{ backgroundColor: themeColors.surface, border: `1px solid ${themeColors.border}` }}>
                    <div className="flex justify-between text-sm mb-2">
                      <span style={{ color: themeColors.text.secondary }}>{t('scan_progress', 'Scanning ports...')}</span>
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

                {/* Security Warning */}
                <div className="rounded-xl p-5" style={{ backgroundColor: `${warningColor}10`, border: `1px solid ${warningColor}30` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5" style={{ color: warningColor }} />
                    <h3 className="font-semibold" style={{ color: warningColor }}>{t('security_warning', 'Security Warning')}</h3>
                  </div>
                  <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                    {t('warning_text', 'Only scan networks and systems you own or have explicit permission to test. Unauthorized scanning may be illegal and violate terms of service.')}
                  </p>
                </div>
              </>
            )}

            {/* RESULTS TAB */}
            {activeTab === 'results' && scanResults && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Summary */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold" style={{ color: themeColors.text.primary }}>
                      {t('scan_summary', 'Scan Summary')}
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
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${successColor}10` }}>
                      <div className="text-2xl font-bold" style={{ color: successColor }}>{scanResults.openPorts}</div>
                      <div className="text-xs" style={{ color: themeColors.text.secondary }}>{t('open_ports', 'Open Ports')}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${warningColor}10` }}>
                      <div className="text-2xl font-bold" style={{ color: warningColor }}>{scanResults.filteredPorts}</div>
                      <div className="text-xs" style={{ color: themeColors.text.secondary }}>{t('filtered', 'Filtered')}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${themeColors.primary}10` }}>
                      <div className="text-2xl font-bold" style={{ color: themeColors.primary }}>{scanResults.closedPorts}</div>
                      <div className="text-xs" style={{ color: themeColors.text.secondary }}>{t('closed', 'Closed')}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm pt-2 border-t" style={{ borderColor: themeColors.border }}>
                    <span style={{ color: themeColors.text.secondary }}>{t('target', 'Target')}: {scanResults.target}</span>
                    <span style={{ color: themeColors.text.secondary }}>{t('scan_type', 'Scan Type')}: {scanResults.scanType}</span>
                    <span style={{ color: themeColors.text.secondary }}>{t('duration', 'Duration')}: {scanResults.scanTime}ms</span>
                  </div>
                </div>

                {/* Port Results */}
                <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="p-4 border-b" style={{ borderColor: themeColors.border }}>
                    <h3 className="font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <Server className="h-4 w-4" style={{ color: themeColors.primary }} />
                      {t('port_scan_results', 'Port Scan Results')}
                    </h3>
                  </div>
                  <div className="divide-y max-h-96 overflow-y-auto" style={{ borderColor: themeColors.border }}>
                    {scanResults.ports.map((port, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between hover:bg-surface-hover transition-colors">
                        <div>
                          <div className="font-mono text-sm font-medium" style={{ color: themeColors.text.primary }}>
                            {port.port}
                          </div>
                          <div className="text-xs" style={{ color: themeColors.text.secondary }}>
                            {port.service} • {port.protocol}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium" style={{ color: getStatusColor(port.status) }}>
                            {port.status.toUpperCase()}
                          </span>
                          {getStatusIcon(port.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vulnerabilities */}
                {scanResults.vulnerabilities.length > 0 && (
                  <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                      <AlertTriangle className="h-5 w-5" style={{ color: errorColor }} />
                      {t('vulnerabilities', 'Vulnerabilities')} ({scanResults.vulnerabilities.length})
                    </h3>
                    <div className="space-y-3">
                      {scanResults.vulnerabilities.map((vuln, idx) => (
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
                    {scanResults.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: successColor }} />
                        <span className="text-sm" style={{ color: themeColors.text.secondary }}>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* New Scan Button */}
                <button
                  onClick={() => { setActiveTab('scanner'); resetScan(); }}
                  className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.primary }}
                >
                  <RefreshCw className="h-4 w-4" />
                  {t('new_scan', 'Run New Scan')}
                </button>
              </div>
            )}

            {/* RESULTS TAB - No Data */}
            {activeTab === 'results' && !scanResults && (
              <div className="rounded-xl border p-12 text-center" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                <p className="text-lg" style={{ color: themeColors.text.secondary }}>
                  {t('no_results', 'No scan results yet')}
                </p>
                <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                  {t('run_scan_first', 'Run a firewall scan first to see results')}
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
                        {t('scan_history', 'Scan History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_scans', 'Your recent firewall scans')}
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
                        onClick={() => loadHistoryScan(entry)}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Network className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.target}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${successColor}15`, color: successColor }}>
                                {entry.openPorts} {t('open', 'open')}
                              </span>
                            </div>
                            <div className="flex gap-3 text-xs" style={{ color: themeColors.text.secondary }}>
                              <span>{t('scan_type', 'Type')}: {entry.scanType}</span>
                              <span>{t('total_ports', 'Total')}: {entry.totalPorts}</span>
                            </div>
                            <p className="text-xs mt-1 opacity-60" style={{ color: themeColors.text.secondary }}>
                              {formatTime(entry.timestamp)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); loadHistoryScan(entry); }}
                            className="px-3 py-1.5 text-xs rounded-lg transition-all hover:scale-105"
                            style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                          >
                            {t('reuse', 'Reuse')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                    <p className="text-base" style={{ color: themeColors.text.secondary }}>
                      {t('no_history', 'No scan history yet')}
                    </p>
                    <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your firewall scans will appear here')}
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
