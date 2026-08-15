import { Metadata } from 'next';
import TermsClient from './TermsClient';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  
  const titles: Record<string, string> = {
    en: 'Terms of Service - Legal Agreement | Centre.com.pk',
    ur: 'خدمات کی شرائط - قانونی معاہدہ | Centre.com.pk',
    hi: 'सेवा की शर्तें - कानूनी समझौता | Centre.com.pk',
    ar: 'شروط الخدمة - الاتفاقية القانونية | Centre.com.pk'
  };

  const descriptions: Record<string, string> = {
    en: 'Read Centre.com.pk terms of service to understand the legal agreement between you and our platform when using our free online tools.',
    ur: 'Centre.com.pk کی خدمات کی شرائط پڑھیں تاکہ ہمارے مفت آن لائن ٹولز استعمال کرتے وقت آپ اور ہمارے پلیٹ فارم کے درمیان قانونی معاہدے کو سمجھ سکیں۔',
    hi: 'Centre.com.pk की सेवा की शर्तें पढ़ें ताकि हमारे मुफ्त ऑनलाइन टूल्स का उपयोग करते समय आप और हमारे प्लेटफॉर्म के बीच कानूनी समझौते को समझ सकें।',
    ar: 'اقرأ شروط خدمة Centre.com.pk لفهم الاتفاقية القانونية بينك وبين منصتنا عند استخدام أدواتنا المجانية عبر الإنترنت.'
  };

  return {
    title: titles[lang as keyof typeof titles] || titles.en,
    description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
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
    openGraph: {
      title: titles[lang as keyof typeof titles] || titles.en,
      description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
      type: 'website',
      url: `https://www.centre.com.pk/${lang}/terms`,
      siteName: 'Centre.com.pk',
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
      images: [{
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Centre.com.pk Terms of Service'
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang as keyof typeof titles] || titles.en,
      description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `https://www.centre.com.pk/${lang}/terms`,
      languages: {
        'en': 'https://www.centre.com.pk/terms',
        'ur': 'https://www.centre.com.pk/ur/terms',
        'hi': 'https://www.centre.com.pk/hi/terms',
        'ar': 'https://www.centre.com.pk/ar/terms',
      },
    },
  };
}

export default function TermsPage() {
  return <TermsClient />;
}

