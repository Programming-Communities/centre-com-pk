// lib/tools/seoAutoGenerator.ts
import { ToolInput } from './toolGenerator';

export interface GeneratedSEO {
  title: string;
  description: string;
  keywords: string[];
  faqs: Array<{ question: string; answer: string }>;
  slug: string;
  canonicalUrl: string;
}

export function generateSEO(input: ToolInput): GeneratedSEO {
  const { name, category, description } = input;
  const slug = input.slug || slugify(name);

  return {
    title: generateTitle(name),
    description: generateDesc(name, category, description),
    keywords: generateKeywords(name, category),
    faqs: generateFAQs(name),
    slug,
    canonicalUrl: `/${slug}`,
  };
}

function generateTitle(name: string): string {
  const base = `${name} - Free Online Tool`;
  if (base.length <= 60) return base;
  return name.substring(0, 57) + '...';
}

function generateDesc(name: string, category: string, userDesc?: string): string {
  if (userDesc && userDesc.length >= 140) return userDesc.substring(0, 160);
  return `Free online ${name.toLowerCase()} tool. Easy to use, no registration required. Works on all devices including mobile.`;
}

function generateKeywords(name: string, category: string): string[] {
  const l = name.toLowerCase();
  return [
    l, `${l} online`, `free ${l}`, `${l} tool`,
    `online ${l}`, `best ${l}`, `${category} tool`,
    `free ${category}`, `${l} 2026`,
  ];
}

function generateFAQs(name: string): Array<{ question: string; answer: string }> {
  const l = name.toLowerCase();
  return [
    { question: `Is ${l} free?`, answer: `Yes, 100% free with no registration required.` },
    { question: `How to use ${name}?`, answer: `Simply enter your input and click the button.` },
    { question: `Is my data safe?`, answer: `Yes, all processing happens in your browser.` },
    { question: `Does ${name} work on mobile?`, answer: `Yes, fully responsive on all devices.` },
  ];
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim();
}