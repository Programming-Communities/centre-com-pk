import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import MarkdownEditorClient from "./tool.client";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('markdown-editor');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/text-tools.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.markdown_editor) {
        title = translations.markdown_editor.title || toolData.title;
        description = translations.markdown_editor.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/text-tools/markdown-editor`;
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: "/og-images/markdown-editor.png", width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/markdown-editor.png"],
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
        'en': 'https://www.centre.com.pk/tools/text-tools/markdown-editor',
        'ur': 'https://www.centre.com.pk/ur/tools/text-tools/markdown-editor',
        'hi': 'https://www.centre.com.pk/hi/tools/text-tools/markdown-editor',
        'ar': 'https://www.centre.com.pk/ar/tools/text-tools/markdown-editor',
      },
    },
  };
}

export default function MarkdownEditorPage() {
  return <MarkdownEditorClient />;
}

export const runtime = 'edge';