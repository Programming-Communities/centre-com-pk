// app/[lang]/tools/code-tools/page.tsx
import type { Metadata } from "next";
import CodeToolsPageClient from "./page.client";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = "https://www.centre.com.pk";
  
  // Language-specific titles
  const titles: Record<string, string> = {
    en: "Professional Code Tools - Developer Utilities Suite | Centre.com.pk",
    ur: "پیشہ ورانہ کوڈ ٹولز - ڈویلپر یوٹیلیٹیز سوٹ | Centre.com.pk",
    hi: "पेशेवर कोड टूल्स - डेवलपर उपयोगिता सूट | Centre.com.pk",
    ar: "أدوات البرمجة الاحترافية - مجموعة أدوات المطور | Centre.com.pk"
  };
  
  const descriptions: Record<string, string> = {
    en: "AI-powered code tools for developers. Format JSON, HTML, CSS, JavaScript, generate QR codes, secure passwords, encode/decode data with enterprise-grade security.",
    ur: "ڈویلپرز کے لیے AI سے چلنے والے کوڈ ٹولز۔ JSON، HTML، CSS، JavaScript فارمیٹ کریں، QR کوڈ جنریٹ کریں، پاسورڈ بنائیں، ڈیٹا انکوڈ/ڈیکوڈ کریں۔",
    hi: "डेवलपर्स के लिए एआई-संचालित कोड टूल्स। JSON, HTML, CSS, JavaScript फॉर्मेट करें, QR कोड जनरेट करें, पासवर्ड बनाएं, डेटा एन्कोड/डिकोड करें।",
    ar: "أدوات برمجة مدعومة بالذكاء الاصطناعي للمطورين. تنسيق JSON، HTML، CSS، JavaScript، إنشاء رموز QR، كلمات مرور آمنة، ترميز/فك تشفير البيانات."
  };
  
  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    keywords: "code tools, developer tools, json formatter, qr code generator, password generator, base64 encoder, html formatter, css formatter, javascript formatter, xml formatter, url encoder, color picker",
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      type: "website",
      url: `${baseUrl}/${lang}/tools/code-tools`,
      siteName: "Centre.com.pk",
      images: [{ url: "/og-code-tools.png", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      images: ["/og-code-tools.png"],
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
      canonical: `${baseUrl}/${lang}/tools/code-tools`,
      languages: {
        'en': `${baseUrl}/tools/code-tools`,
        'ur': `${baseUrl}/ur/tools/code-tools`,
        'hi': `${baseUrl}/hi/tools/code-tools`,
        'ar': `${baseUrl}/ar/tools/code-tools`,
      },
    },
  };
}

export default function CodeToolsPage() {
  return (
    <div suppressHydrationWarning>
      <CodeToolsPageClient />
    </div>
  );
}

