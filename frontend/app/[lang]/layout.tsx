import { ReactNode } from 'react';
import { Metadata } from 'next';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import TopLoader from '@/components/layout/TopLoader';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { WebVitals } from '@/app/web-vitals';
import PreloadResources from '@/components/PreloadResources';
import { redirect } from 'next/navigation';

const BASE_URL = 'https://www.centre.com.pk';
const VALID_LANGS = ['en', 'ur', 'hi', 'ar'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const validLang = VALID_LANGS.includes(lang) ? lang : 'en';
  
  const titles = { 
    en: 'Free Online Tools | Centre.com.pk', 
    ur: 'مفت آن لائن ٹولز | Centre.com.pk', 
    hi: 'मुफ्त ऑनलाइन टूल्स | Centre.com.pk', 
    ar: 'أدوات مجانية | Centre.com.pk' 
  };
  
  const descriptions = { 
    en: 'Access 55 free online tools — calculators, image editors, PDF tools & more.', 
    ur: '55 مفت آن لائن ٹولز: کیلکولیٹر، امیج ایڈیٹر، PDF ٹولز۔', 
    hi: '55 मुफ्त ऑनलाइन टूल्स: कैलकुलेटर, इमेज एडिटर, PDF टूल्स।', 
    ar: '55 أداة مجانية: حاسبات، محرر صور، أدوات PDF.' 
  };

  return {
    title: titles[validLang] || titles.en,
    description: descriptions[validLang] || descriptions.en,
    metadataBase: new URL(BASE_URL),
    keywords: 'free online tools, online centre, calculators, pdf tools, image tools, security tools',
    alternates: {
      canonical: `${BASE_URL}/${validLang}`,
      languages: {
        'en': `${BASE_URL}`,
        'ur': `${BASE_URL}/ur`,
        'hi': `${BASE_URL}/hi`,
        'ar': `${BASE_URL}/ar`,
        'x-default': `${BASE_URL}`,
      },
    },
    openGraph: { 
      title: titles[validLang] || titles.en, 
      description: descriptions[validLang] || descriptions.en, 
      url: `${BASE_URL}/${validLang}`, 
      siteName: 'Centre.com.pk', 
      type: 'website', 
      locale: validLang === 'ur' ? 'ur_PK' : validLang === 'hi' ? 'hi_IN' : validLang === 'ar' ? 'ar_SA' : 'en_US' 
    },
    twitter: { 
      card: 'summary_large_image', 
      title: titles[validLang] || titles.en, 
      description: descriptions[validLang] || descriptions.en 
    },
    robots: { index: true, follow: true },
  };
}

export default async function LangLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  if (!VALID_LANGS.includes(lang)) {
    redirect('/');
  }
  
  const dir = lang === 'ur' || lang === 'ar' ? 'rtl' : 'ltr';
  const fontClass = lang === 'ur' ? 'font-urdu' : 'font-inter';
  
  return (
    <>
      <PreloadResources />
      <TopLoader />
      <div className={`min-h-screen flex flex-col ${fontClass}`} dir={dir} lang={lang} suppressHydrationWarning>
        <Header lang={lang} />
        <main className="flex-1 pt-16" id="main-content" role="main" suppressHydrationWarning>
          {children}
        </main>
        <Footer lang={lang} />
        <BottomNavigation lang={lang} />
        <WebVitals />
      </div>
    </>
  );
}
