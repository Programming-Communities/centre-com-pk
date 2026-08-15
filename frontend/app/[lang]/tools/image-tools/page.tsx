// app/[lang]/tools/image-tools/page.tsx
import type { Metadata } from "next";
import ImageToolsPageClient from "./page.client";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = "https://www.centre.com.pk";
  
  // Language-specific titles
  const titles: Record<string, string> = {
    en: "Professional Image Tools - AI-Powered Image Processing | Centre.com.pk",
    ur: "پیشہ ورانہ امیج ٹولز - AI سے چلنے والی امیج پروسیسنگ | Centre.com.pk",
    hi: "पेशेवर इमेज टूल्स - एआई-संचालित इमेज प्रोसेसिंग | Centre.com.pk",
    ar: "أدوات الصور الاحترافية - معالجة الصور بالذكاء الاصطناعي | Centre.com.pk"
  };
  
  const descriptions: Record<string, string> = {
    en: "AI-powered image tools for professionals. Resize, compress, edit, enhance, convert images with quality preservation. Background removal, filters, collage maker, and more.",
    ur: "پیشہ ور افراد کے لیے AI سے چلنے والے امیج ٹولز۔ تصاویر کو معیار کے ساتھ ریسائز، کمپریس، ایڈٹ، بہتر اور تبدیل کریں۔ پس منظر ہٹانا، فلٹرز، کولیج میکر اور مزید۔",
    hi: "पेशेवरों के लिए एआई-संचालित इमेज टूल्स। गुणवत्ता संरक्षण के साथ छवियों को रीसेज़, कंप्रेस, संपादित, बढ़ाएं और कन्वर्ट करें। पृष्ठभूमि हटाना, फ़िल्टर, कोलाज मेकर और अधिक।",
    ar: "أدوات صور مدعومة بالذكاء الاصطناعي للمحترفين. تغيير الحجم، الضغط، التحرير، التحسين، تحويل الصور مع الحفاظ على الجودة. إزالة الخلفية، الفلاتر، صانع الكولاج والمزيد."
  };
  
  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    keywords: "image tools, image resizer, image compressor, background remover, image converter, image cropper, image filters, favicon generator, meme generator, photo collage, image processing",
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      type: "website",
      url: `${baseUrl}/${lang}/tools/image-tools`,
      siteName: "Centre.com.pk",
      images: [{ url: "/og-image-tools.png", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      images: ["/og-image-tools.png"],
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
      canonical: `${baseUrl}/${lang}/tools/image-tools`,
      languages: {
        'en': `${baseUrl}/tools/image-tools`,
        'ur': `${baseUrl}/ur/tools/image-tools`,
        'hi': `${baseUrl}/hi/tools/image-tools`,
        'ar': `${baseUrl}/ar/tools/image-tools`,
      },
    },
  };
}

export default function ImageToolsPage() {
  return (
    <div suppressHydrationWarning>
      <ImageToolsPageClient />
    </div>
  );
}

