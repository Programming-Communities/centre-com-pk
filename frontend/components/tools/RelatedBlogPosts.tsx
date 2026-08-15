"use client";

export default function RelatedBlogPosts({ toolSlug, lang }: { toolSlug: string; lang: string }) {
  // ✅ DEPRECATED: ToolBlogGuide now handles blog content display on tool pages.
  // This prevents duplicate "Related Guides & Articles" cards.
  // All individual tool files still import this component, so we return null
  // instead of removing imports from 50+ files.
  return null;
}