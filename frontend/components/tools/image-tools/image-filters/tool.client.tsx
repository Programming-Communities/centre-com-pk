
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';
// components/tools/image-tools/image-filters/tool.client.tsx

import { useState, useRef, useEffect } from "react";
import { Download, Upload, Sliders, Sparkles, CheckCircle, X, History, Share2, Trash2, Info, Image as ImageIcon, Zap, Palette, Contrast, Sun, Droplet, Eye, Filter } from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
  sepia: number;
  blur: number;
  hue: number;
}

interface HistoryEntry {
  id: number;
  originalImage: string;
  filteredImage: string;
  filters: FilterSettings;
  fileName: string;
  timestamp: string;
}

const presetFilters = [
  { name: "normal", label: "Normal", filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0, hue: 0 }, icon: "🎨" },
  { name: "grayscale", label: "Grayscale", filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 100, sepia: 0, blur: 0, hue: 0 }, icon: "⚫" },
  { name: "sepia", label: "Sepia", filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 100, blur: 0, hue: 0 }, icon: "🟤" },
  { name: "vintage", label: "Vintage", filters: { brightness: 90, contrast: 110, saturation: 80, grayscale: 0, sepia: 40, blur: 0.5, hue: 0 }, icon: "📷" },
  { name: "cool", label: "Cool", filters: { brightness: 110, contrast: 90, saturation: 120, grayscale: 0, sepia: 0, blur: 0, hue: 180 }, icon: "❄️" },
  { name: "warm", label: "Warm", filters: { brightness: 110, contrast: 110, saturation: 120, grayscale: 0, sepia: 20, blur: 0, hue: 30 }, icon: "🔥" },
  { name: "dramatic", label: "Dramatic", filters: { brightness: 80, contrast: 150, saturation: 110, grayscale: 0, sepia: 0, blur: 0, hue: 0 }, icon: "🎭" },
  { name: "soft", label: "Soft", filters: { brightness: 105, contrast: 95, saturation: 90, grayscale: 0, sepia: 0, blur: 2, hue: 0 }, icon: "🌸" },
];

export default function ImageFiltersClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
 
  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'image-tools' });
  const [mounted, setMounted] = useState(false);
  
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [filteredImage, setFilteredImage] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    grayscale: 0,
    sepia: 0,
    blur: 0,
    hue: 0,
  });
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'filters' | 'history'>('filters');
  const [selectedPreset, setSelectedPreset] = useState<string>('normal');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `image_filters.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem('image-filters-history');
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

  const applyFilters = () => {
    if (!originalImage) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;

        const filterString = `
          brightness(${filters.brightness}%)
          contrast(${filters.contrast}%)
          saturate(${filters.saturation}%)
          grayscale(${filters.grayscale}%)
          sepia(${filters.sepia}%)
          blur(${filters.blur}px)
          hue-rotate(${filters.hue}deg)
        `.replace(/\s+/g, ' ').trim();

        ctx.filter = filterString;
        ctx.drawImage(img, 0, 0);
        
        const result = canvas.toDataURL('image/png');
        setFilteredImage(result);
      };
      img.src = originalImage;
    }, 100);
  };

  useEffect(() => {
    if (originalImage) {
      applyFilters();
    }
  }, [filters, originalImage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setFilteredImage(imageUrl);
      setSuccessMessage(t('upload_success', '✓ "{name}" uploaded successfully!').replace('{name}', file.name));
    };
    reader.readAsDataURL(file);
  };

  const updateFilter = (key: keyof FilterSettings, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSelectedPreset('custom');
  };

  const applyPreset = (preset: typeof presetFilters[0]) => {
    setFilters(preset.filters);
    setSelectedPreset(preset.name);
    setSuccessMessage(t('preset_applied', `✓ ${preset.label} filter applied!`));
  };

  const downloadImage = () => {
    if (!filteredImage) return;
    
    const link = document.createElement('a');
    const name = fileName ? fileName.replace(/\.[^/.]+$/, "") : 'filtered';
    link.download = `${name}-filtered.png`;
    link.href = filteredImage;
    link.click();
    setSuccessMessage(t('download_success', '✓ Image downloaded successfully!'));
  };

  const shareImage = async () => {
    if (!filteredImage) return;
    
    try {
      const response = await fetch(filteredImage);
      const blob = await response.blob();
      const file = new File([blob], `${fileName || 'image'}-filtered.png`, { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          title: t('share_title', 'Filtered Image'),
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

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      grayscale: 0,
      sepia: 0,
      blur: 0,
      hue: 0,
    });
    setSelectedPreset('normal');
    setFilteredImage(originalImage);
    setSuccessMessage(t('filters_reset', '✓ Filters reset to default!'));
  };

  const resetTool = () => {
    setOriginalImage(null);
    setFilteredImage(null);
    resetFilters();
    setFileName('');
    setError(null);
    setSuccessMessage(null);
    setSelectedPreset('normal');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('image-filters-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setOriginalImage(entry.originalImage);
    setFilteredImage(entry.filteredImage);
    setFilters(entry.filters);
    setFileName(entry.fileName);
    setActiveTab('filters');
    setSelectedPreset('custom');
  };

  // Save to history when filter is applied
  const saveToHistory = () => {
    if (!originalImage || !filteredImage) return;
    
    const historyEntry: HistoryEntry = {
      id: Date.now(),
      originalImage: originalImage,
      filteredImage: filteredImage,
      filters: { ...filters },
      fileName: fileName,
      timestamp: new Date().toISOString()
    };
    const newHistory = [historyEntry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('image-filters-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

  const filterControls = [
    { key: 'brightness' as const, label: t('brightness', 'Brightness'), icon: Sun, min: 0, max: 200, unit: '%' },
    { key: 'contrast' as const, label: t('contrast', 'Contrast'), icon: Contrast, min: 0, max: 200, unit: '%' },
    { key: 'saturation' as const, label: t('saturation', 'Saturation'), icon: Droplet, min: 0, max: 200, unit: '%' },
    { key: 'grayscale' as const, label: t('grayscale', 'Grayscale'), icon: Eye, min: 0, max: 100, unit: '%' },
    { key: 'sepia' as const, label: t('sepia', 'Sepia'), icon: Palette, min: 0, max: 100, unit: '%' },
    { key: 'blur' as const, label: t('blur', 'Blur'), icon: Filter, min: 0, max: 10, unit: 'px' },
    { key: 'hue' as const, label: t('hue', 'Hue Rotate'), icon: Zap, min: 0, max: 360, unit: '°' },
  ];

  const getFilterStyle = () => {
    return `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
      blur(${filters.blur}px)
      hue-rotate(${filters.hue}deg)
    `.replace(/\s+/g, ' ').trim();
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
              <Sliders className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'Image Filters')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Apply beautiful filters and adjustments to your photos')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('filters')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'filters' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'filters' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'filters' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'filters' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Sliders className="h-4 w-4" />
            {t('tab_filters', 'Filters')}
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
            
            {/* Filters Tab */}
            {activeTab === 'filters' && (
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
                      {t('upload_desc', 'Select an image to apply filters')}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
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
                    {/* Image Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <h3 className="font-semibold mb-2" style={{ color: themeColors.text.primary }}>{t('original', 'Original Image')}</h3>
                        <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
                          <img src={originalImage} alt="Original" className="w-full h-auto max-h-48 object-contain" />
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold mb-2" style={{ color: themeColors.text.primary }}>{t('filtered', 'Filtered Image')}</h3>
                        <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
                          <img 
                            src={filteredImage || originalImage} 
                            alt="Filtered" 
                            className="w-full h-auto max-h-48 object-contain"
                            style={{ filter: getFilterStyle() }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preset Filters */}
                    <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                        <Sparkles className="h-4 w-4" style={{ color: themeColors.primary }} />
                        {t('quick_presets', 'Quick Presets')}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {presetFilters.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => applyPreset(preset)}
                            className={`p-3 rounded-lg border text-center transition-all ${selectedPreset === preset.name ? 'scale-105' : 'hover:scale-102'}`}
                            style={{ 
                              backgroundColor: selectedPreset === preset.name ? `${themeColors.primary}10` : themeColors.background,
                              borderColor: selectedPreset === preset.name ? themeColors.primary : themeColors.border,
                              color: selectedPreset === preset.name ? themeColors.primary : themeColors.text.primary
                            }}
                          >
                            <div className="text-xl mb-1">{preset.icon}</div>
                            <div className="text-sm font-medium">{t(preset.name, preset.label)}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filter Controls */}
                    <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <h4 className="font-semibold mb-4" style={{ color: themeColors.text.primary }}>{t('adjustments', 'Adjustments')}</h4>
                      <div className="space-y-4">
                        {filterControls.map((control) => {
                          const Icon = control.icon;
                          const value = filters[control.key];
                          return (
                            <div key={control.key}>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                                  <Icon className="h-3 w-3" style={{ color: themeColors.primary }} />
                                  {control.label}
                                </label>
                                <span className="text-sm" style={{ color: themeColors.primary }}>{value}{control.unit}</span>
                              </div>
                              <input
                                type="range"
                                min={control.min}
                                max={control.max}
                                value={value}
                                onChange={(e) => updateFilter(control.key, parseInt(e.target.value))}
                                className="w-full"
                                style={{ accentColor: themeColors.primary }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={downloadImage}
                        disabled={!filteredImage}
                        className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
                        style={{ backgroundColor: themeColors.success, color: '#fff' }}
                      >
                        <Download className="h-4 w-4" />
                        {t('download', 'Download Filtered Image')}
                      </button>
                      <button
                        onClick={shareImage}
                        disabled={!filteredImage}
                        className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
                        style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                      >
                        <Share2 className="h-4 w-4" />
                        {t('share', 'Share')}
                      </button>
                      <button
                        onClick={resetFilters}
                        className="px-4 py-3 rounded-lg font-semibold flex items-center gap-2 transition-opacity hover:opacity-80"
                        style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                      >
                        <RefreshCw className="h-4 w-4" />
                        {t('reset_filters', 'Reset Filters')}
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
                      {t('save_to_history', 'Save This Effect to History')}
                    </button>

                    {/* In-content Ad */}
                    <CentralAd position="in-content" size="rectangle" />

                    {/* Filter Tips */}
                    <div className="rounded-xl p-6" style={{ backgroundColor: `${themeColors.primary}10`, border: `1px solid ${themeColors.primary}30` }}>
                      <div className="flex items-center gap-2 mb-4">
                        <Info className="h-5 w-5" style={{ color: themeColors.primary }} />
                        <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('filter_tips', 'Filter Tips')}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm" style={{ color: themeColors.text.secondary }}>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                          <span>{t('tip_1', 'Combine multiple filters for unique effects')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                          <span>{t('tip_2', 'Use presets as starting point for custom edits')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                          <span>{t('tip_3', 'Save your favorite combinations to history')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                          <span>{t('tip_4', 'Subtle adjustments often look more natural')}</span>
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
                        {t('filter_history', 'Filter History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_filters', 'Your recently saved filter combinations')}
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
                              <Sliders className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.fileName}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                                B:{entry.filters.brightness}%
                              </span>
                              <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                                C:{entry.filters.contrast}%
                              </span>
                              <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                                S:{entry.filters.saturation}%
                              </span>
                              {entry.filters.grayscale > 0 && (
                                <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                                  G:{entry.filters.grayscale}%
                                </span>
                              )}
                              {entry.filters.sepia > 0 && (
                                <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                                  Sep:{entry.filters.sepia}%
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
                      {t('no_history', 'No filter history yet')}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your saved filter combinations will appear here')}
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

// Helper component for RefreshCw icon
function RefreshCw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );

}
