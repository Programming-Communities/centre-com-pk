// components/sections/InfiniteToolsScroll/InfiniteToolsScroll.tsx
"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { getAllTools, getToolIcon } from '@/lib/data/tools';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';

const ITEMS_PER_PAGE = 12;
const DEBOUNCE_DELAY = 300;

interface InfiniteToolsScrollProps {
  lang: string;
}

// ⚡ EXCLUDE: Remove popular tools (already shown above)
const POPULAR_SLUGS = ["age-calculator","bmi-calculator","password-generator","json-formatter","image-compressor","qr-code-generator"];

// ✅ HARD-CODED LANGUAGE FALLBACKS
const getButtonFallbacks = (lang: string) => {
  const fallbacks: Record<string, any> = {
    ur: { free: 'مفت', use: 'استعمال کریں' },
    ar: { free: 'مجاني', use: 'استخدام' },
    hi: { free: 'मुफ्त', use: 'उपयोग करें' },
    en: { free: 'Free', use: 'Use' }
  };
  return fallbacks[lang] || fallbacks.en;
};

export default function InfiniteToolsScroll({ lang }: InfiniteToolsScrollProps) {
  const { themeColors } = useTheme();
  const { t } = useTranslation({ namespace: 'common' });
  
  const [tools, setTools] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalTools, setTotalTools] = useState<number>(0);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [cachedTools, setCachedTools] = useState<any[]>([]);

  const buttonTexts = getButtonFallbacks(lang);

  useEffect(() => {
    const loadAllTools = async () => {
      try {
        const allTools = await getAllTools(lang);
        
        // ⚡ FILTER: Exclude 6 popular tools (shown in PopularToolsSection)
        const filteredTools = allTools.filter((tool: any) => !POPULAR_SLUGS.includes(tool.slug));  
        setCachedTools(filteredTools);
        setTotalTools(filteredTools.length);
        
        const firstPageTools = filteredTools.slice(0, ITEMS_PER_PAGE);
        setTools(firstPageTools);
        
        if (firstPageTools.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error loading tools:', error);
      }
    };
    
    loadAllTools();
  }, [lang]);

  const loadMoreTools = useCallback(() => {
    if (loading || !hasMore || cachedTools.length === 0) return;
    
    setLoading(true);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      const startIndex = page * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newTools = cachedTools.slice(startIndex, endIndex);
      
      if (newTools.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }
      
      const existingSlugs = new Set(tools.map(t => t.slug));
      const uniqueNewTools = newTools.filter(tool => !existingSlugs.has(tool.slug));
      
      if (uniqueNewTools.length > 0) {
        setTools(prev => [...prev, ...uniqueNewTools]);
        setPage(prev => prev + 1);
      }
      
      if (endIndex >= cachedTools.length) {
        setHasMore(false);
      }
      
      setLoading(false);
    }, DEBOUNCE_DELAY);
  }, [loading, hasMore, page, tools, cachedTools]);

  const lastToolRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || !hasMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMoreTools();
      }
    }, {
      rootMargin: '100px',
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMoreTools]);

  const getCategoryName = (category: string): string => {
    const key = category.replace(/-/g, '_');
    const translated = t(`category_list.${key}`);
    if (translated !== `category_list.${key}`) return translated;
    
    const translated2 = t(`category_list.${category}`);
    if (translated2 !== `category_list.${category}`) return translated2;
    
    return category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const showingText = t('showing_results', 'Showing {{current}} of {{total}} tools')
    .replace('{{current}}', tools.length.toString())
    .replace('{{total}}', totalTools.toString());

  // ✅ FIXED: Button texts with fallbacks
  const freeText = t('tool.free') !== 'tool.free' ? t('tool.free') : buttonTexts.free;
  const useText = t('action.use') !== 'action.use' ? t('action.use') : buttonTexts.use;

  const toolCards = useMemo(() => {
    return tools.map((tool, index) => {
      const isLast = index === tools.length - 1;
      const key = `${tool.slug}-${index}`;
      const categoryName = getCategoryName(tool.category);
      
      const card = (
        <Link
          href={`/${lang}/tools/${tool.category}/${tool.slug}`}
          className="group block bg-surface rounded-xl p-5 transition-all duration-300 
                     hover:scale-[1.02] border border-border hover:border-primary
                     shadow-theme hover:shadow-theme-medium"
          prefetch={false}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{getToolIcon(tool.category)}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                {categoryName}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-1">
              {tool.title}
            </h3>
            <p className="text-sm text-text-secondary mb-3 line-clamp-2 flex-1">
              {tool.description || t('tool.default_description', 'Free online tool')}
            </p>
            {/* ✅ FIXED: Button with fallbacks */}
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-border/50">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                {freeText}
              </span>
              <span className="text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                {useText} →
              </span>
            </div>
          </div>
        </Link>
      );
      
      if (isLast) {
        return (
          <div key={key} ref={lastToolRef} className="tool-card-wrapper">
            {card}
          </div>
        );
      }
      
      return (
        <div key={key} className="tool-card-wrapper">
          {card}
        </div>
      );
    });
  }, [tools, lastToolRef, lang, t, freeText, useText]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  return (
    <div className="py-8">
      <div className="text-center mb-6">
        <p className="text-sm text-text-secondary">
          {showingText}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {toolCards}
      </div>
      
      {loading && (
        <div className="flex justify-center py-8">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent" 
            style={{ borderColor: themeColors?.primary || '#3b82f6' }}
            aria-label={t('loading.more_tools', 'Loading more tools')}
          />
        </div>
      )}
      
      {!hasMore && tools.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-text-secondary">
            {t('all_tools_loaded', 'All tools loaded')} ✅
          </p>
        </div>
      )}
    </div>
  );
}