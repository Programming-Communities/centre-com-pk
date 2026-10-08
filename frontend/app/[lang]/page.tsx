import { Metadata } from 'next';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// ⚡ LAZY LOAD — Only when needed
const HomePageHero = dynamic(() => import('../../components/sections/HomePageHero/HomePageHero'), { ssr: true });
const PopularToolsSection = dynamic(() => import('../../components/sections/PopularToolsSection/PopularToolsSection'), { ssr: true });
const StatsSection = dynamic(() => import('../../components/sections/StatsSection/StatsSection'), { ssr: true });
const CTASection = dynamic(() => import('../../components/sections/CTASection/CTASection'), { ssr: true });

// ✅ Import client wrapper (ssr: false inside client component)
import InfiniteToolsScrollWrapper from '../../components/sections/InfiniteToolsScroll/InfiniteToolsScrollWrapper';

import { getPopularTools } from '@/lib/data/tools';

// ========== METADATA ==========
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const siteUrl = 'https://www.centre.com.pk';

  const meta: Record<string, any> = {
    en: { title: 'Free Online Tools | Centre.com.pk', description: 'Access 55 free online tools — calculators, image editors, PDF tools & more.' },
    ur: { title: 'مفت آن لائن ٹولز | Centre.com.pk', description: '55 مفت آن لائن ٹولز: کیلکولیٹر، امیج ایڈیٹر، PDF ٹولز۔' },
    ar: { title: 'أدوات مجانية | Centre.com.pk', description: '55 أداة مجانية: حاسبات، محرر صور، أدوات PDF.' },
    hi: { title: 'मुफ्त ऑनलाइन टूल्स | Centre.com.pk', description: '55 मुफ्त ऑनलाइन टूल्स: कैलकुलेटर, इमेज एडिटर, PDF टूल्स।' },
  };

  const m = meta[lang] || meta.en;
  const canonicalUrl = lang === 'en' ? siteUrl : `${siteUrl}/${lang}`;

  return {
    title: m.title,
    description: m.description,
    metadataBase: new URL(siteUrl),
    alternates: { 
      canonical: canonicalUrl, 
      languages: { 
        en: siteUrl, 
        ur: `${siteUrl}/ur`, 
        ar: `${siteUrl}/ar`, 
        hi: `${siteUrl}/hi` 
      } 
    },
    openGraph: { title: m.title, description: m.description, url: canonicalUrl, siteName: 'Centre.com.pk', images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }], type: 'website' },
  };
}

// ========== MAIN PAGE ==========
export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  // ✅ Fetch only 6 popular tools
  const rawTools = await getPopularTools(6);
  const popularTools = rawTools.map((tool: any) => ({
    title: tool.title,
    slug: tool.slug,
    category: tool.category,
    description: tool.description || `Free online ${tool.title.toLowerCase()} tool`
  }));

  // ✅ Static translations
  const t: Record<string, any> = {
    en: {
      heroBadge: '55 FREE ONLINE TOOLS',
      heroTitle: 'Professional Tools Collection',
      heroDesc: 'Access 55 free online tools across 7 categories.',
      heroBtn1: 'Explore All Tools',
      heroBtn2: 'Popular Tools',
      needTitle: 'Need something specific?',
      needDesc: 'Can\'t find the tool? We\'ll build it!',
      suggestBtn: 'Suggest a Tool',
      contactBtn: 'Contact Support',
      stats: [{ number: '55', label: 'Free Tools' }, { number: 'Thousands', label: 'Users' }, { number: '100%', label: 'Free' }, { number: '24/7', label: 'Available' }],
    },
    ur: {
      heroBadge: '55 مفت آن لائن ٹولز',
      heroTitle: 'پیشہ ورانہ ٹولز کا مجموعہ',
      heroDesc: '7 کیٹیگریز میں 55 مفت آن لائن ٹولز۔',
      heroBtn1: 'تمام ٹولز دیکھیں',
      heroBtn2: 'مقبول ٹولز',
      needTitle: 'کوئی خاص ٹول چاہیے؟',
      needDesc: 'ٹول نہیں ملا؟ ہم بنائیں گے!',
      suggestBtn: 'ٹول تجویز کریں',
      contactBtn: 'سپورٹ',
      stats: [{ number: '55', label: 'مفت ٹولز' }, { number: 'ہزاروں', label: 'صارفین' }, { number: '100%', label: 'مفت' }, { number: '24/7', label: 'دستیاب' }],
    },
    ar: {
      heroBadge: '55 أداة مجانية',
      heroTitle: 'مجموعة أدوات احترافية',
      heroDesc: '55 أداة مجانية في 7 فئات.',
      heroBtn1: 'استكشف جميع الأدوات',
      heroBtn2: 'الأدوات الشائعة',
      needTitle: 'تحتاج شيئاً محدداً؟',
      needDesc: 'لم تجد الأداة؟ سنبنيها لك!',
      suggestBtn: 'اقترح أداة',
      contactBtn: 'اتصل بالدعم',
      stats: [{ number: '55', label: 'أداة' }, { number: 'آلاف', label: 'مستخدم' }, { number: '100%', label: 'مجاني' }, { number: '24/7', label: 'متاح' }],
    },
    hi: {
      heroBadge: '55 मुफ्त ऑनलाइन टूल्स',
      heroTitle: 'प्रोफेशनल टूल्स कलेक्शन',
      heroDesc: '7 श्रेणियों में 55 मुफ्त ऑनलाइन टूल्स।',
      heroBtn1: 'सभी टूल्स देखें',
      heroBtn2: 'लोकप्रिय टूल्स',
      needTitle: 'कुछ विशेष चाहिए?',
      needDesc: 'टूल नहीं मिला? हम बनाएंगे!',
      suggestBtn: 'टूल सुझाएं',
      contactBtn: 'सहायता',
      stats: [{ number: '55', label: 'टूल्स' }, { number: 'हज़ारों', label: 'उपयोगकर्ता' }, { number: '100%', label: 'मुफ्त' }, { number: '24/7', label: 'उपलब्ध' }],
    },
  }[lang] || {} as any;

  return (
    <main className="min-h-screen">
      {/* ✅ sr-only H1 REMOVED — hero H1 hi primary hai */}

      {/* ⚡ HERO — Static, Fast */}
      <HomePageHero
        badge={t.heroBadge}
        title={t.heroTitle}
        highlightedTitle={t.heroBadge}
        description={t.heroDesc}
        highlightedDescription={t.heroDesc}
        primaryButton={{ text: t.heroBtn1, href: `/${lang}/tools` }}
        secondaryButton={{ text: t.heroBtn2, href: `/${lang}/tools` }}
        theme="primary"
        withBackground={true}
        lang={lang}
      />
      
      {/* ⚡ POPULAR TOOLS — Static */}
      <PopularToolsSection tools={popularTools} lang={lang} />

      {/* ⚡ STATS — Server Component */}
      <StatsSection stats={t.stats} theme="primary" backgroundColor="gradient" lang={lang} />

      {/* ⚡ INFINITE SCROLL — Lazy Load via Client Wrapper */}
      <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
        <div className="py-12">
          <div className="container mx-auto px-4">
            <InfiniteToolsScrollWrapper lang={lang} />
          </div>
        </div>
      </Suspense>

      {/* ⚡ CTA — Static */}
      <CTASection 
        title={t.needTitle}
        description={t.needDesc}
        primaryButtonText={t.suggestBtn}
        primaryButtonHref={`/${lang}/contact`}
        secondaryButtonText={t.contactBtn}
        secondaryButtonHref={`/${lang}/contact`}
        variant="centered"
        lang={lang}
      />
    </main>
  );
}