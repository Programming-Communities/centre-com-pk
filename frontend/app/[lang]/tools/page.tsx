// app/[lang]/tools/page.tsx
// FULLY MULTI-LANGUAGE TOOLS LANDING PAGE - ALL FIXES APPLIED
// WITH REDIS CACHING
import { Metadata } from 'next';
import Link from 'next/link';
import { TOOL_SEO_DATA } from '@/lib/seo/toolSeoData';
import { getCache, setCache } from '@/lib/redis';
import { 
  Calculator, Code, Palette, Image, FileText, Shield, Type,
  Search, TrendingUp, Sparkles, Zap, Globe,
  Users, Wrench, ArrowRight,
  Crown, Gem, Rocket, Target, Trophy, CheckCircle,
  Layout
} from 'lucide-react';

// ============================================
// INTERFACES
// ============================================

interface ToolsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface ToolTranslation {
  title?: string;
  description?: string;
  name?: string;
}

// ============================================
// CATEGORY CONFIGURATION
// ============================================

const CATEGORIES = [
  { 
    id: 'calculators', 
    icon: Calculator, 
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    gradient: 'bg-linear-to-br from-blue-500 to-cyan-500',
    name: { en: 'Calculators', ur: 'کیلکولیٹرز', hi: 'कैलकुलेटर', ar: 'الآلات الحاسبة' },
    description: {
      en: 'Math, finance, health & more',
      ur: 'ریاضی، مالیات، صحت اور مزید',
      hi: 'गणित, वित्त, स्वास्थ्य और अधिक',
      ar: 'الرياضيات والمالية والصحة والمزيد',
    }
  },
  { 
    id: 'code-tools', 
    icon: Code, 
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    gradient: 'bg-linear-to-br from-purple-500 to-pink-500',
    name: { en: 'Code Tools', ur: 'کوڈ ٹولز', hi: 'कोड टूल्स', ar: 'أدوات البرمجة' },
    description: {
      en: 'Formatters, validators & encoders',
      ur: 'فارمیٹرز، ویلیڈیٹرز اور انکوڈرز',
      hi: 'फॉर्मेटर्स, वैलिडेटर्स और एनकोडर्स',
      ar: 'منسقات ومحققون ومشفرون',
    }
  },
  { 
    id: 'image-tools', 
    icon: Image, 
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-800',
    gradient: 'bg-linear-to-br from-green-500 to-emerald-500',
    name: { en: 'Image Tools', ur: 'امیج ٹولز', hi: 'इमेज टूल्स', ar: 'أدوات الصور' },
    description: {
      en: 'Compress, convert & edit images',
      ur: 'تصاویر کمپریس، کنورٹ اور ایڈٹ کریں',
      hi: 'छवियां कंप्रेस, कन्वर्ट और एडिट करें',
      ar: 'ضغط وتحويل وتحرير الصور',
    }
  },
  { 
    id: 'pdf-tools', 
    icon: FileText, 
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    borderColor: 'border-red-200 dark:border-red-800',
    gradient: 'bg-linear-to-br from-red-500 to-orange-500',
    name: { en: 'PDF Tools', ur: 'پی ڈی ایف ٹولز', hi: 'पीडीएफ टूल्स', ar: 'أدوات PDF' },
    description: {
      en: 'Merge, split & convert PDFs',
      ur: 'پی ڈی ایف مرج، اسپلٹ اور کنورٹ کریں',
      hi: 'पीडीएफ मर्ज, स्प्लिट और कन्वर्ट करें',
      ar: 'دمج وتقسيم وتحويل PDF',
    }
  },
  { 
    id: 'security-tools', 
    icon: Shield, 
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    gradient: 'bg-linear-to-br from-yellow-500 to-amber-500',
    name: { en: 'Security Tools', ur: 'سیکیورٹی ٹولز', hi: 'सुरक्षा टूल्स', ar: 'أدوات الأمان' },
    description: {
      en: 'Passwords, encryption & security',
      ur: 'پاس ورڈ، انکرپشن اور سیکیورٹی',
      hi: 'पासवर्ड, एन्क्रिप्शन और सुरक्षा',
      ar: 'كلمات المرور والتشفير والأمان',
    }
  },
  { 
    id: 'text-tools', 
    icon: Type, 
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    gradient: 'bg-linear-to-br from-indigo-500 to-blue-500',
    name: { en: 'Text Tools', ur: 'ٹیکسٹ ٹولز', hi: 'टेक्स्ट टूल्स', ar: 'أدوات النص' },
    description: {
      en: 'Count, convert & manipulate text',
      ur: 'ٹیکسٹ گنیں، کنورٹ کریں اور تبدیل کریں',
      hi: 'टेक्स्ट गिनें, कन्वर्ट करें और बदलें',
      ar: 'عد وتحويل ومعالجة النصوص',
    }
  },
  { 
    id: 'design-tools', 
    icon: Palette, 
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50 dark:bg-pink-950/30',
    borderColor: 'border-pink-200 dark:border-pink-800',
    gradient: 'bg-linear-to-br from-pink-500 to-rose-500',
    name: { en: 'Design Tools', ur: 'ڈیزائن ٹولز', hi: 'डिज़ाइन टूल्स', ar: 'أدوات التصميم' },
    description: {
      en: 'Colors, palettes & design utils',
      ur: 'رنگ، پیلیٹ اور ڈیزائن یوٹیلٹیز',
      hi: 'रंग, पैलेट और डिज़ाइन यूटिलिटीज',
      ar: 'الألوان واللوحات وأدوات التصميم',
    }
  },
];

// ============================================
// TRANSLATIONS
// ============================================

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    heroTitle: 'Free Online Tools',
    heroHighlight: 'For Everyone',
    heroSubtitle: '55 professional calculators, converters, and utilities. No registration, no fees, no limits.',
    searchPlaceholder: 'Search 55 tools... (e.g., "age calculator", "pdf merger")',
    trustedBy: 'Trusted by millions worldwide',
    popularTools: 'Most Popular',
    trendingTools: 'Trending Now',
    allTools: 'All Tools',
    categories: 'Browse by Category',
    viewAll: 'View all',
    toolsCount: 'tools',
    freeBadge: '100% Free',
    noRegistration: 'No Sign-up',
    instantResults: 'Instant Results',
    unlimited: 'Unlimited Use',
    statsTools: 'Tools',
    statsCategories: 'Categories',
    statsLanguages: 'Languages',
    statsUsers: 'Users',
    ctaTitle: 'Start creating, calculating, and converting',
    ctaSubtitle: 'Join millions of users who trust Centre.com.pk for their daily tasks.',
    browseAllTools: 'Browse All Tools',
    quickAccess: 'Quick Access',
    featured: 'Featured',
    new: 'New',
    popular: 'Popular',
    search: 'Search',
    browseAll: 'Browse all',
  },
  ur: {
    heroTitle: 'مفت آن لائن ٹولز',
    heroHighlight: 'سب کے لیے',
    heroSubtitle: '55 پروفیشنل کیلکولیٹرز، کنورٹرز اور یوٹیلٹیز۔ کوئی رجسٹریشن نہیں، کوئی فیس نہیں، کوئی حد نہیں۔',
    searchPlaceholder: '55 ٹولز تلاش کریں... (مثال: "ایج کیلکولیٹر"، "پی ڈی ایف مرجر")',
    trustedBy: 'دنیا بھر میں لاکھوں کا اعتماد',
    popularTools: 'سب سے زیادہ مقبول',
    trendingTools: 'ٹرینڈنگ',
    allTools: 'تمام ٹولز',
    categories: 'زمرے',
    viewAll: 'سب دیکھیں',
    toolsCount: 'ٹولز',
    freeBadge: '100% مفت',
    noRegistration: 'کوئی سائن اپ نہیں',
    instantResults: 'فوری نتائج',
    unlimited: 'لامحدود استعمال',
    statsTools: 'ٹولز',
    statsCategories: 'زمرے',
    statsLanguages: 'زبانیں',
    statsUsers: 'صارفین',
    ctaTitle: 'تخلیق، حساب اور تبدیلی شروع کریں',
    ctaSubtitle: 'لاکھوں صارفین میں شامل ہوں جو اپنے روزمرہ کاموں کے لیے Centre.com.pk پر بھروسہ کرتے ہیں۔',
    browseAllTools: 'تمام ٹولز براؤز کریں',
    quickAccess: 'فوری رسائی',
    featured: 'نمایاں',
    new: 'نیا',
    popular: 'مقبول',
    search: 'تلاش',
    browseAll: 'براؤز کریں',
  },
  hi: {
    heroTitle: 'मुफ्त ऑनलाइन टूल्स',
    heroHighlight: 'सबके लिए',
    heroSubtitle: '55 प्रोफेशनल कैलकुलेटर, कन्वर्टर्स और यूटिलिटीज। कोई रजिस्ट्रेशन नहीं, कोई फीस नहीं, कोई सीमा नहीं।',
    searchPlaceholder: '55 टूल्स खोजें... (उदा: "आयु कैलकुलेटर", "पीडीएफ मर्जर")',
    trustedBy: 'दुनिया भर में लाखों का विश्वास',
    popularTools: 'सबसे लोकप्रिय',
    trendingTools: 'ट्रेंडिंग',
    allTools: 'सभी टूल्स',
    categories: 'श्रेणियाँ',
    viewAll: 'सभी देखें',
    toolsCount: 'टूल्स',
    freeBadge: '100% मुफ्त',
    noRegistration: 'कोई साइन-अप नहीं',
    instantResults: 'तुरंत परिणाम',
    unlimited: 'असीमित उपयोग',
    statsTools: 'टूल्स',
    statsCategories: 'श्रेणियाँ',
    statsLanguages: 'भाषाएँ',
    statsUsers: 'उपयोगकर्ता',
    ctaTitle: 'बनाना, गणना करना और बदलना शुरू करें',
    ctaSubtitle: 'लाखों उपयोगकर्ताओं में शामिल हों जो अपने दैनिक कार्यों के लिए Centre.com.pk पर भरोसा करते हैं।',
    browseAllTools: 'सभी टूल्स ब्राउज़ करें',
    quickAccess: 'त्वरित पहुंच',
    featured: 'विशेष',
    new: 'नया',
    popular: 'लोकप्रिय',
    search: 'खोज',
    browseAll: 'ब्राउज़ करें',
  },
  ar: {
    heroTitle: 'أدوات مجانية عبر الإنترنت',
    heroHighlight: 'للجميع',
    heroSubtitle: '55 آلة حاسبة ومحول وأداة احترافية. بدون تسجيل، بدون رسوم، بدون حدود.',
    searchPlaceholder: 'ابحث في 55 أداة... (مثال: "حاسبة العمر"، "دمج PDF")',
    trustedBy: 'موثوق به من قبل الملايين حول العالم',
    popularTools: 'الأكثر شعبية',
    trendingTools: 'رائج',
    allTools: 'جميع الأدوات',
    categories: 'الفئات',
    viewAll: 'عرض الكل',
    toolsCount: 'أدوات',
    freeBadge: 'مجاني 100%',
    noRegistration: 'بدون تسجيل',
    instantResults: 'نتائج فورية',
    unlimited: 'استخدام غير محدود',
    statsTools: 'أدوات',
    statsCategories: 'فئات',
    statsLanguages: 'لغات',
    statsUsers: 'مستخدمين',
    ctaTitle: 'ابدأ في الإنشاء والحساب والتحويل',
    ctaSubtitle: 'انضم إلى ملايين المستخدمين الذين يثقون في Centre.com.pk لمهامهم اليومية.',
    browseAllTools: 'تصفح جميع الأدوات',
    quickAccess: 'وصول سريع',
    featured: 'مميز',
    new: 'جديد',
    popular: 'شائع',
    search: 'بحث',
    browseAll: 'تصفح',
  },
};

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ params }: ToolsPageProps): Promise<Metadata> {
  const { lang } = await params;
  
  const titles: Record<string, string> = {
    en: 'Free Online Tools - 55 Calculators, Converters & Utilities | Centre.com.pk',
    ur: 'مفت آن لائن ٹولز - 55 کیلکولیٹرز، کنورٹرز اور یوٹیلٹیز | Centre.com.pk',
    hi: 'मुफ्त ऑनलाइन टूल्स - 55 कैलकुलेटर, कन्वर्टर और यूटिलिटीज | Centre.com.pk',
    ar: 'أدوات مجانية عبر الإنترنت - 55 آلة حاسبة ومحولات وأدوات | Centre.com.pk',
  };
  
  return {
    title: titles[lang] || titles.en,
    description: TRANSLATIONS[lang]?.heroSubtitle || TRANSLATIONS.en.heroSubtitle,
    keywords: 'online tools, free tools, calculators, converters, image tools, pdf tools, security tools, text tools, code tools',
    openGraph: {
      title: titles[lang] || titles.en,
      description: TRANSLATIONS[lang]?.heroSubtitle || TRANSLATIONS.en.heroSubtitle,
      url: `https://www.centre.com.pk/${lang}/tools`,
      type: 'website',
      siteName: 'Centre.com.pk',
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title: titles[lang] || titles.en },
    alternates: {
      canonical: `https://www.centre.com.pk/${lang}/tools`,
      languages: { en: '/tools', ur: '/ur/tools', hi: '/hi/tools', ar: '/ar/tools' },
    },
    robots: { index: true, follow: true },
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getAllTools() {
  return Object.values(TOOL_SEO_DATA);
}

function getPopularTools(limit: number = 8) {
  const slugs = ['age-calculator', 'bmi-calculator', 'password-generator', 'json-formatter', 'image-compressor', 'qr-code-generator', 'pdf-merger', 'background-remover'];
  return slugs.map(s => TOOL_SEO_DATA[s as keyof typeof TOOL_SEO_DATA]).filter(Boolean).slice(0, limit);
}

function getTrendingTools(limit: number = 4) {
  const slugs = ['meme-generator', 'api-security', 'markdown-editor', 'two-factor-auth'];
  return slugs.map(s => TOOL_SEO_DATA[s as keyof typeof TOOL_SEO_DATA]).filter(Boolean).slice(0, limit);
}

function getNewTools(limit: number = 4) {
  const slugs = ['photo-collage', 'secure-file-wipe', 'text-diff', 'uuid-generator'];
  return slugs.map(s => TOOL_SEO_DATA[s as keyof typeof TOOL_SEO_DATA]).filter(Boolean).slice(0, limit);
}

function getToolsByCategory(categoryId: string, limit: number) {
  return Object.values(TOOL_SEO_DATA).filter(t => t.category === categoryId).slice(0, limit);
}

function getCategoryCount(categoryId: string): number {
  return Object.values(TOOL_SEO_DATA).filter(t => t.category === categoryId).length;
}

async function loadCategoryTranslations(lang: string, category: string): Promise<Record<string, ToolTranslation>> {
  if (lang === 'en') return {};
  
  try {
    const module = await import(`@/translations/${lang}/tools/${category}.json`);
    return module.default || module || {};
  } catch {
    return {};
  }
}

function StatCard({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <div className="group text-center p-4 sm:p-6 rounded-2xl bg-linear-to-br from-background to-surface border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
      </div>
      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary">{value}</div>
      <div className="text-xs sm:text-sm text-text-secondary">{label}</div>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT (WITH REDIS CACHE)
// ============================================

export default async function ToolsPage({ params, searchParams }: ToolsPageProps) {
  const { lang } = await params;
  
  // ========== REDIS CACHE CHECK ==========
  const cacheKey = `tools:${lang}`;
  const cached = await getCache<any>(cacheKey);
  
  if (cached) {
    return (
      <ToolsPageContent 
        lang={lang}
        allTools={cached.allTools}
        popularTools={cached.popularTools}
        trendingTools={cached.trendingTools}
        newTools={cached.newTools}
        categoryTranslations={cached.categoryTranslations}
      />
    );
  }
  // ========== END REDIS CACHE ==========
  
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRTL = lang === 'ur' || lang === 'ar';
  
  const allTools = getAllTools();
  const popularTools = getPopularTools(8);
  const trendingTools = getTrendingTools(4);
  const newTools = getNewTools(4);
  
  const categoryTranslations: Record<string, Record<string, ToolTranslation>> = {};
  if (lang !== 'en') {
    for (const cat of CATEGORIES) {
      categoryTranslations[cat.id] = await loadCategoryTranslations(lang, cat.id);
    }
  }
  
  // ========== STORE IN REDIS CACHE (1 hour) ==========
  const cacheData = { allTools, popularTools, trendingTools, newTools, categoryTranslations };
  await setCache(cacheKey, cacheData, 3600);
  
  return (
    <ToolsPageContent 
      lang={lang}
      allTools={allTools}
      popularTools={popularTools}
      trendingTools={trendingTools}
      newTools={newTools}
      categoryTranslations={categoryTranslations}
    />
  );
}

// ============================================
// PAGE CONTENT COMPONENT (RENDERED FROM CACHE OR FRESH)
// ============================================

function ToolsPageContent({ lang, allTools, popularTools, trendingTools, newTools, categoryTranslations }: {
  lang: string;
  allTools: any[];
  popularTools: any[];
  trendingTools: any[];
  newTools: any[];
  categoryTranslations: Record<string, Record<string, ToolTranslation>>;
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRTL = lang === 'ur' || lang === 'ar';
  
  const getToolTitle = (tool: any): string => {
    if (lang === 'en') return tool.title;
    const catTrans = categoryTranslations[tool.category] || {};
    const slug = tool.slug;
    const keyVariations = [slug, slug.replace(/-/g, '_'), slug.replace(/-/g, '')];
    for (const key of keyVariations) {
      if (catTrans[key]?.title) return catTrans[key].title;
      if (catTrans[key]?.name) return catTrans[key].name;
    }
    return tool.title;
  };
  
  const getToolDescription = (tool: any): string => {
    if (lang === 'en') return tool.description;
    const catTrans = categoryTranslations[tool.category] || {};
    const slug = tool.slug;
    const keyVariations = [slug, slug.replace(/-/g, '_'), slug.replace(/-/g, '')];
    for (const key of keyVariations) {
      if (catTrans[key]?.description) return catTrans[key].description;
    }
    return tool.description;
  };
  
  const getCategoryName = (cat: any): string => {
    return cat.name[lang as keyof typeof cat.name] || cat.name.en;
  };
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Free Online Tools - Centre.com.pk',
    description: t.heroSubtitle,
    url: `https://www.centre.com.pk/${lang}/tools`,
  };
  
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-primary/10 to-transparent" />
          <div className="absolute top-0 -left-20 w-60 sm:w-80 md:w-96 h-60 sm:h-80 md:h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-20 w-60 sm:w-80 md:w-96 h-60 sm:h-80 md:h-96 bg-secondary/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 lg:py-20 relative">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary">{allTools.length}+ {t.toolsCount}</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-text-primary mb-3 sm:mb-4 md:mb-6 leading-tight">
                {t.heroTitle}{' '}
                <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {t.heroHighlight}
                </span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-text-secondary mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                {t.heroSubtitle}
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 md:gap-3 mb-6 sm:mb-8">
                {[
                  { icon: CheckCircle, text: t.freeBadge, color: 'green' },
                  { icon: Zap, text: t.noRegistration, color: 'blue' },
                  { icon: Globe, text: t.instantResults, color: 'purple' },
                  { icon: Crown, text: t.unlimited, color: 'yellow' },
                ].map((badge, i) => (
                  <span key={i} className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-${badge.color}-100 dark:bg-${badge.color}-900/30 text-${badge.color}-700 dark:text-${badge.color}-300 rounded-full text-xs sm:text-sm`}>
                    <badge.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {badge.text}
                  </span>
                ))}
              </div>
              
              <div className="relative max-w-2xl mx-auto">
                <div className="relative group">
                  <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-secondary/20 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative flex items-center">
                    <Search className={`absolute ${isRTL ? 'right-3 sm:right-4' : 'left-3 sm:left-4'} w-4 h-4 sm:w-5 sm:h-5 text-text-secondary/60`} />
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      className={`w-full ${isRTL ? 'pr-10 sm:pr-12 pl-3 sm:pl-4' : 'pl-10 sm:pl-12 pr-3 sm:pr-4'} py-3 sm:py-4 rounded-xl border-2 border-border bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm sm:text-base shadow-lg`}
                    />
                    <button className={`absolute ${isRTL ? 'left-1.5 sm:left-2' : 'right-1.5 sm:right-2'} px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors`}>
                      {t.search}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-text-secondary/60 mt-2">{t.trustedBy}</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* ===== STATS SECTION ===== */}
        <section className="w-full max-w-full px-1 sm:px-2 py-8 sm:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
            <StatCard icon={Wrench} value={`${allTools.length}+`} label={t.statsTools} />
            <StatCard icon={Layout} value="7" label={t.statsCategories} />
            <StatCard icon={Globe} value="4" label={t.statsLanguages} />
            <StatCard icon={Users} value="1M+" label={t.statsUsers} />
          </div>
        </section>
        
        {/* ===== POPULAR TOOLS ===== */}
        <section className="w-full max-w-full px-1 sm:px-2 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 sm:h-6 bg-primary rounded-full" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">{t.popularTools}</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {popularTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${lang}/tools/${tool.category}/${tool.slug}`}
                className="group bg-surface hover:bg-surface/80 border border-border hover:border-primary/50 rounded-xl p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <h4 className="font-medium text-text-primary group-hover:text-primary transition-colors text-sm sm:text-base truncate">
                  {getToolTitle(tool)}
                </h4>
                <p className="text-xs text-text-secondary line-clamp-2 mt-1 hidden sm:block">
                  {getToolDescription(tool)?.substring(0, 60)}...
                </p>
                <span className="inline-block mt-2 text-xs text-primary font-medium">
                  {getCategoryName(CATEGORIES.find(c => c.id === tool.category) || CATEGORIES[0])}
                </span>
              </Link>
            ))}
          </div>
        </section>
        
        {/* ===== CATEGORIES ===== */}
        <section className="bg-surface/30 py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 mb-3 sm:mb-4">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm text-primary font-medium">{t.categories}</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary">{t.categories}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const catName = getCategoryName(cat);
                const catDesc = cat.description[lang as keyof typeof cat.description] || cat.description.en;
                const tools = getToolsByCategory(cat.id, 3);
                
                return (
                  <div key={cat.id} className={`rounded-2xl border ${cat.borderColor} ${cat.bgColor} overflow-hidden hover:shadow-xl transition-all duration-300`}>
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${cat.gradient} flex items-center justify-center shadow-lg shrink-0`}>
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-1">{catName}</h3>
                          <p className="text-xs sm:text-sm text-text-secondary mb-2">{catDesc}</p>
                          <p className="text-sm text-primary font-medium">{getCategoryCount(cat.id)} {t.toolsCount}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex flex-wrap gap-2">
                          {tools.map((tool) => (
                            <Link
                              key={tool.slug}
                              href={`/${lang}/tools/${cat.id}/${tool.slug}`}
                              className="text-xs px-3 py-1.5 bg-background hover:bg-primary/10 rounded-full transition-colors"
                            >
                              {getToolTitle(tool)}
                            </Link>
                          ))}
                        </div>
                        <Link
                          href={`/${lang}/tools/${cat.id}`}
                          className="inline-flex items-center text-sm font-medium text-primary hover:gap-2 transition-all mt-4"
                        >
                          {t.browseAll} {catName} <ArrowRight className={`w-4 h-4 ml-1 ${isRTL ? 'rotate-180' : ''}`} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* ===== ALL TOOLS SECTION ===== */}
        <section className="w-full max-w-full px-1 sm:px-2 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 sm:h-6 bg-secondary rounded-full" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">{t.allTools}</h2>
            </div>
            <span className="text-text-secondary text-xs sm:text-sm">{allTools.length} {t.toolsCount}</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
            {allTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${lang}/tools/${tool.category}/${tool.slug}`}
                className="group p-2.5 sm:p-3 bg-surface hover:bg-surface/80 border border-border hover:border-primary/30 rounded-lg transition-all hover:-translate-y-0.5"
              >
                <h4 className="font-medium text-text-primary group-hover:text-primary transition-colors text-xs sm:text-sm truncate">
                  {getToolTitle(tool)}
                </h4>
                <p className="text-[10px] sm:text-xs text-text-secondary truncate mt-0.5">
                  {getCategoryName(CATEGORIES.find(c => c.id === tool.category) || CATEGORIES[0])}
                </p>
              </Link>
            ))}
          </div>
        </section>
        
        {/* ===== TRENDING & NEW ===== */}
        <section className="w-full max-w-full px-1 sm:px-2 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <h3 className="text-base sm:text-lg font-bold text-text-primary">{t.trendingTools}</h3>
              </div>
              <div className="space-y-2">
                {trendingTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${lang}/tools/${tool.category}/${tool.slug}`}
                    className="flex items-center gap-3 p-2.5 sm:p-3 bg-surface hover:bg-surface/80 border border-border hover:border-primary/30 rounded-lg transition-all group"
                  >
                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:scale-110 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-text-primary group-hover:text-primary text-sm sm:text-base truncate">
                        {getToolTitle(tool)}
                      </h4>
                      <p className="text-xs text-text-secondary truncate">
                        {getCategoryName(CATEGORIES.find(c => c.id === tool.category) || CATEGORIES[0])}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                <h3 className="text-base sm:text-lg font-bold text-text-primary">{t.new}</h3>
              </div>
              <div className="space-y-2">
                {newTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${lang}/tools/${tool.category}/${tool.slug}`}
                    className="flex items-center gap-3 p-2.5 sm:p-3 bg-surface hover:bg-surface/80 border border-border hover:border-secondary/30 rounded-lg transition-all group"
                  >
                    <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-secondary group-hover:scale-110 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-text-primary group-hover:text-secondary text-sm sm:text-base truncate">
                        {getToolTitle(tool)}
                      </h4>
                      <p className="text-xs text-text-secondary truncate">
                        {getCategoryName(CATEGORIES.find(c => c.id === tool.category) || CATEGORIES[0])}
                      </p>
                    </div>
                    <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] sm:text-xs rounded-full">{t.new}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* ===== CTA SECTION ===== */}
        <section className="bg-linear-to-r from-primary via-primary/95 to-primary/90 py-10 sm:py-14 md:py-16 mt-6 sm:mt-8">
          <div className="container mx-auto px-3 sm:px-4 text-center">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white/80 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
              {t.ctaTitle}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              {t.ctaSubtitle}
            </p>
            <Link
              href={`/${lang}/tools`}
              className="inline-flex items-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white text-primary rounded-xl font-semibold text-sm sm:text-base hover:bg-white/95 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              {t.browseAllTools}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}