// app/tools/calculators/currency-converter/page.tsx
import type { Metadata } from "next";
import CurrencyConverterClient from "./tool.client";
import { getToolSEOData } from '@/lib/seo/toolSeoData';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('currency-converter');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/calculators.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.currency_converter) {
        title = translations.currency_converter.title || toolData.title;
        description = translations.currency_converter.description || toolData.description;
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
      url: `https://www.centre.com.pk/${lang}/tools/calculators/currency-converter`,
      images: [{ url: "/og-images/currency-converter.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/currency-converter.png"],
    },
    alternates: {
      canonical: `https://www.centre.com.pk/${lang}/tools/calculators/currency-converter`,
      languages: {
        'en': 'https://www.centre.com.pk/tools/calculators/currency-converter',
        'ur': 'https://www.centre.com.pk/ur/tools/calculators/currency-converter',
        'hi': 'https://www.centre.com.pk/hi/tools/calculators/currency-converter',
        'ar': 'https://www.centre.com.pk/ar/tools/calculators/currency-converter',
      },
    },
  };
}

export default function CurrencyConverter() {
  return <CurrencyConverterClient />;
}