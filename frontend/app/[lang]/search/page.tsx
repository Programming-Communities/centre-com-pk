// app/[lang]/search/page.tsx
import { Metadata } from 'next';
import SearchClient from './SearchClient';

// ✅ ADD THIS LINE

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  
  const titles: Record<string, string> = {
    en: 'Search Tools - Find the Perfect Tool for Your Needs | Centre.com.pk',
    ur: 'ٹولز تلاش کریں - اپنی ضرورت کے لیے بہترین ٹول تلاش کریں | Centre.com.pk',
    hi: 'टूल्स खोजें - अपनी आवश्यकता के लिए सही टूल ढूंढें | Centre.com.pk',
    ar: 'البحث عن الأدوات - ابحث عن الأداة المثالية لاحتياجاتك | Centre.com.pk'
  };

  const descriptions: Record<string, string> = {
    en: 'Search from 55 free online tools across all categories. Find image editors, PDF tools, calculators, code formatters, and more.',
    ur: 'تمام زمروں میں 55 مفت آن لائن ٹولز تلاش کریں۔ امیج ایڈیٹرز، پی ڈی ایف ٹولز، کیلکولیٹرز، کوڈ فارمیٹرز اور مزید تلاش کریں۔',
    hi: 'सभी श्रेणियों में 55 मुफ्त ऑनलाइन टूल्स खोजें। छवि संपादक, पीडीएफ टूल्स, कैलकुलेटर, कोड फॉर्मेटर और बहुत कुछ खोजें।',
    ar: 'ابحث من بين 55 أداة مجانية عبر الإنترنت عبر جميع الفئات. ابحث عن محرري الصور وأدوات PDF والآلات الحاسبة ومنسقي الأكواد والمزيد.'
  };

  return {
    title: titles[lang as keyof typeof titles] || titles.en,
    description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
    openGraph: {
      title: titles[lang as keyof typeof titles] || titles.en,
      description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
      type: 'website',
      url: `https://www.centre.com.pk/${lang}/search`,
    },
    alternates: {
      canonical: `https://www.centre.com.pk/${lang}/search`,
      languages: {
        'en': 'https://www.centre.com.pk/search',
        'ur': 'https://www.centre.com.pk/ur/search',
        'hi': 'https://www.centre.com.pk/hi/search',
        'ar': 'https://www.centre.com.pk/ar/search',
      },
    },
  };
}

export default function SearchPage() {
  return <SearchClient />;
}