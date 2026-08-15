// lib/i18n/getTranslations.ts
export async function getTranslations(lang: string, namespace: string) {
  try {
    const module = await import(`@/translations/${lang}/${namespace}.json`);
    const translations = module.default || module;
    
    return (key: string, defaultValue?: string): string => {
      const keys = key.split('.');
      let value: any = translations;
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return defaultValue || key;
        }
      }
      return typeof value === 'string' ? value : (defaultValue || key);
    };
  } catch {
    return (key: string, defaultValue?: string): string => defaultValue || key;
  }
}