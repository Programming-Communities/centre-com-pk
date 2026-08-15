// design-tools/metadata.ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Design Tools - Advanced Design Utilities | Centre.com.pk",
  description: "AI-powered design tools for professionals. Color pickers, palette generators, design utilities and more with enterprise-grade precision.",
  keywords: "design tools, color picker, palette generator, design utilities, color tools, design resources",
  
  openGraph: {
    title: "Professional Design Tools - Advanced Design Utilities | Centre.com.pk",
    description: "AI-powered design tools for professionals. Color pickers, palette generators, design utilities and more with enterprise-grade precision.",
    type: "website",
    url: "https://www.centre.com.pk/tools/design-tools",
    siteName: "Centre.com.pk",
    images: [
      {
        url: "/og-design-tools.png",
        width: 1200,
        height: 630,
        alt: "Centre.com.pk - Professional Design Tools",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Professional Design Tools - Advanced Design Utilities | Centre.com.pk",
    description: "AI-powered design tools for professionals. Color pickers, palette generators, design utilities and more with enterprise-grade precision.",
    images: ["/og-design-tools.png"],
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
    canonical: "https://www.centre.com.pk/tools/design-tools",
  },
  
  verification: {
    google: "verification_token",
    yandex: "verification_token",
    yahoo: "verification_token",
  },
  
  category: "design",
};