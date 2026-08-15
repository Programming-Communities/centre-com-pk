// app/[lang]/tools/image-tools/page.client.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import { 
  Image, Zap, Shield, Cpu, Users, CheckCircle, ArrowRight, 
  Sparkles, Star, Heart, Award, BookOpen, Download, Share2,
  Crop, Minimize2, Palette, Wand2, RotateCw, Grid3x3, Smile, Layout
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// ============================================
// PROFESSIONAL IMAGE TOOLS PAGE
// ============================================

export default function ImageToolsPageClient() {
  const params = useParams();
  const currentLang = (params?.lang as string) || 'en';
  
  const { themeColors, fontFamily } = useTheme();
  
  // ✅ DYNAMIC TRANSLATIONS
  const { t: tCommon, loading: commonLoading } = useTranslation({ namespace: 'common' });
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'image-tools' });
  
  // ✅ HYDRATION SAFETY
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // ✅ Get tool categories with translations
  const toolCategories = [
    { id: 'all', name: tTools('categories.all', 'All Tools'), icon: Image },
    { id: 'resize', name: tTools('categories.resize', 'Resize & Crop'), icon: Crop },
    { id: 'compress', name: tTools('categories.compress', 'Compress'), icon: Minimize2 },
    { id: 'edit', name: tTools('categories.edit', 'Edit & Enhance'), icon: Wand2 },
    { id: 'convert', name: tTools('categories.convert', 'Convert'), icon: Palette },
    { id: 'generate', name: tTools('categories.generate', 'Generate'), icon: Grid3x3 },
  ];
  
  // ✅ Get image tools with translations
  const getImageTools = () => [
    {
      slug: "image-resizer",
      name: tTools('image_resizer.name', 'Image Resizer'),
      description: tTools('image_resizer.description', 'AI-powered image resizing with smart scaling and quality preservation'),
      icon: Image,
      category: "resize",
      features: [
        tTools('image_resizer.features.0', 'AI Enhance'),
        tTools('image_resizer.features.1', 'Smart Scaling'),
        tTools('image_resizer.features.2', 'Quality Preservation'),
        tTools('image_resizer.features.3', 'Batch Processing')
      ],
      popular: true,
      new: false,
      active: true
    },
    {
      slug: "image-compressor",
      name: tTools('image_compressor.name', 'Image Compressor'),
      description: tTools('image_compressor.description', 'Advanced compression algorithms reducing size without quality loss'),
      icon: Minimize2,
      category: "compress",
      features: [
        tTools('image_compressor.features.0', 'Lossless Compression'),
        tTools('image_compressor.features.1', 'Batch Processing'),
        tTools('image_compressor.features.2', 'Format Optimization'),
        tTools('image_compressor.features.3', 'Quality Control')
      ],
      popular: true,
      new: false,
      active: true
    },
    {
      slug: "background-remover",
      name: tTools('background_remover.name', 'Background Remover'),
      description: tTools('background_remover.description', 'Remove backgrounds from images automatically with AI precision'),
      icon: Wand2,
      category: "edit",
      features: [
        tTools('background_remover.features.0', 'AI Detection'),
        tTools('background_remover.features.1', 'Auto Background'),
        tTools('background_remover.features.2', 'Precision Masking'),
        tTools('background_remover.features.3', 'Edge Refinement')
      ],
      popular: true,
      new: false,
      active: true
    },
    {
      slug: "image-converter",
      name: tTools('image_converter.name', 'Image Converter'),
      description: tTools('image_converter.description', 'Convert between JPG, PNG, WebP, GIF, and other formats'),
      icon: Palette,
      category: "convert",
      features: [
        tTools('image_converter.features.0', 'Multiple Formats'),
        tTools('image_converter.features.1', 'Batch Convert'),
        tTools('image_converter.features.2', 'Quality Settings'),
        tTools('image_converter.features.3', 'Metadata Preserve')
      ],
      popular: false,
      new: false,
      active: true
    },
    {
      slug: "image-cropper",
      name: tTools('image_cropper.name', 'Image Cropper'),
      description: tTools('image_cropper.description', 'Smart cropping with aspect ratio presets and custom areas'),
      icon: Crop,
      category: "resize",
      features: [
        tTools('image_cropper.features.0', 'Aspect Ratios'),
        tTools('image_cropper.features.1', 'Freeform Crop'),
        tTools('image_cropper.features.2', 'Multiple Crops'),
        tTools('image_cropper.features.3', 'Smart Suggestions')
      ],
      popular: false,
      new: false,
      active: true
    },
    {
      slug: "image-filters",
      name: tTools('image_filters.name', 'Image Filters'),
      description: tTools('image_filters.description', 'Apply professional filters and effects to enhance images'),
      icon: Wand2,
      category: "edit",
      features: [
        tTools('image_filters.features.0', '50+ Filters'),
        tTools('image_filters.features.1', 'Adjustment Tools'),
        tTools('image_filters.features.2', 'Presets'),
        tTools('image_filters.features.3', 'Custom Effects')
      ],
      popular: false,
      new: false,
      active: true
    },
    {
      slug: "image-rotator",
      name: tTools('image_rotator.name', 'Image Rotator'),
      description: tTools('image_rotator.description', 'Rotate, flip, and straighten images with precision'),
      icon: RotateCw,
      category: "edit",
      features: [
        tTools('image_rotator.features.0', 'Angle Control'),
        tTools('image_rotator.features.1', 'Flip Options'),
        tTools('image_rotator.features.2', 'Auto Straighten'),
        tTools('image_rotator.features.3', 'Batch Process')
      ],
      popular: false,
      new: false,
      active: true
    },
    {
      slug: "favicon-generator",
      name: tTools('favicon_generator.name', 'Favicon Generator'),
      description: tTools('favicon_generator.description', 'Create favicons in all required sizes for websites'),
      icon: Grid3x3,
      category: "generate",
      features: [
        tTools('favicon_generator.features.0', 'Multiple Sizes'),
        tTools('favicon_generator.features.1', 'Format Support'),
        tTools('favicon_generator.features.2', 'Preview'),
        tTools('favicon_generator.features.3', 'Export Options')
      ],
      popular: false,
      new: true,
      active: true
    },
    {
      slug: "meme-generator",
      name: tTools('meme_generator.name', 'Meme Generator'),
      description: tTools('meme_generator.description', 'Create funny memes with popular templates and text'),
      icon: Smile,
      category: "generate",
      features: [
        tTools('meme_generator.features.0', 'Popular Templates'),
        tTools('meme_generator.features.1', 'Text Customization'),
        tTools('meme_generator.features.2', 'Font Styles'),
        tTools('meme_generator.features.3', 'Export')
      ],
      popular: false,
      new: true,
      active: true
    },
    {
      slug: "photo-collage",
      name: tTools('photo_collage.name', 'Photo Collage'),
      description: tTools('photo_collage.description', 'Combine multiple photos into beautiful collages'),
      icon: Layout,
      category: "generate",
      features: [
        tTools('photo_collage.features.0', 'Layout Templates'),
        tTools('photo_collage.features.1', 'Spacing Control'),
        tTools('photo_collage.features.2', 'Backgrounds'),
        tTools('photo_collage.features.3', 'Borders')
      ],
      popular: false,
      new: true,
      active: true
    }
  ];
  
  // ✅ Get features with translations
  const getFeatures = () => [
    {
      icon: Zap,
      title: tTools('features.ai_powered.title', 'AI-Powered Processing'),
      description: tTools('features.ai_powered.description', 'Smart algorithms that optimize images intelligently')
    },
    {
      icon: Shield,
      title: tTools('features.private.title', '100% Private & Secure'),
      description: tTools('features.private.description', 'All processing happens locally in your browser')
    },
    {
      icon: Cpu,
      title: tTools('features.fast.title', 'Lightning Fast'),
      description: tTools('features.fast.description', 'Optimized for instant results with large images')
    },
    {
      icon: Users,
      title: tTools('features.professional.title', 'Professional Grade'),
      description: tTools('features.professional.description', 'Tools used by designers and photographers worldwide')
    }
  ];
  
  // ✅ Get stats with translations
  const getStats = () => [
    { number: "10+", label: tTools('stats.tools', 'Professional Tools') },
    { number: "99.9%", label: tTools('stats.quality', 'Quality Preservation') },
    { number: "0ms", label: tTools('stats.delay', 'Server Delay') },
    { number: "100%", label: tTools('stats.client', 'Client-Side') }
  ];
  
  const imageTools = getImageTools();
  const features = getFeatures();
  const stats = getStats();
  
  // Filter tools by category
  const filteredTools = activeCategory === 'all' 
    ? imageTools 
    : imageTools.filter(tool => tool.category === activeCategory);
  
  // Get RTL direction
  const dir = currentLang === 'ur' || currentLang === 'ar' ? 'rtl' : 'ltr';
  
  // Show loading state
  if (!mounted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: themeColors?.background || '#ffffff' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-surface rounded-xl border border-border" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (commonLoading || toolsLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: themeColors?.background || '#ffffff' }}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-pulse text-primary text-lg">
              {tCommon('loading', 'Loading...')}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  
  // Get dynamic styles
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
    <div dir={dir} className="calculators-page" style={getDynamicStyles()} suppressHydrationWarning>
      {/* Top Banner Ad */}
      <CentralAd position="top" size="banner" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: themeColors.surface }}>
        <div className="absolute inset-0" style={{ 
          background: `radial-gradient(circle at 0% 0%, ${themeColors.primary}08, transparent 50%)` 
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center">
            <div 
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ 
                backgroundColor: `${themeColors.primary}10`,
                border: `1px solid ${themeColors.primary}30`
              }}
            >
              <Sparkles className="h-4 w-4" style={{ color: themeColors.primary }} />
              <span className="text-sm font-medium" style={{ color: themeColors.primary }}>
                {tTools('hero.badge', 'AI-POWERED IMAGE TOOLS')}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <span style={{ color: themeColors.primary }}>
                {tTools('hero.title_part1', 'Professional')}
              </span>
              <br />
              <span style={{ color: themeColors.text.primary }}>
                {tTools('hero.title_part2', 'Image Tools')}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200" 
               style={{ color: themeColors.text.secondary }}>
              {tTools('hero.description', 'Enterprise-grade image processing powered by artificial intelligence.')}
              <span style={{ color: themeColors.primary }}>
                {tTools('hero.description_highlight', ' Resize, compress, edit, enhance, and transform images ')}
              </span>
              {tTools('hero.description_end', 'with professional quality and speed.')}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="relative">
                <input
                  type="text"
                  placeholder={tTools('hero.search_placeholder', 'Search image tools...')}
                  className="w-full px-6 py-4 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                    color: themeColors.text.primary,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = themeColors.primary;
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = themeColors.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: themeColors.text.secondary }} />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 md:py-16" style={{ backgroundColor: themeColors.background }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="rounded-xl p-4 md:p-6 text-center border transition-all hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ 
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="text-2xl md:text-3xl font-bold mb-2" style={{ color: themeColors.primary }}>
                  {stat.number}
                </div>
                <div className="font-medium text-sm md:text-base" style={{ color: themeColors.text.secondary }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Left Sidebar Ad */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <CentralAd position="sidebar-left" size="skyscraper" />
      </div>
      
      {/* Category Filters */}
      <section className="py-8" style={{ backgroundColor: themeColors.surface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {toolCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    isActive ? 'scale-105' : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: isActive ? themeColors.primary : themeColors.background,
                    border: `1px solid ${isActive ? 'transparent' : themeColors.border}`,
                    color: isActive ? themeColors.text.accent : themeColors.text.primary,
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Tools Grid */}
      <section className="py-12 md:py-16" style={{ backgroundColor: themeColors.background }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: themeColors.text.primary }}>
              {tTools('grid.title', 'All Image Tools Active')}
            </h2>
            <p className="text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('grid.subtitle', 'Click any tool to start editing images instantly')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {filteredTools.map((tool, index) => (
              <Link
                key={tool.slug}
                href={`/${currentLang}/tools/image-tools/${tool.slug}`}
                className="block group animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
                prefetch={false}
              >
                <div 
                  className="rounded-xl overflow-hidden border h-full flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{ 
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.border
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = themeColors.primary;
                    e.currentTarget.style.boxShadow = `0 10px 30px ${themeColors.primary}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = themeColors.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Gradient Header */}
                  <div 
                    className="p-5 md:p-6 relative overflow-hidden"
                    style={{ 
                      background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                      color: themeColors.text.accent
                    }}
                  >
                    <div className="absolute top-0 right-0 opacity-10">
                      <tool.icon className="h-24 w-24" />
                    </div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="bg-white/20 rounded-xl p-2.5">
                        <tool.icon className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div className="flex gap-1">
                        {tool.popular && (
                          <span className="bg-yellow-400/20 px-2 py-1 rounded-full text-xs font-bold border border-white/20">
                            {tTools('badge_labels.popular', 'Popular')}
                          </span>
                        )}
                        {tool.new && (
                          <span className="bg-green-400/20 px-2 py-1 rounded-full text-xs font-bold border border-white/20">
                            {tTools('badge_labels.new', 'New')}
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 relative z-10">{tool.name}</h3>
                    <p className="text-white/80 text-xs md:text-sm leading-relaxed relative z-10">
                      {tool.description}
                    </p>
                  </div>
                  
                  {/* Features List */}
                  <div className="p-4 md:p-5 grow" style={{ backgroundColor: themeColors.background }}>
                    <div className="space-y-2">
                      {tool.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 shrink-0" style={{ color: themeColors.primary }} />
                          <span className="text-xs md:text-sm" style={{ color: themeColors.text.primary }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <div className="p-4 md:p-5 border-t" style={{ 
                    borderColor: themeColors.border,
                    backgroundColor: themeColors.surface 
                  }}>
                    <div className="flex items-center justify-between">
                      <span 
                        className="font-bold group-hover:underline text-xs md:text-sm transition-colors"
                        style={{ color: themeColors.primary }}
                      >
                        {tTools('grid.use_tool', 'Use Tool Now')}
                      </span>
                      <ArrowRight className="h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" 
                        style={{ color: themeColors.primary }} 
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <Image className="h-12 w-12 mx-auto mb-4 opacity-50" style={{ color: themeColors.text.secondary }} />
              <p className="text-lg" style={{ color: themeColors.text.secondary }}>
                {tTools('grid.no_tools', 'No image tools found in this category.')}
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* In-content Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 my-8">
        <CentralAd position="in-content" size="rectangle" />
      </div>
      
      {/* Features Section */}
      <section className="py-12 md:py-16" style={{ backgroundColor: themeColors.surface }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: themeColors.text.primary }}>
              {tTools('features.title', 'Why Professionals Choose Our Tools?')}
            </h2>
            <p className="text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('features.subtitle', 'Built for quality, speed, and professional workflows')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="rounded-xl p-5 md:p-6 text-center border transition-all hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ 
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.border,
                  animationDelay: `${index * 100}ms`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = themeColors.primary;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = themeColors.border;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${themeColors.primary}10` }}
                >
                  <feature.icon className="h-6 w-6" style={{ color: themeColors.primary }} />
                </div>
                <h3 className="text-base md:text-lg font-bold mb-2" style={{ color: themeColors.text.primary }}>
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm" style={{ color: themeColors.text.secondary }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Right Sidebar Ad */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 my-8">
        <CentralAd position="sidebar-right" size="skyscraper" />
      </div>
      
      {/* Categories Grid */}
      <section className="py-12 md:py-16" style={{ backgroundColor: themeColors.background }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: themeColors.text.primary }}>
              {tTools('categories_grid.title', 'Image Tool Categories')}
            </h2>
            <p className="text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('categories_grid.subtitle', 'Organized by image processing needs and workflows')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: tTools('categories_grid.resize', 'Resize & Crop'), count: "2 tools", icon: Crop },
              { name: tTools('categories_grid.compress', 'Compress'), count: "1 tool", icon: Minimize2 },
              { name: tTools('categories_grid.edit', 'Edit & Enhance'), count: "3 tools", icon: Wand2 },
              { name: tTools('categories_grid.generate', 'Generate'), count: "3 tools", icon: Grid3x3 },
            ].map((category, index) => {
              const Icon = category.icon;
              return (
                <div 
                  key={index} 
                  className="rounded-xl p-5 md:p-6 text-center border transition-all hover:scale-105 cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ 
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.border,
                    animationDelay: `${index * 100}ms`
                  }}
                  onClick={() => setActiveCategory(category.name.toLowerCase().replace(' & ', '-').split(' ')[0])}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = themeColors.primary;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = themeColors.border;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div 
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4"
                    style={{ 
                      background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                    }}
                  >
                    <Icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <h3 className="text-sm md:text-lg font-bold mb-1" style={{ color: themeColors.text.primary }}>
                    {category.name}
                  </h3>
                  <p className="text-xs md:text-sm" style={{ color: themeColors.text.secondary }}>
                    {category.count}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-12 md:py-16" style={{ backgroundColor: themeColors.surface }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div 
            className="rounded-xl p-6 md:p-8 border animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ 
              backgroundColor: themeColors.background,
              borderColor: themeColors.border
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4" style={{ color: themeColors.text.primary }}>
              {tTools('cta.title', 'Ready to Transform Your Images?')}
            </h2>
            <p className="mb-6 md:mb-8 text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('cta.description', 'Join thousands of professionals who trust our tools for high-quality, instant image processing with complete privacy.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link
                href={`/${currentLang}/tools`}
                className="px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2 justify-center text-sm md:text-base"
                style={{ 
                  backgroundColor: themeColors.primary,
                  color: themeColors.text.accent
                }}
                prefetch={false}
              >
                <Zap className="h-4 w-4 md:h-5 md:w-5" />
                {tTools('cta.explore_all', 'Explore All Tools')}
              </Link>
              <Link
                href="#"
                className="px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2 justify-center border text-sm md:text-base"
                style={{ 
                  backgroundColor: themeColors.background,
                  color: themeColors.primary,
                  borderColor: themeColors.primary
                }}
                prefetch={false}
              >
                <Image className="h-4 w-4 md:h-5 md:w-5" />
                {tTools('cta.view_gallery', 'View Gallery')}
              </Link>
            </div>
            <p className="mt-6 text-xs md:text-sm" style={{ color: themeColors.text.secondary }}>
              {tTools('cta.footer', 'No installation required • 100% free • Professional quality • All tools active')}
            </p>
          </div>
        </div>
      </section>
      
      {/* Bottom Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <CentralAd position="bottom" size="banner" />
      </div>
    </div>
  );
}

// Search icon component
function Search(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}