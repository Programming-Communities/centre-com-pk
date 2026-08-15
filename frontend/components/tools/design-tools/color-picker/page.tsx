// app/[lang]/tools/design-tools/color-picker/page.tsx
import type { Metadata } from "next";
import ColorPickerClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  
  // Minimal SEO — sirf tool ke liye necessary
  const titles: Record<string, string> = {
    en: "Color Picker & Converter - HEX, RGB, HSL, CMYK",
    ur: "رنگ چننے والا اور کنورٹر - HEX, RGB, HSL, CMYK",
    hi: "रंग चुनने वाला और कनवर्टर - HEX, RGB, HSL, CMYK",
    ar: "منتقي الألوان ومحول - HEX, RGB, HSL, CMYK"
  };
  
  const descriptions: Record<string, string> = {
    en: "Free color picker tool. Pick colors, convert between HEX, RGB, HSL, CMYK formats instantly. Check contrast ratios for WCAG accessibility.",
    ur: "مفت رنگ چننے والا ٹول۔ رنگ چنیں، HEX، RGB، HSL، CMYK فارمیٹس میں فوری تبدیل کریں۔ WCAG معیار کے مطابق کنٹراسٹ چیک کریں۔",
    hi: "मुफ्त रंग चुनने वाला टूल। रंग चुनें, HEX, RGB, HSL, CMYK फॉर्मेट में तुरंत बदलें। WCAG मानकों के लिए कंट्रास्ट चेक करें।",
    ar: "أداة مجانية لاختيار الألوان. اختر الألوان، وحول بين صيغ HEX، RGB، HSL، CMYK فورًا. تحقق من نسب التباين وفقًا لمعايير WCAG."
  };
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/design-tools/color-picker`;
  
  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': 'https://www.centre.com.pk/tools/design-tools/color-picker',
        'ur': 'https://www.centre.com.pk/ur/tools/design-tools/color-picker',
        'hi': 'https://www.centre.com.pk/hi/tools/design-tools/color-picker',
        'ar': 'https://www.centre.com.pk/ar/tools/design-tools/color-picker',
      },
    },
  };
}

export default function ColorPickerPage() {
  return <ColorPickerClient />;
}

export const runtime = 'edge';