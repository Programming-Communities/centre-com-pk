// app/[lang]/tools/calculators/gpa-calculator/page.tsx
import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import GPACalculatorClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('gpa-calculator');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/calculators.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.gpa_calculator) {
        title = translations.gpa_calculator.title || toolData.title;
        description = translations.gpa_calculator.description || toolData.description;
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
      url: `https://www.centre.com.pk/${lang}/tools/calculators/gpa-calculator`,
      images: [{ url: "/og-images/gpa-calculator.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/gpa-calculator.png"],
    },
    alternates: {
      canonical: `https://www.centre.com.pk/${lang}/tools/calculators/gpa-calculator`,
      languages: {
        'en': 'https://www.centre.com.pk/tools/calculators/gpa-calculator',
        'ur': 'https://www.centre.com.pk/ur/tools/calculators/gpa-calculator',
        'hi': 'https://www.centre.com.pk/hi/tools/calculators/gpa-calculator',
        'ar': 'https://www.centre.com.pk/ar/tools/calculators/gpa-calculator',
      },
    },
  };
}

export default function GPACalculatorPage() {
  return <GPACalculatorClient />;
}