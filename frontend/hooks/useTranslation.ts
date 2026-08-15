// hooks/useTranslation.ts
'use client';

import { useEffect, useState } from 'react';

const SUPPORTED_LANGUAGES = ['en', 'ur', 'ar', 'hi'];

interface UseTranslationOptions {
  namespace?: 'menu' | 'common' | 'pages' | 'tools' | 'tutorial' | 'home';
  category?: string;
}

let globalLang = 'en';
let globalTranslations: Record<string, Record<string, string>> = {};
const listeners: Set<() => void> = new Set();

export function setGlobalLang(lang: string) {
  if (globalLang !== lang) {
    globalLang = lang;
    listeners.forEach(listener => listener());
  }
}

export function useTranslation({ namespace = 'common', category }: UseTranslationOptions = {}) {
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(globalLang);
  const [dir, setDir] = useState<'ltr' | 'rtl'>(globalLang === 'ur' || globalLang === 'ar' ? 'rtl' : 'ltr');
  const [version, setVersion] = useState(0);
  
  const fullNamespace = category ? `${namespace}/${category}` : namespace;

  useEffect(() => {
    const update = () => {
      setLang(globalLang);
      setDir(globalLang === 'ur' || globalLang === 'ar' ? 'rtl' : 'ltr');
      setVersion(v => v + 1);
    };
    
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadTranslations = async () => {
      if (globalTranslations[`${lang}/${fullNamespace}`]) {
        if (isMounted) {
          setTranslations(globalTranslations[`${lang}/${fullNamespace}`]);
          setLoading(false);
        }
        return;
      }

      try {
        let module;
        if (namespace === 'tools' && category) {
          module = await import(`@/translations/${lang}/tools/${category}.json`);
        } else {
          module = await import(`@/translations/${lang}/${namespace}.json`);
        }
        
        if (isMounted) {
          const translationData = module.default || module;
          globalTranslations[`${lang}/${fullNamespace}`] = translationData;
          setTranslations(translationData);
          setLoading(false);
        }
      } catch (error) {
        try {
          let module;
          if (namespace === 'tools' && category) {
            module = await import(`@/translations/en/tools/${category}.json`);
          } else {
            module = await import(`@/translations/en/${namespace}.json`);
          }
          
          if (isMounted) {
            const translationData = module.default || module;
            globalTranslations[`en/${fullNamespace}`] = translationData;
            setTranslations(translationData);
            setLoading(false);
          }
        } catch (fallbackError) {
          setTranslations({});
          setLoading(false);
        }
      }
    };

    loadTranslations();

    return () => {
      isMounted = false;
    };
  }, [lang, fullNamespace, version]);

  // ✅ FIXED: t() function with nested key support
  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue || key;
      }
    }
    
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return JSON.stringify(value); // Fallback for arrays
    if (typeof value === 'object') return defaultValue || key;
    return String(value) || defaultValue || key;
  };

  return { t, loading, lang, dir };
}