
"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Upload, Settings, Image as ImageIcon, Sparkles, CheckCircle, X, History, Share2, Trash2, Info } from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

const faviconSizes = [16, 32, 48, 64, 128, 256];

interface HistoryEntry {
  id: number;
  originalImage: string;
  faviconData: string;
  selectedSizes: number[];
  fileName: string;

  timestamp: string;
}

export default function FaviconGeneratorClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'image-tools' });
  const [mounted, setMounted] = useState(false);
  
  // Language detection for content

  
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [faviconData, setFaviconData] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'generator' | 'history'>('generator');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `favicon_generator.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem('favicon-generator-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(t('invalid_file', 'Please upload an image file (JPG, PNG, GIF, WebP, SVG, etc.)'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(t('file_too_large', 'File size too large. Maximum 5MB allowed.'));
      return;
    }

    setError(null);
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      generateFavicon(e.target?.result as string);
      setSuccessMessage(t('upload_success', '✓ "{name}" uploaded successfully!').replace('{name}', file.name));
    };
    reader.readAsDataURL(file);
  };

  const generateFavicon = async (imageSrc: string) => {
    setIsGenerating(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      const img = new Image();
      img.onload = () => {
        canvas.width = 32;
        canvas.height = 32;
        
        const scale = Math.min(32 / img.width, 32 / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (32 - width) / 2;
        const y = (32 - height) / 2;
        
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, 32, 32);
        ctx.drawImage(img, x, y, width, height);
        
        const result = canvas.toDataURL('image/png');
        setFaviconData(result);
        setIsGenerating(false);
        
        // Save to history
        const historyEntry: HistoryEntry = {
          id: Date.now(),
          originalImage: imageSrc,
          faviconData: result,
          selectedSizes: [...selectedSizes],
          fileName: fileName,
          timestamp: new Date().toISOString()
        };
        const newHistory = [historyEntry, ...history.slice(0, 9)];
        setHistory(newHistory);
        try {
          localStorage.setItem('favicon-generator-history', JSON.stringify(newHistory));
        } catch (e) {
          console.error('Error saving to localStorage:', e);
        }
      };
      img.src = imageSrc;
    } catch (error) {
      console.error('Error generating favicon:', error);
      setError(t('generation_error', 'Failed to generate favicon. Please try again.'));
      setIsGenerating(false);
    }
  };

  const toggleSize = (size: number) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size].sort((a, b) => a - b)
    );
  };

  const downloadFavicon = () => {
    if (!faviconData) return;
    
    const link = document.createElement('a');
    link.download = 'favicon.ico';
    link.href = faviconData.replace('image/png', 'image/x-icon');
    link.click();
    setSuccessMessage(t('download_success', '✓ Favicon downloaded successfully!'));
  };

  const downloadPNG = (size: number) => {
    if (!originalImage) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = size;
    canvas.height = size;
    
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(size / img.width, size / img.height);
      const width = img.width * scale;
      const height = img.height * scale;
      const x = (size - width) / 2;
      const y = (size - height) / 2;
      
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, x, y, width, height);
      
      const link = document.createElement('a');
      link.download = `favicon-${size}x${size}.png`;
      link.href = canvas.toDataURL();
      link.click();
      setSuccessMessage(t('png_download_success', `✓ ${size}x${size} PNG downloaded successfully!`));
    };
    img.src = originalImage;
  };

  const downloadAllSizes = () => {
    selectedSizes.forEach(size => downloadPNG(size));
    setSuccessMessage(t('all_downloaded', '✓ All selected sizes downloaded!'));
  };

  const resetTool = () => {
    setOriginalImage(null);
    setFaviconData(null);
    setSelectedSizes([16, 32, 48]);
    setFileName('');
    setError(null);
    setSuccessMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('favicon-generator-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setOriginalImage(entry.originalImage);
    setFaviconData(entry.faviconData);
    setSelectedSizes(entry.selectedSizes);
    setFileName(entry.fileName);
    setActiveTab('generator');
  };

  const getDynamicStyles = () => {
    return {
      '--primary': themeColors.primary || '#2563EB',
      '--primary-light': `${themeColors.primary || '#2563EB'}20`,
      '--primary-lighter': `${themeColors.primary || '#2563EB'}10`,
      '--secondary': themeColors.secondary || '#1f7190',
      '--background': themeColors.background || '#FFFFFF',
      '--surface': themeColors.surface || '#F8FAFC',
      '--text-primary': themeColors.text?.primary || '#1E293B',
      '--text-secondary': themeColors.text?.secondary || '#475569',
      '--text-accent': themeColors.text?.accent || '#0A1929',
      '--border': themeColors.border || '#E2E8F0',
      '--success': themeColors.success || '#10B981',
      '--warning': themeColors.warning || '#F59E0B',
      '--error': themeColors.error || '#EF4444',
      '--shadow': themeColors.shadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      '--font-family': fontFamily || 'system-ui, sans-serif',
    } as React.CSSProperties;
  };

  const isRTL = lang === 'ur' || lang === 'ar';
  const isLoading = !mounted || toolsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <div className="animate-pulse text-primary">{t('loading', 'Loading...')}</div>
      </div>
    );
  }

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen"
      style={{ backgroundColor: themeColors.background, fontFamily: fontFamily }}
    >

      
      {/* Top Banner Ad */}
      <CentralAd position="top" size="banner" />
      
      <div className="max-w-6xl mx-auto px-4 py-8" style={getDynamicStyles()}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="rounded-full p-3" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <ImageIcon className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'Favicon Generator')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Create professional favicons for your website from any image')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'generator' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'generator' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'generator' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'generator' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <ImageIcon className="h-4 w-4" />
            {t('tab_generator', 'Generator')}
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'history' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'history' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'history' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'history' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <History className="h-4 w-4" />
            {t('tab_history', 'History')}
          </button>
        </div>

        {/* Main Content - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <CentralAd position="sidebar-left" size="skyscraper" />
            </div>
          </aside>
          
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            
            {/* Generator Tab */}
            {activeTab === 'generator' && (
              <div className="space-y-6">
                {/* Messages */}
                {(error || successMessage) && (
                  <div className={`p-4 rounded-lg flex items-center justify-between`}
                    style={{ 
                      backgroundColor: error ? `${themeColors.error}10` : `${themeColors.success}10`,
                      border: `1px solid ${error ? themeColors.error : themeColors.success}30`
                    }}>
                    <div className="flex items-center gap-2">
                      {error ? (
                        <div className="h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: themeColors.error, color: '#fff' }}>!</div>
                      ) : (
                        <CheckCircle className="h-5 w-5" style={{ color: themeColors.success }} />
                      )}
                      <span className="text-sm" style={{ color: error ? themeColors.error : themeColors.success }}>
                        {error || successMessage}
                      </span>
                    </div>
                    <button onClick={() => { setError(null); setSuccessMessage(null); }} className="opacity-70 hover:opacity-100">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* File Upload */}
                {!originalImage && (
                  <div className="rounded-xl border-2 border-dashed p-8 text-center" style={{ borderColor: themeColors.border }}>
                    <div className="inline-flex items-center justify-center p-4 rounded-full mb-4" style={{ backgroundColor: `${themeColors.primary}10` }}>
                      <Upload className="h-8 w-8" style={{ color: themeColors.primary }} />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                    >
                      <Upload className="h-4 w-4" />
                      {t('select_image', 'Select Image')}
                    </label>
                    <p className="mt-4 text-xs" style={{ color: themeColors.text.secondary }}>
                      {t('file_info', 'Supports JPG, PNG, GIF, WebP, SVG • Max 5MB')}
                    </p>
                  </div>
                )}

                {originalImage && (
                  <div className="space-y-6">
                    {/* Images Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Original Image */}
                      <div className="text-center">
                        <h3 className="font-semibold mb-2" style={{ color: themeColors.text.primary }}>{t('original_image', 'Original Image')}</h3>
                        <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
                          <img src={originalImage} alt="Original" className="w-full h-auto max-h-48 object-contain mx-auto" />
                        </div>
                      </div>

                      {/* Favicon Preview */}
                      <div className="text-center">
                        <h3 className="font-semibold mb-2" style={{ color: themeColors.text.primary }}>{t('favicon_preview', 'Favicon Preview')}</h3>
                        <div className="flex flex-wrap gap-4 justify-center">
                          {selectedSizes.map(size => (
                            <div key={size} className="text-center">
                              <div 
                                className="border rounded-lg flex items-center justify-center mx-auto mb-1"
                                style={{ 
                                  width: Math.min(64, size), 
                                  height: Math.min(64, size),
                                  backgroundColor: themeColors.background,
                                  borderColor: themeColors.border,
                                  backgroundImage: 'radial-gradient(circle, #ccc 1px, transparent 1px)',
                                  backgroundSize: '10px 10px'
                                }}
                              >
                                {faviconData && (
                                  <img 
                                    src={faviconData} 
                                    alt={`Favicon ${size}x${size}`}
                                    className="max-w-full max-h-full"
                                    style={{ width: Math.min(64, size), height: Math.min(64, size) }}
                                  />
                                )}
                              </div>
                              <span className="text-xs" style={{ color: themeColors.text.secondary }}>{size}x{size}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                        <Settings className="h-4 w-4" style={{ color: themeColors.primary }} />
                        {t('select_sizes', 'Select Favicon Sizes')}
                      </h4>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {faviconSizes.map(size => (
                          <button
                            key={size}
                            onClick={() => toggleSize(size)}
                            className={`p-3 rounded-lg border text-center transition-all ${selectedSizes.includes(size) ? 'scale-105' : 'hover:scale-102'}`}
                            style={{ 
                              backgroundColor: selectedSizes.includes(size) ? `${themeColors.primary}10` : themeColors.background,
                              borderColor: selectedSizes.includes(size) ? themeColors.primary : themeColors.border,
                              color: selectedSizes.includes(size) ? themeColors.primary : themeColors.text.primary
                            }}
                          >
                            <div className="font-semibold">{size}x{size}</div>
                            <div className="text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                              {selectedSizes.includes(size) ? t('selected', 'Selected') : t('click_to_select', 'Click to select')}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Browser Preview */}
                    <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <h4 className="font-semibold mb-4" style={{ color: themeColors.text.primary }}>{t('browser_preview', 'Browser Preview')}</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}` }}>
                          {faviconData && (
                            <img src={faviconData} alt="Favicon" className="w-6 h-6" />
                          )}
                          <div className="text-sm" style={{ color: themeColors.text.primary }}>{t('browser_tab', 'Your Website - Centre.com.pk Favicon Generator')}</div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}` }}>
                          {faviconData && (
                            <img src={faviconData} alt="Favicon" className="w-4 h-4" />
                          )}
                          <div className="text-xs" style={{ color: themeColors.text.secondary }}>{t('browser_tab_icon', 'Browser Tab Icon')}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={downloadFavicon}
                        disabled={!faviconData || isGenerating}
                        className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
                        style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                      >
                        <Download className="h-4 w-4" />
                        {t('download_favicon', 'Download Favicon.ico')}
                      </button>
                      <button
                        onClick={downloadAllSizes}
                        disabled={!faviconData || selectedSizes.length === 0}
                        className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
                        style={{ backgroundColor: `${themeColors.primary}80`, color: themeColors.text.accent }}
                      >
                        <Download className="h-4 w-4" />
                        {t('download_all', 'Download All Sizes')}
                      </button>
                      <button
                        onClick={resetTool}
                        className="px-4 py-3 rounded-lg font-semibold flex items-center gap-2 transition-opacity hover:opacity-80"
                        style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                      >
                        <Trash2 className="h-4 w-4" />
                        {t('new_image', 'New Image')}
                      </button>
                    </div>

                    {/* Individual Size Downloads */}
                    {selectedSizes.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center">
                        {selectedSizes.map(size => (
                          <button
                            key={size}
                            onClick={() => downloadPNG(size)}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                          >
                            <Download className="h-3 w-3" />
                            {size}x{size}.png
                          </button>
                        ))}
                      </div>
                    )}

                    {isGenerating && (
                      <div className="text-center py-4">
                        <div className="inline-flex items-center gap-2" style={{ color: themeColors.primary }}>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                          <span>{t('generating', 'Generating favicon...')}</span>
                        </div>
                      </div>
                    )}

                    {/* In-content Ad */}
                    <CentralAd position="in-content" size="rectangle" />

                    {/* Instructions */}
                    <div className="rounded-xl p-6" style={{ backgroundColor: `${themeColors.primary}10`, border: `1px solid ${themeColors.primary}30` }}>
                      <h4 className="font-semibold mb-2" style={{ color: themeColors.primary }}>{t('how_to_use', 'How to Use Your Favicon')}</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside" style={{ color: themeColors.primary }}>
                        <li>{t('step_1', 'Download the favicon.ico file')}</li>
                        <li>{t('step_2', 'Upload it to your website\'s root directory')}</li>
                        <li>{t('step_3', 'Add this code to your HTML:')} <code className="px-1 rounded" style={{ backgroundColor: `${themeColors.primary}20` }}>&lt;link rel="icon" href="/favicon.ico" type="image/x-icon"&gt;</code></li>
                        <li>{t('step_4', 'Clear your browser cache and refresh to see the new favicon')}</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="p-4 sm:p-6 border-b" style={{ borderColor: themeColors.border }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold" style={{ color: themeColors.text.primary }}>
                        {t('generation_history', 'Generation History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_favicons', 'Your recently generated favicons')}
                      </p>
                    </div>
                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="px-4 py-2 border rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                        style={{ borderColor: themeColors.error, color: themeColors.error }}
                      >
                        {t('clear_history', 'Clear History')}
                      </button>
                    )}
                  </div>
                </div>

                {history.length > 0 ? (
                  <div className="divide-y" style={{ borderColor: themeColors.border }}>
                    {history.map((entry) => (
                      <div key={entry.id} className="p-4 hover:opacity-80 transition-opacity">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <ImageIcon className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.fileName}
                              </span>
                            </div>
                            <div className="flex gap-2 mt-1">
                              {entry.selectedSizes.slice(0, 3).map(size => (
                                <span key={size} className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                                  {size}x{size}
                                </span>
                              ))}
                              {entry.selectedSizes.length > 3 && (
                                <span className="text-xs" style={{ color: themeColors.text.secondary }}>+{entry.selectedSizes.length - 3}</span>
                              )}
                            </div>
                            <p className="text-xs mt-1 opacity-60" style={{ color: themeColors.text.secondary }}>
                              {new Date(entry.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => loadHistoryEntry(entry)}
                            className="px-3 py-1 text-xs rounded hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                          >
                            {t('load', 'Load')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 sm:p-12 text-center">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                    <p className="text-sm opacity-80 mb-2" style={{ color: themeColors.text.secondary }}>
                      {t('no_history', 'No generation history yet')}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your generated favicons will appear here')}
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
      {/* Related Blog Posts — SEO Internal Linking */}
      <div className="mt-8">
      </div>
      </div>
    </div>
  );


}
