'use client';

import { ArrowRight, Sparkles, Zap, Lock } from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface ToolPreviewProps {
  tool: {
    name: string;
    description: string;
    href: string;
    icon?: string;
    screenshot?: string;
    summary?: string;
    features?: string[];
    status?: 'popular' | 'new' | 'live' | 'soon';
  };
  lang: string;
}

export default function ToolPreview({ tool, lang }: ToolPreviewProps) {
  const { themeColors, isDarkMode } = useTheme();

  if (!tool) {
    return (
      <div
        className="h-full flex items-center justify-center text-sm opacity-60"
        style={{ color: themeColors?.text?.secondary || '#64748b' }}
      >
        Hover a tool to preview
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col h-full">
      {/* Icon or Screenshot */}
      <div
        className="w-full aspect-video rounded-xl mb-4 flex items-center justify-center overflow-hidden relative"
        style={{
          background: tool.screenshot
            ? 'transparent'
            : `linear-gradient(135deg, ${themeColors?.primary || '#3b82f6'}15, ${themeColors?.secondary || '#8b5cf6'}15)`,
          border: `1px solid ${themeColors?.border || '#e2e8f0'}`,
        }}
      >
        {tool.screenshot ? (
          <img
            src={tool.screenshot}
            alt={tool.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-7xl">{tool.icon || '🔧'}</span>
        )}

        {/* Status Badge */}
        {tool.status && (
          <span
            className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full font-medium uppercase tracking-wide"
            style={{
              backgroundColor:
                tool.status === 'popular' ? '#f59e0b' :
                tool.status === 'new' ? '#8b5cf6' :
                tool.status === 'live' ? '#10b981' :
                '#64748b',
              color: '#ffffff',
            }}
          >
            {tool.status}
          </span>
        )}
      </div>

      {/* Tool Name */}
      <h3
        className="text-lg font-bold mb-2"
        style={{ color: themeColors?.text?.primary || '#0f172a' }}
      >
        {tool.name}
      </h3>

      {/* Description / Summary */}
      <p
        className="text-sm leading-relaxed mb-4 flex-1"
        style={{ color: themeColors?.text?.secondary || '#64748b' }}
      >
        {tool.summary || tool.description}
      </p>

      {/* Features (if provided) */}
      {tool.features && tool.features.length > 0 && (
        <div className="mb-4 space-y-1.5">
          {tool.features.slice(0, 3).map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs"
              style={{ color: themeColors?.text?.secondary || '#64748b' }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: themeColors?.primary || '#3b82f6' }} />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      )}

      {/* Default feature badges (if no features provided) */}
      {(!tool.features || tool.features.length === 0) && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full"
            style={{
              backgroundColor: `${themeColors?.primary || '#3b82f6'}10`,
              color: themeColors?.primary || '#3b82f6',
            }}
          >
            <Sparkles className="w-3 h-3" />
            Free
          </span>
          <span
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full"
            style={{
              backgroundColor: '#10b98110',
              color: '#10b981',
            }}
          >
            <Zap className="w-3 h-3" />
            Instant
          </span>
          <span
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full"
            style={{
              backgroundColor: '#8b5cf610',
              color: '#8b5cf6',
            }}
          >
            <Lock className="w-3 h-3" />
            Private
          </span>
        </div>
      )}

      {/* Open Tool Button */}
      <a
        href={`/${lang}${tool.href}`}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
        style={{
          backgroundColor: themeColors?.primary || '#3b82f6',
          color: '#ffffff',
        }}
      >
        Open Tool
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}