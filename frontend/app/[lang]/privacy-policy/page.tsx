// app/[lang]/privacy-policy/page.tsx
import { Metadata } from 'next';
import PrivacyPolicyClient from './PrivacyPolicyClient';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  
  const titles: Record<string, string> = {
    en: 'Privacy Policy - How We Protect Your Data | Centre.com.pk',
    ur: 'رازداری کی پالیسی - ہم آپ کے ڈیٹا کی حفاظت کیسے کرتے ہیں | Centre.com.pk',
    hi: 'गोपनीयता नीति - हम आपके डेटा की सुरक्षा कैसे करते हैं | Centre.com.pk',
    ar: 'سياسة الخصوصية - كيف نحمي بياناتك | Centre.com.pk'
  };

  const descriptions: Record<string, string> = {
    en: 'Read Centre.com.pk privacy policy to understand how we collect, use, and protect your personal information. We prioritize your privacy and data security.',
    ur: 'Centre.com.pk کی رازداری کی پالیسی پڑھیں تاکہ سمجھ سکیں کہ ہم آپ کی ذاتی معلومات کو کیسے جمع، استعمال اور محفوظ کرتے ہیں۔ ہم آپ کی رازداری اور ڈیٹا سیکیورٹی کو ترجیح دیتے ہیں۔',
    hi: 'Centre.com.pk गोपनीयता नीति पढ़ें ताकि समझ सकें कि हम आपकी व्यक्तिगत जानकारी को कैसे एकत्र, उपयोग और सुरक्षित करते हैं। हम आपकी गोपनीयता और डेटा सुरक्षा को प्राथमिकता देते हैं।',
    ar: 'اقرأ سياسة الخصوصية لـ Centre.com.pk لفهم كيفية جمع واستخدام وحماية معلوماتك الشخصية. نحن نعطي الأولوية لخصوصيتك وأمان بياناتك.'
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
      url: `https://www.centre.com.pk/${lang}/privacy-policy`,
      siteName: 'Centre.com.pk',
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    alternates: {
      canonical: `https://www.centre.com.pk/${lang}/privacy-policy`,
      languages: {
        'en': 'https://www.centre.com.pk/privacy-policy',
        'ur': 'https://www.centre.com.pk/ur/privacy-policy',
        'hi': 'https://www.centre.com.pk/hi/privacy-policy',
        'ar': 'https://www.centre.com.pk/ar/privacy-policy',
      },
    },
  };
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />
}
