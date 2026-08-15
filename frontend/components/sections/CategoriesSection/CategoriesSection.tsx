// components/sections/CategoriesSection/CategoriesSection.tsx
"use client";

import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';

interface Category {
  title: string;
  description: string;
  icon: string;
  count: number;
  color: string;
  slug?: string;
}

interface CategoriesSectionProps {
  categories: Category[];
  title?: string;
  description?: string;
  lang: string;
}

export default function CategoriesSection({ 
  categories,
  title,
  description,
  lang
}: CategoriesSectionProps) {
  const { themeColors } = useTheme();
  const { t } = useTranslation({ namespace: 'common' });

  const displayTitle = title || t('categories.title', 'Browse by Category');
  const displayDescription = description || t('categories.description', 'Explore tools by categories');
  const viewAllText = t('action.view_all_categories', 'View All Categories');
  const exploreText = t('action.explore', 'Explore Tools →');

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  return (
    <section className="py-16" style={{ backgroundColor: themeColors.background }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: themeColors.text.primary }}>
            {displayTitle}
          </h2>
          <p className="text-lg max-w-2xl mx-auto"
             style={{ color: themeColors.text.secondary }}>
            {displayDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={index}
              href={`/${lang}/tools/${category.slug || category.title.toLowerCase().replace(/ /g, '-')}`}
              className="group block"
            >
              <div className="h-full rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                   style={{
                     backgroundColor: themeColors.surface,
                     border: `1px solid ${themeColors.border}`,
                   }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colorClasses[category.color] || colorClasses.blue} text-white`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold"
                        style={{ color: themeColors.text.primary }}>
                      {category.title}
                    </h3>
                  </div>
                  <div className="px-3 py-1 rounded-full text-sm font-semibold"
                       style={{
                         backgroundColor: themeColors.primary + '20',
                         color: themeColors.primary,
                       }}>
                    {category.count}+
                  </div>
                </div>

                <p className="mb-6" style={{ color: themeColors.text.secondary }}>
                  {category.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t"
                     style={{ borderColor: themeColors.border }}>
                  <span className="text-sm font-medium"
                        style={{ color: themeColors.primary }}>
                    {exploreText}
                  </span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-2"
                       style={{ backgroundColor: themeColors.primary, color: themeColors.surface }}>
                    →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href={`/${lang}/categories`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: themeColors.primary,
              color: themeColors.surface,
            }}
          >
            {viewAllText}
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}