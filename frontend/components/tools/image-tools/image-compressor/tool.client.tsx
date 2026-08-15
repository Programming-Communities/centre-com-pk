
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';
// components/tools/image-tools/image-compressor/tool.client.tsx

import { useState, useRef, useEffect } from "react";
import { Upload, Download, RotateCcw, Minimize2, Sparkles, CheckCircle, X, History, Share2, Trash2, Info, FileImage, Zap } from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

interface HistoryEntry {
  id: number;
  originalImage: string;
  compressedImage: string;
  quality: number;
  originalSize: number;
  compressedSize: number;
  fileName: string;

  timestamp: string;
}

export default function ImageCompressorClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'image-tools' });
  const [mounted, setMounted] = useState(false);
  
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'compressor' | 'history'>('compressor');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `image_compressor.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem('image-compressor-history');
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(t('invalid_file', 'Please upload an image file (JPG, PNG, GIF, WebP, etc.)'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(t('file_too_large', 'File size too large. Maximum 10MB allowed.'));
      return;
    }

    setError(null);
    setFileName(file.name);
    setOriginalSize(file.size);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setCompressedImage(null);
      setCompressedSize(0);
      setSuccessMessage(t('upload_success', '✓ "{name}" uploaded successfully!').replace('{name}', file.name));
    };
    reader.readAsDataURL(file);
  };

  const compressImage = () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);
    
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
          setCompressedImage(compressedDataUrl);
          
          const base64 = compressedDataUrl.split(',')[1];
          const binary = atob(base64);
          const newCompressedSize = binary.length;
          setCompressedSize(newCompressedSize);
          
          setSuccessMessage(t('compress_success', '✓ Image compressed successfully!'));
          
          // Save to history
          const historyEntry: HistoryEntry = {
            id: Date.now(),
            originalImage: originalImage,
            compressedImage: compressedDataUrl,
            quality: quality,
            originalSize: originalSize,
            compressedSize: newCompressedSize,
            fileName: fileName,
            timestamp: new Date().toISOString()
          };
          const newHistory = [historyEntry, ...history.slice(0, 9)];
          setHistory(newHistory);
          try {
            localStorage.setItem('image-compressor-history', JSON.stringify(newHistory));
          } catch (e) {
            console.error('Error saving to localStorage:', e);
          }
        }
        setIsProcessing(false);
      };
      
      img.src = originalImage;
    }, 500);
  };

  const downloadImage = () => {
    if (!compressedImage) return;
    
    const link = document.createElement('a');
    const name = fileName ? fileName.replace(/\.[^/.]+$/, "") : 'compressed';
    link.download = `${name}-compressed-${quality}q.jpg`;
    link.href = compressedImage;
    link.click();
    setSuccessMessage(t('download_success', '✓ Image downloaded successfully!'));
  };

  const shareImage = async () => {
    if (!compressedImage) return;
    
    try {
      const response = await fetch(compressedImage);
      const blob = await response.blob();
      const file = new File([blob], `${fileName || 'image'}-compressed.jpg`, { type: 'image/jpeg' });
      
      if (navigator.share) {
        await navigator.share({
          title: t('share_title', 'Compressed Image'),
          files: [file]
        });
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({
            [file.type]: file
          })
        ]);
        setSuccessMessage(t('copied_to_clipboard', 'Image copied to clipboard!'));
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const resetTool = () => {
    setOriginalImage(null);
    setCompressedImage(null);
    setQuality(80);
    setOriginalSize(0);
    setCompressedSize(0);
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
      localStorage.removeItem('image-compressor-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setOriginalImage(entry.originalImage);
    setCompressedImage(entry.compressedImage);
    setQuality(entry.quality);
    setOriginalSize(entry.originalSize);
    setCompressedSize(entry.compressedSize);
    setFileName(entry.fileName);
    setActiveTab('compressor');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressionRatio = originalSize > 0 && compressedSize > 0 ? ((originalSize - compressedSize) / originalSize * 100).toFixed(1) : 0;

  const qualityPresets = [
    { value: 90, label: t('high_quality', 'High Quality'), size: t('slightly_smaller', 'Slightly smaller') },
    { value: 80, label: t('good_balance', 'Good Balance'), size: t('recommended', 'Recommended') },
    { value: 70, label: t('small_size', 'Small Size'), size: t('good_for_web', 'Good for web') },
    { value: 50, label: t('very_small', 'Very Small'), size: t('for_email', 'For email/social') },
  ];

  const isRTL = lang === 'ur' || lang === 'ar';
  const isLoading = !mounted || toolsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <div className="animate-pulse text-primary">{t('loading', 'Loading...')}</div>
      </div>
    );
  }

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
              <FileImage className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'Image Compressor')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Reduce image file size without losing quality')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('compressor')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'compressor' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'compressor' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'compressor' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'compressor' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Minimize2 className="h-4 w-4" />
            {t('tab_compressor', 'Compressor')}
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
            
            {/* Compressor Tab */}
            {activeTab === 'compressor' && (
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
                    <h3 className="text-xl font-semibold mb-2" style={{ color: themeColors.text.primary }}>
                      {t('upload_title', 'Upload an Image')}
                    </h3>
                    <p className="mb-6" style={{ color: themeColors.text.secondary }}>
                      {t('upload_desc', 'Select an image file to compress (JPG, PNG supported)')}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                    >
                      <Upload className="h-4 w-4" />
                      {t('choose_file', 'Choose File')}
                    </label>
                    <p className="mt-4 text-xs" style={{ color: themeColors.text.secondary }}>
                      {t('file_info', 'Supports JPG, PNG, GIF, WebP • Max 10MB')}
                    </p>
                  </div>
                )}

                {originalImage && (
                  <div className="space-y-6">
                    {/* Quality Control */}
                    <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                          {t('quality', 'Compression Quality')}: {quality}%
                        </label>
                        <div className="flex gap-1">
                          {qualityPresets.map(preset => (
                            <button
                              key={preset.value}
                              onClick={() => setQuality(preset.value)}
                              className={`px-2 py-1 text-xs rounded transition-colors ${quality === preset.value ? 'text-white' : ''}`}
                              style={{ 
                                backgroundColor: quality === preset.value ? themeColors.primary : themeColors.background,
                                color: quality === preset.value ? themeColors.text.accent : themeColors.text.secondary,
                                border: `1px solid ${themeColors.border}`
                              }}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full"
                        style={{ accentColor: themeColors.primary }}
                      />
                      <div className="flex justify-between text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                        <span>{t('smaller_file', 'Smaller File')}</span>
                        <span>{t('better_quality', 'Better Quality')}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={compressImage}
                        disabled={isProcessing}
                        className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
                        style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            <span>{t('compressing', 'Compressing...')}</span>
                          </>
                        ) : (
                          <>
                            <Minimize2 className="h-4 w-4" />
                            <span>{t('compress', 'Compress Image')}</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetTool}
                        className="px-4 py-3 rounded-lg font-semibold flex items-center gap-2 transition-opacity hover:opacity-80"
                        style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                      >
                        <RotateCcw className="h-4 w-4" />
                        {t('reset', 'Reset')}
                      </button>
                    </div>

                    {/* Results Section */}
                    {compressedImage && (
                      <div className="space-y-6">
                        {/* Size Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${themeColors.primary}10` }}>
                            <div className="text-2xl font-bold" style={{ color: themeColors.primary }}>{formatFileSize(originalSize)}</div>
                            <div className="text-sm" style={{ color: themeColors.text.secondary }}>{t('original_size', 'Original Size')}</div>
                          </div>
                          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${themeColors.success}10` }}>
                            <div className="text-2xl font-bold" style={{ color: themeColors.success }}>{formatFileSize(compressedSize)}</div>
                            <div className="text-sm" style={{ color: themeColors.text.secondary }}>{t('compressed_size', 'Compressed Size')}</div>
                          </div>
                          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${themeColors.warning}10` }}>
                            <div className="text-2xl font-bold" style={{ color: themeColors.warning }}>{compressionRatio}%</div>
                            <div className="text-sm" style={{ color: themeColors.text.secondary }}>{t('size_reduced', 'Size Reduced')}</div>
                          </div>
                        </div>

                        {/* Image Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>{t('original', 'Original')}</p>
                            <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
                              <img src={originalImage} alt="Original" className="w-full h-auto max-h-48 object-contain" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>{t('compressed', 'Compressed')}</p>
                            <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
                              <img src={compressedImage} alt="Compressed" className="w-full h-auto max-h-48 object-contain" />
                            </div>
                          </div>
                        </div>

                        {/* Download & Share Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={downloadImage}
                            className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: themeColors.success, color: '#fff' }}
                          >
                            <Download className="h-4 w-4" />
                            {t('download', 'Download Compressed Image')}
                          </button>
                          <button
                            onClick={shareImage}
                            className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                          >
                            <Share2 className="h-4 w-4" />
                            {t('share', 'Share')}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* In-content Ad */}
                    <CentralAd position="in-content" size="rectangle" />

                    {/* SEO Info */}
                    <div className="rounded-xl p-6" style={{ backgroundColor: `${themeColors.primary}10`, border: `1px solid ${themeColors.primary}30` }}>
                      <div className="flex items-center gap-2 mb-4">
                        <Info className="h-5 w-5" style={{ color: themeColors.primary }} />
                        <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('about_tool', 'About This Tool')}</h3>
                      </div>
                      <div className="space-y-3 text-sm" style={{ color: themeColors.text.secondary }}>
                        <p><strong className="font-semibold" style={{ color: themeColors.primary }}>{t('professional', 'Professional Image Compressor')}</strong> - {t('professional_desc', 'Reduce image file size while maintaining visual quality. Perfect for web optimization, email attachments, and social media sharing.')}</p>
                        <p><strong className="font-semibold" style={{ color: themeColors.primary }}>{t('privacy', 'Privacy First')}</strong> - {t('privacy_desc', 'All processing happens in your browser. Your images never leave your device, ensuring complete privacy and security.')}</p>
                        <p><strong className="font-semibold" style={{ color: themeColors.primary }}>{t('formats', 'Supported Formats')}</strong> - {t('formats_desc', 'Works with JPG, PNG, GIF, WebP formats. Output is optimized JPEG for best compression.')}</p>
                      </div>
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
                        {t('compression_history', 'Compression History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_compressions', 'Your recent image compressions')}
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
                              <FileImage className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.fileName}
                              </span>
                            </div>
                            <div className="flex gap-3 text-xs" style={{ color: themeColors.text.secondary }}>
                              <span>{formatFileSize(entry.originalSize)} → {formatFileSize(entry.compressedSize)}</span>
                              <span className="text-success">{Math.round((entry.originalSize - entry.compressedSize) / entry.originalSize * 100)}% reduction</span>
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
                      {t('no_history', 'No compression history yet')}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your compressed images will appear here')}
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
