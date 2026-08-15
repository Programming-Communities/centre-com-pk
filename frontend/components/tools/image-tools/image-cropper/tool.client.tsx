
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';
// components/tools/image-tools/image-cropper/tool.client.tsx

import { useState, useRef, useEffect } from "react";
import { Upload, Download, RotateCcw, Crop, Sparkles, CheckCircle, X, History, Share2, Trash2, Info, FileImage, Maximize2, Minimize2, Square, Image as ImageIcon } from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

interface HistoryEntry {
  id: number;
  originalImage: string;
  croppedImage: string;
  cropSettings: { x: number; y: number; width: number; height: number };
  fileName: string;
  timestamp: string;
}

interface AspectRatio {
  label: string;
  value: number | null;
  width: number;

  height: number;
}

const aspectRatios: AspectRatio[] = [
  { label: "Free", value: null, width: 0, height: 0 },
  { label: "1:1 (Square)", value: 1, width: 1, height: 1 },
  { label: "4:3 (Standard)", value: 4/3, width: 4, height: 3 },
  { label: "16:9 (Widescreen)", value: 16/9, width: 16, height: 9 },
  { label: "3:2 (Photo)", value: 3/2, width: 3, height: 2 },
  { label: "2:3 (Portrait)", value: 2/3, width: 2, height: 3 },
  { label: "9:16 (Vertical)", value: 9/16, width: 9, height: 16 },
];

export default function ImageCropperClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'image-tools' });
  const [mounted, setMounted] = useState(false);
  
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'cropper' | 'history'>('cropper');
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `image_cropper.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem('image-cropper-history');
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
      setOriginalImage(e.target?.result as string);
      setCroppedImage(null);
      setCrop({ x: 0, y: 0, width: 100, height: 100 });
      setSelectedRatio(null);
      setSuccessMessage(t('upload_success', '✓ "{name}" uploaded successfully!').replace('{name}', file.name));
    };
    reader.readAsDataURL(file);
  };

  const applyAspectRatio = (ratio: AspectRatio) => {
    setSelectedRatio(ratio);
    
    if (ratio.value) {
      const targetRatio = ratio.value;
      let newWidth = crop.width;
      let newHeight = crop.height;
      
      if (crop.width / crop.height > targetRatio) {
        newHeight = crop.width / targetRatio;
      } else {
        newWidth = crop.height * targetRatio;
      }
      
      if (newWidth > 100) {
        newWidth = 100;
        newHeight = newWidth / targetRatio;
      }
      if (newHeight > 100) {
        newHeight = 100;
        newWidth = newHeight * targetRatio;
      }
      
      setCrop(prev => ({
        ...prev,
        width: Math.max(10, Math.min(100, newWidth)),
        height: Math.max(10, Math.min(100, newHeight))
      }));
    }
  };

  const resetCrop = () => {
    setCrop({ x: 0, y: 0, width: 100, height: 100 });
    setSelectedRatio(null);
  };

  const cropImage = () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);
    
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const actualCrop = {
          x: (crop.x / 100) * img.width,
          y: (crop.y / 100) * img.height,
          width: (crop.width / 100) * img.width,
          height: (crop.height / 100) * img.height
        };
        
        canvas.width = actualCrop.width;
        canvas.height = actualCrop.height;
        
        if (ctx) {
          ctx.drawImage(
            img,
            actualCrop.x, actualCrop.y, actualCrop.width, actualCrop.height,
            0, 0, actualCrop.width, actualCrop.height
          );
          const result = canvas.toDataURL('image/jpeg', 0.92);
          setCroppedImage(result);
          setSuccessMessage(t('crop_success', '✓ Image cropped successfully!'));
          
          // Save to history
          const historyEntry: HistoryEntry = {
            id: Date.now(),
            originalImage: originalImage,
            croppedImage: result,
            cropSettings: { ...crop },
            fileName: fileName,
            timestamp: new Date().toISOString()
          };
          const newHistory = [historyEntry, ...history.slice(0, 9)];
          setHistory(newHistory);
          try {
            localStorage.setItem('image-cropper-history', JSON.stringify(newHistory));
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
    if (!croppedImage) return;
    
    const link = document.createElement('a');
    const name = fileName ? fileName.replace(/\.[^/.]+$/, "") : 'cropped';
    link.download = `${name}-cropped.jpg`;
    link.href = croppedImage;
    link.click();
    setSuccessMessage(t('download_success', '✓ Image downloaded successfully!'));
  };

  const shareImage = async () => {
    if (!croppedImage) return;
    
    try {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], `${fileName || 'image'}-cropped.jpg`, { type: 'image/jpeg' });
      
      if (navigator.share) {
        await navigator.share({
          title: t('share_title', 'Cropped Image'),
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
    setCroppedImage(null);
    setCrop({ x: 0, y: 0, width: 100, height: 100 });
    setSelectedRatio(null);
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
      localStorage.removeItem('image-cropper-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setOriginalImage(entry.originalImage);
    setCroppedImage(entry.croppedImage);
    setCrop(entry.cropSettings);
    setFileName(entry.fileName);
    setActiveTab('cropper');
  };

  const handleCropChange = (key: string, value: number) => {
    setCrop(prev => ({ ...prev, [key]: value }));
    setSelectedRatio(null);
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
              <Crop className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'Image Cropper')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Crop images to focus on specific areas')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('cropper')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'cropper' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'cropper' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'cropper' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'cropper' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Crop className="h-4 w-4" />
            {t('tab_cropper', 'Cropper')}
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
            
            {/* Cropper Tab */}
            {activeTab === 'cropper' && (
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
                      {t('upload_desc', 'Select an image to crop')}
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
                    {/* Aspect Ratio Presets */}
                    <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <label className="block text-sm font-medium mb-3" style={{ color: themeColors.text.primary }}>
                        {t('aspect_ratios', 'Aspect Ratios')}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {aspectRatios.map((ratio) => (
                          <button
                            key={ratio.label}
                            onClick={() => applyAspectRatio(ratio)}
                            className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${selectedRatio?.label === ratio.label ? 'scale-105' : 'hover:scale-102'}`}
                            style={{ 
                              backgroundColor: selectedRatio?.label === ratio.label ? `${themeColors.primary}10` : themeColors.background,
                              borderColor: selectedRatio?.label === ratio.label ? themeColors.primary : themeColors.border,
                              color: selectedRatio?.label === ratio.label ? themeColors.primary : themeColors.text.primary
                            }}
                          >
                            {ratio.label}
                          </button>
                        ))}
                        <button
                          onClick={resetCrop}
                          className="px-3 py-1.5 text-sm rounded-lg border transition-colors hover:opacity-80"
                          style={{ backgroundColor: themeColors.background, borderColor: themeColors.border, color: themeColors.text.secondary }}
                        >
                          {t('reset', 'Reset Crop')}
                        </button>
                      </div>
                    </div>

                    {/* Crop Controls */}
                    <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.primary }}>
                            {t('x_position', 'X Position')}: {Math.round(crop.x)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={crop.x}
                            onChange={(e) => handleCropChange('x', Number(e.target.value))}
                            className="w-full"
                            style={{ accentColor: themeColors.primary }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.primary }}>
                            {t('y_position', 'Y Position')}: {Math.round(crop.y)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={crop.y}
                            onChange={(e) => handleCropChange('y', Number(e.target.value))}
                            className="w-full"
                            style={{ accentColor: themeColors.primary }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.primary }}>
                            {t('width', 'Width')}: {Math.round(crop.width)}%
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={crop.width}
                            onChange={(e) => handleCropChange('width', Number(e.target.value))}
                            className="w-full"
                            style={{ accentColor: themeColors.primary }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.primary }}>
                            {t('height', 'Height')}: {Math.round(crop.height)}%
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={crop.height}
                            onChange={(e) => handleCropChange('height', Number(e.target.value))}
                            className="w-full"
                            style={{ accentColor: themeColors.primary }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image Preview with Crop Overlay */}
                    <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <h4 className="font-semibold mb-3" style={{ color: themeColors.text.primary }}>{t('preview', 'Crop Preview')}</h4>
                      <div className="relative w-full border rounded-lg overflow-hidden" style={{ borderColor: themeColors.border }}>
                        <img
                          ref={imgRef}
                          src={originalImage}
                          alt="Original"
                          className="w-full h-auto max-h-96 object-contain"
                        />
                        <div 
                          className="absolute border-2 border-red-500 bg-red-500 bg-opacity-20 cursor-move"
                          style={{
                            left: `${crop.x}%`,
                            top: `${crop.y}%`,
                            width: `${crop.width}%`,
                            height: `${crop.height}%`
                          }}
                        />
                      </div>
                      <p className="text-xs mt-2 text-center" style={{ color: themeColors.text.secondary }}>
                        {t('preview_note', 'The red box shows the area that will be cropped')}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={cropImage}
                        disabled={isProcessing}
                        className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
                        style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            <span>{t('cropping', 'Cropping...')}</span>
                          </>
                        ) : (
                          <>
                            <Crop className="h-4 w-4" />
                            <span>{t('crop', 'Crop Image')}</span>
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
                    {croppedImage && (
                      <div className="space-y-6">
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-4" style={{ color: themeColors.text.primary }}>{t('cropped_result', 'Cropped Result')}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm mb-2" style={{ color: themeColors.text.secondary }}>{t('original', 'Original')}</p>
                              <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
                                <img src={originalImage} alt="Original" className="w-full h-auto max-h-32 object-contain" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm mb-2" style={{ color: themeColors.text.secondary }}>{t('cropped', 'Cropped')}</p>
                              <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
                                <img src={croppedImage} alt="Cropped" className="w-full h-auto max-h-32 object-contain" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Crop Info */}
                        <div className="flex items-center justify-center gap-4 text-xs" style={{ color: themeColors.text.secondary }}>
                          <span className="flex items-center gap-1"><Square className="h-3 w-3" /> {Math.round(crop.width)}% × {Math.round(crop.height)}%</span>
                          <span className="flex items-center gap-1"><Maximize2 className="h-3 w-3" /> {t('area', 'Area')}: {Math.round(crop.width * crop.height / 100)}%</span>
                        </div>

                        {/* Download & Share Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={downloadImage}
                            className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: themeColors.success, color: '#fff' }}
                          >
                            <Download className="h-4 w-4" />
                            {t('download', 'Download Cropped Image')}
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

                    {/* Cropping Tips */}
                    <div className="rounded-xl p-6" style={{ backgroundColor: `${themeColors.primary}10`, border: `1px solid ${themeColors.primary}30` }}>
                      <div className="flex items-center gap-2 mb-4">
                        <Info className="h-5 w-5" style={{ color: themeColors.primary }} />
                        <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('cropping_tips', 'Cropping Tips')}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm" style={{ color: themeColors.text.secondary }}>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                          <span>{t('tip_1', 'Use aspect ratios for social media posts (1:1, 16:9, 9:16)')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                          <span>{t('tip_2', 'Keep important subjects in the center of the crop area')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                          <span>{t('tip_3', 'Maintain original quality by downloading as PNG')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                          <span>{t('tip_4', 'Preview the crop before finalizing')}</span>
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
                        {t('cropping_history', 'Cropping History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_crops', 'Your recent image crops')}
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
                              <Crop className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.fileName}
                              </span>
                            </div>
                            <div className="flex gap-3 text-xs" style={{ color: themeColors.text.secondary }}>
                              <span>Crop: {Math.round(entry.cropSettings.width)}% × {Math.round(entry.cropSettings.height)}%</span>
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
                      {t('no_history', 'No cropping history yet')}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your cropped images will appear here')}
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
