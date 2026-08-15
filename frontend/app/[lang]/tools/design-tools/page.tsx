// app/[lang]/tools/design-tools/page.tsx
import type { Metadata } from "next";
import DesignToolsPageClient from "./page.client";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = "https://www.centre.com.pk";
  
  // Language-specific titles
  const titles: Record<string, string> = {
    en: "Professional Design Tools - Advanced Design Utilities | Centre.com.pk",
    ur: "پیشہ ورانہ ڈیزائن ٹولز - جدید ڈیزائن یوٹیلیٹیز | Centre.com.pk",
    hi: "पेशेवर डिज़ाइन टूल्स - उन्नत डिज़ाइन उपयोगिताएँ | Centre.com.pk",
    ar: "أدوات التصميم الاحترافية - أدوات تصميم متقدمة | Centre.com.pk"
  };
  
  const descriptions: Record<string, string> = {
    en: "AI-powered design tools for professionals. Color pickers, palette generators, design utilities and more with enterprise-grade precision.",
    ur: "پیشہ ور افراد کے لیے AI سے چلنے والے ڈیزائن ٹولز۔ رنگ چننے والے، پیلیٹ جنریٹر، ڈیزائن یوٹیلیٹیز اور مزید۔",
    hi: "पेशेवरों के लिए एआई-संचालित डिज़ाइन टूल्स। रंग चुनने वाले, पैलेट जनरेटर, डिज़ाइन उपयोगिताएँ और अधिक।",
    ar: "أدوات تصميم مدعومة بالذكاء الاصطناعي للمحترفين. منتقيات الألوان، مولدات اللوحات، أدوات التصميم والمزيد."
  };
  
  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    keywords: "design tools, color picker, palette generator, design utilities, color tools, design resources, professional design tools",
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      type: "website",
      url: `${baseUrl}/${lang}/tools/design-tools`,
      siteName: "Centre.com.pk",
      images: [{ url: "/og-design-tools.png", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      images: ["/og-design-tools.png"],
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
      canonical: `${baseUrl}/${lang}/tools/design-tools`,
      languages: {
        'en': `${baseUrl}/tools/design-tools`,
        'ur': `${baseUrl}/ur/tools/design-tools`,
        'hi': `${baseUrl}/hi/tools/design-tools`,
        'ar': `${baseUrl}/ar/tools/design-tools`,
      },
    },
  };
}

export default function DesignToolsPage() {
  return (
    <div suppressHydrationWarning>
      <DesignToolsPageClient />
    </div>
  );
}

