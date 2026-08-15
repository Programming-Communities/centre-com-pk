// app/[lang]/tools/image-tools/meme-generator/page.tsx
import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import MemeGeneratorClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('meme-generator');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/image-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.meme_generator) {
        title = translations.meme_generator.title || toolData.title;
        description = translations.meme_generator.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/image-tools/meme-generator`;
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/meme-generator.png", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/meme-generator.png"],
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
        'en': 'https://www.centre.com.pk/tools/image-tools/meme-generator',
        'ur': 'https://www.centre.com.pk/ur/tools/image-tools/meme-generator',
        'hi': 'https://www.centre.com.pk/hi/tools/image-tools/meme-generator',
        'ar': 'https://www.centre.com.pk/ar/tools/image-tools/meme-generator',
      },
    },
  };
}

export default function MemeGeneratorPage() {
  return <MemeGeneratorClient />;
}

export const runtime = 'edge';