
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';
// components/tools/image-tools/photo-collage/tool.client.tsx

import { useState, useRef, useEffect } from "react";
import { Download, Upload, Layout, Image as ImageIcon, Plus, X, Sparkles, CheckCircle, History, Share2, Trash2, Info, Grid, Maximize2, Minimize2, RefreshCw, Palette } from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

interface CollageImage {
  id: string;
  src: string;
  file: File;
  name: string;
}

interface HistoryEntry {
  id: number;
  collageData: string;
  layoutId: string;
  spacing: number;
  borderRadius: number;
  imagesCount: number;

  timestamp: string;
}

const collageLayouts = [
  { id: '2vertical', name: '2 Vertical', cols: 1, rows: 2, template: 'grid-rows-2', icon: '▯', maxImages: 2 },
  { id: '2horizontal', name: '2 Horizontal', cols: 2, rows: 1, template: 'grid-cols-2', icon: '▭', maxImages: 2 },
  { id: '3vertical', name: '3 Vertical', cols: 1, rows: 3, template: 'grid-rows-3', icon: '▮', maxImages: 3 },
  { id: '3horizontal', name: '3 Horizontal', cols: 3, rows: 1, template: 'grid-cols-3', icon: '▬', maxImages: 3 },
  { id: '4square', name: '4 Square', cols: 2, rows: 2, template: 'grid-cols-2 grid-rows-2', icon: '◫', maxImages: 4 },
  { id: '6grid', name: '6 Grid', cols: 3, rows: 2, template: 'grid-cols-3 grid-rows-2', icon: '⬚', maxImages: 6 },
  { id: '9grid', name: '9 Grid', cols: 3, rows: 3, template: 'grid-cols-3 grid-rows-3', icon: '⬛', maxImages: 9 },
];

const backgroundColors = [
  { name: 'white', value: '#ffffff', label: 'White' },
  { name: 'black', value: '#000000', label: 'Black' },
  { name: 'gray', value: '#808080', label: 'Gray' },
  { name: 'blue', value: '#3b82f6', label: 'Blue' },
  { name: 'green', value: '#10b981', label: 'Green' },
  { name: 'red', value: '#ef4444', label: 'Red' },
];

export default function PhotoCollageClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'image-tools' });
  const [mounted, setMounted] = useState(false);
  
  const [images, setImages] = useState<CollageImage[]>([]);
  const [selectedLayout, setSelectedLayout] = useState(collageLayouts[0]);
  const [collageData, setCollageData] = useState<string | null>(null);
  const [spacing, setSpacing] = useState(4);
  const [borderRadius, setBorderRadius] = useState(8);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'maker' | 'history'>('maker');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `photo_collage.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem('photo-collage-history');
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
    const files = Array.from(event.target.files || []);
    const maxImages = selectedLayout.maxImages;
    
    if (images.length + files.length > maxImages) {
      setError(t('too_many_images', `You can only add up to ${maxImages} images for this layout`));
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          setError(t('file_too_large', 'File size too large. Maximum 5MB allowed.'));
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: CollageImage = {
            id: Math.random().toString(36).substr(2, 9),
            src: e.target?.result as string,
            file: file,
            name: file.name
          };
          setImages(prev => [...prev, newImage]);
          setSuccessMessage(t('upload_success', `✓ "${file.name}" uploaded successfully!`));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (id: string) => {
    const removedImage = images.find(img => img.id === id);
    setImages(prev => prev.filter(img => img.id !== id));
    if (removedImage) {
      setSuccessMessage(t('image_removed', `✓ Image removed`));
    }
  };

  const generateCollage = () => {
    if (images.length === 0) {
      setError(t('no_images', 'Please add at least one image to create a collage'));
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError(t('error', 'Failed to create collage'));
      setIsProcessing(false);
      return;
    }
    
    const cellWidth = 400;
    const cellHeight = 300;
    canvas.width = selectedLayout.cols * cellWidth + (selectedLayout.cols - 1) * spacing;
    canvas.height = selectedLayout.rows * cellHeight + (selectedLayout.rows - 1) * spacing;
    
    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let loadedImages = 0;
    const totalImages = Math.min(images.length, selectedLayout.cols * selectedLayout.rows);
    
    for (let row = 0; row < selectedLayout.rows; row++) {
      for (let col = 0; col < selectedLayout.cols; col++) {
        const imageIndex = row * selectedLayout.cols + col;
        if (imageIndex < images.length) {
          const img = new Image();
          img.onload = () => {
            const x = col * (cellWidth + spacing);
            const y = row * (cellHeight + spacing);
            
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, cellWidth, cellHeight, borderRadius);
            ctx.clip();
            ctx.drawImage(img, x, y, cellWidth, cellHeight);
            ctx.restore();
            
            loadedImages++;
            if (loadedImages === totalImages) {
              const result = canvas.toDataURL('image/png');
              setCollageData(result);
              setIsProcessing(false);
              setSuccessMessage(t('collage_created', '✓ Collage created successfully!'));
              
              // Save to history
              const historyEntry: HistoryEntry = {
                id: Date.now(),
                collageData: result,
                layoutId: selectedLayout.id,
                spacing: spacing,
                borderRadius: borderRadius,
                imagesCount: images.length,
                timestamp: new Date().toISOString()
              };
              const newHistory = [historyEntry, ...history.slice(0, 9)];
              setHistory(newHistory);
              try {
                localStorage.setItem('photo-collage-history', JSON.stringify(newHistory));
              } catch (e) {
                console.error('Error saving to localStorage:', e);
              }
            }
          };
          img.src = images[imageIndex].src;
        }
      }
    }
    
    if (totalImages === 0) {
      setIsProcessing(false);
      setError(t('no_images', 'Please add images to create a collage'));
    }
  };

  const downloadCollage = () => {
    if (!collageData) return;
    
    const link = document.createElement('a');
    link.download = `photo-collage-${selectedLayout.name.toLowerCase().replace(/ /g, '-')}.png`;
    link.href = collageData;
    link.click();
    setSuccessMessage(t('download_success', '✓ Collage downloaded successfully!'));
  };

  const shareCollage = async () => {
    if (!collageData) return;
    
    try {
      const response = await fetch(collageData);
      const blob = await response.blob();
      const file = new File([blob], `collage-${Date.now()}.png`, { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          title: t('share_title', 'My Photo Collage'),
          files: [file]
        });
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({
            [file.type]: file
          })
        ]);
        setSuccessMessage(t('copied_to_clipboard', 'Collage copied to clipboard!'));
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const resetTool = () => {
    setImages([]);
    setCollageData(null);
    setSelectedLayout(collageLayouts[0]);
    setSpacing(4);
    setBorderRadius(8);
    setBackgroundColor('#ffffff');
    setError(null);
    setSuccessMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('photo-collage-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    const layout = collageLayouts.find(l => l.id === entry.layoutId) || collageLayouts[0];
    setSelectedLayout(layout);
    setSpacing(entry.spacing);
    setBorderRadius(entry.borderRadius);
    setCollageData(entry.collageData);
    setActiveTab('maker');
  };

  const maxImagesForLayout = selectedLayout.maxImages;
  const canAddMoreImages = images.length < maxImagesForLayout;

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
      
      <div className="max-w-7xl mx-auto px-4 py-8" style={getDynamicStyles()}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="rounded-full p-3" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Grid className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'Photo Collage Maker')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Combine multiple photos into beautiful collages with various layouts')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('maker')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'maker' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'maker' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'maker' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'maker' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Grid className="h-4 w-4" />
            {t('tab_maker', 'Collage Maker')}
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
            
            {/* Maker Tab */}
            {activeTab === 'maker' && (
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

                {/* Layout Selection */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                    <Layout className="h-4 w-4" style={{ color: themeColors.primary }} />
                    {t('choose_layout', 'Choose Layout')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {collageLayouts.map(layout => (
                      <button
                        key={layout.id}
                        onClick={() => setSelectedLayout(layout)}
                        className={`p-3 rounded-lg border text-center transition-all ${selectedLayout.id === layout.id ? 'scale-105' : 'hover:scale-102'}`}
                        style={{ 
                          backgroundColor: selectedLayout.id === layout.id ? `${themeColors.primary}10` : themeColors.background,
                          borderColor: selectedLayout.id === layout.id ? themeColors.primary : themeColors.border,
                          color: selectedLayout.id === layout.id ? themeColors.primary : themeColors.text.primary
                        }}
                      >
                        <div className="text-2xl mb-1">{layout.icon}</div>
                        <div className="text-sm font-medium">{layout.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: themeColors.text.secondary }}>{layout.maxImages} {t('photos', 'photos')}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Upload Area */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h3 className="font-semibold mb-4 flex items-center justify-between" style={{ color: themeColors.text.primary }}>
                    <span>{t('upload_photos', 'Upload Photos')} ({images.length}/{maxImagesForLayout})</span>
                    {images.length > 0 && (
                      <button
                        onClick={() => { setImages([]); setCollageData(null); }}
                        className="text-xs px-2 py-1 rounded hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: `${themeColors.error}10`, color: themeColors.error }}
                      >
                        {t('clear_all', 'Clear All')}
                      </button>
                    )}
                  </h3>
                  
                  {images.length === 0 ? (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center" style={{ borderColor: themeColors.border }}>
                      <div className="inline-flex items-center justify-center p-4 rounded-full mb-4" style={{ backgroundColor: `${themeColors.primary}10` }}>
                        <Upload className="h-8 w-8" style={{ color: themeColors.primary }} />
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                      >
                        <Upload className="h-4 w-4" />
                        {t('select_photos', 'Select Photos')}
                      </label>
                      <p className="mt-4 text-xs" style={{ color: themeColors.text.secondary }}>
                        {t('file_info', `Select up to ${maxImagesForLayout} photos. Supports JPG, PNG, WebP`)}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Image Grid Preview */}
                      <div className={`grid gap-2 ${selectedLayout.template}`}>
                        {Array.from({ length: maxImagesForLayout }).map((_, index) => (
                          <div key={index} className="aspect-video rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden"
                            style={{ borderColor: themeColors.border, backgroundColor: themeColors.background }}>
                            {images[index] ? (
                              <div className="relative w-full h-full">
                                <img 
                                  src={images[index].src} 
                                  alt={`Collage ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={() => removeImage(images[index].id)}
                                  className="absolute -top-2 -right-2 rounded-full p-1 hover:opacity-80 transition-opacity"
                                  style={{ backgroundColor: themeColors.error, color: '#fff' }}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="text-center" style={{ color: themeColors.text.secondary }}>
                                <ImageIcon className="h-8 w-8 mx-auto mb-1 opacity-50" />
                                <span className="text-xs">{t('empty_slot', 'Empty Slot')}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Add More Images Button */}
                      {canAddMoreImages && (
                        <div className="text-center">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            multiple
                            className="hidden"
                            id="add-more-images"
                          />
                          <label
                            htmlFor="add-more-images"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary, border: `1px solid ${themeColors.primary}30` }}
                          >
                            <Plus className="h-4 w-4" />
                            {t('add_more', 'Add More Photos')} ({maxImagesForLayout - images.length} {t('remaining', 'remaining')})
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Customization Options */}
                {images.length > 0 && (
                  <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <h3 className="font-semibold mb-4" style={{ color: themeColors.text.primary }}>{t('customization', 'Customization')}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                          {t('spacing', 'Spacing')}: {spacing}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={spacing}
                          onChange={(e) => setSpacing(parseInt(e.target.value))}
                          className="w-full"
                          style={{ accentColor: themeColors.primary }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                          {t('border_radius', 'Border Radius')}: {borderRadius}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={borderRadius}
                          onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                          className="w-full"
                          style={{ accentColor: themeColors.primary }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                          {t('background_color', 'Background Color')}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {backgroundColors.map((color) => (
                            <button
                              key={color.name}
                              onClick={() => setBackgroundColor(color.value)}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${backgroundColor === color.value ? 'scale-110 ring-2 ring-primary' : 'hover:scale-105'}`}
                              style={{ backgroundColor: color.value, borderColor: themeColors.border }}
                              title={color.label}
                            />
                          ))}
                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer"
                            style={{ border: `1px solid ${themeColors.border}` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={generateCollage}
                      disabled={isProcessing}
                      className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
                      style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>{t('generating', 'Generating...')}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>{t('generate', 'Generate Collage')}</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetTool}
                      className="px-4 py-3 rounded-lg font-semibold flex items-center gap-2 transition-opacity hover:opacity-80"
                      style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                    >
                      <Trash2 className="h-4 w-4" />
                      {t('start_over', 'Start Over')}
                    </button>
                  </div>
                )}

                {/* Collage Preview and Actions */}
                {collageData && (
                  <div className="space-y-4">
                    <div className="rounded-xl border p-6 text-center" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <h3 className="font-semibold mb-4" style={{ color: themeColors.text.primary }}>{t('your_collage', 'Your Collage')}</h3>
                      <div className="inline-block max-w-full">
                        <img src={collageData} alt="Collage" className="max-w-full h-auto mx-auto rounded-lg shadow-lg" />
                      </div>
                    </div>

                    {/* Download & Share Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={downloadCollage}
                        className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: themeColors.success, color: '#fff' }}
                      >
                        <Download className="h-4 w-4" />
                        {t('download', 'Download Collage')}
                      </button>
                      <button
                        onClick={shareCollage}
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

                {/* Instructions */}
                <div className="rounded-xl p-6" style={{ backgroundColor: `${themeColors.primary}10`, border: `1px solid ${themeColors.primary}30` }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="h-5 w-5" style={{ color: themeColors.primary }} />
                    <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('how_to', 'How to Create Your Collage')}</h3>
                  </div>
                  <ol className="space-y-2 text-sm list-decimal list-inside" style={{ color: themeColors.text.secondary }}>
                    <li>{t('step_1', 'Choose a layout that matches the number of photos you want to use')}</li>
                    <li>{t('step_2', 'Upload your photos (up to the layout limit)')}</li>
                    <li>{t('step_3', 'Adjust spacing, border radius, and background color to your preference')}</li>
                    <li>{t('step_4', 'Click "Generate Collage" to create your masterpiece')}</li>
                    <li>{t('step_5', 'Download your collage and share it with friends!')}</li>
                  </ol>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="p-4 sm:p-6 border-b" style={{ borderColor: themeColors.border }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold" style={{ color: themeColors.text.primary }}>
                        {t('collage_history', 'Collage History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_collages', 'Your recently created collages')}
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
                    {history.map((entry) => {
                      const layout = collageLayouts.find(l => l.id === entry.layoutId);
                      return (
                        <div key={entry.id} className="p-4 hover:opacity-80 transition-opacity">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Grid className="h-4 w-4" style={{ color: themeColors.primary }} />
                                <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                  {layout?.name || entry.layoutId}
                                </span>
                              </div>
                              <div className="flex gap-3 text-xs" style={{ color: themeColors.text.secondary }}>
                                <span>{entry.imagesCount} {t('photos', 'photos')}</span>
                                <span>{t('spacing', 'Spacing')}: {entry.spacing}px</span>
                                <span>{t('radius', 'Radius')}: {entry.borderRadius}px</span>
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
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 sm:p-12 text-center">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                    <p className="text-sm opacity-80 mb-2" style={{ color: themeColors.text.secondary }}>
                      {t('no_history', 'No collage history yet')}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your created collages will appear here')}
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
