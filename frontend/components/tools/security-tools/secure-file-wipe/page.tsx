import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import SecureFileWipeClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('secure-file-wipe');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/security-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.secure_file_wipe) {
        title = translations.secure_file_wipe.title || toolData.title;
        description = translations.secure_file_wipe.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/security-tools/secure-file-wipe`;
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/secure-file-wipe.png", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/secure-file-wipe.png"],
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
      canonical: canonicalUrl,
      languages: {
        'en': 'https://www.centre.com.pk/tools/security-tools/secure-file-wipe',
        'ur': 'https://www.centre.com.pk/ur/tools/security-tools/secure-file-wipe',
        'hi': 'https://www.centre.com.pk/hi/tools/security-tools/secure-file-wipe',
        'ar': 'https://www.centre.com.pk/ar/tools/security-tools/secure-file-wipe',
      },
    },
  };
}

export default function SecureFileWipePage() {
  return <SecureFileWipeClient />;
}

export const runtime = 'edge';