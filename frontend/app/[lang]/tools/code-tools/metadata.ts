// code-tools/metadata.ts (should already exist, just verifying)
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Code Tools - Developer Utilities Suite | Centre.com.pk",
  description: "AI-powered code tools for developers. Format JSON, HTML, CSS, JavaScript, generate QR codes, secure passwords, encode/decode data with enterprise-grade security.",
  keywords: "code tools, developer tools, json formatter, qr code generator, password generator, base64 encoder, html formatter, css formatter, javascript formatter, xml formatter, url encoder, color picker",
  openGraph: {
    title: "Professional Code Tools - Developer Utilities Suite | Centre.com.pk",
    description: "AI-powered code tools for developers. Format JSON, HTML, CSS, JavaScript, generate QR codes, secure passwords, encode/decode data with enterprise-grade security.",
    type: "website",
    url: "https://www.centre.com.pk/tools/code-tools",
    siteName: "Centre.com.pk",
    images: [
      {
        url: "/og-code-tools.png",
        width: 1200,
        height: 630,
        alt: "Centre.com.pk - Professional Code Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Code Tools - Developer Utilities Suite | Centre.com.pk",
    description: "AI-powered code tools for developers. Format JSON, HTML, CSS, JavaScript, generate QR codes, secure passwords, encode/decode data with enterprise-grade security.",
    images: ["/og-code-tools.png"],
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
};