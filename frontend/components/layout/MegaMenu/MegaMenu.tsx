'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ChevronDown, Zap, Image, CheckCircle, Clock, FileText,
  Calculator, Code, Type, Palette, Lock, ArrowRight, X,
  Search, History, Flame, Star, Shield,
} from "lucide-react";
import { useTheme } from "@/components/theme/contexts/ThemeContext";
import { useTranslation } from "@/hooks/useTranslation";

interface MegaMenuProps {
  mobile?: boolean;
  onItemClick?: () => void;
  category?:
    | "all"
    | "imageTools"
    | "pdfTools"
    | "calculators"
    | "codeTools"
    | "textTools"
    | "designTools"
    | "securityTools";
  lang: string;
}

interface Tool {
  name: string;
  href: string;
  status: "live" | "soon" | "new" | "popular";
  description: string;
  category: string;
}

interface CategoryData {
  title: string;
  description: string;
  icon: any;
  href: string;
  tools: Tool[];
}

// Static menu data as fallback
const staticMenuData = {
  imageTools: {
    title: "Image Tools",
    description: "10+ professional image editing tools",
    icon: Image,
    href: "/tools/image-tools",
    tools: [
      { name: "Image Resizer", href: "/tools/image-tools/image-resizer", status: "popular" as const, description: "Resize images to any dimension", category: "imageTools" },
      { name: "Image Compressor", href: "/tools/image-tools/image-compressor", status: "live" as const, description: "Compress images without quality loss", category: "imageTools" },
      { name: "Image Cropper", href: "/tools/image-tools/image-cropper", status: "live" as const, description: "Crop images to perfect size", category: "imageTools" },
      { name: "Background Remover", href: "/tools/image-tools/background-remover", status: "live" as const, description: "Remove background automatically", category: "imageTools" },
      { name: "Format Converter", href: "/tools/image-tools/image-converter", status: "live" as const, description: "Convert between image formats", category: "imageTools" },
      { name: "Image Rotator", href: "/tools/image-tools/image-rotator", status: "live" as const, description: "Rotate and flip images", category: "imageTools" },
      { name: "Image Filters", href: "/tools/image-tools/image-filters", status: "live" as const, description: "Apply beautiful filters", category: "imageTools" },
      { name: "Meme Generator", href: "/tools/image-tools/meme-generator", status: "new" as const, description: "Create memes instantly", category: "imageTools" },
      { name: "Favicon Generator", href: "/tools/image-tools/favicon-generator", status: "live" as const, description: "Generate favicons for websites", category: "imageTools" },
      { name: "Photo Collage", href: "/tools/image-tools/photo-collage", status: "live" as const, description: "Create beautiful collages", category: "imageTools" },
    ],
  },
  pdfTools: {
    title: "PDF Tools",
    description: "4+ PDF manipulation tools",
    icon: FileText,
    href: "/tools/pdf-tools",
    tools: [
      { name: "PDF Merger", href: "/tools/pdf-tools/pdf-merger", status: "popular" as const, description: "Merge multiple PDFs into one", category: "pdfTools" },
      { name: "PDF Splitter", href: "/tools/pdf-tools/pdf-splitter", status: "live" as const, description: "Split PDF into multiple files", category: "pdfTools" },
      { name: "PDF Compressor", href: "/tools/pdf-tools/pdf-compressor", status: "live" as const, description: "Compress PDF file size", category: "pdfTools" },
      { name: "PDF to Word", href: "/tools/pdf-tools/pdf-to-word", status: "new" as const, description: "Convert PDF to Word document", category: "pdfTools" },
    ],
  },
  calculators: {
    title: "Calculators",
    description: "10+ smart calculators",
    icon: Calculator,
    href: "/tools/calculators",
    tools: [
      { name: "BMI Calculator", href: "/tools/calculators/bmi-calculator", status: "popular" as const, description: "Calculate Body Mass Index", category: "calculators" },
      { name: "Age Calculator", href: "/tools/calculators/age-calculator", status: "live" as const, description: "Calculate exact age", category: "calculators" },
      { name: "Loan Calculator", href: "/tools/calculators/loan-calculator", status: "live" as const, description: "Calculate loan payments", category: "calculators" },
      { name: "Currency Converter", href: "/tools/calculators/currency-converter", status: "live" as const, description: "Convert currencies", category: "calculators" },
      { name: "Unit Converter", href: "/tools/calculators/unit-converter", status: "live" as const, description: "Convert various units", category: "calculators" },
      { name: "Percentage Calculator", href: "/tools/calculators/percentage-calculator", status: "live" as const, description: "Calculate percentages", category: "calculators" },
      { name: "Date Calculator", href: "/tools/calculators/date-calculator", status: "live" as const, description: "Calculate date differences", category: "calculators" },
      { name: "Tip Calculator", href: "/tools/calculators/tip-calculator", status: "live" as const, description: "Calculate tips easily", category: "calculators" },
      { name: "GPA Calculator", href: "/tools/calculators/gpa-calculator", status: "live" as const, description: "Calculate GPA score", category: "calculators" },
      { name: "Compound Interest", href: "/tools/calculators/compound-interest", status: "new" as const, description: "Calculate compound interest", category: "calculators" },
    ],
  },
  codeTools: {
    title: "Code Tools",
    description: "8+ developer tools",
    icon: Code,
    href: "/tools/code-tools",
    tools: [
      { name: "JSON Formatter", href: "/tools/code-tools/json-formatter", status: "popular" as const, description: "Format and validate JSON", category: "codeTools" },
      { name: "QR Code Generator", href: "/tools/code-tools/qr-code-generator", status: "popular" as const, description: "Generate QR codes", category: "codeTools" },
      { name: "HTML Formatter", href: "/tools/code-tools/html-formatter", status: "live" as const, description: "Format HTML code", category: "codeTools" },
      { name: "CSS Formatter", href: "/tools/code-tools/css-formatter", status: "live" as const, description: "Format CSS code", category: "codeTools" },
      { name: "JavaScript Formatter", href: "/tools/code-tools/javascript-formatter", status: "live" as const, description: "Format JavaScript code", category: "codeTools" },
      { name: "XML Formatter", href: "/tools/code-tools/xml-formatter", status: "live" as const, description: "Format XML documents", category: "codeTools" },
      { name: "Base64 Encoder", href: "/tools/code-tools/base64-encoder", status: "live" as const, description: "Encode/decode Base64", category: "codeTools" },
      { name: "URL Encoder", href: "/tools/code-tools/url-encoder", status: "new" as const, description: "Encode/decode URLs", category: "codeTools" },
    ],
  },
  textTools: {
    title: "Text Tools",
    description: "9+ text processing tools",
    icon: Type,
    href: "/tools/text-tools",
    tools: [
      { name: "Word Counter", href: "/tools/text-tools/word-counter", status: "popular" as const, description: "Count words and characters", category: "textTools" },
      { name: "Character Counter", href: "/tools/text-tools/character-counter", status: "live" as const, description: "Count characters", category: "textTools" },
      { name: "Case Converter", href: "/tools/text-tools/case-converter", status: "live" as const, description: "Convert text cases", category: "textTools" },
      { name: "Text Extractor", href: "/tools/text-tools/text-extractor", status: "live" as const, description: "Extract text from documents", category: "textTools" },
      { name: "Lorem Ipsum Generator", href: "/tools/text-tools/lorem-ipsum", status: "live" as const, description: "Generate placeholder text", category: "textTools" },
      { name: "Markdown Editor", href: "/tools/text-tools/markdown-editor", status: "live" as const, description: "Edit markdown online", category: "textTools" },
      { name: "Text Diff Checker", href: "/tools/text-tools/text-diff", status: "live" as const, description: "Compare text differences", category: "textTools" },
      { name: "Regex Tester", href: "/tools/text-tools/regex-tester", status: "live" as const, description: "Test regular expressions", category: "textTools" },
      { name: "CV Builder", href: "/tools/text-tools/cv-builder", status: "new" as const, description: "Build professional resumes", category: "textTools" },
    ],
  },
  designTools: {
    title: "Design Tools",
    description: "1+ design utilities",
    icon: Palette,
    href: "/tools/design-tools",
    tools: [
      { name: "Color Picker", href: "/tools/design-tools/color-picker", status: "popular" as const, description: "Pick and convert colors", category: "designTools" },
    ],
  },
  securityTools: {
    title: "Security Tools",
    description: "10+ security utilities",
    icon: Shield,
    href: "/tools/security-tools",
    tools: [
      { name: "Password Generator", href: "/tools/security-tools/password-generator", status: "popular" as const, description: "Generate secure passwords", category: "securityTools" },
      { name: "Hash Generator", href: "/tools/security-tools/hash-generator", status: "live" as const, description: "Generate hash values", category: "securityTools" },
      { name: "Encryption Tools", href: "/tools/security-tools/encryption-tools", status: "new" as const, description: "Encrypt and decrypt data", category: "securityTools" },
      { name: "SSL Checker", href: "/tools/security-tools/ssl-checker", status: "live" as const, description: "Check SSL certificate status", category: "securityTools" },
      { name: "API Security", href: "/tools/security-tools/api-security", status: "live" as const, description: "Test API security", category: "securityTools" },
      { name: "Two-Factor Auth", href: "/tools/security-tools/two-factor-auth", status: "live" as const, description: "2FA setup and management", category: "securityTools" },
      { name: "Data Masking", href: "/tools/security-tools/data-masking", status: "soon" as const, description: "Mask sensitive data", category: "securityTools" },
      { name: "Firewall Tester", href: "/tools/security-tools/firewall-tester", status: "soon" as const, description: "Test firewall configurations", category: "securityTools" },
      { name: "Security Analyzer", href: "/tools/security-tools/security-analyzer", status: "soon" as const, description: "Analyze security posture", category: "securityTools" },
      { name: "Secure File Wipe", href: "/tools/security-tools/secure-file-wipe", status: "soon" as const, description: "Securely delete files", category: "securityTools" },
    ],
  },
};

// 🔥 COMPLETE TRANSLATION MAPS FOR ALL 4 LANGUAGES
const categoryTranslations: Record<string, Record<string, { title: string; description: string }>> = {
  ur: {
    imageTools: { title: "امیج ٹولز", description: "10+ پروفیشنل امیج ایڈیٹنگ ٹولز" },
    pdfTools: { title: "پی ڈی ایف ٹولز", description: "4+ پی ڈی ایف ٹولز" },
    calculators: { title: "کیلکولیٹرز", description: "10+ سمارٹ کیلکولیٹرز" },
    codeTools: { title: "کوڈ ٹولز", description: "8+ ڈویلپر ٹولز" },
    textTools: { title: "ٹیکسٹ ٹولز", description: "9+ ٹیکسٹ پروسیسنگ ٹولز" },
    designTools: { title: "ڈیزائن ٹولز", description: "1+ ڈیزائن یوٹیلیٹیز" },
    securityTools: { title: "سیکیورٹی ٹولز", description: "10+ سیکیورٹی یوٹیلیٹیز" },
  },
  ar: {
    imageTools: { title: "أدوات الصور", description: "10+ أدوات تحرير صور احترافية" },
    pdfTools: { title: "أدوات PDF", description: "4+ أدوات معالجة PDF" },
    calculators: { title: "الحاسبات", description: "10+ حاسبات ذكية" },
    codeTools: { title: "أدوات البرمجة", description: "8+ أدوات للمطورين" },
    textTools: { title: "أدوات النص", description: "9+ أدوات معالجة النصوص" },
    designTools: { title: "أدوات التصميم", description: "1+ أدوات تصميم" },
    securityTools: { title: "أدوات الأمان", description: "10+ أدوات أمان" },
  },
  hi: {
    imageTools: { title: "इमेज टूल्स", description: "10+ प्रोफेशनल इमेज एडिटिंग टूल्स" },
    pdfTools: { title: "PDF टूल्स", description: "4+ PDF मैनिपुलेशन टूल्स" },
    calculators: { title: "कैलकुलेटर", description: "10+ स्मार्ट कैलकुलेटर" },
    codeTools: { title: "कोड टूल्स", description: "8+ डेवलपर टूल्स" },
    textTools: { title: "टेक्स्ट टूल्स", description: "9+ टेक्स्ट प्रोसेसिंग टूल्स" },
    designTools: { title: "डिज़ाइन टूल्स", description: "1+ डिज़ाइन यूटिलिटीज" },
    securityTools: { title: "सिक्योरिटी टूल्स", description: "10+ सिक्योरिटी यूटिलिटीज" },
  },
};

const uiTranslations: Record<string, Record<string, string>> = {
  ur: {
    tools: "ٹولز",
    searchTools: "ٹولز تلاش کریں...",
    searchResults: "تلاش کے نتائج",
    viewAll: "تمام دیکھیں",
    closeMenu: "مینو بند کریں",
    popular: "مقبول",
    new: "نیا",
    live: "لائیو",
    soon: "جلد",
  },
  ar: {
    tools: "أدوات",
    searchTools: "البحث عن الأدوات...",
    searchResults: "نتائج البحث",
    viewAll: "عرض الكل",
    closeMenu: "إغلاق القائمة",
    popular: "شائع",
    new: "جديد",
    live: "مباشر",
    soon: "قريباً",
  },
  hi: {
    tools: "टूल्स",
    searchTools: "टूल्स खोजें...",
    searchResults: "खोज परिणाम",
    viewAll: "सभी देखें",
    closeMenu: "मेनू बंद करें",
    popular: "लोकप्रिय",
    new: "नया",
    live: "लाइव",
    soon: "जल्द",
  },
};

const statusTranslations: Record<string, Record<string, string>> = {
  ur: { popular: "مقبول", new: "نیا", live: "لائیو", soon: "جلد" },
  ar: { popular: "شائع", new: "جديد", live: "مباشر", soon: "قريباً" },
  hi: { popular: "लोकप्रिय", new: "नया", live: "लाइव", soon: "जल्द" },
};

export default function MegaMenu({
  mobile = false,
  onItemClick,
  category = "all",
  lang
}: MegaMenuProps) {
  
  const defaultMenuData = useMemo(() => staticMenuData, []);
  const { t } = useTranslation({ namespace: 'menu' });
  
  // 🔥 Get translated text with fallback
  const getUIText = useCallback((key: string, fallback: string): string => {
    const translated = t(key);
    if (translated && typeof translated === 'string' && translated !== key) {
      return translated;
    }
    return uiTranslations[lang]?.[key] || fallback;
  }, [lang, t]);

  const getStatusText = useCallback((status: string, fallback: string): string => {
    return statusTranslations[lang]?.[status] || fallback;
  }, [lang]);

  const getCategoryTitle = useCallback((categoryKey: string, englishTitle: string): string => {
    return categoryTranslations[lang]?.[categoryKey]?.title || englishTitle;
  }, [lang]);

  const getCategoryDescription = useCallback((categoryKey: string, englishDesc: string): string => {
    return categoryTranslations[lang]?.[categoryKey]?.description || englishDesc;
  }, [lang]);

  const categoriesToDisplay = useMemo(() => {
    if (category === "all") {
      return Object.entries(defaultMenuData);
    } else {
      return Object.entries(defaultMenuData).filter(([key]) => key === category);
    }
  }, [category, defaultMenuData]);

  const getAllTools = useCallback((): Tool[] => {
    return Object.values(defaultMenuData).flatMap(
      (categoryData) => categoryData.tools,
    );
  }, [defaultMenuData]);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { themeColors } = useTheme();

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTools([]);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const results = getAllTools().filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.category.toLowerCase().includes(query),
      );
      setFilteredTools(results.slice(0, 10));
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, getAllTools]);

  const closeMenu = useCallback(() => {
    setIsVisible(false);
    setActiveMenu(null);
    setSearchQuery("");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeMenu]);

  const handleToolClick = useCallback((tool: Tool) => {
    closeMenu();
    onItemClick?.();
  }, [closeMenu, onItemClick]);

  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    
    if (newVisibility && categoriesToDisplay.length > 0) {
      setActiveMenu(categoriesToDisplay[0][0]);
    } else {
      setSearchQuery("");
    }
  }, [isVisible, categoriesToDisplay]);

  const getStatusBadge = useCallback((status: Tool["status"]) => {
    const colors: Record<string, { color: string; bgColor: string; text: string }> = {
      popular: {
        text: getStatusText('popular', 'Popular'),
        color: themeColors.warning || "#f59e0b",
        bgColor: `${themeColors.warning || "#f59e0b"}20`,
      },
      new: {
        text: getStatusText('new', 'New'),
        color: themeColors.secondary || "#8b5cf6",
        bgColor: `${themeColors.secondary || "#8b5cf6"}20`,
      },
      soon: {
        text: getStatusText('soon', 'Soon'),
        color: themeColors.warning || "#f59e0b",
        bgColor: `${themeColors.warning || "#f59e0b"}20`,
      },
      live: {
        text: getStatusText('live', 'Live'),
        color: themeColors.success || "#10b981",
        bgColor: `${themeColors.success || "#10b981"}20`,
      },
    };
    return colors[status] || colors.live;
  }, [themeColors, getStatusText]);

  const buttonText = useMemo(() => {
    if (category === "all") {
      return getUIText('tools', 'Tools');
    }
    const categoryData = defaultMenuData[category as keyof typeof defaultMenuData];
    if (!categoryData) {
      return getUIText('tools', 'Tools');
    }
    const title = categoryData.title.replace(" Tools", "");
    return getCategoryTitle(category, title);
  }, [category, defaultMenuData, getUIText, getCategoryTitle]);

  const isMobileView = windowSize.width < 1024;

  // Mobile version
  if (mobile || isMobileView) {
    return (
      <div className="mobile-menu w-full" ref={menuRef}>
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="flex items-center justify-between w-full font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:scale-[1.02]"
          style={{
            color: themeColors.text?.primary || "#0f172a",
            backgroundColor: themeColors.surface,
          }}
        >
          <span className="text-sm sm:text-base">{buttonText}</span>
          <ChevronDown
            className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${isVisible ? "rotate-180" : ""}`}
          />
        </button>

        {isVisible && (
          <div className="mt-2 space-y-2 w-full">
            {/* Search Bar */}
            <div className="p-2">
              <div className="relative w-full">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: themeColors.text?.secondary || "#64748b" }}
                />
                <input
                  type="text"
                  placeholder={getUIText('searchTools', 'Search tools...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: themeColors.background,
                    color: themeColors.text?.primary || "#0f172a",
                    border: `1px solid ${themeColors.border}`,
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: themeColors.text?.secondary || "#64748b" }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            {searchQuery && filteredTools.length > 0 && (
              <div className="p-2">
                <h3 className="text-sm font-medium mb-2">
                  {getUIText('searchResults', 'Search Results')}
                </h3>
                <div className="space-y-2">
                  {filteredTools.map((tool) => (
                    <Link
                      key={tool.name}
                      href={`/${lang}${tool.href}`}
                      className="flex items-center justify-between p-3 rounded-lg text-sm w-full no-underline hover:scale-[1.02] transition-transform"
                      style={{
                        backgroundColor: themeColors.surface,
                        color: themeColors.text?.primary || "#0f172a",
                        border: `1px solid ${themeColors.border}`,
                      }}
                      onClick={() => handleToolClick(tool)}
                      prefetch={false}
                    >
                      <span className="truncate">{tool.name}</span>
                      <span
                        className="text-xs px-2 py-1 rounded-full shrink-0"
                        style={{
                          backgroundColor: getStatusBadge(tool.status).bgColor,
                          color: getStatusBadge(tool.status).color,
                        }}
                      >
                        {getStatusBadge(tool.status).text}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {!searchQuery &&
              categoriesToDisplay.map(([key, categoryData]) => (
                <div
                  key={key}
                  className="border-b w-full"
                  style={{ borderColor: themeColors.border }}
                >
                  <Link
                    href={`/${lang}${categoryData.href}`}
                    className="flex items-center justify-between font-medium py-2 px-3 rounded-lg transition-all duration-300 group w-full no-underline hover:scale-[1.02]"
                    style={{
                      color: themeColors.text?.primary || "#0f172a",
                      backgroundColor: themeColors.surface,
                    }}
                    prefetch={false}
                  >
                    <span className="text-sm sm:text-base">
                      {getCategoryTitle(key, categoryData.title)}
                    </span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <div className="px-3 space-y-1 mt-2 pb-2">
                    {categoryData.tools
                      .slice(0, windowSize.width < 768 ? 3 : 5)
                      .map((tool) => (
                        <Link
                          key={tool.name}
                          href={`/${lang}${tool.href}`}
                          className="flex items-center justify-between text-sm py-1 px-3 rounded transition-all duration-300 w-full no-underline hover:scale-[1.02]"
                          style={{
                            color: themeColors.text?.secondary || "#64748b",
                            backgroundColor: themeColors.background,
                          }}
                          onClick={() => handleToolClick(tool)}
                          prefetch={false}
                        >
                          <span className="truncate">{tool.name}</span>
                          <span
                            className="text-xs px-2 py-1 rounded-full shrink-0"
                            style={{
                              backgroundColor: getStatusBadge(tool.status).bgColor,
                              color: getStatusBadge(tool.status).color,
                            }}
                          >
                            {getStatusBadge(tool.status).text}
                          </span>
                        </Link>
                      ))}
                    {categoryData.tools.length > (windowSize.width < 768 ? 3 : 5) && (
                      <Link
                        href={`/${lang}${categoryData.href}`}
                        className="flex items-center justify-center gap-1 text-sm py-2 px-3 rounded transition-all duration-300 font-medium w-full no-underline hover:scale-[1.02]"
                        style={{
                          color: themeColors.primary,
                          backgroundColor: `${themeColors.primary}10`,
                        }}
                        prefetch={false}
                      >
                        <span>
                          {lang === 'ur' 
                            ? `${getUIText('viewAll', 'تمام')} ${categoryData.tools.length} ${getUIText('tools', 'ٹولز')}`
                            : `${getUIText('viewAll', 'View All')} ${categoryData.tools.length} ${getUIText('tools', 'Tools')}`
                          }
                        </span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}

            <button
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 text-sm font-medium py-2 px-4 rounded-lg w-full mt-2 hover:scale-[1.02] transition-transform"
              style={{
                color: themeColors.error,
                backgroundColor: `${themeColors.error}10`,
              }}
            >
              <X className="h-4 w-4" />
              {getUIText('closeMenu', 'Close Menu')}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Desktop version (same updates applied)
  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="flex items-center gap-2 px-3 py-3 transition-colors font-medium group text-sm lg:text-base cursor-pointer hover:scale-[1.05] transition-transform"
        style={{ color: themeColors.text?.primary || "#0f172a" }}
        onClick={toggleMenu}
      >
        <span>{buttonText}</span>
        <ChevronDown
          className={`h-4 w-4 lg:h-5 lg:w-5 transition-transform ${isVisible ? "rotate-180" : ""}`}
        />
        <span
          className="absolute bottom-0 left-0 right-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
          style={{
            background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary})`,
          }}
        />
      </button>

      {isVisible && (
        <div
          ref={menuRef}
          className="fixed top-full z-50 mt-1 left-1/2 transform -translate-x-1/2"
          style={{
            width: windowSize.width >= 1536 ? "1400px" : "1200px",
            maxWidth: "calc(100vw - 2rem)",
            maxHeight: "80vh",
            backgroundColor: themeColors.background,
            border: `1px solid ${themeColors.border}`,
            boxShadow: `0 20px 40px ${themeColors.primary}10`,
            borderRadius: "1rem",
            overflow: "hidden",
          }}
        >
          <div className="p-4">
            <div className="flex gap-4 max-h-[60vh]">
              <div className="w-1/5 min-w-[180px] shrink-0 flex flex-col gap-3 overflow-y-auto pr-2">
                {categoriesToDisplay.map(([key, categoryData]) => {
                  const IconComponent = categoryData.icon;
                  const isActive = activeMenu === key && !searchQuery;
                  
                  return (
                    <div
                      key={key}
                      className="group cursor-pointer"
                      onClick={() => !searchQuery && setActiveMenu(key)}
                    >
                      <Link
                        href={`/${lang}${categoryData.href}`}
                        className={`block p-3 rounded-xl transition-all duration-300 group-hover:scale-[1.02] min-h-[80px] no-underline hover:no-underline`}
                        style={{
                          background: isActive
                            ? `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                            : themeColors.surface,
                          color: isActive
                            ? themeColors.text?.accent || "#ffffff"
                            : themeColors.text?.primary || "#0f172a",
                          border: isActive
                            ? "none"
                            : `1px solid ${themeColors.border}`,
                        }}
                        prefetch={false}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <IconComponent className="h-4 w-4" />
                          <h3 className="text-sm font-semibold truncate">
                            {getCategoryTitle(key, categoryData.title)}
                          </h3>
                        </div>
                        <p className="text-xs opacity-90 line-clamp-2">
                          {getCategoryDescription(key, categoryData.description)}
                        </p>
                      </Link>
                    </div>
                  );
                })}
              </div>

              <div className="flex-1 min-w-0 flex flex-col">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <input
                      type="text"
                      placeholder={lang === 'ur' ? "50+ ٹولز تلاش کریں..." : "Search 50+ tools..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 rounded-xl text-sm cursor-text"
                      style={{
                        backgroundColor: themeColors.surface,
                        color: themeColors.text?.primary || "#0f172a",
                        border: `1px solid ${themeColors.border}`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                  {activeMenu && !searchQuery && defaultMenuData[activeMenu as keyof typeof defaultMenuData] && (
                    <div className="grid grid-cols-4 gap-3">
                      {defaultMenuData[activeMenu as keyof typeof defaultMenuData].tools.map((tool) => (
                        <Link
                          key={tool.name}
                          href={`/${lang}${tool.href}`}
                          className="group/card rounded-lg p-3 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg no-underline hover:no-underline"
                          style={{
                            background: themeColors.surface,
                            borderColor: themeColors.border,
                          }}
                          onClick={() => handleToolClick(tool)}
                          prefetch={false}
                        >
                          <div className="text-sm font-semibold truncate mb-1">
                            {tool.name}
                          </div>
                          <p className="text-xs line-clamp-2 mb-2">
                            {tool.description}
                          </p>
                          <span
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: getStatusBadge(tool.status).bgColor,
                              color: getStatusBadge(tool.status).color,
                            }}
                          >
                            {getStatusBadge(tool.status).text}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={closeMenu}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:scale-110 transition-transform cursor-pointer"
            style={{
              backgroundColor: `${themeColors.error}10`,
              color: themeColors.error,
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}