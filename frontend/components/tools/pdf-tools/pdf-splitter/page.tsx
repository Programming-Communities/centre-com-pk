import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import PdfSplitterClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('pdf-splitter');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/pdf-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.pdf_splitter) {
        title = translations.pdf_splitter.title || toolData.title;
        description = translations.pdf_splitter.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/pdf-tools/pdf-splitter`;
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/pdf-splitter.png", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/pdf-splitter.png"],
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
        'en': 'https://www.centre.com.pk/tools/pdf-tools/pdf-splitter',
        'ur': 'https://www.centre.com.pk/ur/tools/pdf-tools/pdf-splitter',
        'hi': 'https://www.centre.com.pk/hi/tools/pdf-tools/pdf-splitter',
        'ar': 'https://www.centre.com.pk/ar/tools/pdf-tools/pdf-splitter',
      },
    },
  };
}

export default function PdfSplitterPage() {
  return <PdfSplitterClient />;
}

export const runtime = 'edge';