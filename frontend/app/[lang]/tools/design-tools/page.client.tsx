// app/[lang]/tools/design-tools/page.client.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import { 
  Palette, Droplets, Contrast, Brush, Layers, Ruler,
  Zap, Shield, Cpu, Users, CheckCircle, ArrowRight, 
  Sparkles, Star, Heart, Award, BookOpen, Download, Share2,
  Eye, Accessibility, PenTool, Grid, Sliders, Circle
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// ============================================
// PROFESSIONAL DESIGN TOOLS PAGE
// ============================================

export default function DesignToolsPageClient() {
  const params = useParams();
  const currentLang = (params?.lang as string) || 'en';
  
  const { themeColors, fontFamily } = useTheme();
  
  // ✅ DYNAMIC TRANSLATIONS
  const { t: tCommon, loading: commonLoading } = useTranslation({ namespace: 'common' });
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'design-tools' });
  
  // ✅ HYDRATION SAFETY
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // ✅ Get tool categories with translations
  const toolCategories = [
    { id: 'all', name: tTools('categories.all', 'All Tools'), icon: Palette },
    { id: 'color', name: tTools('categories.color', 'Color Tools'), icon: Droplets },
    { id: 'layout', name: tTools('categories.layout', 'Layout Tools'), icon: Grid },
    { id: 'accessibility', name: tTools('categories.accessibility', 'Accessibility'), icon: Eye },
  ];
  
  // ✅ Get design tools with translations
  const getDesignTools = () => [
    {
      slug: "color-picker",
      name: tTools('color_picker.name', 'Color Picker'),
      description: tTools('color_picker.description', 'Advanced color picker with accessibility analysis and palette generation'),
      icon: Palette,
      category: "color",
      features: [
        tTools('color_picker.features.0', 'Accessibility Analysis'),
        tTools('color_picker.features.1', 'Multiple Formats'),
        tTools('color_picker.features.2', 'Palette Generation'),
        tTools('color_picker.features.3', 'Contrast Check')
      ],
      popular: true,
      new: false,
      active: true
    },
    {
      slug: "palette-generator",
      name: tTools('palette_generator.name', 'Palette Generator'),
      description: tTools('palette_generator.description', 'Generate beautiful color palettes with AI assistance'),
      icon: Brush,
      category: "color",
      features: [
        tTools('palette_generator.features.0', 'Color Harmony'),
        tTools('palette_generator.features.1', 'AI Suggestions'),
        tTools('palette_generator.features.2', 'Export Palettes'),
        tTools('palette_generator.features.3', 'Color Rules')
      ],
      popular: false,
      new: true,
      active: false
    },
    {
      slug: "gradient-generator",
      name: tTools('gradient_generator.name', 'Gradient Generator'),
      description: tTools('gradient_generator.description', 'Create stunning CSS gradients with real-time preview'),
      icon: Layers,
      category: "color",
      features: [
        tTools('gradient_generator.features.0', 'Multi-stop'),
        tTools('gradient_generator.features.1', 'Linear/Radian'),
        tTools('gradient_generator.features.2', 'CSS Output'),
        tTools('gradient_generator.features.3', 'Preview')
      ],
      popular: false,
      new: true,
      active: false
    },
    {
      slug: "contrast-checker",
      name: tTools('contrast_checker.name', 'Contrast Checker'),
      description: tTools('contrast_checker.description', 'Check color contrast for WCAG accessibility compliance'),
      icon: Contrast,
      category: "accessibility",
      features: [
        tTools('contrast_checker.features.0', 'WCAG AA/AAA'),
        tTools('contrast_checker.features.1', 'Color Suggestions'),
        tTools('contrast_checker.features.2', 'Text Preview'),
        tTools('contrast_checker.features.3', 'Pass/Fail Rating')
      ],
      popular: false,
      new: true,
      active: false
    },
    {
      slug: "layout-tools",
      name: tTools('layout_tools.name', 'Layout Tools'),
      description: tTools('layout_tools.description', 'Grid systems, spacing calculators, and layout helpers'),
      icon: Grid,
      category: "layout",
      features: [
        tTools('layout_tools.features.0', 'Grid Calculator'),
        tTools('layout_tools.features.1', 'Spacing Scale'),
        tTools('layout_tools.features.2', 'Responsive Tools'),
        tTools('layout_tools.features.3', 'CSS Output')
      ],
      popular: false,
      new: false,
      active: false
    },
    {
      slug: "font-pairing",
      name: tTools('font_pairing.name', 'Font Pairing'),
      description: tTools('font_pairing.description', 'Find perfect font combinations for your designs'),
      icon: PenTool,
      category: "layout",
      features: [
        tTools('font_pairing.features.0', 'Font Library'),
        tTools('font_pairing.features.1', 'Style Preview'),
        tTools('font_pairing.features.2', 'CSS Code'),
        tTools('font_pairing.features.3', 'Google Fonts')
      ],
      popular: false,
      new: false,
      active: false
    }
  ];
  
  // ✅ Get features with translations
  const getFeatures = () => [
    {
      icon: Zap,
      title: tTools('features.ai_powered.title', 'AI-Powered Design'),
      description: tTools('features.ai_powered.description', 'Smart algorithms that enhance design workflows intelligently')
    },
    {
      icon: Shield,
      title: tTools('features.professional.title', 'Professional Tools'),
      description: tTools('features.professional.description', 'Enterprise-grade design utilities for professional workflows')
    },
    {
      icon: Cpu,
      title: tTools('features.real_time.title', 'Real-Time Processing'),
      description: tTools('features.real_time.description', 'Instant results with visual feedback and live previews')
    },
    {
      icon: Users,
      title: tTools('features.designer_focused.title', 'Designer Focused'),
      description: tTools('features.designer_focused.description', 'Tools built specifically for designers and creatives')
    }
  ];
  
  // ✅ Get stats with translations
  const getStats = () => [
    { number: "1+", label: tTools('stats.active', 'Active Tools') },
    { number: "5+", label: tTools('stats.coming', 'Coming Soon') },
    { number: "0ms", label: tTools('stats.delay', 'Server Delay') },
    { number: "100%", label: tTools('stats.client', 'Client-Side') }
  ];
  
  const designTools = getDesignTools();
  const features = getFeatures();
  const stats = getStats();
  
  // Filter tools by category
  const filteredTools = activeCategory === 'all' 
    ? designTools 
    : designTools.filter(tool => tool.category === activeCategory);
  
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
                {tTools('hero.badge', 'DESIGNER TOOLS SUITE')}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <span style={{ color: themeColors.primary }}>
                {tTools('hero.title_part1', 'Professional')}
              </span>
              <br />
              <span style={{ color: themeColors.text.primary }}>
                {tTools('hero.title_part2', 'Design Tools')}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200" 
               style={{ color: themeColors.text.secondary }}>
              {tTools('hero.description', 'Advanced design utilities powered by artificial intelligence.')}
              <span style={{ color: themeColors.primary }}>
                {tTools('hero.description_highlight', ' Color tools, palette generators, design systems, ')}
              </span>
              {tTools('hero.description_end', 'and professional workflows for modern designers.')}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="relative">
                <input
                  type="text"
                  placeholder={tTools('hero.search_placeholder', 'Search design tools...')}
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
              {tTools('grid.title', 'Design Tools')}
            </h2>
            <p className="text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('grid.subtitle', 'Professional utilities for designers and creatives')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {filteredTools.map((tool, index) => (
              <Link
                key={tool.slug}
                href={tool.active ? `/${currentLang}/tools/design-tools/${tool.slug}` : '#'}
                className={`block group animate-in fade-in slide-in-from-bottom-4 duration-500 ${!tool.active ? 'opacity-70' : ''}`}
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
                    if (tool.active) {
                      e.currentTarget.style.borderColor = themeColors.primary;
                      e.currentTarget.style.boxShadow = `0 10px 30px ${themeColors.primary}20`;
                    }
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
                      background: tool.active 
                        ? `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                        : themeColors.surface,
                      color: tool.active ? themeColors.text.accent : themeColors.text.primary
                    }}
                  >
                    <div className="absolute top-0 right-0 opacity-10">
                      <tool.icon className="h-24 w-24" />
                    </div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className={`rounded-xl p-2.5 ${tool.active ? 'bg-white/20' : ''}`} style={!tool.active ? { backgroundColor: `${themeColors.primary}10` } : {}}>
                        <tool.icon className="h-5 w-5 md:h-6 md:w-6" style={{ color: tool.active ? themeColors.text.accent : themeColors.primary }} />
                      </div>
                      <div className="flex gap-1">
                        {tool.popular && tool.active && (
                          <span className="bg-yellow-400/20 px-2 py-1 rounded-full text-xs font-bold border border-white/20">
                            {tTools('badge_labels.popular', 'Popular')}
                          </span>
                        )}
                        {tool.new && (
                          <span className="bg-green-400/20 px-2 py-1 rounded-full text-xs font-bold border border-white/20">
                            {tTools('badge_labels.new', 'New')}
                          </span>
                        )}
                        {!tool.active && (
                          <span className="bg-gray-400/20 px-2 py-1 rounded-full text-xs font-bold border border-white/20">
                            {tTools('badge_labels.coming', 'Coming Soon')}
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 relative z-10">{tool.name}</h3>
                    <p className={`text-xs md:text-sm leading-relaxed relative z-10 ${tool.active ? 'text-white/80' : 'opacity-70'}`}>
                      {tool.description}
                    </p>
                  </div>
                  
                  {/* Features List */}
                  <div className="p-4 md:p-5 grow" style={{ backgroundColor: themeColors.background }}>
                    <div className="space-y-2">
                      {tool.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 shrink-0" style={{ color: tool.active ? themeColors.primary : themeColors.text.secondary }} />
                          <span className={`text-xs md:text-sm ${tool.active ? '' : 'opacity-60'}`} style={{ color: tool.active ? themeColors.text.primary : themeColors.text.secondary }}>
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
                        style={{ color: tool.active ? themeColors.primary : themeColors.text.secondary }}
                      >
                        {tool.active ? tTools('grid.use_tool', 'Use Tool Now') : tTools('grid.coming_soon', 'Coming Soon')}
                      </span>
                      {tool.active && (
                        <ArrowRight className="h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" 
                          style={{ color: themeColors.primary }} 
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" style={{ color: themeColors.text.secondary }} />
              <p className="text-lg" style={{ color: themeColors.text.secondary }}>
                {tTools('grid.no_tools', 'No design tools found in this category.')}
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
              {tTools('features.title', 'Why Designers Love Our Tools?')}
            </h2>
            <p className="text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('features.subtitle', 'Built for creativity, precision, and professional design workflows')}
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
      
      {/* Color Picker Spotlight */}
      <section className="py-12 md:py-16" style={{ backgroundColor: themeColors.background }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl p-6 md:p-8 border" style={{ 
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border
          }}>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/3">
                <div 
                  className="w-32 h-32 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ 
                    background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                  }}
                >
                  <Palette className="h-16 w-16 text-white" />
                </div>
              </div>
              
              <div className="lg:w-2/3 text-center lg:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
                  {tTools('spotlight.title', 'Professional Color Picker')}
                </h2>
                <p className="mb-6 text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
                  {tTools('spotlight.description', 'Our flagship tool with advanced features for professional designers. Accessible color analysis, palette generation, and contrast checking.')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/${currentLang}/tools/design-tools/color-picker`}
                    className="px-6 md:px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2 justify-center text-sm md:text-base"
                    style={{ 
                      backgroundColor: themeColors.primary,
                      color: themeColors.text.accent
                    }}
                    prefetch={false}
                  >
                    <Palette className="h-4 w-4 md:h-5 md:w-5" />
                    {tTools('spotlight.open', 'Open Color Picker')}
                  </Link>
                  <Link
                    href="#"
                    className="px-6 md:px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2 justify-center border text-sm md:text-base"
                    style={{ 
                      backgroundColor: themeColors.background,
                      color: themeColors.primary,
                      borderColor: themeColors.primary
                    }}
                    prefetch={false}
                  >
                    <Brush className="h-4 w-4 md:h-5 md:w-5" />
                    {tTools('spotlight.tutorial', 'View Tutorial')}
                  </Link>
                </div>
              </div>
            </div>
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
              {tTools('cta.title', 'Ready to Design Like a Pro?')}
            </h2>
            <p className="mb-6 md:mb-8 text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('cta.description', 'Start with our professional color picker and stay tuned for more advanced design tools coming soon.')}
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
                href={`/${currentLang}/tools/design-tools/color-picker`}
                className="px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2 justify-center border text-sm md:text-base"
                style={{ 
                  backgroundColor: themeColors.background,
                  color: themeColors.primary,
                  borderColor: themeColors.primary
                }}
                prefetch={false}
              >
                <Palette className="h-4 w-4 md:h-5 md:w-5" />
                {tTools('cta.try_picker', 'Try Color Picker')}
              </Link>
            </div>
            <p className="mt-6 text-xs md:text-sm" style={{ color: themeColors.text.secondary }}>
              {tTools('cta.footer', 'More design tools in development • 100% free • Professional grade')}
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