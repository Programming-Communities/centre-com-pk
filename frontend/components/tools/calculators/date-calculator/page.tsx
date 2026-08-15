// app/[lang]/tools/calculators/date-calculator/page.tsx
import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import DateCalculatorClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('date-calculator');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/calculators.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.date_calculator) {
        title = translations.date_calculator.title || toolData.title;
        description = translations.date_calculator.description || toolData.description;
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
      url: `https://www.centre.com.pk/${lang}/tools/calculators/date-calculator`,
      images: [{ url: "/og-images/date-calculator.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/date-calculator.png"],
    },
    alternates: {
      canonical: `https://www.centre.com.pk/${lang}/tools/calculators/date-calculator`,
      languages: {
        'en': 'https://www.centre.com.pk/tools/calculators/date-calculator',
        'ur': 'https://www.centre.com.pk/ur/tools/calculators/date-calculator',
        'hi': 'https://www.centre.com.pk/hi/tools/calculators/date-calculator',
        'ar': 'https://www.centre.com.pk/ar/tools/calculators/date-calculator',
      },
    },
  };
}

export default function DateCalculatorPage() {
  return <DateCalculatorClient />;
}