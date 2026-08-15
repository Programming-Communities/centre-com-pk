"use client";

import { useParams } from 'next/navigation'; // ✅ CRITICAL: Add this hook
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface Tool {
  name: string;
  category: string;
  icon: string;
  popularity: number;
}

interface ToolsShowcaseProps {
  tools: Tool[];
  title?: string;
  description?: string;
}

export default function ToolsShowcase({ 
  tools,
  title = "Popular Tools",
  description = "Most frequently used tools by our community"
}: ToolsShowcaseProps) {
  // ✅ FIX #1: Get lang from URL params
  const params = useParams();
  const lang = params?.lang as string || 'en';  // ✅ Default to 'en' if not found
  
  const { themeColors } = useTheme();

  return (
    <section className="py-16" style={{ backgroundColor: themeColors.background }}>
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

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool, index) => (
            <Link 
              key={index}
              // ✅ FIX #2: Add lang prefix to tool links
              href={`/${lang}/tools/${tool.category.toLowerCase()}/${tool.name.toLowerCase().replace(/ /g, '-')}`}
              className="group block"
            >
              <div className="h-full rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                   style={{
                     backgroundColor: themeColors.surface,
                     border: `1px solid ${themeColors.border}`,
                   }}>
                {/* Tool Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                         style={{
                           backgroundColor: themeColors.primary + '20',
                           color: themeColors.primary,
                         }}>
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold"
                          style={{ color: themeColors.text.primary }}>
                        {tool.name}
                      </h3>
                      <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                        {tool.category}
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </div>

                {/* Popularity Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: themeColors.text.secondary }}>
                      Popularity
                    </span>
                    <span style={{ color: themeColors.primary }}>
                      {tool.popularity}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden"
                       style={{ backgroundColor: themeColors.border }}>
                    <div className="h-full rounded-full transition-all duration-500 group-hover:w-full"
                         style={{
                           backgroundColor: themeColors.primary,
                           width: `${tool.popularity}%`,
                         }}></div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {getToolFeatures(tool.name).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full"
                           style={{ backgroundColor: themeColors.primary }}></div>
                      <span className="text-sm" style={{ color: themeColors.text.secondary }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Tools Button */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6">
            <Link
              // ✅ FIX #3: Add lang prefix to "View All Tools" link
              href={`/${lang}/tools`}
              className="px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
              style={{
                backgroundColor: themeColors.primary,
                color: themeColors.surface,
              }}
            >
              View All Tools
            </Link>
            <div className="text-center">
              <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                Join <span style={{ color: themeColors.primary }}>50K+</span> monthly users
              </div>
              <div className="text-xs" style={{ color: themeColors.text.secondary }}>
                Trusted by students, professionals, and businesses
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function getToolFeatures(toolName: string): string[] {
  const featuresMap: Record<string, string[]> = {
    'Age Calculator': ['Calculate exact age', 'Birthday countdown', 'Age in different units', 'Share results'],
    'Password Generator': ['Custom length', 'Multiple character sets', 'Copy to clipboard', 'Strength meter'],
    'Color Picker': ['RGB/HEX/HSL', 'Color palettes', 'Export options', 'Color harmony'],
    'Unit Converter': ['Multiple categories', 'Real-time conversion', 'History tracking', 'Custom units'],
    'Image Compressor': ['Bulk compression', 'Quality control', 'Multiple formats', 'Preview'],
    'QR Code Generator': ['Custom design', 'Logo support', 'Download options', 'Scan preview']
  };

  return featuresMap[toolName] || [
    'Easy to use',
    'No registration',
    'Instant results',
    'Free forever'
  ];
}