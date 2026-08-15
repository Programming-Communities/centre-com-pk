
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';
// components/tools/image-tools/image-resizer/tool.client.tsx

import { useState, useRef, useEffect } from "react";
import { Upload, Download, RotateCcw, Maximize, Minimize, CheckCircle, X, History, Share2, Trash2, Info, Image as ImageIcon, Zap, Lock } from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

interface HistoryEntry {
  id: number;
  originalImage: string;
  resizedImage: string;
  width: number;
  height: number;
  fileName: string;

  timestamp: string;
}

const presetSizes = [
  { label: "Social Media (1080x1080)", width: 1080, height: 1080 },
  { label: "Facebook Cover (820x312)", width: 820, height: 312 },
  { label: "Twitter Header (1500x500)", width: 1500, height: 500 },
  { label: "Instagram Story (1080x1920)", width: 1080, height: 1920 },
  { label: "YouTube Thumbnail (1280x720)", width: 1280, height: 720 },
  { label: "LinkedIn Post (1200x627)", width: 1200, height: 627 },
  { label: "Email Banner (600x200)", width: 600, height: 200 },
  { label: "Web Thumbnail (400x300)", width: 400, height: 300 },
];

export default function ImageResizerClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  
  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'image-tools' });
  const [mounted, setMounted] = useState(false);
  
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'resizer' | 'history'>('resizer');
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [quality, setQuality] = useState(90);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `image_resizer.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem('image-resizer-history');
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
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setOriginalImage(imageUrl);
      setResizedImage(null);
      
      // Get original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        if (keepAspectRatio) {
          const ratio = img.width / img.height;
          setHeight(Math.round(width / ratio));
        }
      };
      img.src = imageUrl;
      
      setSuccessMessage(t('upload_success', '✓ "{name}" uploaded successfully!').replace('{name}', file.name));
    };
    reader.readAsDataURL(file);
  };

  const updateWidth = (newWidth: number) => {
    setWidth(newWidth);
    if (keepAspectRatio && originalDimensions.width > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setHeight(Math.round(newWidth / ratio));
    }
  };

  const updateHeight = (newHeight: number) => {
    setHeight(newHeight);
    if (keepAspectRatio && originalDimensions.width > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const applyPreset = (preset: { width: number; height: number }) => {
    setWidth(preset.width);
    setHeight(preset.height);
  };

  const resizeImage = () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);
    
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const result = canvas.toDataURL('image/jpeg', quality / 100);
          setResizedImage(result);
          setSuccessMessage(t('resize_success', '✓ Image resized successfully!'));
          
          // Save to history
          const historyEntry: HistoryEntry = {
            id: Date.now(),
            originalImage: originalImage,
            resizedImage: result,
            width: width,
            height: height,
            fileName: fileName,
            timestamp: new Date().toISOString()
          };
          const newHistory = [historyEntry, ...history.slice(0, 9)];
          setHistory(newHistory);
          try {
            localStorage.setItem('image-resizer-history', JSON.stringify(newHistory));
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
    if (!resizedImage) return;
    
    const link = document.createElement('a');
    const name = fileName ? fileName.replace(/\.[^/.]+$/, "") : 'resized';
    link.download = `${name}-resized-${width}x${height}.jpg`;
    link.href = resizedImage;
    link.click();
    setSuccessMessage(t('download_success', '✓ Image downloaded successfully!'));
  };

  const shareImage = async () => {
    if (!resizedImage) return;
    
    try {
      const response = await fetch(resizedImage);
      const blob = await response.blob();
      const file = new File([blob], `${fileName || 'image'}-resized.jpg`, { type: 'image/jpeg' });
      
      if (navigator.share) {
        await navigator.share({
          title: t('share_title', 'Resized Image'),
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
    setResizedImage(null);
    setWidth(800);
    setHeight(600);
    setFileName('');
    setError(null);
    setSuccessMessage(null);
    setOriginalDimensions({ width: 0, height: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('image-resizer-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setOriginalImage(entry.originalImage);
    setResizedImage(entry.resizedImage);
    setWidth(entry.width);
    setHeight(entry.height);
    setFileName(entry.fileName);
    setActiveTab('resizer');
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
              <Maximize className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'Image Resizer')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Resize your images to any dimension online for free')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('resizer')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'resizer' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'resizer' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'resizer' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'resizer' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Maximize className="h-4 w-4" />
            {t('tab_resizer', 'Resizer')}
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
            
            {/* Resizer Tab */}
            {activeTab === 'resizer' && (
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
                      {t('upload_desc', 'Select an image file to resize (JPG, PNG, WebP supported)')}
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
                    {/* Original Info */}
                    {originalDimensions.width > 0 && (
                      <div className="flex items-center justify-center gap-4 text-sm" style={{ color: themeColors.text.secondary }}>
                        <span>{t('original_size', 'Original')}: {originalDimensions.width} × {originalDimensions.height}px</span>
                        <span className="w-1 h-1 rounded-full bg-gray-400" />
                        <span>{t('file_name', 'File')}: {fileName}</span>
                      </div>
                    )}

                    {/* Preset Sizes */}
                    <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <h4 className="font-semibold mb-3" style={{ color: themeColors.text.primary }}>{t('preset_sizes', 'Preset Sizes')}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {presetSizes.map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => applyPreset(preset)}
                            className="px-3 py-2 text-xs rounded-lg border text-center hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: themeColors.background, borderColor: themeColors.border, color: themeColors.text.primary }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = themeColors.primary;
                              e.currentTarget.style.backgroundColor = `${themeColors.primary}10`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = themeColors.border;
                              e.currentTarget.style.backgroundColor = themeColors.background;
                            }}
                          >
                            <div className="font-medium">{preset.width}×{preset.height}</div>
                            <div className="text-xs mt-0.5 truncate" style={{ color: themeColors.text.secondary }}>{preset.label.split('(')[0]}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dimensions Controls */}
                    <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold" style={{ color: themeColors.text.primary }}>{t('dimensions', 'Dimensions')}</h4>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={keepAspectRatio}
                            onChange={(e) => setKeepAspectRatio(e.target.checked)}
                            className="rounded"
                            style={{ accentColor: themeColors.primary }}
                          />
                          <span style={{ color: themeColors.text.secondary }}>{t('keep_ratio', 'Keep Aspect Ratio')}</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                            {t('width', 'Width')} (px)
                          </label>
                          <input
                            type="number"
                            value={width}
                            onChange={(e) => updateWidth(Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                            style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }}
                            min="1"
                            max="5000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                            {t('height', 'Height')} (px)
                          </label>
                          <input
                            type="number"
                            value={height}
                            onChange={(e) => updateHeight(Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                            style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }}
                            min="1"
                            max="5000"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quality Control */}
                    <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('quality', 'Quality')}: {quality}%
                      </label>
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
                        onClick={resizeImage}
                        disabled={isProcessing}
                        className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
                        style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            <span>{t('resizing', 'Resizing...')}</span>
                          </>
                        ) : (
                          <>
                            <Maximize className="h-4 w-4" />
                            <span>{t('resize', 'Resize Image')}</span>
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
                    {resizedImage && (
                      <div className="space-y-6">
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                            {t('resized_result', 'Resized Result')} ({width} × {height})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm mb-2" style={{ color: themeColors.text.secondary }}>{t('original', 'Original')}</p>
                              <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
                                <img src={originalImage} alt="Original" className="w-full h-auto max-h-32 object-contain" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm mb-2" style={{ color: themeColors.text.secondary }}>{t('resized', 'Resized')}</p>
                              <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
                                <img src={resizedImage} alt="Resized" className="w-full h-auto max-h-32 object-contain" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Size Info */}
                        <div className="flex items-center justify-center gap-4 text-xs" style={{ color: themeColors.text.secondary }}>
                          <span>{t('new_size', 'New Size')}: {width}×{height}px</span>
                          <span className="w-1 h-1 rounded-full bg-gray-400" />
                          <span>{t('quality', 'Quality')}: {quality}%</span>
                        </div>

                        {/* Download & Share Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={downloadImage}
                            className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: themeColors.success, color: '#fff' }}
                          >
                            <Download className="h-4 w-4" />
                            {t('download', 'Download Resized Image')}
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

                    {/* Resizing Tips */}
                    <div className="rounded-xl p-6" style={{ backgroundColor: `${themeColors.primary}10`, border: `1px solid ${themeColors.primary}30` }}>
                      <div className="flex items-center gap-2 mb-4">
                        <Info className="h-5 w-5" style={{ color: themeColors.primary }} />
                        <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('resize_tips', 'Resizing Tips')}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm" style={{ color: themeColors.text.secondary }}>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                          <span>{t('tip_1', 'Keep aspect ratio locked to avoid distortion')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                          <span>{t('tip_2', 'Use preset sizes for social media platforms')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                          <span>{t('tip_3', 'Higher quality = larger file size')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                          <span>{t('tip_4', 'PNG preserves transparency but larger size')}</span>
                        </div>
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
                        {t('resize_history', 'Resize History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_resizes', 'Your recent image resizes')}
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
                            <div className="flex gap-3 text-xs" style={{ color: themeColors.text.secondary }}>
                              <span>{entry.width}×{entry.height}px</span>
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
                      {t('no_history', 'No resize history yet')}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your resized images will appear here')}
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
