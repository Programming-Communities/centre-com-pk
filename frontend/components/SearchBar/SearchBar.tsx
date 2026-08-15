// components/SearchBar/SearchBar.tsx - WITH FULL MULTI-LANGUAGE SUPPORT
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, X, Clock, TrendingUp, Hash, ExternalLink, 
  Flame, Star, CheckCircle, Image, FileText, Calculator, 
  Code, Type, Palette, Lock, Zap, Globe, Wrench
} from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

// ============================================
// INTERFACES
// ============================================

interface Tool {
  id: number;
  name: string;
  href: string;
  status: 'live' | 'soon' | 'new' | 'popular';
  description: string;
  category: string;
  categoryTitle: string;
}

interface SearchResult {
  id: number;
  title: string;
  type: 'tool' | 'category' | 'feature';
  slug: string;
  excerpt?: string;
  category?: string;
  status?: 'live' | 'soon' | 'new' | 'popular';
}

// ============================================
// MULTI-LANGUAGE TRANSLATIONS
// ============================================

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    searchPlaceholder: 'Search 50+ tools... (e.g., Image Resizer, PDF Merger)',
    recentSearches: 'Recent Searches',
    clearAll: 'Clear all',
    popularTools: 'Popular Tools',
    searchResults: 'Search Results',
    found: 'Found',
    tools: 'tools',
    for: 'for',
    viewAll: 'View all',
    noToolsFound: 'No tools found',
    trySearching: 'Try searching for: "Image Resizer", "PDF Merger", or "BMI Calculator"',
    navigate: 'Navigate',
    select: 'Select',
    close: 'Close',
    imageTools: 'Image Tools',
    pdfTools: 'PDF Tools',
    calculators: 'Calculators',
    codeTools: 'Code Tools',
    textTools: 'Text Tools',
    designTools: 'Design Tools',
    securityTools: 'Security Tools',
    popular: 'Popular',
    new: 'New',
    live: 'Live',
    soon: 'Soon',
    remove: 'Remove search',
  },
  ur: {
    searchPlaceholder: '50+ ٹولز تلاش کریں... (مثال: امیج ریزائزر، پی ڈی ایف مرجر)',
    recentSearches: 'حالیہ تلاشیں',
    clearAll: 'سب صاف کریں',
    popularTools: 'مقبول ٹولز',
    searchResults: 'تلاش کے نتائج',
    found: 'ملے',
    tools: 'ٹولز',
    for: 'کے لیے',
    viewAll: 'سب دیکھیں',
    noToolsFound: 'کوئی ٹولز نہیں ملے',
    trySearching: 'تلاش کرنے کی کوشش کریں: "امیج ریزائزر"، "پی ڈی ایف مرجر"، یا "BMI کیلکولیٹر"',
    navigate: 'نیویگیٹ',
    select: 'منتخب کریں',
    close: 'بند کریں',
    imageTools: 'امیج ٹولز',
    pdfTools: 'پی ڈی ایف ٹولز',
    calculators: 'کیلکولیٹرز',
    codeTools: 'کوڈ ٹولز',
    textTools: 'ٹیکسٹ ٹولز',
    designTools: 'ڈیزائن ٹولز',
    securityTools: 'سیکیورٹی ٹولز',
    popular: 'مقبول',
    new: 'نیا',
    live: 'لائیو',
    soon: 'جلد',
    remove: 'تلاشی ہٹائیں',
  },
  hi: {
    searchPlaceholder: '50+ टूल्स खोजें... (उदा: इमेज रिसाइजर, पीडीएफ मर्जर)',
    recentSearches: 'हाल की खोजें',
    clearAll: 'सभी साफ़ करें',
    popularTools: 'लोकप्रिय टूल्स',
    searchResults: 'खोज परिणाम',
    found: 'मिले',
    tools: 'टूल्स',
    for: 'के लिए',
    viewAll: 'सभी देखें',
    noToolsFound: 'कोई टूल्स नहीं मिले',
    trySearching: 'खोजने का प्रयास करें: "इमेज रिसाइजर", "पीडीएफ मर्जर", या "BMI कैलकुलेटर"',
    navigate: 'नेविगेट करें',
    select: 'चुनें',
    close: 'बंद करें',
    imageTools: 'इमेज टूल्स',
    pdfTools: 'पीडीएफ टूल्स',
    calculators: 'कैलकुलेटर',
    codeTools: 'कोड टूल्स',
    textTools: 'टेक्स्ट टूल्स',
    designTools: 'डिज़ाइन टूल्स',
    securityTools: 'सुरक्षा टूल्स',
    popular: 'लोकप्रिय',
    new: 'नया',
    live: 'लाइव',
    soon: 'जल्द',
    remove: 'खोज हटाएं',
  },
  ar: {
    searchPlaceholder: 'ابحث في 50+ أداة... (مثال: تغيير حجم الصورة، دمج PDF)',
    recentSearches: 'عمليات البحث الأخيرة',
    clearAll: 'مسح الكل',
    popularTools: 'الأدوات الشائعة',
    searchResults: 'نتائج البحث',
    found: 'تم العثور على',
    tools: 'أدوات',
    for: 'لـ',
    viewAll: 'عرض الكل',
    noToolsFound: 'لم يتم العثور على أدوات',
    trySearching: 'حاول البحث عن: "تغيير حجم الصورة"، "دمج PDF"، أو "حاسبة BMI"',
    navigate: 'تنقل',
    select: 'اختر',
    close: 'إغلاق',
    imageTools: 'أدوات الصور',
    pdfTools: 'أدوات PDF',
    calculators: 'الآلات الحاسبة',
    codeTools: 'أدوات البرمجة',
    textTools: 'أدوات النص',
    designTools: 'أدوات التصميم',
    securityTools: 'أدوات الأمان',
    popular: 'شائع',
    new: 'جديد',
    live: 'مباشر',
    soon: 'قريباً',
    remove: 'إزالة البحث',
  },
};

// ============================================
// TOOLS DATA (MULTI-LANGUAGE NAMES)
// ============================================

const getToolsData = (lang: string): Tool[] => {
  const toolNames: Record<string, Record<string, string>> = {
    'image-resizer': { en: 'Image Resizer', ur: 'امیج ریزائزر', hi: 'इमेज रिसाइजर', ar: 'تغيير حجم الصورة' },
    'image-compressor': { en: 'Image Compressor', ur: 'امیج کمپریسر', hi: 'इमेज कंप्रेसर', ar: 'ضاغط الصور' },
    'image-cropper': { en: 'Image Cropper', ur: 'امیج کراپر', hi: 'इमेज क्रॉपर', ar: 'اقتصاص الصورة' },
    'background-remover': { en: 'Background Remover', ur: 'بیک گراؤنڈ ریموور', hi: 'बैकग्राउंड रिमूवर', ar: 'مزيل الخلفية' },
    'image-converter': { en: 'Format Converter', ur: 'فارمیٹ کنورٹر', hi: 'फॉर्मेट कन्वर्टर', ar: 'محول التنسيق' },
    'image-rotator': { en: 'Image Rotator', ur: 'امیج روٹیٹر', hi: 'इमेज रोटेटर', ar: 'مدور الصورة' },
    'image-filters': { en: 'Image Filters', ur: 'امیج فلٹرز', hi: 'इमेज फिल्टर', ar: 'فلاتر الصور' },
    'meme-generator': { en: 'Meme Generator', ur: 'میم جنریٹر', hi: 'मीम जनरेटर', ar: 'مولد الميم' },
    'favicon-generator': { en: 'Favicon Generator', ur: 'فیویکن جنریٹر', hi: 'फेविकॉन जनरेटर', ar: 'مولد الأيقونة' },
    'photo-collage': { en: 'Photo Collage', ur: 'فوٹو کولاج', hi: 'फोटो कोलाज', ar: 'كولاج الصور' },
    'pdf-merger': { en: 'PDF Merger', ur: 'پی ڈی ایف مرجر', hi: 'पीडीएफ मर्जर', ar: 'دمج PDF' },
    'pdf-splitter': { en: 'PDF Splitter', ur: 'پی ڈی ایف سپلٹر', hi: 'पीडीएफ स्प्लिटर', ar: 'تقسيم PDF' },
    'pdf-compressor': { en: 'PDF Compressor', ur: 'پی ڈی ایف کمپریسر', hi: 'पीडीएफ कंप्रेसर', ar: 'ضاغط PDF' },
    'pdf-to-word': { en: 'PDF to Word', ur: 'پی ڈی ایف ٹو ورڈ', hi: 'पीडीएफ टू वर्ड', ar: 'PDF إلى Word' },
    'bmi-calculator': { en: 'BMI Calculator', ur: 'BMI کیلکولیٹر', hi: 'BMI कैलकुलेटर', ar: 'حاسبة BMI' },
    'age-calculator': { en: 'Age Calculator', ur: 'ایج کیلکولیٹر', hi: 'आयु कैलकुलेटर', ar: 'حاسبة العمر' },
    'loan-calculator': { en: 'Loan Calculator', ur: 'لون کیلکولیٹر', hi: 'लोन कैलकुलेटर', ar: 'حاسبة القرض' },
    'currency-converter': { en: 'Currency Converter', ur: 'کرنسی کنورٹر', hi: 'करेंसी कन्वर्टर', ar: 'محول العملات' },
    'unit-converter': { en: 'Unit Converter', ur: 'یونٹ کنورٹر', hi: 'यूनिट कन्वर्टर', ar: 'محول الوحدات' },
    'percentage-calculator': { en: 'Percentage Calculator', ur: 'پرسنٹیج کیلکولیٹر', hi: 'प्रतिशत कैलकुलेटर', ar: 'حاسبة النسبة المئوية' },
    'date-calculator': { en: 'Date Calculator', ur: 'ڈیٹ کیلکولیٹر', hi: 'डेट कैलकुलेटर', ar: 'حاسبة التاريخ' },
    'tip-calculator': { en: 'Tip Calculator', ur: 'ٹپ کیلکولیٹر', hi: 'टिप कैलकुलेटर', ar: 'حاسبة البقشيش' },
    'gpa-calculator': { en: 'GPA Calculator', ur: 'GPA کیلکولیٹر', hi: 'GPA कैलकुलेटर', ar: 'حاسبة GPA' },
    'compound-interest': { en: 'Compound Interest', ur: 'کمپاؤنڈ انٹرسٹ', hi: 'कंपाउंड इंटरेस्ट', ar: 'الفائدة المركبة' },
    'json-formatter': { en: 'JSON Formatter', ur: 'JSON فارمیٹر', hi: 'JSON फॉर्मेटर', ar: 'منسق JSON' },
    'qr-code-generator': { en: 'QR Code Generator', ur: 'QR کوڈ جنریٹر', hi: 'QR कोड जनरेटर', ar: 'مولد QR Code' },
    'html-formatter': { en: 'HTML Formatter', ur: 'HTML فارمیٹر', hi: 'HTML फॉर्मेटर', ar: 'منسق HTML' },
    'css-formatter': { en: 'CSS Formatter', ur: 'CSS فارمیٹر', hi: 'CSS फॉर्मेटर', ar: 'منسق CSS' },
    'javascript-formatter': { en: 'JavaScript Formatter', ur: 'JavaScript فارمیٹر', hi: 'JavaScript फॉर्मेटर', ar: 'منسق JavaScript' },
    'xml-formatter': { en: 'XML Formatter', ur: 'XML فارمیٹر', hi: 'XML फॉर्मेटर', ar: 'منسق XML' },
    'base64-encoder': { en: 'Base64 Encoder', ur: 'Base64 انکوڈر', hi: 'Base64 एनकोडर', ar: 'مشفر Base64' },
    'url-encoder': { en: 'URL Encoder', ur: 'URL انکوڈر', hi: 'URL एनकोडर', ar: 'مشفر URL' },
    'word-counter': { en: 'Word Counter', ur: 'ورڈ کاؤنٹر', hi: 'वर्ड काउंटर', ar: 'عداد الكلمات' },
    'character-counter': { en: 'Character Counter', ur: 'کریکٹر کاؤنٹر', hi: 'कैरेक्टर काउंटर', ar: 'عداد الأحرف' },
    'case-converter': { en: 'Case Converter', ur: 'کیس کنورٹر', hi: 'केस कन्वर्टर', ar: 'محول الحالة' },
    'text-extractor': { en: 'Text Extractor', ur: 'ٹیکسٹ ایکسٹریکٹر', hi: 'टेक्स्ट एक्सट्रैक्टर', ar: 'مستخرج النص' },
    'lorem-ipsum': { en: 'Lorem Ipsum', ur: 'لوریم ایپسم', hi: 'लोरेम इप्सम', ar: 'لوريم إيبسوم' },
    'markdown-editor': { en: 'Markdown Editor', ur: 'مارک ڈاؤن ایڈیٹر', hi: 'मार्कडाउन एडिटर', ar: 'محرر Markdown' },
    'text-diff': { en: 'Text Diff', ur: 'ٹیکسٹ ڈف', hi: 'टेक्स्ट डिफ', ar: 'مقارنة النص' },
    'regex-tester': { en: 'Regex Tester', ur: 'ریجیکس ٹیسٹر', hi: 'रेगेक्स टेस्टर', ar: 'مختبر Regex' },
    'uuid-generator': { en: 'UUID Generator', ur: 'UUID جنریٹر', hi: 'UUID जनरेटर', ar: 'مولد UUID' },
    'color-picker': { en: 'Color Picker', ur: 'کلر پیکر', hi: 'कलर पिकर', ar: 'منتقي الألوان' },
    'password-generator': { en: 'Password Generator', ur: 'پاس ورڈ جنریٹر', hi: 'पासवर्ड जनरेटर', ar: 'مولد كلمات المرور' },
  };

  const categoryNames: Record<string, Record<string, string>> = {
    imageTools: { en: 'Image Tools', ur: 'امیج ٹولز', hi: 'इमेज टूल्स', ar: 'أدوات الصور' },
    pdfTools: { en: 'PDF Tools', ur: 'پی ڈی ایف ٹولز', hi: 'पीडीएफ टूल्स', ar: 'أدوات PDF' },
    calculators: { en: 'Calculators', ur: 'کیلکولیٹرز', hi: 'कैलकुलेटर', ar: 'الآلات الحاسبة' },
    codeTools: { en: 'Code Tools', ur: 'کوڈ ٹولز', hi: 'कोड टूल्स', ar: 'أدوات البرمجة' },
    textTools: { en: 'Text Tools', ur: 'ٹیکسٹ ٹولز', hi: 'टेक्स्ट टूल्स', ar: 'أدوات النص' },
    designTools: { en: 'Design Tools', ur: 'ڈیزائن ٹولز', hi: 'डिज़ाइन टूल्स', ar: 'أدوات التصميم' },
    securityTools: { en: 'Security Tools', ur: 'سیکیورٹی ٹولز', hi: 'सुरक्षा टूल्स', ar: 'أدوات الأمان' },
  };

  const baseTools: Array<{
    id: number;
    slug: string;
    status: 'live' | 'soon' | 'new' | 'popular';
    description: Record<string, string>;
    category: string;
  }> = [
    { id: 1, slug: 'image-resizer', status: 'popular', description: { en: 'Resize images to any dimension', ur: 'تصاویر کو کسی بھی سائز میں تبدیل کریں', hi: 'छवियों को किसी भी आकार में बदलें', ar: 'تغيير حجم الصور إلى أي بعد' }, category: 'imageTools' },
    { id: 2, slug: 'image-compressor', status: 'live', description: { en: 'Compress images without quality loss', ur: 'کوالٹی خراب کیے بغیر تصاویر کمپریس کریں', hi: 'गुणवत्ता खोए बिना छवियों को कंप्रेस करें', ar: 'ضغط الصور دون فقدان الجودة' }, category: 'imageTools' },
    { id: 3, slug: 'image-cropper', status: 'live', description: { en: 'Crop images to perfect size', ur: 'تصاویر کو درست سائز میں کراپ کریں', hi: 'छवियों को सही आकार में क्रॉप करें', ar: 'اقتصاص الصور إلى الحجم المثالي' }, category: 'imageTools' },
    { id: 4, slug: 'background-remover', status: 'live', description: { en: 'Remove background automatically', ur: 'بیک گراؤنڈ خودکار طریقے سے ہٹائیں', hi: 'बैकग्राउंड स्वचालित रूप से हटाएं', ar: 'إزالة الخلفية تلقائياً' }, category: 'imageTools' },
    { id: 5, slug: 'pdf-merger', status: 'popular', description: { en: 'Merge multiple PDFs into one', ur: 'متعدد پی ڈی ایف کو ایک میں مرج کریں', hi: 'कई पीडीएफ को एक में मर्ज करें', ar: 'دمج عدة ملفات PDF في ملف واحد' }, category: 'pdfTools' },
    { id: 6, slug: 'bmi-calculator', status: 'popular', description: { en: 'Calculate Body Mass Index', ur: 'باڈی ماس انڈیکس کیلکولیٹ کریں', hi: 'बॉडी मास इंडेक्स की गणना करें', ar: 'حساب مؤشر كتلة الجسم' }, category: 'calculators' },
    { id: 7, slug: 'age-calculator', status: 'live', description: { en: 'Calculate exact age', ur: 'درست عمر کیلکولیٹ کریں', hi: 'सटीक आयु की गणना करें', ar: 'حساب العمر الدقيق' }, category: 'calculators' },
    { id: 8, slug: 'json-formatter', status: 'popular', description: { en: 'Format and validate JSON', ur: 'JSON فارمیٹ اور ویلیڈیٹ کریں', hi: 'JSON फॉर्मेट और वैलिडेट करें', ar: 'تنسيق والتحقق من JSON' }, category: 'codeTools' },
    { id: 9, slug: 'qr-code-generator', status: 'popular', description: { en: 'Generate QR codes', ur: 'QR کوڈز جنریٹ کریں', hi: 'QR कोड जनरेट करें', ar: 'توليد رموز QR' }, category: 'codeTools' },
    { id: 10, slug: 'password-generator', status: 'popular', description: { en: 'Generate secure passwords', ur: 'محفوظ پاس ورڈ جنریٹ کریں', hi: 'सुरक्षित पासवर्ड जनरेट करें', ar: 'توليد كلمات مرور آمنة' }, category: 'securityTools' },
    { id: 11, slug: 'word-counter', status: 'popular', description: { en: 'Count words and characters', ur: 'الفاظ اور حروف گنیں', hi: 'शब्द और अक्षर गिनें', ar: 'عد الكلمات والأحرف' }, category: 'textTools' },
    { id: 12, slug: 'color-picker', status: 'popular', description: { en: 'Pick and convert colors', ur: 'رنگ چنیں اور کنورٹ کریں', hi: 'रंग चुनें और कन्वर्ट करें', ar: 'اختيار وتحويل الألوان' }, category: 'designTools' },
  ];

  return baseTools.map(tool => ({
    id: tool.id,
    name: toolNames[tool.slug]?.[lang] || toolNames[tool.slug]?.en || tool.slug,
    href: `/${lang}/tools/${tool.category === 'imageTools' ? 'image-tools' : tool.category === 'pdfTools' ? 'pdf-tools' : tool.category === 'codeTools' ? 'code-tools' : tool.category === 'textTools' ? 'text-tools' : tool.category === 'designTools' ? 'design-tools' : tool.category === 'securityTools' ? 'security-tools' : 'calculators'}/${tool.slug}`,
    status: tool.status,
    description: tool.description[lang] || tool.description.en,
    category: tool.category,
    categoryTitle: categoryNames[tool.category]?.[lang] || categoryNames[tool.category]?.en || tool.category,
  }));
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function SearchBar() {
  const params = useParams();
  const router = useRouter();
  const { themeColors } = useTheme();
  
  // ✅ Get current language from URL params
  const lang = (params?.lang as string) || 'en';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRTL = lang === 'ur' || lang === 'ar';
  
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  
  // ✅ Get tools data with current language
  const allTools = getToolsData(lang);

  // Load recent searches
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSearches = localStorage.getItem(`recent_searches_${lang}`);
      if (savedSearches) {
        try {
          const searches = JSON.parse(savedSearches);
          setRecentSearches(searches.slice(0, 5));
        } catch (error) {
          console.error('Error parsing recent searches:', error);
        }
      }
      
      // Language-specific trending searches
      const trendingMap: Record<string, string[]> = {
        en: ['Image Resizer', 'PDF Merger', 'BMI Calculator', 'JSON Formatter', 'Password Generator'],
        ur: ['امیج ریزائزر', 'پی ڈی ایف مرجر', 'BMI کیلکولیٹر', 'JSON فارمیٹر', 'پاس ورڈ جنریٹر'],
        hi: ['इमेज रिसाइजर', 'पीडीएफ मर्जर', 'BMI कैलकुलेटर', 'JSON फॉर्मेटर', 'पासवर्ड जनरेटर'],
        ar: ['تغيير حجم الصورة', 'دمج PDF', 'حاسبة BMI', 'منسق JSON', 'مولد كلمات المرور'],
      };
      setTrending(trendingMap[lang] || trendingMap.en);
    }
  }, [lang]);

  // Keyboard shortcut (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchPanelRef.current && 
        searchButtonRef.current &&
        !searchPanelRef.current.contains(event.target as Node) &&
        !searchButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTimer = setTimeout(() => {
      setIsLoading(true);
      try {
        const searchTerm = query.toLowerCase();
        const searchResults = allTools
          .filter(tool =>
            tool.name.toLowerCase().includes(searchTerm) ||
            tool.description.toLowerCase().includes(searchTerm) ||
            tool.categoryTitle.toLowerCase().includes(searchTerm)
          )
          .map(tool => ({
            id: tool.id,
            title: tool.name,
            type: 'tool' as const,
            slug: tool.href,
            excerpt: tool.description,
            category: tool.categoryTitle,
            status: tool.status
          }));

        setResults(searchResults.slice(0, 8));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query, lang, allTools]);

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    if (typeof window !== 'undefined') {
      const searches = JSON.parse(localStorage.getItem(`recent_searches_${lang}`) || '[]');
      const updatedSearches = [searchQuery, ...searches.filter((s: string) => s !== searchQuery)].slice(0, 10);
      localStorage.setItem(`recent_searches_${lang}`, JSON.stringify(updatedSearches));
      setRecentSearches(updatedSearches.slice(0, 5));
    }

    // ✅ Navigate with language prefix
    router.push(`/${lang}/search?q=${encodeURIComponent(searchQuery)}`);
    
    setIsOpen(false);
    setQuery('');
  };

  const handleClearRecent = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`recent_searches_${lang}`);
      setRecentSearches([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleRemoveRecentSearch = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((_, i) => i !== index);
    localStorage.setItem(`recent_searches_${lang}`, JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const getStatusBadge = (status: Tool['status']) => {
    const statusText: Record<string, Record<string, string>> = {
      popular: { en: 'Popular', ur: 'مقبول', hi: 'लोकप्रिय', ar: 'شائع' },
      new: { en: 'New', ur: 'نیا', hi: 'नया', ar: 'جديد' },
      live: { en: 'Live', ur: 'لائیو', hi: 'लाइव', ar: 'مباشر' },
      soon: { en: 'Soon', ur: 'جلد', hi: 'जल्द', ar: 'قريباً' },
    };
    
    switch (status) {
      case 'popular':
        return { text: statusText.popular[lang] || 'Popular', color: themeColors.warning, bgColor: `${themeColors.warning}20` };
      case 'new':
        return { text: statusText.new[lang] || 'New', color: themeColors.secondary, bgColor: `${themeColors.secondary}20` };
      case 'soon':
        return { text: statusText.soon[lang] || 'Soon', color: themeColors.warning, bgColor: `${themeColors.warning}20` };
      default:
        return { text: statusText.live[lang] || 'Live', color: themeColors.success, bgColor: `${themeColors.success}20` };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Image Tools': return Image;
      case 'امیج ٹولز': return Image;
      case 'इमेज टूल्स': return Image;
      case 'أدوات الصور': return Image;
      case 'PDF Tools': return FileText;
      case 'پی ڈی ایف ٹولز': return FileText;
      case 'पीडीएफ टूल्स': return FileText;
      case 'أدوات PDF': return FileText;
      case 'Calculators': return Calculator;
      case 'کیلکولیٹرز': return Calculator;
      case 'कैलकुलेटर': return Calculator;
      case 'الآلات الحاسبة': return Calculator;
      case 'Code Tools': return Code;
      case 'کوڈ ٹولز': return Code;
      case 'कोड टूल्स': return Code;
      case 'أدوات البرمجة': return Code;
      case 'Text Tools': return Type;
      case 'ٹیکسٹ ٹولز': return Type;
      case 'टेक्स्ट टूल्स': return Type;
      case 'أدوات النص': return Type;
      case 'Design Tools': return Palette;
      case 'ڈیزائن ٹولز': return Palette;
      case 'डिज़ाइन टूल्स': return Palette;
      case 'أدوات التصميم': return Palette;
      case 'Security Tools': return Lock;
      case 'سیکیورٹی ٹولز': return Lock;
      case 'सुरक्षा टूल्स': return Lock;
      case 'أدوات الأمان': return Lock;
      default: return Wrench;
    }
  };

  const getCategoryColor = (category: string) => {
    if (category.includes('Image') || category.includes('امیج') || category.includes('इमेज') || category.includes('الصور')) {
      return { bg: `${themeColors.primary}10`, color: themeColors.primary };
    }
    if (category.includes('PDF') || category.includes('پی ڈی ایف') || category.includes('पीडीएफ')) {
      return { bg: `${themeColors.success}10`, color: themeColors.success };
    }
    if (category.includes('Calculator') || category.includes('کیلکولیٹر') || category.includes('कैलकुलेटर') || category.includes('الحاسبة')) {
      return { bg: `${themeColors.warning}10`, color: themeColors.warning };
    }
    if (category.includes('Code') || category.includes('کوڈ') || category.includes('कोड') || category.includes('البرمجة')) {
      return { bg: `${themeColors.secondary}10`, color: themeColors.secondary };
    }
    if (category.includes('Security') || category.includes('سیکیورٹی') || category.includes('सुरक्षा') || category.includes('الأمان')) {
      return { bg: `${themeColors.error}10`, color: themeColors.error };
    }
    return { bg: `${themeColors.primary}10`, color: themeColors.primary };
  };

  const hexToRgb = (hex: string): string => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  };

  return (
    <div className="relative">
      {/* Search button */}
      <button
        ref={searchButtonRef}
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 group"
        style={{
          backgroundColor: themeColors.surface,
          color: themeColors.text.primary,
          border: `1px solid ${themeColors.border}`,
          boxShadow: `0 2px 8px ${themeColors.primary}05`
        }}
        aria-label={t.searchPlaceholder}
      >
        <Search size={18} className="transition-transform group-hover:scale-110" 
          style={{ color: themeColors.text.secondary }} 
        />
        <span className="text-sm hidden md:inline" style={{ color: themeColors.text.secondary }}>
          {t.searchPlaceholder.length > 30 ? t.searchPlaceholder.substring(0, 30) + '...' : t.searchPlaceholder}
        </span>
        <kbd className="hidden lg:inline-flex items-center px-2 py-1 text-xs rounded ml-2 transition"
          style={{
            backgroundColor: themeColors.background,
            color: themeColors.text.secondary,
            border: `1px solid ${themeColors.border}`,
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Search overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-100">
          <div 
            className="absolute inset-0 transition-all duration-300"
            style={{
              backgroundColor: `rgba(${hexToRgb(themeColors.background)}, 0.7)`,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onClick={() => setIsOpen(false)}
          />

          <div 
            ref={searchPanelRef}
            className="absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-2xl"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="rounded-2xl shadow-2xl mx-4 overflow-hidden border transition-all duration-300"
              style={{
                backgroundColor: themeColors.background,
                borderColor: themeColors.border,
                boxShadow: `0 20px 40px ${themeColors.primary}10`
              }}
            >
              {/* Search input */}
              <div className="p-4 border-b" style={{ borderColor: themeColors.border }}>
                <div className="relative">
                  <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2`} 
                    style={{ color: themeColors.text.secondary }} 
                    size={20} 
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.searchPlaceholder}
                    className={`w-full ${isRTL ? 'pr-12 pl-10' : 'pl-12 pr-10'} py-4 rounded-xl text-lg border-0 focus:ring-2 focus:ring-offset-2 transition-all duration-200`}
                    style={{
                      backgroundColor: themeColors.surface,
                      color: themeColors.text.primary,
                      outline: 'none',
                      boxShadow: `0 2px 12px ${themeColors.primary}05`,
                      textAlign: isRTL ? 'right' : 'left',
                    }}
                    autoFocus
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 p-1 rounded-full transition hover:scale-110`}
                      style={{ 
                        color: themeColors.text.secondary,
                        backgroundColor: `${themeColors.text.secondary}10`
                      }}
                      aria-label={t.close}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {/* Recent searches */}
                {!query && recentSearches.length > 0 && (
                  <div className="p-4 border-b" style={{ borderColor: themeColors.border }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Clock size={16} style={{ color: themeColors.text.secondary }} />
                        <span className="font-medium" style={{ color: themeColors.text.primary }}>
                          {t.recentSearches}
                        </span>
                      </div>
                      <button
                        onClick={handleClearRecent}
                        className="text-sm px-2 py-1 rounded transition hover:scale-105"
                        style={{ 
                          color: themeColors.text.secondary,
                          backgroundColor: `${themeColors.text.secondary}10`
                        }}
                      >
                        {t.clearAll}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setQuery(search);
                            handleSearch(search);
                          }}
                          className="flex items-center justify-between w-full p-3 text-left rounded-xl transition-all duration-200 hover:scale-[1.02] group cursor-pointer"
                          style={{
                            backgroundColor: themeColors.surface,
                            color: themeColors.text.primary,
                            border: `1px solid ${themeColors.border}`,
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <Clock size={14} style={{ color: themeColors.text.secondary }} />
                            <span>{search}</span>
                          </div>
                          <div
                            onClick={(e) => handleRemoveRecentSearch(index, e)}
                            className="p-1 rounded transition opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer"
                            style={{ 
                              color: themeColors.text.secondary,
                              backgroundColor: `${themeColors.text.secondary}10`
                            }}
                            aria-label={t.remove}
                          >
                            <X size={12} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending searches */}
                {!query && (
                  <div className="p-4 border-b" style={{ borderColor: themeColors.border }}>
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp size={16} style={{ color: themeColors.text.secondary }} />
                      <span className="font-medium" style={{ color: themeColors.text.primary }}>
                        {t.popularTools}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trending.map((tool, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(tool);
                            handleSearch(tool);
                          }}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
                          style={{
                            backgroundColor: `${themeColors.primary}10`,
                            color: themeColors.primary,
                            border: `1px solid ${themeColors.primary}30`
                          }}
                        >
                          <Hash size={12} />
                          <span className="text-sm font-medium">{tool}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search results */}
                {query && (
                  <div className="p-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: themeColors.surface }}></div>
                              <div className="flex-1">
                                <div className="h-4 rounded mb-2 w-3/4" style={{ backgroundColor: themeColors.surface }}></div>
                                <div className="h-3 rounded w-1/2" style={{ backgroundColor: themeColors.surface }}></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : results.length > 0 ? (
                      <div className="space-y-3">
                        <div className="text-sm mb-2" style={{ color: themeColors.text.secondary }}>
                          {t.found} {results.length} {t.tools} {t.for} "{query}"
                        </div>
                        {results.map((result) => {
                          const statusBadge = result.status ? getStatusBadge(result.status) : null;
                          const CategoryIcon = result.category ? getCategoryIcon(result.category) : Wrench;
                          const categoryColor = result.category ? getCategoryColor(result.category) : { bg: `${themeColors.primary}10`, color: themeColors.primary };
                          
                          return (
                            <Link
                              key={result.id}
                              href={result.slug}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] group"
                              style={{
                                backgroundColor: themeColors.surface,
                                color: themeColors.text.primary,
                                border: `1px solid ${themeColors.border}`,
                                boxShadow: `0 2px 8px ${themeColors.primary}05`
                              }}
                            >
                              <div className="flex items-start space-x-4">
                                <div className="p-2 rounded-lg transition-transform group-hover:scale-110"
                                  style={{ backgroundColor: categoryColor.bg, color: categoryColor.color }}
                                >
                                  <CategoryIcon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="font-semibold line-clamp-1 transition-colors group-hover:text-primary">
                                    {result.title}
                                  </span>
                                  <p className="text-sm mt-1 line-clamp-2" style={{ color: themeColors.text.secondary }}>
                                    {result.excerpt}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    {result.category && (
                                      <span className="text-xs px-2 py-1 rounded-full"
                                        style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                                      >
                                        {result.category}
                                      </span>
                                    )}
                                    {statusBadge && (
                                      <span className="text-xs px-2 py-1 rounded-full"
                                        style={{ backgroundColor: statusBadge.bgColor, color: statusBadge.color }}
                                      >
                                        {statusBadge.text}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <ExternalLink 
                                className="h-4 w-4 transition-transform group-hover:scale-110 opacity-0 group-hover:opacity-100 ml-4"
                                style={{ color: themeColors.text.secondary }}
                              />
                            </Link>
                          );
                        })}
                        <button
                          onClick={() => handleSearch()}
                          className="w-full p-4 text-center rounded-xl border transition-all duration-200 hover:scale-[1.02] font-semibold"
                          style={{
                            backgroundColor: themeColors.surface,
                            color: themeColors.primary,
                            border: `1px solid ${themeColors.primary}30`,
                            boxShadow: `0 2px 12px ${themeColors.primary}10`
                          }}
                        >
                          {t.viewAll} {results.length} {t.tools} {t.for} "{query}"
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${themeColors.primary}10`, color: themeColors.primary }}
                        >
                          <Search size={28} />
                        </div>
                        <span className="font-bold text-lg mb-2 block" style={{ color: themeColors.text.primary }}>
                          {t.noToolsFound}
                        </span>
                        <p className="max-w-md mx-auto mb-6" style={{ color: themeColors.text.secondary }}>
                          {t.trySearching}
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {[t.imageTools, t.pdfTools, t.calculators, t.codeTools].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setQuery(cat)}
                              className="px-3 py-1.5 text-sm rounded-lg transition hover:scale-105"
                              style={{
                                backgroundColor: `${themeColors.primary}10`,
                                color: themeColors.primary,
                                border: `1px solid ${themeColors.primary}30`
                              }}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t" style={{ borderColor: themeColors.border, backgroundColor: themeColors.surface }}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <kbd className="px-2 py-1 rounded font-mono transition"
                      style={{ backgroundColor: themeColors.background, color: themeColors.text.secondary, border: `1px solid ${themeColors.border}` }}
                    >
                      ↑↓
                    </kbd>
                    <span style={{ color: themeColors.text.secondary }}>{t.navigate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <kbd className="px-2 py-1 rounded font-mono transition"
                      style={{ backgroundColor: themeColors.background, color: themeColors.text.secondary, border: `1px solid ${themeColors.border}` }}
                    >
                      Enter
                    </kbd>
                    <span style={{ color: themeColors.text.secondary }}>{t.select}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <kbd className="px-2 py-1 rounded font-mono transition"
                      style={{ backgroundColor: themeColors.background, color: themeColors.text.secondary, border: `1px solid ${themeColors.border}` }}
                    >
                      Esc
                    </kbd>
                    <span style={{ color: themeColors.text.secondary }}>{t.close}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}