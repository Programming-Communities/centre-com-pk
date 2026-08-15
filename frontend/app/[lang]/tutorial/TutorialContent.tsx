'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, PlayCircle, Download, CheckCircle, Video, BookOpen, Users } from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function TutorialContent() {
  const params = useParams();
  const lang = params?.lang as string || 'en';
  const { themeColors, fontFamily } = useTheme();
  const { t } = useTranslation({ namespace: 'tutorial' });

  // ✅ FIXED: Use flat keys instead of nested access
  const tutorials = [
    {
      id: 1,
      title: t('getting_started_title'),        // ✅ flat key
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

  // Helper function to get accessible colors
  const getContrastColor = (bgColor: string) => {
    return themeColors.text.accent;
  };

  return (
    <main 
      className="min-h-screen"
      style={{ 
        backgroundColor: themeColors.background,
        fontFamily: fontFamily
      }}
    >
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})`
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{ color: themeColors.text.accent }}
            >
              {t('hero_title')}  {/* ✅ flat key */}
            </h1>
            <p 
              className="text-xl max-w-3xl mx-auto mb-10 opacity-90"
              style={{ color: themeColors.text.accent }}
            >
              {t('hero_description')}  {/* ✅ flat key */}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${lang}/tutorial#tutorials`}
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg transition-colors md:py-4 md:text-lg md:px-10"
                style={{ 
                  color: themeColors.primary,
                  backgroundColor: themeColors.surface
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = themeColors.background;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = themeColors.surface;
                }}
              >
                {t('hero_browse_button')}  {/* ✅ flat key */}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href={`/${lang}/tutorial#featured-video`}
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg border-2 transition-colors md:py-4 md:text-lg md:px-10"
                style={{ 
                  borderColor: themeColors.surface,
                  color: themeColors.text.accent
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = themeColors.surface;
                  e.currentTarget.style.color = themeColors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = themeColors.text.accent;
                }}
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                {t('hero_watch_button')}  {/* ✅ flat key */}
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
            style={{ color: themeColors.text.primary }}
          >
            {t('featured_section_title')}  {/* ✅ flat key */}
          </h2>
          <p 
            className="text-lg"
            style={{ color: themeColors.text.secondary }}
          >
            {t('featured_section_description')}  {/* ✅ flat key */}
          </p>
        </div>
        
        <div 
          className="rounded-2xl shadow-xl overflow-hidden"
          style={{ 
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border
          }}
        >
          <div 
            className="aspect-video relative"
            style={{ backgroundColor: themeColors.background }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                className="rounded-full p-6 hover:scale-110 transition-transform"
                style={{ backgroundColor: themeColors.surface }}
              >
                <PlayCircle 
                  className="w-16 h-16" 
                  style={{ color: themeColors.primary }}
                />
              </button>
            </div>
            <div 
              className="absolute bottom-4 left-4 text-white px-3 py-1 rounded"
              style={{ 
                backgroundColor: `${themeColors.text.primary}CC`,
                color: themeColors.surface
              }}
            >
              {featuredVideo.duration}
            </div>
          </div>
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 
                className="text-2xl font-bold"
                style={{ color: themeColors.text.primary }}
              >
                {featuredVideo.title}
              </h3>
              <span 
                className="text-sm font-medium px-3 py-1 rounded"
                style={{ 
                  backgroundColor: `${themeColors.primary}20`,
                  color: themeColors.primary
                }}
              >
                Featured
              </span>
            </div>
            <p 
              className="mb-6"
              style={{ color: themeColors.text.secondary }}
            >
              {featuredVideo.description}
            </p>
            <div className="flex items-center justify-between text-sm" style={{ color: themeColors.text.secondary }}>
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
            style={{ color: themeColors.text.primary }}
          >
            {t('tutorials_section_title')}  {/* ✅ flat key */}
          </h2>
          <p 
            className="text-lg max-w-3xl mx-auto"
            style={{ color: themeColors.text.secondary }}
          >
            {t('tutorials_section_description')}  {/* ✅ flat key */}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial) => {
            let badgeColor = themeColors.success;
            if (tutorial.level === t('levels_intermediate')) badgeColor = themeColors.warning;
            if (tutorial.level === t('levels_advanced')) badgeColor = themeColors.error;

            return (
              <div
                key={tutorial.id}
                className="rounded-xl overflow-hidden transition-shadow hover:shadow-xl border"
                style={{ 
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border
                }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ 
                        backgroundColor: `${themeColors.primary}10`,
                        color: themeColors.primary
                      }}
                    >
                      {tutorial.icon}
                    </div>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
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
                      style={{ 
                        backgroundColor: `${themeColors.primary}10`,
                        color: themeColors.primary
                      }}
                    >
                      {tutorial.category}
                    </span>
                  </div>
                  
                  <h3 
                    className="text-xl font-bold mb-3"
                    style={{ color: themeColors.text.primary }}
                  >
                    {tutorial.title}
                  </h3>
                  <p 
                    className="mb-6"
                    style={{ color: themeColors.text.secondary }}
                  >
                    {tutorial.description}
                  </p>
                  
                  <div 
                    className="flex items-center justify-between text-sm mb-6"
                    style={{ color: themeColors.text.secondary }}
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
                    style={{ 
                      backgroundColor: themeColors.primary,
                      color: getContrastColor(themeColors.primary)
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
      <div className="py-16" style={{ backgroundColor: themeColors.background }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 
              className="text-3xl font-bold mb-6"
              style={{ color: themeColors.text.primary }}
            >
              {t('cta_title')}  {/* ✅ flat key */}
            </h2>
            <p 
              className="text-lg max-w-2xl mx-auto mb-10"
              style={{ color: themeColors.text.secondary }}
            >
              {t('cta_description')}  {/* ✅ flat key */}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg transition-colors md:py-4 md:text-lg md:px-10"
                style={{ 
                  backgroundColor: themeColors.primary,
                  color: getContrastColor(themeColors.primary)
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                {t('cta_contact_button')}  {/* ✅ flat key */}
              </Link>
              <Link
                href={`/${lang}/suggest-tutorial`}
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg border-2 transition-colors md:py-4 md:text-lg md:px-10"
                style={{ 
                  borderColor: themeColors.primary,
                  color: themeColors.primary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${themeColors.primary}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {t('cta_suggest_button')}  {/* ✅ flat key */}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 
          className="text-3xl font-bold text-center mb-12"
          style={{ color: themeColors.text.primary }}
        >
          {t('faq_title')}  {/* ✅ flat key */}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: themeColors.surface,
                borderColor: themeColors.border
              }}
            >
              <h3 
                className="text-lg font-semibold mb-3"
                style={{ color: themeColors.text.primary }}
              >
                {faq.question}
              </h3>
              <p style={{ color: themeColors.text.secondary }}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}