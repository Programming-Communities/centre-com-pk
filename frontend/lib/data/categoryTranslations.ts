// lib/data/categoryTranslations.ts
export interface CategoryTranslation {
  title: string;
  description: string;
}

const translations: Record<string, Record<string, CategoryTranslation>> = {
  en: {
    calculators: { 
      title: 'Calculators', 
      description: 'Math, finance, and conversion calculators for everyday use' 
    },
    'code-tools': { 
      title: 'Code Tools', 
      description: 'Programming, development and IT utilities for developers' 
    },
    'design-tools': { 
      title: 'Design Tools', 
      description: 'Graphics, color, and design utilities for creatives' 
    },
    'image-tools': { 
      title: 'Image Tools', 
      description: 'Image editing, conversion and optimization tools' 
    },
    'pdf-tools': { 
      title: 'PDF Tools', 
      description: 'PDF manipulation, conversion and optimization' 
    },
    'security-tools': { 
      title: 'Security Tools', 
      description: 'Privacy, encryption and security utilities' 
    },
    'text-tools': { 
      title: 'Text Tools', 
      description: 'Text processing, formatting and analysis tools' 
    },
    educational: { 
      title: 'Educational Tools', 
      description: 'Tools for students, teachers, and researchers' 
    }
  },
  ur: {
    calculators: { 
      title: 'کیلکولیٹرز', 
      description: 'ریاضی، فنانس اور کنورژن کیلکولیٹر روزمرہ استعمال کے لیے' 
    },
    'code-tools': { 
      title: 'کوڈ ٹولز', 
      description: 'پروگرامنگ، ڈیولپمنٹ اور آئی ٹی یوٹیلیٹیز ڈویلپرز کے لیے' 
    },
    'design-tools': { 
      title: 'ڈیزائن ٹولز', 
      description: 'گرافکس، کلر اور ڈیزائن یوٹیلیٹیز کری ایٹرز کے لیے' 
    },
    'image-tools': { 
      title: 'امیج ٹولز', 
      description: 'امیج ایڈیٹنگ، کنورژن اور آپٹیمائزیشن ٹولز' 
    },
    'pdf-tools': { 
      title: 'پی ڈی ایف ٹولز', 
      description: 'پی ڈی ایف مینیپولیشن، کنورژن اور آپٹیمائزیشن' 
    },
    'security-tools': { 
      title: 'سیکیورٹی ٹولز', 
      description: 'پرائیویسی، انکرپشن اور سیکیورٹی یوٹیلیٹیز' 
    },
    'text-tools': { 
      title: 'ٹیکسٹ ٹولز', 
      description: 'ٹیکسٹ پروسیسنگ، فارمیٹنگ اور اینالیسس ٹولز' 
    },
    educational: { 
      title: 'تعلیمی ٹولز', 
      description: 'طلبہ، اساتذہ اور محققین کے لیے ٹولز' 
    }
  },
  hi: {
    calculators: { 
      title: 'कैलकुलेटर', 
      description: 'गणित, वित्त और रूपांतरण कैलकुलेटर रोजमर्रा के उपयोग के लिए' 
    },
    'code-tools': { 
      title: 'कोड उपकरण', 
      description: 'प्रोग्रामिंग, डेवलपमेंट और आईटी उपयोगिताएँ डेवलपर्स के लिए' 
    },
    'design-tools': { 
      title: 'डिजाइन उपकरण', 
      description: 'ग्राफिक्स, रंग और डिजाइन उपयोगिताएँ क्रिएटिव के लिए' 
    },
    'image-tools': { 
      title: 'इमेज उपकरण', 
      description: 'इमेज एडिटिंग, रूपांतरण और अनुकूलन उपकरण' 
    },
    'pdf-tools': { 
      title: 'पीडीएफ उपकरण', 
      description: 'पीडीएफ हेरफेर, रूपांतरण और अनुकूलन' 
    },
    'security-tools': { 
      title: 'सुरक्षा उपकरण', 
      description: 'गोपनीयता, एन्क्रिप्शन और सुरक्षा उपयोगिताएँ' 
    },
    'text-tools': { 
      title: 'टेक्स्ट उपकरण', 
      description: 'टेक्स्ट प्रोसेसिंग, फॉर्मेटिंग और विश्लेषण उपकरण' 
    },
    educational: { 
      title: 'शैक्षिक उपकरण', 
      description: 'छात्रों, शिक्षकों और शोधकर्ताओं के लिए उपकरण' 
    }
  },
  ar: {
    calculators: { 
      title: 'الآلات الحاسبة', 
      description: 'آلات حاسبة رياضية ومالية وتحويل للاستخدام اليومي' 
    },
    'code-tools': { 
      title: 'أدوات البرمجة', 
      description: 'أدوات البرمجة والتطوير وتكنولوجيا المعلومات للمطورين' 
    },
    'design-tools': { 
      title: 'أدوات التصميم', 
      description: 'أدوات الرسومات والألوان والتصميم للمبدعين' 
    },
    'image-tools': { 
      title: 'أدوات الصور', 
      description: 'أدوات تحرير الصور وتحويلها وتحسينها' 
    },
    'pdf-tools': { 
      title: 'أدوات PDF', 
      description: 'معالجة وتحويل وتحسين ملفات PDF' 
    },
    'security-tools': { 
      title: 'أدوات الأمان', 
      description: 'أدوات الخصوصية والتشفير والأمان' 
    },
    'text-tools': { 
      title: 'أدوات النص', 
      description: 'أدوات معالجة النص وتنسيقه وتحليله' 
    },
    educational: { 
      title: 'أدوات تعليمية', 
      description: 'أدوات للطلاب والمعلمين والباحثين' 
    }
  }
};

export function getCategoryTranslations(lang: string = 'en') {
  return translations[lang] || translations.en;
}

export function getCategoryTranslation(lang: string, slug: string) {
  const langTranslations = translations[lang] || translations.en;
  return langTranslations[slug] || { title: slug, description: '' };
}