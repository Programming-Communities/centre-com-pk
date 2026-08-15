// lib/performance/bundle-optimizer.ts
// ✅ FIXED: Corrected ColorPicker path, removed JSX from loading

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// ========== LAYOUT COMPONENTS ==========
export const DynamicFooter = dynamic(
  () => import('@/components/layout/Footer/Footer'),
  { 
    loading: () => null,
    ssr: false 
  }
);

export const DynamicMobileDashboard = dynamic(
  () => import('@/components/layout/MobileDashboard/MobileDashboard'),
  { ssr: false }
);

// ========== SEO COMPONENTS ==========
export const DynamicShareButtons = dynamic(
  () => import('@/components/seo/ShareButtons'),
  { 
    loading: () => null,
    ssr: false 
  }
);

export const DynamicFAQs = dynamic(
  () => import('@/components/seo/FAQs'),
  { ssr: false }
);

// ========== AD COMPONENTS ==========
export const DynamicAdRail = dynamic(
  () => import('@/components/tools/ResponsiveToolWrapper/AdRail'),
  { 
    loading: () => null,
    ssr: false 
  }
);

export const DynamicAdBanner = dynamic(
  () => import('@/components/tools/ResponsiveToolWrapper/AdBanner'),
  { ssr: false }
);

// ========== TOOL COMPONENTS ==========
export const loadCalculatorTools = () => ({
  AgeCalculator: dynamic(() => import('@/components/tools/calculators/age-calculator/tool.client')),
  BMICalculator: dynamic(() => import('@/components/tools/calculators/bmi-calculator/tool.client')),
  LoanCalculator: dynamic(() => import('@/components/tools/calculators/loan-calculator/tool.client')),
  PercentageCalculator: dynamic(() => import('@/components/tools/calculators/percentage-calculator/tool.client')),
  CurrencyConverter: dynamic(() => import('@/components/tools/calculators/currency-converter/tool.client')),
  DateCalculator: dynamic(() => import('@/components/tools/calculators/date-calculator/tool.client')),
  TipCalculator: dynamic(() => import('@/components/tools/calculators/tip-calculator/tool.client')),
  CompoundInterest: dynamic(() => import('@/components/tools/calculators/compound-interest/tool.client')),
  GPACalculator: dynamic(() => import('@/components/tools/calculators/gpa-calculator/tool.client')),
  UnitConverter: dynamic(() => import('@/components/tools/calculators/unit-converter/tool.client')),
});

export const loadImageTools = () => ({
  ImageCompressor: dynamic(() => import('@/components/tools/image-tools/image-compressor/tool.client')),
  ImageConverter: dynamic(() => import('@/components/tools/image-tools/image-converter/tool.client')),
  ImageResizer: dynamic(() => import('@/components/tools/image-tools/image-resizer/tool.client')),
  ImageCropper: dynamic(() => import('@/components/tools/image-tools/image-cropper/tool.client')),
  BackgroundRemover: dynamic(() => import('@/components/tools/image-tools/background-remover/tool.client')),
  ImageFilters: dynamic(() => import('@/components/tools/image-tools/image-filters/tool.client')),
  ImageRotator: dynamic(() => import('@/components/tools/image-tools/image-rotator/tool.client')),
  MemeGenerator: dynamic(() => import('@/components/tools/image-tools/meme-generator/tool.client')),
  PhotoCollage: dynamic(() => import('@/components/tools/image-tools/photo-collage/tool.client')),
  FaviconGenerator: dynamic(() => import('@/components/tools/image-tools/favicon-generator/tool.client')),
});

export const loadPDFTools = () => ({
  PDFMerger: dynamic(() => import('@/components/tools/pdf-tools/pdf-merger/tool.client')),
  PDFCompressor: dynamic(() => import('@/components/tools/pdf-tools/pdf-compressor/tool.client')),
  PDFSplitter: dynamic(() => import('@/components/tools/pdf-tools/pdf-splitter/tool.client')),
  PDFToWord: dynamic(() => import('@/components/tools/pdf-tools/pdf-to-word/tool.client')),
});

export const loadCodeTools = () => ({
  JSONFormatter: dynamic(() => import('@/components/tools/code-tools/json-formatter/tool.client')),
  HTMLFormatter: dynamic(() => import('@/components/tools/code-tools/html-formatter/tool.client')),
  CSSFormatter: dynamic(() => import('@/components/tools/code-tools/css-formatter/tool.client')),
  JavaScriptFormatter: dynamic(() => import('@/components/tools/code-tools/javascript-formatter/tool.client')),
  XMLFormatter: dynamic(() => import('@/components/tools/code-tools/xml-formatter/tool.client')),
  Base64Encoder: dynamic(() => import('@/components/tools/code-tools/base64-encoder/tool.client')),
  URLEncoder: dynamic(() => import('@/components/tools/code-tools/url-encoder/tool.client')),
  QRCodeGenerator: dynamic(() => import('@/components/tools/code-tools/qr-code-generator/tool.client')),
});

export const loadSecurityTools = () => ({
  PasswordGenerator: dynamic(() => import('@/components/tools/security-tools/password-generator/tool.client')),
  HashGenerator: dynamic(() => import('@/components/tools/security-tools/hash-generator/tool.client')),
  SSLSChecker: dynamic(() => import('@/components/tools/security-tools/ssl-checker/tool.client')),
  TwoFactorAuth: dynamic(() => import('@/components/tools/security-tools/two-factor-auth/tool.client')),
  EncryptionTools: dynamic(() => import('@/components/tools/security-tools/encryption-tools/tool.client')),
  SecurityAnalyzer: dynamic(() => import('@/components/tools/security-tools/security-analyzer/tool.client')),
  APISecurity: dynamic(() => import('@/components/tools/security-tools/api-security/tool.client')),
  DataMasking: dynamic(() => import('@/components/tools/security-tools/data-masking/tool.client')),
  FirewallTester: dynamic(() => import('@/components/tools/security-tools/firewall-tester/tool.client')),
  SecureFileWipe: dynamic(() => import('@/components/tools/security-tools/secure-file-wipe/tool.client')),
});

export const loadTextTools = () => ({
  WordCounter: dynamic(() => import('@/components/tools/text-tools/word-counter/tool.client')),
  CharacterCounter: dynamic(() => import('@/components/tools/text-tools/character-counter/tool.client')),
  CaseConverter: dynamic(() => import('@/components/tools/text-tools/case-converter/tool.client')),
  LoremIpsum: dynamic(() => import('@/components/tools/text-tools/lorem-ipsum/tool.client')),
  MarkdownEditor: dynamic(() => import('@/components/tools/text-tools/markdown-editor/tool.client')),
  RegexTester: dynamic(() => import('@/components/tools/text-tools/regex-tester/tool.client')),
  TextDiff: dynamic(() => import('@/components/tools/text-tools/text-diff/tool.client')),
  TextExtractor: dynamic(() => import('@/components/tools/text-tools/text-extractor/tool.client')),
  UUIDGenerator: dynamic(() => import('@/components/tools/text-tools/uuid-generator/tool.client')),
});

export const loadDesignTools = () => ({
  // ✅ FIXED: Corrected path from code-tools/color-picker/color-picker to design-tools/color-picker
  ColorPicker: dynamic(() => import('@/components/tools/design-tools/color-picker/tool.client')),
});

// ========== PRELOAD STRATEGY ==========
export const preloadCriticalPaths = [
  '/tools/calculators',
  '/tools/image-tools',
  '/tools/pdf-tools',
];

export function preloadToolCategory(category: string) {
  switch (category) {
    case 'calculators':
      import('@/components/tools/calculators/age-calculator/tool.client');
      break;
    case 'image-tools':
      import('@/components/tools/image-tools/image-compressor/tool.client');
      break;
    case 'pdf-tools':
      import('@/components/tools/pdf-tools/pdf-merger/tool.client');
      break;
    case 'code-tools':
      import('@/components/tools/code-tools/json-formatter/tool.client');
      break;
    case 'security-tools':
      import('@/components/tools/security-tools/password-generator/tool.client');
      break;
  }
}

// ========== REQUEST BATCHING ==========
const requestQueue: (() => void)[] = [];
let isProcessing = false;

export function batchRequest(fn: () => void) {
  requestQueue.push(fn);
  
  if (!isProcessing) {
    isProcessing = true;
    setTimeout(() => {
      while (requestQueue.length > 0) {
        const request = requestQueue.shift();
        request?.();
      }
      isProcessing = false;
    }, 100);
  }
}

// ========== BUNDLE METRICS ==========
export const bundleMetrics = {
  critical: '< 50KB',
  calculators: '< 30KB',
  imageTools: '< 45KB',
  pdfTools: '< 40KB',
  codeTools: '< 35KB',
  securityTools: '< 38KB',
  textTools: '< 32KB',
  designTools: '< 25KB',
  total: '< 165KB',
};