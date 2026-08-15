import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { TOOL_SEO_DATA } from '@/lib/seo/toolSeoData';
import CompoundInterestClient from "./tool.client";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const toolData = TOOL_SEO_DATA['compound-interest'];
  
  if (!toolData) {
    return {
      title: 'Tool Not Found',
      description: 'The requested tool could not be found.',
    };
  }
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const seoData = await import(`@/lib/seo/data/${lang}/toolSeoData.json`)
        .then(m => m.default)
        .catch(() => null);
      
      if (seoData && seoData['compound-interest']) {
        title = seoData['compound-interest'].title || toolData.title;
        description = seoData['compound-interest'].description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  return {
    title: `${title} | Centre.com.pk`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    },
  };
}

export default function CompoundInterestPage() {
  return <CompoundInterestClient />;
}