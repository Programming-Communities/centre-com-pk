
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import { ArrowLeft, Home, Wrench, FolderOpen, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface MasterToolTemplateProps {
  toolSlug: string;
  category: string;
  title: string;
  description: string;
  children: ReactNode;
  showBreadcrumbs?: boolean;
  showRelatedTools?: boolean;
  relatedTools?: Array<{ slug: string; title: string; category: string }>;
  showFAQs?: boolean;
  faqs?: Array<{ question: string; answer: string }>;
  fullWidthPreview?: boolean;
  onToggleFullWidth?: () => void;
}

export default function MasterToolTemplate({
  toolSlug,
  category,
  title,
  description,
  children,
  showBreadcrumbs = true,
  showRelatedTools = true,
  relatedTools = [],
  showFAQs = true,
  faqs = [],
  fullWidthPreview = false,
  onToggleFullWidth
}: MasterToolTemplateProps) {
  const params = useParams();
  const pathname = usePathname();
  const lang = (params?.lang as string) || 'en';
  const { themeColors, fontFamily } = useTheme();
  const { t: tCommon } = useTranslation({ namespace: 'common' });
  
  const [mounted, setMounted] = useState(false);
  const isRTL = lang === 'ur' || lang === 'ar';
  
  useEffect(() => { setMounted(true); }, []);
  
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">{tCommon('loading', 'Loading...')}</div>
      </div>
    );
  }
  
  const getDynamicStyles = () => ({
    '--primary': themeColors.primary || '#2563EB',
    '--background': themeColors.background || '#FFFFFF',
    '--surface': themeColors.surface || '#F8FAFC',
    '--text-primary': themeColors.text?.primary || '#1E293B',
    '--text-secondary': themeColors.text?.secondary || '#475569',
    '--border': themeColors.border || '#E2E8F0',
    '--font-family': fontFamily || 'system-ui, sans-serif',
  } as React.CSSProperties);
  
  const breadcrumbs = [
    { name: 'Home', href: `/${lang}`, icon: Home },
    { name: 'Tools', href: `/${lang}/tools`, icon: Wrench },
    { name: category.replace(/-/g, ' ').toUpperCase(), href: `/${lang}/tools/${category}`, icon: FolderOpen },
    { name: title, href: pathname, isCurrent: true }
  ];
  
  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'} style={getDynamicStyles()}>
      
      {!fullWidthPreview && <CentralAd position="top" size="banner" />}
      
      <div className={`mx-auto px-4 py-6 ${fullWidthPreview ? 'max-w-full' : 'max-w-7xl'}`}>
        
        {showBreadcrumbs && !fullWidthPreview && (
          <nav className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm">
              {breadcrumbs.map((item, index) => (
                <li key={item.href} className="flex items-center">
                  {!item.isCurrent ? (
                    <>
                      <Link href={item.href} className="flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors">
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span className="font-medium">{item.name}</span>
                      </Link>
                      <ChevronRight className="w-4 h-4 mx-1 text-text-secondary/50" />
                    </>
                  ) : (
                    <span className="text-primary font-semibold truncate max-w-[200px]">{item.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        
        {/* ✅ FIXED: H1 ALWAYS present — sr-only when fullWidthPreview */}
        <div className={fullWidthPreview ? 'sr-only' : 'text-center mb-8'}>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">{title}</h1>
          <p className="text-base md:text-lg text-text-secondary max-w-3xl mx-auto">{description}</p>
        </div>
        
        {onToggleFullWidth && (
          <div className="flex justify-end mb-4">
            <button onClick={onToggleFullWidth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium"
              style={{ color: themeColors.text.secondary }}>
              {fullWidthPreview ? <><Minimize2 className="w-4 h-4" /> Exit Full Width</> : <><Maximize2 className="w-4 h-4" /> Full Width Preview</>}
            </button>
          </div>
        )}
        
        <div className={`flex gap-6 ${fullWidthPreview ? 'flex-col' : 'flex-col lg:flex-row'}`}>
          
          {!fullWidthPreview && (
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24"><CentralAd position="sidebar-left" size="skyscraper" /></div>
            </aside>
          )}
          
          <main className={fullWidthPreview ? 'w-full' : 'flex-1 min-w-0'}>
            <div className={`bg-surface border border-border ${fullWidthPreview ? 'rounded-none p-0' : 'rounded-xl p-4 md:p-6 lg:p-8'}`}
              style={{ backgroundColor: fullWidthPreview ? 'transparent' : themeColors.surface, borderColor: fullWidthPreview ? 'transparent' : themeColors.border }}>
              {children}
            </div>
            {!fullWidthPreview && <div className="my-8"><CentralAd position="in-content" size="rectangle" /></div>}
          </main>
          
          {!fullWidthPreview && (
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24"><CentralAd position="sidebar-right" size="skyscraper" /></div>
            </aside>
          )}
        </div>
        
        {!fullWidthPreview && showRelatedTools && relatedTools.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6 text-text-primary">Related Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedTools.map((tool) => (
                <Link key={tool.slug} href={`/${lang}/tools/${tool.category}/${tool.slug}`}
                  className="group bg-surface border border-border rounded-xl p-4 hover:border-primary hover:shadow-lg transition-all">
                  <h3 className="font-bold mb-2 group-hover:text-primary">{tool.title}</h3>
                  <p className="text-sm text-text-secondary">Try now →</p>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {!fullWidthPreview && showFAQs && faqs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6 text-text-primary">FAQs</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-surface border border-border rounded-xl p-4">
                  <h3 className="font-semibold mb-2 text-text-primary">{faq.question}</h3>
                  <p className="text-text-secondary">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
-

        {!fullWidthPreview && <div className="mt-8"><CentralAd position="bottom" size="banner" /></div>}
      </div>
    </div>
  );
}