'use client';

import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { Type, X } from 'lucide-react';

const FontSelector = () => {
  const { fontFamily, setFontFamily, availableFonts, lang } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const isRTL = lang === 'ur' || lang === 'ar';

  // Get translated text based on language
  const getModalTitle = () => {
    if (lang === 'ur') return 'فونٹ فیملی منتخب کریں';
    if (lang === 'ar') return 'اختر عائلة الخطوط';
    if (lang === 'hi') return 'फ़ॉन्ट परिवार चुनें';
    return 'Select Font Family';
  };

  const getDescription = () => {
    if (lang === 'ur') return 'بہتر پڑھنے کی اہلیت کے لیے فونٹ فیملی منتخب کریں۔ موجودہ:';
    if (lang === 'ar') return 'اختر عائلة خطوط لتحسين قابلية القراءة. الحالي:';
    if (lang === 'hi') return 'बेहतर पठनीयता के लिए फ़ॉन्ट परिवार चुनें। वर्तमान:';
    return 'Choose a font family for better readability. Current:';
  };

  const getCancelText = () => {
    if (lang === 'ur') return 'منسوخ کریں';
    if (lang === 'ar') return 'إلغاء';
    if (lang === 'hi') return 'रद्द करें';
    return 'Cancel';
  };

  const getTooltipText = () => {
    if (lang === 'ur') return 'فونٹ فیملی تبدیل کریں';
    if (lang === 'ar') return 'تغيير عائلة الخطوط';
    if (lang === 'hi') return 'फ़ॉन्ट परिवार बदलें';
    return 'Change Font Family';
  };

  const getPreviewText = () => {
    if (lang === 'ur') return 'جلدی بھورا لومڑی آرام دہ کتے کے اوپر کود گیا';
    if (lang === 'ar') return 'الثعلب البني السريع يقفز فوق الكلب الكسول';
    if (lang === 'hi') return 'तेज भूरी लोमड़ी आलसी कुत्ते के ऊपर कूद गई';
    return 'The quick brown fox jumps over the lazy dog';
  };

  return (
    <>
      {/* Font Selector Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="floating-theme-btn font-selector-btn group"
        title={getTooltipText()}
        style={{
          backgroundColor: 'var(--surface)',
          color: 'var(--text-primary)',
          border: '2px solid var(--border)'
        }}
      >
        <Type className="h-5 w-5" />
        
        {/* Tooltip - RTL/LTR aware */}
        <div 
          className={`absolute top-1/2 transform -translate-y-1/2 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none ${
            isRTL ? 'left-full ml-3' : 'right-full mr-3'
          }`}
          style={{
            backgroundColor: 'var(--surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)'
          }}
        >
          {getTooltipText()}
        </div>
      </button>

      {/* Font Modal */}
      {isOpen && (
        <div className="theme-modal-overlay" onClick={() => setIsOpen(false)}>
          <div 
            className="theme-modal font-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          >
            <div className="theme-modal-header">
              <h3>{getModalTitle()}</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="close-btn"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                {getDescription()} <span style={{ fontFamily }} className="font-semibold">{fontFamily}</span>
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
                  aria-label={`Select ${font.label} font`}
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

            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 px-4 rounded-md text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)'
                }}
              >
                {getCancelText()}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FontSelector;