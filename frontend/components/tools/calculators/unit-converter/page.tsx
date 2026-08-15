// app/[lang]/tools/calculators/unit-converter/page.tsx
import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import UnitConverterClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('unit-converter');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/calculators.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.unit_converter) {
        title = translations.unit_converter.title || toolData.title;
        description = translations.unit_converter.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: `https://www.centre.com.pk/${lang}/tools/calculators/unit-converter`,
      images: [{ url: "/og-images/unit-converter.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/unit-converter.png"],
    },
    alternates: {
      canonical: `https://www.centre.com.pk/${lang}/tools/calculators/unit-converter`,
      languages: {
        'en': 'https://www.centre.com.pk/tools/calculators/unit-converter',
        'ur': 'https://www.centre.com.pk/ur/tools/calculators/unit-converter',
        'hi': 'https://www.centre.com.pk/hi/tools/calculators/unit-converter',
        'ar': 'https://www.centre.com.pk/ar/tools/calculators/unit-converter',
      },
    },
  };
}

export default function UnitConverterPage() {
  return <UnitConverterClient />;
}