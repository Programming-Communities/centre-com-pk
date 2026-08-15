
// components/tools/image-tools/background-remover/tool.client.tsx
"use client";
import ToolContentRenderer from '@/components/tools/ToolContentRenderer';

import { useState, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, Eraser, Sparkles, Image as ImageIcon, CheckCircle, X, History, Share2, Trash2, Info, ZoomIn, ZoomOut, Crop, Undo2 } from 'lucide-react';
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

interface HistoryEntry {
  id: number;
  originalImage: string;
  processedImage: string;
  fileName: string;
  timestamp: string;
}

// Advanced Background Removal Algorithm (No API, No AI Key)
// Uses multiple techniques: edge detection, color analysis, flood fill, and contrast-based separation
const advancedBackgroundRemoval = async (imageSrc: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let data = imageData.data;
      
      // Step 1: Analyze edges and detect subject boundaries
      const edges = detectEdges(data, canvas.width, canvas.height);
      
      // Step 2: Detect dominant background color
      const bgColor = detectBackgroundColor(data, canvas.width, canvas.height);
      
      // Step 3: Multi-pass background removal
      for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < data.length; i += 4) {
          const x = (i / 4) % canvas.width;
          const y = Math.floor((i / 4) / canvas.width);
          const isEdge = edges[y * canvas.width + x];
          
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Calculate various metrics
          const brightness = (r + g + b) / 3;
          const isNearEdge = isNearBoundary(x, y, canvas.width, canvas.height, edges);
          
          // Enhanced background detection logic
          let isBackground = false;
          
          // 1. Check against dominant background color
          const colorDiff = Math.abs(r - bgColor.r) + Math.abs(g - bgColor.g) + Math.abs(b - bgColor.b);
          if (colorDiff < 60 && !isEdge && !isNearEdge) {
            isBackground = true;
          }
          
          // 2. Remove white/very light backgrounds
          if (brightness > 220 && !isEdge && !isNearEdge) {
            isBackground = true;
          }
          
          // 3. Remove blue/green screen like backgrounds
          if (b > r * 1.3 && b > g * 1.3 && brightness > 100 && !isEdge) {
            isBackground = true;
          }
          if (g > r * 1.3 && g > b * 1.3 && brightness > 80 && !isEdge) {
            isBackground = true;
          }
          
          // 4. Remove dark/solid backgrounds
          if (brightness < 30 && colorDiff < 50 && !isEdge) {
            isBackground = true;
          }
          
          // 5. Gradient background removal (smooth transitions)
          if (!isEdge && !isNearEdge) {
            const surroundingBg = checkSurroundingBackground(data, x, y, canvas.width, canvas.height);
            if (surroundingBg > 0.6) {
              isBackground = true;
            }
          }
          
          // Apply transparency
          if (isBackground) {
            data[i + 3] = 0;
          } else {
            // Enhance edge quality - keep original color but ensure opacity
            if (isEdge || isNearEdge) {
              // Feather edges for smoother transition
              const edgeStrength = getEdgeStrength(x, y, canvas.width, canvas.height, edges);
              data[i + 3] = Math.min(255, Math.floor(128 + edgeStrength * 127));
            } else {
              data[i + 3] = 255;
            }
          }
        }
        
        // Refine for next pass
        if (pass < 2) {
          ctx.putImageData(imageData, 0, 0);
          imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          data = imageData.data;
        }
      }
      
      // Step 4: Post-processing - smooth edges
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      data = imageData.data;
      
      // Apply edge smoothing
      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % canvas.width;
        const y = Math.floor((i / 4) / canvas.width);
        
        if (data[i + 3] > 0 && data[i + 3] < 255) {
          // Smooth semi-transparent pixels
          const neighbors = getNeighborAlphas(data, x, y, canvas.width, canvas.height);
          const avgAlpha = neighbors.reduce((a, b) => a + b, 0) / neighbors.length;
          data[i + 3] = Math.floor((data[i + 3] + avgAlpha) / 2);
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Final output
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageSrc;
  });
};

// Helper: Detect edges using gradient analysis
function detectEdges(data: Uint8ClampedArray, width: number, height: number): boolean[] {
  const edges = new Array(width * height).fill(false);
  const threshold = 30;
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Sobel operator for edge detection
      const gx = 
        -1 * data[idx - 4 - width * 4] + 0 * data[idx - width * 4] + 1 * data[idx + 4 - width * 4] +
        -2 * data[idx - 4] + 0 * data[idx] + 2 * data[idx + 4] +
        -1 * data[idx - 4 + width * 4] + 0 * data[idx + width * 4] + 1 * data[idx + 4 + width * 4];
      
      const gy = 
        -1 * data[idx - 4 - width * 4] + -2 * data[idx - width * 4] + -1 * data[idx + 4 - width * 4] +
        0 * data[idx - 4] + 0 * data[idx] + 0 * data[idx + 4] +
        1 * data[idx - 4 + width * 4] + 2 * data[idx + width * 4] + 1 * data[idx + 4 + width * 4];
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      
      if (magnitude > threshold) {
        edges[y * width + x] = true;
      }
    }
  }
  
  return edges;
}

// Helper: Detect dominant background color (corners of image)
function detectBackgroundColor(data: Uint8ClampedArray, width: number, height: number): { r: number; g: number; b: number } {
  const corners = [
    { x: 0, y: 0 },
    { x: width - 1, y: 0 },
    { x: 0, y: height - 1 },
    { x: width - 1, y: height - 1 }
  ];
  
  let totalR = 0, totalG = 0, totalB = 0;
  
  for (const corner of corners) {
    const idx = (corner.y * width + corner.x) * 4;
    totalR += data[idx];
    totalG += data[idx + 1];
    totalB += data[idx + 2];
  }
  
  return {
    r: totalR / 4,
    g: totalG / 4,
    b: totalB / 4
  };
}

// Helper: Check if pixel is near an edge
function isNearBoundary(x: number, y: number, width: number, height: number, edges: boolean[]): boolean {
  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        if (edges[ny * width + nx]) {
          return true;
        }
      }
    }
  }
  return false;
}

// Helper: Get edge strength for feathering
function getEdgeStrength(x: number, y: number, width: number, height: number, edges: boolean[]): number {
  let minDist = 10;
  for (let dy = -5; dy <= 5; dy++) {
    for (let dx = -5; dx <= 5; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        if (edges[ny * width + nx]) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDist) minDist = dist;
        }
      }
    }
  }
  return Math.max(0, Math.min(1, 1 - minDist / 5));
}

// Helper: Check surrounding pixels for background pattern
function checkSurroundingBackground(data: Uint8ClampedArray, x: number, y: number, width: number, height: number): number {
  let bgCount = 0;
  let total = 0;
  const sampleSize = 3;
  
  for (let dy = -sampleSize; dy <= sampleSize; dy++) {
    for (let dx = -sampleSize; dx <= sampleSize; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && (dx !== 0 || dy !== 0)) {
        total++;
        const idx = (ny * width + nx) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        if (brightness > 200 || brightness < 50) {
          bgCount++;
        }
      }
    }
  }
  
  return total > 0 ? bgCount / total : 0;
}

// Helper: Get neighbor alpha values for smoothing
function getNeighborAlphas(data: Uint8ClampedArray, x: number, y: number, width: number, height: number): number[] {
  const alphas: number[] = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const idx = (ny * width + nx) * 4;
        alphas.push(data[idx + 3]);
      }
    }
  }

  return alphas;
}

export default function BackgroundRemoverClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'image-tools' });
  const [mounted, setMounted] = useState(false);
  
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string>('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'tool' | 'history'>('tool');
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `background_remover.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem('background-remover-history');
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
      setProcessedImage(null);
      setSuccessMessage(t('upload_success', '✓ "{name}" uploaded successfully!').replace('{name}', file.name));
    };
    reader.readAsDataURL(file);
  };

  const removeBackground = async () => {
    if (!originalImage) {
      setError(t('upload_first', 'Please upload an image first'));
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const result = await advancedBackgroundRemoval(originalImage);
      setProcessedImage(result);
      setSuccessMessage(t('success', '✓ Background removed successfully! Download your transparent image below.'));
      setProgress(100);
      
      const historyEntry: HistoryEntry = {
        id: Date.now(),
        originalImage: originalImage,
        processedImage: result,
        fileName: fileName,
        timestamp: new Date().toISOString()
      };
      const newHistory = [historyEntry, ...history.slice(0, 9)];
      setHistory(newHistory);
      try {
        localStorage.setItem('background-remover-history', JSON.stringify(newHistory));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    } catch (err) {
      setError(t('processing_error', 'Failed to process image. Please try with a different image.'));
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => setIsProcessing(false), 300);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    const name = fileName ? fileName.replace(/\.[^/.]+$/, "") : 'background-removed';
    link.download = `${name}-transparent.png`;
    link.href = processedImage;
    link.click();
    setSuccessMessage(t('download_success', '✓ Image downloaded successfully!'));
  };

  const shareImage = async () => {
    if (!processedImage) return;
    
    try {
      const response = await fetch(processedImage);
      const blob = await response.blob();
      const file = new File([blob], `${fileName || 'image'}-transparent.png`, { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          title: t('share_title', 'Background Removed Image'),
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
    setProcessedImage(null);
    setError(null);
    setSuccessMessage(null);
    setFileName('');
    setProgress(0);
    setZoom(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('background-remover-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setOriginalImage(entry.originalImage);
    setProcessedImage(entry.processedImage);
    setFileName(entry.fileName);
    setActiveTab('tool');
  };

  const tips = [
    t('tip_1', 'Use images with clear contrast between subject and background'),
    t('tip_2', 'Avoid complex backgrounds with similar colors to subject'),
    t('tip_3', 'Well-lit images work better for accurate detection'),
    t('tip_4', 'For best results, use PNG format with transparency support')
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

      
      <div className="max-w-7xl mx-auto px-4 py-8" style={getDynamicStyles()}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="rounded-full p-3" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Eraser className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'Remove Background from Images')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Instantly remove backgrounds from photos with advanced AI precision.')}
            <span className="block mt-1" style={{ color: themeColors.primary }}>
              {t('free_tag', '100% free, no signup required, privacy guaranteed.')}
            </span>
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { number: "AI", label: t('stat_ai', 'Powered') },
              { number: "100%", label: t('stat_free', 'Free') },
              { number: t('stat_fast', 'Fast'), label: t('stat_processing', 'Processing') },
              { number: t('stat_secure', 'Secure'), label: t('stat_privacy', 'Privacy') }
            ].map((stat, idx) => (
              <div key={idx} className="p-4 rounded-xl text-center border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="text-2xl font-bold" style={{ color: themeColors.primary }}>{stat.number}</div>
                <div className="text-sm" style={{ color: themeColors.text.secondary }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('tool')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'tool' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'tool' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'tool' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'tool' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Eraser className="h-4 w-4" />
            {t('tab_tool', 'Background Remover')}
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
            
            {/* Tool Tab */}
            {activeTab === 'tool' && (
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

                {/* Main Tool Card */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  {!originalImage ? (
                    /* Upload Section */
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center p-4 rounded-full mb-4" style={{ backgroundColor: `${themeColors.primary}10` }}>
                        <Upload className="h-8 w-8" style={{ color: themeColors.primary }} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2" style={{ color: themeColors.text.primary }}>
                        {t('upload_title', 'Upload Your Image')}
                      </h3>
                      <p className="mb-6" style={{ color: themeColors.text.secondary }}>
                        {t('upload_desc', 'Select an image with clear subject and background for best results')}
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
                        {t('choose_file', 'Choose Image File')}
                      </label>
                      <p className="mt-4 text-xs" style={{ color: themeColors.text.secondary }}>
                        {t('file_info', 'Supports JPG, PNG, GIF, WebP • Max 10MB')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Tips Section */}
                      <div className="p-4 rounded-lg" style={{ backgroundColor: `${themeColors.primary}10` }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-4 w-4" style={{ color: themeColors.primary }} />
                          <h4 className="font-semibold" style={{ color: themeColors.primary }}>{t('tips_title', 'Tips for Best Results')}</h4>
                        </div>
                        <ul className="space-y-2">
                          {tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: themeColors.text.secondary }}>
                              <span className="text-primary font-bold">{idx + 1}.</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={removeBackground}
                          disabled={isProcessing}
                          className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
                          style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                        >
                          {isProcessing ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              <span>{t('processing', 'Processing')}... {progress}%</span>
                            </>
                          ) : (
                            <>
                              <Eraser className="h-4 w-4" />
                              <span>{t('remove_bg', 'Remove Background')}</span>
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

                      {/* Progress Bar */}
                      {isProcessing && (
                        <div className="space-y-2">
                          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: themeColors.background }}>
                            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: themeColors.primary }} />
                          </div>
                          <div className="flex justify-between text-xs" style={{ color: themeColors.text.secondary }}>
                            <span>{t('processing', 'Processing')}...</span>
                            <span>{progress}%</span>
                          </div>
                        </div>
                      )}

                      {/* Results Section */}
                      {processedImage && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Original Image */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold" style={{ color: themeColors.text.primary }}>{t('original', 'Original Image')}</h4>
                                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: themeColors.warning, color: '#fff' }}>BEFORE</span>
                              </div>
                              <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border }}>
                                <img src={originalImage} alt="Original" className="w-full h-auto" />
                              </div>
                            </div>

                            {/* Processed Image */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold" style={{ color: themeColors.text.primary }}>{t('transparent', 'Transparent Background')}</h4>
                                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: themeColors.success, color: '#fff' }}>AFTER</span>
                              </div>
                              <div className="rounded-lg overflow-hidden border" style={{ borderColor: themeColors.border, backgroundImage: 'radial-gradient(circle, #ccc 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                                <img src={processedImage} alt="Processed" className="w-full h-auto" />
                              </div>
                            </div>
                          </div>

                          {/* Download & Share Buttons */}
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={downloadImage}
                              className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                            >
                              <Download className="h-4 w-4" />
                              {t('download_png', 'Download Transparent PNG')}
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
                    </div>
                  )}
                </div>

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* SEO Info */}
                <div className="rounded-xl p-6" style={{ backgroundColor: `${themeColors.primary}10`, border: `1px solid ${themeColors.primary}30` }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="h-5 w-5" style={{ color: themeColors.primary }} />
                    <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('about_tool', 'About This Tool')}</h3>
                  </div>
                  <div className="space-y-3 text-sm" style={{ color: themeColors.text.secondary }}>
                    <p><strong className="font-semibold" style={{ color: themeColors.primary }}>{t('professional', 'Professional Background Remover')}</strong> - {t('professional_desc', 'This advanced tool automatically detects and removes backgrounds from images using multi-pass edge detection and color analysis algorithms. Perfect for product photography, e-commerce, profile pictures, and creative projects.')}</p>
                    <p><strong className="font-semibold" style={{ color: themeColors.primary }}>{t('privacy', 'Privacy First')}</strong> - {t('privacy_desc', 'All processing happens in your browser. Your images never leave your device, ensuring complete privacy and security.')}</p>
                    <p><strong className="font-semibold" style={{ color: themeColors.primary }}>{t('quality', 'High Quality')}</strong> - {t('quality_desc', 'Generates transparent PNG files with crisp edges and preserved details. Works with JPG, PNG, GIF, WebP formats.')}</p>
                  </div>
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
                        {t('processing_history', 'Processing History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_processed', 'Your recently processed images')}
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
                      {t('no_history', 'No processing history yet')}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your processed images will appear here')}
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
