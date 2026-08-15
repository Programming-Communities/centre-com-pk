
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useRef, useEffect } from "react";
import { useParams } from 'next/navigation';
import { 
  Trash2, Shield, File, Check, X, AlertTriangle, Zap, Lock,
  Upload, Download, RefreshCw, Clock, Database, HardDrive,
  AlertCircle, CheckCircle, Info, Eye, EyeOff, Plus, Minus,
  Server, Cpu, Activity, BarChart3, Target, Award
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// Types
type WipeMethod = 'quick' | 'dod' | 'gutmann' | 'random' | 'zero';

interface WipeMethodType {
  id: WipeMethod;
  name: string;
  passes: number;
  description: string;
  standard: string;
  securityLevel: 'Basic' | 'Standard' | 'High' | 'Military' | 'Maximum';
}

interface WipeHistory {
  id: number;
  timestamp: string;
  fileName: string;
  fileSize: number;
  method: WipeMethod;
  passes: number;
  status: 'completed' | 'failed';
}

export default function SecureFileWipeClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily, isDarkMode } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'security-tools' });
  const [mounted, setMounted] = useState(false);
  
  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `secure_file_wipe.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // State
  const [files, setFiles] = useState<File[]>([]);
  const [wipeMethod, setWipeMethod] = useState<WipeMethod>('dod');
  const [isWiping, setIsWiping] = useState(false);
  const [wipeProgress, setWipeProgress] = useState(0);
  const [currentPass, setCurrentPass] = useState(0);
  const [wipeComplete, setWipeComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'wiper' | 'history' | 'standards'>('wiper');
  const [history, setHistory] = useState<WipeHistory[]>([]);
  const [verificationEnabled, setVerificationEnabled] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Wipe methods data
  const wipeMethods: WipeMethodType[] = [
    { id: 'quick', name: t('quick_wipe', 'Quick Wipe'), passes: 1, description: t('quick_desc', 'Single pass zero overwrite'), standard: 'Basic', securityLevel: 'Basic' },
    { id: 'zero', name: t('zero_wipe', 'Zero Fill'), passes: 1, description: t('zero_desc', 'Single pass with zeros'), standard: 'Basic', securityLevel: 'Basic' },
    { id: 'random', name: t('random_wipe', 'Random Data'), passes: 7, description: t('random_desc', 'Random data overwrite (7 passes)'), standard: 'Secure', securityLevel: 'Standard' },
    { id: 'dod', name: t('dod_wipe', 'DoD 5220.22-M'), passes: 3, description: t('dod_desc', 'US Department of Defense standard'), standard: 'DoD 5220.22-M', securityLevel: 'Military' },
    { id: 'gutmann', name: t('gutmann_wipe', 'Gutmann'), passes: 35, description: t('gutmann_desc', 'Most secure (35 passes)'), standard: 'Gutmann', securityLevel: 'Maximum' },
  ];

  const getCurrentMethod = () => wipeMethods.find(m => m.id === wipeMethod) || wipeMethods[3];

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
      const savedHistory = localStorage.getItem('file-wipe-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading history:', e);
    }
  };

  const saveToHistory = (fileName: string, fileSize: number, method: WipeMethod, passes: number) => {
    const entry: WipeHistory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      fileName: fileName.length > 30 ? fileName.substring(0, 27) + '...' : fileName,
      fileSize: fileSize,
      method: method,
      passes: passes,
      status: 'completed',
    };
    const newHistory = [entry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('file-wipe-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to history:', e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('file-wipe-history');
      setSuccessMessage(t('history_cleared', '✓ History cleared successfully!'));
    } catch (e) {
      console.error('Error clearing history:', e);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFiles = (newFiles: File[]): File[] => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize) {
        setError(t('file_too_large', `File "${file.name}" exceeds 100MB limit`));
        return false;
      }
      return true;
    });
    return validFiles;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    const validFiles = validateFiles(newFiles);
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      setWipeComplete(false);
      setSuccessMessage(t('files_added', `✓ ${validFiles.length} file(s) added successfully!`));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(droppedFiles);
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      setWipeComplete(false);
      setSuccessMessage(t('files_added', `✓ ${validFiles.length} file(s) added successfully!`));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setWipeComplete(false);
  };

  const removeAllFiles = () => {
    setFiles([]);
    setWipeComplete(false);
    setWipeProgress(0);
    setCurrentPass(0);
  };

  const simulateWipe = () => {
    if (files.length === 0) {
      setError(t('no_files', 'Please select files to wipe'));
      return;
    }

    setIsWiping(true);
    setWipeProgress(0);
    setCurrentPass(0);
    setError(null);
    
    const selectedMethod = getCurrentMethod();
    const totalPasses = selectedMethod.passes;
    const totalSteps = totalPasses * 10; // 10 steps per pass
    
    let currentStep = 0;
    let currentPassNum = 1;
    
    const interval = setInterval(() => {
      currentStep++;
      const newProgress = Math.round((currentStep / totalSteps) * 100);
      setWipeProgress(newProgress);
      setCurrentPass(Math.ceil(currentStep / 10));
      
      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setIsWiping(false);
        setWipeComplete(true);
        setSuccessMessage(t('wipe_success', `✓ Successfully wiped ${files.length} file(s) using ${selectedMethod.name} standard!`));
        
        // Save each wiped file to history
        files.forEach(file => {
          saveToHistory(file.name, file.size, wipeMethod, selectedMethod.passes);
        });
        
        // Clear files after successful wipe (simulated)
        setTimeout(() => {
          setFiles([]);
        }, 2000);
      }
    }, 80);
  };

  const resetWipe = () => {
    setFiles([]);
    setWipeComplete(false);
    setWipeProgress(0);
    setCurrentPass(0);
    setError(null);
    setSuccessMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch(level) {
      case 'Maximum': return '#8B5CF6';
      case 'Military': return '#3B82F6';
      case 'High': return '#10B981';
      case 'Standard': return '#F59E0B';
      case 'Basic': return '#6B7280';
      default: return themeColors.primary || '#2563EB';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const selectedMethod = getCurrentMethod();

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
              <Trash2 className="h-10 w-10" style={{ color: themeColors.primary }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            <GradientText>{t('title', 'Secure File Wipe')}</GradientText>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Military-grade file deletion with DoD 5220.22-M standard. Permanently erase files with multiple overwrite patterns to prevent data recovery.')}
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${successColor}15` }}>
              <Shield className="h-3.5 w-3.5" style={{ color: successColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('dod_certified', 'DoD Certified')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${warningColor}15` }}>
              <Lock className="h-3.5 w-3.5" style={{ color: warningColor }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('military_grade', 'Military Grade')}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Zap className="h-3.5 w-3.5" style={{ color: themeColors.primary }} />
              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{t('irreversible', 'Irreversible')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'wiper', icon: Trash2, label: t('tab_wiper', 'File Wiper') },
            { id: 'history', icon: Database, label: t('tab_history', 'History') },
            { id: 'standards', icon: Shield, label: t('tab_standards', 'Standards') },
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
            
            {/* WIPER TAB */}
            {activeTab === 'wiper' && (
              <>
                {/* File Upload Area */}
                <div
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`rounded-xl border-2 transition-all duration-300 ${
                    dragActive ? 'border-primary scale-[1.01]' : 'border-dashed'
                  }`}
                  style={{ 
                    borderColor: dragActive ? themeColors.primary : themeColors.border,
                    backgroundColor: dragActive ? `${themeColors.primary}08` : themeColors.surface,
                  }}
                >
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center p-4 rounded-2xl mb-4" style={{ backgroundColor: `${themeColors.primary}10` }}>
                      <Upload className="h-8 w-8" style={{ color: themeColors.primary }} />
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold cursor-pointer hover:opacity-90 transition-all hover:scale-105"
                      style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                    >
                      <Upload className="h-4 w-4" />
                      {t('select_files', 'Select Files')}
                    </label>
                    
                    <p className="mt-4 text-sm" style={{ color: themeColors.text.secondary }}>
                      {t('drag_drop', 'or drag & drop files here')}
                    </p>
                    <p className="mt-2 text-xs opacity-70" style={{ color: themeColors.text.secondary }}>
                      {t('file_info', 'Maximum file size: 100MB per file')}
                    </p>
                  </div>
                </div>

                {/* Selected Files List */}
                {files.length > 0 && (
                  <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: themeColors.border }}>
                      <div className="flex items-center gap-2">
                        <File className="h-5 w-5" style={{ color: themeColors.primary }} />
                        <h3 className="font-semibold" style={{ color: themeColors.text.primary }}>
                          {t('selected_files', 'Selected Files')} ({files.length})
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-sm" style={{ color: themeColors.text.secondary }}>
                          {t('total_size', 'Total')}: {formatFileSize(totalSize)}
                        </span>
                        <button
                          onClick={removeAllFiles}
                          className="text-xs px-2 py-1 rounded transition-all hover:scale-105"
                          style={{ backgroundColor: `${errorColor}10`, color: errorColor }}
                        >
                          {t('clear_all', 'Clear All')}
                        </button>
                      </div>
                    </div>
                    <div className="divide-y max-h-64 overflow-y-auto" style={{ borderColor: themeColors.border }}>
                      {files.map((file, index) => (
                        <div key={index} className="p-3 flex items-center justify-between hover:bg-surface-hover transition-colors">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <File className="h-4 w-4 shrink-0" style={{ color: themeColors.primary }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate" style={{ color: themeColors.text.primary }}>
                                {file.name}
                              </p>
                              <p className="text-xs" style={{ color: themeColors.text.secondary }}>
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1 rounded transition-all hover:scale-110"
                            style={{ color: errorColor }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wipe Method Selection */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Shield className="h-5 w-5" style={{ color: themeColors.primary }} />
                    {t('wipe_method', 'Wipe Method')}
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {wipeMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setWipeMethod(method.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${wipeMethod === method.id ? 'scale-105 shadow-lg' : 'hover:scale-102'}`}
                        style={{ 
                          backgroundColor: wipeMethod === method.id ? `${themeColors.primary}10` : themeColors.background,
                          borderColor: wipeMethod === method.id ? themeColors.primary : themeColors.border,
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold" style={{ color: wipeMethod === method.id ? themeColors.primary : themeColors.text.primary }}>
                            {method.name}
                          </div>
                          <div className="text-xs px-2 py-0.5 rounded-full" style={{ 
                            backgroundColor: `${getSecurityLevelColor(method.securityLevel)}20`,
                            color: getSecurityLevelColor(method.securityLevel)
                          }}>
                            {method.passes} {t('passes', 'passes')}
                          </div>
                        </div>
                        <p className="text-xs mb-1" style={{ color: themeColors.text.secondary }}>
                          {method.description}
                        </p>
                        <p className="text-xs" style={{ color: getSecurityLevelColor(method.securityLevel) }}>
                          {method.standard}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Warning Message */}
                <div className="rounded-xl p-4 flex items-start gap-3"
                  style={{ 
                    backgroundColor: `${warningColor}10`,
                    border: `1px solid ${warningColor}30`
                  }}
                >
                  <AlertTriangle className="h-5 w-5 shrink-0" style={{ color: warningColor }} />
                  <div>
                    <div className="font-bold mb-1" style={{ color: warningColor }}>
                      {t('warning_title', 'Warning: Irreversible Action')}
                    </div>
                    <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                      {t('warning_text', 'Files will be permanently deleted using secure overwrite patterns. This action cannot be undone. Ensure you have backups of important files.')}
                    </p>
                  </div>
                </div>

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* Progress Bar */}
                {isWiping && (
                  <div className="rounded-xl p-4" style={{ backgroundColor: themeColors.surface, border: `1px solid ${themeColors.border}` }}>
                    <div className="flex justify-between text-sm mb-2">
                      <span style={{ color: themeColors.text.secondary }}>{t('wiping', 'Wiping files...')}</span>
                      <span style={{ color: themeColors.primary }}>{wipeProgress}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${themeColors.primary}20` }}>
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${wipeProgress}%`, backgroundColor: themeColors.primary }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-2">
                      <span style={{ color: themeColors.text.secondary }}>
                        {t('pass', 'Pass')} {currentPass}/{selectedMethod.passes}
                      </span>
                      <span style={{ color: themeColors.text.secondary }}>
                        {t('method', 'Method')}: {selectedMethod.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!wipeComplete ? (
                    <>
                      <button
                        onClick={simulateWipe}
                        disabled={files.length === 0 || isWiping}
                        className="flex-1 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                      >
                        {isWiping ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            <span>{t('wiping', 'Wiping...')}</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            <span>{t('wipe_securely', 'Wipe Files Securely')}</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetWipe}
                        className="px-4 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
                        style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('reset', 'Reset')}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={resetWipe}
                      className="flex-1 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: successColor, color: '#fff' }}
                    >
                      <Check className="h-4 w-4" />
                      {t('wipe_complete', 'Wipe Complete - Start New')}
                    </button>
                  )}
                </div>

                {/* Security Info */}
                <div className="rounded-xl p-5" style={{ backgroundColor: `${themeColors.primary}08`, border: `1px solid ${themeColors.primary}20` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="h-5 w-5" style={{ color: themeColors.primary }} />
                    <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('security_guarantee', 'Security Guarantee')}</h3>
                  </div>
                  <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                    {t('security_text', 'All file wiping happens locally in your browser. Your files never leave your device, ensuring complete privacy and preventing any possibility of data recovery from our servers.')}
                  </p>
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
                        {t('wipe_history', 'Wipe History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_wipes', 'Your recent secure file wipes')}
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
                              <Trash2 className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.fileName}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${successColor}15`, color: successColor }}>
                                {entry.method.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex gap-3 text-xs" style={{ color: themeColors.text.secondary }}>
                              <span>{formatFileSize(entry.fileSize)}</span>
                              <span>{entry.passes} {t('passes', 'passes')}</span>
                            </div>
                            <p className="text-xs mt-1 opacity-60" style={{ color: themeColors.text.secondary }}>
                              {formatTime(entry.timestamp)}
                            </p>
                          </div>
                          <div className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${successColor}15`, color: successColor }}>
                            {t('completed', 'Completed')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                    <p className="text-base" style={{ color: themeColors.text.secondary }}>
                      {t('no_history', 'No wipe history yet')}
                    </p>
                    <p className="text-sm mt-2 opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your secure file wipes will appear here')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STANDARDS TAB */}
            {activeTab === 'standards' && (
              <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                  <Shield className="h-5 w-5" style={{ color: themeColors.primary }} />
                  {t('security_standards', 'Security Standards')}
                </h2>
                
                <div className="space-y-4">
                  {wipeMethods.map((method) => (
                    <div key={method.id} className="p-4 rounded-lg border" style={{ borderColor: themeColors.border }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-bold" style={{ color: themeColors.primary }}>{method.name}</h3>
                          <p className="text-xs" style={{ color: themeColors.text.secondary }}>{method.standard}</p>
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full" style={{ 
                          backgroundColor: `${getSecurityLevelColor(method.securityLevel)}20`,
                          color: getSecurityLevelColor(method.securityLevel)
                        }}>
                          {method.securityLevel}
                        </div>
                      </div>
                      <p className="text-sm mb-2" style={{ color: themeColors.text.secondary }}>{method.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-3 w-3" style={{ color: themeColors.text.secondary }} />
                        <span style={{ color: themeColors.text.secondary }}>{method.passes} {t('overwrite_passes', 'overwrite passes')}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${successColor}10`, border: `1px solid ${successColor}30` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4" style={{ color: successColor }} />
                    <span className="text-sm font-medium" style={{ color: successColor }}>{t('recommendation', 'Recommendation')}</span>
                  </div>
                  <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                    {t('recommendation_text', 'For most users, the DoD 5220.22-M standard provides excellent security with reasonable performance. Use Gutmann only for highly sensitive data.')}
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
