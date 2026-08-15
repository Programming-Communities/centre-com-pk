import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import SSLCheckerClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('ssl-checker');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/security-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.ssl_checker) {
        title = translations.ssl_checker.title || toolData.title;
        description = translations.ssl_checker.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/security-tools/ssl-checker`;
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/ssl-checker.png", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/ssl-checker.png"],
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
        'en': 'https://www.centre.com.pk/tools/security-tools/ssl-checker',
        'ur': 'https://www.centre.com.pk/ur/tools/security-tools/ssl-checker',
        'hi': 'https://www.centre.com.pk/hi/tools/security-tools/ssl-checker',
        'ar': 'https://www.centre.com.pk/ar/tools/security-tools/ssl-checker',
      },
    },
  };
}

export default function SSLCheckerPage() {
  return <SSLCheckerClient />;
}

export const runtime = 'edge';