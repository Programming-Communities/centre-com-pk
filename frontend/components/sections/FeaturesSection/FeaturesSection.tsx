// components/sections/FeaturesSection/FeaturesSection.tsx
"use client";

import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesSectionProps {
  features: Feature[];
  variant?: 'grid' | 'list' | 'cards';
  lang: string;
}

// ✅ HARD-CODED LANGUAGE FALLBACKS
const getFallbacks = (lang: string) => {
  const fallbacks: Record<string, any> = {
    ur: {
      learnMore: 'مزید جانیں',
      missionTitle: 'ہمارا مشن',
      missionText: 'مفت، اعلیٰ معیار کے ٹولز فراہم کرنا جو روزمرہ کے کاموں کو سب کے لیے آسان بنائیں'
    },
    ar: {
      learnMore: 'اعرف المزيد',
      missionTitle: 'مهمتنا',
      missionText: 'توفير أدوات مجانية عالية الجودة تجعل المهام اليومية أسهل للجميع'
    },
    hi: {
      learnMore: 'और जानें',
      missionTitle: 'हमारा मिशन',
      missionText: 'मुफ्त, उच्च गुणवत्ता वाले टूल्स प्रदान करना जो रोजमर्रा के कार्यों को सभी के लिए आसान बनाते हैं'
    },
    en: {
      learnMore: 'Learn More',
      missionTitle: 'Our Mission',
      missionText: 'To provide free, high-quality tools that make everyday tasks easier for everyone'
    }
  };
  return fallbacks[lang] || fallbacks.en;
};

export default function FeaturesSection({ 
  features,
  variant = 'grid',
  lang
}: FeaturesSectionProps) {
  
  const { themeColors } = useTheme();
  const { t } = useTranslation({ namespace: 'common' });
  const fallbacks = getFallbacks(lang);

  // Try translation first, fallback to hard-coded
  const learnMoreText = t('action.learn_more') !== 'action.learn_more' 
    ? t('action.learn_more') 
    : fallbacks.learnMore;
    
  const missionTitle = t('mission.title') !== 'mission.title' 
    ? t('mission.title') 
    : fallbacks.missionTitle;
    
  const missionText = t('mission.text') !== 'mission.text' 
    ? t('mission.text') 
    : fallbacks.missionText;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <article key={index} className="relative group h-full rounded-2xl p-6 transition-all duration-300 hover:shadow-theme-medium hover:-translate-y-1 bg-surface border border-border hover:border-primary">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-3xl bg-primary-20" style={{ color: themeColors.primary }}>
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold mb-3" style={{ color: themeColors.text.primary }}>
                  {feature.title}
                </h3>
                <p className="mb-6" style={{ color: themeColors.text.secondary }}>
                  {feature.description}
                </p>

                <div className="flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: themeColors.primary }}>
                  <span>{learnMoreText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border border-primary-30 bg-primary-10 max-w-2xl mx-auto">
            <div className="text-3xl">🎯</div>
            <div>
              <div className="font-bold text-lg mb-2" style={{ color: themeColors.primary }}>
                {missionTitle}
              </div>
              <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                {missionText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}