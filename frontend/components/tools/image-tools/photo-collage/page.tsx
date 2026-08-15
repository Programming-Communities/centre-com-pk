// app/[lang]/tools/image-tools/photo-collage/page.tsx
import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import PhotoCollageClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('photo-collage');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/image-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.photo_collage) {
        title = translations.photo_collage.title || toolData.title;
        description = translations.photo_collage.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/image-tools/photo-collage`;
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/photo-collage.png", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/photo-collage.png"],
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
        'en': 'https://www.centre.com.pk/tools/image-tools/photo-collage',
        'ur': 'https://www.centre.com.pk/ur/tools/image-tools/photo-collage',
        'hi': 'https://www.centre.com.pk/hi/tools/image-tools/photo-collage',
        'ar': 'https://www.centre.com.pk/ar/tools/image-tools/photo-collage',
      },
    },
  };
}

export default function PhotoCollagePage() {
  return <PhotoCollageClient />;
}

export const runtime = 'edge';