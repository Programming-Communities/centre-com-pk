// app/[lang]/tools/text-tools/page.tsx
import type { Metadata } from "next";
import TextToolsPageClient from "./page.client";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = "https://www.centre.com.pk";
  
  // Language-specific titles
  const titles: Record<string, string> = {
    en: "Professional Text Tools - Advanced Text Processing & Analysis | Centre.com.pk",
    ur: "پیشہ ورانہ ٹیکسٹ ٹولز - جدید ٹیکسٹ پروسیسنگ اور تجزیہ | Centre.com.pk",
    hi: "पेशेवर टेक्स्ट टूल्स - उन्नत टेक्स्ट प्रोसेसिंग और विश्लेषण | Centre.com.pk",
    ar: "أدوات النص الاحترافية - معالجة وتحليل النص المتقدم | Centre.com.pk"
  };
  
  const descriptions: Record<string, string> = {
    en: "AI-powered text tools for professionals. Word counter, character counter, case converter, text extractor, regex tester and more with enterprise-grade accuracy.",
    ur: "پیشہ ور افراد کے لیے AI سے چلنے والے ٹیکسٹ ٹولز۔ ورڈ کاؤنٹر، کریکٹر کاؤنٹر، کیس کنورٹر، ٹیکسٹ ایکسٹریکٹر، ریجیکس ٹیسٹر اور مزید۔",
    hi: "पेशेवरों के लिए एआई-संचालित टेक्स्ट टूल्स। वर्ड काउंटर, कैरेक्टर काउंटर, केस कनवर्टर, टेक्स्ट एक्सट्रैक्टर, रेगेक्स टेस्टर और अधिक।",
    ar: "أدوات نص مدعومة بالذكاء الاصطناعي للمحترفين. عداد الكلمات، عداد الأحرف، محول الحالة، مستخرج النص، اختبار التعبيرات العادية والمزيد."
  };
  
  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    keywords: "text tools, word counter, character counter, case converter, text extractor, regex tester, hash generator, uuid generator, markdown editor, text diff checker",
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      type: "website",
      url: `${baseUrl}/${lang}/tools/text-tools`,
      siteName: "Centre.com.pk",
      images: [{ url: "/og-text-tools.png", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      images: ["/og-text-tools.png"],
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
      canonical: `${baseUrl}/${lang}/tools/text-tools`,
      languages: {
        'en': `${baseUrl}/tools/text-tools`,
        'ur': `${baseUrl}/ur/tools/text-tools`,
        'hi': `${baseUrl}/hi/tools/text-tools`,
        'ar': `${baseUrl}/ar/tools/text-tools`,
      },
    },
  };
}

export default function TextToolsPage() {
  return (
    <div suppressHydrationWarning>
      <TextToolsPageClient />
    </div>
  );
}

