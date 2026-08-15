import { Metadata } from 'next';
import Link from 'next/link';
import AboutClient from './AboutClient';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  
  const titles: Record<string, string> = {
    en: 'About Centre.com.pk - Free Educational & Computer Tools Platform',
    ur: 'Centre.com.pk کے بارے میں - مفت تعلیمی اور کمپیوٹر ٹولز پلیٹ فارم',
    hi: 'Centre.com.pk के बारे में - मुफ्त शैक्षिक और कंप्यूटर टूल्स प्लेटफॉर्म',
    ar: 'حول Centre.com.pk - منصة أدوات تعليمية وحاسوبية مجانية'
  };

  const descriptions: Record<string, string> = {
    en: 'Learn about our mission to provide free, high-quality educational and productivity tools to users worldwide.',
    ur: 'دنیا بھر کے صارفین کو مفت، اعلیٰ معیار کے تعلیمی اور پیداواری ٹولز فراہم کرنے کے ہمارے مشن کے بارے میں جانیں۔',
    hi: 'दुनिया भर के उपयोगकर्ताओं को मुफ्त, उच्च गुणवत्ता वाले शैक्षिक और उत्पादकता उपकरण प्रदान करने के हमारे मिशन के बारे में जानें।',
    ar: 'تعرف على مهمتنا لتوفير أدوات تعليمية وإنتاجية مجانية وعالية الجودة للمستخدمين في جميع أنحاء العالم.'
  };

  return {
    title: titles[lang as keyof typeof titles] || titles.en,
    description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: titles[lang as keyof typeof titles] || titles.en,
      description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
      type: 'website',
      url: `https://www.centre.com.pk/${lang}/about`,
      siteName: 'Centre.com.pk',
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    alternates: {
      canonical: `https://www.centre.com.pk/${lang}/about`,
      languages: {
        'en': 'https://www.centre.com.pk/about',
        'ur': 'https://www.centre.com.pk/ur/about',
        'hi': 'https://www.centre.com.pk/hi/about',
        'ar': 'https://www.centre.com.pk/ar/about',
      },
    },
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
