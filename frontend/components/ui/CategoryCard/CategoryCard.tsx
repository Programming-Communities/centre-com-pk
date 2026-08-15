// components/ui/CategoryCard/CategoryCard.tsx
"use client";

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

interface CategoryCardProps {
  title: string;
  description: string;
  count: number;
  icon: string;
  color: string;
  link: string;
  categoryType: string;
  lang: string;
}

// ✅ HARD-CODED LANGUAGE FALLBACKS
const getCategoryFallbacks = (lang: string) => {
  const fallbacks: Record<string, any> = {
    ur: {
      category: 'کیٹیگری',
      tools: 'ٹولز',
      explore: 'مزید دیکھیں →',
      categories: {
        calculators: 'کیلکولیٹرز',
        code: 'کوڈ',
        design: 'ڈیزائن',
        image: 'امیج',
        pdf: 'پی ڈی ایف',
        security: 'سیکیورٹی',
        text: 'ٹیکسٹ',
        educational: 'تعلیمی'
      }
    },
    ar: {
      category: 'الفئة',
      tools: 'أدوات',
      explore: 'استكشف →',
      categories: {
        calculators: 'الحاسبات',
        code: 'البرمجة',
        design: 'التصميم',
        image: 'الصور',
        pdf: 'PDF',
        security: 'الأمان',
        text: 'النصوص',
        educational: 'تعليمية'
      }
    },
    hi: {
      category: 'श्रेणी',
      tools: 'टूल्स',
      explore: 'एक्सप्लोर करें →',
      categories: {
        calculators: 'कैलकुलेटर',
        code: 'कोड',
        design: 'डिज़ाइन',
        image: 'इमेज',
        pdf: 'PDF',
        security: 'सुरक्षा',
        text: 'टेक्स्ट',
        educational: 'शैक्षिक'
      }
    },
    en: {
      category: 'Category',
      tools: 'Tools',
      explore: 'Explore →',
      categories: {}
    }
  };
  return fallbacks[lang] || fallbacks.en;
};

export default function CategoryCard({
  title,
  description,
  count,
  icon,
  color,
  link,
  categoryType,
  lang
}: CategoryCardProps) {

  const { t } = useTranslation({ namespace: 'common' });
  const fallbacks = getCategoryFallbacks(lang);

  // ✅ FIXED: Get translated category type with fallback
  const getCategoryTypeDisplay = (): string => {
    // Try translation first
    const translated = t(`category_list.${categoryType}`);
    if (translated !== `category_list.${categoryType}`) return translated;
    
    // Try fallback
    if (fallbacks.categories[categoryType]) {
      return fallbacks.categories[categoryType];
    }
    
    // Format properly
    return categoryType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // ✅ FIXED: Texts with fallbacks
  const categoryBadge = t('category.badge') !== 'category.badge' 
    ? t('category.badge') 
    : fallbacks.category;
    
  const toolsText = t('tools_count') !== 'tools_count' 
    ? t('tools_count') 
    : fallbacks.tools;
    
  const exploreText = t('action.explore') !== 'action.explore' 
    ? t('action.explore') 
    : fallbacks.explore;

  return (
    <Link
      href={`/${lang}${link}`}
      className="block p-6 rounded-xl transition-all duration-300 h-full border-l-6 hover:scale-[1.02] hover:shadow-theme-medium border-border bg-surface hover:bg-surface-light"
      style={{ borderLeftColor: color }}
      prefetch={false}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className="text-lg font-bold text-text-primary">{title}</h3>
            <p className="text-xs text-text-secondary/80">
              {getCategoryTypeDisplay()} {categoryBadge}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-sm font-semibold border bg-primary-20 text-primary border-primary-30">
          {count}+ {toolsText}
        </span>
      </div>
      
      <p className="text-sm mb-4 line-clamp-2 text-text-secondary">{description}</p>
      
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
          {exploreText}
        </span>
        <div className="flex space-x-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-primary/40" />
          ))}
        </div>
      </div>
    </Link>
  );
}