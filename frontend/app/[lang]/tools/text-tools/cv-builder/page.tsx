import type { Metadata } from "next";
import CVBuilderClient from "@/components/tools/text-tools/cv-builder/tool.client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Free Online CV Builder — Create Professional Resumes | Centre.com.pk",
    description: "Build stunning, ATS-optimized resumes with 15+ templates, AI suggestions, photo upload, certificate management, and free PDF export.",
    keywords: "cv builder, resume builder, free cv maker, online resume, create cv",
  };
}

export default function CVBuilderPage() {
  return <CVBuilderClient />;
}

