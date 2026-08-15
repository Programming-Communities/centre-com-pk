// app/[lang]/tools/code-tools/base64-encoder/page.tsx
import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import Base64EncoderClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('base64-encoder');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/code-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.base64_encoder) {
        title = translations.base64_encoder.title || toolData.title;
        description = translations.base64_encoder.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/code-tools/base64-encoder`;
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/base64-encoder.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/base64-encoder.png"],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': 'https://www.centre.com.pk/tools/code-tools/base64-encoder',
        'ur': 'https://www.centre.com.pk/ur/tools/code-tools/base64-encoder',
        'hi': 'https://www.centre.com.pk/hi/tools/code-tools/base64-encoder',
        'ar': 'https://www.centre.com.pk/ar/tools/code-tools/base64-encoder',
      },
    },
  };
}

export default function Base64EncoderPage() {
  return <Base64EncoderClient />;
}

export const runtime = 'edge';