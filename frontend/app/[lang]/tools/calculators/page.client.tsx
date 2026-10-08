// app/[lang]/tools/calculators/page.client.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import { 
  Calculator, Calendar, DollarSign, Scale, Percent, CalendarDays, 
  Receipt, GraduationCap, TrendingUp, Zap, Shield, Clock, Users, 
  CheckCircle, ArrowRight, Star, Heart, Sparkles, Globe, 
  BarChart3, LineChart, PieChart, Smartphone, Cpu, Database,
  Lock, RefreshCw, Share2, Download, BookOpen, Award
} from "lucide-react";
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';
// ✅ NEW: Import Central Ad
import CentralAd from '@/components/ads/CentralAd';

// ============================================
// PROFESSIONAL CALCULATORS PAGE
// MATCHES AGE CALCULATOR STANDARDS
// ============================================

export default function CalculatorsPageClient() {
  const params = useParams();
  const currentLang = (params?.lang as string) || 'en';
  
  const { themeColors, fontFamily, isDarkMode } = useTheme();
  
  // ✅ DYNAMIC TRANSLATIONS - No hardcoded text!
  const { t: tCommon, loading: commonLoading } = useTranslation({ namespace: 'common' });
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'calculators' });
  
  // ✅ HYDRATION SAFETY
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // ✅ Get tool categories with translations
  const toolCategories = [
    { id: 'all', name: tTools('categories.all', 'All Tools'), icon: Calculator },
    { id: 'finance', name: tTools('categories.finance', 'Finance'), icon: DollarSign },
    { id: 'health', name: tTools('categories.health', 'Health'), icon: Heart },
    { id: 'education', name: tTools('categories.education', 'Education'), icon: GraduationCap },
    { id: 'science', name: tTools('categories.science', 'Science'), icon: Scale },
    { id: 'life', name: tTools('categories.life', 'Life'), icon: Calendar },
  ];
  
  // ✅ Get calculators with translations
  const getCalculatorTools = () => [
    {
      slug: "bmi-calculator",
      name: tTools('bmi_calculator.name', 'BMI Calculator'),
      description: tTools('bmi_calculator.description', 'Advanced BMI analysis with health recommendations and trends'),
      icon: Calculator,
      category: "health",
      features: [
        tTools('bmi_calculator.features.0', 'AI Enhance'),
        tTools('bmi_calculator.features.1', 'Health Charts'),
        tTools('bmi_calculator.features.2', 'BMI Categories'),
        tTools('bmi_calculator.features.3', 'Progress Tracking')
      ],
      popular: true,
      new: false
    },
    {
      slug: "age-calculator",
      name: tTools('age_calculator.name', 'Age Calculator'),
      description: tTools('age_calculator.description', 'Precise age calculation with zodiac signs and life milestones'),
      icon: Calendar,
      category: "life",
      features: [
        tTools('age_calculator.features.0', 'Exact Age'),
        tTools('age_calculator.features.1', 'Zodiac Signs'),
        tTools('age_calculator.features.2', 'Life Milestones'),
        tTools('age_calculator.features.3', 'Date Difference')
      ],
      popular: true,
      new: false
    },
    {
      slug: "loan-calculator",
      name: tTools('loan_calculator.name', 'Loan Calculator'),
      description: tTools('loan_calculator.description', 'Smart loan analysis with amortization schedules and comparisons'),
      icon: DollarSign,
      category: "finance",
      features: [
        tTools('loan_calculator.features.0', 'EMI Calculator'),
        tTools('loan_calculator.features.1', 'Amortization'),
        tTools('loan_calculator.features.2', 'Interest Rate'),
        tTools('loan_calculator.features.3', 'Payment Schedule')
      ],
      popular: true,
      new: false
    },
    {
      slug: "currency-converter",
      name: tTools('currency_converter.name', 'Currency Converter'),
      description: tTools('currency_converter.description', 'Real-time currency conversion with historical data and trends'),
      icon: DollarSign,
      category: "finance",
      features: [
        tTools('currency_converter.features.0', '150+ Currencies'),
        tTools('currency_converter.features.1', 'Real-time Rates'),
        tTools('currency_converter.features.2', 'Historical Data'),
        tTools('currency_converter.features.3', 'Trend Analysis')
      ],
      popular: false,
      new: true
    },
    {
      slug: "unit-converter",
      name: tTools('unit_converter.name', 'Unit Converter'),
      description: tTools('unit_converter.description', 'Comprehensive unit conversion for science, engineering, and daily use'),
      icon: Scale,
      category: "science",
      features: [
        tTools('unit_converter.features.0', 'Length'),
        tTools('unit_converter.features.1', 'Weight'),
        tTools('unit_converter.features.2', 'Temperature'),
        tTools('unit_converter.features.3', 'Volume, Speed, Time')
      ],
      popular: true,
      new: false
    },
    {
      slug: "percentage-calculator",
      name: tTools('percentage_calculator.name', 'Percentage Calculator'),
      description: tTools('percentage_calculator.description', 'Advanced percentage calculations for business and academics'),
      icon: Percent,
      category: "education",
      features: [
        tTools('percentage_calculator.features.0', '% Increase'),
        tTools('percentage_calculator.features.1', '% Decrease'),
        tTools('percentage_calculator.features.2', '% Difference'),
        tTools('percentage_calculator.features.3', 'Grade Calculation')
      ],
      popular: false,
      new: false
    },
    {
      slug: "date-calculator",
      name: tTools('date_calculator.name', 'Date Calculator'),
      description: tTools('date_calculator.description', 'Professional date calculations with business day support'),
      icon: CalendarDays,
      category: "life",
      features: [
        tTools('date_calculator.features.0', 'Days Between'),
        tTools('date_calculator.features.1', 'Add/Subtract'),
        tTools('date_calculator.features.2', 'Business Days'),
        tTools('date_calculator.features.3', 'Countdown')
      ],
      popular: false,
      new: false
    },
    {
      slug: "tip-calculator",
      name: tTools('tip_calculator.name', 'Tip Calculator'),
      description: tTools('tip_calculator.description', 'Smart tip calculation with bill splitting and tax inclusion'),
      icon: Receipt,
      category: "life",
      features: [
        tTools('tip_calculator.features.0', 'Tip %'),
        tTools('tip_calculator.features.1', 'Bill Split'),
        tTools('tip_calculator.features.2', 'Tax Include'),
        tTools('tip_calculator.features.3', 'Group Sharing')
      ],
      popular: false,
      new: false
    },
    {
      slug: "gpa-calculator",
      name: tTools('gpa_calculator.name', 'GPA Calculator'),
      description: tTools('gpa_calculator.description', 'Academic GPA calculation with semester planning and projections'),
      icon: GraduationCap,
      category: "education",
      features: [
        tTools('gpa_calculator.features.0', 'CGPA'),
        tTools('gpa_calculator.features.1', 'Semester GPA'),
        tTools('gpa_calculator.features.2', 'Grade Points'),
        tTools('gpa_calculator.features.3', 'Course Planning')
      ],
      popular: false,
      new: false
    },
    {
      slug: "compound-interest",
      name: tTools('compound_interest.name', 'Compound Interest'),
      description: tTools('compound_interest.description', 'Investment growth calculator with compound interest visualization'),
      icon: TrendingUp,
      category: "finance",
      features: [
        tTools('compound_interest.features.0', 'Future Value'),
        tTools('compound_interest.features.1', 'Interest Earned'),
        tTools('compound_interest.features.2', 'Monthly Deposit'),
        tTools('compound_interest.features.3', 'Growth Chart')
      ],
      popular: true,
      new: false
    }
  ];
  
  // ✅ Get features with translations
  const getFeatures = () => [
    {
      icon: Zap,
      title: tTools('features.ai_powered.title', 'AI-Powered Calculations'),
      description: tTools('features.ai_powered.description', 'Smart algorithms that provide insights and recommendations')
    },
    {
      icon: Shield,
      title: tTools('features.private.title', '100% Private & Secure'),
      description: tTools('features.private.description', 'All calculations happen locally in your browser')
    },
    {
      icon: Clock,
      title: tTools('features.real_time.title', 'Real-Time Results'),
      description: tTools('features.real_time.description', 'Instant calculations with live updates and visualizations')
    },
    {
      icon: Users,
      title: tTools('features.professional.title', 'Professional Grade'),
      description: tTools('features.professional.description', 'Enterprise-level accuracy for business and professional use')
    }
  ];
  
  // ✅ Get stats with translations
  const getStats = () => [
    { number: "99.9%", label: tTools('stats.accuracy', 'Calculation Accuracy') },
    { number: "Thousands", label: tTools('stats.monthly', 'Monthly Calculations') },
    { number: "0ms", label: tTools('stats.delay', 'Server Delay') },
    { number: "100%", label: tTools('stats.client_side', 'Client-Side') }
  ];
  
  // ✅ Get calculator categories for grid
  const getCategoryGrid = () => [
    { name: tTools('categories_grid.finance', 'Financial'), count: "4 tools", icon: DollarSign },
    { name: tTools('categories_grid.health', 'Health'), count: "2 tools", icon: Heart },
    { name: tTools('categories_grid.education', 'Education'), count: "2 tools", icon: GraduationCap },
    { name: tTools('categories_grid.science', 'Science'), count: "2 tools", icon: Scale }
  ];
  
  const calculatorTools = getCalculatorTools();
  const features = getFeatures();
  const stats = getStats();
  const categoryGrid = getCategoryGrid();
  
  // Filter tools by category
  const filteredTools = activeCategory === 'all' 
    ? calculatorTools 
    : calculatorTools.filter(tool => tool.category === activeCategory);
  
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
      {/* ✅ NEW: Top Banner Ad */}
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
                {tTools('hero.badge', 'AI-POWERED CALCULATORS')}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <span style={{ color: themeColors.primary }}>
                {tTools('hero.title_part1', 'Professional')}
              </span>
              <br />
              <span style={{ color: themeColors.text.primary }}>
                {tTools('hero.title_part2', 'Calculators')}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200" 
               style={{ color: themeColors.text.secondary }}>
              {tTools('hero.description', 'Advanced calculation tools powered by artificial intelligence.')}
              <span style={{ color: themeColors.primary }}>
                {tTools('hero.description_highlight', ' Financial analysis, health metrics, academic planning, ') }
              </span>
              {tTools('hero.description_end', 'and scientific calculations with enterprise-grade accuracy.')}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="relative">
                <input
                  type="text"
                  placeholder={tTools('hero.search_placeholder', 'Search calculators...')}
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
      
      {/* Calculators Grid */}
      <section className="py-12 md:py-16" style={{ backgroundColor: themeColors.background }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: themeColors.text.primary }}>
              {tTools('grid.title', 'Professional Calculator Suite')}
            </h2>
            <p className="text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('grid.subtitle', 'Click any calculator to start using it instantly')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {filteredTools.map((tool, index) => (
              <Link
                key={tool.slug}
                href={`/${currentLang}/tools/calculators/${tool.slug}`}
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
                        {tTools('grid.explore', 'Explore Calculator')}
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
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" style={{ color: themeColors.text.secondary }} />
              <p className="text-lg" style={{ color: themeColors.text.secondary }}>
                {tTools('grid.no_tools', 'No calculators found in this category.')}
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
              {tTools('features.title', 'Why Professionals Choose Us?')}
            </h2>
            <p className="text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('features.subtitle', 'Built for performance, security, and scalability')}
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
              {tTools('categories_grid.title', 'Calculator Categories')}
            </h2>
            <p className="text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('categories_grid.subtitle', 'Organized by professional domains and use cases')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categoryGrid.map((category, index) => {
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
              {tTools('cta.title', 'Ready to Calculate with Precision?')}
            </h2>
            <p className="mb-6 md:mb-8 text-base md:text-lg" style={{ color: themeColors.text.secondary }}>
              {tTools('cta.description', 'Join professionals worldwide who trust our calculators for accurate, instant results with complete privacy.')}
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
              {tTools('cta.footer', 'No installation required • 100% free • Enterprise-grade accuracy • All tools active')}
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