// app/[lang]/tools/security-tools/page.tsx
import type { Metadata } from "next";
import SecurityToolsPageClient from "./page.client";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = "https://www.centre.com.pk";
  
  // Language-specific titles
  const titles: Record<string, string> = {
    en: "Professional Security Tools - Advanced Security Utilities | Centre.com.pk",
    ur: "پیشہ ورانہ سیکیورٹی ٹولز - جدید سیکیورٹی یوٹیلیٹیز | Centre.com.pk",
    hi: "पेशेवर सुरक्षा टूल्स - उन्नत सुरक्षा उपयोगिताएँ | Centre.com.pk",
    ar: "أدوات الأمان الاحترافية - أدوات أمان متقدمة | Centre.com.pk"
  };
  
  const descriptions: Record<string, string> = {
    en: "AI-powered security tools for professionals. Password generators, encryption tools, hash generators, security analyzers and more with enterprise-grade protection.",
    ur: "پیشہ ور افراد کے لیے AI سے چلنے والے سیکیورٹی ٹولز۔ پاسورڈ جنریٹر، انکرپشن ٹولز، ہیش جنریٹر، سیکیورٹی اینالائزر اور مزید۔",
    hi: "पेशेवरों के लिए एआई-संचालित सुरक्षा उपकरण। पासवर्ड जनरेटर, एन्क्रिप्शन उपकरण, हैश जनरेटर, सुरक्षा विश्लेषक और अधिक।",
    ar: "أدوات أمان مدعومة بالذكاء الاصطناعي للمحترفين. مولدات كلمات المرور، أدوات التشفير، مولدات التجزئة، محللات الأمان والمزيد."
  };
  
  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    keywords: "security tools, password generator, encryption tools, hash generator, security analyzer, cybersecurity tools, data protection",
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      type: "website",
      url: `${baseUrl}/${lang}/tools/security-tools`,
      siteName: "Centre.com.pk",
      images: [{ url: "/og-security-tools.png", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      images: ["/og-security-tools.png"],
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
      canonical: `${baseUrl}/${lang}/tools/security-tools`,
      languages: {
        'en': `${baseUrl}/tools/security-tools`,
        'ur': `${baseUrl}/ur/tools/security-tools`,
        'hi': `${baseUrl}/hi/tools/security-tools`,
        'ar': `${baseUrl}/ar/tools/security-tools`,
      },
    },
  };
}

export default function SecurityToolsPage() {
  return (
    <div suppressHydrationWarning>
      <SecurityToolsPageClient />
    </div>
  );
}

