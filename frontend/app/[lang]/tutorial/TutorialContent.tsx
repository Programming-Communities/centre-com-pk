'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowRight, PlayCircle, Download, CheckCircle, Video, BookOpen, Users } from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function TutorialContent() {
  const params = useParams();
  const lang = params?.lang as string || 'en';
  const { themeColors, fontFamily } = useTheme();
  const { t } = useTranslation({ namespace: 'tutorial' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ FIX: Static fallback colors for server + first client render
  const staticColors = {
    primary: '#1d4ed8',
    secondary: '#1e40af',
    background: '#ffffff',
    surface: '#f8fafc',
    border: '#e2e8f0',
    success: '#065f46',
    warning: '#92400e',
    error: '#7f1d1d',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textAccent: '#ffffff',
  };

  const colors = mounted
    ? {
        primary: themeColors?.primary || staticColors.primary,
        secondary: themeColors?.secondary || staticColors.secondary,
        background: themeColors?.background || staticColors.background,
        surface: themeColors?.surface || staticColors.surface,
        border: themeColors?.border || staticColors.border,
        success: themeColors?.success || staticColors.success,
        warning: themeColors?.warning || staticColors.warning,
        error: themeColors?.error || staticColors.error,
        textPrimary: themeColors?.text?.primary || staticColors.textPrimary,
        textSecondary: themeColors?.text?.secondary || staticColors.textSecondary,
        textAccent: themeColors?.text?.accent || staticColors.textAccent,
      }
    : staticColors;

  const tutorials = [
    {
      id: 1,
      title: t('getting_started_title'),
      description: t('getting_started_description'),
      duration: t('getting_started_duration'),
      level: t('getting_started_level'),
      category: t('categories_platform'),
      steps: 3,
      icon: <PlayCircle className="w-6 h-6" />
    },
    {
      id: 2,
      title: t('calculators_guide_title'),
      description: t('calculators_guide_description'),
      duration: t('calculators_guide_duration'),
      level: t('calculators_guide_level'),
      category: t('categories_calculators'),
      steps: 5,
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      id: 3,
      title: t('image_tools_title'),
      description: t('image_tools_description'),
      duration: t('image_tools_duration'),
      level: t('image_tools_level'),
      category: t('categories_image_tools'),
      steps: 7,
      icon: <Video className="w-6 h-6" />
    },
    {
      id: 4,
      title: t('pdf_tools_title'),
      description: t('pdf_tools_description'),
      duration: t('pdf_tools_duration'),
      level: t('pdf_tools_level'),
      category: t('categories_pdf_tools'),
      steps: 6,
      icon: <Download className="w-6 h-6" />
    },
    {
      id: 5,
      title: t('security_tools_title'),
      description: t('security_tools_description'),
      duration: t('security_tools_duration'),
      level: t('security_tools_level'),
      category: t('categories_security_tools'),
      steps: 4,
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      id: 6,
      title: t('code_tools_title'),
      description: t('code_tools_description'),
      duration: t('code_tools_duration'),
      level: t('code_tools_level'),
      category: t('categories_code_tools'),
      steps: 8,
      icon: <Users className="w-6 h-6" />
    }
  ];

  const featuredVideo = {
    title: t('featured_title'),
    description: t('featured_description'),
    duration: t('featured_duration'),
    views: t('featured_views'),
    uploadDate: t('featured_upload_date'),
    thumbnail: '/tutorial-thumbnail.jpg'
  };

  const faqs = [
    { question: t('faq_q1'), answer: t('faq_a1') },
    { question: t('faq_q2'), answer: t('faq_a2') },
    { question: t('faq_q3'), answer: t('faq_a3') },
    { question: t('faq_q4'), answer: t('faq_a4') },
    { question: t('faq_q5'), answer: t('faq_a5') },
    { question: t('faq_q6'), answer: t('faq_a6') }
  ];

  const getContrastColor = () => colors.textAccent;

  if (!mounted) {
    return (
      <main
        suppressHydrationWarning
        className="min-h-screen"
        style={{ backgroundColor: staticColors.background }}
      />
    );
  }

  return (
    <main
      suppressHydrationWarning
      className="min-h-screen"
      style={{
        backgroundColor: colors.background,
        fontFamily: fontFamily
      }}
    >
      {/* Hero Section */}
      <div
        suppressHydrationWarning
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1
              className="text-4xl md:text-6xl font-bold mb-6"
              suppressHydrationWarning
              style={{ color: colors.textAccent }}
            >
              {t('hero_title')}
            </h1>
            <p
              className="text-xl max-w-3xl mx-auto mb-10 opacity-90"
              suppressHydrationWarning
              style={{ color: colors.textAccent }}
            >
              {t('hero_description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${lang}/tutorial#tutorials`}
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg transition-colors md:py-4 md:text-lg md:px-10"
                suppressHydrationWarning
                style={{
                  color: colors.primary,
                  backgroundColor: colors.surface
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.surface;
                }}
              >
                {t('hero_browse_button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href={`/${lang}/tutorial#featured-video`}
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg border-2 transition-colors md:py-4 md:text-lg md:px-10"
                suppressHydrationWarning
                style={{
                  borderColor: colors.surface,
                  color: colors.textAccent
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.surface;
                  e.currentTarget.style.color = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.textAccent;
                }}
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                {t('hero_watch_button')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Video */}
      <div id="featured-video" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold mb-4"
            suppressHydrationWarning
            style={{ color: colors.textPrimary }}
          >
            {t('featured_section_title')}
          </h2>
          <p
            className="text-lg"
            suppressHydrationWarning
            style={{ color: colors.textSecondary }}
          >
            {t('featured_section_description')}
          </p>
        </div>

        <div
          className="rounded-2xl shadow-xl overflow-hidden"
          suppressHydrationWarning
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border
          }}
        >
          <div
            className="aspect-video relative"
            suppressHydrationWarning
            style={{ backgroundColor: colors.background }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="rounded-full p-6 hover:scale-110 transition-transform"
                suppressHydrationWarning
                style={{ backgroundColor: colors.surface }}
              >
                <PlayCircle
                  className="w-16 h-16"
                  style={{ color: colors.primary }}
                />
              </button>
            </div>
            <div
              className="absolute bottom-4 left-4 text-white px-3 py-1 rounded"
              suppressHydrationWarning
              style={{
                backgroundColor: `${colors.textPrimary}CC`,
                color: colors.surface
              }}
            >
              {featuredVideo.duration}
            </div>
          </div>
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-2xl font-bold"
                suppressHydrationWarning
                style={{ color: colors.textPrimary }}
              >
                {featuredVideo.title}
              </h3>
              <span
                className="text-sm font-medium px-3 py-1 rounded"
                suppressHydrationWarning
                style={{
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary
                }}
              >
                Featured
              </span>
            </div>
            <p
              className="mb-6"
              suppressHydrationWarning
              style={{ color: colors.textSecondary }}
            >
              {featuredVideo.description}
            </p>
            <div className="flex items-center justify-between text-sm" suppressHydrationWarning style={{ color: colors.textSecondary }}>
              <span>👁️ {featuredVideo.views}</span>
              <span>📅 {featuredVideo.uploadDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorials Grid */}
      <div id="tutorials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold mb-4"
            suppressHydrationWarning
            style={{ color: colors.textPrimary }}
          >
            {t('tutorials_section_title')}
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto"
            suppressHydrationWarning
            style={{ color: colors.textSecondary }}
          >
            {t('tutorials_section_description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial) => {
            let badgeColor = colors.success;
            if (tutorial.level === t('levels_intermediate')) badgeColor = colors.warning;
            if (tutorial.level === t('levels_advanced')) badgeColor = colors.error;

            return (
              <div
                key={tutorial.id}
                className="rounded-xl overflow-hidden transition-shadow hover:shadow-xl border"
                suppressHydrationWarning
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border
                }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="p-3 rounded-lg"
                      suppressHydrationWarning
                      style={{
                        backgroundColor: `${colors.primary}10`,
                        color: colors.primary
                      }}
                    >
                      {tutorial.icon}
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      suppressHydrationWarning
                      style={{
                        backgroundColor: `${badgeColor}20`,
                        color: badgeColor
                      }}
                    >
                      {tutorial.level}
                    </span>
                  </div>

                  <div className="mb-2">
                    <span
                      className="text-sm font-medium px-3 py-1 rounded"
                      suppressHydrationWarning
                      style={{
                        backgroundColor: `${colors.primary}10`,
                        color: colors.primary
                      }}
                    >
                      {tutorial.category}
                    </span>
                  </div>

                  <h3
                    className="text-xl font-bold mb-3"
                    suppressHydrationWarning
                    style={{ color: colors.textPrimary }}
                  >
                    {tutorial.title}
                  </h3>
                  <p
                    className="mb-6"
                    suppressHydrationWarning
                    style={{ color: colors.textSecondary }}
                  >
                    {tutorial.description}
                  </p>

                  <div
                    className="flex items-center justify-between text-sm mb-6"
                    suppressHydrationWarning
                    style={{ color: colors.textSecondary }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <PlayCircle className="w-4 h-4" />
                        {tutorial.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        📝 {tutorial.steps} {t('steps')}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/${lang}/tutorial/${tutorial.id}`}
                    className="inline-flex items-center justify-center w-full py-3 px-4 border border-transparent rounded-lg font-medium transition-colors"
                    suppressHydrationWarning
                    style={{
                      backgroundColor: colors.primary,
                      color: getContrastColor()
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    {t('start_tutorial')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16" suppressHydrationWarning style={{ backgroundColor: colors.background }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2
              className="text-3xl font-bold mb-6"
              suppressHydrationWarning
              style={{ color: colors.textPrimary }}
            >
              {t('cta_title')}
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto mb-10"
              suppressHydrationWarning
              style={{ color: colors.textSecondary }}
            >
              {t('cta_description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg transition-colors md:py-4 md:text-lg md:px-10"
                suppressHydrationWarning
                style={{
                  backgroundColor: colors.primary,
                  color: getContrastColor()
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                {t('cta_contact_button')}
              </Link>
              <Link
                href={`/${lang}/suggest-tutorial`}
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg border-2 transition-colors md:py-4 md:text-lg md:px-10"
                suppressHydrationWarning
                style={{
                  borderColor: colors.primary,
                  color: colors.primary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.primary}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {t('cta_suggest_button')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2
          className="text-3xl font-bold text-center mb-12"
          suppressHydrationWarning
          style={{ color: colors.textPrimary }}
        >
          {t('faq_title')}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border"
              suppressHydrationWarning
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border
              }}
            >
              <h3
                className="text-lg font-semibold mb-3"
                suppressHydrationWarning
                style={{ color: colors.textPrimary }}
              >
                {faq.question}
              </h3>
              <p suppressHydrationWarning style={{ color: colors.textSecondary }}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
