// app/[lang]/tools/calculators/page.tsx
import type { Metadata } from "next";
import CalculatorsPageClient from "./page.client";
import { calculatorSchema } from "./metadata";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = "https://www.centre.com.pk";
  
  // Language-specific titles
  const titles: Record<string, string> = {
    en: "Professional Calculators - Advanced Calculation Tools | Centre.com.pk",
    ur: "پیشہ ورانہ کیلکولیٹرز - جدید حساب کتاب کے اوزار | Centre.com.pk",
    hi: "पेशेवर कैलकुलेटर - उन्नत गणना उपकरण | Centre.com.pk",
    ar: "الآلات الحاسبة الاحترافية - أدوات حسابية متقدمة | Centre.com.pk"
  };
  
  const descriptions: Record<string, string> = {
    en: "AI-powered calculators for health, finance, education and business. BMI, age, loan, currency, investment, and scientific calculation tools with real-time analytics.",
    ur: "صحت، مالیات، تعلیم اور کاروبار کے لیے AI سے چلنے والے کیلکولیٹرز۔ BMI، عمر، قرض، کرنسی، سرمایہ کاری، اور سائنسی حساب کتاب کے اوزار۔",
    hi: "स्वास्थ्य, वित्त, शिक्षा और व्यवसाय के लिए एआई-संचालित कैलकुलेटर। बीएमआई, आयु, ऋण, मुद्रा, निवेश, और वैज्ञानिक गणना उपकरण।",
    ar: "آلات حاسبة مدعومة بالذكاء الاصطناعي للصحة والمالية والتعليم والأعمال. BMI، العمر، القروض، العملات، الاستثمار، وأدوات الحساب العلمي."
  };
  
  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    keywords: "calculators, bmi calculator, financial calculator, investment calculator, currency converter, unit converter, age calculator, loan calculator, percentage calculator, tip calculator, gpa calculator, compound interest calculator, date calculator",
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      type: "website",
      url: `${baseUrl}/${lang}/tools/calculators`,
      siteName: "Centre.com.pk",
      images: [
        {
          url: "/og-calculators.png",
          width: 1200,
          height: 630,
          alt: "Centre.com.pk - Professional Calculators Suite",
        },
      ],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      images: ["/og-calculators.png"],
      creator: "@centerspk",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/tools/calculators`,
      languages: {
        'en': `${baseUrl}/tools/calculators`,
        'ur': `${baseUrl}/ur/tools/calculators`,
        'ar': `${baseUrl}/ar/tools/calculators`,
        'hi': `${baseUrl}/hi/tools/calculators`,
      },
    },
    verification: {
      google: "verification_token",
      yandex: "verification_token",
      yahoo: "verification_token",
    },
    category: "technology",
  };
}

export default function CalculatorsPage() {
  return (
    <div suppressHydrationWarning>
      <CalculatorsPageClient />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />
    </div>
  );
}

