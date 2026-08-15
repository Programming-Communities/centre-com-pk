'use client';
import BlogFAQ from './BlogFAQ';
import BlogComparison from './BlogComparison';
import BlogVideo from './BlogVideo';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
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

  if (!content) return null;

  return (
    <div className="blog-content space-y-8">
      {/* 1. Introduction */}
      {content.introduction && (
        <section>
          <p className="text-lg leading-relaxed" style={{ color: themeColors.text?.secondary }}>{content.introduction}</p>
        </section>
      )}

      {/* 2. What Is */}
      {content.whatIs && (
        <section>
          <h2 className="text-2xl font-bold mb-3" style={{ color: themeColors.text?.primary }}>📖 What is This Tool?</h2>
          <p className="leading-relaxed" style={{ color: themeColors.text?.secondary }}>{content.whatIs}</p>
        </section>
      )}

      {/* 3. Video Tutorial */}
      {content.videoId && <BlogVideo videoId={content.videoId} title={content.videoTitle || 'Tutorial'} />}

      {/* 4. Features */}
      {content.features && content.features.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: themeColors.text?.primary }}>
            <Star size={24} style={{ color: '#f59e0b' }} /> Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.features.map((f, i) => (
              <div key={i} className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, backgroundColor: themeColors.surface }}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: themeColors.text?.primary }}>{f.title}</h3>
                    <p className="text-sm" style={{ color: themeColors.text?.secondary }}>{f.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. How to Use */}
      {content.howToUse && content.howToUse.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: themeColors.text?.primary }}>
            <BookOpen size={24} style={{ color: themeColors.primary }} /> How to Use
          </h2>
          <div className="space-y-4">
            {content.howToUse.map((step, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border" style={{ borderColor: themeColors.border, backgroundColor: themeColors.surface }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0" style={{ backgroundColor: themeColors.primary }}>
                  {step.step}
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: themeColors.text?.primary }}>{step.title}</h3>
                  <p className="text-sm" style={{ color: themeColors.text?.secondary }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Use Cases */}
      {content.useCases && content.useCases.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: themeColors.text?.primary }}>
            <Target size={24} style={{ color: '#ef4444' }} /> Real-World Use Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.useCases.map((uc, i) => (
              <div key={i} className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, backgroundColor: themeColors.surface }}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{uc.icon}</span>
                  <div>
                    <h3 className="font-bold" style={{ color: themeColors.text?.primary }}>{uc.title}</h3>
                    <p className="text-sm" style={{ color: themeColors.text?.secondary }}>{uc.description}</p>
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
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: themeColors.text?.primary }}>
            <Lightbulb size={24} style={{ color: '#f59e0b' }} /> Pro Tips
          </h2>
          <div className="space-y-2">
            {content.proTips.map((tip, i) => (
              <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: '#f59e0b10', borderLeft: '3px solid #f59e0b' }}>
                <p className="text-sm" style={{ color: themeColors.text?.primary }}>{tip}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. Technical Details */}
      {content.technicalDetails && (
        <section>
          <h2 className="text-2xl font-bold mb-3" style={{ color: themeColors.text?.primary }}>⚙️ How It Works</h2>
          <div className="p-4 rounded-xl border" style={{ borderColor: themeColors.border, backgroundColor: themeColors.surface }}>
            <pre className="text-sm whitespace-pre-wrap" style={{ color: themeColors.text?.secondary, fontFamily: 'monospace' }}>{content.technicalDetails}</pre>
          </div>
        </section>
      )}

      {/* 10. FAQ */}
      {content.faqs && content.faqs.length > 0 && <BlogFAQ faqs={content.faqs} />}

      {/* 11. Privacy Note */}
      {content.privacyNote && (
        <section>
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2" style={{ color: themeColors.text?.primary }}>
            <Shield size={24} style={{ color: '#10b981' }} /> Privacy Note
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: themeColors.text?.secondary }}>{content.privacyNote}</p>
        </section>
      )}
    </div>
  );
}
