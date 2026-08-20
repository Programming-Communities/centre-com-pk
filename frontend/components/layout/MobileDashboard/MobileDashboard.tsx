'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import DynamicLogo from '@/components/theme/ui/DynamicLogo';
import { 
  Home, BookOpen, Users, Mail, ChevronDown, X, Search, ChevronRight,
  FolderTree, Sparkle, Calculator, Code, Palette, Camera,
  FileText, ShieldCheck, Type, Calendar, Scale, DollarSign, RefreshCw,
  CalendarDays, GraduationCap, TrendingUp as TrendingUpIcon, Percent,
  Ruler, Utensils, Hash, FileCode, Braces, QrCode, Link as LinkIcon,
  Image as ImageIcon, Minus, Crop, Filter, Maximize2, RotateCw, Smile,
  Grid3x3 as GridIcon, Merge, Scissors, Lock, EyeOff, ShieldAlert, Key,
  Trash2, Scan, Globe, GitCompare, Eye, TextCursor,
} from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

interface MobileDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

interface NavItem {
  id: string;
  nameKey: string;
  fallbackName: string;
  icon: any;
  href?: string;
  descriptionKey?: string;
  fallbackDescription?: string;
  badge?: 'new' | 'popular' | 'premium' | 'trending';
  children?: NavItem[];
  type: 'root' | 'category' | 'tool';
  toolCount?: number;
}

// 🔥 COMPLETE FALLBACK TRANSLATIONS FOR ALL 4 LANGUAGES
const fallbackTranslations: Record<string, Record<string, string>> = {
  ur: {
    // Menu items
    'menu.home': 'ہوم',
    'menu.blog': 'بلاگ',
    'menu.about': 'ہمارے بارے میں',
    'menu.contact': 'رابطہ کریں',
    'menu.calculators': 'کیلکولیٹرز',
    'menu.code': 'کوڈ ٹولز',
    'menu.design': 'ڈیزائن ٹولز',
    'menu.image': 'امیج ٹولز',
    'menu.pdf': 'پی ڈی ایف ٹولز',
    'menu.security': 'سیکیورٹی ٹولز',
    'menu.text': 'ٹیکسٹ ٹولز',
    // Descriptions
    'menu.home_desc': 'مرکزی صفحہ',
    'menu.blog_desc': 'تازہ ترین مضامین',
    'menu.about_desc': 'ہمارے بارے میں',
    'menu.contact_desc': 'ہم سے رابطہ کریں',
    'menu.calculators_desc': 'کیلکولیشن ٹولز',
    'menu.code_desc': 'ڈویلپر یوٹیلیٹیز',
    'menu.design_desc': 'ڈیزائن یوٹیلیٹیز',
    'menu.image_desc': 'امیج ایڈیٹنگ',
    'menu.pdf_desc': 'پی ڈی ایف ٹولز',
    'menu.security_desc': 'سیکیورٹی اور پرائیویسی',
    'menu.text_desc': 'ٹیکسٹ مینیپولیشن',
    // Common
    'navigation.main': 'مین نیویگیشن',
    'navigation.categories_count': '7 کیٹیگریز • 50+ ٹولز',
    'action.search_placeholder': 'ٹولز تلاش کریں...',
    'action.close': 'بند کریں',
    'stats.tools': 'ٹولز',
    'stats.categories': 'کیٹیگریز',
    'status.free': 'مفت',
    'description.footer_platform': 'پروفیشنل ٹولز پلیٹ فارم',
    'badge.new': 'نیا',
    'badge.popular': 'مقبول',
    'badge.trending': 'ٹرینڈنگ',
    // Tools
    'tools.age_calculator.title': 'عمر کیلکولیٹر',
    'tools.bmi_calculator.title': 'بی ایم آئی کیلکولیٹر',
    'tools.compound_interest.title': 'کمپاؤنڈ انٹرسٹ',
    'tools.currency_converter.title': 'کرنسی کنورٹر',
    'tools.date_calculator.title': 'تاریخ کیلکولیٹر',
    'tools.gpa_calculator.title': 'جی پی اے کیلکولیٹر',
    'tools.loan_calculator.title': 'لون کیلکولیٹر',
    'tools.percentage_calculator.title': 'فیصد کیلکولیٹر',
    'tools.tip_calculator.title': 'ٹپ کیلکولیٹر',
    'tools.unit_converter.title': 'یونٹ کنورٹر',
    'tools.base64_encoder.title': 'بیس 64 انکوڈر',
    'tools.css_formatter.title': 'سی ایس ایس فارمیٹر',
    'tools.html_formatter.title': 'ایچ ٹی ایم ایل فارمیٹر',
    'tools.javascript_formatter.title': 'جاوا اسکرپٹ فارمیٹر',
    'tools.json_formatter.title': 'جیسن فارمیٹر',
    'tools.qr_code_generator.title': 'کیو آر کوڈ جنریٹر',
    'tools.url_encoder.title': 'یو آر ایل انکوڈر',
    'tools.xml_formatter.title': 'ایکس ایم ایل فارمیٹر',
    'tools.color_picker.title': 'کلر پکر',
    'tools.background_remover.title': 'بیک گراؤنڈ ریموور',
    'tools.favicon_generator.title': 'فیوی آئیکن جنریٹر',
    'tools.image_compressor.title': 'امیج کمپریسر',
    'tools.image_converter.title': 'امیج کنورٹر',
    'tools.image_cropper.title': 'امیج کراپر',
    'tools.image_filters.title': 'امیج فلٹرز',
    'tools.image_resizer.title': 'امیج ریسائزر',
    'tools.image_rotator.title': 'امیج روٹیٹر',
    'tools.meme_generator.title': 'میم جنریٹر',
    'tools.photo_collage.title': 'فوٹو کولاج',
    'tools.pdf_compressor.title': 'پی ڈی ایف کمپریسر',
    'tools.pdf_merger.title': 'پی ڈی ایف مرجر',
    'tools.pdf_splitter.title': 'پی ڈی ایف سپلٹر',
    'tools.pdf_to_word.title': 'پی ڈی ایف ٹو ورڈ',
    'tools.api_security.title': 'اے پی آئی سیکیورٹی',
    'tools.data_masking.title': 'ڈیٹا ماسکنگ',
    'tools.encryption_tools.title': 'انکرپشن ٹولز',
    'tools.firewall_tester.title': 'فائر وال ٹیسٹر',
    'tools.hash_generator.title': 'ہیش جنریٹر',
    'tools.password_generator.title': 'پاس ورڈ جنریٹر',
    'tools.secure_file_wipe.title': 'سیکیور فائل وائپ',
    'tools.security_analyzer.title': 'سیکیورٹی اینالائزر',
    'tools.ssl_checker.title': 'ایس ایس ایل چیکر',
    'tools.two_factor_auth.title': 'ٹو فیکٹر آتھ',
    'tools.case_converter.title': 'کیس کنورٹر',
    'tools.character_counter.title': 'کریکٹر کاؤنٹر',
    'tools.lorem_ipsum.title': 'لوریم اپسم',
    'tools.markdown_editor.title': 'مارک ڈاؤن ایڈیٹر',
    'tools.regex_tester.title': 'ریجیکس ٹیسٹر',
    'tools.text_diff.title': 'ٹیکسٹ ڈف',
    'tools.text_extractor.title': 'ٹیکسٹ ایکسٹریکٹر',
    'tools.uuid_generator.title': 'یو یو آئی ڈی جنریٹر',
    'tools.word_counter.title': 'ورڈ کاؤنٹر',
    'tools.cv_builder.title': 'سی وی بلڈر',
  },
  ar: {
    'menu.home': 'الرئيسية',
    'menu.blog': 'المدونة',
    'menu.about': 'عن الموقع',
    'menu.contact': 'اتصل بنا',
    'menu.calculators': 'الحاسبات',
    'menu.code': 'أدوات البرمجة',
    'menu.design': 'أدوات التصميم',
    'menu.image': 'أدوات الصور',
    'menu.pdf': 'أدوات PDF',
    'menu.security': 'أدوات الأمان',
    'menu.text': 'أدوات النص',
    'menu.home_desc': 'لوحة التحكم الرئيسية',
    'menu.blog_desc': 'أحدث المقالات',
    'menu.about_desc': 'عن الموقع',
    'menu.contact_desc': 'تواصل معنا',
    'menu.calculators_desc': 'أدوات الحساب',
    'menu.code_desc': 'أدوات المطورين',
    'menu.design_desc': 'أدوات التصميم',
    'menu.image_desc': 'تحرير الصور',
    'menu.pdf_desc': 'معالجة PDF',
    'menu.security_desc': 'الأمان والخصوصية',
    'menu.text_desc': 'معالجة النصوص',
    'navigation.main': 'القائمة الرئيسية',
    'navigation.categories_count': '٧ فئات • ٥٠+ أداة',
    'action.search_placeholder': 'البحث عن الأدوات...',
    'action.close': 'إغلاق',
    'stats.tools': 'أدوات',
    'stats.categories': 'فئات',
    'status.free': 'مجاني',
    'description.footer_platform': 'منصة أدوات احترافية',
    'badge.new': 'جديد',
    'badge.popular': 'شائع',
    'badge.trending': 'رائج',
    // Tool names in Arabic
    'tools.age_calculator.title': 'حاسبة العمر',
    'tools.bmi_calculator.title': 'حاسبة BMI',
    'tools.compound_interest.title': 'الفائدة المركبة',
    'tools.currency_converter.title': 'محول العملات',
    'tools.date_calculator.title': 'حاسبة التاريخ',
    'tools.gpa_calculator.title': 'حاسبة GPA',
    'tools.loan_calculator.title': 'حاسبة القروض',
    'tools.percentage_calculator.title': 'حاسبة النسبة',
    'tools.tip_calculator.title': 'حاسبة البقشيش',
    'tools.unit_converter.title': 'محول الوحدات',
    'tools.base64_encoder.title': 'مشفر Base64',
    'tools.css_formatter.title': 'منسق CSS',
    'tools.html_formatter.title': 'منسق HTML',
    'tools.javascript_formatter.title': 'منسق JavaScript',
    'tools.json_formatter.title': 'منسق JSON',
    'tools.qr_code_generator.title': 'مولد QR',
    'tools.url_encoder.title': 'مشفر URL',
    'tools.xml_formatter.title': 'منسق XML',
    'tools.color_picker.title': 'منتقي الألوان',
    'tools.background_remover.title': 'مزيل الخلفية',
    'tools.favicon_generator.title': 'مولد Favicon',
    'tools.image_compressor.title': 'ضاغط الصور',
    'tools.image_converter.title': 'محول الصور',
    'tools.image_cropper.title': 'اقتصاص الصور',
    'tools.image_filters.title': 'فلاتر الصور',
    'tools.image_resizer.title': 'تغيير حجم الصور',
    'tools.image_rotator.title': 'تدوير الصور',
    'tools.meme_generator.title': 'مولد الميم',
    'tools.photo_collage.title': 'كولاج الصور',
    'tools.pdf_compressor.title': 'ضاغط PDF',
    'tools.pdf_merger.title': 'دمج PDF',
    'tools.pdf_splitter.title': 'تقسيم PDF',
    'tools.pdf_to_word.title': 'PDF إلى Word',
    'tools.api_security.title': 'أمان API',
    'tools.data_masking.title': 'إخفاء البيانات',
    'tools.encryption_tools.title': 'أدوات التشفير',
    'tools.firewall_tester.title': 'اختبار الجدار الناري',
    'tools.hash_generator.title': 'مولد التجزئة',
    'tools.password_generator.title': 'مولد كلمات المرور',
    'tools.secure_file_wipe.title': 'مسح آمن للملفات',
    'tools.security_analyzer.title': 'محلل الأمان',
    'tools.ssl_checker.title': 'فحص SSL',
    'tools.two_factor_auth.title': 'المصادقة الثنائية',
    'tools.case_converter.title': 'محول الحالة',
    'tools.character_counter.title': 'عداد الأحرف',
    'tools.lorem_ipsum.title': 'نص وهمي',
    'tools.markdown_editor.title': 'محرر Markdown',
    'tools.regex_tester.title': 'اختبار Regex',
    'tools.text_diff.title': 'مقارنة النصوص',
    'tools.text_extractor.title': 'مستخرج النصوص',
    'tools.uuid_generator.title': 'مولد UUID',
    'tools.word_counter.title': 'عداد الكلمات',
    'tools.cv_builder.title': 'منشئ السيرة الذاتية',
  },
  hi: {
    'menu.home': 'होम',
    'menu.blog': 'ब्लॉग',
    'menu.about': 'हमारे बारे में',
    'menu.contact': 'संपर्क करें',
    'menu.calculators': 'कैलकुलेटर',
    'menu.code': 'कोड टूल्स',
    'menu.design': 'डिज़ाइन टूल्स',
    'menu.image': 'इमेज टूल्स',
    'menu.pdf': 'PDF टूल्स',
    'menu.security': 'सिक्योरिटी टूल्स',
    'menu.text': 'टेक्स्ट टूल्स',
    'menu.home_desc': 'मुख्य डैशबोर्ड',
    'menu.blog_desc': 'नवीनतम लेख',
    'menu.about_desc': 'हमारे बारे में',
    'menu.contact_desc': 'संपर्क करें',
    'menu.calculators_desc': 'गणना टूल्स',
    'menu.code_desc': 'डेवलपर यूटिलिटीज',
    'menu.design_desc': 'डिज़ाइन यूटिलिटीज',
    'menu.image_desc': 'इमेज एडिटिंग',
    'menu.pdf_desc': 'PDF मैनिपुलेशन',
    'menu.security_desc': 'सुरक्षा और गोपनीयता',
    'menu.text_desc': 'टेक्स्ट मैनिपुलेशन',
    'navigation.main': 'मुख्य नेविगेशन',
    'navigation.categories_count': '7 श्रेणियां • 50+ टूल्स',
    'action.search_placeholder': 'टूल्स खोजें...',
    'action.close': 'बंद करें',
    'stats.tools': 'टूल्स',
    'stats.categories': 'श्रेणियां',
    'status.free': 'मुफ्त',
    'description.footer_platform': 'प्रोफेशनल टूल्स प्लेटफॉर्म',
    'badge.new': 'नया',
    'badge.popular': 'लोकप्रिय',
    'badge.trending': 'ट्रेंडिंग',
    // Tool names in Hindi
    'tools.age_calculator.title': 'आयु कैलकुलेटर',
    'tools.bmi_calculator.title': 'BMI कैलकुलेटर',
    'tools.compound_interest.title': 'चक्रवृद्धि ब्याज',
    'tools.currency_converter.title': 'मुद्रा परिवर्तक',
    'tools.date_calculator.title': 'तिथि कैलकुलेटर',
    'tools.gpa_calculator.title': 'GPA कैलकुलेटर',
    'tools.loan_calculator.title': 'लोन कैलकुलेटर',
    'tools.percentage_calculator.title': 'प्रतिशत कैलकुलेटर',
    'tools.tip_calculator.title': 'टिप कैलकुलेटर',
    'tools.unit_converter.title': 'यूनिट परिवर्तक',
    'tools.base64_encoder.title': 'Base64 एनकोडर',
    'tools.css_formatter.title': 'CSS फॉर्मेटर',
    'tools.html_formatter.title': 'HTML फॉर्मेटर',
    'tools.javascript_formatter.title': 'JS फॉर्मेटर',
    'tools.json_formatter.title': 'JSON फॉर्मेटर',
    'tools.qr_code_generator.title': 'QR जनरेटर',
    'tools.url_encoder.title': 'URL एनकोडर',
    'tools.xml_formatter.title': 'XML फॉर्मेटर',
    'tools.color_picker.title': 'कलर पिकर',
    'tools.background_remover.title': 'बैकग्राउंड रिमूवर',
    'tools.favicon_generator.title': 'Favicon जनरेटर',
    'tools.image_compressor.title': 'इमेज कंप्रेसर',
    'tools.image_converter.title': 'इमेज कन्वर्टर',
    'tools.image_cropper.title': 'इमेज क्रॉपर',
    'tools.image_filters.title': 'इमेज फिल्टर',
    'tools.image_resizer.title': 'इमेज रिसाइज़र',
    'tools.image_rotator.title': 'इमेज रोटेटर',
    'tools.meme_generator.title': 'मीम जनरेटर',
    'tools.photo_collage.title': 'फोटो कोलाज',
    'tools.pdf_compressor.title': 'PDF कंप्रेसर',
    'tools.pdf_merger.title': 'PDF मर्जर',
    'tools.pdf_splitter.title': 'PDF स्प्लिटर',
    'tools.pdf_to_word.title': 'PDF to Word',
    'tools.api_security.title': 'API सिक्योरिटी',
    'tools.data_masking.title': 'डेटा मास्किंग',
    'tools.encryption_tools.title': 'एन्क्रिप्शन टूल्स',
    'tools.firewall_tester.title': 'फायरवॉल टेस्टर',
    'tools.hash_generator.title': 'हैश जनरेटर',
    'tools.password_generator.title': 'पासवर्ड जनरेटर',
    'tools.secure_file_wipe.title': 'सिक्योर फाइल वाइप',
    'tools.security_analyzer.title': 'सिक्योरिटी एनालाइजर',
    'tools.ssl_checker.title': 'SSL चेकर',
    'tools.two_factor_auth.title': '2FA जनरेटर',
    'tools.case_converter.title': 'केस कन्वर्टर',
    'tools.character_counter.title': 'कैरेक्टर काउंटर',
    'tools.lorem_ipsum.title': 'लोरेम इप्सम',
    'tools.markdown_editor.title': 'मार्कडाउन एडिटर',
    'tools.regex_tester.title': 'Regex टेस्टर',
    'tools.text_diff.title': 'टेक्स्ट डिफ',
    'tools.text_extractor.title': 'टेक्स्ट एक्सट्रैक्टर',
    'tools.uuid_generator.title': 'UUID जनरेटर',
    'tools.word_counter.title': 'वर्ड काउंटर',
    'tools.cv_builder.title': 'CV बिल्डर',
  },
  en: {
    // English fallbacks (same as keys but with proper formatting)
    'navigation.main': 'Main Navigation',
    'navigation.categories_count': '7 Categories • 50+ Tools',
    'action.search_placeholder': 'Search tools...',
    'action.close': 'Close',
    'stats.tools': 'Tools',
    'stats.categories': 'Categories',
    'status.free': 'Free',
    'description.footer_platform': 'Professional Tools Platform',
    'badge.new': 'New',
    'badge.popular': 'Popular',
    'badge.trending': 'Trending',
  }
};

// 🔥 Helper function to get translated text with complete fallback
const getTranslatedText = (lang: string, key: string, defaultValue: string): string => {
  // First check fallback translations
  if (fallbackTranslations[lang]?.[key]) {
    return fallbackTranslations[lang][key];
  }
  // Then check English fallback
  if (fallbackTranslations.en[key]) {
    return fallbackTranslations.en[key];
  }
  return defaultValue;
};

// Generate navigation structure with proper translations
const generateNavStructure = (lang: string): NavItem[] => {
  return [
    {
      id: 'home',
      nameKey: 'menu.home',
      fallbackName: getTranslatedText(lang, 'menu.home', 'Home'),
      icon: Home,
      href: `/${lang}`,
      descriptionKey: 'menu.home_desc',
      fallbackDescription: getTranslatedText(lang, 'menu.home_desc', 'Main Dashboard'),
      type: 'root'
    },
    {
      id: 'calculators',
      nameKey: 'menu.calculators',
      fallbackName: getTranslatedText(lang, 'menu.calculators', 'Calculators'),
      icon: Calculator,
      href: `/${lang}/tools/calculators`,
      descriptionKey: 'menu.calculators_desc',
      fallbackDescription: getTranslatedText(lang, 'menu.calculators_desc', 'Calculation Tools'),
      badge: 'popular',
      type: 'category',
      toolCount: 10,
      children: [
        { id: 'age-calculator', nameKey: 'tools.age_calculator.title', fallbackName: getTranslatedText(lang, 'tools.age_calculator.title', 'Age Calculator'), icon: Calendar, href: `/${lang}/tools/calculators/age-calculator`, type: 'tool' },
        { id: 'bmi-calculator', nameKey: 'tools.bmi_calculator.title', fallbackName: getTranslatedText(lang, 'tools.bmi_calculator.title', 'BMI Calculator'), icon: Scale, href: `/${lang}/tools/calculators/bmi-calculator`, type: 'tool' },
        { id: 'compound-interest', nameKey: 'tools.compound_interest.title', fallbackName: getTranslatedText(lang, 'tools.compound_interest.title', 'Compound Interest'), icon: DollarSign, href: `/${lang}/tools/calculators/compound-interest`, type: 'tool' },
        { id: 'currency-converter', nameKey: 'tools.currency_converter.title', fallbackName: getTranslatedText(lang, 'tools.currency_converter.title', 'Currency Converter'), icon: RefreshCw, href: `/${lang}/tools/calculators/currency-converter`, type: 'tool', badge: 'popular' },
        { id: 'date-calculator', nameKey: 'tools.date_calculator.title', fallbackName: getTranslatedText(lang, 'tools.date_calculator.title', 'Date Calculator'), icon: CalendarDays, href: `/${lang}/tools/calculators/date-calculator`, type: 'tool' },
        { id: 'gpa-calculator', nameKey: 'tools.gpa_calculator.title', fallbackName: getTranslatedText(lang, 'tools.gpa_calculator.title', 'GPA Calculator'), icon: GraduationCap, href: `/${lang}/tools/calculators/gpa-calculator`, type: 'tool' },
        { id: 'loan-calculator', nameKey: 'tools.loan_calculator.title', fallbackName: getTranslatedText(lang, 'tools.loan_calculator.title', 'Loan Calculator'), icon: TrendingUpIcon, href: `/${lang}/tools/calculators/loan-calculator`, type: 'tool' },
        { id: 'percentage-calculator', nameKey: 'tools.percentage_calculator.title', fallbackName: getTranslatedText(lang, 'tools.percentage_calculator.title', 'Percentage Calculator'), icon: Percent, href: `/${lang}/tools/calculators/percentage-calculator`, type: 'tool' },
        { id: 'tip-calculator', nameKey: 'tools.tip_calculator.title', fallbackName: getTranslatedText(lang, 'tools.tip_calculator.title', 'Tip Calculator'), icon: Utensils, href: `/${lang}/tools/calculators/tip-calculator`, type: 'tool' },
        { id: 'unit-converter', nameKey: 'tools.unit_converter.title', fallbackName: getTranslatedText(lang, 'tools.unit_converter.title', 'Unit Converter'), icon: Ruler, href: `/${lang}/tools/calculators/unit-converter`, type: 'tool', badge: 'trending' },
      ]
    },
    {
      id: 'code-tools',
      nameKey: 'menu.code',
      fallbackName: getTranslatedText(lang, 'menu.code', 'Code Tools'),
      icon: Code,
      href: `/${lang}/tools/code-tools`,
      descriptionKey: 'menu.code_desc',
      fallbackDescription: getTranslatedText(lang, 'menu.code_desc', 'Developer Utilities'),
      badge: 'trending',
      type: 'category',
      toolCount: 8,
      children: [
        { id: 'base64-encoder', nameKey: 'tools.base64_encoder.title', fallbackName: getTranslatedText(lang, 'tools.base64_encoder.title', 'Base64 Encoder'), icon: Hash, href: `/${lang}/tools/code-tools/base64-encoder`, type: 'tool' },
        { id: 'css-formatter', nameKey: 'tools.css_formatter.title', fallbackName: getTranslatedText(lang, 'tools.css_formatter.title', 'CSS Formatter'), icon: FileCode, href: `/${lang}/tools/code-tools/css-formatter`, type: 'tool' },
        { id: 'html-formatter', nameKey: 'tools.html_formatter.title', fallbackName: getTranslatedText(lang, 'tools.html_formatter.title', 'HTML Formatter'), icon: FileCode, href: `/${lang}/tools/code-tools/html-formatter`, type: 'tool' },
        { id: 'javascript-formatter', nameKey: 'tools.javascript_formatter.title', fallbackName: getTranslatedText(lang, 'tools.javascript_formatter.title', 'JS Formatter'), icon: FileCode, href: `/${lang}/tools/code-tools/javascript-formatter`, type: 'tool' },
        { id: 'json-formatter', nameKey: 'tools.json_formatter.title', fallbackName: getTranslatedText(lang, 'tools.json_formatter.title', 'JSON Formatter'), icon: Braces, href: `/${lang}/tools/code-tools/json-formatter`, type: 'tool', badge: 'popular' },
        { id: 'qr-code-generator', nameKey: 'tools.qr_code_generator.title', fallbackName: getTranslatedText(lang, 'tools.qr_code_generator.title', 'QR Generator'), icon: QrCode, href: `/${lang}/tools/code-tools/qr-code-generator`, type: 'tool' },
        { id: 'url-encoder', nameKey: 'tools.url_encoder.title', fallbackName: getTranslatedText(lang, 'tools.url_encoder.title', 'URL Encoder'), icon: LinkIcon, href: `/${lang}/tools/code-tools/url-encoder`, type: 'tool' },
        { id: 'xml-formatter', nameKey: 'tools.xml_formatter.title', fallbackName: getTranslatedText(lang, 'tools.xml_formatter.title', 'XML Formatter'), icon: FileCode, href: `/${lang}/tools/code-tools/xml-formatter`, type: 'tool' },
      ]
    },
    {
      id: 'design-tools',
      nameKey: 'menu.design',
      fallbackName: getTranslatedText(lang, 'menu.design', 'Design Tools'),
      icon: Palette,
      href: `/${lang}/tools/design-tools`,
      descriptionKey: 'menu.design_desc',
      fallbackDescription: getTranslatedText(lang, 'menu.design_desc', 'Design Utilities'),
      type: 'category',
      toolCount: 1,
      children: [
        { id: 'color-picker', nameKey: 'tools.color_picker.title', fallbackName: getTranslatedText(lang, 'tools.color_picker.title', 'Color Picker'), icon: Palette, href: `/${lang}/tools/design-tools/color-picker`, type: 'tool', badge: 'popular' },
      ]
    },
    {
      id: 'image-tools',
      nameKey: 'menu.image',
      fallbackName: getTranslatedText(lang, 'menu.image', 'Image Tools'),
      icon: Camera,
      href: `/${lang}/tools/image-tools`,
      descriptionKey: 'menu.image_desc',
      fallbackDescription: getTranslatedText(lang, 'menu.image_desc', 'Image Editing'),
      badge: 'popular',
      type: 'category',
      toolCount: 10,
      children: [
        { id: 'background-remover', nameKey: 'tools.background_remover.title', fallbackName: getTranslatedText(lang, 'tools.background_remover.title', 'Background Remover'), icon: ImageIcon, href: `/${lang}/tools/image-tools/background-remover`, type: 'tool', badge: 'new' },
        { id: 'favicon-generator', nameKey: 'tools.favicon_generator.title', fallbackName: getTranslatedText(lang, 'tools.favicon_generator.title', 'Favicon Generator'), icon: ImageIcon, href: `/${lang}/tools/image-tools/favicon-generator`, type: 'tool' },
        { id: 'image-compressor', nameKey: 'tools.image_compressor.title', fallbackName: getTranslatedText(lang, 'tools.image_compressor.title', 'Image Compressor'), icon: Minus, href: `/${lang}/tools/image-tools/image-compressor`, type: 'tool' },
        { id: 'image-converter', nameKey: 'tools.image_converter.title', fallbackName: getTranslatedText(lang, 'tools.image_converter.title', 'Image Converter'), icon: RefreshCw, href: `/${lang}/tools/image-tools/image-converter`, type: 'tool' },
        { id: 'image-cropper', nameKey: 'tools.image_cropper.title', fallbackName: getTranslatedText(lang, 'tools.image_cropper.title', 'Image Cropper'), icon: Crop, href: `/${lang}/tools/image-tools/image-cropper`, type: 'tool' },
        { id: 'image-filters', nameKey: 'tools.image_filters.title', fallbackName: getTranslatedText(lang, 'tools.image_filters.title', 'Image Filters'), icon: Filter, href: `/${lang}/tools/image-tools/image-filters`, type: 'tool' },
        { id: 'image-resizer', nameKey: 'tools.image_resizer.title', fallbackName: getTranslatedText(lang, 'tools.image_resizer.title', 'Image Resizer'), icon: Maximize2, href: `/${lang}/tools/image-tools/image-resizer`, type: 'tool', badge: 'popular' },
        { id: 'image-rotator', nameKey: 'tools.image_rotator.title', fallbackName: getTranslatedText(lang, 'tools.image_rotator.title', 'Image Rotator'), icon: RotateCw, href: `/${lang}/tools/image-tools/image-rotator`, type: 'tool' },
        { id: 'meme-generator', nameKey: 'tools.meme_generator.title', fallbackName: getTranslatedText(lang, 'tools.meme_generator.title', 'Meme Generator'), icon: Smile, href: `/${lang}/tools/image-tools/meme-generator`, type: 'tool' },
        { id: 'photo-collage', nameKey: 'tools.photo_collage.title', fallbackName: getTranslatedText(lang, 'tools.photo_collage.title', 'Photo Collage'), icon: GridIcon, href: `/${lang}/tools/image-tools/photo-collage`, type: 'tool' },
      ]
    },
    {
      id: 'pdf-tools',
      nameKey: 'menu.pdf',
      fallbackName: getTranslatedText(lang, 'menu.pdf', 'PDF Tools'),
      icon: FileText,
      href: `/${lang}/tools/pdf-tools`,
      descriptionKey: 'menu.pdf_desc',
      fallbackDescription: getTranslatedText(lang, 'menu.pdf_desc', 'PDF Manipulation'),
      type: 'category',
      toolCount: 5,
      children: [
        { id: 'pdf-compressor', nameKey: 'tools.pdf_compressor.title', fallbackName: getTranslatedText(lang, 'tools.pdf_compressor.title', 'PDF Compressor'), icon: Minus, href: `/${lang}/tools/pdf-tools/pdf-compressor`, type: 'tool' },
        { id: 'pdf-merger', nameKey: 'tools.pdf_merger.title', fallbackName: getTranslatedText(lang, 'tools.pdf_merger.title', 'PDF Merger'), icon: Merge, href: `/${lang}/tools/pdf-tools/pdf-merger`, type: 'tool' },
        { id: 'pdf-splitter', nameKey: 'tools.pdf_splitter.title', fallbackName: getTranslatedText(lang, 'tools.pdf_splitter.title', 'PDF Splitter'), icon: Scissors, href: `/${lang}/tools/pdf-tools/pdf-splitter`, type: 'tool' },
        { id: 'pdf-to-word', nameKey: 'tools.pdf_to_word.title', fallbackName: getTranslatedText(lang, 'tools.pdf_to_word.title', 'PDF to Word'), icon: FileText, href: `/${lang}/tools/pdf-tools/pdf-to-word`, type: 'tool', badge: 'popular' },
                { id: 'pdf-protect', nameKey: 'tools.pdf_protect.title', fallbackName: getTranslatedText(lang, 'tools.pdf_protect.title', 'PDF Protect'), icon: Lock, href: `/${lang}/tools/pdf-tools/pdf-protect`, type: 'tool', badge: 'new' },
     ]
    },
    {
      id: 'security-tools',
      nameKey: 'menu.security',
      fallbackName: getTranslatedText(lang, 'menu.security', 'Security Tools'),
      icon: ShieldCheck,
      href: `/${lang}/tools/security-tools`,
      descriptionKey: 'menu.security_desc',
      fallbackDescription: getTranslatedText(lang, 'menu.security_desc', 'Security & Privacy'),
      badge: 'new',
      type: 'category',
      toolCount: 10,
      children: [
        { id: 'api-security', nameKey: 'tools.api_security.title', fallbackName: getTranslatedText(lang, 'tools.api_security.title', 'API Security'), icon: ShieldCheck, href: `/${lang}/tools/security-tools/api-security`, type: 'tool' },
        { id: 'data-masking', nameKey: 'tools.data_masking.title', fallbackName: getTranslatedText(lang, 'tools.data_masking.title', 'Data Masking'), icon: EyeOff, href: `/${lang}/tools/security-tools/data-masking`, type: 'tool' },
        { id: 'encryption-tools', nameKey: 'tools.encryption_tools.title', fallbackName: getTranslatedText(lang, 'tools.encryption_tools.title', 'Encryption Tools'), icon: Lock, href: `/${lang}/tools/security-tools/encryption-tools`, type: 'tool' },
        { id: 'firewall-tester', nameKey: 'tools.firewall_tester.title', fallbackName: getTranslatedText(lang, 'tools.firewall_tester.title', 'Firewall Tester'), icon: ShieldAlert, href: `/${lang}/tools/security-tools/firewall-tester`, type: 'tool' },
        { id: 'hash-generator', nameKey: 'tools.hash_generator.title', fallbackName: getTranslatedText(lang, 'tools.hash_generator.title', 'Hash Generator'), icon: Hash, href: `/${lang}/tools/security-tools/hash-generator`, type: 'tool' },
        { id: 'password-generator', nameKey: 'tools.password_generator.title', fallbackName: getTranslatedText(lang, 'tools.password_generator.title', 'Password Generator'), icon: Key, href: `/${lang}/tools/security-tools/password-generator`, type: 'tool', badge: 'popular' },
        { id: 'secure-file-wipe', nameKey: 'tools.secure_file_wipe.title', fallbackName: getTranslatedText(lang, 'tools.secure_file_wipe.title', 'Secure File Wipe'), icon: Trash2, href: `/${lang}/tools/security-tools/secure-file-wipe`, type: 'tool' },
        { id: 'security-analyzer', nameKey: 'tools.security_analyzer.title', fallbackName: getTranslatedText(lang, 'tools.security_analyzer.title', 'Security Analyzer'), icon: Scan, href: `/${lang}/tools/security-tools/security-analyzer`, type: 'tool' },
        { id: 'ssl-checker', nameKey: 'tools.ssl_checker.title', fallbackName: getTranslatedText(lang, 'tools.ssl_checker.title', 'SSL Checker'), icon: Globe, href: `/${lang}/tools/security-tools/ssl-checker`, type: 'tool' },
        { id: 'two-factor-auth', nameKey: 'tools.two_factor_auth.title', fallbackName: getTranslatedText(lang, 'tools.two_factor_auth.title', '2FA Generator'), icon: ShieldCheck, href: `/${lang}/tools/security-tools/two-factor-auth`, type: 'tool' },
      ]
    },
    {
      id: 'text-tools',
      nameKey: 'menu.text',
      fallbackName: getTranslatedText(lang, 'menu.text', 'Text Tools'),
      icon: Type,
      href: `/${lang}/tools/text-tools`,
      descriptionKey: 'menu.text_desc',
      fallbackDescription: getTranslatedText(lang, 'menu.text_desc', 'Text Manipulation'),
      type: 'category',
      toolCount: 9,
      children: [
        { id: 'case-converter', nameKey: 'tools.case_converter.title', fallbackName: getTranslatedText(lang, 'tools.case_converter.title', 'Case Converter'), icon: Type, href: `/${lang}/tools/text-tools/case-converter`, type: 'tool' },
        { id: 'character-counter', nameKey: 'tools.character_counter.title', fallbackName: getTranslatedText(lang, 'tools.character_counter.title', 'Character Counter'), icon: Hash, href: `/${lang}/tools/text-tools/character-counter`, type: 'tool' },
        { id: 'lorem-ipsum', nameKey: 'tools.lorem_ipsum.title', fallbackName: getTranslatedText(lang, 'tools.lorem_ipsum.title', 'Lorem Ipsum'), icon: TextCursor, href: `/${lang}/tools/text-tools/lorem-ipsum`, type: 'tool' },
        { id: 'markdown-editor', nameKey: 'tools.markdown_editor.title', fallbackName: getTranslatedText(lang, 'tools.markdown_editor.title', 'Markdown Editor'), icon: FileText, href: `/${lang}/tools/text-tools/markdown-editor`, type: 'tool' },
        { id: 'regex-tester', nameKey: 'tools.regex_tester.title', fallbackName: getTranslatedText(lang, 'tools.regex_tester.title', 'Regex Tester'), icon: Code, href: `/${lang}/tools/text-tools/regex-tester`, type: 'tool' },
        { id: 'text-diff', nameKey: 'tools.text_diff.title', fallbackName: getTranslatedText(lang, 'tools.text_diff.title', 'Text Diff'), icon: GitCompare, href: `/${lang}/tools/text-tools/text-diff`, type: 'tool' },
        { id: 'text-extractor', nameKey: 'tools.text_extractor.title', fallbackName: getTranslatedText(lang, 'tools.text_extractor.title', 'Text Extractor'), icon: Eye, href: `/${lang}/tools/text-tools/text-extractor`, type: 'tool' },
        { id: 'uuid-generator', nameKey: 'tools.uuid_generator.title', fallbackName: getTranslatedText(lang, 'tools.uuid_generator.title', 'UUID Generator'), icon: Hash, href: `/${lang}/tools/text-tools/uuid-generator`, type: 'tool' },
        { id: 'cv-builder', nameKey: 'tools.cv_builder.title', fallbackName: 'CV Builder', icon: FileText, href: `/${lang}/tools/text-tools/cv-builder`, type: 'tool', badge: 'new' },
      ]
    },
    {
      id: 'blog',
      nameKey: 'menu.blog',
      fallbackName: getTranslatedText(lang, 'menu.blog', 'Blog'),
      icon: BookOpen,
      href: `/${lang}/blog`,
      descriptionKey: 'menu.blog_desc',
      fallbackDescription: getTranslatedText(lang, 'menu.blog_desc', 'Latest Articles'),
      badge: 'new',
      type: 'root'
    },
    {
      id: 'about',
      nameKey: 'menu.about',
      fallbackName: getTranslatedText(lang, 'menu.about', 'About'),
      icon: Users,
      href: `/${lang}/about`,
      descriptionKey: 'menu.about_desc',
      fallbackDescription: getTranslatedText(lang, 'menu.about_desc', 'About Us'),
      type: 'root'
    },
    {
      id: 'contact',
      nameKey: 'menu.contact',
      fallbackName: getTranslatedText(lang, 'menu.contact', 'Contact'),
      icon: Mail,
      href: `/${lang}/contact`,
      descriptionKey: 'menu.contact_desc',
      fallbackDescription: getTranslatedText(lang, 'menu.contact_desc', 'Get in Touch'),
      type: 'root'
    },
  ];
};

export default function MobileDashboard({ isOpen, onClose, lang }: MobileDashboardProps) {
  const [activeDropdowns, setActiveDropdowns] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  
  const { themeColors, isDarkMode } = useTheme();
  const pathname = usePathname();

  // Generate nav structure with proper translations
  const navStructure = useMemo(() => {
    return generateNavStructure(lang);
  }, [lang]);

  // 🔥 Helper to get translated name (simplified - uses pre-generated fallback)
  const getTranslatedName = useCallback((item: NavItem): string => {
    return item.fallbackName;
  }, []);

  const getTranslatedDescription = useCallback((item: NavItem): string | undefined => {
    return item.fallbackDescription;
  }, []);

  // 🔥 Get UI text with fallback
  const getUIText = useCallback((key: string, fallback: string): string => {
    return getTranslatedText(lang, key, fallback);
  }, [lang]);

  const badgeColors = {
    new: { bg: '#10b981', text: '#ffffff', darkBg: '#065f46' },
    popular: { bg: '#3b82f6', text: '#ffffff', darkBg: '#1e40af' },
    premium: { bg: '#f59e0b', text: '#000000', darkBg: '#92400e' },
    trending: { bg: '#8b5cf6', text: '#ffffff', darkBg: '#5b21b6' }
  };

  const getBadgeStyle = useCallback((type: 'new' | 'popular' | 'premium' | 'trending' | undefined) => {
    if (!type) return {};
    const colors = badgeColors[type];
    return {
      backgroundColor: isDarkMode ? colors.darkBg : colors.bg,
      color: colors.text,
    };
  }, [isDarkMode]);

  const toggleDropdown = useCallback((id: string) => {
    setActiveDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const isDropdownOpen = useCallback((id: string) => activeDropdowns.has(id), [activeDropdowns]);

  const handleNavigation = useCallback(() => {
    onClose();
    setActiveDropdowns(new Set());
    setSearchQuery('');
  }, [onClose]);

  const getGradient = useCallback(() => {
    const primary = themeColors.primary || '#3b82f6';
    const secondary = themeColors.secondary || '#8b5cf6';
    return `linear-gradient(135deg, ${primary}, ${secondary})`;
  }, [themeColors.primary, themeColors.secondary]);

  const getSurfaceColor = useCallback(() => themeColors.surface || (isDarkMode ? '#1e293b' : '#ffffff'), [themeColors.surface, isDarkMode]);
  const getBackgroundColor = useCallback(() => themeColors.background || (isDarkMode ? '#0f172a' : '#f8fafc'), [themeColors.background, isDarkMode]);
  const getBorderColor = useCallback((level = 0) => {
    const baseColor = themeColors.border || (isDarkMode ? '#334155' : '#e2e8f0');
    if (level === 0) return baseColor;
    if (level === 1) return isDarkMode ? '#475569' : '#cbd5e1';
    return isDarkMode ? '#64748b' : '#94a3b8';
  }, [themeColors.border, isDarkMode]);
  
  const getTextPrimaryColor = useCallback(() => themeColors.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a'), [themeColors.text?.primary, isDarkMode]);
  const getTextSecondaryColor = useCallback(() => themeColors.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b'), [themeColors.text?.secondary, isDarkMode]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  // 🔥 Badge text translation
  const getBadgeText = useCallback((type: 'new' | 'popular' | 'premium' | 'trending'): string => {
    const key = `badge.${type}`;
    return getUIText(key, type.charAt(0).toUpperCase() + type.slice(1));
  }, [getUIText]);

  const NavItemComponent = React.memo(({ 
    item, 
    level = 0, 
  }: { 
    item: NavItem; 
    level?: number;
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = isDropdownOpen(item.id);
    const isActive = pathname === item.href || (item.href && pathname.startsWith(item.href + '/'));
    const displayName = getTranslatedName(item);
    const displayDescription = getTranslatedDescription(item);
    
    const getBorderStyle = useCallback(() => {
      const borderColor = getBorderColor(level);
      if (level === 0) return `1.5px solid ${borderColor}`;
      if (level === 1) return `1px solid ${borderColor}`;
      return `0.5px solid ${borderColor}`;
    }, [level]);

    const getPadding = useCallback(() => {
      if (level === 0) return 'px-4 py-3.5';
      if (level === 1) return 'px-4 py-3 ml-3';
      return 'px-4 py-2.5 ml-6';
    }, [level]);

    const getIconSize = useCallback(() => {
      if (level === 0) return 'h-5 w-5';
      if (level === 1) return 'h-4.5 w-4.5';
      return 'h-4 w-4';
    }, [level]);

    const getTextSize = useCallback(() => {
      if (level === 0) return 'text-sm font-semibold';
      if (level === 1) return 'text-sm font-medium';
      return 'text-sm';
    }, [level]);

    const getBackgroundColor = useCallback(() => {
      if (isActive) return `${themeColors.primary || '#3b82f6'}15`;
      if (isOpen) return `${themeColors.primary || '#3b82f6'}10`;
      return level === 0 ? getSurfaceColor() : 'transparent';
    }, [isActive, isOpen, level, themeColors.primary]);

    return (
      <div className={`mb-1.5 ${level > 0 ? 'mt-1' : ''}`}>
        {hasChildren ? (
          <>
            <button
              onClick={() => toggleDropdown(item.id)}
              className={`w-full flex items-center justify-between ${getPadding()} rounded-xl transition-all duration-200`}
              style={{
                backgroundColor: getBackgroundColor(),
                color: isOpen || isActive ? themeColors.primary || '#3b82f6' : getTextPrimaryColor(),
                border: getBorderStyle(),
              }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`shrink-0 rounded-lg flex items-center justify-center ${
                  level === 0 ? 'p-2.5' : level === 1 ? 'p-2' : 'p-1.5'
                }`}
                  style={{
                    background: level === 0 
                      ? getGradient() 
                      : isOpen || isActive
                        ? `${themeColors.primary || '#3b82f6'}20`
                        : `${getTextSecondaryColor()}20`,
                  }}>
                  <item.icon className={`${getIconSize()} ${
                    level === 0 ? 'text-white' : 
                    isOpen || isActive ? (themeColors.primary || '#3b82f6') : getTextSecondaryColor()
                  }`} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2 truncate">
                    <span className={`${getTextSize()} truncate`}>{displayName}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                        style={getBadgeStyle(item.badge)}>
                        {getBadgeText(item.badge)}
                      </span>
                    )}
                    {item.toolCount && level === 1 && (
                      <span className="text-xs px-1.5 py-0.5 rounded shrink-0"
                        style={{
                          backgroundColor: `${themeColors.primary || '#3b82f6'}15`,
                          color: themeColors.primary || '#3b82f6',
                        }}>
                        {item.toolCount}
                      </span>
                    )}
                  </div>
                  {displayDescription && level < 2 && (
                    <div className="text-xs truncate mt-0.5" style={{ color: getTextSecondaryColor() }}>
                      {displayDescription}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                  style={{ color: getTextSecondaryColor() }}
                />
              </div>
            </button>

            {isOpen && hasChildren && (
              <div className="overflow-hidden">
                <div className={`py-1.5 ${level === 0 ? 'pl-3' : level === 1 ? 'pl-6' : 'pl-9'}`}>
                  {item.children!.map((child) => (
                    <NavItemComponent 
                      key={`${item.id}-${child.id}`} 
                      item={child} 
                      level={level + 1}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <Link
            href={item.href || '#'}
            onClick={handleNavigation}
            className={`flex items-center justify-between ${getPadding()} rounded-xl transition-all duration-200`}
            style={{
              backgroundColor: isActive ? `${themeColors.primary || '#3b82f6'}15` : level === 0 ? getSurfaceColor() : 'transparent',
              color: isActive ? themeColors.primary || '#3b82f6' : getTextPrimaryColor(),
              border: getBorderStyle(),
            }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`shrink-0 rounded-lg flex items-center justify-center ${
                level === 0 ? 'p-2.5' : level === 1 ? 'p-2' : 'p-1.5'
              }`}
                style={{
                  background: level === 0 
                    ? getGradient() 
                    : isActive
                      ? `${themeColors.primary || '#3b82f6'}20`
                      : `${getTextSecondaryColor()}20`,
                }}>
                <item.icon className={`${getIconSize()} ${
                  level === 0 ? 'text-white' : 
                  isActive ? (themeColors.primary || '#3b82f6') : getTextSecondaryColor()
                }`} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2 truncate">
                  <span className={`${getTextSize()} truncate`}>{displayName}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                      style={getBadgeStyle(item.badge)}>
                      {getBadgeText(item.badge)}
                    </span>
                  )}
                </div>
                {displayDescription && level < 2 && (
                  <div className="text-xs truncate mt-0.5" style={{ color: getTextSecondaryColor() }}>
                    {displayDescription}
                  </div>
                )}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 ml-1" style={{ color: getTextSecondaryColor() }} />
          </Link>
        )}
      </div>
    );
  });

  NavItemComponent.displayName = 'NavItemComponent';

  const filteredNavStructure = useMemo(() => {
    if (!searchQuery.trim()) return navStructure;
    
    const query = searchQuery.toLowerCase();
    
    const filterItems = (items: NavItem[]): NavItem[] => {
      return items.reduce((acc: NavItem[], item) => {
        const displayName = getTranslatedName(item).toLowerCase();
        const displayDesc = getTranslatedDescription(item)?.toLowerCase() || '';
        
        const nameMatch = displayName.includes(query);
        const descMatch = displayDesc.includes(query);
        
        let filteredChildren: NavItem[] | undefined;
        if (item.children) {
          filteredChildren = filterItems(item.children);
        }
        
        const hasMatchingChildren = filteredChildren && filteredChildren.length > 0;
        
        if (nameMatch || descMatch || hasMatchingChildren) {
          acc.push({
            ...item,
            children: hasMatchingChildren ? filteredChildren : item.children,
          });
        }
        
        return acc;
      }, []);
    };
    
    return filterItems(JSON.parse(JSON.stringify(navStructure)));
  }, [navStructure, searchQuery, getTranslatedName, getTranslatedDescription]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        style={{ 
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out'
        }}
      />

      <div 
        className="lg:hidden fixed top-0 left-0 h-full w-[85vw] max-w-sm z-50 overflow-hidden shadow-2xl"
        suppressHydrationWarning
        style={{
          backgroundColor: getBackgroundColor(),
          borderRight: `1px solid ${getBorderColor()}`,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          opacity: isOpen ? 1 : 0,
          transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div className="relative p-4 border-b" style={{ borderColor: getBorderColor() }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="p-2.5 rounded-2xl shadow-lg flex items-center justify-center"
                style={{ 
                  background: getGradient(),
                  boxShadow: `0 8px 32px ${themeColors.primary || '#3b82f6'}30`,
                }}
              >
                <DynamicLogo width={28} height={28} className="text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold truncate" style={{ color: getTextPrimaryColor() }}>
                  Centre.com.pk
                </h2>
                <p className="text-xs flex items-center gap-1 truncate" style={{ color: getTextSecondaryColor() }}>
                  <Sparkle className="h-3 w-3 shrink-0" />
                  <span className="truncate">Complete Tools Platform</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl hover:scale-110 active:scale-95 transition-all duration-200 shrink-0"
              style={{ 
                color: getTextSecondaryColor(),
                backgroundColor: getSurfaceColor(),
                border: `1px solid ${getBorderColor()}`,
              }}
              aria-label={getUIText('action.close', 'Close menu')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4" 
              style={{ color: getTextSecondaryColor() }} 
            />
            <input
              type="text"
              placeholder={getUIText('action.search_placeholder', 'Search tools...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-1 transition-all duration-200"
              style={{
                backgroundColor: getSurfaceColor(),
                color: getTextPrimaryColor(),
                border: `1px solid ${getBorderColor()}`,
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-160px)] overflow-y-auto pb-16">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: getTextSecondaryColor() }}>
                {getUIText('navigation.main', 'Main Navigation')}
              </h3>
              <div className="text-xs px-2 py-1 rounded flex items-center gap-1"
                style={{
                  backgroundColor: `${themeColors.primary || '#3b82f6'}10`,
                  color: themeColors.primary || '#3b82f6',
                }}>
                <FolderTree className="h-3 w-3" />
                <span>{getUIText('navigation.categories_count', '7 Categories • 50+ Tools')}</span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              {filteredNavStructure.map((item) => (
                <NavItemComponent key={item.id} item={item} level={0} />
              ))}
              {filteredNavStructure.length === 0 && searchQuery && (
                <div className="text-center py-8" style={{ color: getTextSecondaryColor() }}>
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>

            {/* Stats Cards */}
            <div className="mt-6 p-4 rounded-xl" style={{ 
              backgroundColor: getSurfaceColor(),
              border: `1.5px solid ${getBorderColor()}`,
            }}>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-lg" style={{ 
                  backgroundColor: `${themeColors.primary || '#3b82f6'}10`,
                  border: `1px solid ${getBorderColor(1)}`,
                }}>
                  <div className="text-lg font-bold" style={{ color: themeColors.primary || '#3b82f6' }}>50+</div>
                  <div className="text-xs" style={{ color: getTextSecondaryColor() }}>{getUIText('stats.tools', 'Tools')}</div>
                </div>
                <div className="text-center p-2 rounded-lg" style={{ 
                  backgroundColor: `${themeColors.secondary || '#8b5cf6'}10`,
                  border: `1px solid ${getBorderColor(1)}`,
                }}>
                  <div className="text-lg font-bold" style={{ color: themeColors.secondary || '#8b5cf6' }}>7</div>
                  <div className="text-xs" style={{ color: getTextSecondaryColor() }}>{getUIText('stats.categories', 'Categories')}</div>
                </div>
                <div className="text-center p-2 rounded-lg" style={{ 
                  backgroundColor: '#10b98110',
                  border: `1px solid ${getBorderColor(1)}`,
                }}>
                  <div className="text-lg font-bold" style={{ color: '#10b981' }}>100%</div>
                  <div className="text-xs" style={{ color: getTextSecondaryColor() }}>{getUIText('status.free', 'Free')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t"
          style={{ 
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
          }}>
          <div className="text-center">
            <p className="text-xs" style={{ color: getTextSecondaryColor() }}>
              {getUIText('description.footer_platform', 'Professional Tools Platform')} • © 2026
            </p>
          </div>
        </div>
      </div>
    </>
  );
}