
"use client";

import ToolContentRenderer from '@/components/tools/ToolContentRenderer';
  // components/tools/image-tools/meme-generator/tool.client.tsx

  import { useState, useRef, useEffect } from "react";
  import { Download, Upload, Type, Image as ImageIcon, Sparkles, CheckCircle, X, History, Share2, Trash2, Info, Plus, Minus, Move, Palette, AlignCenter, Bold, Italic, Underline, RefreshCw } from "lucide-react";
  import { useTheme } from '@/components/theme';
  import { useTranslation } from '@/hooks/useTranslation';
  import { useParams } from 'next/navigation';
  import CentralAd from '@/components/ads/CentralAd';

  interface MemeText {
    text: string;
    position: { x: number; y: number };
    fontSize: number;
    color: string;
    strokeColor: string;
    bold: boolean;
    italic: boolean;
  }

  interface HistoryEntry {
    id: number;
    originalImage: string;
    memeImage: string;
    texts: MemeText[];
    fileName: string;
    timestamp: string;
  }

  const popularMemes = [
    { name: "drake", label: "Drake Hotline Bling", icon: "🎵", defaultImage: "/api/placeholder/400/400" },
    { name: "distracted", label: "Distracted Boyfriend", icon: "👀", defaultImage: "/api/placeholder/400/300" },
    { name: "two_buttons", label: "Two Buttons", icon: "🔘", defaultImage: "/api/placeholder/400/300" },
    { name: "change_mind", label: "Change My Mind", icon: "💭", defaultImage: "/api/placeholder/400/300" },
    { name: "woman_cat", label: "Woman Yelling at Cat", icon: "😾", defaultImage: "/api/placeholder/400/300" },
    { name: "left_exit", label: "Left Exit 12 Off Ramp", icon: "🛣️", defaultImage: "/api/placeholder/400/300" },
    { name: "disaster_girl", label: "Disaster Girl", icon: "🔥", defaultImage: "/api/placeholder/400/400" },
    { name: "roll_safe", label: "Roll Safe", icon: "🧠", defaultImage: "/api/placeholder/400/400" },
  ];

  export default function MemeGeneratorClient() {
    const params = useParams();
    const lang = (params?.lang as string) || 'en';

    const { themeColors, fontFamily } = useTheme();
    const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'image-tools' });
    const [mounted, setMounted] = useState(false);
    
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [memeImage, setMemeImage] = useState<string | null>(null);
    const [texts, setTexts] = useState<MemeText[]>([
      { text: "TOP TEXT", position: { x: 50, y: 15 }, fontSize: 40, color: "#ffffff", strokeColor: "#000000", bold: true, italic: false },
      { text: "BOTTOM TEXT", position: { x: 50, y: 85 }, fontSize: 40, color: "#ffffff", strokeColor: "#000000", bold: true, italic: false },
    ]);
    const [selectedTextIndex, setSelectedTextIndex] = useState<number>(0);
    const [fileName, setFileName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [activeTab, setActiveTab] = useState<'generator' | 'history'>('generator');
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    // Translation helper
    const t = (key: string, defaultValue?: string): string => {
      const toolKey = `meme_generator.${key}`;
      const value = tTools(toolKey);
      return value === toolKey ? (defaultValue || key) : value;
    };

    useEffect(() => {
      setMounted(true);
      const savedHistory = localStorage.getItem('meme-generator-history');
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

    const generateMeme = (imageSrc: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        texts.forEach((memeText) => {
          if (memeText.text.trim()) {
            let fontStyle = '';
            if (memeText.bold) fontStyle += 'bold ';
            if (memeText.italic) fontStyle += 'italic ';
            ctx.font = `${fontStyle}${memeText.fontSize}px Impact, "Arial Black", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const x = (memeText.position.x / 100) * canvas.width;
            const y = (memeText.position.y / 100) * canvas.height;
            
            // Text stroke (outline)
            ctx.strokeStyle = memeText.strokeColor;
            ctx.lineWidth = Math.max(3, memeText.fontSize / 12);
            ctx.strokeText(memeText.text, x, y);
            
            // Text fill
            ctx.fillStyle = memeText.color;
            ctx.fillText(memeText.text, x, y);
          }
        });
        
        const result = canvas.toDataURL('image/png');
        setMemeImage(result);
        setIsProcessing(false);
      };
      
      img.onerror = () => {
        setError(t('image_load_error', 'Failed to load image. Please try again.'));
        setIsProcessing(false);
      };
      
      img.src = imageSrc;
    };

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
        setIsProcessing(true);
        generateMeme(imageUrl);
        setSuccessMessage(t('upload_success', '✓ "{name}" uploaded successfully!').replace('{name}', file.name));
      };
      reader.readAsDataURL(file);
    };

    const useTemplate = (templateName: string) => {
      setFileName(`${templateName}-template`);
      // In production, load actual template images
      // For now, create a placeholder canvas
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#999';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(templateName, canvas.width / 2, canvas.height / 2);
        const templateUrl = canvas.toDataURL();
        setOriginalImage(templateUrl);
        setIsProcessing(true);
        generateMeme(templateUrl);
        setSuccessMessage(t('template_loaded', `✓ ${templateName} template loaded!`));
      }
    };

    const updateText = (index: number, field: keyof MemeText, value: any) => {
      const newTexts = [...texts];
      newTexts[index] = { ...newTexts[index], [field]: value };
      setTexts(newTexts);
      if (originalImage) {
        setIsProcessing(true);
        generateMeme(originalImage);
      }
    };

    const updateTextPosition = (index: number, x: number, y: number) => {
      const newTexts = [...texts];
      newTexts[index].position = { x, y };
      setTexts(newTexts);
      if (originalImage) {
        setIsProcessing(true);
        generateMeme(originalImage);
      }
    };

    const addText = () => {
      setTexts([
        ...texts,
        { text: t('new_text', 'NEW TEXT'), position: { x: 50, y: 50 }, fontSize: 36, color: "#ffffff", strokeColor: "#000000", bold: true, italic: false }
      ]);
      setSelectedTextIndex(texts.length);
    };

    const removeText = (index: number) => {
      if (texts.length > 1) {
        const newTexts = texts.filter((_, i) => i !== index);
        setTexts(newTexts);
        setSelectedTextIndex(Math.max(0, index - 1));
        if (originalImage) {
          setIsProcessing(true);
          generateMeme(originalImage);
        }
      }
    };

    const duplicateText = (index: number) => {
      const newText = { ...texts[index], text: texts[index].text + " (copy)" };
      const newTexts = [...texts, newText];
      setTexts(newTexts);
      setSelectedTextIndex(newTexts.length - 1);
      if (originalImage) {
        setIsProcessing(true);
        generateMeme(originalImage);
      }
    };

    const downloadMeme = () => {
      if (!memeImage) return;
      
      const link = document.createElement('a');
      const name = fileName ? fileName.replace(/\.[^/.]+$/, "") : 'meme';
      link.download = `${name}-meme.png`;
      link.href = memeImage;
      link.click();
      setSuccessMessage(t('download_success', '✓ Meme downloaded successfully!'));
    };

    const shareMeme = async () => {
      if (!memeImage) return;
      
      try {
        const response = await fetch(memeImage);
        const blob = await response.blob();
        const file = new File([blob], `${fileName || 'meme'}-meme.png`, { type: 'image/png' });
        
        if (navigator.share) {
          await navigator.share({
            title: t('share_title', 'My Meme'),
            files: [file]
          });
        } else {
          await navigator.clipboard.write([
            new ClipboardItem({
              [file.type]: file
            })
          ]);
          setSuccessMessage(t('copied_to_clipboard', 'Meme copied to clipboard!'));
        }
      } catch (err) {
        console.error('Share failed:', err);
      }
    };

    const resetTool = () => {
      setOriginalImage(null);
      setMemeImage(null);
      setTexts([
        { text: "TOP TEXT", position: { x: 50, y: 15 }, fontSize: 40, color: "#ffffff", strokeColor: "#000000", bold: true, italic: false },
        { text: "BOTTOM TEXT", position: { x: 50, y: 85 }, fontSize: 40, color: "#ffffff", strokeColor: "#000000", bold: true, italic: false },
      ]);
      setSelectedTextIndex(0);
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
        localStorage.removeItem('meme-generator-history');
      } catch (e) {
        console.error('Error clearing localStorage:', e);
      }
    };

    const loadHistoryEntry = (entry: HistoryEntry) => {
      setOriginalImage(entry.originalImage);
      setMemeImage(entry.memeImage);
      setTexts(entry.texts);
      setFileName(entry.fileName);
      setActiveTab('generator');
      setSelectedTextIndex(0);
    };

    const saveToHistory = () => {
      if (!originalImage || !memeImage) return;
      
      const historyEntry: HistoryEntry = {
        id: Date.now(),
        originalImage: originalImage,
        memeImage: memeImage,
        texts: [...texts],
        fileName: fileName,
        timestamp: new Date().toISOString()
      };
      const newHistory = [historyEntry, ...history.slice(0, 9)];
      setHistory(newHistory);
      try {
        localStorage.setItem('meme-generator-history', JSON.stringify(newHistory));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
      setSuccessMessage(t('saved_to_history', '✓ Meme saved to history!'));
    };

    const currentText = texts[selectedTextIndex];

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
                <Sparkles className="h-8 w-8" style={{ color: themeColors.primary }} />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
              {t('title', 'Meme Generator')}
            </h1>
            <p className="text-lg" style={{ color: themeColors.text.secondary }}>
              {t('description', 'Create hilarious memes with popular templates or your own images')}
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
              <Sparkles className="h-4 w-4" />
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

                  {/* Template Selection */}
                  {!originalImage && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                          <ImageIcon className="h-4 w-4" style={{ color: themeColors.primary }} />
                          {t('choose_template', 'Choose a Template')}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {popularMemes.map((meme, index) => (
                            <button
                              key={index}
                              onClick={() => useTemplate(meme.label)}
                              className="p-3 rounded-lg border text-center transition-all hover:scale-105"
                              style={{ backgroundColor: themeColors.background, borderColor: themeColors.border }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = themeColors.primary;
                                e.currentTarget.style.backgroundColor = `${themeColors.primary}10`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = themeColors.border;
                                e.currentTarget.style.backgroundColor = themeColors.background;
                              }}
                            >
                              <div className="text-2xl mb-1">{meme.icon}</div>
                              <div className="text-xs" style={{ color: themeColors.text.primary }}>{meme.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t" style={{ borderColor: themeColors.border }} />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="px-2 bg-background" style={{ backgroundColor: themeColors.background, color: themeColors.text.secondary }}>{t('or', 'OR')}</span>
                        </div>
                      </div>

                      {/* Upload Your Own */}
                      <div className="rounded-xl border-2 border-dashed p-8 text-center" style={{ borderColor: themeColors.border }}>
                        <div className="inline-flex items-center justify-center p-4 rounded-full mb-4" style={{ backgroundColor: `${themeColors.primary}10` }}>
                          <Upload className="h-8 w-8" style={{ color: themeColors.primary }} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: themeColors.text.primary }}>
                          {t('upload_title', 'Upload Your Own Image')}
                        </h3>
                        <p className="mb-6" style={{ color: themeColors.text.secondary }}>
                          {t('upload_desc', 'Use your own image to create a custom meme')}
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
                    </div>
                  )}

                  {originalImage && (
                    <div className="space-y-6">
                      {/* Meme Preview */}
                      <div>
                        <h3 className="font-semibold mb-3" style={{ color: themeColors.text.primary }}>{t('preview', 'Meme Preview')}</h3>
                        <div className="rounded-lg border p-4" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                          {memeImage && isProcessing ? (
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2" />
                              <p className="text-sm" style={{ color: themeColors.text.secondary }}>{t('generating', 'Generating meme...')}</p>
                            </div>
                          ) : (
                            <img src={memeImage || originalImage} alt="Meme" className="max-w-full h-auto mx-auto rounded" />
                          )}
                          <canvas ref={canvasRef} className="hidden" />
                        </div>
                      </div>

                      {/* Text Controls */}
                      <div className="rounded-xl border p-6" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                            <Type className="h-4 w-4" style={{ color: themeColors.primary }} />
                            {t('text_controls', 'Text Controls')}
                          </h3>
                          <button
                            onClick={addText}
                            className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                          >
                            <Plus className="h-3 w-3" />
                            {t('add_text', 'Add Text')}
                          </button>
                        </div>

                        {/* Text Selection */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                            {t('select_text', 'Select Text')}:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {texts.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedTextIndex(index)}
                                className={`px-3 py-1 text-sm rounded-lg transition-all ${selectedTextIndex === index ? 'scale-105' : 'hover:scale-102'}`}
                                style={{ 
                                  backgroundColor: selectedTextIndex === index ? `${themeColors.primary}10` : themeColors.background,
                                  border: `1px solid ${selectedTextIndex === index ? themeColors.primary : themeColors.border}`,
                                  color: selectedTextIndex === index ? themeColors.primary : themeColors.text.primary
                                }}
                              >
                                {t('text', 'Text')} {index + 1}
                              </button>
                            ))}
                          </div>
                        </div>

                        {currentText && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                                {t('text_content', 'Text Content')}:
                              </label>
                              <input
                                type="text"
                                value={currentText.text}
                                onChange={(e) => updateText(selectedTextIndex, 'text', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }}
                                placeholder={t('enter_text', 'Enter meme text...')}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                                  {t('position_x', 'Position X')}: {currentText.position.x}%
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={currentText.position.x}
                                  onChange={(e) => updateTextPosition(selectedTextIndex, parseInt(e.target.value), currentText.position.y)}
                                  className="w-full"
                                  style={{ accentColor: themeColors.primary }}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                                  {t('position_y', 'Position Y')}: {currentText.position.y}%
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={currentText.position.y}
                                  onChange={(e) => updateTextPosition(selectedTextIndex, currentText.position.x, parseInt(e.target.value))}
                                  className="w-full"
                                  style={{ accentColor: themeColors.primary }}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                                {t('font_size', 'Font Size')}: {currentText.fontSize}px
                              </label>
                              <input
                                type="range"
                                min="16"
                                max="80"
                                value={currentText.fontSize}
                                onChange={(e) => updateText(selectedTextIndex, 'fontSize', parseInt(e.target.value))}
                                className="w-full"
                                style={{ accentColor: themeColors.primary }}
                              />
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={() => updateText(selectedTextIndex, 'bold', !currentText.bold)}
                                className={`p-2 rounded-lg transition-all ${currentText.bold ? 'scale-105' : 'hover:scale-102'}`}
                                style={{ 
                                  backgroundColor: currentText.bold ? `${themeColors.primary}10` : themeColors.background,
                                  border: `1px solid ${currentText.bold ? themeColors.primary : themeColors.border}`,
                                  color: currentText.bold ? themeColors.primary : themeColors.text.primary
                                }}
                              >
                                <Bold className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => updateText(selectedTextIndex, 'italic', !currentText.italic)}
                                className={`p-2 rounded-lg transition-all ${currentText.italic ? 'scale-105' : 'hover:scale-102'}`}
                                style={{ 
                                  backgroundColor: currentText.italic ? `${themeColors.primary}10` : themeColors.background,
                                  border: `1px solid ${currentText.italic ? themeColors.primary : themeColors.border}`,
                                  color: currentText.italic ? themeColors.primary : themeColors.text.primary
                                }}
                              >
                                <Italic className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                                  {t('text_color', 'Text Color')}:
                                </label>
                                <input
                                  type="color"
                                  value={currentText.color}
                                  onChange={(e) => updateText(selectedTextIndex, 'color', e.target.value)}
                                  className="w-full h-10 rounded cursor-pointer"
                                  style={{ border: `1px solid ${themeColors.border}` }}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                                  {t('stroke_color', 'Stroke Color')}:
                                </label>
                                <input
                                  type="color"
                                  value={currentText.strokeColor}
                                  onChange={(e) => updateText(selectedTextIndex, 'strokeColor', e.target.value)}
                                  className="w-full h-10 rounded cursor-pointer"
                                  style={{ border: `1px solid ${themeColors.border}` }}
                                />
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => duplicateText(selectedTextIndex)}
                                className="flex-1 py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary, border: `1px solid ${themeColors.primary}30` }}
                              >
                                <Copy className="h-3 w-3" />
                                {t('duplicate', 'Duplicate')}
                              </button>
                              {texts.length > 1 && (
                                <button
                                  onClick={() => removeText(selectedTextIndex)}
                                  className="flex-1 py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
                                  style={{ backgroundColor: `${themeColors.error}10`, color: themeColors.error, border: `1px solid ${themeColors.error}30` }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                  {t('remove', 'Remove')}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={downloadMeme}
                          disabled={!memeImage || isProcessing}
                          className="flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
                          style={{ backgroundColor: themeColors.success, color: '#fff' }}
                        >
                          <Download className="h-4 w-4" />
                          {t('download', 'Download Meme')}
                        </button>
                        <button
                          onClick={shareMeme}
                          disabled={!memeImage || isProcessing}
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
                          {t('new_meme', 'New Meme')}
                        </button>
                      </div>

                      {/* Save to History Button */}
                      <button
                        onClick={saveToHistory}
                        className="w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary, border: `1px solid ${themeColors.primary}30` }}
                      >
                        <History className="h-4 w-4" />
                        {t('save_to_history', 'Save This Meme to History')}
                      </button>

                      {/* In-content Ad */}
                      <CentralAd position="in-content" size="rectangle" />

                      {/* Meme Tips */}
                      <div className="rounded-xl p-6" style={{ backgroundColor: `${themeColors.primary}10`, border: `1px solid ${themeColors.primary}30` }}>
                        <div className="flex items-center gap-2 mb-4">
                          <Info className="h-5 w-5" style={{ color: themeColors.primary }} />
                          <h3 className="font-semibold" style={{ color: themeColors.primary }}>{t('meme_tips', 'Meme Creation Tips')}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm" style={{ color: themeColors.text.secondary }}>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                            <span>{t('tip_1', 'Keep text short and punchy for maximum impact')}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                            <span>{t('tip_2', 'Use high-contrast colors for better readability')}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                            <span>{t('tip_3', 'Position text in empty areas of the image')}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: themeColors.success }} />
                            <span>{t('tip_4', 'Impact font is the classic meme font for a reason')}</span>
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
                          {t('meme_history', 'Meme History')}
                        </h2>
                        <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                          {t('recent_memes', 'Your recently created memes')}
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
                                <Sparkles className="h-4 w-4" style={{ color: themeColors.primary }} />
                                <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>
                                  {entry.fileName}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                                  {entry.texts.length} {t('text_layers', 'text layers')}
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
                        {t('no_history', 'No meme history yet')}
                      </p>
                      <p className="text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
                        {t('history_will_appear', 'Your created memes will appear here')}
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
          
        {/* Related Blog Posts — SEO Internal Linking */}
        <div className="mt-8">
        </div>

          {/* Bottom Ad */}
        </div>
      </div>
    );
  }


  // Helper component for Copy icon
  function Copy(props: React.SVGProps<SVGSVGElement>) {
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
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    );
  }
