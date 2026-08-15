// app/[lang]/tools/code-tools/page.client.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import { 
  Code, Braces, FileCode, Terminal, QrCode, Lock, Hash, 
  Link as LinkIcon, Palette, Zap, Shield, Cpu, GitBranch, 
  CheckCircle, ArrowRight, Sparkles, Users, Clock, Globe,
  Star, Heart, Award, TrendingUp, BookOpen, Download, Share2
} from "lucide-react";
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// ============================================
// PROFESSIONAL CODE TOOLS PAGE
// MATCHES CALCULATORS PAGE STANDARDS
// ============================================

export default function CodeToolsPageClient() {
  const params = useParams();
  const currentLang = (params?.lang as string) || 'en';
  
  const { themeColors, fontFamily, isDarkMode } = useTheme();
  
  // ✅ DYNAMIC TRANSLATIONS
  const { t: tCommon, loading: commonLoading } = useTranslation({ namespace: 'common' });
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'code-tools' });
  
  // ✅ HYDRATION SAFETY
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // ✅ Get tool categories with translations
  const toolCategories = [
    { id: 'all', name: tTools('categories.all', 'All Tools'), icon: Code },
    { id: 'formatter', name: tTools('categories.formatter', 'Formatters'), icon: Braces },
    { id: 'encoder', name: tTools('categories.encoder', 'Encoders'), icon: Hash },
    { id: 'generator', name: tTools('categories.generator', 'Generators'), icon: QrCode },
    { id: 'security', name: tTools('categories.security', 'Security'), icon: Lock },
    { id: 'design', name: tTools('categories.design', 'Design'), icon: Palette },
  ];
  
  // ✅ Get code tools with translations
  const getCodeTools = () => [
    {
      slug: "json-formatter",
      name: tTools('json_formatter.name', 'JSON Formatter'),
      description: tTools('json_formatter.description', 'Advanced JSON formatting with syntax highlighting and validation'),
      icon: Braces,
      category: "formatter",
      features: [
        tTools('json_formatter.features.0', 'Syntax Highlighting'),
        tTools('json_formatter.features.1', 'Validation'),
        tTools('json_formatter.features.2', 'Minify/Beautify'),
        tTools('json_formatter.features.3', 'Tree View')
      ],
      popular: true,
      new: false
    },
    {
      slug: "qr-code-generator",
      name: tTools('qr_code_generator.name', 'QR Code Generator'),
      description: tTools('qr_code_generator.description', 'Professional QR code generation with customization and analytics'),
      icon: QrCode,
      category: "generator",
      features: [
        tTools('qr_code_generator.features.0', 'Custom Design'),
        tTools('qr_code_generator.features.1', 'Logo Support'),
        tTools('qr_code_generator.features.2', 'Multiple Formats'),
        tTools('qr_code_generator.features.3', 'Analytics')
      ],
      popular: true,
      new: false
    },
    {
      slug: "html-formatter",
      name: tTools('html_formatter.name', 'HTML Formatter'),
      description: tTools('html_formatter.description', 'Smart HTML formatting with semantic analysis and optimization'),
      icon: FileCode,
      category: "formatter",
      features: [
        tTools('html_formatter.features.0', 'Semantic Analysis'),
        tTools('html_formatter.features.1', 'HTML5 Support'),
        tTools('html_formatter.features.2', 'Minify/Beautify'),
        tTools('html_formatter.features.3', 'Validation')
      ],
      popular: false,
      new: false
    },
    {
      slug: "css-formatter",
      name: tTools('css_formatter.name', 'CSS Formatter'),
      description: tTools('css_formatter.description', 'Advanced CSS beautification with vendor prefix optimization'),
      icon: FileCode,
      category: "formatter",
      features: [
        tTools('css_formatter.features.0', 'Vendor Prefix'),
        tTools('css_formatter.features.1', 'CSS3 Support'),
        tTools('css_formatter.features.2', 'Minify/Beautify'),
        tTools('css_formatter.features.3', 'Validation')
      ],
      popular: false,
      new: false
    },
    {
      slug: "javascript-formatter",
      name: tTools('javascript_formatter.name', 'JavaScript Formatter'),
      description: tTools('javascript_formatter.description', 'Professional JS formatting with ES6+ syntax support'),
      icon: Terminal,
      category: "formatter",
      features: [
        tTools('javascript_formatter.features.0', 'ES6+ Support'),
        tTools('javascript_formatter.features.1', 'Syntax Check'),
        tTools('javascript_formatter.features.2', 'Minify/Beautify'),
        tTools('javascript_formatter.features.3', 'Debugging')
      ],
      popular: true,
      new: false
    },
    {
      slug: "xml-formatter",
      name: tTools('xml_formatter.name', 'XML Formatter'),
      description: tTools('xml_formatter.description', 'Enterprise XML formatting with schema validation'),
      icon: FileCode,
      category: "formatter",
      features: [
        tTools('xml_formatter.features.0', 'Schema Validation'),
        tTools('xml_formatter.features.1', 'Tree View'),
        tTools('xml_formatter.features.2', 'Minify/Beautify'),
        tTools('xml_formatter.features.3', 'XPath')
      ],
      popular: false,
      new: false
    },
    {
      slug: "password-generator",
      name: tTools('password_generator.name', 'Password Generator'),
      description: tTools('password_generator.description', 'Military-grade password generation with entropy analysis'),
      icon: Lock,
      category: "security",
      features: [
        tTools('password_generator.features.0', 'Entropy Analysis'),
        tTools('password_generator.features.1', 'Multiple Patterns'),
        tTools('password_generator.features.2', 'Strength Meter'),
        tTools('password_generator.features.3', 'Secure')
      ],
      popular: true,
      new: false
    },
    {
      slug: "base64-encoder",
      name: tTools('base64_encoder.name', 'Base64 Encoder'),
      description: tTools('base64_encoder.description', 'Advanced Base64 encoding/decoding with file support'),
      icon: Hash,
      category: "encoder",
      features: [
        tTools('base64_encoder.features.0', 'File Support'),
        tTools('base64_encoder.features.1', 'Batch Process'),
        tTools('base64_encoder.features.2', 'URL Safe'),
        tTools('base64_encoder.features.3', 'Validation')
      ],
      popular: false,
      new: false
    },
    {
      slug: "url-encoder",
      name: tTools('url_encoder.name', 'URL Encoder'),
      description: tTools('url_encoder.description', 'Professional URL encoding with parameter validation'),
      icon: LinkIcon,
      category: "encoder",
      features: [
        tTools('url_encoder.features.0', 'Parameter Validation'),
        tTools('url_encoder.features.1', 'Batch Process'),
        tTools('url_encoder.features.2', 'Decode Support'),
        tTools('url_encoder.features.3', 'Secure')
      ],
      popular: false,
      new: false
    },
    {
      slug: "color-picker",
      name: tTools('color_picker.name', 'Color Picker'),
      description: tTools('color_picker.description', 'Advanced color picker with accessibility analysis'),
      icon: Palette,
      category: "design",
      features: [
        tTools('color_picker.features.0', 'Accessibility'),
        tTools('color_picker.features.1', 'Multiple Formats'),
        tTools('color_picker.features.2', 'Palettes'),
        tTools('color_picker.features.3', 'Contrast Check')
      ],
      popular: false,
      new: true
    }
  ];
  
  // ✅ Get features with translations
  const getFeatures = () => [
    {
      icon: Zap,
      title: tTools('features.ai_powered.title', 'AI-Powered Analysis'),
      description: tTools('features.ai_powered.description', 'Smart code analysis with intelligent suggestions and optimizations')
    },
    {
      icon: Shield,
      title: tTools('features.zero_data.title', 'Zero Data Storage'),
      description: tTools('features.zero_data.description', 'All processing happens locally - your code never leaves your browser')
    },
    {
      icon: Cpu,
      title: tTools('features.lightning.title', 'Lightning Fast'),
      description: tTools('features.lightning.description', 'Optimized algorithms for instant results with large codebases')
    },
    {
      icon: Users,
      title: tTools('features.team_ready.title', 'Team Ready'),
      description: tTools('features.team_ready.description', 'Professional tools designed for team collaboration and workflows')
    }
  ];
  
  // ✅ Get stats with translations
  const getStats = () => [
    { number: "10K+", label: tTools('stats.developers', 'Developers') },
    { number: "99.9%", label: tTools('stats.uptime', 'Uptime') },
    { number: "0ms", label: tTools('stats.delay', 'Server Delay') },
    { number: "256-bit", label: tTools('stats.encryption', 'Encryption') }
  ];
  
  const codeTools = getCodeTools();
  const features = getFeatures();
  const stats = getStats();
  
  // Filter tools by category
  const filteredTools = activeCategory === 'all' 
    ? codeTools 
    : codeTools.filter(tool => tool.category === activeCategory);
  
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
                {tTools('hero.badge', 'DEVELOPER TOOLS SUITE')}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <span style={{ color: themeColors.primary }}>
                {tTools('hero.title_part1', 'Professional')}
              </span>
              <br />
              <span style={{ color: themeColors.text.primary }}>
                {tTools('hero.title_part2', 'Code Tools')}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200" 
               style={{ color: themeColors.text.secondary }}>
              {tTools('hero.description', 'Enterprise-grade developer tools powered by artificial intelligence.')}
              <span style={{ color: themeColors.primary }}>
                {tTools('hero.description_highlight', ' Code formatting, security utilities, data encoding, ') }
              </span>
              {tTools('hero.description_end', 'and design tools with professional workflow integration.')}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="relative">
                <input
                  type="text"
                  placeholder={tTools('hero.search_placeholder', 'Search code tools...')}
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
              {tTools('grid.title', 'All Developer Tools Active')}
            </h2>
            <p className="text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('grid.subtitle', 'Professional utilities for modern development workflows')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {filteredTools.map((tool, index) => (
              <Link
                key={tool.slug}
                href={`/${currentLang}/tools/code-tools/${tool.slug}`}
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
              <Code className="h-12 w-12 mx-auto mb-4 opacity-50" style={{ color: themeColors.text.secondary }} />
              <p className="text-lg" style={{ color: themeColors.text.secondary }}>
                {tTools('grid.no_tools', 'No tools found in this category.')}
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
              {tTools('features.title', 'Why Developers Trust Our Tools?')}
            </h2>
            <p className="text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('features.subtitle', 'Built for performance, security, and professional development')}
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
              {tTools('categories_grid.title', 'Tool Categories')}
            </h2>
            <p className="text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('categories_grid.subtitle', 'Organized by development domains and use cases')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: tTools('categories_grid.formatters', 'Formatters'), count: "5 tools", icon: Braces },
              { name: tTools('categories_grid.security', 'Security'), count: "2 tools", icon: Lock },
              { name: tTools('categories_grid.encoders', 'Encoders'), count: "2 tools", icon: Hash },
              { name: tTools('categories_grid.generators', 'Generators'), count: "1 tool", icon: QrCode },
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
              {tTools('cta.title', 'Ready to Boost Your Development?')}
            </h2>
            <p className="mb-6 md:mb-8 text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('cta.description', 'Join thousands of developers who trust our tools for secure, instant code processing with complete privacy.')}
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
                <BookOpen className="h-4 w-4 md:h-5 md:w-5" />
                {tTools('cta.documentation', 'View Documentation')}
              </Link>
            </div>
            <p className="mt-6 text-xs md:text-sm" style={{ color: themeColors.text.secondary }}>
              {tTools('cta.footer', 'No installation required • 100% free • Enterprise-grade security • All tools active')}
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