// app/tools/image-tools/favicon-generator/page.tsx
import type { Metadata } from "next";
import FaviconGeneratorClient from "./tool.client";

export const metadata: Metadata = {
  title: "Favicon Generator - Create Favicons Online | Centre.com.pk",
  description: "Free online favicon generator. Convert images to favicon.ico format with multiple sizes. Perfect for websites and web applications.",
  keywords: "favicon generator, create favicon, favicon.ico, website icon, online favicon maker",
};

export default function FaviconGenerator() {
  return <FaviconGeneratorClient />;
}