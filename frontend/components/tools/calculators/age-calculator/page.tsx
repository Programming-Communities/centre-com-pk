import { Metadata } from 'next';
import AgeCalculatorTool from './tool.client';
import { getToolSEOData } from '@/lib/seo/toolSeoData';

// Get SEO data
const seoData = getToolSEOData('age-calculator');

export const metadata: Metadata = {
  title: seoData.title,
  description: seoData.description,
  keywords: seoData.keywords,
  openGraph: {
    title: seoData.title,
    description: seoData.description,
    type: 'website',
    url: `https://www.centre.com.pk/tools/${seoData.category}/${seoData.slug}`,
    images: [
      {
        url: '/og-images/age-calculator.png',
        width: 1200,
        height: 630,
        alt: 'Age Calculator - Centre.com.pk',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: seoData.title,
    description: seoData.description,
    images: ['/og-images/age-calculator.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: `https://www.centre.com.pk/tools/${seoData.category}/${seoData.slug}`,
  },
};

export default function AgeCalculatorPage() {
  return <AgeCalculatorTool />;
}