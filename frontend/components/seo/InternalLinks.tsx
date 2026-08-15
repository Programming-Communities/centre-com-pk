// components/seo/InternalLinks.tsx — FIXED v2.0
// ✅ FIXED: Added double-prefix safety in getLocalizedUrl

'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { InternalLinksProps, InternalLink } from './types';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { ArrowRight } from 'lucide-react';

export default function InternalLinks({
  links,
  title,
  description,
  maxLinks = 6,
  showCategory = true,
  className = '',
  columns = 3,
}: InternalLinksProps) {
  const params = useParams();
  const lang = params?.lang as string || 'en';
  const { t } = useTranslation({ namespace: 'common' });
  const { themeColors } = useTheme();
  
  const titleText = title || t('internal_links.title', 'Related Tools You Might Like');
  const descriptionText = description || t('internal_links.description', 'Explore these related tools to enhance your productivity');
  
  if (!links || links.length === 0) {
    return null;
  }
  
  const displayedLinks = links.slice(0, maxLinks);
  
  const gridClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };
  
  // ✅ FIXED: Added double-prefix protection
  const getLocalizedUrl = (url: string): string => {
    // Already has correct language prefix
    if (url.match(/^\/(en|ur|ar|hi)\//)) {
      return url;
    }
    // Fix accidental double prefix like /tools
    const doublePrefixMatch = url.match(/^\/(en|ur|ar|hi)\/(en|ur|ar|hi)\/(.*)/);
    if (doublePrefixMatch) {
      return `/${doublePrefixMatch[1]}/${doublePrefixMatch[3]}`;
    }
    // Add current language prefix
    if (url.startsWith('/')) {
      return `/${lang}${url}`;
    }
    return url;
  };
  
  return (
    <section className={`internal-links-section ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 
            className="text-2xl md:text-3xl font-bold mb-3"
            style={{ color: themeColors.text.primary }}
          >
            {titleText}
          </h2>
          {descriptionText && (
            <p 
              className="max-w-2xl mx-auto"
              style={{ color: themeColors.text.secondary }}
            >
              {descriptionText}
            </p>
          )}
        </div>
        
        <div className={`grid ${gridClasses[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
          {displayedLinks.map((link: InternalLink, index: number) => (
            <Link
              key={index}
              href={getLocalizedUrl(link.url)}
              className="group rounded-xl p-5 hover:shadow-lg transition-all duration-300 block"
              style={{ 
                backgroundColor: themeColors.surface,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              <div className="flex flex-col h-full">
                <div className="grow">
                  <h3 
                    className="text-lg font-semibold mb-2 group-hover:opacity-80 transition-colors"
                    style={{ color: themeColors.text.primary }}
                  >
                    {link.title}
                  </h3>
                  <p 
                    className="text-sm mb-3 line-clamp-2"
                    style={{ color: themeColors.text.secondary }}
                  >
                    {link.description}
                  </p>
                </div>
                
                <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${themeColors.border}` }}>
                  {showCategory && link.category && (
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${themeColors.primary}10`,
                        color: themeColors.primary
                      }}
                    >
                      {link.category.replace('-', ' ')}
                    </span>
                  )}
                  <span className="text-primary group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {links.length > maxLinks && (
          <div className="text-center mt-10">
            <Link
              href={`/${lang}/tools`}
              className="inline-flex items-center px-6 py-3 border text-base font-medium rounded-md hover:opacity-90 transition-colors"
              style={{ 
                backgroundColor: themeColors.primary,
                color: themeColors.text.accent,
                borderColor: themeColors.primary
              }}
            >
              {t('internal_links.view_all', 'View All Tools')}
              <ArrowRight className="ml-2 -mr-1 w-5 h-5" style={{ color: themeColors.text.accent }} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}