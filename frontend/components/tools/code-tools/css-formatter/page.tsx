// app/tools/code-tools/css-formatter/page.tsx
import type { Metadata } from "next";
import CssFormatterClient from "./tool.client";

export const metadata: Metadata = {
  title: "CSS Formatter - Beautify CSS Code Online | Centre.com.pk",
  description: "Free online CSS formatter and beautifier. Format messy CSS code with proper indentation, organize properties, and improve readability.",
  keywords: "css formatter, css beautifier, format css, css prettifier, code formatter",
};

export default function CssFormatter() {
  return <CssFormatterClient />;
}