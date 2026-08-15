// app/[lang]/tools/code-tools/json-formatter/page.tsx
import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import JSONFormatterClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('json-formatter');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/code-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.json_formatter) {
        title = translations.json_formatter.title || toolData.title;
        description = translations.json_formatter.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/code-tools/json-formatter`;
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/json-formatter.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/json-formatter.png"],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': 'https://www.centre.com.pk/tools/code-tools/json-formatter',
        'ur': 'https://www.centre.com.pk/ur/tools/code-tools/json-formatter',
        'hi': 'https://www.centre.com.pk/hi/tools/code-tools/json-formatter',
        'ar': 'https://www.centre.com.pk/ar/tools/code-tools/json-formatter',
      },
    },
  };
}

export default function JSONFormatterPage() {
  return <JSONFormatterClient />;
}

export const runtime = 'edge';