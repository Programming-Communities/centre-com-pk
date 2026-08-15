import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import ImageResizerClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('image-resizer');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/image-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.image_resizer) {
        title = translations.image_resizer.title || toolData.title;
        description = translations.image_resizer.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/image-tools/image-resizer`;
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/image-resizer.png", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/image-resizer.png"],
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
        'en': 'https://www.centre.com.pk/tools/image-tools/image-resizer',
        'ur': 'https://www.centre.com.pk/ur/tools/image-tools/image-resizer',
        'hi': 'https://www.centre.com.pk/hi/tools/image-tools/image-resizer',
        'ar': 'https://www.centre.com.pk/ar/tools/image-tools/image-resizer',
      },
    },
  };
}

export default function ImageResizerPage() {
  return <ImageResizerClient />;
}

export const runtime = 'edge';