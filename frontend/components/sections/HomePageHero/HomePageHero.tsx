"use client";

import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useState, useEffect } from 'react';

interface HomePageHeroProps {
  badge?: string;
  title: string;
  highlightedTitle?: string;
  description: string;
  highlightedDescription?: string;
  primaryButton?: { text: string; href: string };
  secondaryButton?: { text: string; href?: string; onClick?: () => void };
  theme?: 'primary' | 'success' | 'warning' | 'error';
  withBackground?: boolean;
  lang: string;
}

export default function HomePageHero({
  badge,
  title,
  highlightedTitle,
  description,
  primaryButton = { text: "Explore Tools", href: "#categories" },
  secondaryButton,
  theme = "primary",
  withBackground = true,
  lang
}: HomePageHeroProps) {
  const { themeColors } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ FIX: Static fallback colors for server + first client render
  // These match `professional-blue` light theme to prevent hydration mismatch
  const staticColors = {
    primary: '#1d4ed8',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
  };

  // After mounted, use real theme colors
  const themeColor = mounted ? (themeColors?.primary || staticColors.primary) : staticColors.primary;
  const textPrimary = mounted ? (themeColors?.text?.primary || staticColors.textPrimary) : staticColors.textPrimary;
  const textSecondary = mounted ? (themeColors?.text?.secondary || staticColors.textSecondary) : staticColors.textSecondary;

  return (
    <section className="relative py-12 md:py-16 lg:py-20" suppressHydrationWarning>
      {withBackground && (
        <div
          className="absolute inset-0"
          suppressHydrationWarning
          style={{ backgroundColor: `${themeColor}10` }}
        />
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          {/* ✅ Badge — Static height, no layout shift */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
            suppressHydrationWarning
            style={{
              backgroundColor: `${themeColor}10`,
              border: `1px solid ${themeColor}30`,
            }}
          >
            <Zap className="h-4 w-4" suppressHydrationWarning style={{ color: themeColor }} />
            <span
              className="text-sm font-medium"
              suppressHydrationWarning
              style={{ color: themeColor }}
            >
              {badge || 'Free Online Tools'}
            </span>
          </div>

          {/* ✅ Title — No animation, pure static */}
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight"
            suppressHydrationWarning
            style={{ color: textPrimary }}
          >
            {title}
            {highlightedTitle && (
              <>
                <br />
                <span suppressHydrationWarning style={{ color: themeColor }}>
                  {highlightedTitle}
                </span>
              </>
            )}
          </h1>

          {/* ✅ Description — Static */}
          <p
            className="text-base sm:text-lg mb-8 max-w-3xl mx-auto"
            suppressHydrationWarning
            style={{ color: textSecondary }}
          >
            {description}
          </p>

          {/* ✅ Buttons — Inline styles, no hover animations */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={`/${lang}${primaryButton.href}`}
              className="px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-opacity hover:opacity-90 inline-flex items-center gap-2"
              suppressHydrationWarning
              style={{ backgroundColor: themeColor, color: '#ffffff' }}
              prefetch={false}
            >
              <ArrowRight className="h-4 w-4" suppressHydrationWarning />
              {primaryButton.text}
            </Link>

            {secondaryButton && (
              <Link
                href={`/${lang}${secondaryButton.href || '#'}`}
                className="px-6 py-3 rounded-xl font-bold text-sm sm:text-base border inline-flex items-center gap-2"
                suppressHydrationWarning
                style={{
                  borderColor: themeColor,
                  color: themeColor,
                  backgroundColor: `${themeColor}10`,
                }}
              >
                {secondaryButton.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
