// components/sections/StatsSection1/StatsSection.tsx
"use client";

import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface StatItem {
  number: string;
  label: string;
}

interface StatsSectionProps {
  stats: StatItem[];
  variant?: 'cards' | 'minimal' | 'highlight';
}

export default function StatsSection({ 
  stats,
  variant = 'cards'
}: StatsSectionProps) {
  const { themeColors } = useTheme();

  if (variant === 'minimal') {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2"
                     style={{ color: themeColors.primary }}>
                  {stat.number}
                </div>
                <div className="text-sm md:text-base"
                     style={{ color: themeColors.text.secondary }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'highlight') {
    return (
      <section className="py-16" style={{ backgroundColor: themeColors.background }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="relative">
                  <div className="text-4xl md:text-5xl font-bold mb-2"
                       style={{ color: themeColors.primary }}>
                    {stat.number}
                  </div>
                  <div className="text-lg font-medium"
                       style={{ color: themeColors.text.secondary }}>
                    {stat.label}
                  </div>
                  {index < stats.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 w-px h-16 -translate-y-1/2"
                         style={{ backgroundColor: themeColors.border }}></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default cards variant
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="group">
              <div className="rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                   style={{
                     backgroundColor: themeColors.surface,
                     border: `1px solid ${themeColors.border}`,
                     boxShadow: `0 4px 20px ${themeColors.primary}10`,
                   }}>
                <div className="text-4xl md:text-5xl font-bold mb-4"
                     style={{ color: themeColors.primary }}>
                  {stat.number}
                </div>
                <div className="text-lg font-medium"
                     style={{ color: themeColors.text.secondary }}>
                  {stat.label}
                </div>
                <div className="mt-6 pt-6 border-t"
                     style={{ borderColor: themeColors.border }}>
                  <div className="text-sm opacity-75">
                    {getStatDescription(index)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getStatDescription(index: number): string {
  const descriptions = [
    'Free tools for all purposes',
    'Active users monthly',
    'Server uptime guarantee',
    'Completely free forever'
  ];
  return descriptions[index] || 'Premium quality tools';
}