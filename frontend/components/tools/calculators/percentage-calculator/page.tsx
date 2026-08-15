// app/[lang]/tools/calculators/percentage-calculator/page.tsx
import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import PercentageCalculatorClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('percentage-calculator');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/calculators.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.percentage_calculator) {
        title = translations.percentage_calculator.title || toolData.title;
        description = translations.percentage_calculator.description || toolData.description;
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
      url: `https://www.centre.com.pk/${lang}/tools/calculators/percentage-calculator`,
      images: [{ url: "/og-images/percentage-calculator.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/percentage-calculator.png"],
    },
    alternates: {
      canonical: `https://www.centre.com.pk/${lang}/tools/calculators/percentage-calculator`,
      languages: {
        'en': 'https://www.centre.com.pk/tools/calculators/percentage-calculator',
        'ur': 'https://www.centre.com.pk/ur/tools/calculators/percentage-calculator',
        'hi': 'https://www.centre.com.pk/hi/tools/calculators/percentage-calculator',
        'ar': 'https://www.centre.com.pk/ar/tools/calculators/percentage-calculator',
      },
    },
  };
}

export default function PercentageCalculatorPage() {
  return <PercentageCalculatorClient />;
}