// app/[lang]/tools/code-tools/url-encoder/page.tsx
import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import URLEncoderClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('url-encoder');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/code-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.url_encoder) {
        title = translations.url_encoder.title || toolData.title;
        description = translations.url_encoder.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/code-tools/url-encoder`;
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/url-encoder.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/url-encoder.png"],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': 'https://www.centre.com.pk/tools/code-tools/url-encoder',
        'ur': 'https://www.centre.com.pk/ur/tools/code-tools/url-encoder',
        'hi': 'https://www.centre.com.pk/hi/tools/code-tools/url-encoder',
        'ar': 'https://www.centre.com.pk/ar/tools/code-tools/url-encoder',
      },
    },
  };
}

export default function URLEncoderPage() {
  return <URLEncoderClient />;
}

export const runtime = 'edge';