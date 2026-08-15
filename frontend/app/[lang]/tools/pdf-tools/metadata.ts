// pdf-tools/metadata.ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional PDF Tools - Advanced PDF Editor & Converter | Centre.com.pk",
  description: "AI-powered PDF tools for professionals. Merge, split, compress, convert, protect and edit PDF files with enterprise-grade security and quality.",
  keywords: "pdf tools, pdf editor, pdf converter, merge pdf, split pdf, compress pdf, pdf to word, pdf to excel, pdf to image, pdf protect, pdf unlock",
  
  openGraph: {
    title: "Professional PDF Tools - Advanced PDF Editor & Converter",
    description: "AI-powered PDF tools for professionals. Merge, split, compress, convert, protect and edit PDF files.",
    type: "website",
    url: "https://www.centre.com.pk/tools/pdf-tools",
    siteName: "Centre.com.pk",
    images: [
      {
        url: "/og-pdf-tools.png",
        width: 1200,
        height: 630,
        alt: "Centre.com.pk - Professional PDF Tools",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Professional PDF Tools - Advanced PDF Editor & Converter",
    description: "AI-powered PDF tools for professionals. Merge, split, compress, convert, protect and edit PDF files.",
    images: ["/og-pdf-tools.png"],
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
    canonical: "https://www.centre.com.pk/tools/pdf-tools",
  },
};