// app/[lang]/contact/page.tsx
import { Metadata } from 'next';
import ContactClient from './ContactClient';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  
  const titles: Record<string, string> = {
    en: 'Contact Us - Get Support & Feedback | Centre.com.pk',
    ur: 'ہم سے رابطہ کریں - سپورٹ اور فیڈبیک حاصل کریں | Centre.com.pk',
    hi: 'संपर्क करें - सहायता और प्रतिक्रिया प्राप्त करें | Centre.com.pk',
    ar: 'اتصل بنا - احصل على الدعم والملاحظات | Centre.com.pk'
  };

  const descriptions: Record<string, string> = {
    en: 'Get in touch with Centre.com.pk support team. Send us your questions, suggestions, or partnership inquiries. We\'re here to help 24/7.',
    ur: 'Centre.com.pk سپورٹ ٹیم سے رابطہ کریں۔ ہمیں اپنے سوالات، تجاویز، یا شراکت داری کے بارے میں بتائیں۔ ہم 24/7 مدد کے لیے موجود ہیں۔',
    hi: 'Centre.com.pk सहायता टीम से संपर्क करें। हमें अपने प्रश्न, सुझाव, या साझेदारी के बारे में बताएं। हम 24/7 मदद के लिए यहां हैं।',
    ar: 'تواصل مع فريق دعم Centre.com.pk. أرسل إلينا أسئلتك أو اقتراحاتك أو استفسارات الشراكة. نحن هنا للمساعدة على مدار الساعة.'
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
      url: `https://www.centre.com.pk/${lang}/contact`,
      siteName: 'Centre.com.pk',
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    alternates: {
      canonical: `https://www.centre.com.pk/${lang}/contact`,
      languages: {
        'en': 'https://www.centre.com.pk/contact',
        'ur': 'https://www.centre.com.pk/ur/contact',
        'hi': 'https://www.centre.com.pk/hi/contact',
        'ar': 'https://www.centre.com.pk/ar/contact',
      },
    },
  };
}

export default function ContactPage() {
  return <ContactClient />;
}
