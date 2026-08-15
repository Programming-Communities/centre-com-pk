import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import LoremIpsumClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('lorem-ipsum');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/text-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.lorem_ipsum) {
        title = translations.lorem_ipsum.title || toolData.title;
        description = translations.lorem_ipsum.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/text-tools/lorem-ipsum`;
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/lorem-ipsum.png", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/lorem-ipsum.png"],
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
        'en': 'https://www.centre.com.pk/tools/text-tools/lorem-ipsum',
        'ur': 'https://www.centre.com.pk/ur/tools/text-tools/lorem-ipsum',
        'hi': 'https://www.centre.com.pk/hi/tools/text-tools/lorem-ipsum',
        'ar': 'https://www.centre.com.pk/ar/tools/text-tools/lorem-ipsum',
      },
    },
  };
}

export default function LoremIpsumPage() {
  return <LoremIpsumClient />;
}

export const runtime = 'edge';