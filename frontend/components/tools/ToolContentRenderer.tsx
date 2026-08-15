'use client';

import { useTranslation } from '@/hooks/useTranslation';

interface ToolContentRendererProps {
  toolSlug: string;
  lang: string;
  category: string;
}

export default function ToolContentRenderer({ toolSlug, lang, category }: ToolContentRendererProps) {
  const { t } = useTranslation(lang);
  
  // Load tool content from translations
  const content = t(`tools.${category}.${toolSlug}`) || {};
  
  if (!content || Object.keys(content).length === 0) {
    return null;
  }
  
  return (
    <div className="tool-content max-w-4xl mx-auto py-8 px-4">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{content.title || toolSlug}</h1>
      
      {/* Subtitle */}
      {content.subtitle && (
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{content.subtitle}</p>
      )}
      
      {/* Introduction */}
      {content.introduction && (
        <div className="prose prose-lg dark:prose-invert mb-8">
          <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
          <div dangerouslySetInnerHTML={{ __html: content.introduction }} />
        </div>
      )}
      
      {/* How to Use */}
      {content.howToUse && (
        <div className="prose prose-lg dark:prose-invert mb-8">
          <h2 className="text-2xl font-semibold mb-3">How to Use</h2>
          <div dangerouslySetInnerHTML={{ __html: content.howToUse }} />
        </div>
      )}
      
      {/* Features */}
      {content.features && (
        <div className="prose prose-lg dark:prose-invert mb-8">
          <h2 className="text-2xl font-semibold mb-3">Features</h2>
          <div dangerouslySetInnerHTML={{ __html: content.features }} />
        </div>
      )}
      
      {/* Use Cases */}
      {content.useCases && (
        <div className="prose prose-lg dark:prose-invert mb-8">
          <h2 className="text-2xl font-semibold mb-3">Use Cases</h2>
          <div dangerouslySetInnerHTML={{ __html: content.useCases }} />
        </div>
      )}
      
      {/* FAQs */}
      {content.faqs && (
        <div className="prose prose-lg dark:prose-invert mb-8">
          <h2 className="text-2xl font-semibold mb-3">FAQs</h2>
          <div dangerouslySetInnerHTML={{ __html: content.faqs }} />
        </div>
      )}
      
      {/* Comparison */}
      {content.comparisonText && (
        <div className="prose prose-lg dark:prose-invert mb-8">
          <h2 className="text-2xl font-semibold mb-3">Comparison</h2>
          <div dangerouslySetInnerHTML={{ __html: content.comparisonText }} />
        </div>
      )}
    </div>
  );
}
