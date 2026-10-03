'use client';
import BlogFAQ from './BlogFAQ';
import BlogComparison from './BlogComparison';
import BlogVideo from './BlogVideo';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { Lightbulb, Target, BookOpen, CheckCircle, Star, Shield } from 'lucide-react';

interface BlogContentData {
  introduction?: string;
  whatIs?: string;
  features?: { icon: string; title: string; description: string }[];
  howToUse?: { step: number; title: string; description: string }[];
  useCases?: { icon: string; title: string; description: string }[];
  proTips?: string[];
  technicalDetails?: string;
  comparisonTitle?: string;
  competitor1Name?: string;
  competitor2Name?: string;
  comparisonRows?: any[];
  faqs?: { question: string; answer: string }[];
  videoId?: string;
  videoTitle?: string;
  privacyNote?: string;
  relatedTools?: { name: string; slug: string; description: string }[];
}

export default function BlogContentRenderer({ content }: { content: BlogContentData }) {
  const { themeColors } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ FIX: Static fallback colors for server + first client render
  const staticColors = {
    background: '#f8fafc',
    surface: '#ffffff',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    primary: '#3b82f6',
  };

  const colors = mounted
    ? {
        background: themeColors?.background || staticColors.background,
        surface: themeColors?.surface || staticColors.surface,
        textPrimary: themeColors?.text?.primary || staticColors.textPrimary,
        textSecondary: themeColors?.text?.secondary || staticColors.textSecondary,
        border: themeColors?.border || staticColors.border,
        primary: themeColors?.primary || staticColors.primary,
      }
    : staticColors;

  if (!content) return null;

  return (
    <div className="blog-content space-y-8" suppressHydrationWarning>
      {/* 1. Introduction */}
      {content.introduction && (
        <section suppressHydrationWarning>
          <p className="text-lg leading-relaxed" suppressHydrationWarning style={{ color: colors.textSecondary }}>{content.introduction}</p>
        </section>
      )}

      {/* 2. What Is */}
      {content.whatIs && (
        <section suppressHydrationWarning>
          <h2 className="text-2xl font-bold mb-3" suppressHydrationWarning style={{ color: colors.textPrimary }}>📖 What is This Tool?</h2>
          <p className="leading-relaxed" suppressHydrationWarning style={{ color: colors.textSecondary }}>{content.whatIs}</p>
        </section>
      )}

      {/* 3. Video Tutorial */}
      {content.videoId && <BlogVideo videoId={content.videoId} title={content.videoTitle || 'Tutorial'} />}

      {/* 4. Features */}
      {content.features && content.features.length > 0 && (
        <section suppressHydrationWarning>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" suppressHydrationWarning style={{ color: colors.textPrimary }}>
            <Star size={24} style={{ color: '#f59e0b' }} /> Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.features.map((f, i) => (
              <div key={i} className="p-4 rounded-xl border" suppressHydrationWarning style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <h3 className="font-bold mb-1" suppressHydrationWarning style={{ color: colors.textPrimary }}>{f.title}</h3>
                    <p className="text-sm" suppressHydrationWarning style={{ color: colors.textSecondary }}>{f.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. How to Use */}
      {content.howToUse && content.howToUse.length > 0 && (
        <section suppressHydrationWarning>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" suppressHydrationWarning style={{ color: colors.textPrimary }}>
            <BookOpen size={24} style={{ color: colors.primary }} /> How to Use
          </h2>
          <div className="space-y-4">
            {content.howToUse.map((step, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border" suppressHydrationWarning style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0" suppressHydrationWarning style={{ backgroundColor: colors.primary }}>
                  {step.step}
                </div>
                <div>
                  <h3 className="font-bold" suppressHydrationWarning style={{ color: colors.textPrimary }}>{step.title}</h3>
                  <p className="text-sm" suppressHydrationWarning style={{ color: colors.textSecondary }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Use Cases */}
      {content.useCases && content.useCases.length > 0 && (
        <section suppressHydrationWarning>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" suppressHydrationWarning style={{ color: colors.textPrimary }}>
            <Target size={24} style={{ color: '#ef4444' }} /> Real-World Use Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.useCases.map((uc, i) => (
              <div key={i} className="p-4 rounded-xl border" suppressHydrationWarning style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{uc.icon}</span>
                  <div>
                    <h3 className="font-bold" suppressHydrationWarning style={{ color: colors.textPrimary }}>{uc.title}</h3>
                    <p className="text-sm" suppressHydrationWarning style={{ color: colors.textSecondary }}>{uc.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Comparison Table */}
      {content.comparisonRows && content.comparisonRows.length > 0 && (
        <BlogComparison
          title={content.comparisonTitle || 'Tool Comparison'}
          rows={content.comparisonRows}
          competitor1Name={content.competitor1Name || 'Competitor 1'}
          competitor2Name={content.competitor2Name || 'Competitor 2'}
        />
      )}

      {/* 8. Pro Tips */}
      {content.proTips && content.proTips.length > 0 && (
        <section suppressHydrationWarning>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" suppressHydrationWarning style={{ color: colors.textPrimary }}>
            <Lightbulb size={24} style={{ color: '#f59e0b' }} /> Pro Tips
          </h2>
          <div className="space-y-2">
            {content.proTips.map((tip, i) => (
              <div key={i} className="p-3 rounded-lg" suppressHydrationWarning style={{ backgroundColor: '#f59e0b10', borderLeft: '3px solid #f59e0b' }}>
                <p className="text-sm" suppressHydrationWarning style={{ color: colors.textPrimary }}>{tip}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. Technical Details */}
      {content.technicalDetails && (
        <section suppressHydrationWarning>
          <h2 className="text-2xl font-bold mb-3" suppressHydrationWarning style={{ color: colors.textPrimary }}>⚙️ How It Works</h2>
          <div className="p-4 rounded-xl border" suppressHydrationWarning style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
            <pre className="text-sm whitespace-pre-wrap" suppressHydrationWarning style={{ color: colors.textSecondary, fontFamily: 'monospace' }}>{content.technicalDetails}</pre>
          </div>
        </section>
      )}

      {/* 10. FAQ */}
      {content.faqs && content.faqs.length > 0 && <BlogFAQ faqs={content.faqs} />}

      {/* 11. Privacy Note */}
      {content.privacyNote && (
        <section suppressHydrationWarning>
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2" suppressHydrationWarning style={{ color: colors.textPrimary }}>
            <Shield size={24} style={{ color: '#10b981' }} /> Privacy Note
          </h2>
          <p className="text-sm leading-relaxed" suppressHydrationWarning style={{ color: colors.textSecondary }}>{content.privacyNote}</p>
        </section>
      )}
    </div>
  );
}