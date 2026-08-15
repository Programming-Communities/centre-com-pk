// app/[lang]/tools/pdf-tools/page.tsx
import type { Metadata } from "next";
import PdfToolsPageClient from "./page.client";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = "https://www.centre.com.pk";
  
  // Language-specific titles
  const titles: Record<string, string> = {
    en: "Professional PDF Tools - Advanced PDF Editor & Converter | Centre.com.pk",
    ur: "پیشہ ورانہ پی ڈی ایف ٹولز - جدید پی ڈی ایف ایڈیٹر اور کنورٹر | Centre.com.pk",
    hi: "पेशेवर पीडीएफ टूल्स - उन्नत पीडीएफ संपादक और कनवर्टर | Centre.com.pk",
    ar: "أدوات PDF الاحترافية - محرر ومحول PDF متقدم | Centre.com.pk"
  };
  
  const descriptions: Record<string, string> = {
    en: "AI-powered PDF tools for professionals. Merge, split, compress, convert, protect and edit PDF files with enterprise-grade security and quality.",
    ur: "پیشہ ور افراد کے لیے AI سے چلنے والے پی ڈی ایف ٹولز۔ پی ڈی ایف فائلوں کو ضم، تقسیم، کمپریس، تبدیل، محفوظ اور ایڈٹ کریں۔",
    hi: "पेशेवरों के लिए एआई-संचालित पीडीएफ टूल्स। पीडीएफ फाइलों को मर्ज, स्प्लिट, कंप्रेस, कन्वर्ट, प्रोटेक्ट और एडिट करें।",
    ar: "أدوات PDF مدعومة بالذكاء الاصطناعي للمحترفين. دمج، تقسيم، ضغط، تحويل، حماية وتحرير ملفات PDF."
  };
  
  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    keywords: "pdf tools, pdf editor, pdf converter, merge pdf, split pdf, compress pdf, pdf to word, pdf to excel, pdf to image, pdf protect, pdf unlock",
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      type: "website",
      url: `${baseUrl}/${lang}/tools/pdf-tools`,
      siteName: "Centre.com.pk",
      images: [{ url: "/og-pdf-tools.png", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      images: ["/og-pdf-tools.png"],
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
      canonical: `${baseUrl}/${lang}/tools/pdf-tools`,
      languages: {
        'en': `${baseUrl}/tools/pdf-tools`,
        'ur': `${baseUrl}/ur/tools/pdf-tools`,
        'hi': `${baseUrl}/hi/tools/pdf-tools`,
        'ar': `${baseUrl}/ar/tools/pdf-tools`,
      },
    },
  };
}

export default function PdfToolsPage() {
  return (
    <div suppressHydrationWarning>
      <PdfToolsPageClient />
    </div>
  );
}

