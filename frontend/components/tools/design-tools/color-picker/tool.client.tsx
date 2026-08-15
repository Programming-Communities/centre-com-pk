// app/[lang]/tools/design-tools/color-picker/tool.client.tsx (FULL WIDTH - NO SIDEBARS)
"use client";

import { useState, useEffect } from "react";
import { Copy, Palette, Droplets, Contrast, Eye, RefreshCw, CheckCircle, History, Download, Share2, Star } from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

interface ColorHistoryEntry {
  id: number;
  color: string;
  rgb: string;
  hsl: string;
  cmyk: string;
  contrastRatio: number;

  timestamp: string;
}

export default function ColorPickerClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  
  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'design-tools' });
  const [mounted, setMounted] = useState(false);
  
  const [color, setColor] = useState<string>("#3b82f6");
  const [rgb, setRgb] = useState<string>("59, 130, 246");
  const [hsl, setHsl] = useState<string>("217, 91%, 60%");
  const [cmyk, setCmyk] = useState<string>("76, 47, 0, 4");
  const [copiedFormat, setCopiedFormat] = useState<string>("");
  const [contrastRatio, setContrastRatio] = useState<number>(0);
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [history, setHistory] = useState<ColorHistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'picker' | 'history'>('picker');
  const [favoriteColors, setFavoriteColors] = useState<string[]>(["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]);

  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `color_picker.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem('color-picker-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
    const savedFavorites = localStorage.getItem('color-picker-favorites');
    if (savedFavorites) {
      try {
        setFavoriteColors(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Error parsing favorites:', e);
      }
    }
  }, []);

  const hexToRgb = (hex: string): [number, number, number] => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  const rgbToCmyk = (r: number, g: number, b: number): [number, number, number, number] => {
    if (r === 0 && g === 0 && b === 0) {
      return [0, 0, 0, 100];
    }
    
    const rPrime = r / 255;
    const gPrime = g / 255;
    const bPrime = b / 255;
    
    const k = 1 - Math.max(rPrime, gPrime, bPrime);
    const c = (1 - rPrime - k) / (1 - k);
    const m = (1 - gPrime - k) / (1 - k);
    const y = (1 - bPrime - k) / (1 - k);
    
    return [
      Math.round(c * 100),
      Math.round(m * 100),
      Math.round(y * 100),
      Math.round(k * 100)
    ];
  };

  const calculateContrast = (r: number, g: number, b: number) => {
    const rsrgb = r / 255;
    const gsrgb = g / 255;
    const bsrgb = b / 255;
    
    const rLinear = rsrgb <= 0.04045 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
    const gLinear = gsrgb <= 0.04045 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
    const bLinear = bsrgb <= 0.04045 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);
    
    const luminance = 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
    const contrast = (1 + 0.05) / (luminance + 0.05);
    setContrastRatio(Math.round(contrast * 10) / 10);
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    setTextColor(brightness > 128 ? "#000000" : "#ffffff");
    
    return Math.round(contrast * 10) / 10;
  };

  const updateColor = (newColor: string) => {
    setColor(newColor);
    
    try {
      const [r, g, b] = hexToRgb(newColor);
      const newRgb = `${r}, ${g}, ${b}`;
      setRgb(newRgb);
      
      const [h, s, l] = rgbToHsl(r, g, b);
      const newHsl = `${h}, ${s}%, ${l}%`;
      setHsl(newHsl);
      
      const [c, m, y, k] = rgbToCmyk(r, g, b);
      const newCmyk = `${c}, ${m}, ${y}, ${k}`;
      setCmyk(newCmyk);
      
      const newContrast = calculateContrast(r, g, b);
      
      const historyEntry: ColorHistoryEntry = {
        id: Date.now(),
        color: newColor,
        rgb: newRgb,
        hsl: newHsl,
        cmyk: newCmyk,
        contrastRatio: newContrast,
        timestamp: new Date().toISOString()
      };
      const newHistory = [historyEntry, ...history.slice(0, 9)];
      setHistory(newHistory);
      try {
        localStorage.setItem('color-picker-history', JSON.stringify(newHistory));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    } catch (error) {
      console.error("Invalid color format");
    }
  };

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(""), 2000);
    } catch (err) {
      alert(t('copy_failed', 'Failed to copy color'));
    }
  };

  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    updateColor(randomColor);
  };

  const exportAsText = () => {
    const text = `${t('export_header', '=== COLOR REPORT ===')}\n` +
                 `${t('date', 'Date')}: ${new Date().toLocaleDateString()}\n\n` +
                 `${t('color_info', 'Color Information')}:\n` +
                 `• HEX: ${color}\n` +
                 `• RGB: rgb(${rgb})\n` +
                 `• HSL: hsl(${hsl})\n` +
                 `• CMYK: cmyk(${cmyk})\n` +
                 `• ${t('contrast_ratio', 'Contrast Ratio')}: ${contrastRatio}:1\n\n` +
                 `${t('generated_by', '=== Generated by Centre.com.pk Color Picker ===')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `color-${color.replace('#', '')}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    const shareText = `${t('share_text', 'Color')}: ${color} | ${t('contrast_ratio', 'Contrast')}: ${contrastRatio}:1`;
    if (navigator.share) {
      navigator.share({
        title: t('share_title', 'Color Information'),
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert(t('copied_to_clipboard', 'Results copied to clipboard!'));
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('color-picker-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: ColorHistoryEntry) => {
    updateColor(entry.color);
    setActiveTab('picker');
  };

  const toggleFavorite = (colorValue: string) => {
    let newFavorites: string[];
    if (favoriteColors.includes(colorValue)) {
      newFavorites = favoriteColors.filter(c => c !== colorValue);
    } else {
      newFavorites = [...favoriteColors, colorValue];
    }
    setFavoriteColors(newFavorites);
    try {
      localStorage.setItem('color-picker-favorites', JSON.stringify(newFavorites));
    } catch (e) {
      console.error('Error saving favorites:', e);
    }
  };

  const predefinedColors = [
    { name: t('colors.blue', 'Blue'), value: "#3b82f6" },
    { name: t('colors.red', 'Red'), value: "#ef4444" },
    { name: t('colors.green', 'Green'), value: "#10b981" },
    { name: t('colors.yellow', 'Yellow'), value: "#f59e0b" },
    { name: t('colors.purple', 'Purple'), value: "#8b5cf6" },
    { name: t('colors.pink', 'Pink'), value: "#ec4899" },
    { name: t('colors.indigo', 'Indigo'), value: "#6366f1" },
    { name: t('colors.gray', 'Gray'), value: "#6b7280" },
    { name: t('colors.teal', 'Teal'), value: "#14b8a6" },
    { name: t('colors.orange', 'Orange'), value: "#f97316" },
    { name: t('colors.rose', 'Rose'), value: "#f43f5e" },
    { name: t('colors.cyan', 'Cyan'), value: "#06b6d4" }
  ];

  const colorFormats = [
    { label: "HEX", value: color, prefix: "#", copyText: color },
    { label: "RGB", value: `rgb(${rgb})`, prefix: "rgb", copyText: `rgb(${rgb})` },
    { label: "HSL", value: `hsl(${hsl})`, prefix: "hsl", copyText: `hsl(${hsl})` },
    { label: "CMYK", value: `cmyk(${cmyk})`, prefix: "cmyk", copyText: `cmyk(${cmyk})` }
  ];

  useEffect(() => {
    if (mounted) {
      updateColor(color);
    }
  }, [mounted]);

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
      style={{ 
        backgroundColor: themeColors.background,
        color: themeColors.text.primary,
        fontFamily: fontFamily
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Top Banner Ad */}
        <div className="mb-8">
          <CentralAd position="top" size="banner" />
        </div>

        {/* Title and Description - TOOL FIRST */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="rounded-full p-3" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Palette className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'Color Picker & Converter')}
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Pick colors, convert between formats, and get accessibility information')}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('picker')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'picker' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'picker' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'picker' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'picker' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Palette className="h-4 w-4" />
            {t('tab_picker', 'Color Picker')}
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

        {/* TOOL MAIN CONTENT - FULL WIDTH, NO SIDEBARS */}
        <div className="w-full">
          
          {activeTab === 'picker' && (
            <div className="space-y-6">
              {/* Color Preview & Picker Section */}
              <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="h-6 w-6" style={{ color: themeColors.primary }} />
                  <h2 className="text-xl font-semibold" style={{ color: themeColors.text.primary }}>
                    {t('color_preview', 'Color Preview & Picker')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Color display */}
                  <div className="space-y-4">
                    <div className="rounded-xl overflow-hidden border" style={{ borderColor: themeColors.border }}>
                      <div 
                        className="h-48 flex items-center justify-center transition-all duration-300"
                        style={{ backgroundColor: color }}
                      >
                        <div className="text-center p-4">
                          <div className="text-2xl font-bold mb-2" style={{ color: textColor }}>
                            {t('selected_color', 'Selected Color')}
                          </div>
                          <div className="text-lg font-mono" style={{ color: textColor }}>
                            {color.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border" style={{ backgroundColor: themeColors.background, borderColor: themeColors.border }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Contrast className="h-4 w-4" style={{ color: themeColors.primary }} />
                        <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                          {t('contrast_preview', 'Text Contrast Preview')}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="p-3 rounded text-center font-medium" style={{ backgroundColor: color, color: "#ffffff" }}>
                          {t('white_text', 'White Text on Color')}
                        </div>
                        <div className="p-3 rounded text-center font-medium" style={{ backgroundColor: color, color: "#000000" }}>
                          {t('black_text', 'Black Text on Color')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Color controls */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-3" style={{ color: themeColors.text.primary }}>
                        {t('pick_color', 'Pick a Color')}
                      </label>
                      <div className="flex gap-4">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => updateColor(e.target.value)}
                          className="w-full h-12 rounded cursor-pointer"
                          style={{ borderColor: themeColors.border }}
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => updateColor(e.target.value)}
                          className="w-32 px-3 py-2 rounded-lg border font-mono text-center"
                          style={{ 
                            borderColor: themeColors.border,
                            backgroundColor: themeColors.background,
                            color: themeColors.text.primary
                          }}
                          placeholder="#000000"
                          maxLength={7}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3" style={{ color: themeColors.text.primary }}>
                        {t('favorite_colors', 'Favorite Colors')} ⭐
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {favoriteColors.map((favColor, idx) => (
                          <button
                            key={idx}
                            onClick={() => updateColor(favColor)}
                            className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                            style={{ 
                              backgroundColor: favColor,
                              borderColor: color === favColor ? themeColors.primary : themeColors.border
                            }}
                            title={favColor}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={generateRandomColor}
                        className="w-full py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                        style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                      >
                        <RefreshCw className="h-4 w-4" />
                        {t('random_color', 'Generate Random Color')}
                      </button>
                    </div>

                    {/* Predefined Colors */}
                    <div>
                      <label className="block text-sm font-medium mb-3" style={{ color: themeColors.text.primary }}>
                        {t('quick_colors', 'Quick Colors')}
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {predefinedColors.map((item, index) => (
                          <div
                            key={index}
                            className="relative group"
                          >
                            <button
                              onClick={() => updateColor(item.value)}
                              className="w-full aspect-square rounded-lg border-2 hover:scale-105 transition-transform"
                              style={{ 
                                backgroundColor: item.value,
                                borderColor: color === item.value ? themeColors.primary : themeColors.border
                              }}
                              title={item.name}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(item.value);
                              }}
                              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ backgroundColor: themeColors.warning }}
                              title="Add to favorites"
                            >
                              <Star className="h-3 w-3 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Formats Section */}
              <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="flex items-center gap-3 mb-6">
                  <Droplets className="h-6 w-6" style={{ color: themeColors.primary }} />
                  <h2 className="text-xl font-semibold" style={{ color: themeColors.text.primary }}>
                    {t('color_formats', 'Color Formats')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {colorFormats.map((format, index) => (
                    <div key={index} className="p-4 rounded-lg border" style={{ backgroundColor: themeColors.background, borderColor: themeColors.border }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded flex items-center justify-center text-sm font-semibold"
                            style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                            {format.prefix}
                          </div>
                          <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>{format.label}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(format.copyText, format.label)}
                          className="flex items-center gap-1 px-3 py-1 text-xs rounded hover:opacity-90 transition-colors"
                          style={{ backgroundColor: copiedFormat === format.label ? themeColors.success : themeColors.primary, color: themeColors.text.accent }}
                        >
                          {copiedFormat === format.label ? (
                            <><CheckCircle className="h-3 w-3" />{t('copied', 'Copied')}</>
                          ) : (
                            <><Copy className="h-3 w-3" />{t('copy', 'Copy')}</>
                          )}
                        </button>
                      </div>
                      <div className="font-mono text-sm p-2 rounded" style={{ backgroundColor: themeColors.surface, color: themeColors.text.primary }}>
                        {format.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* In-Content Ad */}
              <CentralAd position="in-content" size="rectangle" />

              {/* Export/Share buttons */}
              <div className="flex gap-3">
                <button
                  onClick={exportAsText}
                  className="flex-1 py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                >
                  <Download className="h-4 w-4" />
                  {t('export', 'Export')}
                </button>
                <button
                  onClick={shareResults}
                  className="flex-1 py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                >
                  <Share2 className="h-4 w-4" />
                  {t('share', 'Share')}
                </button>
              </div>

              {/* Accessibility + Color Theory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border" style={{ backgroundColor: `${themeColors.primary}10`, borderColor: `${themeColors.primary}30` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="h-6 w-6" style={{ color: themeColors.primary }} />
                    <h3 className="text-lg font-semibold" style={{ color: themeColors.primary }}>
                      {t('accessibility_info', 'Accessibility Information')}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>{t('contrast_ratio', 'Contrast Ratio')}:</span>
                        <span className="font-semibold" style={{ color: contrastRatio >= 4.5 ? themeColors.success : contrastRatio >= 3 ? themeColors.warning : themeColors.error }}>
                          {contrastRatio}:1
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: themeColors.background }}>
                        <div className="h-full rounded-full" style={{ width: `${Math.min(contrastRatio * 10, 100)}%`, backgroundColor: contrastRatio >= 4.5 ? themeColors.success : contrastRatio >= 3 ? themeColors.warning : themeColors.error }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className={`flex items-center justify-between p-2 rounded ${contrastRatio >= 4.5 ? 'opacity-100' : 'opacity-50'}`} style={{ backgroundColor: `${themeColors.success}10` }}>
                        <span className="text-sm" style={{ color: themeColors.text.primary }}>{t('wcag_aa_normal', 'WCAG AA (Normal Text)')}</span>
                        <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: contrastRatio >= 4.5 ? themeColors.success : `${themeColors.success}30`, color: contrastRatio >= 4.5 ? themeColors.text.accent : themeColors.success }}>
                          {contrastRatio >= 4.5 ? "PASS" : "FAIL"}
                        </span>
                      </div>
                      <div className={`flex items-center justify-between p-2 rounded ${contrastRatio >= 3 ? 'opacity-100' : 'opacity-50'}`} style={{ backgroundColor: `${themeColors.warning}10` }}>
                        <span className="text-sm" style={{ color: themeColors.text.primary }}>{t('wcag_aa_large', 'WCAG AA (Large Text)')}</span>
                        <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: contrastRatio >= 3 ? themeColors.warning : `${themeColors.warning}30`, color: contrastRatio >= 3 ? themeColors.text.accent : themeColors.warning }}>
                          {contrastRatio >= 3 ? "PASS" : "FAIL"}
                        </span>
                      </div>
                      <div className={`flex items-center justify-between p-2 rounded ${contrastRatio >= 7 ? 'opacity-100' : 'opacity-50'}`} style={{ backgroundColor: `${themeColors.primary}10` }}>
                        <span className="text-sm" style={{ color: themeColors.text.primary }}>{t('wcag_aaa_best', 'WCAG AAA (Best)')}</span>
                        <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: contrastRatio >= 7 ? themeColors.primary : `${themeColors.primary}30`, color: contrastRatio >= 7 ? themeColors.text.accent : themeColors.primary }}>
                          {contrastRatio >= 7 ? "PASS" : "FAIL"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                    {t('color_theory', 'Color Theory Basics')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: themeColors.primary }} />
                      <div>
                        <div className="text-sm font-medium" style={{ color: themeColors.text.primary }}>HEX</div>
                        <div className="text-xs" style={{ color: themeColors.text.secondary }}>{t('hex_info', 'Web colors (e.g., #3b82f6). Most common for web development.')}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: themeColors.primary }} />
                      <div>
                        <div className="text-sm font-medium" style={{ color: themeColors.text.primary }}>RGB</div>
                        <div className="text-xs" style={{ color: themeColors.text.secondary }}>{t('rgb_info', 'Red, Green, Blue values (0-255). Used for digital displays.')}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: themeColors.primary }} />
                      <div>
                        <div className="text-sm font-medium" style={{ color: themeColors.text.primary }}>HSL</div>
                        <div className="text-xs" style={{ color: themeColors.text.secondary }}>{t('hsl_info', 'Hue, Saturation, Lightness. More intuitive for color adjustments.')}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: themeColors.primary }} />
                      <div>
                        <div className="text-sm font-medium" style={{ color: themeColors.text.primary }}>CMYK</div>
                        <div className="text-xs" style={{ color: themeColors.text.secondary }}>{t('cmyk_info', 'Cyan, Magenta, Yellow, Key (Black). Used for print materials.')}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: themeColors.border }}>
                    <div className="text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>{t('best_practices', 'Best Practices')}</div>
                    <ul className="text-xs space-y-1 list-disc list-inside" style={{ color: themeColors.text.secondary }}>
                      <li>{t('practice_1', 'Use HEX for web development')}</li>
                      <li>{t('practice_2', 'Maintain contrast ratio of at least 4.5:1 for text')}</li>
                      <li>{t('practice_3', 'Test colors in both light and dark modes')}</li>
                      <li>{t('practice_4', 'Consider color blindness when choosing colors')}</li>
                    </ul>
                  </div>
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
                      {t('color_history', 'Color History')}
                    </h2>
                    <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                      {t('recent_colors', 'Your recently selected colors')}
                    </p>
                  </div>
                  {history.length > 0 && (
                    <button onClick={clearHistory} className="px-4 py-2 border rounded-lg text-sm font-medium hover:opacity-80 transition-opacity" style={{ borderColor: themeColors.error, color: themeColors.error }}>
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
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg border" style={{ backgroundColor: entry.color, borderColor: themeColors.border }} />
                            <div>
                              <div className="font-medium" style={{ color: themeColors.text.primary }}>{entry.color}</div>
                              <div className="text-xs" style={{ color: themeColors.text.secondary }}>
                                {t('contrast_ratio', 'Contrast')}: {entry.contrastRatio}:1
                              </div>
                            </div>
                          </div>
                          <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
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
                  <Palette className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: themeColors.text.secondary }} />
                  <p className="text-sm opacity-80 mb-2" style={{ color: themeColors.text.secondary }}>
                    {t('no_history', 'No color history yet')}
                  </p>
                  <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                    {t('history_will_appear', 'Your selected colors will appear here')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Bottom Ad */}
      {/* Related Blog Posts — SEO Internal Linking */}
      <div className="mt-8">
      </div>
      </div>
    </div>
  );

}
