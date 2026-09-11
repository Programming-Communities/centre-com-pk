// components/layout/Footer/Footer.tsx
'use client';

import React, { memo, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Mail, Github, Twitter, ExternalLink } from "lucide-react";
import { useTheme } from "@/components/theme/contexts/ThemeContext";
import { useTranslation } from "@/hooks/useTranslation";

// ================== PROPS INTERFACE ==================
interface FooterProps {
  lang: string;
}

// ================== CONSTANTS ==================
const CURRENT_YEAR = new Date().getFullYear();
const CREATOR_NAME = "Shahbaz Bashir";
const COMMUNITIES_URL = "https://communities.pk/";

const POPULAR_TOOLS = [
  ["image_compressor", "/tools/image-tools/image-compressor"],
  ["pdf_merger", "/tools/pdf-tools/pdf-merger"],
  ["qr_generator", "/tools/code-tools/qr-code-generator"],
  ["password_generator", "/tools/security-tools/password-generator"],
  ["age_calculator", "/tools/calculators/age-calculator"],
  ["word_counter", "/tools/text-tools/word-counter"],
] as const;

const QUICK_CATEGORIES = [
  ["all_tools", "/tools"],
  ["image_tools", "/tools/image-tools"],
  ["pdf_tools", "/tools/pdf-tools"],
  ["calculators", "/tools/calculators"],
  ["code_tools", "/tools/code-tools"],
  ["security_tools", "/tools/security-tools"],
] as const;

const COMPANY_LINKS = [
  ["about", "/about"],
  ["contact", "/contact"],
  ["blog", "/blog"],
  ["privacy", "/privacy-policy"],
  ["terms", "/terms"],
] as const;

const SOCIAL_LINKS = [
  [Twitter, "Twitter", "https://twitter.com/centerspk"],
  [Github, "GitHub", "https://github.com/centerspk"],
  [Mail, "Email", "mailto:contact@centre.com.pk"],
] as const;

// ================== FOOTER COMPONENT ==================
export default function Footer({ lang }: FooterProps) {
  const { themeColors } = useTheme();
  const { t: tCommon } = useTranslation({ namespace: 'common' });
  
  // ✅ HYDration FIX
  const [mounted, setMounted] = useState(false);
  
  // State for footer translations
  const [footerT, setFooterT] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ HYDration FIX — mounted set karo
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ DYNAMIC IMPORT - Import footer.json for current language
  useEffect(() => {
    setLoading(true);
    
    import(`@/translations/${lang}/footer.json`)
      .then((module) => {
        setFooterT(module.default || module);
        setLoading(false);
      })
      .catch(() => {
        import(`@/translations/en/footer.json`)
          .then((module) => {
            setFooterT(module.default || module);
            setLoading(false);
          })
          .catch((err) => {
            console.error('Failed to load footer translations:', err);
            setFooterT(null);
            setLoading(false);
          });
      });
  }, [lang]);
  
  // ✅ HYDration FIX — Default LIGHT theme (server + client same)
  const memoizedTheme = useMemo(() => {
    const fallback = {
      bg: '#ffffff',
      border: '#e2e8f0',
      textPrimary: '#0f172a',
      textSecondary: '#334155',
      primary: '#1d4ed8',
      gradient: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
    };
    
    if (!mounted || !themeColors) return fallback;
    
    return {
      bg: themeColors.background || fallback.bg,
      border: themeColors.border || fallback.border,
      textPrimary: themeColors.text?.primary || fallback.textPrimary,
      textSecondary: themeColors.text?.secondary || fallback.textSecondary,
      primary: themeColors.primary || fallback.primary,
      gradient: `linear-gradient(135deg, ${themeColors.primary || '#1d4ed8'}, ${themeColors.secondary || '#1e40af'})`,
    };
  }, [themeColors, mounted]);

  // Helper function to safely get translation with fallback
  const getFooterText = (path: string, fallback: string = ''): string => {
    if (!footerT) return fallback;
    
    const keys = path.split('.');
    let value: any = footerT;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return fallback;
      }
    }
    
    return typeof value === 'string' ? value : fallback;
  };

  // Loading state
  if (loading || !footerT) {
    return (
      <footer className="border-t" suppressHydrationWarning style={{ backgroundColor: memoizedTheme.bg, borderColor: memoizedTheme.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t" suppressHydrationWarning style={{ backgroundColor: memoizedTheme.bg, borderColor: memoizedTheme.border }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: memoizedTheme.gradient }}
            >
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: memoizedTheme.textPrimary }}>
                Centre.com.pk
              </h2>
              <div className="flex items-center gap-2 text-xs" style={{ color: memoizedTheme.textSecondary }}>
                <span>{getFooterText('status.free', tCommon('status.free') || 'Free')}</span>•
                <span>{getFooterText('status.no_login', tCommon('status.no_login') || 'No Login')}</span>•
                <span>{getFooterText('status.apps', tCommon('status.apps') || 'Apps')}</span>
              </div>
            </div>
          </div>
          <p className="text-sm mb-4 max-w-2xl" style={{ color: memoizedTheme.textSecondary }}>
            {getFooterText('footer.description', tCommon('description.footer') || footerT.footer_note || '')}
          </p>
          <div className="flex gap-4 text-sm">
            <div className="font-bold" style={{ color: memoizedTheme.primary }}>50+</div>
            <div style={{ color: memoizedTheme.textSecondary }}>{footerT.tools_count || footerT.tools || 'Tools'}</div>
            <div className="font-bold" style={{ color: memoizedTheme.primary }}>100%</div>
            <div style={{ color: memoizedTheme.textSecondary }}>{footerT.free || 'Free'}</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          
          {/* Popular Tools Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4 pb-2 border-b" 
                style={{ color: memoizedTheme.textPrimary, borderColor: memoizedTheme.border }}>
              {footerT.popular_tools || 'Popular Tools'}
            </h3>
            <ul className="space-y-1">
              {POPULAR_TOOLS.map(([key, route]) => (
                <li key={key}>
                  <Link
                    href={`/${lang}${route}`}
                    className="flex items-center py-1.5 hover:underline transition-colors"
                    style={{ color: memoizedTheme.textSecondary }}
                    prefetch={false}
                  >
                    <span className="mr-2 text-lg" style={{ color: memoizedTheme.primary }}>•</span>
                    {footerT.popular?.[key] || key.replace(/_/g, ' ')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Categories Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4 pb-2 border-b" 
                style={{ color: memoizedTheme.textPrimary, borderColor: memoizedTheme.border }}>
              {footerT.categories_title || footerT.categories || 'Categories'}
            </h3>
            <ul className="space-y-1">
              {QUICK_CATEGORIES.map(([key, route]) => (
                <li key={key}>
                  <Link
                    href={`/${lang}${route}`}
                    className="flex items-center py-1.5 hover:underline transition-colors"
                    style={{ color: memoizedTheme.textSecondary }}
                    prefetch={false}
                  >
                    <span className="mr-2 text-lg" style={{ color: memoizedTheme.primary }}>•</span>
                    {footerT.quick?.[key] || key.replace(/_/g, ' ')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4 pb-2 border-b" 
                style={{ color: memoizedTheme.textPrimary, borderColor: memoizedTheme.border }}>
              {footerT.company || 'Company'}
            </h3>
            <ul className="space-y-1">
              {COMPANY_LINKS.map(([key, route]) => (
                <li key={key}>
                  <Link
                    href={`/${lang}${route}`}
                    className="flex items-center py-1.5 hover:underline transition-colors"
                    style={{ color: memoizedTheme.textSecondary }}
                    prefetch={false}
                  >
                    <span className="mr-2 text-lg" style={{ color: memoizedTheme.primary }}>•</span>
                    {footerT.company_links?.[key] || key}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4 pb-2 border-b" 
                style={{ color: memoizedTheme.textPrimary, borderColor: memoizedTheme.border }}>
              {footerT.connect || 'Connect'}
            </h3>
            <div className="space-y-3">
              <p style={{ color: memoizedTheme.textSecondary }} className="text-sm">
                {footerT.follow || 'Follow for updates'}
              </p>
              <div className="flex gap-2">
                {SOCIAL_LINKS.map(([Icon, label, url]) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${memoizedTheme.primary}15`, color: memoizedTheme.primary }}
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full mb-6" style={{ backgroundColor: memoizedTheme.border }} />

        {/* Credits Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-center md:text-left" style={{ color: memoizedTheme.textSecondary }}>
            © {CURRENT_YEAR} Centre.com.pk • 
            <span className="mx-1">{footerT.credit?.by || 'Credit by'}</span>
            <a
              href={COMMUNITIES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline mx-1 inline-flex items-center"
              style={{ color: memoizedTheme.primary }}
            >
              {footerT.credit?.communities || 'Communities.pk'}
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
            <span className="mx-1">•</span>
            <span className="mx-1">{footerT.credit?.made || 'Made by'}</span>
            <span className="font-medium" style={{ color: memoizedTheme.primary }}>
              {CREATOR_NAME}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-xs" style={{ color: memoizedTheme.textSecondary }}>
            <Link href="/sitemap.xml" className="hover:underline" prefetch={false}>
              {getFooterText('action.sitemap', footerT.sitemap || tCommon('action.sitemap') || 'Sitemap')}
            </Link>
            •
            <Link href="/robots.txt" className="hover:underline" prefetch={false}>
              {getFooterText('action.robots', footerT.robots || tCommon('action.robots') || 'Robots')}
            </Link>
            •
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full mr-1 bg-green-500 animate-pulse" />
              {getFooterText('status.operational', footerT.operational || tCommon('status.operational') || 'Active')}
            </div>
          </div>
        </div>

        {/* Final Note */}
        <div className="mt-6 pt-4 border-t text-center text-xs" 
             style={{ borderColor: memoizedTheme.border, color: memoizedTheme.textSecondary }}>
          {footerT.footer_note || getFooterText('footer.description', '')}
        </div>
      </div>
    </footer>
  );
}

export const MemoizedFooter = memo(Footer);