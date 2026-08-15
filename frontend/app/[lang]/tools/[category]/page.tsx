// app/[lang]/tools/[category]/page.tsx - SERVER COMPONENT (SEO FRIENDLY)
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TOOL_SEO_DATA } from '@/lib/seo/toolSeoData';
import { 
  Calculator, Code, Palette, Image, FileText, Shield, Type,
  ArrowRight, Grid, List, Search
} from 'lucide-react';

// ============================================
// INTERFACES
// ============================================

interface CategoryPageProps {
  params: Promise<{ lang: string; category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ============================================
// CATEGORY CONFIGURATION
// ============================================

const CATEGORY_CONFIG: Record<string, {
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  name: Record<string, string>;
  description: Record<string, string>;
}> = {
  calculators: {
    icon: Calculator,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    name: { en: 'Calculators', ur: 'کیلکولیٹرز', hi: 'कैलकुलेटर', ar: 'الآلات الحاسبة' },
    description: {
      en: 'Free online calculators for math, finance, health, and more.',
      ur: 'ریاضی، مالیات، صحت اور مزید کے لیے مفت آن لائن کیلکولیٹرز۔',
      hi: 'गणित, वित्त, स्वास्थ्य और अधिक के लिए मुफ्त ऑनलाइन कैलकुलेटर।',
      ar: 'آلات حاسبة مجانية للرياضيات والمالية والصحة والمزيد.',
    },
  },
  'code-tools': {
    icon: Code,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    name: { en: 'Code Tools', ur: 'کوڈ ٹولز', hi: 'कोड टूल्स', ar: 'أدوات البرمجة' },
    description: {
      en: 'Formatters, validators, encoders, and generators for developers.',
      ur: 'ڈویلپرز کے لیے فارمیٹرز، ویلیڈیٹرز، انکوڈرز اور جنریٹرز۔',
      hi: 'डेवलपर्स के लिए फॉर्मेटर्स, वैलिडेटर्स, एनकोडर्स और जनरेटर्स।',
      ar: 'منسقات ومحققون ومشفرون ومولدات للمطورين.',
    },
  },
  'design-tools': {
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50 dark:bg-pink-950/30',
    borderColor: 'border-pink-200 dark:border-pink-800',
    name: { en: 'Design Tools', ur: 'ڈیزائن ٹولز', hi: 'डिज़ाइन टूल्स', ar: 'أدوات التصميم' },
    description: {
      en: 'Color pickers, palette generators, and design utilities.',
      ur: 'کلر پیکرز، پیلیٹ جنریٹرز اور ڈیزائن یوٹیلٹیز۔',
      hi: 'कलर पिकर, पैलेट जनरेटर और डिज़ाइन यूटिलिटीज।',
      ar: 'منتقيات الألوان ومولدات اللوحات وأدوات التصميم.',
    },
  },
  'image-tools': {
    icon: Image,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-800',
    name: { en: 'Image Tools', ur: 'امیج ٹولز', hi: 'इमेज टूल्स', ar: 'أدوات الصور' },
    description: {
      en: 'Compress, convert, resize, and edit images online for free.',
      ur: 'تصاویر کو مفت میں آن لائن کمپریس، کنورٹ، ریزائز اور ایڈٹ کریں۔',
      hi: 'छवियों को मुफ्त में ऑनलाइन कंप्रेस, कन्वर्ट, रिसाइज और एडिट करें।',
      ar: 'ضغط وتحويل وتغيير حجم وتحرير الصور عبر الإنترنت مجاناً.',
    },
  },
  'pdf-tools': {
    icon: FileText,
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    borderColor: 'border-red-200 dark:border-red-800',
    name: { en: 'PDF Tools', ur: 'پی ڈی ایف ٹولز', hi: 'पीडीएफ टूल्स', ar: 'أدوات PDF' },
    description: {
      en: 'Merge, split, compress, and convert PDF files online.',
      ur: 'پی ڈی ایف فائلوں کو آن لائن مرج، اسپلٹ، کمپریس اور کنورٹ کریں۔',
      hi: 'पीडीएफ फाइलों को ऑनलाइन मर्ज, स्प्लिट, कंप्रेस और कन्वर्ट करें।',
      ar: 'دمج وتقسيم وضغط وتحويل ملفات PDF عبر الإنترنت.',
    },
  },
  'security-tools': {
    icon: Shield,
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    name: { en: 'Security Tools', ur: 'سیکیورٹی ٹولز', hi: 'सुरक्षा टूल्स', ar: 'أدوات الأمان' },
    description: {
      en: 'Password generators, encryption tools, and security checkers.',
      ur: 'پاس ورڈ جنریٹرز، انکرپشن ٹولز اور سیکیورٹی چیکرز۔',
      hi: 'पासवर्ड जनरेटर, एन्क्रिप्शन टूल्स और सुरक्षा चेकर्स।',
      ar: 'مولدات كلمات المرور وأدوات التشفير وفحص الأمان.',
    },
  },
  'text-tools': {
    icon: Type,
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    name: { en: 'Text Tools', ur: 'ٹیکسٹ ٹولز', hi: 'टेक्स्ट टूल्स', ar: 'أدوات النص' },
    description: {
      en: 'Word counters, case converters, and text manipulation tools.',
      ur: 'ورڈ کاؤنٹرز، کیس کنورٹرز اور ٹیکسٹ مینیپولیشن ٹولز۔',
      hi: 'वर्ड काउंटर, केस कन्वर्टर और टेक्स्ट मैनिपुलेशन टूल्स।',
      ar: 'عدادات الكلمات ومحولات الحالة وأدوات معالجة النصوص.',
    },
  },
};

// ============================================
// STATIC TRANSLATIONS
// ============================================

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: { toolsFound: 'tools found', searchPlaceholder: 'Search in this category...', free: 'Free', noRegistration: 'No Sign-up', viewTool: 'View Tool', home: 'Home', tools: 'Tools' },
  ur: { toolsFound: 'ٹولز ملے', searchPlaceholder: 'اس زمرے میں تلاش کریں...', free: 'مفت', noRegistration: 'کوئی سائن اپ نہیں', viewTool: 'ٹول دیکھیں', home: 'ہوم', tools: 'ٹولز' },
  hi: { toolsFound: 'टूल्स मिले', searchPlaceholder: 'इस श्रेणी में खोजें...', free: 'मुफ्त', noRegistration: 'कोई साइन-अप नहीं', viewTool: 'टूल देखें', home: 'होम', tools: 'टूल्स' },
  ar: { toolsFound: 'أدوات موجودة', searchPlaceholder: 'ابحث في هذه الفئة...', free: 'مجاني', noRegistration: 'بدون تسجيل', viewTool: 'عرض الأداة', home: 'الرئيسية', tools: 'الأدوات' },
};

// ============================================
// METADATA GENERATION (SEO CRITICAL)
// ============================================

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { lang, category } = await params;
  const config = CATEGORY_CONFIG[category];
  
  if (!config) {
    return { title: 'Category Not Found', description: 'The requested category could not be found.', robots: { index: false, follow: false } };
  }
  
  const categoryName = config.name[lang] || config.name.en;
  const categoryDesc = config.description[lang] || config.description.en;
  const toolCount = Object.values(TOOL_SEO_DATA).filter(t => t.category === category).length;
  
  return {
    title: `${categoryName} - ${toolCount}+ Free Online ${categoryName} | Centre.com.pk`,
    description: categoryDesc,
    keywords: `${category} tools, free ${category}, online ${category}, ${categoryName} utilities`,
    openGraph: {
      title: `${categoryName} | Centre.com.pk`,
      description: categoryDesc,
      url: `https://www.centre.com.pk/${lang}/tools/${category}`,
      type: 'website',
      siteName: 'Centre.com.pk',
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title: `${categoryName} | Centre.com.pk`, description: categoryDesc },
    alternates: {
      canonical: `https://www.centre.com.pk/${lang}/tools/${category}`,
      languages: {
        'en': `https://www.centre.com.pk/tools/${category}`,
        'ur': `https://www.centre.com.pk/ur/tools/${category}`,
        'hi': `https://www.centre.com.pk/hi/tools/${category}`,
        'ar': `https://www.centre.com.pk/ar/tools/${category}`,
      },
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getToolsByCategory(category: string) {
  return Object.values(TOOL_SEO_DATA)
    .filter(tool => tool.category === category)
    .sort((a, b) => a.title.localeCompare(b.title));
}

// ============================================
// MAIN PAGE COMPONENT (SERVER COMPONENT - SEO FRIENDLY)
// ============================================

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { lang, category } = await params;
  const config = CATEGORY_CONFIG[category];
  
  if (!config) {
    notFound();
  }
  
  const Icon = config.icon;
  const categoryName = config.name[lang] || config.name.en;
  const categoryDesc = config.description[lang] || config.description.en;
  const isRTL = lang === 'ur' || lang === 'ar';
  
  // Get tools - data is stable
  const tools = getToolsByCategory(category);
  const toolCount = tools.length;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  
  // Schema for SEO
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} - Centre.com.pk`,
    description: `Free online ${categoryName} tools. No registration required.`,
    url: `https://www.centre.com.pk/${lang}/tools/${category}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: tools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: tool.title,
          description: tool.description,
          url: `https://www.centre.com.pk/${lang}/tools/${category}/${tool.slug}`,
          applicationCategory: 'UtilitiesApplication',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
      })),
    },
  };
  
  return (
    <>
      {/* Schema Script - Critical for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Main Content - Server Rendered for SEO */}
      <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
        {/* Hero Section */}
        <section className={`relative overflow-hidden ${config.bgColor}`}>
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container mx-auto px-4 py-12 md:py-16 relative">
            <div className="max-w-4xl">
              {/* Breadcrumb - SEO Friendly */}
              <nav className="flex items-center gap-2 text-sm text-text-secondary mb-4" aria-label="Breadcrumb">
                <Link href={`/${lang}`} className="hover:text-primary transition-colors">{t.home}</Link>
                <span aria-hidden="true">/</span>
                <Link href={`/${lang}/tools`} className="hover:text-primary transition-colors">{t.tools}</Link>
                <span aria-hidden="true">/</span>
                <span className="text-text-primary font-medium" aria-current="page">{categoryName}</span>
              </nav>
              
              {/* Icon and Title */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-text-primary">{categoryName}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-text-secondary">{toolCount} {t.toolsFound}</span>
                    <span className="w-1 h-1 bg-text-secondary/30 rounded-full" aria-hidden="true" />
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">✓ {t.free}</span>
                    <span className="w-1 h-1 bg-text-secondary/30 rounded-full" aria-hidden="true" />
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">✓ {t.noRegistration}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-lg text-text-secondary max-w-3xl">{categoryDesc}</p>
            </div>
          </div>
        </section>
        
        {/* Tools Grid Section */}
        <section className="container mx-auto px-4 py-12">
          {/* Search Bar - Disabled for now */}
          <div className="max-w-md mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/50" aria-hidden="true" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                readOnly
                disabled
                aria-label={t.searchPlaceholder}
              />
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center justify-end mb-6">
            <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-lg" role="radiogroup" aria-label="View options">
              <button className="p-2 rounded-md bg-primary/10 text-primary" aria-label="Grid view" aria-pressed="true">
                <Grid className="w-4 h-4" aria-hidden="true" />
              </button>
              <button className="p-2 rounded-md text-text-secondary hover:text-text-primary transition-colors" aria-label="List view" aria-pressed="false">
                <List className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          
          {/* Tools Grid - SEO Friendly Links */}
          {tools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${lang}/tools/${category}/${tool.slug}`}
                  className={`group bg-surface border ${config.borderColor} rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                >
                  <h2 className="font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors text-lg">
                    {tool.title}
                  </h2>
                  <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                    {tool.description}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    {t.viewTool}
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4" aria-hidden="true">📭</div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">No tools found</h2>
              <p className="text-text-secondary">Check back later for new tools in this category.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

