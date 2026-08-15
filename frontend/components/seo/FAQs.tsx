'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { FAQ } from '@/lib/seo/types';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Search, ChevronDown, HelpCircle, MessageCircle, Star } from 'lucide-react';
import Link from 'next/link';

interface FAQsProps {
  faqs?: FAQ[];
  title?: string;
  subtitle?: string;
  className?: string;
  defaultOpen?: number | null;
  showSchema?: boolean;
  enableSearch?: boolean;
}

export default function FAQs({
  faqs = [],
  title: customTitle,
  subtitle: customSubtitle,
  className = '',
  defaultOpen = null,
  showSchema = true,
  enableSearch = true,
}: FAQsProps) {
  const params = useParams();
  const lang = params?.lang as string || 'en';
  const { t } = useTranslation({ namespace: 'common' });
  const { themeColors } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const [searchQuery, setSearchQuery] = useState('');
  
  const titleText = customTitle || t('frequently_asked_questions', 'Frequently Asked Questions');
  const subtitleText = customSubtitle || t('find_answers', 'Find answers to common questions about our tools');
  
  const filteredFaqs = useMemo(() => {
    if (!faqs || faqs.length === 0) return [];
    if (!searchQuery.trim()) return faqs;
    
    const query = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [faqs, searchQuery]);
  
  if (!faqs || faqs.length === 0) {
    return null;
  }
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const hasResults = filteredFaqs.length > 0;
  
  return (
    <section className={`faq-section py-12 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <div 
              className="rounded-full p-3"
              style={{ backgroundColor: `${themeColors.primary}15` }}
            >
              <HelpCircle className="w-6 h-6" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: themeColors.text.primary }}
          >
            {titleText}
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: themeColors.text.secondary }}
          >
            {subtitleText}
          </p>
        </div>
        
        {enableSearch && faqs.length > 5 && (
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5" style={{ color: themeColors.text.secondary }} />
              </div>
              <input
                type="text"
                placeholder={t('search_questions', 'Search questions...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                  color: themeColors.text.primary,
                  '--tw-ring-color': themeColors.primary,
                } as React.CSSProperties}
              />
            </div>
          </div>
        )}
        
        {searchQuery && (
          <div className="text-center mb-6">
            <p className="text-sm" style={{ color: themeColors.text.secondary }}>
              {t('found_results', 'Found {count} questions')}
              {!hasResults && ` — ${t('try_different_search', 'try a different search term')}`}
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          {hasResults ? (
            filteredFaqs.map((faq: FAQ, index: number) => {
              const originalIndex = faqs.findIndex(f => f.question === faq.question);
              const isOpen = openIndex === originalIndex;
              
              return (
                <div
                  key={originalIndex}
                  className="rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                  style={{ 
                    border: `1px solid ${themeColors.border}`,
                    backgroundColor: themeColors.surface,
                  }}
                >
                  <button
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left transition-all duration-200 hover:bg-opacity-50 group"
                    style={{ 
                      backgroundColor: 'transparent',
                      color: themeColors.text.primary
                    }}
                    onClick={() => toggleFAQ(originalIndex)}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-3 pr-4">
                      <div 
                        className="shrink-0 mt-1 transition-transform duration-200"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        <ChevronDown className="w-5 h-5" style={{ color: themeColors.primary }} />
                      </div>
                      <h3 
                        className="text-base md:text-lg font-semibold leading-relaxed"
                        style={{ color: themeColors.text.primary }}
                      >
                        {faq.question}
                      </h3>
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="p-5 md:p-6 pt-0 border-t" style={{ borderColor: themeColors.border }}>
                      <p 
                        className="text-text-secondary leading-relaxed"
                        style={{ color: themeColors.text.secondary }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: themeColors.text.secondary }} />
              <p className="text-lg" style={{ color: themeColors.text.secondary }}>
                {t('no_matching_questions', 'No matching questions found.')}
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: `${themeColors.primary}10`,
                  color: themeColors.primary,
                }}
              >
                {t('clear_search', 'Clear Search')}
              </button>
            </div>
          )}
        </div>
        
        <div 
          className="mt-12 p-6 rounded-xl text-center"
          style={{
            backgroundColor: `${themeColors.primary}5`,
            border: `1px solid ${themeColors.primary}20`,
          }}
        >
          <div className="inline-flex items-center justify-center mb-3">
            <Star className="w-5 h-5 mr-2" style={{ color: themeColors.primary }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.text.primary }}>
            {t('still_have_questions', 'Still have questions?')}
          </h3>
          <p className="text-sm mb-4" style={{ color: themeColors.text.secondary }}>
            {t('cant_find', 'Can\'t find what you\'re looking for? Our support team is here to help.')}
          </p>
          <Link
            href={`/${lang}/contact`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: themeColors.primary,
              color: themeColors.text.accent,
            }}
          >
            <MessageCircle className="w-4 h-4" />
            {t('contact_support', 'Contact Support')}
          </Link>
        </div>
      </div>
      
      {showSchema && faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq: FAQ, index: number) => ({
                '@type': 'Question',
                position: index + 1,
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}
    </section>
  );
}