// lib/seo/generateFAQs.ts
import { FAQ } from './types';
import { TOOL_SEO_DATA } from './toolSeoData';
import { SITE_URL } from './constants';

export function getToolFAQs(toolSlug: string): FAQ[] {
  return TOOL_SEO_DATA[toolSlug]?.faqs || [];
}

export function generateFAQJsonLd(faqs: FAQ[], toolTitle: string, toolUrl: string) {
  if (faqs.length === 0) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateFAQSchema(faqs: FAQ[], toolSlug: string, category: string) {
  if (faqs.length === 0) return '';
  
  const toolData = TOOL_SEO_DATA[toolSlug];
  const toolUrl = `${SITE_URL}/tools/${category}/${toolSlug}`;
  
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq, index) => ({
      '@type': 'Question',
      position: index + 1,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  
  return JSON.stringify(faqSchema);
}

export function generateToolFAQsHTML(faqs: FAQ[]): string {
  if (faqs.length === 0) return '';
  
  let html = '<div class="faq-section"><h2>Frequently Asked Questions</h2>';
  
  faqs.forEach((faq, index) => {
    html += `
      <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <h3 class="faq-question" itemprop="name">${faq.question}</h3>
        <div class="faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <p itemprop="text">${faq.answer}</p>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  return html;
}