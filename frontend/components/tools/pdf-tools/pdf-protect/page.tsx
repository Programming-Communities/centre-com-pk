import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import PdfProtectClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('pdf-protect');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/pdf-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.pdf_protect) {
        title = translations.pdf_protect.title || toolData.title;
        description = translations.pdf_protect.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/pdf-tools/pdf-protect`;
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/pdf-protect.svg", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/pdf-protect.svg"],
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
        'en': 'https://www.centre.com.pk/tools/pdf-tools/pdf-protect',
        'ur': 'https://www.centre.com.pk/ur/tools/pdf-tools/pdf-protect',
        'hi': 'https://www.centre.com.pk/hi/tools/pdf-tools/pdf-protect',
        'ar': 'https://www.centre.com.pk/ar/tools/pdf-tools/pdf-protect',
      },
    },
  };
}

export default function PdfProtectPage() {
  return <PdfProtectClient />;
}

export const runtime = 'edge';