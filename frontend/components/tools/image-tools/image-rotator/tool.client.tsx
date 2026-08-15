
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';
// components/tools/image-tools/image-rotator/tool.client.tsx

import { useState, useRef, useEffect } from "react";
import { RotateCw, Download, Upload, RotateCcw, FlipHorizontal, FlipVertical, RotateCcw as RotateLeft, RotateCw as RotateRight, Undo2, CheckCircle, X, History, Share2, Trash2, Info, Image as ImageIcon, Maximize2 } from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

interface HistoryEntry {
  id: number;
  originalImage: string;
  rotatedImage: string;
  rotation: number;
  flippedHorizontal: boolean;
  flippedVertical: boolean;
  fileName: string;

  timestamp: string;
}

export default function ImageRotatorClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'image-tools' });
  const [mounted, setMounted] = useState(false);
  
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [rotatedImage, setRotatedImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flippedHorizontal, setFlippedHorizontal] = useState(false);
  const [flippedVertical, setFlippedVertical] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'rotator' | 'history'>('rotator');
  const [previewSize, setPreviewSize] = useState<'small' | 'medium' | 'large'>('medium');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `image_rotator.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem('image-rotator-history');
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

  const applyTransformations = () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);
    
    const img = new Image();
    img.onload = () => {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d')!;
      
      // Apply rotation
      let width = img.width;
      let height = img.height;
      let rotationRad = (rotation * Math.PI) / 180;
      
      if (rotation % 180 === 90) {
        canvas.width = height;
        canvas.height = width;
      } else {
        canvas.width = width;
        canvas.height = height;
      }
      
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotationRad);
      
      // Apply flip
      let scaleX = flippedHorizontal ? -1 : 1;
      let scaleY = flippedVertical ? -1 : 1;
      ctx.scale(scaleX, scaleY);
      
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      
      // Create a temporary canvas for final result
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height;
      const finalCtx = finalCanvas.getContext('2d')!;
      finalCtx.drawImage(canvas, 0, 0);
      
      setRotatedImage(finalCanvas.toDataURL('image/png'));
      setIsProcessing(false);
    };
    img.src = originalImage;
  };

  useEffect(() => {
    if (originalImage) {
      applyTransformations();
    }
  }, [rotation, flippedHorizontal, flippedVertical, originalImage]);

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
      setRotatedImage(imageUrl);
      setRotation(0);
      setFlippedHorizontal(false);
      setFlippedVertical(false);
      setSuccessMessage(t('upload_success', '✓ "{name}" uploaded successfully!').replace('{name}', file.name));
    };
    reader.readAsDataURL(file);
  };

  const handleRotate = (angle: number) => {
    setRotation((rotation + angle) % 360);
  };

  const handleFlipHorizontal = () => {
    setFlippedHorizontal(!flippedHorizontal);
  };

  const handleFlipVertical = () => {
    setFlippedVertical(!flippedVertical);
  };

  const resetTransformations = () => {
    setRotation(0);
    setFlippedHorizontal(false);
    setFlippedVertical(false);
  };

  const downloadImage = () => {
    if (!rotatedImage) return;
    
    const link = document.createElement('a');
    const name = fileName ? fileName.replace(/\.[^/.]+$/, "") : 'rotated';
    let suffix = '';
    if (rotation !== 0) suffix += `-${rotation}deg`;
    if (flippedHorizontal) suffix += '-flip-h';
    if (flippedVertical) suffix += '-flip-v';
    link.download = `${name}${suffix}.png`;
    link.href = rotatedImage;
    link.click();
    setSuccessMessage(t('download_success', '✓ Image downloaded successfully!'));
  };

  const shareImage = async () => {
    if (!rotatedImage) return;
    
    try {
      const response = await fetch(rotatedImage);
      const blob = await response.blob();
      const file = new File([blob], `${fileName || 'image'}-rotated.png`, { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          title: t('share_title', 'Rotated Image'),
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
    setRotatedImage(null);
    setRotation(0);
    setFlippedHorizontal(false);
    setFlippedVertical(false);
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
      localStorage.removeItem('image-rotator-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setOriginalImage(entry.originalImage);
    setRotatedImage(entry.rotatedImage);
    setRotation(entry.rotation);
    setFlippedHorizontal(entry.flippedHorizontal);
    setFlippedVertical(entry.flippedVertical);
    setFileName(entry.fileName);
    setActiveTab('rotator');
  };

  const saveToHistory = () => {
    if (!originalImage || !rotatedImage) return;
    
    const historyEntry: HistoryEntry = {
      id: Date.now(),
      originalImage: originalImage,
      rotatedImage: rotatedImage,
      rotation: rotation,
      flippedHorizontal: flippedHorizontal,
      flippedVertical: flippedVertical,
      fileName: fileName,
      timestamp: new Date().toISOString()
    };
    const newHistory = [historyEntry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('image-rotator-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
    setSuccessMessage(t('saved_to_history', '✓ Effect saved to history!'));
  };

  const previewSizes = {
    small: 'max-h-32',
    medium: 'max-h-48',
    large: 'max-h-64'
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
              <RotateCw className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'Image Rotator')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Rotate and flip your images with precision control')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('rotator')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'rotator' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'rotator' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'rotator' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'rotator' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <RotateCw className="h-4 w-4" />
            {t('tab_rotator', 'Rotator')}
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
            
            {/* Rotator Tab */}
            {activeTab === 'rotator' && (
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
                      {t('upload_desc', 'Select an image to rotate or flip')}
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
                    {/* Preview Size Selector */}
                    <div className="flex justify-end gap-2">
                      {['small', 'medium', 'large'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setPreviewSize(size as any)}
                          className={`px-3 py-1 text-xs rounded-lg transition-all ${previewSize === size ? 'scale-105' : 'hover:scale-102'}`}
                          style={{ 
                            backgroundColor: previewSize === size ? `${themeColors.primary}10` : themeColors.background,
                            border: `1px solid ${previewSize === size ? themeColors.primary : themeColors.border}`,
                            color: previewSize === size ? themeColors.primary : themeColors.text.secondary
                          }}
                        >
                          {t(size, size)}
                        </button>
                      ))}
                    </div>

                    {/* Image Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <h3 className="font-semibold mb-2" style={{ color: themeColors.text.primary }}>{t('original', 'Original Image')}</h3>
                        <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
                          <img src={originalImage} alt="Original" className={`w-full h-auto ${previewSizes[previewSize]} object-contain mx-auto`} />
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold mb-2" style={{ color: themeColors.text.primary }}>{t('transformed', 'Transformed Image')}</h3>
                        <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
                          <img src={rotatedImage || originalImage} alt="Transformed" className={`w-full h-auto ${previewSizes[previewSize]} object-contain mx-auto`} />
                        </div>
                      </div>
                    </div>

                    {/* Rotation Controls */}
                    <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <h4 className="font-semibold mb-4" style={{ color: themeColors.text.primary }}>{t('rotation_controls', 'Rotation Controls')}</h4>
                      <div className="flex flex-wrap gap-3 justify-center">
                        <button
                          onClick={() => handleRotate(-90)}
                          disabled={isProcessing}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
                          style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.primary }}
                        >
                          <RotateLeft className="h-4 w-4" />
                          {t('rotate_left', 'Rotate Left 90°')}
                        </button>
                        <button
                          onClick={() => handleRotate(90)}
                          disabled={isProcessing}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
                          style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.primary }}
                        >
                          <RotateRight className="h-4 w-4" />
                          {t('rotate_right', 'Rotate Right 90°')}
                        </button>
                        <button
                          onClick={() => handleRotate(180)}
                          disabled={isProcessing}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
                          style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.primary }}
                        >
                          <RotateCw className="h-4 w-4" />
                          {t('rotate_180', 'Rotate 180°')}
                        </button>
                      </div>
                    </div>

                    {/* Flip Controls */}
                    <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <h4 className="font-semibold mb-4" style={{ color: themeColors.text.primary }}>{t('flip_controls', 'Flip Controls')}</h4>
                      <div className="flex flex-wrap gap-3 justify-center">
                        <button
                          onClick={handleFlipHorizontal}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 ${flippedHorizontal ? 'ring-2' : ''}`}
                          style={{ 
                            backgroundColor: flippedHorizontal ? `${themeColors.primary}10` : themeColors.background,
                            border: `1px solid ${flippedHorizontal ? themeColors.primary : themeColors.border}`,
                            color: flippedHorizontal ? themeColors.primary : themeColors.text.primary
                          }}
                        >
                          <FlipHorizontal className="h-4 w-4" />
                          {t('flip_horizontal', 'Flip Horizontal')}
                        </button>
                        <button
                          onClick={handleFlipVertical}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 ${flippedVertical ? 'ring-2' : ''}`}
                          style={{ 
                            backgroundColor: flippedVertical ? `${themeColors.primary}10` : themeColors.background,
                            border: `1px solid ${flippedVertical ? themeColors.primary : themeColors.border}`,
                            color: flippedVertical ? themeColors.primary : themeColors.text.primary
                          }}
                        >
                          <FlipVertical className="h-4 w-4" />
                          {t('flip_vertical', 'Flip Vertical')}
                        </button>
                      </div>
                    </div>

                    {/* Custom Rotation Slider */}
                    <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                        {t('custom_rotation', 'Custom Rotation')}: {rotation}°
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={rotation}
                        onChange={(e) => setRotation(parseInt(e.target.value))}
                        className="w-full"
                        style={{ accentColor: themeColors.primary }}
                        disabled={isProcessing}
                      />
                      <div className="flex justify-between text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                        <span>0°</span>
                        <span>90°</span>
                        <span>180°</span>
                        <span>270°</span>
                        <span>360°</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={resetTransformations}
                        className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
                        style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                      >
                        <Undo2 className="h-4 w-4" />
                        {t('reset', 'Reset Transformations')}
                      </button>
                      <button
                        onClick={downloadImage}
                        disabled={!rotatedImage || isProcessing}
                        className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
                        style={{ backgroundColor: themeColors.success, color: '#fff' }}
                      >
                        <Download className="h-4 w-4" />
                        {t('download', 'Download Image')}
                      </button>
                      <button
                        onClick={shareImage}
                        disabled={!rotatedImage || isProcessing}
                        className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
                        style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                      >
                        <Share2 className="h-4 w-4" />
                        {t('share', 'Share')}
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

                    {/* Save to History Button */}
                    <button
                      onClick={saveToHistory}
                      className="w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
                      style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary, border: `1px solid ${themeColors.primary}30` }}
                    >
                      <History className="h-4 w-4" />
                      {t('save_to_history', 'Save This Transformation to History')}
                    </button>

                    {/* In-content Ad */}
                    <CentralAd position="in-content" size="rectangle" />

                    {/* Rotation Tips */}
                    <div className="rounded-xl p-6" style={{ backgroundColor: `${themeColors.primary}10`, border: `1px solid ${themeColors.primary}30` }}>
                      <div className="flex items-center gap-2 mb-4">
                        <Info className="h-5 w-5" style={{ color: themeColors.primary }} />
                        <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('rotation_tips', 'Rotation Tips')}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm" style={{ color: themeColors.text.secondary }}>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                          <span>{t('tip_1', 'Use 90° increments for quick orientation fixes')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                          <span>{t('tip_2', 'Combine rotation with flip for mirror effects')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                          <span>{t('tip_3', 'Custom rotation allows fine-tuning for crooked images')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                          <span>{t('tip_4', 'PNG format preserves transparency after rotation')}</span>
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
                        {t('rotation_history', 'Rotation History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_rotations', 'Your recent image rotations and flips')}
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
                              <RotateCw className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.fileName}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {entry.rotation !== 0 && (
                                <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                                  {entry.rotation}°
                                </span>
                              )}
                              {entry.flippedHorizontal && (
                                <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                                  {t('flip_h', 'Flip H')}
                                </span>
                              )}
                              {entry.flippedVertical && (
                                <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                                  {t('flip_v', 'Flip V')}
                                </span>
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
                      {t('no_history', 'No rotation history yet')}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your rotated images will appear here')}
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
