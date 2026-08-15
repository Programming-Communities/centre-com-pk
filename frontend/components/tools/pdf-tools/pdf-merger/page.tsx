import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import PDFMergerClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('pdf-merger');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/pdf-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.pdf_merger) {
        title = translations.pdf_merger.title || toolData.title;
        description = translations.pdf_merger.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/pdf-tools/pdf-merger`;
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/pdf-merger.png", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/pdf-merger.png"],
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
        'en': 'https://www.centre.com.pk/tools/pdf-tools/pdf-merger',
        'ur': 'https://www.centre.com.pk/ur/tools/pdf-tools/pdf-merger',
        'hi': 'https://www.centre.com.pk/hi/tools/pdf-tools/pdf-merger',
        'ar': 'https://www.centre.com.pk/ar/tools/pdf-tools/pdf-merger',
      },
    },
  };
}

export default function PDFMergerPage() {
  return <PDFMergerClient />;
}

export const runtime = 'edge';