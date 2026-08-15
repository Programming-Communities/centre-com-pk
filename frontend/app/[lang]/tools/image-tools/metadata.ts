// image-tools/metadata.ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Image Tools - AI-Powered Image Processing | Centre.com.pk",
  description: "AI-powered image tools for professionals. Resize, compress, edit, enhance, convert images with quality preservation. Background removal, filters, collage maker, and more.",
  keywords: "image tools, image resizer, image compressor, background remover, image converter, image cropper, image filters, favicon generator, meme generator, photo collage, image processing",
  openGraph: {
    title: "Professional Image Tools - AI-Powered Image Processing | Centre.com.pk",
    description: "AI-powered image tools for professionals. Resize, compress, edit, enhance, convert images with quality preservation. Background removal, filters, collage maker, and more.",
    type: "website",
    url: "https://www.centre.com.pk/tools/image-tools",
    siteName: "Centre.com.pk",
    images: [
      {
        url: "/og-image-tools.png",
        width: 1200,
        height: 630,
        alt: "Centre.com.pk - Professional Image Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Image Tools - AI-Powered Image Processing | Centre.com.pk",
    description: "AI-powered image tools for professionals. Resize, compress, edit, enhance, convert images with quality preservation. Background removal, filters, collage maker, and more.",
    images: ["/og-image-tools.png"],
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
    canonical: "https://www.centre.com.pk/tools/image-tools",
  },
  verification: {
    google: "verification_token",
    yandex: "verification_token",
    yahoo: "verification_token",
  },
  category: "technology",
};