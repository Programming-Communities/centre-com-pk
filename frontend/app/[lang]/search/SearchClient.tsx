// app/[lang]/search/SearchClient.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, X, Zap, Flame, Star, CheckCircle, Image, FileText, Calculator, Code, Type, Palette, Lock, Hash } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

// Tool interface
interface Tool {
  id: number;
  name: string;
  href: string;
  status: 'live' | 'soon' | 'new' | 'popular';
  description: string;
  category: string;
  categoryTitle: string;
  visits?: number;
}

// Category interface
interface Category {
  id: string;
  title: string;
  description: string;
  icon: any;
  href: string;
  toolCount: number;
}

// External Arrow Component
function ExternalArrow({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg 
      className={className} 
      style={style}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      width="12"
      height="12"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

// Tools data - Complete list
const toolsData: Tool[] = [
  // Image Tools
  { id: 1, name: "Image Resizer", href: "/tools/image-tools/image-resizer", status: "popular", description: "Resize images to any dimension without losing quality. Supports JPG, PNG, WebP formats.", category: "imageTools", categoryTitle: "Image Tools" },
  { id: 2, name: "Image Compressor", href: "/tools/image-tools/image-compressor", status: "live", description: "Compress images without quality loss. Reduce file size by up to 80% while maintaining visual quality.", category: "imageTools", categoryTitle: "Image Tools" },
  { id: 3, name: "Image Cropper", href: "/tools/image-tools/image-cropper", status: "live", description: "Crop images to perfect size. Custom dimensions, aspect ratios, and free-form cropping.", category: "imageTools", categoryTitle: "Image Tools" },
  { id: 4, name: "Background Remover", href: "/tools/image-tools/background-remover", status: "live", description: "Remove background automatically using AI. Perfect for product photos and portraits.", category: "imageTools", categoryTitle: "Image Tools" },
  { id: 5, name: "Image Converter", href: "/tools/image-tools/image-converter", status: "live", description: "Convert between image formats: JPG, PNG, WebP, BMP, TIFF, and more.", category: "imageTools", categoryTitle: "Image Tools" },
  { id: 6, name: "Image Rotator", href: "/tools/image-tools/image-rotator", status: "live", description: "Rotate and flip images. 90°, 180°, 270° rotations, horizontal and vertical flips.", category: "imageTools", categoryTitle: "Image Tools" },
  { id: 7, name: "Image Filters", href: "/tools/image-tools/image-filters", status: "live", description: "Apply beautiful filters to your images: sepia, grayscale, blur, sharpen, and more.", category: "imageTools", categoryTitle: "Image Tools" },
  { id: 8, name: "Meme Generator", href: "/tools/image-tools/meme-generator", status: "new", description: "Create memes instantly with custom text. Choose from popular templates or upload your own.", category: "imageTools", categoryTitle: "Image Tools" },
  { id: 9, name: "Favicon Generator", href: "/tools/image-tools/favicon-generator", status: "live", description: "Generate favicons for websites. Create all sizes for different devices and browsers.", category: "imageTools", categoryTitle: "Image Tools" },
  { id: 10, name: "Photo Collage", href: "/tools/image-tools/photo-collage", status: "live", description: "Create beautiful collages with multiple photos. Choose from various layouts and templates.", category: "imageTools", categoryTitle: "Image Tools" },
  
  // PDF Tools
  { id: 11, name: "PDF Merger", href: "/tools/pdf-tools/pdf-merger", status: "popular", description: "Merge multiple PDFs into one document. Combine files, rearrange pages, and create unified documents.", category: "pdfTools", categoryTitle: "PDF Tools" },
  { id: 12, name: "PDF Splitter", href: "/tools/pdf-tools/pdf-splitter", status: "live", description: "Split PDF into multiple files. Extract specific pages or split by page ranges.", category: "pdfTools", categoryTitle: "PDF Tools" },
  { id: 13, name: "PDF Compressor", href: "/tools/pdf-tools/pdf-compressor", status: "live", description: "Compress PDF file size. Reduce PDF size by up to 90% while maintaining quality.", category: "pdfTools", categoryTitle: "PDF Tools" },
  { id: 14, name: "PDF to Word", href: "/tools/pdf-tools/pdf-to-word", status: "new", description: "Convert PDF to Word document. Edit and reuse content from PDF files easily.", category: "pdfTools", categoryTitle: "PDF Tools" },
  
  // Calculators
  { id: 15, name: "BMI Calculator", href: "/tools/calculators/bmi-calculator", status: "popular", description: "Calculate Body Mass Index. Get health recommendations and ideal weight range.", category: "calculators", categoryTitle: "Calculators" },
  { id: 16, name: "Age Calculator", href: "/tools/calculators/age-calculator", status: "live", description: "Calculate exact age in years, months, days, hours, minutes, and seconds.", category: "calculators", categoryTitle: "Calculators" },
  { id: 17, name: "Loan Calculator", href: "/tools/calculators/loan-calculator", status: "live", description: "Calculate loan payments, interest rates, and amortization schedules.", category: "calculators", categoryTitle: "Calculators" },
  { id: 18, name: "Currency Converter", href: "/tools/calculators/currency-converter", status: "live", description: "Convert currencies with live exchange rates. Support 150+ currencies.", category: "calculators", categoryTitle: "Calculators" },
  { id: 19, name: "Unit Converter", href: "/tools/calculators/unit-converter", status: "live", description: "Convert between units: length, weight, temperature, area, volume, speed, time.", category: "calculators", categoryTitle: "Calculators" },
  { id: 20, name: "Percentage Calculator", href: "/tools/calculators/percentage-calculator", status: "live", description: "Calculate percentages: increase, decrease, percentage of a number, difference.", category: "calculators", categoryTitle: "Calculators" },
  { id: 21, name: "Date Calculator", href: "/tools/calculators/date-calculator", status: "live", description: "Calculate date differences, add/subtract days, find business days.", category: "calculators", categoryTitle: "Calculators" },
  { id: 22, name: "Tip Calculator", href: "/tools/calculators/tip-calculator", status: "live", description: "Calculate tips and split bills. Custom percentages and group sharing.", category: "calculators", categoryTitle: "Calculators" },
  { id: 23, name: "GPA Calculator", href: "/tools/calculators/gpa-calculator", status: "live", description: "Calculate Grade Point Average. Semester GPA, cumulative GPA, grade projections.", category: "calculators", categoryTitle: "Calculators" },
  { id: 24, name: "Compound Interest", href: "/tools/calculators/compound-interest", status: "new", description: "Calculate compound interest and investment growth. Monthly deposits and compounding periods.", category: "calculators", categoryTitle: "Calculators" },
  
  // Code Tools
  { id: 25, name: "JSON Formatter", href: "/tools/code-tools/json-formatter", status: "popular", description: "Format and validate JSON data. Beautify, minify, and fix invalid JSON.", category: "codeTools", categoryTitle: "Code Tools" },
  { id: 26, name: "QR Code Generator", href: "/tools/code-tools/qr-code-generator", status: "popular", description: "Generate QR codes for URLs, text, contacts, WiFi, and events. Download in multiple formats.", category: "codeTools", categoryTitle: "Code Tools" },
  { id: 27, name: "HTML Formatter", href: "/tools/code-tools/html-formatter", status: "live", description: "Format HTML code with proper indentation. Clean and beautify messy HTML.", category: "codeTools", categoryTitle: "Code Tools" },
  { id: 28, name: "CSS Formatter", href: "/tools/code-tools/css-formatter", status: "live", description: "Format CSS code for better readability. Minify, beautify, and validate CSS.", category: "codeTools", categoryTitle: "Code Tools" },
  { id: 29, name: "JavaScript Formatter", href: "/tools/code-tools/javascript-formatter", status: "live", description: "Format JavaScript code. Beautify, minify, and validate JS syntax.", category: "codeTools", categoryTitle: "Code Tools" },
  { id: 30, name: "XML Formatter", href: "/tools/code-tools/xml-formatter", status: "live", description: "Format XML documents. Beautify, minify, and validate XML structure.", category: "codeTools", categoryTitle: "Code Tools" },
  { id: 31, name: "Base64 Encoder", href: "/tools/code-tools/base64-encoder", status: "live", description: "Encode and decode Base64 strings. Convert text to Base64 and back.", category: "codeTools", categoryTitle: "Code Tools" },
  { id: 32, name: "URL Encoder", href: "/tools/code-tools/url-encoder", status: "new", description: "Encode and decode URLs. Percent encoding for web safety.", category: "codeTools", categoryTitle: "Code Tools" },
  
  // Text Tools
  { id: 33, name: "Word Counter", href: "/tools/text-tools/word-counter", status: "popular", description: "Count words, characters, sentences, and paragraphs. Analyze text statistics.", category: "textTools", categoryTitle: "Text Tools" },
  { id: 34, name: "Character Counter", href: "/tools/text-tools/character-counter", status: "live", description: "Count characters with and without spaces. Perfect for social media posts.", category: "textTools", categoryTitle: "Text Tools" },
  { id: 35, name: "Case Converter", href: "/tools/text-tools/case-converter", status: "live", description: "Convert text cases: UPPERCASE, lowercase, Title Case, Sentence case, camelCase.", category: "textTools", categoryTitle: "Text Tools" },
  { id: 36, name: "Text Extractor", href: "/tools/text-tools/text-extractor", status: "live", description: "Extract text from images, PDFs, and documents. OCR technology included.", category: "textTools", categoryTitle: "Text Tools" },
  { id: 37, name: "Lorem Ipsum Generator", href: "/tools/text-tools/lorem-ipsum", status: "live", description: "Generate placeholder text for designs. Custom paragraphs, words, and sentences.", category: "textTools", categoryTitle: "Text Tools" },
  { id: 38, name: "Markdown Editor", href: "/tools/text-tools/markdown-editor", status: "live", description: "Edit and preview markdown. Real-time preview with syntax highlighting.", category: "textTools", categoryTitle: "Text Tools" },
  { id: 39, name: "Text Diff Checker", href: "/tools/text-tools/text-diff", status: "live", description: "Compare text differences. Highlight additions, removals, and changes.", category: "textTools", categoryTitle: "Text Tools" },
  { id: 40, name: "Regex Tester", href: "/tools/text-tools/regex-tester", status: "live", description: "Test regular expressions. Match patterns, replace text, and validate regex.", category: "textTools", categoryTitle: "Text Tools" },
  { id: 41, name: "UUID Generator", href: "/tools/text-tools/uuid-generator", status: "new", description: "Generate UUIDs and GUIDs. Version 4 UUIDs for unique identifiers.", category: "textTools", categoryTitle: "Text Tools" },
  
  // Design Tools
  { id: 42, name: "Color Picker", href: "/tools/design-tools/color-picker", status: "popular", description: "Pick colors and convert formats. HEX, RGB, HSL, CMYK color conversion.", category: "designTools", categoryTitle: "Design Tools" },
  
  // Security Tools
  { id: 43, name: "Password Generator", href: "/tools/security-tools/password-generator", status: "popular", description: "Generate secure passwords up to 500 characters. Customizable: length, uppercase, lowercase, numbers, symbols.", category: "securityTools", categoryTitle: "Security Tools" },
];

// Categories data
const categoriesData: Category[] = [
  { id: 'imageTools', title: 'Image Tools', description: '10+ professional image editing tools', icon: Image, href: '/tools/image-tools', toolCount: 10 },
  { id: 'pdfTools', title: 'PDF Tools', description: '4+ PDF manipulation tools', icon: FileText, href: '/tools/pdf-tools', toolCount: 4 },
  { id: 'calculators', title: 'Calculators', description: '10+ smart calculators', icon: Calculator, href: '/tools/calculators', toolCount: 10 },
  { id: 'codeTools', title: 'Code Tools', description: '8+ developer tools', icon: Code, href: '/tools/code-tools', toolCount: 8 },
  { id: 'textTools', title: 'Text Tools', description: '9+ text processing tools', icon: Type, href: '/tools/text-tools', toolCount: 9 },
  { id: 'designTools', title: 'Design Tools', description: '1+ design utilities', icon: Palette, href: '/tools/design-tools', toolCount: 1 },
  { id: 'securityTools', title: 'Security Tools', description: '1+ security utilities', icon: Lock, href: '/tools/security-tools', toolCount: 1 },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { themeColors } = useTheme();
  
  const [results, setResults] = useState<Tool[]>([]);
  const [filteredResults, setFilteredResults] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    status: '',
  });

  useEffect(() => {
    if (query) {
      performSearch();
    } else {
      setResults([]);
      setFilteredResults([]);
    }
  }, [query]);

  const performSearch = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        setFilteredResults([]);
      } else {
        const searchTerm = query.toLowerCase();
        const searchResults = toolsData.filter(tool =>
          tool.name.toLowerCase().includes(searchTerm) ||
          tool.description.toLowerCase().includes(searchTerm) ||
          tool.categoryTitle.toLowerCase().includes(searchTerm)
        );
        
        setResults(searchResults);
        setFilteredResults(searchResults);
      }
      setIsLoading(false);
    }, 500);
  };

  const applyFilters = () => {
    let filtered = [...results];
    
    if (activeFilters.category) {
      filtered = filtered.filter(tool => tool.category === activeFilters.category);
    }
    
    if (activeFilters.status) {
      filtered = filtered.filter(tool => tool.status === activeFilters.status);
    }
    
    setFilteredResults(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [activeFilters, results]);

  const clearFilters = () => {
    setActiveFilters({ category: '', status: '' });
  };

  const getStatusBadge = (status: Tool['status']) => {
    switch (status) {
      case 'popular':
        return { text: 'Popular', color: themeColors.warning, bgColor: `${themeColors.warning}20` };
      case 'new':
        return { text: 'New', color: themeColors.secondary, bgColor: `${themeColors.secondary}20` };
      case 'soon':
        return { text: 'Soon', color: themeColors.warning, bgColor: `${themeColors.warning}20` };
      default:
        return { text: 'Live', color: themeColors.success, bgColor: `${themeColors.success}20` };
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categoriesData.find(cat => cat.id === categoryId);
    return category?.icon || Hash;
  };

  const totalTools = toolsData.length;
  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: themeColors.text.primary }}>
                {query ? `Search Results for "${query}"` : 'Search Tools'}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2" style={{ color: themeColors.text.secondary }}>
                  <Zap className="h-4 w-4" />
                  <span className="text-sm">{totalTools}+ Professional Tools</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: themeColors.text.secondary }}>
                  <Flame className="h-4 w-4" />
                  <span className="text-sm">100% Client-Side Processing</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: themeColors.text.secondary }}>
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Instant Results</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                  Showing {filteredResults.length} of {results.length} results
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm flex items-center gap-1 mt-1 hover:underline"
                    style={{ color: themeColors.primary }}
                  >
                    <X size={14} />
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Search input */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" 
              style={{ color: themeColors.text.secondary }} 
              size={20} 
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                const newQuery = e.target.value;
                const params = new URLSearchParams(searchParams.toString());
                if (newQuery) {
                  params.set('q', newQuery);
                } else {
                  params.delete('q');
                }
                window.history.replaceState({}, '', `?${params.toString()}`);
                window.dispatchEvent(new Event('searchupdate'));
              }}
              placeholder="Search tools by name, description, or category..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-lg border focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: themeColors.surface,
                color: themeColors.text.primary,
                borderColor: themeColors.border,
                '--tw-ring-color': themeColors.primary,
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Categories filter */}
              <div className="rounded-2xl p-6 border" 
                style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
              >
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2" style={{ color: themeColors.text.primary }}>
                  <Filter size={20} />
                  Categories
                </h3>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveFilters(prev => ({ ...prev, category: '' }))}
                    className={`flex items-center justify-between w-full p-3 rounded-xl transition-all ${!activeFilters.category ? 'ring-2' : ''}`}
                    style={{
                      backgroundColor: !activeFilters.category ? `${themeColors.primary}10` : themeColors.background,
                      color: !activeFilters.category ? themeColors.primary : themeColors.text.secondary,
                      border: !activeFilters.category ? 'none' : `1px solid ${themeColors.border}`,
                    }}
                  >
                    <span className="font-medium">All Categories</span>
                    <span className="text-sm px-2 py-1 rounded-full" style={{ backgroundColor: `${themeColors.primary}20`, color: themeColors.primary }}>
                      {totalTools}
                    </span>
                  </button>
                  
                  {categoriesData.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeFilters.category === category.id;
                    const toolCount = toolsData.filter(t => t.category === category.id).length;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveFilters(prev => ({
                          ...prev,
                          category: prev.category === category.id ? '' : category.id
                        }))}
                        className={`flex items-center justify-between w-full p-3 rounded-xl transition-all ${isActive ? 'ring-2' : ''}`}
                        style={{
                          backgroundColor: isActive ? `${themeColors.primary}10` : themeColors.background,
                          color: isActive ? themeColors.primary : themeColors.text.secondary,
                          border: isActive ? 'none' : `1px solid ${themeColors.border}`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{category.title}</span>
                        </div>
                        <span className="text-sm px-2 py-1 rounded-full" style={{ backgroundColor: `${themeColors.primary}20`, color: themeColors.primary }}>
                          {toolCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status filter */}
              <div className="rounded-2xl p-6 border" 
                style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
              >
                <h3 className="font-bold text-lg mb-6" style={{ color: themeColors.text.primary }}>
                  Status
                </h3>
                
                <div className="space-y-3">
                  {[
                    { value: '', label: 'All Status', color: themeColors.primary },
                    { value: 'popular', label: 'Popular', color: themeColors.warning },
                    { value: 'new', label: 'New', color: themeColors.secondary },
                    { value: 'live', label: 'Live', color: themeColors.success },
                  ].map((option) => {
                    const isActive = activeFilters.status === option.value;
                    const count = option.value ? 
                      toolsData.filter(t => t.status === option.value).length : 
                      totalTools;
                    
                    return (
                      <button
                        key={option.value}
                        onClick={() => setActiveFilters(prev => ({
                          ...prev,
                          status: prev.status === option.value ? '' : option.value
                        }))}
                        className={`flex items-center justify-between w-full p-3 rounded-xl transition-all ${isActive ? 'ring-2' : ''}`}
                        style={{
                          backgroundColor: isActive ? `${option.color}10` : themeColors.background,
                          color: isActive ? option.color : themeColors.text.secondary,
                          border: isActive ? 'none' : `1px solid ${themeColors.border}`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {option.value === 'popular' && <Flame className="h-4 w-4" />}
                          {option.value === 'new' && <Star className="h-4 w-4" />}
                          {option.value === 'live' && <CheckCircle className="h-4 w-4" />}
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <span className="text-sm px-2 py-1 rounded-full" style={{ backgroundColor: `${option.color}20`, color: option.color }}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="rounded-2xl p-6 border" 
                style={{ 
                  backgroundColor: themeColors.surface, 
                  borderColor: themeColors.border,
                  background: `linear-gradient(135deg, ${themeColors.primary}10, ${themeColors.secondary}10)`
                }}
              >
                <h3 className="font-bold text-lg mb-4" style={{ color: themeColors.text.primary }}>
                  Tools Overview
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span style={{ color: themeColors.text.secondary }}>Total Tools</span>
                    <span className="font-bold" style={{ color: themeColors.primary }}>{totalTools}+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: themeColors.text.secondary }}>Live Tools</span>
                    <span className="font-bold" style={{ color: themeColors.success }}>
                      {toolsData.filter(t => t.status === 'live' || t.status === 'popular' || t.status === 'new').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: themeColors.text.secondary }}>Categories</span>
                    <span className="font-bold" style={{ color: themeColors.secondary }}>{categoriesData.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results section */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 rounded-2xl mb-4" style={{ backgroundColor: themeColors.surface }}></div>
                    <div className="h-4 rounded mb-2 w-3/4" style={{ backgroundColor: themeColors.surface }}></div>
                    <div className="h-3 rounded w-1/2" style={{ backgroundColor: themeColors.surface }}></div>
                  </div>
                ))}
              </div>
            ) : query && filteredResults.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredResults.map((tool, index) => {
                    const statusBadge = getStatusBadge(tool.status);
                    const CategoryIcon = getCategoryIcon(tool.category);
                    
                    return (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        className="group rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden"
                        style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                              <CategoryIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="text-xs px-2 py-1 rounded-full mb-1 inline-block" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                                #{index + 1}
                              </div>
                              <h3 className="font-bold text-lg line-clamp-1" style={{ color: themeColors.text.primary }}>
                                {tool.name}
                              </h3>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {tool.status === 'popular' && <Flame className="h-4 w-4" style={{ color: themeColors.warning }} />}
                            {tool.status === 'new' && <Star className="h-4 w-4" style={{ color: themeColors.secondary }} />}
                            {tool.status === 'live' && <CheckCircle className="h-4 w-4" style={{ color: themeColors.success }} />}
                          </div>
                        </div>
                        
                        <p className="text-sm mb-6 line-clamp-3" style={{ color: themeColors.text.secondary }}>
                          {tool.description}
                        </p>
                        
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: statusBadge.bgColor, color: statusBadge.color }}>
                                {statusBadge.text}
                              </span>
                              <span className="text-xs" style={{ color: themeColors.text.secondary }}>
                                {tool.categoryTitle}
                              </span>
                            </div>
                            <ExternalArrow className="transition-transform group-hover:translate-x-1" style={{ color: themeColors.text.secondary }} />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                
                {/* No more results message */}
                {filteredResults.length === results.length && results.length > 0 && (
                  <div className="text-center py-8 mt-6">
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${themeColors.primary}10` }}>
                      <CheckCircle className="h-8 w-8" style={{ color: themeColors.primary }} />
                    </div>
                    <h4 className="font-bold text-lg mb-2" style={{ color: themeColors.text.primary }}>
                      All {results.length} tools shown
                    </h4>
                    <p style={{ color: themeColors.text.secondary }}>
                      Try different keywords or filters to find more tools
                    </p>
                  </div>
                )}
              </>
            ) : query ? (
              // No results found
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${themeColors.primary}10` }}>
                  <Search className="h-10 w-10" style={{ color: themeColors.primary }} />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
                  No tools found
                </h3>
                <p className="max-w-md mx-auto mb-8" style={{ color: themeColors.text.secondary }}>
                  We couldn't find any tools matching "{query}". Try different keywords or check your spelling.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {categoriesData.slice(0, 4).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.set('q', category.title);
                        window.history.replaceState({}, '', `?${params.toString()}`);
                        window.dispatchEvent(new Event('searchupdate'));
                      }}
                      className="px-4 py-2 rounded-lg font-medium transition hover:scale-105"
                      style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary, border: `1px solid ${themeColors.primary}30` }}
                    >
                      Search "{category.title}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Empty search state
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${themeColors.primary}10` }}>
                  <Search className="h-10 w-10" style={{ color: themeColors.primary }} />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
                  Search Tools Library
                </h3>
                <p className="max-w-md mx-auto mb-8" style={{ color: themeColors.text.secondary }}>
                  Search from {totalTools}+ professional tools by name, description, or category
                </p>
                
                <div className="max-w-2xl mx-auto">
                  <h4 className="font-bold mb-4 text-lg" style={{ color: themeColors.text.primary }}>
                    Popular Categories
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categoriesData.map((category) => {
                      const Icon = category.icon;
                      return (
                        <Link
                          key={category.id}
                          href={category.href}
                          className="p-4 rounded-xl border transition-all hover:scale-105 text-center"
                          style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border, color: themeColors.text.primary }}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="p-2 rounded-lg mb-2" style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-sm">{category.title}</span>
                            <span className="text-xs" style={{ color: themeColors.text.secondary }}>
                              {category.toolCount} tools
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}