
// components/tools/code-tools/qr-code-generator/tool.client.tsx
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';


import { useState, useEffect } from "react";
import { Download, RotateCcw, History, Share2, Copy, CheckCircle, Trash2, QrCode, Eye, RefreshCw, Palette, Maximize2 } from "lucide-react";
import { QRCodeSVG as QRCode } from "qrcode.react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

interface HistoryEntry {
  id: number;
  text: string;
  size: number;
  bgColor: string;
  fgColor: string;

  timestamp: string;
}

export default function QRCodeGeneratorClient() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'code-tools' });
  const [mounted, setMounted] = useState(false);
  
  const [text, setText] = useState<string>('https://www.centre.com.pk');
  const [size, setSize] = useState<number>(256);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'generator' | 'history'>('generator');
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `qr_code_generator.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  useEffect(() => {
    setMounted(true);
    // Load history from localStorage
    const savedHistory = localStorage.getItem('qr-code-generator-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
  }, []);

  const saveToHistory = () => {
    if (!text.trim()) return;
    
    const historyEntry: HistoryEntry = {
      id: Date.now(),
      text,
      size,
      bgColor,
      fgColor,
      timestamp: new Date().toISOString()
    };
    const newHistory = [historyEntry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('qr-code-generator-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      try {
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `qrcode-${Date.now()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        saveToHistory();
      } catch (err) {
        setError(t('download_error', 'Failed to download QR code'));
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  const copyToClipboard = async () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      try {
        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({
                [blob.type]: blob
              })
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }
        });
      } catch (err) {
        alert(t('copy_failed', 'Failed to copy QR code'));
      }
    }
  };

  const shareQRCode = async () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      try {
        canvas.toBlob(async (blob) => {
          if (blob && navigator.share) {
            const file = new File([blob], `qrcode-${Date.now()}.png`, { type: 'image/png' });
            await navigator.share({
              title: t('share_title', 'QR Code'),
              text: text,
              files: [file]
            });
          } else if (navigator.share) {
            await navigator.share({
              title: t('share_title', 'QR Code'),
              text: text,
              url: text.startsWith('http') ? text : undefined
            });
          } else {
            alert(t('share_not_supported', 'Share not supported on this device'));
          }
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  const resetSettings = () => {
    setText('https://www.centre.com.pk');
    setSize(256);
    setBgColor('#FFFFFF');
    setFgColor('#000000');
    setError("");
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('qr-code-generator-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setText(entry.text);
    setSize(entry.size);
    setBgColor(entry.bgColor);
    setFgColor(entry.fgColor);
    setActiveTab('generator');
  };

  const quickPresets = [
    { name: t('preset_url', 'URL'), value: 'https://www.centre.com.pk' },
    { name: t('preset_text', 'Text'), value: 'Hello, World!' },
    { name: t('preset_email', 'Email'), value: 'mailto:support@centre.com.pk' },
    { name: t('preset_phone', 'Phone'), value: 'tel:+923001234567' },
    { name: t('preset_sms', 'SMS'), value: 'sms:+923001234567?body=Hello' },
    { name: t('preset_wifi', 'WiFi'), value: 'WIFI:T:WPA;S:MyWiFi;P:password123;;' }
  ];

  const sizePresets = [128, 256, 384, 512];

  useEffect(() => {
    if (mounted && text) {
      // Validate URL for display
      setError("");
    }
  }, [text, mounted]);

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
      {/* Top Banner Ad */}
      <CentralAd position="top" size="banner" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="rounded-full p-3" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <QrCode className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', 'QR Code Generator')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Generate custom QR codes for free')}
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
            <QrCode className="h-4 w-4" />
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
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${showPreview ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: showPreview ? themeColors.primary : themeColors.surface,
              color: showPreview ? '#ffffff' : themeColors.text.secondary,
              border: showPreview ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Eye className="h-4 w-4" />
            {t('tab_preview', 'Preview')}
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
                {/* Quick Presets */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <label className="block text-sm font-medium mb-3" style={{ color: themeColors.text.primary }}>
                    {t('quick_presets', 'Quick Presets')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickPresets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => setText(preset.value)}
                        className="px-3 py-1 text-sm rounded border hover:opacity-90 transition-colors"
                        style={{ 
                          backgroundColor: `${themeColors.primary}10`,
                          color: themeColors.primary,
                          borderColor: `${themeColors.primary}30`
                        }}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Input */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                    {t('content', 'Content')}
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t('enter_content', 'Enter URL or text...')}
                    className="w-full h-28 px-3 py-2 rounded-lg focus:ring-2 resize-none"
                    style={{ 
                      borderColor: themeColors.border,
                      backgroundColor: themeColors.background,
                      color: themeColors.text.primary,
                      outlineColor: themeColors.primary
                    }}
                  />
                  <div className="text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                    {t('characters', 'Characters')}: {text.length}
                  </div>
                </div>

                {/* Size Control */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium" style={{ color: themeColors.text.primary }}>
                      {t('size', 'Size')}: {size}px
                    </label>
                    <div className="flex gap-1">
                      {sizePresets.map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setSize(preset)}
                          className={`px-2 py-1 text-xs rounded transition-colors ${size === preset ? 'text-white' : ''}`}
                          style={{ 
                            backgroundColor: size === preset ? themeColors.primary : themeColors.background,
                            color: size === preset ? themeColors.text.accent : themeColors.text.secondary,
                            border: `1px solid ${themeColors.border}`
                          }}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    step="16"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full"
                    style={{ accentColor: themeColors.primary }}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: themeColors.text.secondary }}>
                    <span>128px</span>
                    <span>256px</span>
                    <span>384px</span>
                    <span>512px</span>
                  </div>
                </div>

                {/* Color Controls */}
                <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-1" style={{ color: themeColors.text.primary }}>
                        <Palette className="h-3 w-3" />
                        {t('bg_color', 'Background Color')}
                      </label>
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full h-10 rounded cursor-pointer"
                        style={{ border: `1px solid ${themeColors.border}` }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-1" style={{ color: themeColors.text.primary }}>
                        <Palette className="h-3 w-3" />
                        {t('fg_color', 'Foreground Color')}
                      </label>
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-full h-10 rounded cursor-pointer"
                        style={{ border: `1px solid ${themeColors.border}` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg flex items-center gap-2" style={{ 
                    backgroundColor: `${themeColors.error}10`,
                    color: themeColors.error,
                    border: `1px solid ${themeColors.error}30`
                  }}>
                    <div className="h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: themeColors.error, color: themeColors.text.accent }}>
                      !
                    </div>
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* QR Code Preview */}
                {showPreview && (
                  <div className="rounded-xl border p-6 text-center" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                    <h3 className="text-sm font-medium mb-4" style={{ color: themeColors.text.primary }}>
                      {t('preview', 'QR Code Preview')}
                    </h3>
                    <div className="flex justify-center">
                      <div className="p-4 rounded-lg" style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}` }}>
                        <QRCode
                          id="qr-code"
                          value={text}
                          size={size}
                          bgColor={bgColor}
                          fgColor={fgColor}
                          level="H"
                        />
                      </div>
                    </div>
                    <p className="text-xs mt-4" style={{ color: themeColors.text.secondary }}>
                      {t('scan_instruction', 'Scan this QR code with your phone camera')}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={downloadQRCode}
                    disabled={!text.trim()}
                    className="flex-1 py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                  >
                    <Download className="h-4 w-4" />
                    {t('download', 'Download QR Code')}
                  </button>
                  <button
                    onClick={copyToClipboard}
                    disabled={!text.trim()}
                    className="flex-1 py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? t('copied', 'Copied!') : t('copy', 'Copy Image')}
                  </button>
                  <button
                    onClick={shareQRCode}
                    disabled={!text.trim()}
                    className="flex-1 py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                  >
                    <Share2 className="h-4 w-4" />
                    {t('share', 'Share')}
                  </button>
                  <button
                    onClick={resetSettings}
                    className="px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center gap-2"
                    style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}
                  >
                    <RotateCcw className="h-4 w-4" />
                    {t('reset', 'Reset')}
                  </button>
                </div>

                {/* In-content Ad */}
                <CentralAd position="in-content" size="rectangle" />

                {/* QR Code Tips */}
                <div className="rounded-xl p-6" style={{ 
                  backgroundColor: `${themeColors.primary}10`,
                  border: `1px solid ${themeColors.primary}30`
                }}>
                  <h3 className="font-semibold mb-2" style={{ color: themeColors.primary }}>
                    {t('qr_tips', 'QR Code Tips')}
                  </h3>
                  <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: themeColors.primary }}>
                    <li>{t('tip_1', 'Make sure the content is correct before generating')}</li>
                    <li>{t('tip_2', 'Higher error correction (H level) makes codes more readable')}</li>
                    <li>{t('tip_3', 'Larger size = easier to scan from distance')}</li>
                    <li>{t('tip_4', 'Dark foreground on light background works best')}</li>
                    <li>{t('tip_5', 'Test the QR code with your phone before printing')}</li>
                  </ul>
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
                        {t('qr_history', 'QR Code History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_qrs', 'Your recently generated QR codes')}
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
                              <QrCode className="h-4 w-4" style={{ color: themeColors.primary }} />
                              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                {entry.text.length > 40 ? entry.text.substring(0, 40) + '...' : entry.text}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs" style={{ color: themeColors.text.secondary }}>
                              <span>{entry.size}px</span>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.bgColor, border: `1px solid ${themeColors.border}` }} />
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.fgColor, border: `1px solid ${themeColors.border}` }} />
                              </div>
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
                      {t('no_history', 'No QR code history yet')}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                      {t('history_will_appear', 'Your generated QR codes will appear here')}
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
