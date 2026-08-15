// components/seo/MetaTags.tsx — FIXED v2.0
// ⚠️ WARNING: This component was injecting DUPLICATE title, meta, and hreflang tags
// because it used next/head <Head> which conflicts with App Router's generateMetadata().
// 
// SOLUTION: This component is now DEPRECATED. All meta tags are handled by:
// - app/[lang]/layout.tsx (generateMetadata)
// - lib/seo/generateMetadata.ts (generateToolMetadata, generateBlogPostMetadata, etc.)
//
// If you need dynamic client-side meta updates, use:
//   document.title = 'New Title';
//   document.querySelector('meta[name="description"]')?.setAttribute('content', '...');
//
// DO NOT use next/head in App Router for SEO tags.

'use client';

interface MetaTagsProps {
  title?: string;
  description?: string;
}

export default function MetaTags({ title, description }: MetaTagsProps) {
  // Only update document.title client-side if needed
  if (typeof window !== 'undefined' && title) {
    document.title = title.includes('Centre.com.pk') ? title : `${title} | Centre.com.pk`;
  }
  
  // Return nothing — all SEO tags come from generateMetadata()
  return null;
}

// // components/seo/MetaTags.tsx
// 'use client';

// import Head from 'next/head';
// import { useMemo } from 'react';
// import {
//   SITE_URL,
//   SITE_NAME,
//   SITE_DESCRIPTION,
//   SITE_KEYWORDS,
//   SITE_AUTHOR,
//   SITE_TWITTER_HANDLE,
//   CATEGORY_NAMES,
//   CATEGORY_DESCRIPTIONS
// } from '@/lib/seo/constants';

// interface MetaTagsProps {
//   title?: string;
//   description?: string;
//   keywords?: string | string[];
//   image?: string;
//   url?: string;
//   type?: 'website' | 'article' | 'tool';
//   noIndex?: boolean;
//   publishedTime?: string;
//   modifiedTime?: string;
//   author?: string;
//   section?: string;
//   tags?: string[];
//   toolName?: string;
//   toolCategory?: string;
//   isToolPage?: boolean;
// }

// export default function MetaTags({
//   title,
//   description,
//   keywords,
//   image,
//   url,
//   type = 'website',
//   noIndex = false,
//   publishedTime,
//   modifiedTime,
//   author = SITE_AUTHOR,
//   section = 'Technology',
//   tags = [],
//   toolName,
//   toolCategory,
//   isToolPage = false
// }: MetaTagsProps): React.ReactElement {
//   // Generate full title
//   const fullTitle = useMemo(() => {
//     if (title) {
//       return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
//     }
//     return SITE_NAME;
//   }, [title]);

//   // Generate full description
//   const fullDescription = useMemo(() => {
//     if (description) return description;
//     if (toolCategory && CATEGORY_DESCRIPTIONS[toolCategory]) {
//       return CATEGORY_DESCRIPTIONS[toolCategory];
//     }
//     return SITE_DESCRIPTION;
//   }, [description, toolCategory]);

//   // Generate keywords
//   const fullKeywords = useMemo(() => {
//     if (Array.isArray(keywords)) {
//       return keywords.join(', ');
//     }
//     if (typeof keywords === 'string') {
//       return keywords;
//     }
//     if (toolCategory && CATEGORY_NAMES[toolCategory]) {
//       return `${CATEGORY_NAMES[toolCategory]}, online tools, free tools, ${SITE_KEYWORDS}`;
//     }
//     return SITE_KEYWORDS;
//   }, [keywords, toolCategory]);

//   // Generate OG image URL
//   const ogImageUrl = useMemo(() => {
//     if (image && image.startsWith('http')) return image;
    
//     const imageUrl = new URL('/api/og-image', SITE_URL);
    
//     // Add title and description
//     imageUrl.searchParams.set('title', fullTitle);
//     imageUrl.searchParams.set('description', fullDescription);
    
//     // Add theme (will be handled client-side)
//     if (typeof window !== 'undefined') {
//       const urlParams = new URLSearchParams(window.location.search);
//       const theme = urlParams.get('theme') || 'professional-blue';
//       imageUrl.searchParams.set('theme', theme);
//     } else {
//       imageUrl.searchParams.set('theme', 'professional-blue');
//     }
    
//     // Add tool-specific data
//     if (toolName) {
//       imageUrl.searchParams.set('toolName', toolName);
//     }
//     if (toolCategory) {
//       imageUrl.searchParams.set('category', toolCategory);
//     }
    
//     return imageUrl.toString();
//   }, [image, fullTitle, fullDescription, toolName, toolCategory]);

//   // Generate canonical URL
//   const canonicalUrl = useMemo(() => {
//     if (url) {
//       return url.startsWith('http') ? url : `${SITE_URL}${url}`;
//     }
//     if (typeof window !== 'undefined') {
//       return window.location.href.split('?')[0]; // Remove query params for canonical
//     }
//     return SITE_URL;
//   }, [url]);

//   // Generate robots content
//   const robotsContent = useMemo(() => {
//     if (noIndex) {
//       return 'noindex, nofollow, noarchive, nosnippet, notranslate, noimageindex';
//     }
//     return 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
//   }, [noIndex]);

//   // Get current theme for sharing
//   const currentTheme = useMemo(() => {
//     if (typeof window === 'undefined') return 'professional-blue';
    
//     const urlParams = new URLSearchParams(window.location.search);
//     const theme = urlParams.get('theme');
//     const savedTheme = localStorage.getItem('theme');
    
//     return theme || savedTheme || 'professional-blue';
//   }, []);

//   // Generate share URL with theme
//   const shareUrl = useMemo(() => {
//     const baseUrl = canonicalUrl;
//     const urlObj = new URL(baseUrl);
    
//     // Add theme parameter for sharing
//     urlObj.searchParams.set('theme', currentTheme);
    
//     return urlObj.toString();
//   }, [canonicalUrl, currentTheme]);

//   return (
//     <Head>
//       {/* Primary Meta Tags */}
//       <title>{fullTitle}</title>
//       <meta name="title" content={fullTitle} />
//       <meta name="description" content={fullDescription} />
//       <meta name="keywords" content={fullKeywords} />
//       <meta name="author" content={author} />
//       <meta name="robots" content={robotsContent} />
      
//       {/* Language and Content Info */}
//       <meta name="language" content="en" />
//       <meta name="revisit-after" content="7 days" />
//       <meta name="rating" content="General" />
//       <meta name="distribution" content="Global" />
//       <meta name="generator" content="Next.js" />
//       <meta name="copyright" content={`© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.`} />
      
//       {/* Open Graph / Facebook */}
//       <meta property="og:type" content={type} />
//       <meta property="og:url" content={shareUrl} />
//       <meta property="og:title" content={fullTitle} />
//       <meta property="og:description" content={fullDescription} />
//       <meta property="og:image" content={ogImageUrl} />
//       <meta property="og:image:width" content="1200" />
//       <meta property="og:image:height" content="630" />
//       <meta property="og:image:alt" content={fullTitle} />
//       <meta property="og:image:type" content="image/svg+xml" />
//       <meta property="og:site_name" content={SITE_NAME} />
//       <meta property="og:locale" content="en_US" />
      
//       {/* Twitter Card */}
//       <meta name="twitter:card" content="summary_large_image" />
//       <meta name="twitter:url" content={shareUrl} />
//       <meta name="twitter:title" content={fullTitle} />
//       <meta name="twitter:description" content={fullDescription} />
//       <meta name="twitter:image" content={ogImageUrl} />
//       <meta name="twitter:image:alt" content={fullTitle} />
//       <meta name="twitter:creator" content={SITE_TWITTER_HANDLE} />
//       <meta name="twitter:site" content={SITE_TWITTER_HANDLE} />
      
//       {/* Article-specific meta tags */}
//       {type === 'article' && publishedTime && (
//         <meta property="article:published_time" content={publishedTime} />
//       )}
//       {type === 'article' && modifiedTime && (
//         <meta property="article:modified_time" content={modifiedTime} />
//       )}
//       {type === 'article' && author && (
//         <meta property="article:author" content={author} />
//       )}
//       {type === 'article' && section && (
//         <meta property="article:section" content={section} />
//       )}
//       {type === 'article' && tags.length > 0 && (
//         tags.map((tag, index) => (
//           <meta key={`tag-${index}`} property="article:tag" content={tag} />
//         ))
//       )}
      
//       {/* Tool-specific meta tags */}
//       {isToolPage && toolName && (
//         <>
//           <meta property="og:type" content="product" />
//           <meta property="product:brand" content={SITE_NAME} />
//           <meta property="product:availability" content="in stock" />
//           <meta property="product:condition" content="new" />
//           <meta property="product:price:amount" content="0" />
//           <meta property="product:price:currency" content="USD" />
//         </>
//       )}
      
//       {/* Additional SEO Meta Tags */}
//       <meta name="application-name" content={SITE_NAME} />
//       <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
//       <meta name="theme-color" content="#2563EB" />
//       <meta name="msapplication-TileColor" content="#2563EB" />
      
//       {/* Canonical URL */}
//       <link rel="canonical" href={canonicalUrl} />
      
//       {/* Alternate Languages (if any) */}
//       <link rel="alternate" href={canonicalUrl} hrefLang="en" />
//       <link rel="alternate" href={canonicalUrl} hrefLang="x-default" />
      
//       {/* Preload OG image for better performance */}
//       <link
//         rel="preload"
//         href={ogImageUrl}
//         as="image"
//         type="image/svg+xml"
//         crossOrigin="anonymous"
//       />
//     </Head>
//   );
// }