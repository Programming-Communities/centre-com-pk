// text-tools/metadata.ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Text Tools - Advanced Text Processing & Analysis | Centre.com.pk",
  description: "AI-powered text tools for professionals. Word counter, character counter, case converter, text extractor, regex tester, hash generator and more with enterprise-grade accuracy.",
  keywords: "text tools, word counter, character counter, case converter, text extractor, regex tester, hash generator, uuid generator, markdown editor, text diff checker",
  
  openGraph: {
    title: "Professional Text Tools - Advanced Text Processing & Analysis",
    description: "AI-powered text tools for professionals. Word counter, character counter, case converter, text extractor, regex tester and more.",
    type: "website",
    url: "https://www.centre.com.pk/tools/text-tools",
    siteName: "Centre.com.pk",
    images: [
      {
        url: "/og-text-tools.png",
        width: 1200,
        height: 630,
        alt: "Centre.com.pk - Professional Text Tools",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Professional Text Tools - Advanced Text Processing & Analysis",
    description: "AI-powered text tools for professionals. Word counter, character counter, case converter, text extractor, regex tester and more.",
    images: ["/og-text-tools.png"],
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
    canonical: "https://www.centre.com.pk/tools/text-tools",
  },
  
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  
  authors: [
    { name: "Centre.com.pk Team" }
  ],
  
  creator: "Centre.com.pk",
  
  publisher: "Centre.com.pk",
  
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  metadataBase: new URL("https://www.centre.com.pk"),
  
  category: "tools",
};