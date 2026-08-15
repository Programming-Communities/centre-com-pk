// app/[lang]/tools/code-tools/qr-code-generator/page.tsx
import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import QRCodeGeneratorClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('qr-code-generator');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/code-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.qr_code_generator) {
        title = translations.qr_code_generator.title || toolData.title;
        description = translations.qr_code_generator.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/code-tools/qr-code-generator`;
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/qr-code-generator.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/qr-code-generator.png"],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': 'https://www.centre.com.pk/tools/code-tools/qr-code-generator',
        'ur': 'https://www.centre.com.pk/ur/tools/code-tools/qr-code-generator',
        'hi': 'https://www.centre.com.pk/hi/tools/code-tools/qr-code-generator',
        'ar': 'https://www.centre.com.pk/ar/tools/code-tools/qr-code-generator',
      },
    },
  };
}

export default function QRCodeGeneratorPage() {
  return <QRCodeGeneratorClient />;
}

export const runtime = 'edge';