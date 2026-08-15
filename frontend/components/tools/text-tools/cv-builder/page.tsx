import type { Metadata } from "next";
import CVBuilderClient from "./tool.client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Free Online CV Builder — Create Professional Resumes | Centre.com.pk",
    description: "Build stunning, ATS-optimized resumes with 15+ templates, AI suggestions, photo upload, certificate management, and free PDF export. No watermarks, no sign-up required.",
    keywords: "cv builder, resume builder, free cv maker, online resume, create cv, professional resume builder, cv maker free, ats resume, cv template, resume template",
    openGraph: {
      title: "Free Online CV Builder | Centre.com.pk",
      description: "15+ templates, AI-powered, no watermarks, free PDF export",
      type: "website",
      images: [{ url: "/og-images/cv-builder.png", width: 1200, height: 630 }],
    },
    robots: { index: true, follow: true },
  };
}

export default function CVBuilderPage() {
  return <CVBuilderClient />;
}

export const runtime = 'edge';
