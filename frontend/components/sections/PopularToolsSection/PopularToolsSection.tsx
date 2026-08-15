"use client";

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface Tool {
  title: string;
  slug: string;
  category: string;
  description?: string;
  icon?: string;
}

interface PopularToolsSectionProps {
  tools: Tool[];
  title?: string;
  description?: string;
  className?: string;
  lang: string;
}

// ✅ Simple Tool Card — No animations, pure CSS
function SimpleToolCard({ tool, lang }: { tool: Tool; lang: string }) {
  return (
    <Link
      href={`/${lang}/tools/${tool.category}/${tool.slug}`}
      className="group block p-5 rounded-xl border border-border bg-surface hover:bg-surface/80 transition-colors"
      prefetch={false}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl">{tool.icon || "🛠️"}</span>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
            {tool.category}
          </span>
        </div>
        
        <div>
          <h3 className="font-bold text-base mb-1 text-text-primary line-clamp-1">{tool.title}</h3>
          <p className="text-sm text-text-secondary line-clamp-2">{tool.description}</p>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-text-secondary">🔧 No install</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Free</span>
            <span className="text-sm font-medium text-primary inline-flex items-center">
              Use
              <ArrowRight className="w-3 h-3 ml-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function PopularToolsSection({
  tools,
  title = "Popular Tools",
  description = "Tools our users love and use the most",
  className = "",
  lang
}: PopularToolsSectionProps) {
  const { themeColors } = useTheme();

  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        {/* ✅ Title — Static */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 border border-primary/30 bg-primary/10">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Trending Now</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-text-primary">{title}</h2>
          <p className="text-base max-w-2xl mx-auto text-text-secondary">{description}</p>
        </div>

        {/* ✅ Grid — No animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.slice(0, 6).map((tool, index) => (
            <SimpleToolCard key={`${tool.slug}-${index}`} tool={tool} lang={lang} />
          ))}
        </div>

        {/* ✅ View All — Static */}
        <div className="text-center mt-8">
          <Link
            href={`/${lang}/tools`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-white transition-colors"
          >
            <span>View All Tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
