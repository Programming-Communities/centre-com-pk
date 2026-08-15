// app/[lang]/tools/security-tools/page.client.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import { 
  Shield, Lock, Key, Hash, Fingerprint, EyeOff, Server,
  Zap, Cpu, Users, CheckCircle, ArrowRight, Sparkles, 
  Star, Heart, Award, BookOpen, Download, Share2,
  ShieldCheck, FileLock, Network, ScanEye, BadgeCheck, Braces
} from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import CentralAd from '@/components/ads/CentralAd';

// ============================================
// PROFESSIONAL SECURITY TOOLS PAGE
// ============================================

export default function SecurityToolsPageClient() {
  const params = useParams();
  const currentLang = (params?.lang as string) || 'en';
  
  const { themeColors, fontFamily } = useTheme();
  
  // ✅ DYNAMIC TRANSLATIONS
  const { t: tCommon, loading: commonLoading } = useTranslation({ namespace: 'common' });
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'security-tools' });
  
  // ✅ HYDRATION SAFETY
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // ✅ Get tool categories with translations
  const toolCategories = [
    { id: 'all', name: tTools('categories.all', 'All Tools'), icon: Shield },
    { id: 'generate', name: tTools('categories.generate', 'Generate'), icon: Lock },
    { id: 'encrypt', name: tTools('categories.encrypt', 'Encryption'), icon: Key },
    { id: 'analyze', name: tTools('categories.analyze', 'Analysis'), icon: ScanEye },
    { id: 'protect', name: tTools('categories.protect', 'Protection'), icon: ShieldCheck },
    { id: 'web', name: tTools('categories.web', 'Web Security'), icon: Server },
  ];
  
  // ✅ Get security tools with translations
  const getSecurityTools = () => [
    {
      slug: "password-generator",
      name: tTools('password_generator.name', 'Password Generator'),
      description: tTools('password_generator.description', 'Military-grade password generation with entropy analysis and strength checking'),
      icon: Lock,
      category: "generate",
      features: [
        tTools('password_generator.features.0', 'Entropy Analysis'),
        tTools('password_generator.features.1', 'Multiple Patterns'),
        tTools('password_generator.features.2', 'Strength Meter'),
        tTools('password_generator.features.3', 'Secure Storage')
      ],
      popular: true,
      new: false,
      active: true
    },
    {
      slug: "encryption-tools",
      name: tTools('encryption_tools.name', 'Encryption Tools'),
      description: tTools('encryption_tools.description', 'Advanced encryption utilities with AES-256 and RSA algorithms'),
      icon: Key,
      category: "encrypt",
      features: [
        tTools('encryption_tools.features.0', 'AES-256'),
        tTools('encryption_tools.features.1', 'RSA Algorithms'),
        tTools('encryption_tools.features.2', 'File Encryption'),
        tTools('encryption_tools.features.3', 'Secure Keys')
      ],
      popular: true,
      new: false,
      active: true
    },
    {
      slug: "hash-generator",
      name: tTools('hash_generator.name', 'Hash Generator'),
      description: tTools('hash_generator.description', 'Cryptographic hash generation with multiple algorithms and verification'),
      icon: Hash,
      category: "generate",
      features: [
        tTools('hash_generator.features.0', 'Multiple Algorithms'),
        tTools('hash_generator.features.1', 'File Hashing'),
        tTools('hash_generator.features.2', 'Verification'),
        tTools('hash_generator.features.3', 'Batch Processing')
      ],
      popular: false,
      new: false,
      active: true
    },
    {
      slug: "security-analyzer",
      name: tTools('security_analyzer.name', 'Security Analyzer'),
      description: tTools('security_analyzer.description', 'Comprehensive security analysis with vulnerability detection'),
      icon: ScanEye,
      category: "analyze",
      features: [
        tTools('security_analyzer.features.0', 'Vulnerability Scan'),
        tTools('security_analyzer.features.1', 'Risk Assessment'),
        tTools('security_analyzer.features.2', 'Compliance Check'),
        tTools('security_analyzer.features.3', 'Report Generation')
      ],
      popular: false,
      new: false,
      active: true
    },
    {
      slug: "two-factor-auth",
      name: tTools('two_factor_auth.name', 'Two-Factor Auth'),
      description: tTools('two_factor_auth.description', 'Advanced 2FA tools with TOTP and backup code generation'),
      icon: Fingerprint,
      category: "generate",
      features: [
        tTools('two_factor_auth.features.0', 'TOTP Support'),
        tTools('two_factor_auth.features.1', 'Backup Codes'),
        tTools('two_factor_auth.features.2', 'QR Generation'),
        tTools('two_factor_auth.features.3', 'Multi-Device')
      ],
      popular: false,
      new: true,
      active: true
    },
    {
      slug: "data-masking",
      name: tTools('data_masking.name', 'Data Masking'),
      description: tTools('data_masking.description', 'Sensitive data masking with format preservation and reversible options'),
      icon: EyeOff,
      category: "protect",
      features: [
        tTools('data_masking.features.0', 'Format Preservation'),
        tTools('data_masking.features.1', 'Reversible Options'),
        tTools('data_masking.features.2', 'Pattern Matching'),
        tTools('data_masking.features.3', 'Batch Process')
      ],
      popular: false,
      new: false,
      active: true
    },
    {
      slug: "ssl-checker",
      name: tTools('ssl_checker.name', 'SSL Checker'),
      description: tTools('ssl_checker.description', 'Professional SSL certificate analysis with expiration monitoring'),
      icon: Shield,
      category: "web",
      features: [
        tTools('ssl_checker.features.0', 'Certificate Info'),
        tTools('ssl_checker.features.1', 'Expiration Monitoring'),
        tTools('ssl_checker.features.2', 'Chain Validation'),
        tTools('ssl_checker.features.3', 'Security Rating')
      ],
      popular: false,
      new: false,
      active: true
    },
    {
      slug: "firewall-tester",
      name: tTools('firewall_tester.name', 'Firewall Tester'),
      description: tTools('firewall_tester.description', 'Network security testing with port scanning and vulnerability detection'),
      icon: Network,
      category: "analyze",
      features: [
        tTools('firewall_tester.features.0', 'Port Scanning'),
        tTools('firewall_tester.features.1', 'Vulnerability Detection'),
        tTools('firewall_tester.features.2', 'Traffic Analysis'),
        tTools('firewall_tester.features.3', 'Security Reports')
      ],
      popular: false,
      new: false,
      active: true
    },
    {
      slug: "secure-file-wipe",
      name: tTools('secure_file_wipe.name', 'Secure File Wipe'),
      description: tTools('secure_file_wipe.description', 'Military-grade file deletion with multiple overwrite patterns'),
      icon: FileLock,
      category: "protect",
      features: [
        tTools('secure_file_wipe.features.0', 'Multiple Patterns'),
        tTools('secure_file_wipe.features.1', 'DoD Standard'),
        tTools('secure_file_wipe.features.2', 'Batch Processing'),
        tTools('secure_file_wipe.features.3', 'Verification')
      ],
      popular: false,
      new: false,
      active: true
    },
    {
      slug: "api-security",
      name: tTools('api_security.name', 'API Security'),
      description: tTools('api_security.description', 'API security testing with authentication and authorization checks'),
      icon: Braces,
      category: "web",
      features: [
        tTools('api_security.features.0', 'Auth Testing'),
        tTools('api_security.features.1', 'Rate Limit Check'),
        tTools('api_security.features.2', 'Input Validation'),
        tTools('api_security.features.3', 'Security Headers')
      ],
      popular: false,
      new: true,
      active: true
    }
  ];
  
  // ✅ Get features with translations
  const getFeatures = () => [
    {
      icon: Shield,
      title: tTools('features.military.title', 'Military-Grade Security'),
      description: tTools('features.military.description', 'AES-256 encryption and enterprise-grade protection algorithms')
    },
    {
      icon: Zap,
      title: tTools('features.zero_data.title', 'Zero Data Storage'),
      description: tTools('features.zero_data.description', 'All processing happens locally - your data never leaves your browser')
    },
    {
      icon: Cpu,
      title: tTools('features.real_time.title', 'Real-Time Protection'),
      description: tTools('features.real_time.description', 'Instant security analysis with live threat detection')
    },
    {
      icon: Users,
      title: tTools('features.enterprise.title', 'Enterprise Ready'),
      description: tTools('features.enterprise.description', 'Professional tools designed for business security teams')
    }
  ];
  
  // ✅ Get stats with translations
  const getStats = () => [
    { number: "256-bit", label: tTools('stats.encryption', 'Encryption') },
    { number: "10+", label: tTools('stats.tools', 'Security Tools') },
    { number: "0ms", label: tTools('stats.delay', 'Server Delay') },
    { number: "100%", label: tTools('stats.client', 'Client-Side') }
  ];
  
  const securityTools = getSecurityTools();
  const features = getFeatures();
  const stats = getStats();
  
  // Filter tools by category
  const filteredTools = activeCategory === 'all' 
    ? securityTools 
    : securityTools.filter(tool => tool.category === activeCategory);
  
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
                {tTools('hero.badge', 'ENTERPRISE SECURITY TOOLS')}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <span style={{ color: themeColors.primary }}>
                {tTools('hero.title_part1', 'Professional')}
              </span>
              <br />
              <span style={{ color: themeColors.text.primary }}>
                {tTools('hero.title_part2', 'Security Tools')}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200" 
               style={{ color: themeColors.text.secondary }}>
              {tTools('hero.description', 'Military-grade security utilities powered by artificial intelligence.')}
              <span style={{ color: themeColors.primary }}>
                {tTools('hero.description_highlight', ' Encryption, authentication, analysis, protection, ')}
              </span>
              {tTools('hero.description_end', 'and security tools with enterprise-grade reliability.')}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="relative">
                <input
                  type="text"
                  placeholder={tTools('hero.search_placeholder', 'Search security tools...')}
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
              {tTools('grid.title', 'All Security Tools Active')}
            </h2>
            <p className="text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('grid.subtitle', 'Click any tool to start securing your data instantly')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {filteredTools.map((tool, index) => (
              <Link
                key={tool.slug}
                href={`/${currentLang}/tools/security-tools/${tool.slug}`}
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
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" style={{ color: themeColors.text.secondary }} />
              <p className="text-lg" style={{ color: themeColors.text.secondary }}>
                {tTools('grid.no_tools', 'No security tools found in this category.')}
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
              {tTools('features.title', 'Why Security Teams Trust Our Tools?')}
            </h2>
            <p className="text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('features.subtitle', 'Built for protection, compliance, and enterprise security workflows')}
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
              {tTools('categories_grid.title', 'Security Categories')}
            </h2>
            <p className="text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('categories_grid.subtitle', 'Organized by security domains and protection levels')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: tTools('categories_grid.encryption', 'Encryption'), count: "2 tools", icon: Key },
              { name: tTools('categories_grid.authentication', 'Authentication'), count: "2 tools", icon: Fingerprint },
              { name: tTools('categories_grid.analysis', 'Analysis'), count: "2 tools", icon: ScanEye },
              { name: tTools('categories_grid.protection', 'Protection'), count: "2 tools", icon: ShieldCheck },
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
              {tTools('cta.title', 'Ready to Secure Your Data?')}
            </h2>
            <p className="mb-6 md:mb-8 text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('cta.description', 'Join thousands of security professionals who trust our tools for military-grade, instant security processing with complete privacy.')}
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
                <Shield className="h-4 w-4 md:h-5 md:w-5" />
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
                <Lock className="h-4 w-4 md:h-5 md:w-5" />
                {tTools('cta.security_guide', 'Security Guide')}
              </Link>
            </div>
            <p className="mt-6 text-xs md:text-sm" style={{ color: themeColors.text.secondary }}>
              {tTools('cta.footer', 'No installation required • 100% free • Military-grade security • All tools active')}
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