// app/[lang]/tutorial/page.tsx
import { Metadata } from 'next';
import TutorialContent from './TutorialContent';


export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  
  const titles: Record<string, string> = {
    en: 'Tutorials - Step-by-Step Guides & How-Tos | Centre.com.pk',
    ur: 'ٹیوٹوریلز - مرحلہ وار گائیڈز اور طریقے | Centre.com.pk',
    hi: 'ट्यूटोरियल - चरण-दर-चरण गाइड और कैसे-करें | Centre.com.pk',
    ar: 'الدروس - أدلة خطوة بخطوة وكيفية العمل | Centre.com.pk'
  };

  const descriptions: Record<string, string> = {
    en: 'Step-by-step tutorials, video guides, and documentation for all our free online tools. Learn how to use image editors, PDF tools, calculators, and more.',
    ur: 'ہمارے تمام مفت آن لائن ٹولز کے لیے مرحلہ وار ٹیوٹوریلز، ویڈیو گائیڈز اور دستاویزات۔ امیج ایڈیٹرز، پی ڈی ایف ٹولز، کیلکولیٹرز اور مزید استعمال کرنے کا طریقہ سیکھیں۔',
    hi: 'हमारे सभी मुफ्त ऑनलाइन टूल्स के लिए चरण-दर-चरण ट्यूटोरियल, वीडियो गाइड और दस्तावेज़। छवि संपादक, पीडीएफ टूल्स, कैलकुलेटर और अधिक का उपयोग करना सीखें।',
    ar: 'دروس خطوة بخطوة وأدلة فيديو ووثائق لجميع أدواتنا المجانية عبر الإنترنت. تعلم كيفية استخدام محرري الصور وأدوات PDF والآلات الحاسبة والمزيد.'
  };

  return {
    title: titles[lang as keyof typeof titles] || titles.en,
    description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
    openGraph: {
      title: titles[lang as keyof typeof titles] || titles.en,
      description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
      type: 'website',
      url: `https://www.centre.com.pk/${lang}/tutorial`,
      images: [{ url: '/og-tutorial.png', width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://www.centre.com.pk/${lang}/tutorial`,
      languages: {
        'en': 'https://www.centre.com.pk/tutorial',
        'ur': 'https://www.centre.com.pk/ur/tutorial',
        'hi': 'https://www.centre.com.pk/hi/tutorial',
        'ar': 'https://www.centre.com.pk/ar/tutorial',
      },
    },
  };
}

export default function TutorialPage() {
  return <TutorialContent />;
}
