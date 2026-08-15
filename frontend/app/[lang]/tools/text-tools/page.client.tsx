// app/[lang]/tools/text-tools/page.client.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import { 
  FileText, Type, CaseSensitive, Search, Book, Code, Diff, 
  Key, Hash, Zap, Shield, Cpu, Users, CheckCircle, ArrowRight, 
  Sparkles, Star, Heart, Award, Download, Share2,
  Braces, Regex, Eye, AlignLeft, Scissors, Copy, Clipboard
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// ============================================
// PROFESSIONAL TEXT TOOLS PAGE
// ============================================

export default function TextToolsPageClient() {
  const params = useParams();
  const currentLang = (params?.lang as string) || 'en';
  
  const { themeColors, fontFamily } = useTheme();
  
  // ✅ DYNAMIC TRANSLATIONS
  const { t: tCommon, loading: commonLoading } = useTranslation({ namespace: 'common' });
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'text-tools' });
  
  // ✅ HYDRATION SAFETY
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // ✅ Get tool categories with translations
  const toolCategories = [
    { id: 'all', name: tTools('categories.all', 'All Tools'), icon: FileText },
    { id: 'analyze', name: tTools('categories.analyze', 'Analyze'), icon: AlignLeft },
    { id: 'transform', name: tTools('categories.transform', 'Transform'), icon: CaseSensitive },
    { id: 'generate', name: tTools('categories.generate', 'Generate'), icon: Book },
    { id: 'extract', name: tTools('categories.extract', 'Extract'), icon: Search },
    { id: 'develop', name: tTools('categories.develop', 'Develop'), icon: Braces },
    { id: 'security', name: tTools('categories.security', 'Security'), icon: Shield },
  ];
  
  // ✅ Get text tools with translations
  const getTextTools = () => [
    {
      slug: "word-counter",
      name: tTools('word_counter.name', 'Word Counter'),
      description: tTools('word_counter.description', 'AI-powered word analysis with readability scores and advanced metrics'),
      icon: FileText,
      category: "analyze",
      features: [
        tTools('word_counter.features.0', 'Word Count'),
        tTools('word_counter.features.1', 'Character Count'),
        tTools('word_counter.features.2', 'Reading Time'),
        tTools('word_counter.features.3', 'Keyword Density')
      ],
      popular: true,
      new: false,
      active: true
    },
    {
      slug: "character-counter",
      name: tTools('character_counter.name', 'Character Counter'),
      description: tTools('character_counter.description', 'Advanced character analysis with encoding detection and space optimization'),
      icon: Type,
      category: "analyze",
      features: [
        tTools('character_counter.features.0', 'Character Count'),
        tTools('character_counter.features.1', 'Encoding Detection'),
        tTools('character_counter.features.2', 'Space Analysis'),
        tTools('character_counter.features.3', 'Text Statistics')
      ],
      popular: false,
      new: false,
      active: true
    },
    {
      slug: "case-converter",
      name: tTools('case_converter.name', 'Case Converter'),
      description: tTools('case_converter.description', 'Smart case conversion with language detection and style preservation'),
      icon: CaseSensitive,
      category: "transform",
      features: [
        tTools('case_converter.features.0', 'Multiple Cases'),
        tTools('case_converter.features.1', 'Language Detection'),
        tTools('case_converter.features.2', 'Style Preservation'),
        tTools('case_converter.features.3', 'Batch Conversion')
      ],
      popular: true,
      new: false,
      active: true
    },
    {
      slug: "text-extractor",
      name: tTools('text_extractor.name', 'Text Extractor'),
      description: tTools('text_extractor.description', 'AI-powered pattern extraction for emails, URLs, and custom data patterns'),
      icon: Search,
      category: "extract",
      features: [
        tTools('text_extractor.features.0', 'Email Extraction'),
        tTools('text_extractor.features.1', 'URL Extraction'),
        tTools('text_extractor.features.2', 'Pattern Matching'),
        tTools('text_extractor.features.3', 'Data Validation')
      ],
      popular: false,
      new: false,
      active: true
    },
    {
      slug: "lorem-ipsum",
      name: tTools('lorem_ipsum.name', 'Lorem Ipsum Generator'),
      description: tTools('lorem_ipsum.description', 'Professional placeholder text with customizable length and formatting'),
      icon: Book,
      category: "generate",
      features: [
        tTools('lorem_ipsum.features.0', 'Custom Length'),
        tTools('lorem_ipsum.features.1', 'Multiple Formats'),
        tTools('lorem_ipsum.features.2', 'Paragraph Control'),
        tTools('lorem_ipsum.features.3', 'Export Options')
      ],
      popular: false,
      new: false,
      active: true
    },
    {
      slug: "markdown-editor",
      name: tTools('markdown_editor.name', 'Markdown Editor'),
      description: tTools('markdown_editor.description', 'Advanced Markdown editing with live preview and export options'),
      icon: Code,
      category: "transform",
      features: [
        tTools('markdown_editor.features.0', 'Live Preview'),
        tTools('markdown_editor.features.1', 'Syntax Highlighting'),
        tTools('markdown_editor.features.2', 'Export Options'),
        tTools('markdown_editor.features.3', 'Collaboration')
      ],
      popular: false,
      new: true,
      active: true
    },
    {
      slug: "regex-tester",
      name: tTools('regex_tester.name', 'Regex Tester'),
      description: tTools('regex_tester.description', 'Advanced regex testing with debugger and pattern library'),
      icon: Braces,
      category: "develop",
      features: [
        tTools('regex_tester.features.0', 'Pattern Testing'),
        tTools('regex_tester.features.1', 'Debugger'),
        tTools('regex_tester.features.2', 'Pattern Library'),
        tTools('regex_tester.features.3', 'Multiple Flavors')
      ],
      popular: false,
      new: false,
      active: true
    },
    {
      slug: "text-diff",
      name: tTools('text_diff.name', 'Text Diff Checker'),
      description: tTools('text_diff.description', 'Professional text comparison with syntax highlighting and merge tools'),
      icon: Diff,
      category: "analyze",
      features: [
        tTools('text_diff.features.0', 'Side-by-side'),
        tTools('text_diff.features.1', 'Syntax Highlighting'),
        tTools('text_diff.features.2', 'Merge Tools'),
        tTools('text_diff.features.3', 'History Tracking')
      ],
      popular: false,
      new: false,
      active: true
    },
    {
      slug: "uuid-generator",
      name: tTools('uuid_generator.name', 'UUID Generator'),
      description: tTools('uuid_generator.description', 'Secure UUID generation with multiple versions and bulk creation'),
      icon: Key,
      category: "generate",
      features: [
        tTools('uuid_generator.features.0', 'Multiple Versions'),
        tTools('uuid_generator.features.1', 'Bulk Creation'),
        tTools('uuid_generator.features.2', 'Format Options'),
        tTools('uuid_generator.features.3', 'Security')
      ],
      popular: false,
      new: false,
      active: true
    },
    {
      slug: "hash-generator",
      name: tTools('hash_generator.name', 'Hash Generator'),
      description: tTools('hash_generator.description', 'Cryptographic hash generation with multiple algorithms and verification'),
      icon: Hash,
      category: "security",
      features: [
        tTools('hash_generator.features.0', 'Multiple Algorithms'),
        tTools('hash_generator.features.1', 'File Hashing'),
        tTools('hash_generator.features.2', 'Verification'),
        tTools('hash_generator.features.3', 'Batch Processing')
      ],
      popular: false,
      new: false,
      active: true
    }
  ];
  
  // ✅ Get features with translations
  const getFeatures = () => [
    {
      icon: Zap,
      title: tTools('features.ai_powered.title', 'AI-Powered Analysis'),
      description: tTools('features.ai_powered.description', 'Smart text processing with intelligent pattern recognition')
    },
    {
      icon: Shield,
      title: tTools('features.zero_data.title', 'Zero Data Storage'),
      description: tTools('features.zero_data.description', 'All processing happens locally - your text never leaves your browser')
    },
    {
      icon: Cpu,
      title: tTools('features.fast.title', 'Lightning Fast'),
      description: tTools('features.fast.description', 'Optimized algorithms for instant results with large texts')
    },
    {
      icon: Users,
      title: tTools('features.professional.title', 'Professional Grade'),
      description: tTools('features.professional.description', 'Tools designed for writers, developers, and content creators')
    }
  ];
  
  // ✅ Get stats with translations
  const getStats = () => [
    { number: "10+", label: tTools('stats.tools', 'Professional Tools') },
    { number: "99.9%", label: tTools('stats.accuracy', 'Accuracy') },
    { number: "0ms", label: tTools('stats.delay', 'Server Delay') },
    { number: "100%", label: tTools('stats.client', 'Client-Side') }
  ];
  
  const textTools = getTextTools();
  const features = getFeatures();
  const stats = getStats();
  
  // Filter tools by category
  const filteredTools = activeCategory === 'all' 
    ? textTools 
    : textTools.filter(tool => tool.category === activeCategory);
  
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
                {tTools('hero.badge', 'AI-POWERED TEXT TOOLS')}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <span style={{ color: themeColors.primary }}>
                {tTools('hero.title_part1', 'Professional')}
              </span>
              <br />
              <span style={{ color: themeColors.text.primary }}>
                {tTools('hero.title_part2', 'Text Tools')}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200" 
               style={{ color: themeColors.text.secondary }}>
              {tTools('hero.description', 'Enterprise-grade text processing powered by artificial intelligence.')}
              <span style={{ color: themeColors.primary }}>
                {tTools('hero.description_highlight', ' Analyze, transform, generate, extract, ')}
              </span>
              {tTools('hero.description_end', 'and process text with professional accuracy and speed.')}
            </p>
            
            {/* Search Bar - using lucide-react's Search icon directly */}
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="relative">
                <input
                  type="text"
                  placeholder={tTools('hero.search_placeholder', 'Search text tools...')}
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
              {tTools('grid.title', 'All Text Tools Active')}
            </h2>
            <p className="text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('grid.subtitle', 'Click any tool to start processing text instantly')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {filteredTools.map((tool, index) => (
              <Link
                key={tool.slug}
                href={`/${currentLang}/tools/text-tools/${tool.slug}`}
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
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" style={{ color: themeColors.text.secondary }} />
              <p className="text-lg" style={{ color: themeColors.text.secondary }}>
                {tTools('grid.no_tools', 'No text tools found in this category.')}
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
              {tTools('features.subtitle', 'Built for accuracy, speed, and professional workflows')}
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
              {tTools('categories_grid.title', 'Text Tool Categories')}
            </h2>
            <p className="text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('categories_grid.subtitle', 'Organized by text processing workflows')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: tTools('categories_grid.analyze', 'Analyze'), count: "3 tools", icon: AlignLeft },
              { name: tTools('categories_grid.generate', 'Generate'), count: "2 tools", icon: Book },
              { name: tTools('categories_grid.transform', 'Transform'), count: "2 tools", icon: CaseSensitive },
              { name: tTools('categories_grid.develop', 'Develop'), count: "1 tool", icon: Braces },
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
                  onClick={() => setActiveCategory(category.name.toLowerCase())}
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
              {tTools('cta.title', 'Ready to Process Your Text?')}
            </h2>
            <p className="mb-6 md:mb-8 text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('cta.description', 'Join thousands of professionals who trust our tools for accurate, instant text processing with complete privacy.')}
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
                <FileText className="h-4 w-4 md:h-5 md:w-5" />
                {tTools('cta.documentation', 'View Documentation')}
              </Link>
            </div>
            <p className="mt-6 text-xs md:text-sm" style={{ color: themeColors.text.secondary }}>
              {tTools('cta.footer', 'No installation required • 100% free • Professional accuracy • All tools active')}
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