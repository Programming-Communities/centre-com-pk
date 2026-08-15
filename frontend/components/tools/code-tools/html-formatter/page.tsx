// app/[lang]/tools/code-tools/html-formatter/page.tsx
import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import HtmlFormatterClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('html-formatter');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/code-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.html_formatter) {
        title = translations.html_formatter.title || toolData.title;
        description = translations.html_formatter.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/code-tools/html-formatter`;
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/html-formatter.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/html-formatter.png"],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': 'https://www.centre.com.pk/tools/code-tools/html-formatter',
        'ur': 'https://www.centre.com.pk/ur/tools/code-tools/html-formatter',
        'hi': 'https://www.centre.com.pk/hi/tools/code-tools/html-formatter',
        'ar': 'https://www.centre.com.pk/ar/tools/code-tools/html-formatter',
      },
    },
  };
}

export default function HtmlFormatterPage() {
  return <HtmlFormatterClient />;
}

export const runtime = 'edge';