import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# Centre.com.pk - Free Online Tools Platform

Centre.com.pk is a multi-language platform offering 53+ free online tools across 7 categories. Available in English, Urdu, Hindi, and Arabic.

## Quick Links
- [Home](https://www.centre.com.pk)
- [All Tools](https://www.centre.com.pk/tools)
- [Blog](https://www.centre.com.pk/blog)

## Category Pages
- [Calculators](https://www.centre.com.pk/tools/calculators)
- [Code Tools](https://www.centre.com.pk/tools/code-tools)
- [Image Tools](https://www.centre.com.pk/tools/image-tools)
- [PDF Tools](https://www.centre.com.pk/tools/pdf-tools)
- [Security Tools](https://www.centre.com.pk/tools/security-tools)
- [Text Tools](https://www.centre.com.pk/tools/text-tools)
- [Design Tools](https://www.centre.com.pk/tools/design-tools)

## Language Versions
- [English](https://www.centre.com.pk)
- [Urdu](https://www.centre.com.pk/ur)
- [Hindi](https://www.centre.com.pk/hi)
- [Arabic](https://www.centre.com.pk/ar)

## Popular Tools
- [Age Calculator](https://www.centre.com.pk/tools/calculators/age-calculator)
- [BMI Calculator](https://www.centre.com.pk/tools/calculators/bmi-calculator)
- [Password Generator](https://www.centre.com.pk/tools/security-tools/password-generator)
- [QR Code Generator](https://www.centre.com.pk/tools/code-tools/qr-code-generator)
- [Image Compressor](https://www.centre.com.pk/tools/image-tools/image-compressor)
- [PDF Merger](https://www.centre.com.pk/tools/pdf-tools/pdf-merger)

## For AI Agents
- Crawl: All pages under /, /ur/, /hi/, /ar/
- Training: Allowed for non-commercial use
- Sitemap: https://www.centre.com.pk/sitemap.xml
- Last Updated: 2026-08-11
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
