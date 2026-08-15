
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';
// components/tools/image-tools/image-converter/tool.client.tsx

import { useState, useRef, useEffect } from "react";
import { Upload, Download, RotateCcw, RefreshCw, Sparkles, CheckCircle, X, History, Share2, Trash2, Info, FileImage, Layers, ArrowRight } from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

interface HistoryEntry {
  id: number;
  originalImage: string;
  convertedImage: string;
  sourceFormat: string;
  targetFormat: string;
  fileName: string;

  timestamp: string;
}

const formats = [
  { value: 'jpg', label: 'JPEG', mime: 'image/jpeg', extension: 'jpg', quality: 0.92 },
  { value: 'png', label: 'PNG', mime: 'image/png', extension: 'png', quality: 1 },
  { value: 'webp', label: 'WebP', mime: 'image/webp', extension: 'webp', quality: 0.9 },
  { value: 'bmp', label: 'BMP', mime: 'image/bmp', extension: 'bmp', quality: 1 },
];

export default function ImageConverterClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
 
  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'image-tools' });
  const [mounted, setMounted] = useState(false);
  
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState('jpg');
  const [sourceFormat, setSourceFormat] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'converter' | 'history'>('converter');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `image_converter.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem('image-converter-history');
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

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(t('invalid_file', 'Please upload an image file (JPG, PNG, GIF, WebP, BMP, etc.)'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(t('file_too_large', 'File size too large. Maximum 10MB allowed.'));
      return;
    }

    setError(null);
    setFileName(file.name);
    const ext = getFileExtension(file.name);
    setSourceFormat(ext);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setConvertedImage(null);
      setSuccessMessage(t('upload_success', '✓ "{name}" uploaded successfully!').replace('{name}', file.name));
    };
    reader.readAsDataURL(file);
  };

  const convertImage = () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);
    
    const format = formats.find(f => f.value === targetFormat);
    if (!format) {
      setError(t('invalid_format', 'Invalid format selected'));
      setIsProcessing(false);
      return;
    }
    
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const convertedDataUrl = canvas.toDataURL(format.mime, format.quality);
          setConvertedImage(convertedDataUrl);
          setSuccessMessage(t('convert_success', '✓ Image converted to {format} successfully!').replace('{format}', format.label));
          
          // Save to history
          const historyEntry: HistoryEntry = {
            id: Date.now(),
            originalImage: originalImage,
            convertedImage: convertedDataUrl,
            sourceFormat: sourceFormat,
            targetFormat: targetFormat,
            fileName: fileName,
            timestamp: new Date().toISOString()
          };
          const newHistory = [historyEntry, ...history.slice(0, 9)];
          setHistory(newHistory);
          try {
            localStorage.setItem('image-converter-history', JSON.stringify(newHistory));
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
    if (!convertedImage) return;
    
    const format = formats.find(f => f.value === targetFormat);
    const link = document.createElement('a');
    const name = fileName ? fileName.replace(/\.[^/.]+$/, "") : 'converted';
    link.download = `${name}-converted.${format?.extension || targetFormat}`;
    link.href = convertedImage;
    link.click();
    setSuccessMessage(t('download_success', '✓ Image downloaded successfully!'));
  };

  const shareImage = async () => {
    if (!convertedImage) return;
    
    try {
      const response = await fetch(convertedImage);
      const blob = await response.blob();
      const format = formats.find(f => f.value === targetFormat);
      const file = new File([blob], `${fileName || 'image'}-converted.${format?.extension || targetFormat}`, { type: blob.type });
      
      if (navigator.share) {
        await navigator.share({
          title: t('share_title', 'Converted Image'),
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
    setConvertedImage(null);
    setTargetFormat('jpg');
    setSourceFormat('');
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
      localStorage.removeItem('image-converter-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setOriginalImage(entry.originalImage);
    setConvertedImage(entry.convertedImage);
    setTargetFormat(entry.targetFormat);
    setSourceFormat(entry.sourceFormat);
    setFileName(entry.fileName);
    setActiveTab('converter');
  };

  const formatInfo = formats.find(f => f.value === targetFormat);

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
              <Layers className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'Image Converter')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Convert images between different formats')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('converter')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'converter' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'converter' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'converter' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'converter' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Layers className="h-4 w-4" />
            {t('tab_converter', 'Converter')}
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
            
            {/* Converter Tab */}
            {activeTab === 'converter' && (
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
                      {t('upload_desc', 'Select an image file to convert')}
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
                      {t('file_info', 'Supports JPG, PNG, GIF, WebP, BMP • Max 10MB')}
                    </p>
                  </div>
                )}

                {originalImage && (
                  <div className="space-y-6">
                    {/* Format Selection */}
                    <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <label className="block text-sm font-medium mb-3" style={{ color: themeColors.text.primary }}>
                        {t('convert_to', 'Convert To Format')}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {formats.map((format) => (
                          <button
                            key={format.value}
                            onClick={() => setTargetFormat(format.value)}
                            className={`p-3 rounded-lg border text-sm font-medium transition-all ${targetFormat === format.value ? 'scale-105' : 'hover:scale-102'}`}
                            style={{ 
                              backgroundColor: targetFormat === format.value ? `${themeColors.primary}10` : themeColors.background,
                              borderColor: targetFormat === format.value ? themeColors.primary : themeColors.border,
                              color: targetFormat === format.value ? themeColors.primary : themeColors.text.primary
                            }}
                          >
                            <div className="font-semibold">{format.label}</div>
                            <div className="text-xs mt-0.5" style={{ color: themeColors.text.secondary }}>{format.extension.toUpperCase()}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={convertImage}
                        disabled={isProcessing}
                        className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
                        style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            <span>{t('converting', 'Converting...')}</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4" />
                            <span>{t('convert', 'Convert Image')}</span>
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
                    {convertedImage && (
                      <div className="space-y-6">
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                            {t('converted_image', 'Converted Image')} ({formatInfo?.label})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm mb-2" style={{ color: themeColors.text.secondary }}>{t('original', 'Original')}</p>
                              <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
                                <img src={originalImage} alt="Original" className="w-full h-auto max-h-48 object-contain" />
                              </div>
                              {sourceFormat && (
                                <div className="mt-2 text-center">
                                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                                    {sourceFormat.toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm mb-2" style={{ color: themeColors.text.secondary }}>{t('converted', 'Converted')}</p>
                              <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
                                <img src={convertedImage} alt="Converted" className="w-full h-auto max-h-48 object-contain" />
                              </div>
                              <div className="mt-2 text-center">
                                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${themeColors.success}10`, color: themeColors.success }}>
                                  {targetFormat.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Format Info */}
                        <div className="flex items-center justify-center gap-2 text-sm" style={{ color: themeColors.text.secondary }}>
                          <FileImage className="h-4 w-4" />
                          <span>{t('converted_from', 'Converted from')} {sourceFormat.toUpperCase()} {t('to', 'to')} {targetFormat.toUpperCase()}</span>
                        </div>

                        {/* Download & Share Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={downloadImage}
                            className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: themeColors.success, color: '#fff' }}
                          >
                            <Download className="h-4 w-4" />
                            {t('download', 'Download')} {formatInfo?.label} {t('image', 'Image')}
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

                    {/* Format Info */}
                    <div className="rounded-xl p-6" style={{ backgroundColor: `${themeColors.primary}10`, border: `1px solid ${themeColors.primary}30` }}>
                      <div className="flex items-center gap-2 mb-4">
                        <Info className="h-5 w-5" style={{ color: themeColors.primary }} />
                        <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('format_info', 'Format Information')}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        {formats.map(format => (
                          <div key={format.value} className="p-3 rounded-lg" style={{ backgroundColor: `${themeColors.background}80` }}>
                            <div className="font-semibold" style={{ color: themeColors.primary }}>{format.label}</div>
                            <div className="text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                              {format.value === 'jpg' && t('jpg_info', 'Best for photos, small file size')}
                              {format.value === 'png' && t('png_info', 'Best for graphics, transparency support')}
                              {format.value === 'webp' && t('webp_info', 'Modern format, best compression')}
                              {format.value === 'bmp' && t('bmp_info', 'Uncompressed, large file size')}
                            </div>
                          </div>
                        ))}
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
                        {t('conversion_history', 'Conversion History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_conversions', 'Your recent image conversions')}
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
                              <Layers className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.fileName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs" style={{ color: themeColors.text.secondary }}>
                              <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                                {entry.sourceFormat.toUpperCase()}
                              </span>
                              <ArrowRight className="h-3 w-3" />
                              <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: `${themeColors.success}10`, color: themeColors.success }}>
                                {entry.targetFormat.toUpperCase()}
                              </span>
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
                      {t('no_history', 'No conversion history yet')}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your converted images will appear here')}
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
