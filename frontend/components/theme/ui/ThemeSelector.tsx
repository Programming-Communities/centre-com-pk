'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';

const IconClose = () => <span>✕</span>;

const ThemeSelector = () => {
  const { theme, setTheme, availableThemes, availableFonts, fontFamily, setFontFamily, lang } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'themes' | 'fonts'>('themes');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const isRTL = lang === 'ur' || lang === 'ar';

  const getTitle = () => {
    if (lang === 'ur') return 'تھیم کی ترتیبات';
    if (lang === 'ar') return 'إعدادات المظهر';
    if (lang === 'hi') return 'थीम सेटिंग्स';
    return 'Theme Settings';
  };

  const getThemesTab = () => {
    if (lang === 'ur') return 'تھیمز';
    if (lang === 'ar') return 'المظاهر';
    if (lang === 'hi') return 'थीम्स';
    return 'Themes';
  };

  const getFontsTab = () => {
    if (lang === 'ur') return 'فونٹس';
    if (lang === 'ar') return 'الخطوط';
    if (lang === 'hi') return 'फ़ॉन्ट्स';
    return 'Fonts';
  };

  const getThemeDescription = () => {
    if (lang === 'ur') return 'اپنے انٹرفیس کے لیے کلر تھیم منتخب کریں';
    if (lang === 'ar') return 'اختر مظهر ألوان لواجهتك';
    if (lang === 'hi') return 'अपने इंटरफेस के लिए रंग थीम चुनें';
    return 'Select a color theme for your interface';
  };

  const getFontDescription = () => {
    if (lang === 'ur') return 'بہتر پڑھنے کے لیے فونٹ فیملی منتخب کریں';
    if (lang === 'ar') return 'اختر عائلة خطوط لتحسين قابلية القراءة';
    if (lang === 'hi') return 'बेहतर पठनीयता के लिए फ़ॉन्ट परिवार चुनें';
    return 'Choose a font family for better readability';
  };

  const getPreviewText = () => {
    if (lang === 'ur') return 'جلدی بھورا لومڑی آرام دہ کتے کے اوپر کود گیا';
    if (lang === 'ar') return 'الثعلب البني السريع يقفز فوق الكلب الكسول';
    if (lang === 'hi') return 'तेज भूरी लोमड़ी आलसी कुत्ते के ऊपर कूद गई';
    return 'The quick brown fox jumps over the lazy dog';
  };

  const getCategoryLabel = (category: string) => {
    if (lang === 'ur') {
      const map: Record<string, string> = {
        'professional': 'پیشہ ورانہ',
        'premium': 'پریمیم',
        'minimal': 'کم سے کم',
        'tech': 'ٹیکنالوجی',
        'nature': 'قدرتی',
        'creative': 'تخلیقی'
      };
      return map[category] || category;
    }
    if (lang === 'ar') {
      const map: Record<string, string> = {
        'professional': 'احترافي',
        'premium': 'متميز',
        'minimal': 'بسيط',
        'tech': 'تقني',
        'nature': 'طبيعي',
        'creative': 'إبداعي'
      };
      return map[category] || category;
    }
    if (lang === 'hi') {
      const map: Record<string, string> = {
        'professional': 'पेशेवर',
        'premium': 'प्रीमियम',
        'minimal': 'न्यूनतम',
        'tech': 'तकनीकी',
        'nature': 'प्राकृतिक',
        'creative': 'रचनात्मक'
      };
      return map[category] || category;
    }
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <>
      {/* Theme Selector Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
        title={getTitle()}
        style={{
          backgroundColor: 'var(--surface)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border)'
        }}
      >
        <Palette className="h-5 w-5" />
      </button>

      {/* Theme Modal */}
      {isOpen && (
        <div className="theme-modal-overlay" onClick={() => setIsOpen(false)}>
          <div 
            className="theme-modal font-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          >
            <div className="theme-modal-header">
              <h3>{getTitle()}</h3>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <IconClose />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b mb-6" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setSelectedTab('themes')}
                className={`flex-1 py-3 font-medium text-sm ${selectedTab === 'themes' ? 'border-b-2' : 'opacity-70'}`}
                style={{ 
                  color: selectedTab === 'themes' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderColor: selectedTab === 'themes' ? 'var(--primary)' : 'transparent'
                }}
              >
                {getThemesTab()}
              </button>
              <button
                onClick={() => setSelectedTab('fonts')}
                className={`flex-1 py-3 font-medium text-sm ${selectedTab === 'fonts' ? 'border-b-2' : 'opacity-70'}`}
                style={{ 
                  color: selectedTab === 'fonts' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderColor: selectedTab === 'fonts' ? 'var(--primary)' : 'transparent'
                }}
              >
                {getFontsTab()}
              </button>
            </div>

            {/* Themes Tab Content */}
            {selectedTab === 'themes' && (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {getThemeDescription()}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableThemes.map((themeOption) => (
                    <button
                      key={themeOption.value}
                      onClick={() => {
                        setTheme(themeOption.value);
                        setIsOpen(false);
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                        theme === themeOption.value 
                          ? 'border-primary' 
                          : 'border-border hover:border-primary'
                      }`}
                      style={{
                        backgroundColor: theme === themeOption.value ? 'var(--surface)' : 'var(--background)',
                        borderColor: theme === themeOption.value ? 'var(--primary)' : 'var(--border)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <div 
                        className="w-12 h-12 rounded-full mb-2 border"
                        style={{ 
                          borderColor: 'var(--border)',
                          background: `linear-gradient(135deg, ${themeOption.value.includes('blue') ? '#2563EB' : 
                            themeOption.value.includes('green') ? '#059669' : 
                            themeOption.value.includes('purple') ? '#7C3AED' : 
                            themeOption.value.includes('gold') ? '#D97706' : 
                            themeOption.value.includes('gray') ? '#4B5563' : '#06B6D4'}, ${
                            themeOption.value.includes('blue') ? '#1E40AF' : 
                            themeOption.value.includes('green') ? '#047857' : 
                            themeOption.value.includes('purple') ? '#6D28D9' : 
                            themeOption.value.includes('gold') ? '#B45309' : 
                            themeOption.value.includes('gray') ? '#374151' : '#0891B2'
                          })` 
                        }}
                      />
                      <span className="text-xs font-medium mt-1">
                        {themeOption.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fonts Tab Content */}
            {selectedTab === 'fonts' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {getFontDescription()}
                  </p>
                </div>
                
                <div className="font-options max-h-96 overflow-y-auto">
                  {availableFonts.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => {
                        setFontFamily(font.value);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg mb-2 transition-all ${
                        fontFamily === font.value ? 'active border-2' : 'border'
                      }`}
                      style={{ 
                        fontFamily: font.value,
                        backgroundColor: fontFamily === font.value ? 'var(--surface)' : 'var(--background)',
                        borderColor: fontFamily === font.value ? 'var(--primary)' : 'var(--border)',
                        color: 'var(--text-primary)',
                        textAlign: isRTL ? 'right' : 'left'
                      }}
                    >
                      <div className="font-medium">{font.label}</div>
                      <div 
                        className="font-preview text-xs mt-1 opacity-70" 
                        style={{ fontFamily: font.value }}
                      >
                        {getPreviewText()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ThemeSelector;