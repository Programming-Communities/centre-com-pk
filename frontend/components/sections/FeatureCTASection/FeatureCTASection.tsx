import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation'; // ✅ ADDED

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesSectionProps {
  features: Feature[];
  variant?: 'grid' | 'list' | 'cards';
  lang: string; // ✅ Keep for translations
}

// ✅ Server Component - but we'll use translations from parent
export default async function FeaturesSection({ 
  features,
  variant = 'grid',
  lang
}: FeaturesSectionProps) {

  // ✅ Load translations for this component
  const getTranslations = async () => {
    try {
      const translations = await import(`@/translations/${lang}/common.json`)
        .then(module => module.default)
        .catch(() => import(`@/translations/en/common.json`).then(m => m.default));
      return translations;
    } catch (error) {
      return {};
    }
  };

  const translations = await getTranslations();
  
  // ✅ Helper function for translations
  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue || key;
      }
    }
    
    return typeof value === 'string' ? value : (defaultValue || key);
  };

  if (variant === 'list') {
    return (
      <section className="py-16" aria-labelledby="features-list-title">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 id="features-list-title" className="sr-only">{t('features.title', 'Features List')}</h2>
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-start gap-6 p-4 rounded-xl hover:bg-surface-light transition-colors"
                role="article"
                aria-label={`${t('features.feature')}: ${feature.title}`}
              >
                <div 
                  className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl 
                            bg-primary-20 text-primary"
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'cards') {
    return (
      <section className="py-16 bg-background" aria-labelledby="features-cards-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 id="features-cards-title" className="sr-only">{t('features.title', 'Features')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <article 
                key={index} 
                className="group h-full rounded-2xl p-6 transition-all duration-300 
                           hover:scale-[1.02] hover:shadow-theme-medium 
                           bg-surface border border-border hover:border-primary
                           focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                aria-label={`${t('features.feature')}: ${feature.title}`}
              >
                <div className="text-4xl mb-4" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-primary">
                  {feature.title}
                </h3>
                <p className="mb-6 text-text-secondary">
                  {feature.description}
                </p>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center 
                             transition-transform group-hover:translate-x-2
                             bg-primary text-text-accent"
                  aria-hidden="true"
                >
                  <ArrowRight className="w-4 h-4" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default grid variant
  return (
    <section className="py-16" aria-labelledby="features-grid-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 id="features-grid-title" className="sr-only">{t('features.title', 'Features')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <article 
              key={index} 
              className="relative group h-full rounded-2xl p-6 transition-all duration-300
                         hover:shadow-theme-medium hover:-translate-y-1
                         bg-surface border border-border hover:border-primary
                         focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
              aria-label={`${t('features.feature')}: ${feature.title}`}
            >
              {/* Background Pattern */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                           transition-opacity duration-300 bg-gradient-primary-subtle"
                aria-hidden="true"
              />
              
              <div className="relative">
                {/* Icon */}
                <div 
                  className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-3xl
                             bg-primary-20 text-primary"
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold mb-3 text-text-primary">
                  {feature.title}
                </h3>
                <p className="mb-6 text-text-secondary">
                  {feature.description}
                </p>

                {/* "Learn more" link - ✅ FIXED with translations */}
                <div className="flex items-center gap-2 text-sm font-medium text-primary 
                               group-hover:text-primary-hover transition-colors">
                  <span>{t('action.learn_more', 'Learn more')}</span>
                  <ArrowRight 
                    className="w-4 h-4 transition-transform group-hover:translate-x-2" 
                    aria-hidden="true"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mission Statement - ✅ FIXED with translations */}
        <div className="text-center mt-12">
          <div 
            className="inline-flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl
                       border border-primary-30 bg-primary-10 max-w-2xl mx-auto"
            role="complementary"
            aria-label={t('mission.title', 'Our mission statement')}
          >
            <div className="text-3xl" aria-hidden="true">🎯</div>
            <div>
              <div className="font-bold text-lg mb-2 text-primary">
                {t('mission.title', 'Our Mission')}
              </div>
              <div className="text-sm text-text-secondary">
                {t('mission.description', 'To provide free, high-quality tools that make everyday tasks easier for everyone')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}