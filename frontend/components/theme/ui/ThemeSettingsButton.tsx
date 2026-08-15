'use client';

import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { 
  Palette, 
  Type, 
  Moon, 
  Sun,
  X,
  Settings,
  ChevronRight,
  Check
} from 'lucide-react';

const ThemeSettingsButton = () => {
  const { 
    theme, 
    setTheme, 
    availableThemes, 
    availableFonts, 
    fontFamily, 
    setFontFamily,
    isDarkMode,
    toggleDarkMode,
    lang
  } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<'main' | 'themes' | 'fonts'>('main');
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const pathLang = path.split('/')[1];
      if (pathLang === 'ur' || pathLang === 'ar' || pathLang === 'hi') {
        setCurrentLang(pathLang);
      } else {
        setCurrentLang('en');
      }
    }
  }, [lang]);

  if (!isMounted) {
    return null;
  }

  const isRTL = currentLang === 'ur' || currentLang === 'ar';

  const getTitle = () => {
    if (currentLang === 'ur') return 'تھیم کی ترتیبات';
    if (currentLang === 'ar') return 'إعدادات المظهر';
    if (currentLang === 'hi') return 'थीम सेटिंग्स';
    return 'Theme Settings';
  };

  const getDarkModeLabel = () => {
    if (currentLang === 'ur') return 'ڈارک موڈ';
    if (currentLang === 'ar') return 'الوضع المظلم';
    if (currentLang === 'hi') return 'डार्क मोड';
    return 'Dark Mode';
  };

  const getDarkModeStatus = () => {
    if (currentLang === 'ur') return isDarkMode ? 'فی الحال آن ہے' : 'فی الحال آف ہے';
    if (currentLang === 'ar') return isDarkMode ? 'قيد التشغيل حالياً' : 'قيد الإيقاف حالياً';
    if (currentLang === 'hi') return isDarkMode ? 'वर्तमान में चालू है' : 'वर्तमान में बंद है';
    return isDarkMode ? 'Currently on' : 'Currently off';
  };

  const getThemesLabel = () => {
    if (currentLang === 'ur') return 'تھیمز';
    if (currentLang === 'ar') return 'المظاهر';
    if (currentLang === 'hi') return 'थीम्स';
    return 'Themes';
  };

  const getFontsLabel = () => {
    if (currentLang === 'ur') return 'فونٹس';
    if (currentLang === 'ar') return 'الخطوط';
    if (currentLang === 'hi') return 'फ़ॉन्ट्स';
    return 'Fonts';
  };

  const getSelectThemeLabel = () => {
    if (currentLang === 'ur') return 'تھیم منتخب کریں';
    if (currentLang === 'ar') return 'اختر المظهر';
    if (currentLang === 'hi') return 'थीम चुनें';
    return 'Select Theme';
  };

  const getSelectFontLabel = () => {
    if (currentLang === 'ur') return 'فونٹ فیملی منتخب کریں';
    if (currentLang === 'ar') return 'اختر عائلة الخطوط';
    if (currentLang === 'hi') return 'फ़ॉन्ट परिवार चुनें';
    return 'Select Font Family';
  };

  const getBackLabel = () => {
    if (currentLang === 'ur') return 'ترتیبات پر واپس جائیں';
    if (currentLang === 'ar') return 'العودة إلى الإعدادات';
    if (currentLang === 'hi') return 'सेटिंग्स पर वापस जाएं';
    return 'Back to Settings';
  };

  const getPreviewText = () => {
    if (currentLang === 'ur') return 'جلدی بھورا لومڑی آرام دہ کتے کے اوپر کود گیا';
    if (currentLang === 'ar') return 'الثعلب البني السريع يقفز فوق الكلب الكسول';
    if (currentLang === 'hi') return 'तेज भूरी लोमड़ी आलसी कुत्ते के ऊपर कूद गई';
    return 'The quick brown fox jumps over the lazy dog';
  };

  const getCategoryLabel = (category: string) => {
    if (currentLang === 'ur') {
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
    if (currentLang === 'ar') {
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
    if (currentLang === 'hi') {
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
      {/* Main Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        title={getTitle()}
        aria-label="Open theme settings"
        style={{
          background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
          color: 'var(--text-accent)',
          border: '2px solid var(--border)'
        }}
      >
        <Settings className="h-6 w-6" />
      </button>

      {/* Side Menu Modal */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-1000"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Side Menu */}
          <div 
            className={`fixed top-0 h-full w-80 z-1001 transform transition-transform duration-300 ease-out ${
              isRTL ? 'left-0' : 'right-0'
            }`}
            style={{ 
              transform: isOpen ? 'translateX(0)' : (isRTL ? 'translateX(-100%)' : 'translateX(100%)'),
              backgroundColor: 'var(--background)',
              borderLeft: isRTL ? 'none' : '1px solid var(--border)',
              borderRight: isRTL ? '1px solid var(--border)' : 'none',
              boxShadow: 'var(--shadow)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {getTitle()}
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ 
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--surface)'
                  }}
                  aria-label="Close theme settings"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="h-[calc(100vh-64px)] overflow-y-auto p-4">
              {/* Main Menu */}
              {activeSection === 'main' && (
                <div className="space-y-3">
                  {/* Dark/Light Mode Toggle */}
                  <button
                    onClick={toggleDarkMode}
                    className="w-full p-4 rounded-lg flex items-center justify-between transition-all hover:opacity-90"
                    style={{ 
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)'
                    }}
                    aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--text-accent)' }}>
                        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      </div>
                      <div className={`text-${isRTL ? 'right' : 'left'}`}>
                        <div className="font-medium">{getDarkModeLabel()}</div>
                        <div className="text-sm opacity-75">
                          {getDarkModeStatus()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-10 h-6 rounded-full flex items-center p-1 ${isDarkMode ? 'justify-end' : 'justify-start'}`}
                        style={{ backgroundColor: isDarkMode ? 'var(--primary)' : 'var(--border)' }}
                      >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'var(--background)' }}></div>
                      </div>
                    </div>
                  </button>

                  {/* Themes Option */}
                  <button
                    onClick={() => setActiveSection('themes')}
                    className="w-full p-4 rounded-lg flex items-center justify-between transition-all hover:opacity-90"
                    style={{ 
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)'
                    }}
                    aria-label="Open themes selection"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--text-accent)' }}>
                        <Palette className="h-4 w-4" />
                      </div>
                      <div className={`text-${isRTL ? 'right' : 'left'}`}>
                        <div className="font-medium">{getThemesLabel()}</div>
                        <div className="text-sm opacity-75">
                          {availableThemes.find(t => t.value === theme)?.label || getSelectThemeLabel()}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 opacity-75 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Fonts Option */}
                  <button
                    onClick={() => setActiveSection('fonts')}
                    className="w-full p-4 rounded-lg flex items-center justify-between transition-all hover:opacity-90"
                    style={{ 
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)'
                    }}
                    aria-label="Open fonts selection"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--success)', color: 'var(--text-accent)' }}>
                        <Type className="h-4 w-4" />
                      </div>
                      <div className={`text-${isRTL ? 'right' : 'left'}`}>
                        <div className="font-medium">{getFontsLabel()}</div>
                        <div className="text-sm opacity-75">
                          {availableFonts.find(f => f.value === fontFamily)?.label || getSelectFontLabel()}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 opacity-75 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}

              {/* Themes Section */}
              {activeSection === 'themes' && (
                <div>
                  {/* Back Button */}
                  <button
                    onClick={() => setActiveSection('main')}
                    className="mb-4 flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--primary)' }}
                    aria-label="Back to main settings"
                  >
                    <ChevronRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                    {getBackLabel()}
                  </button>

                  <div className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }} role="heading" aria-level={4}>
                    {getSelectThemeLabel()}
                  </div>

                  <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {availableThemes.map((themeOption) => (
                      <button
                        key={themeOption.value}
                        onClick={() => {
                          setTheme(themeOption.value);
                          setActiveSection('main');
                        }}
                        className={`w-full p-4 rounded-lg flex items-center justify-between transition-all ${theme === themeOption.value ? 'border-2' : 'border hover:border-2'}`}
                        style={{ 
                          backgroundColor: theme === themeOption.value ? 'var(--surface)' : 'var(--background)',
                          borderColor: theme === themeOption.value ? 'var(--primary)' : 'var(--border)',
                          color: 'var(--text-primary)'
                        }}
                        aria-label={`Select ${themeOption.label} theme`}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full border-2"
                            style={{ 
                              borderColor: 'var(--background)',
                              background: `linear-gradient(135deg, ${
                                themeOption.value.includes('blue') ? '#2563EB' : 
                                themeOption.value.includes('green') ? '#059669' : 
                                themeOption.value.includes('purple') ? '#7C3AED' : 
                                themeOption.value.includes('gold') ? '#D97706' : 
                                themeOption.value.includes('gray') ? '#4B5563' : '#06B6D4'
                              }, ${
                                themeOption.value.includes('blue') ? '#1E40AF' : 
                                themeOption.value.includes('green') ? '#047857' : 
                                themeOption.value.includes('purple') ? '#6D28D9' : 
                                themeOption.value.includes('gold') ? '#B45309' : 
                                themeOption.value.includes('gray') ? '#374151' : '#0891B2'
                              })` 
                            }}
                          />
                          <div className={`text-${isRTL ? 'right' : 'left'}`}>
                            <div className="font-medium">
                              {themeOption.label}
                            </div>
                            <div className="text-xs opacity-75">
                              {getCategoryLabel(themeOption.category || 'creative')}
                            </div>
                          </div>
                        </div>
                        {theme === themeOption.value && (
                          <Check className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fonts Section */}
              {activeSection === 'fonts' && (
                <div>
                  {/* Back Button */}
                  <button
                    onClick={() => setActiveSection('main')}
                    className="mb-4 flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--primary)' }}
                    aria-label="Back to main settings"
                  >
                    <ChevronRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                    {getBackLabel()}
                  </button>

                  <div className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }} role="heading" aria-level={4}>
                    {getSelectFontLabel()}
                  </div>

                  <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {availableFonts.map((font) => (
                      <button
                        key={font.value}
                        onClick={() => {
                          setFontFamily(font.value);
                          setActiveSection('main');
                        }}
                        className={`w-full p-4 rounded-lg flex items-center justify-between transition-all ${fontFamily === font.value ? 'border-2' : 'border hover:border-2'}`}
                        style={{ 
                          fontFamily: font.value,
                          backgroundColor: fontFamily === font.value ? 'var(--surface)' : 'var(--background)',
                          borderColor: fontFamily === font.value ? 'var(--primary)' : 'var(--border)',
                          color: 'var(--text-primary)'
                        }}
                        aria-label={`Select ${font.label} font`}
                      >
                        <div className={`text-${isRTL ? 'right' : 'left'} flex-1`}>
                          <div className="font-medium">
                            {font.label}
                          </div>
                          <div 
                            className="text-xs mt-1 opacity-75" 
                            style={{ fontFamily: font.value }}
                          >
                            {getPreviewText()}
                          </div>
                        </div>
                        {fontFamily === font.value && (
                          <Check className="h-5 w-5 ml-2" style={{ color: 'var(--primary)' }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ThemeSettingsButton;