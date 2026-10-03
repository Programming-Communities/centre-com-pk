// app/[lang]/tools/[category]/[tool]/page.tsx
import { notFound } from 'next/navigation';
import { TOOL_SEO_DATA } from '@/lib/seo/toolSeoData';
import ToolSEO from '@/components/seo/ToolSEO';
import FAQs from '@/components/seo/FAQs';
import ShareButtons from '@/components/seo/ShareButtons';
import InternalLinks from '@/components/seo/InternalLinks';
import VideoTutorial from '@/components/seo/VideoTutorial';
import Link from 'next/link';
import { ToolSEOData } from '@/lib/seo/types';
import type { Metadata, Viewport } from 'next';
import { GoogleRankingOptimizer } from '@/lib/seo/dynamicOptimizer';
import { Home, ChevronRight, Wrench, FolderOpen } from 'lucide-react';
import { generateToolSchema, generateOrganizationSchema, generateWebsiteSchema } from '@/lib/seo/generateSchema';
import CentralAd from '@/components/ads/CentralAd';
// import RankingDashboard from './ranking';
import { generateOgImageUrl } from '@/lib/seo/generateOgImages';
import dynamic from 'next/dynamic';
import { getCache, setCache } from '@/lib/redis';
import ToolBlogGuide from '@/components/tools/ToolBlogGuide';


// ============================================
// ✅ DYNAMIC TOOL IMPORTS (LAZY LOADING)
// ============================================

const toolComponentMap: Record<string, any> = {
  // Calculators
  'age-calculator': dynamic(() => import('@/components/tools/calculators/age-calculator/tool.client')),
  'bmi-calculator': dynamic(() => import('@/components/tools/calculators/bmi-calculator/tool.client')),
  'currency-converter': dynamic(() => import('@/components/tools/calculators/currency-converter/tool.client')),
  'date-calculator': dynamic(() => import('@/components/tools/calculators/date-calculator/tool.client')),
  'loan-calculator': dynamic(() => import('@/components/tools/calculators/loan-calculator/tool.client')),
  'percentage-calculator': dynamic(() => import('@/components/tools/calculators/percentage-calculator/tool.client')),
  'tip-calculator': dynamic(() => import('@/components/tools/calculators/tip-calculator/tool.client')),
  'compound-interest': dynamic(() => import('@/components/tools/calculators/compound-interest/tool.client')),
  'gpa-calculator': dynamic(() => import('@/components/tools/calculators/gpa-calculator/tool.client')),
  'unit-converter': dynamic(() => import('@/components/tools/calculators/unit-converter/tool.client')),
  // Code Tools
  'base64-encoder': dynamic(() => import('@/components/tools/code-tools/base64-encoder/tool.client')),
  'css-formatter': dynamic(() => import('@/components/tools/code-tools/css-formatter/tool.client')),
  'html-formatter': dynamic(() => import('@/components/tools/code-tools/html-formatter/tool.client')),
  'javascript-formatter': dynamic(() => import('@/components/tools/code-tools/javascript-formatter/tool.client')),
  'json-formatter': dynamic(() => import('@/components/tools/code-tools/json-formatter/tool.client')),
  'qr-code-generator': dynamic(() => import('@/components/tools/code-tools/qr-code-generator/tool.client')),
  'url-encoder': dynamic(() => import('@/components/tools/code-tools/url-encoder/tool.client')),
  'xml-formatter': dynamic(() => import('@/components/tools/code-tools/xml-formatter/tool.client')),
  // Design Tools
  'color-picker': dynamic(() => import('@/components/tools/design-tools/color-picker/tool.client')),
  // Image Tools
  'background-remover': dynamic(() => import('@/components/tools/image-tools/background-remover/tool.client')),
  'favicon-generator': dynamic(() => import('@/components/tools/image-tools/favicon-generator/tool.client')),
  'image-compressor': dynamic(() => import('@/components/tools/image-tools/image-compressor/tool.client')),
  'image-converter': dynamic(() => import('@/components/tools/image-tools/image-converter/tool.client')),
  'image-cropper': dynamic(() => import('@/components/tools/image-tools/image-cropper/tool.client')),
  'image-filters': dynamic(() => import('@/components/tools/image-tools/image-filters/tool.client')),
  'image-resizer': dynamic(() => import('@/components/tools/image-tools/image-resizer/tool.client')),
  'image-rotator': dynamic(() => import('@/components/tools/image-tools/image-rotator/tool.client')),
  'meme-generator': dynamic(() => import('@/components/tools/image-tools/meme-generator/tool.client')),
  'photo-collage': dynamic(() => import('@/components/tools/image-tools/photo-collage/tool.client')),
  // PDF Tools
  'pdf-compressor': dynamic(() => import('@/components/tools/pdf-tools/pdf-compressor/tool.client')),
  'pdf-merger': dynamic(() => import('@/components/tools/pdf-tools/pdf-merger/tool.client')),
  'pdf-splitter': dynamic(() => import('@/components/tools/pdf-tools/pdf-splitter/tool.client')),
  'pdf-to-word': dynamic(() => import('@/components/tools/pdf-tools/pdf-to-word/tool.client')),
  'pdf-protect': dynamic(() => import('@/components/tools/pdf-tools/pdf-protect/tool.client')),
  // Security Tools
  'api-security': dynamic(() => import('@/components/tools/security-tools/api-security/tool.client')),
  'data-masking': dynamic(() => import('@/components/tools/security-tools/data-masking/tool.client')),
  'encryption-tools': dynamic(() => import('@/components/tools/security-tools/encryption-tools/tool.client')),
  'firewall-tester': dynamic(() => import('@/components/tools/security-tools/firewall-tester/tool.client')),
  'hash-generator': dynamic(() => import('@/components/tools/security-tools/hash-generator/tool.client')),
  'password-generator': dynamic(() => import('@/components/tools/security-tools/password-generator/tool.client')),
  'secure-file-wipe': dynamic(() => import('@/components/tools/security-tools/secure-file-wipe/tool.client')),
  'security-analyzer': dynamic(() => import('@/components/tools/security-tools/security-analyzer/tool.client')),
  'ssl-checker': dynamic(() => import('@/components/tools/security-tools/ssl-checker/tool.client')),
  'two-factor-auth': dynamic(() => import('@/components/tools/security-tools/two-factor-auth/tool.client')),
  // Text Tools
  'case-converter': dynamic(() => import('@/components/tools/text-tools/case-converter/tool.client')),
  'character-counter': dynamic(() => import('@/components/tools/text-tools/character-counter/tool.client')),
  'lorem-ipsum': dynamic(() => import('@/components/tools/text-tools/lorem-ipsum/tool.client')),
  'markdown-editor': dynamic(() => import('@/components/tools/text-tools/markdown-editor/tool.client')),
  'regex-tester': dynamic(() => import('@/components/tools/text-tools/regex-tester/tool.client')),
  'text-diff': dynamic(() => import('@/components/tools/text-tools/text-diff/tool.client')),
  'text-extractor': dynamic(() => import('@/components/tools/text-tools/text-extractor/tool.client')),
  'uuid-generator': dynamic(() => import('@/components/tools/text-tools/uuid-generator/tool.client')),
  'word-counter': dynamic(() => import('@/components/tools/text-tools/word-counter/tool.client')),
};

import ToolClientWrapper from './tool.client';

async function getToolComponent(toolSlug: string) {
  return toolComponentMap[toolSlug] || null;
}

// ============================================
// INTERFACES
// ============================================

interface ToolPageProps {
  params: Promise<{
    lang: string;
    category: string;
    tool: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export const viewport: Viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// ============================================
// METADATA GENERATION
// ============================================

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { lang, category, tool } = await params;
  const toolData = TOOL_SEO_DATA[tool as keyof typeof TOOL_SEO_DATA];

  if (!toolData || toolData.category !== category) {
    return {
      title: 'Tool Not Found - Centre.com.pk',
      description: 'The requested tool could not be found.',
      robots: { index: false, follow: false },
    };
  }

  let translatedTitle = toolData.title;
  let translatedDescription = toolData.description;

  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/${category}.json`)
        .then(module => module.default)
        .catch(() => null);

      if (translations) {
        if (translations[tool]) {
          translatedTitle = translations[tool].title || toolData.title;
          translatedDescription = translations[tool].description || toolData.description;
        }
        else if (translations[tool.replace('-', '_')]) {
          translatedTitle = translations[tool.replace('-', '_')].title || toolData.title;
          translatedDescription = translations[tool.replace('-', '_')].description || toolData.description;
        }
      }
    } catch (e) {
      // Fallback to English
    }
  }

  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/${toolData.category}/${toolData.slug}`;

  // ✅ DYNAMIC OG IMAGE URL WITH LANG SUPPORT
  const ogImageUrl = generateOgImageUrl('tool', {
    slug: toolData.slug,
    title: translatedTitle,
    description: translatedDescription,
    lang: lang,
  });

  const multilingualKeywords: Record<string, string[]> = {
    ur: ['مفت آن لائن ٹولز', 'پاکستانی ٹولز', 'اردو کیلکولیٹر'],
    hi: ['मुफ्त ऑनलाइन उपकरण', 'भारतीय उपकरण', 'हिंदी कैलकुलेटर'],
    ar: ['أدوات مجانية', 'أدوات عربية', 'حاسبات عربية']
  };

  const keywords = [...toolData.keywords];
  if (multilingualKeywords[lang]) {
    keywords.push(...multilingualKeywords[lang]);
  }

  return {
    title: `${translatedTitle} | Centre.com.pk`,
    description: translatedDescription,
    keywords: keywords.join(', '),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `https://www.centre.com.pk/en/tools/${toolData.category}/${toolData.slug}`,
        'ur': `https://www.centre.com.pk/ur/tools/${toolData.category}/${toolData.slug}`,
        'hi': `https://www.centre.com.pk/hi/tools/${toolData.category}/${toolData.slug}`,
        'ar': `https://www.centre.com.pk/ar/tools/${toolData.category}/${toolData.slug}`,
        'x-default': `https://www.centre.com.pk/en/tools/${toolData.category}/${toolData.slug}`,
      }
    },
    openGraph: {
      title: translatedTitle,
      description: translatedDescription,
      url: canonicalUrl,
      type: 'website',
      images: [{
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: translatedTitle
      }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
      siteName: 'Centre.com.pk',
    },
    twitter: {
      card: 'summary_large_image',
      title: translatedTitle,
      description: translatedDescription,
      images: [ogImageUrl],
    },
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getAllCategoryTools(toolData: ToolSEOData): ToolSEOData[] {
  return Object.values(TOOL_SEO_DATA)
    .filter(t => t.category === toolData.category && t.slug !== toolData.slug)
    .slice(0, 8);
}

async function getToolContent(lang: string, category: string, toolData: ToolSEOData) {
  let title = toolData.title;
  let description = toolData.description;

  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/${category}.json`)
        .then(module => module.default)
        .catch(() => null);

      if (translations) {
        if (translations[toolData.slug]) {
          title = translations[toolData.slug].title || toolData.title;
          description = translations[toolData.slug].description || toolData.description;
        }
        else if (translations[toolData.slug.replace('-', '_')]) {
          title = translations[toolData.slug.replace('-', '_')].title || toolData.title;
          description = translations[toolData.slug.replace('-', '_')].description || toolData.description;
        }
      }
    } catch (e) {
      // Fallback to English
    }
  }

  return { title, description };
}

async function getBreadcrumbTranslations(lang: string): Promise<{ home: string; tools: string }> {
  if (lang === 'en') return { home: 'Home', tools: 'Tools' };

  try {
    const common = await import(`@/translations/${lang}/common.json`).then(m => m.default).catch(() => null);
    if (common) {
      return { home: common.home || 'Home', tools: common.tools || 'Tools' };
    }
  } catch (e) { }

  return { home: 'Home', tools: 'Tools' };
}

async function generateBreadcrumbs(toolData: ToolSEOData, lang: string, toolTitle: string) {
  const { home, tools } = await getBreadcrumbTranslations(lang);

  let categoryName = toolData.category.replace('-', ' ').toUpperCase();
  if (lang !== 'en') {
    const categoryMap: Record<string, Record<string, string>> = {
      ur: {
        calculators: 'کیلکولیٹرز',
        'code-tools': 'کوڈ ٹولز',
        'image-tools': 'امیج ٹولز',
        'pdf-tools': 'پی ڈی ایف ٹولز',
        'security-tools': 'سیکیورٹی ٹولز',
        'text-tools': 'ٹیکسٹ ٹولز',
        'design-tools': 'ڈیزائن ٹولز'
      },
      hi: {
        calculators: 'कैलकुलेटर',
        'code-tools': 'कोड टूल्स',
        'image-tools': 'इमेज टूल्स',
        'pdf-tools': 'पीडीएफ टूल्स',
        'security-tools': 'सुरक्षा टूल्स',
        'text-tools': 'टेक्स्ट टूल्स',
        'design-tools': 'डिज़ाइन टूल्स'
      },
      ar: {
        calculators: 'الآلات الحاسبة',
        'code-tools': 'أدوات البرمجة',
        'image-tools': 'أدوات الصور',
        'pdf-tools': 'أدوات PDF',
        'security-tools': 'أدوات الأمان',
        'text-tools': 'أدوات النص',
        'design-tools': 'أدوات التصميم'
      }
    };
    categoryName = categoryMap[lang]?.[toolData.category] || categoryName;
  }

  return [
    { name: home, url: `https://www.centre.com.pk/${lang}`, icon: Home },
    { name: tools, url: `https://www.centre.com.pk/${lang}/tools`, icon: Wrench },
    { name: categoryName, url: `https://www.centre.com.pk/${lang}/tools/${toolData.category}`, icon: FolderOpen },
    { name: toolTitle, url: `/${lang}/tools/${toolData.category}/${toolData.slug}`, isCurrent: true },
  ];
}

function ProfessionalBreadcrumbs({ items }: { items: Array<{ name: string; url: string; icon?: any; isCurrent?: boolean }> }) {
  return (
    <nav className="w-full py-4 mb-6" aria-label="Breadcrumb">
      <div className="container mx-auto px-4">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const Icon = item.icon;

            return (
              <li key={item.url} className="flex items-center">
                {!isLast ? (
                  <>
                    <Link
                      href={item.url}
                      className="flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors duration-200 group"
                    >
                      {Icon && <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                      <span className="font-medium">{item.name}</span>
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-1 text-text-secondary/50" />
                  </>
                ) : (
                  <span className="flex items-center gap-1.5 text-primary font-semibold">
                    {Icon && <Icon className="w-4 h-4" />}
                    <span className="truncate max-w-50 sm:max-w-xs md:max-w-md">{item.name}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              item: {
                '@id': item.url.startsWith('http') ? item.url : `https://www.centre.com.pk${item.url.startsWith('/') ? item.url : '/' + item.url}`,
                'name': item.name,
              },
            })),
          }),
        }}
      />
    </nav>
  );
}

async function getToolSEOScore(toolData: ToolSEOData) {
  const optimizer = new GoogleRankingOptimizer();
  const optimizations = optimizer.analyzeAllTools();
  const toolOptimization = optimizations.find(opt => opt.toolSlug === toolData.slug);

  return {
    score: toolOptimization?.currentScore || 50,
    improvements: toolOptimization?.improvements || [],
    priority: toolOptimization?.priority || 'medium',
  };
}

function getToolFAQs(toolData: ToolSEOData): Array<{ question: string; answer: string }> {
  const baseFAQs = toolData.faqs || [];

  const competitiveFAQs = [
    {
      question: `Is ${toolData.title} really free?`,
      answer: `Yes, ${toolData.title} is 100% free with no hidden charges. Unlike paid alternatives, our tool provides all features without any cost, no registration required.`
    },
    {
      question: `How does ${toolData.title} compare to paid tools?`,
      answer: `Our ${toolData.title} offers better features: no file size limits, faster processing, no watermarks, complete privacy, and full support for Urdu, Hindi, and Arabic languages. Save money by using our free tool.`
    }
  ];

  return [...competitiveFAQs, ...baseFAQs].slice(0, 10);
}

async function getCommonTranslations(lang: string): Promise<Record<string, string>> {
  if (lang === 'en') return {};

  try {
    return await import(`@/translations/${lang}/common.json`).then(m => m.default).catch(() => ({}));
  } catch (e) {
    return {};
  }
}

async function generateAllSchemas(toolData: ToolSEOData, breadcrumbItems: any[], lang: string) {
  const toolSchema = generateToolSchema(toolData.slug, toolData.category, breadcrumbItems, lang);
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return { toolSchema, organizationSchema, websiteSchema };
}

// ============================================
// REDIS CACHE KEY HELPER
// ============================================
function getToolCacheKey(lang: string, category: string, tool: string): string {
  return `tool:${lang}:${category}:${tool}`;
}

// ============================================
// MAIN PAGE COMPONENT (WITH REDIS CACHING)
// ============================================

export default async function ToolPage({ params, searchParams }: ToolPageProps) {
  const { lang, category, tool } = await params;
  const toolData = TOOL_SEO_DATA[tool as keyof typeof TOOL_SEO_DATA];

  if (!toolData || toolData.category !== category) {
    notFound();
  }

  // ========== REDIS CACHE CHECK ==========
  const cacheKey = getToolCacheKey(lang, category, tool);
  const cached = null; // CACHE DISABLED

  if (false) { // BYPASS
    // Serve from cache — skip all processing
    return <ToolPageContent
      cachedData={cached}
      lang={lang}
      category={category}
      tool={tool}
      toolData={toolData}
    />;
  }

  // ========== FETCH FRESH DATA ==========
  const ToolComponent = await getToolComponent(tool);
  const { title: toolTitle, description: toolDescription } = await getToolContent(lang, category, toolData);
  const breadcrumbItems = await generateBreadcrumbs(toolData, lang, toolTitle);

  const allCategoryTools = getAllCategoryTools(toolData);
  const seoScore = await getToolSEOScore(toolData);
  const toolFAQs = getToolFAQs(toolData);

  const common = await getCommonTranslations(lang);
  const { toolSchema, organizationSchema, websiteSchema } = await generateAllSchemas(toolData, breadcrumbItems, lang);

  // ========== BUILD CACHE DATA ==========
  const cacheData = {
    ToolComponentName: tool ? tool : null,
    toolTitle,
    toolDescription,
    breadcrumbItems,
    allCategoryTools,
    seoScore,
    toolFAQs,
    common,
    toolSchema,
    organizationSchema,
    websiteSchema,
  };

  await setCache(cacheKey, cacheData, 7200);

  return <ToolPageContent
    cachedData={{ ...cacheData, ToolComponent }}
    lang={lang}
    category={category}
    tool={tool}
    toolData={toolData}
  />;
}

// ============================================
// PAGE CONTENT COMPONENT
// ============================================

function ToolPageContent({ cachedData, lang, category, toolData }: {
  cachedData: any;
  lang: string;
  category: string;
  tool: string;
  toolData: ToolSEOData;
}) {
  const {
    ToolComponent,
    toolTitle,
    toolDescription,
    breadcrumbItems,
    allCategoryTools,
    seoScore,
    toolFAQs,
    common,
    toolSchema,
    organizationSchema,
    websiteSchema,
    tool,
  } = cachedData;

  const isRTL = lang === 'ur' || lang === 'ar';

  if (!ToolComponent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🔧</div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Tool Under Development</h2>
          <Link
            href={`/${lang}/tools/${category}`}
            className="inline-flex items-center px-4 py-2 rounded-lg font-medium bg-primary text-text-accent hover:bg-primary/90"
          >
            Browse Other {category.replace('-', ' ')} Tools
          </Link>
        </div>
      </div>
    );
  }

  const categoryMap: Record<string, Record<string, string>> = {
    ur: {
      calculators: 'کیلکولیٹرز',
      'code-tools': 'کوڈ ٹولز',
      'design-tools': 'ڈیزائن ٹولز',
      'image-tools': 'امیج ٹولز',
      'pdf-tools': 'پی ڈی ایف ٹولز',
      'security-tools': 'سیکیورٹی ٹولز',
      'text-tools': 'ٹیکسٹ ٹولز'
    },
    hi: {
      calculators: 'कैलकुलेटर',
      'code-tools': 'कोड टूल्स',
      'design-tools': 'डिज़ाइन टूल्स',
      'image-tools': 'इमेज टूल्स',
      'pdf-tools': 'पीडीएफ टूल्स',
      'security-tools': 'सुरक्षा टूल्स',
      'text-tools': 'टेक्स्ट टूल्स'
    },
    ar: {
      calculators: 'الآلات الحاسبة',
      'code-tools': 'أدوات البرمجة',
      'design-tools': 'أدوات التصميم',
      'image-tools': 'أدوات الصور',
      'pdf-tools': 'أدوات PDF',
      'security-tools': 'أدوات الأمان',
      'text-tools': 'أدوات النص'
    }
  };

  const categoryDisplay = categoryMap[lang]?.[category] || category.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
  const moreFreeText = common.more_free_tools?.replace('{category}', categoryDisplay) || `More Free ${categoryDisplay} Tools`;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <CentralAd position="top" size="banner" />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toolSchema }} />

      <ProfessionalBreadcrumbs items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-4">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8 bg-linear-to-r from-primary/5 to-primary/10 rounded-2xl p-6 md:p-8 border border-primary/20">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-3">
              {toolTitle}
            </h1>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed">
              {toolDescription}
            </p>
          </div>

          <div className="bg-surface rounded-1xl shadow-lg border border-border p-1 md:p-1 mb-1" suppressHydrationWarning>
            <ToolClientWrapper>
              <ToolComponent />
            </ToolClientWrapper>
          </div>

          <div className="hidden lg:block mb-8">
            <CentralAd position="sidebar-left" size="skyscraper" />
          </div>

          <div className="my-8">
            <CentralAd position="in-content" size="rectangle" />
          </div>

          <div className="mb-8">
            <VideoTutorial toolData={toolData} lang={lang} />
          </div>

          <div className="mb-8">
            <ShareButtons
              title={`${toolTitle} - Free Alternative to Paid Tools`}
              url={`https://www.centre.com.pk/${lang}/tools/${toolData.category}/${toolData.slug}`}
            />
          </div>

          {toolFAQs.length > 0 && (
            <div className="mb-8">
              <FAQs
                faqs={toolFAQs}
                title={`${common.frequently_asked_questions || 'Frequently Asked Questions'} - ${toolTitle}`}
                showSchema={false}
              />
            </div>
          )}

          <div className="hidden lg:block mb-8">
            <CentralAd position="sidebar-right" size="skyscraper" />
          </div>
          {/* ✅ Complete Guide — HIGH PRIORITY POSITION */}
          <ToolBlogGuide toolSlug={toolData.slug} lang={lang} />

          {/* {allCategoryTools.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-6">
                {moreFreeText}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {allCategoryTools.map((categoryTool: ToolSEOData) => (
                  <Link
                    key={categoryTool.slug}
                    href={`/${lang}/tools/${categoryTool.category}/${categoryTool.slug}`}
                    className="group bg-surface border border-border rounded-xl p-4 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <h3 className="font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                      {categoryTool.title}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {categoryTool.description.substring(0, 80)}...
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )} */}

          <div className="mb-8">
            <InternalLinks
              links={allCategoryTools.map((t: ToolSEOData) => ({
                title: t.title,
                url: `/${lang}/tools/${t.category}/${t.slug}`,
                description: t.description,
                category: t.category,
              }))}
              title={`More Free ${categoryDisplay} Tools`}
              maxLinks={8}
            />
          </div>

          <div className="mt-8">
            <CentralAd position="bottom" size="banner" />
          </div>
        </div>
      </div>


      <ToolSEO toolData={toolData} showFAQs={toolFAQs.length > 0} />
    </div>
  );
}