// components/sections/AllToolsHeroSection/AllToolsHeroSection.tsx
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { 
  getToolsGroupedByCategory, 
  getPopularTools,
  getToolIcon,
  getCategoryColor 
} from '@/lib/data/tools';

const ToolCard = dynamic(() => import('@/components/ui/ToolCard'), {
  loading: () => (
    <div className="h-32 bg-surface rounded-xl animate-pulse" 
         role="status" 
         aria-label="Loading tool..." />
  ),
  ssr: true
});

interface AllToolsHeroSectionProps {
  maxTools?: number;
  columns?: 3 | 4 | 6;
  lang: string;
}

// ✅ HARD-CODED FALLBACKS
const getHardcodedTexts = (lang: string) => {
  const texts: Record<string, any> = {
    ur: {
      free: 'مفت',
      use: 'استعمال کریں',
      noInstall: '🔧 انسٹالیشن کی ضرورت نہیں',
      popularTools: 'مقبول ٹولز',
      viewAll: 'سب دیکھیں →',
      allTools: 'تمام دستیاب ٹولز',
      showing: 'دکھا رہا ہے',
      tools: 'ٹولز',
      exploreAll: 'تمام ٹولز دیکھیں',
      search: 'تلاش کریں',
      searchPlaceholder: 'ٹولز تلاش کریں...',
      categories: {
        calculators: 'کیلکولیٹرز',
        'code-tools': 'کوڈ ٹولز',
        'design-tools': 'ڈیزائن ٹولز',
        'security-tools': 'سیکیورٹی ٹولز',
        'image-tools': 'امیج ٹولز',
        'pdf-tools': 'پی ڈی ایف ٹولز',
        'text-tools': 'ٹیکسٹ ٹولز',
        educational: 'تعلیمی ٹولز'
      }
    },
    ar: {
      free: 'مجاني',
      use: 'استخدام',
      noInstall: '🔧 لا يتطلب التثبيت',
      popularTools: 'الأدوات الشائعة',
      viewAll: 'عرض الكل →',
      allTools: 'جميع الأدوات المتاحة',
      showing: 'عرض',
      tools: 'أدوات',
      exploreAll: 'استكشف جميع الأدوات',
      search: 'بحث',
      searchPlaceholder: 'ابحث عن الأدوات...',
      categories: {
        calculators: 'الحاسبات',
        'code-tools': 'أدوات البرمجة',
        'design-tools': 'أدوات التصميم',
        'security-tools': 'أدوات الأمان',
        'image-tools': 'أدوات الصور',
        'pdf-tools': 'أدوات PDF',
        'text-tools': 'أدوات النصوص',
        educational: 'أدوات تعليمية'
      }
    },
    hi: {
      free: 'मुफ्त',
      use: 'उपयोग करें',
      noInstall: '🔧 इंस्टॉलेशन की आवश्यकता नहीं',
      popularTools: 'लोकप्रिय टूल्स',
      viewAll: 'सभी देखें →',
      allTools: 'सभी उपलब्ध टूल्स',
      showing: 'दिखा रहा है',
      tools: 'टूल्स',
      exploreAll: 'सभी टूल्स देखें',
      search: 'खोजें',
      searchPlaceholder: 'टूल्स खोजें...',
      categories: {
        calculators: 'कैलकुलेटर',
        'code-tools': 'कोड टूल्स',
        'design-tools': 'डिज़ाइन टूल्स',
        'security-tools': 'सुरक्षा टूल्स',
        'image-tools': 'इमेज टूल्स',
        'pdf-tools': 'PDF टूल्स',
        'text-tools': 'टेक्स्ट टूल्स',
        educational: 'शैक्षिक टूल्स'
      }
    },
    en: {
      free: 'Free',
      use: 'Use',
      noInstall: '🔧 No installation required',
      popularTools: 'Popular Tools',
      viewAll: 'View All →',
      allTools: 'All Available Tools',
      showing: 'Showing',
      tools: 'Tools',
      exploreAll: 'Explore All Tools',
      search: 'Search',
      searchPlaceholder: 'Search tools...',
      categories: {}
    }
  };
  return texts[lang] || texts.en;
};

async function getTranslations(lang: string) {
  try {
    const translations = await import(`@/translations/${lang}/common.json`)
      .then(module => module.default)
      .catch(() => import(`@/translations/en/common.json`).then(m => m.default));
    return translations;
  } catch (error) {
    return {};
  }
}

export default async function AllToolsHeroSection({ 
  maxTools = 24, 
  columns = 4,
  lang
}: AllToolsHeroSectionProps) {
  
  const translations = await getTranslations(lang);
  const hardcoded = getHardcodedTexts(lang);
  
  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Try hardcoded first
        const hardcodedValue = key.split('.').reduce((obj: any, k) => obj?.[k], hardcoded);
        return hardcodedValue || defaultValue || key;
      }
    }
    return typeof value === 'string' ? value : (defaultValue || key);
  };
  
  const toolsByCategory = await getToolsGroupedByCategory(lang);
  const popularTools = await getPopularTools(12, lang);
  
  const allTools = Object.values(toolsByCategory)
    .flat()
    .slice(0, maxTools)
    .map(tool => ({
      ...tool,
      icon: getToolIcon(tool.category),
      color: getCategoryColor(tool.category)
    }));

  const categoryEntries = Object.entries(toolsByCategory);
  const categoryPreview = categoryEntries
    .slice(0, 4)
    .map(([category, tools]) => ({
      category,
      tools: tools.slice(0, 6).map(tool => ({
        ...tool,
        icon: getToolIcon(tool.category),
        color: getCategoryColor(tool.category)
      })),
      totalTools: tools.length
    }));

  const gridClasses = {
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
  };

  // ✅ Get category name with hardcoded fallback
  const getCategoryDisplayName = (category: string): string => {
    return hardcoded.categories[category] || t(`category_list.${category}`, category);
  };

  return (
    <section className="py-12 bg-linear-to-b from-background to-surface" aria-labelledby="all-tools-title">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <form className="max-w-2xl mx-auto" action={`/${lang}/search`} method="GET">
            <div className="relative">
              <input
                type="search"
                name="q"
                placeholder={hardcoded.searchPlaceholder}
                className="w-full px-6 py-4 text-lg rounded-2xl shadow-theme focus:outline-none 
                         focus:ring-4 focus:ring-primary/30 transition-all
                         bg-surface text-text-primary border-2 border-border"
                aria-label={hardcoded.search}
              />
              <button
                type="submit"
                className="absolute right-3 top-3 px-6 py-2 font-semibold rounded-xl 
                           transition-all duration-200 hover:scale-105 hover:shadow-theme-medium
                           bg-[#1d4ed8] hover:bg-[#1e40af] text-white
                           focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:ring-offset-2"
                aria-label={hardcoded.search}
              >
                {hardcoded.search}
              </button>
            </div>
          </form>
        </div>

        {/* Popular Tools */}
        {popularTools.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary">
                {hardcoded.popularTools}
              </h2>
              <Link 
                href={`/${lang}/tools`}
                className="font-medium text-[#1d4ed8] hover:text-[#1e40af] 
                           transition-colors focus:outline-none focus:ring-2 
                           focus:ring-[#1d4ed8] focus:ring-offset-2 rounded"
              >
                {hardcoded.viewAll}
              </Link>
            </div>
            <Suspense fallback={<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-surface rounded-xl animate-pulse" role="status" />
              ))}
            </div>}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {popularTools.slice(0, 6).map((tool) => (
                  <ToolCard 
                    key={tool.slug} 
                    tool={{
                      ...tool,
                      icon: getToolIcon(tool.category),
                      color: getCategoryColor(tool.category)
                    }} 
                    compact 
                    lang={lang}
                  />
                ))}
              </div>
            </Suspense>
          </div>
        )}

        {/* Category Previews */}
        {categoryPreview.length > 0 && (
          <div className="space-y-12 mb-16">
            {categoryPreview.map(({ category, tools, totalTools }) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-text-primary">
                    {getCategoryDisplayName(category)} {hardcoded.tools}
                  </h2>
                  <Link 
                    href={`/${lang}/tools/${category}`}
                    className="font-medium text-[#1d4ed8] hover:text-[#1e40af] 
                               transition-colors focus:outline-none focus:ring-2 
                               focus:ring-[#1d4ed8] focus:ring-offset-2 rounded"
                  >
                    {hardcoded.viewAll} ({totalTools}+) →
                  </Link>
                </div>
                
                <Suspense fallback={<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-32 bg-surface rounded-xl animate-pulse" role="status" />
                  ))}
                </div>}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {tools.map((tool) => (
                      <ToolCard key={tool.slug} tool={tool} compact lang={lang} />
                    ))}
                  </div>
                </Suspense>
              </div>
            ))}
          </div>
        )}

        {/* All Tools Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 id="all-tools-title" className="text-2xl font-bold text-text-primary">
              {hardcoded.allTools}
            </h2>
            <div className="text-sm text-text-secondary">
              {hardcoded.showing} {allTools.length} of 500+ {hardcoded.tools}
            </div>
          </div>
          
          <Suspense fallback={<div className={`grid ${gridClasses[columns]} gap-6`}>
            {Array.from({ length: maxTools }).map((_, i) => (
              <div key={i} className="h-48 bg-surface rounded-xl animate-pulse" role="status" />
            ))}
          </div>}>
            <div className={`grid ${gridClasses[columns]} gap-6`}>
              {allTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} lang={lang} />
              ))}
            </div>
          </Suspense>
          
          <div className="text-center pt-8">
            <Link
              href={`/${lang}/tools`}
              className="inline-flex items-center px-8 py-4 font-semibold rounded-xl 
                         transition-all duration-300 hover:scale-105 hover:shadow-theme-medium 
                         bg-[#1d4ed8] hover:bg-[#1e40af] text-white
                         focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] 
                         focus:ring-offset-2"
            >
              {hardcoded.exploreAll}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '500+', label: t('stats.tools_label', 'Free Tools'), desc: t('stats.available_now', 'Available now') },
              { value: '50K+', label: t('stats.users_label', 'Monthly Users'), desc: t('stats.trusted', 'Trusted by users') },
              { value: '100%', label: t('stats.registration_label', 'No Registration'), desc: t('stats.instant', 'Use instantly') },
              { value: '24/7', label: t('stats.uptime_label', 'Uptime'), desc: t('stats.always_available', 'Always available') }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1" role="region">
                <div className="text-3xl font-bold text-text-primary">{stat.value}</div>
                <div className="font-medium text-text-secondary">{stat.label}</div>
                <div className="text-sm text-text-secondary">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}