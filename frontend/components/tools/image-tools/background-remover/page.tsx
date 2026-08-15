// app/[lang]/tools/image-tools/background-remover/page.tsx
import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import BackgroundRemoverClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('background-remover');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/image-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.background_remover) {
        title = translations.background_remover.title || toolData.title;
        description = translations.background_remover.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/image-tools/background-remover`;
  
  // Language-specific keywords
  const multilingualKeywords: Record<string, string[]> = {
    ur: ['پس منظر ہٹائیں', 'بی جی ریموور', 'اردو امیج ٹول'],
    hi: ['बैकग्राउंड हटाएं', 'बीजी रिमूवर', 'हिंदी इमेज टूल'],
    ar: ['إزالة الخلفية', 'أداة الخلفية', 'أداة الصور']
  };
  
  const keywords = [...toolData.keywords];
  if (multilingualKeywords[lang]) {
    keywords.push(...multilingualKeywords[lang]);
  }
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: keywords.join(', '),
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/background-remover.png", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/background-remover.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': 'https://www.centre.com.pk/tools/image-tools/background-remover',
        'ur': 'https://www.centre.com.pk/ur/tools/image-tools/background-remover',
        'hi': 'https://www.centre.com.pk/hi/tools/image-tools/background-remover',
        'ar': 'https://www.centre.com.pk/ar/tools/image-tools/background-remover',
      },
    },
  };
}

export default function BackgroundRemoverPage() {
  return <BackgroundRemoverClient />;
}

export const runtime = 'edge';