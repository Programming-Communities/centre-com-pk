// components/sections/CentersGrid/CentersGrid.tsx
"use client";

import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface Center {
  id: string | number;
  title: string;
  description: string;
  tools: number;
  icon: string;
  gradient: string;
  link: string;
}

interface CentersGridProps {
  centers: Center[];
  title?: string;
  description?: string;
}

export default function CentersGrid({ 
  centers,
  title = "Our Centers",
  description = "Specialized collections of tools for specific needs"
}: CentersGridProps) {
  const { themeColors } = useTheme();

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: themeColors.text.primary }}>
            {title}
          </h2>
          <p className="text-lg max-w-2xl mx-auto"
             style={{ color: themeColors.text.secondary }}>
            {description}
          </p>
        </div>

        {/* Centers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {centers.map((center) => (
            <Link key={center.id} href={center.link} className="group block">
              <div className="h-full rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                   style={{
                     backgroundColor: themeColors.surface,
                     border: `1px solid ${themeColors.border}`,
                   }}>
                {/* Gradient Header */}
                <div className={`h-32 relative ${center.gradient} flex items-center justify-center`}>
                  <div className="text-6xl opacity-80">{center.icon}</div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm">
                    {center.tools}+ Tools
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3"
                      style={{ color: themeColors.text.primary }}>
                    {center.title}
                  </h3>
                  <p className="mb-6" style={{ color: themeColors.text.secondary }}>
                    {center.description}
                  </p>

                  {/* Popular Tools */}
                  <div className="mb-6">
                    <div className="text-sm font-medium mb-3"
                         style={{ color: themeColors.text.secondary }}>
                      Popular Tools:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getCenterTools(center.title).map((tool, index) => (
                        <span key={index} className="px-3 py-1 rounded-full text-sm"
                              style={{
                                backgroundColor: themeColors.background,
                                color: themeColors.text.secondary,
                                border: `1px solid ${themeColors.border}`,
                              }}>
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-6 border-t"
                       style={{ borderColor: themeColors.border }}>
                    <div className="text-center">
                      <div className="text-lg font-bold"
                           style={{ color: themeColors.primary }}>
                        {center.tools}+
                      </div>
                      <div className="text-xs" style={{ color: themeColors.text.secondary }}>
                        Tools
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold"
                           style={{ color: themeColors.primary }}>
                        100%
                      </div>
                      <div className="text-xs" style={{ color: themeColors.text.secondary }}>
                        Free
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold"
                           style={{ color: themeColors.primary }}>
                        24/7
                      </div>
                      <div className="text-xs" style={{ color: themeColors.text.secondary }}>
                        Available
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/centers"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: themeColors.surface,
              color: themeColors.text.primary,
              border: `2px solid ${themeColors.border}`,
            }}
          >
            Explore All Centers
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function getCenterTools(centerTitle: string): string[] {
  const toolsMap: Record<string, string[]> = {
    'Educational Center': ['GPA Calculator', 'Age Calculator', 'Unit Converter', 'Study Timer'],
    'Computer Center': ['Code Formatter', 'Hash Generator', 'Base64 Encoder', 'JSON Formatter'],
    'Design Center': ['Color Picker', 'Image Compressor', 'Favicon Generator', 'Color Converter'],
    'Business Center': ['Loan Calculator', 'Currency Converter', 'Invoice Generator', 'Tax Calculator'],
    'Health Center': ['BMI Calculator', 'Calorie Counter', 'Medication Timer', 'Health Tracker'],
    'Security Center': ['Password Generator', 'Encryption Tool', 'Hash Checker', 'SSL Checker']
  };

  return toolsMap[centerTitle] || ['Premium Tools', 'Easy to Use', 'Free Forever', 'No Ads'];
}