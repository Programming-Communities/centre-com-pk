// app/tools/image-tools/image-rotator/page.tsx
import type { Metadata } from "next";
import ImageRotatorClient from "./tool.client";

export const metadata: Metadata = {
  title: "Image Rotator - Rotate Images Online | Centre.com.pk",
  description: "Free online image rotator tool. Rotate your images 90°, 180°, 270° or custom angles. No registration required.",
  keywords: "rotate image, image rotator, flip image, image editor, online tool",
};

export default function ImageRotator() {
  return <ImageRotatorClient />;
}