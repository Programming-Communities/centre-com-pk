// app/[lang]/tools/code-tools/xml-formatter/page.tsx
import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import XMLFormatterClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('xml-formatter');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/code-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.xml_formatter) {
        title = translations.xml_formatter.title || toolData.title;
        description = translations.xml_formatter.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/code-tools/xml-formatter`;
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/xml-formatter.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/xml-formatter.png"],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': 'https://www.centre.com.pk/tools/code-tools/xml-formatter',
        'ur': 'https://www.centre.com.pk/ur/tools/code-tools/xml-formatter',
        'hi': 'https://www.centre.com.pk/hi/tools/code-tools/xml-formatter',
        'ar': 'https://www.centre.com.pk/ar/tools/code-tools/xml-formatter',
      },
    },
  };
}

export default function XMLFormatterPage() {
  return <XMLFormatterClient />;
}

export const runtime = 'edge';