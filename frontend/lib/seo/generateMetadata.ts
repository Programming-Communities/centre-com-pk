// lib/seo/generateMetadata.ts - FINAL FIXED VERSION
import { Metadata } from 'next';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_AUTHOR, SITE_TWITTER_HANDLE } from './constants';
import { ToolSEOData } from './types';
import { generateMetaKeywords } from './utils';

export function generateToolMetadata(
  toolData: ToolSEOData,
  lang: string = 'en'
): Metadata {
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/${toolData.category}/${toolData.slug}`;
  const keywords = generateMetaKeywords(toolData);
  const ogImageUrl = `${SITE_URL}/api/og-image?title=${encodeURIComponent(toolData.title)}&description=${encodeURIComponent(toolData.description)}&toolName=${encodeURIComponent(toolData.title)}&category=${encodeURIComponent(toolData.category)}`;

  const verification: Record<string, string> = {};
  if (process.env.GOOGLE_SITE_VERIFICATION) verification.google = process.env.GOOGLE_SITE_VERIFICATION;
  if (process.env.YANDEX_VERIFICATION) verification.yandex = process.env.YANDEX_VERIFICATION;
  if (process.env.YAHOO_VERIFICATION) verification.yahoo = process.env.YAHOO_VERIFICATION;

  const otherVerification: Record<string, string> = {};
  if (process.env.BING_SITE_VERIFICATION) otherVerification['msvalidate.01'] = process.env.BING_SITE_VERIFICATION;

  const metadata: Metadata = {
    title: `${toolData.title} | ${SITE_NAME}`,
    description: toolData.description,
    keywords,
    authors: [{ name: SITE_AUTHOR }],
    creator: SITE_AUTHOR,
    publisher: SITE_NAME,
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
    openGraph: {
      type: 'website',
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_SA' : 'en_US',
      url: canonicalUrl,
      title: toolData.title,
      description: toolData.description,
      siteName: SITE_NAME,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: toolData.title }],
      determiner: 'the',
      countryName: 'Pakistan',
    },
    twitter: {
      card: 'summary_large_image',
      title: toolData.title,
      description: toolData.description,
      images: [ogImageUrl],
      creator: SITE_TWITTER_HANDLE,
      site: SITE_TWITTER_HANDLE,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `https://www.centre.com.pk/tools/${toolData.category}/${toolData.slug}`,
        'ur': `https://www.centre.com.pk/ur/tools/${toolData.category}/${toolData.slug}`,
        'hi': `https://www.centre.com.pk/hi/tools/${toolData.category}/${toolData.slug}`,
        'ar': `https://www.centre.com.pk/ar/tools/${toolData.category}/${toolData.slug}`,
        'x-default': `https://www.centre.com.pk/tools/${toolData.category}/${toolData.slug}`,
      },
    },
    category: 'technology',
    classification: 'web tools, utilities, calculators',
    formatDetection: { telephone: false, date: false, address: false, email: false },
    other: { 'darkreader-lock': '', 'darkreader-mode': 'dynamic' },
  };

  if (Object.keys(verification).length > 0 || Object.keys(otherVerification).length > 0) {
    metadata.verification = verification;
    if (Object.keys(otherVerification).length > 0) {
      metadata.other = { ...metadata.other, ...otherVerification };
    }
  }

  return metadata;
}

export function generateCategoryMetadata(
  category: string,
  categoryName: string,
  description: string,
  lang: string = 'en'
): Metadata {
  const canonicalUrl = `https://www.centre.com.pk/${lang}/tools/${category}`;
  const ogImageUrl = `${SITE_URL}/api/og-image?title=${encodeURIComponent(`${categoryName} Tools | ${SITE_NAME}`)}&description=${encodeURIComponent(description)}&category=${encodeURIComponent(category)}`;

  return {
    title: `${categoryName} Tools - Free Online ${categoryName} | ${SITE_NAME}`,
    description,
    keywords: `${category} tools, online ${category}, free ${category} tools, ${category} utilities`,
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: `${categoryName} Tools | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${categoryName} Tools` }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_SA' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} Tools`,
      description,
      images: [ogImageUrl],
      creator: SITE_TWITTER_HANDLE,
      site: SITE_TWITTER_HANDLE,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `https://www.centre.com.pk/tools/${category}`,
        'ur': `https://www.centre.com.pk/ur/tools/${category}`,
        'hi': `https://www.centre.com.pk/hi/tools/${category}`,
        'ar': `https://www.centre.com.pk/ar/tools/${category}`,
        'x-default': `https://www.centre.com.pk/tools/${category}`,
      },
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

export function generateHomeMetadata(lang: string = 'en'): Metadata {
  const ogImageUrl = `${SITE_URL}/api/og-image?title=${encodeURIComponent(SITE_NAME)}&description=${encodeURIComponent(SITE_DESCRIPTION)}`;
  return {
    title: `${SITE_NAME} - Free Online Tools for Everyone`,
    description: SITE_DESCRIPTION,
    keywords: 'free online tools, calculators, converters, formatters, utilities, web tools, productivity tools',
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${lang}`,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      siteName: SITE_NAME,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: SITE_NAME }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_SA' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title: SITE_NAME, description: SITE_DESCRIPTION, images: [ogImageUrl], creator: SITE_TWITTER_HANDLE, site: SITE_TWITTER_HANDLE },
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: {
        'en': `${SITE_URL}`,
        'ur': `${SITE_URL}/ur`,
        'hi': `${SITE_URL}/hi`,
        'ar': `${SITE_URL}/ar`,
        'x-default': `${SITE_URL}`,
      },
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

export function generateBlogPostMetadata(
  title: string,
  description: string,
  slug: string,
  lang: string = 'en'
): Metadata {
  const canonicalUrl = `https://www.centre.com.pk/${lang}/blog/${slug}`;
  const ogImageUrl = `${SITE_URL}/api/og-image?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title,
      description,
      siteName: SITE_NAME,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      publishedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      authors: [SITE_AUTHOR],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_SA' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImageUrl], creator: SITE_TWITTER_HANDLE, site: SITE_TWITTER_HANDLE },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `https://www.centre.com.pk/blog/${slug}`,
        'ur': `https://www.centre.com.pk/ur/blog/${slug}`,
        'hi': `https://www.centre.com.pk/hi/blog/${slug}`,
        'ar': `https://www.centre.com.pk/ar/blog/${slug}`,
        'x-default': `https://www.centre.com.pk/blog/${slug}`,
      },
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}