"use client";

import Link from 'next/link';

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  variant?: 'default' | 'centered' | 'split';
  lang: string;
}

export default function CTASection({ 
  title = "Ready to get started?",
  description = "Trusted by thousands of users for their daily tool needs. All tools are completely free, no registration required.",
  primaryButtonText = "Explore All Tools",
  primaryButtonHref = "/tools",
  secondaryButtonText = "Browse Categories",
  secondaryButtonHref = "/categories",
  variant = 'default',
  lang
}: CTASectionProps) {

  // ✅ FIXED: Hard-coded translations for Urdu
  const isUrdu = lang === 'ur';
  const isArabic = lang === 'ar';
  const isHindi = lang === 'hi';
  
  // Urdu translations
  const urduTexts = {
    instantAccess: 'فوری رسائی',
    privacyFirst: 'پرائیویسی فرسٹ',
    mobileFriendly: 'موبائل فرینڈلی',
    noAds: 'کوئی اشتہار نہیں',
    getStarted: 'شروع کریں',
    getStartedDesc: 'ہمارے ٹولز براؤز کریں اور فوری استعمال شروع کریں',
    findTools: 'ٹولز تلاش کریں',
    findToolsDesc: 'مخصوص ٹولز تلاش کریں یا زمرہ جات کے لحاظ سے براؤز کریں',
    needHelp: 'مدد چاہیے؟',
    needHelpDesc: 'ہماری دستاویزات دیکھیں یا سپورٹ سے رابطہ کریں',
    freeTools: 'مفت ٹولز',
    noRegistration: 'کوئی رجسٹریشن نہیں',
    uptime: 'اپ ٹائم',
    monthlyUsers: 'ماہانہ صارفین ہمارے ٹولز پر اعتماد کرتے ہیں',
  };

  // Arabic translations
  const arabicTexts = {
    instantAccess: 'وصول فوري',
    privacyFirst: 'الخصوصية أولاً',
    mobileFriendly: 'متوافق مع الجوال',
    noAds: 'بدون إعلانات',
    getStarted: 'ابدأ الآن',
    getStartedDesc: 'تصفح أدواتنا وابدأ استخدامها فوراً',
    findTools: 'ابحث عن أدوات',
    findToolsDesc: 'ابحث عن أدوات محددة أو تصفح حسب الفئة',
    needHelp: 'هل تحتاج مساعدة؟',
    needHelpDesc: 'راجع وثائقنا أو اتصل بالدعم',
    freeTools: 'أدوات مجانية',
    noRegistration: 'بدون تسجيل',
    uptime: 'وقت التشغيل',
    monthlyUsers: 'مستخدم شهرياً يثقون بأدواتنا',
  };

  // Hindi translations
  const hindiTexts = {
    instantAccess: 'तुरंत पहुंच',
    privacyFirst: 'प्राइवेसी फर्स्ट',
    mobileFriendly: 'मोबाइल फ्रेंडली',
    noAds: 'कोई विज्ञापन नहीं',
    getStarted: 'शुरू करें',
    getStartedDesc: 'हमारे टूल्स ब्राउज़ करें और तुरंत उपयोग शुरू करें',
    findTools: 'टूल्स खोजें',
    findToolsDesc: 'विशिष्ट टूल्स खोजें या श्रेणी के अनुसार ब्राउज़ करें',
    needHelp: 'मदद चाहिए?',
    needHelpDesc: 'हमारे दस्तावेज़ देखें या सहायता से संपर्क करें',
    freeTools: 'मुफ्त टूल्स',
    noRegistration: 'कोई पंजीकरण नहीं',
    uptime: 'अपटाइम',
    monthlyUsers: 'मासिक उपयोगकर्ता हमारे टूल्स पर भरोसा करते हैं',
  };

  // Select texts based on language
  const texts = isUrdu ? urduTexts : isArabic ? arabicTexts : isHindi ? hindiTexts : {
    instantAccess: 'Instant Access',
    privacyFirst: 'Privacy First',
    mobileFriendly: 'Mobile Friendly',
    noAds: 'No Ads',
    getStarted: 'Get Started',
    getStartedDesc: 'Browse our tools and start using them instantly',
    findTools: 'Find Tools',
    findToolsDesc: 'Search for specific tools or browse by category',
    needHelp: 'Need Help?',
    needHelpDesc: 'Check our documentation or contact support',
    freeTools: 'Free Tools',
    noRegistration: 'No Registration',
    uptime: 'Uptime',
    monthlyUsers: 'monthly users trust our tools',
  };

  const getLocalizedHref = (href: string): string => {
    if (href.startsWith('/')) {
      return `/${lang}${href}`;
    }
    return href;
  };

  if (variant === 'split') {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary">
                {title}
              </h2>
              <p className="text-lg mb-8 text-text-secondary">
                {description}
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { value: '55', label: texts.freeTools },
                  { value: '100%', label: texts.noRegistration },
                  { value: '24/7', label: texts.uptime }
                ].map((stat, index) => (
                  <div key={index} className="text-center p-4 rounded-xl bg-surface">
                    <div className="text-2xl font-bold mb-1 text-primary">
                      {stat.value}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={getLocalizedHref(primaryButtonHref)}
                  className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg text-center"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--surface)',
                  }}
                >
                  {primaryButtonText}
                </Link>
                <Link
                  href={getLocalizedHref(secondaryButtonHref)}
                  className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 text-center"
                  style={{
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)',
                    border: '2px solid var(--border)',
                  }}
                >
                  {secondaryButtonText}
                </Link>
              </div>
            </div>

            {/* Right side - Graphic */}
            <div className="relative">
              <div className="aspect-square rounded-2xl p-8"
                   style={{
                     background: `linear-gradient(135deg, var(--primary)20, var(--secondary)20)`,
                     border: '1px solid var(--border)',
                   }}>
                <div className="grid grid-cols-3 gap-4 h-full">
                  {['🎓', '💻', '🧮', '🎨', '🔒', '⚡'].map((icon, index) => (
                    <div key={index} className="rounded-xl flex items-center justify-center text-3xl"
                         style={{
                           backgroundColor: 'var(--surface)',
                           border: '1px solid var(--border)',
                         }}>
                      {icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'centered') {
    return (
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary">
            {title}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-text-secondary">
            {description}
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: '🚀', label: texts.instantAccess },
              { icon: '🔒', label: texts.privacyFirst },
              { icon: '📱', label: texts.mobileFriendly },
              { icon: '✨', label: texts.noAds }
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center p-4">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <div className="text-sm text-text-secondary">
                  {feature.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={getLocalizedHref(primaryButtonHref)}
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--surface)',
              }}
            >
              {primaryButtonText}
            </Link>
            <Link
              href={getLocalizedHref(secondaryButtonHref)}
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105"
              style={{
                backgroundColor: 'var(--surface)',
                color: 'var(--text-primary)',
                border: '2px solid var(--border)',
              }}
            >
              {secondaryButtonText}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Default variant
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0"
           style={{
             background: `linear-gradient(135deg, var(--primary)10, var(--secondary)10)`,
           }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary">
            {title}
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto text-text-secondary">
            {description}
          </p>

          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            {[
              {
                icon: '🚀',
                title: texts.getStarted,
                description: texts.getStartedDesc
              },
              {
                icon: '🔍',
                title: texts.findTools,
                description: texts.findToolsDesc
              },
              {
                icon: '💡',
                title: texts.needHelp,
                description: texts.needHelpDesc
              }
            ].map((card, index) => (
              <div key={index} className="p-6 rounded-2xl text-center bg-surface border border-border">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-text-primary">
                  {card.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={getLocalizedHref(primaryButtonHref)}
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--surface)',
              }}
            >
              {primaryButtonText}
            </Link>
            <Link
              href={getLocalizedHref(secondaryButtonHref)}
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105"
              style={{
                backgroundColor: 'var(--surface)',
                color: 'var(--text-primary)',
                border: '2px solid var(--border)',
              }}
            >
              {secondaryButtonText}
            </Link>
          </div>

          {/* Additional info */}
          <div className="mt-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface border border-border">
              <div className="text-sm text-text-secondary">
                <span className="font-semibold text-primary">
                  Thousands
                </span>{' '}
                {texts.monthlyUsers}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}