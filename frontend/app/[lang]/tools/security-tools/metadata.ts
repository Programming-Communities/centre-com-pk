// security-tools/metadata.ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Security Tools - Advanced Security Utilities | Centre.com.pk",
  description: "AI-powered security tools for professionals. Password generators, encryption tools, hash generators, security analyzers and more with enterprise-grade protection.",
  keywords: "security tools, password generator, encryption tools, hash generator, security analyzer, cybersecurity tools, data protection",
  
  openGraph: {
    title: "Professional Security Tools - Advanced Security Utilities | Centre.com.pk",
    description: "AI-powered security tools for professionals. Password generators, encryption tools, hash generators, security analyzers and more with enterprise-grade protection.",
    type: "website",
    url: "https://www.centre.com.pk/tools/security-tools",
    siteName: "Centre.com.pk",
    images: [
      {
        url: "/og-security-tools.png",
        width: 1200,
        height: 630,
        alt: "Centre.com.pk - Professional Security Tools",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Professional Security Tools - Advanced Security Utilities | Centre.com.pk",
    description: "AI-powered security tools for professionals. Password generators, encryption tools, hash generators, security analyzers and more with enterprise-grade protection.",
    images: ["/og-security-tools.png"],
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
    canonical: "https://www.centre.com.pk/tools/security-tools",
  },
  
  verification: {
    google: "verification_token",
    yandex: "verification_token",
    yahoo: "verification_token",
  },
  
  category: "security",
};