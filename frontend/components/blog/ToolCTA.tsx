'use client';
import Link from 'next/link';
import { Wrench, ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface ToolCTAProps {
  toolSlug: string;
  toolName?: string;
  category?: string;
  lang?: string;
}

const CATEGORY_MAP: Record<string, string> = {
  'calculators': 'calculators',
  'image-tools': 'image-tools',
  'pdf-tools': 'pdf-tools',
  'code-tools': 'code-tools',
  'text-tools': 'text-tools',
  'security-tools': 'security-tools',
  'design-tools': 'design-tools',
  'general': 'calculators',
};

export default function ToolCTA({ toolSlug, toolName, category, lang = 'en' }: ToolCTAProps) {
  const { themeColors } = useTheme();
  
  if (!toolSlug) return null;
  
  const displayName = toolName || toolSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const cat = CATEGORY_MAP[category || ''] || 'calculators';
  
  const primary = themeColors?.primary || '#3b82f6';
  const textPrimary = themeColors?.text?.primary || '#0f172a';
  const textSecondary = themeColors?.text?.secondary || '#64748b';
  
  return (
    <div className="my-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 border-2 border-primary/20 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white mb-4 shadow-lg shadow-primary/25">
          <Wrench className="w-8 h-8" />
        </div>
        
        {/* Heading */}
        <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: textPrimary }}>
          🛠️ Try the {displayName} Tool Now
        </h3>
        
        {/* Description */}
        <p className="max-w-lg mx-auto mb-6" style={{ color: textSecondary }}>
          Put your knowledge into practice! Use our free <strong>{displayName}</strong> tool
          to get instant results. Fast, accurate, and completely free.
        </p>
        
        {/* CTA Button */}
        <Link
          href={`/${lang}/tools/${cat}/${toolSlug}`}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white font-semibold text-lg hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 group"
          style={{ backgroundColor: primary }}
        >
          <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
          Open {displayName}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        
        {/* Trust indicators */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs" style={{ color: textSecondary }}>
          <span>✅ Free to Use</span>
          <span>✅ No Sign-up Required</span>
          <span>✅ Instant Results</span>
        </div>
      </div>
    </div>
  );
}