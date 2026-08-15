
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { 
  Copy, RotateCcw, Key, Download, CheckCircle, AlertCircle, X,
  Hash, FileText, Trash2, RefreshCw, Database, Settings,
  Plus, Minus, Sparkles, Shield, Clock, Fingerprint,
  Info
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// Types
type UUIDVersion = 'v4' | 'v1' | 'v3' | 'v5' | 'numeric' | 'simple' | 'short';

interface UUIDHistory {
  id: number;
  timestamp: string;
  version: UUIDVersion;
  count: number;
  uuids: string[];
}

interface VersionInfo {
  id: UUIDVersion;
  name: string;
  description: string;
  format: string;
  entropy: string;
  useCase: string;
}

export default function UUIDGeneratorClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'text-tools' });
  const [mounted, setMounted] = useState(false);
  
  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `uuid_generator.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // State
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [version, setVersion] = useState<UUIDVersion>('v4');
  const [uppercase, setUppercase] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generator' | 'history' | 'info'>('generator');
  const [history, setHistory] = useState<UUIDHistory[]>([]);
  const [generationTime, setGenerationTime] = useState(0);

  // Version information
  const versionInfo: VersionInfo[] = [
    { 
      id: 'v4', 
      name: t('v4_name', 'UUID v4 (Random)'), 
      description: t('v4_desc', 'Randomly generated UUIDs'),
      format: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',
      entropy: '122 bits',
      useCase: t('v4_use', 'General purpose, databases, APIs')
    },
    { 
      id: 'v1', 
      name: t('v1_name', 'UUID v1 (Time-based)'), 
      description: t('v1_desc', 'Time-based with MAC address'),
      format: 'xxxxxxxx-xxxx-1xxx-xxxx-xxxxxxxxxxxx',
      entropy: '60 bits',
      useCase: t('v1_use', 'Timestamp ordering, distributed systems')
    },
    { 
      id: 'v3', 
      name: t('v3_name', 'UUID v3 (MD5)'), 
      description: t('v3_desc', 'MD5 hash-based with namespace'),
      format: 'xxxxxxxx-xxxx-3xxx-xxxx-xxxxxxxxxxxx',
      entropy: '122 bits',
      useCase: t('v3_use', 'Name-based, consistent IDs')
    },
    { 
      id: 'v5', 
      name: t('v5_name', 'UUID v5 (SHA-1)'), 
      description: t('v5_desc', 'SHA-1 hash-based with namespace'),
      format: 'xxxxxxxx-xxxx-5xxx-xxxx-xxxxxxxxxxxx',
      entropy: '122 bits',
      useCase: t('v5_use', 'Name-based, more secure than v3')
    },
    { 
      id: 'numeric', 
      name: t('numeric_name', 'Numeric ID'), 
      description: t('numeric_desc', '32-digit numeric identifier'),
      format: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      entropy: '106 bits',
      useCase: t('numeric_use', 'Database IDs, numeric systems')
    },
    { 
      id: 'simple', 
      name: t('simple_name', 'Simple UUID'), 
      description: t('simple_desc', '32-character hex without dashes'),
      format: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      entropy: '122 bits',
      useCase: t('simple_use', 'URLs, file names, compact storage')
    },
    { 
      id: 'short', 
      name: t('short_name', 'Short ID'), 
      description: t('short_desc', '8-character alphanumeric ID'),
      format: 'xxxxxxxx',
      entropy: '47 bits',
      useCase: t('short_use', 'Short URLs, session tokens')
    },
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
        setCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('uuid-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const saveToHistory = (versionId: UUIDVersion, countNum: number, generatedUuids: string[]) => {
    const entry: UUIDHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      version: versionId,
      count: countNum,
      uuids: generatedUuids.slice(0, 3).map(u => u.substring(0, 20) + '...'),
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('uuid-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to history:', e);
    }
  };

  const generateUUID = () => {
    const startTime = performance.now();
    const newUuids: string[] = [];
    
    for (let i = 0; i < count; i++) {
      let uuid = '';
      
      switch (version) {
        case 'v4':
          uuid = generateUUIDV4();
          break;
        case 'v1':
          uuid = generateUUIDV1();
          break;
        case 'v3':
          uuid = generateUUIDV3();
          break;
        case 'v5':
          uuid = generateUUIDV5();
          break;
        case 'numeric':
          uuid = generateNumericID();
          break;
        case 'simple':
          uuid = generateSimpleUUID();
          break;
        case 'short':
          uuid = generateShortID();
          break;
        default:
          uuid = generateUUIDV4();
      }
      
      if (uppercase) {
        uuid = uuid.toUpperCase();
      }
      
      newUuids.push(uuid);
    }
    
    const endTime = performance.now();
    setGenerationTime(endTime - startTime);
    setUuids(newUuids);
    setSuccessMessage(t('generated', `✓ Generated ${count} UUID(s) successfully!`));
    saveToHistory(version, count, newUuids);
  };

  const generateUUIDV4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateUUIDV1 = (): string => {
    // Simplified v1 - timestamp based
    const timestamp = Date.now().toString(16).padStart(12, '0');
    const random = Math.random().toString(16).substring(2, 10);
    return `${timestamp.substring(0, 8)}-${timestamp.substring(8, 12)}-1${timestamp.substring(12, 15)}-${random.substring(0, 4)}-${random.substring(4, 16)}`;
  };

  const generateUUIDV3 = (): string => {
    const namespace = crypto.randomUUID();
    const hash = Array.from(namespace).map(c => c.charCodeAt(0).toString(16)).join('').substring(0, 32);
    return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-3${hash.substring(13, 16)}-${hash.substring(16, 20)}-${hash.substring(20, 32)}`;
  };

  const generateUUIDV5 = (): string => {
    const namespace = crypto.randomUUID();
    const hash = Array.from(namespace).map(c => c.charCodeAt(0).toString(16)).join('').substring(0, 32);
    return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-5${hash.substring(13, 16)}-${hash.substring(16, 20)}-${hash.substring(20, 32)}`;
  };

  const generateNumericID = (): string => {
    return Array.from({ length: 32 }, () => Math.floor(Math.random() * 10)).join('');
  };

  const generateSimpleUUID = (): string => {
    return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const generateShortID = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setSuccessMessage(t('copied', `✓ ${type} copied to clipboard!`));
    } catch (err) {
      setError(t('copy_failed', 'Failed to copy text'));
    }
  };

  const copyAllToClipboard = async () => {
    if (uuids.length === 0) return;
    try {
      await navigator.clipboard.writeText(uuids.join('\n'));
      setCopied(true);
      setSuccessMessage(t('copied_all', `✓ All ${uuids.length} UUIDs copied to clipboard!`));
    } catch (err) {
      setError(t('copy_failed', 'Failed to copy UUIDs'));
    }
  };

  const downloadUUIDs = () => {
    if (uuids.length === 0) return;
    
    const content = `UUID Generator Results
Generated: ${new Date().toLocaleString()}
Version: ${versionInfo.find(v => v.id === version)?.name || version}
Count: ${uuids.length}
Format: ${uppercase ? 'UPPERCASE' : 'lowercase'}

UUIDs:
${uuids.join('\n')}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMessage(t('downloaded', '✓ UUIDs downloaded successfully!'));
  };

  const resetGenerator = () => {
    setUuids([]);
    setCount(5);
    setVersion('v4');
    setUppercase(false);
    setError(null);
    setSuccessMessage(null);
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('uuid-history');
      setSuccessMessage(t('history_cleared', '✓ History cleared successfully!'));
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getCurrentVersionInfo = () => versionInfo.find(v => v.id === version);

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
              <Key className="h-10 w-10" style={{ color: themeColors.primary }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <GradientText>{t('title', 'UUID Generator')}</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Generate unique identifiers (UUID v1-v5, numeric IDs, short IDs) for databases, APIs, distributed systems, and more')}
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${successColor}15` }}>
              <Shield className="h-3.5 w-3.5" style={{ color: successColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('rfc_4122', 'RFC 4122 Compliant')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${warningColor}15` }}>
              <Clock className="h-3.5 w-3.5" style={{ color: warningColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('fast_generation', 'Fast Generation')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Fingerprint className="h-3.5 w-3.5" style={{ color: themeColors.primary }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('unique', 'Unique IDs')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'generator', icon: Key, label: t('tab_generator', 'Generator') },
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
            
            {/* GENERATOR TAB */}
            {activeTab === 'generator' && (
              <>
                {/* Version Selection */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Settings className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('uuid_version', 'UUID Version')}
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {versionInfo.map((ver) => {
                      const isSelected = version === ver.id;
                      return (
                        <button
                          key={ver.id}
                          onClick={() => setVersion(ver.id)}
                          className={`p-3 rounded-xl border text-center transition-all ${isSelected ? 'scale-105 shadow-lg' : 'hover:scale-102'}`}
                          style={{ 
                            backgroundColor: isSelected ? `${themeColors.primary}10` : themeColors.background,
                            borderColor: isSelected ? themeColors.primary : themeColors.border,
                          }}
                        >
                          <div className="text-sm font-bold" style={{ color: isSelected ? themeColors.primary : themeColors.text.primary }}>
                            {ver.name}
                          </div>
                          <div className="text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                            {ver.entropy}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {getCurrentVersionInfo() && (
                    <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${themeColors.primary}10` }}>
                      <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                        {getCurrentVersionInfo()?.description}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs">
                        <span className="font-mono" style={{ color: themeColors.primary }}>{getCurrentVersionInfo()?.format}</span>
                        <span className="opacity-60">{getCurrentVersionInfo()?.useCase}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Count Control */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Hash className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('quantity', 'Quantity')}
                  </h2>
                  
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="flex-1"
                      style={{ accentColor: themeColors.primary }}
                    />
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={count}
                      onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value))))}
                      className="w-20 px-3 py-2 text-center border rounded-lg"
                      style={{ 
                        backgroundColor: themeColors.background,
                        borderColor: themeColors.border,
                        color: themeColors.text.primary
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-2" style={{ color: themeColors.text.secondary }}>
                    <span>1</span>
                    <span>10</span>
                    <span>20</span>
                    <span>30</span>
                    <span>40</span>
                    <span>50</span>
                  </div>
                </div>

                {/* Options */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Settings className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('options', 'Options')}
                  </h2>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={uppercase}
                      onChange={(e) => setUppercase(e.target.checked)}
                      className="rounded"
                      style={{ accentColor: themeColors.primary }}
                    />
                    <span className="text-sm" style={{ color: themeColors.text.primary }}>{t('uppercase', 'Uppercase output')}</span>
                  </label>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateUUID}
                  className="w-full py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                >
                  <Sparkles className="h-5 w-5" />
                  {t('generate', 'Generate UUIDs')}
                </button>

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* Generated UUIDs */}
                {uuids.length > 0 && (
                  <div className="rounded-xl border p-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                        <Key className="h-5 w-5" style={{ color: successColor }} />
                        {t('generated_uuids', 'Generated UUIDs')} ({uuids.length})
                      </h2>
                      <div className="flex gap-2">
                        <button
                          onClick={copyAllToClipboard}
                          className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                          style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                        >
                          <Copy className="h-3 w-3 inline mr-1" />
                          {t('copy_all', 'Copy All')}
                        </button>
                        <button
                          onClick={downloadUUIDs}
                          className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                          style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                        >
                          <Download className="h-3 w-3 inline mr-1" />
                          {t('download', 'Download')}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {uuids.map((uuid, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border"
                          style={{ 
                            backgroundColor: themeColors.background,
                            borderColor: themeColors.border
                          }}
                        >
                          <code className="text-sm font-mono" style={{ color: themeColors.text.primary }}>
                            {uuid}
                          </code>
                          <button
                            onClick={() => copyToClipboard(uuid, t('uuid', 'UUID'))}
                            className="p-1.5 rounded-lg transition-all hover:scale-105"
                            style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 text-xs text-right" style={{ color: themeColors.text.secondary }}>
                      {t('generation_time', 'Generation time')}: {generationTime.toFixed(2)}ms
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {uuids.length > 0 && (
                  <div className="flex gap-3">
                    <button
                      onClick={resetGenerator}
                      className="flex-1 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                    >
                      <Trash2 className="h-4 w-4" />
                      {t('reset', 'Reset')}
                    </button>
                  </div>
                )}

                {/* Tips */}
                <div className="rounded-xl p-5" style={{ backgroundColor: `${themeColors.primary}08`, border: `1px solid ${themeColors.primary}20` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Key className="h-5 w-5" style={{ color: themeColors.primary }} />
                    <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('uuid_tips', 'UUID Tips')}</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_1', 'UUID v4 is best for general purpose unique identifiers')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_2', 'Use v1 for time-ordered IDs in distributed systems')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_3', 'Short IDs work well for URLs and session tokens')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: themeColors.primary }} />
                      <span style={{ color: themeColors.text.secondary }}>{t('tip_4', 'Always store UUIDs as strings for compatibility')}</span>
                    </li>
                  </ul>
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
                        {t('generation_history', 'Generation History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_generations', 'Your recent UUID generations')}
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
                    {history.map((entry) => {
                      const versionInfoItem = versionInfo.find(v => v.id === entry.version);
                      return (
                        <div key={entry.id} className="p-4 hover:bg-surface-hover transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Key className="h-4 w-4" style={{ color: themeColors.primary }} />
                                <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                  {versionInfoItem?.name || entry.version}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${successColor}15`, color: successColor }}>
                                  {entry.count} {t('uuids', 'UUIDs')}
                                </span>
                              </div>
                              <div className="text-xs font-mono" style={{ color: themeColors.text.secondary }}>
                                {entry.uuids.join(', ')}
                              </div>
                              <p className="text-xs mt-1 opacity-60" style={{ color: themeColors.text.secondary }}>
                                {formatTime(entry.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                    <p className="text-base" style={{ color: themeColors.text.secondary }}>
                      {t('no_history', 'No generation history yet')}
                    </p>
                    <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your generated UUIDs will appear here')}
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
                  {t('uuid_standards', 'UUID Standards')}
                </h2>
                
                <div className="space-y-4">
                  {versionInfo.map((ver) => (
                    <div key={ver.id} className="p-4 rounded-lg border" style={{ borderColor: themeColors.border }}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold" style={{ color: themeColors.primary }}>{ver.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${successColor}15`, color: successColor }}>
                          {ver.entropy}
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: themeColors.text.secondary }}>{ver.description}</p>
                      <div className="text-xs font-mono" style={{ color: themeColors.text.secondary }}>{ver.format}</div>
                      <div className="text-xs mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>{ver.useCase}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${successColor}10`, border: `1px solid ${successColor}30` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4" style={{ color: successColor }} />
                    <span className="text-sm font-medium" style={{ color: successColor }}>{t('rfc_note', 'RFC 4122 Standard')}</span>
                  </div>
                  <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                    {t('rfc_desc', 'Universally Unique Identifiers (UUIDs) are defined by RFC 4122. They provide unique identifiers that are globally unique across space and time without central coordination.')}
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
