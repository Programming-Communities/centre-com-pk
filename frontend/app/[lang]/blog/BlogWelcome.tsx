"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Brain, 
  Rocket, 
  GraduationCap, 
  Code, 
  Zap, 
  Shield,
  BookOpen,
  TrendingUp,
  Users,
  Globe,
  Clock,
  Calendar,
  ArrowRight,
  Search,
  Filter,
  Star,
  CheckCircle,
  PlayCircle,
  Download,
  Share2,
  Target,
  Heart,
  Award,
  Sparkles,
  Cpu,
  Database,
  Cloud,
  Lock,
  BarChart,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  Video,
  Headphones
} from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

export default function BlogWelcome() {
  const { themeColors, theme: currentTheme, fontFamily: currentFont, isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState('en');

  useEffect(() => {
    setMounted(true);
    const path = window.location.pathname;
    const pathLang = path.split('/')[1];
    if (pathLang === 'ur' || pathLang === 'ar' || pathLang === 'hi') {
      setLang(pathLang);
    } else {
      setLang('en');
    }
  }, []);

  if (!mounted) return null;

  const getDirection = () => {
    if (lang === 'ur' || lang === 'ar') return 'rtl';
    return 'ltr';
  };

  // ==================== ENGLISH CONTENT ====================
  const enContent = {
    heroBadge: 'AI EDUCATION PLATFORM',
    heroTitle: 'Learn',
    heroTitleHighlight: 'AI',
    heroTitleEnd: 'For Free',
    heroSubtitle: 'Complete AI education resources, tutorials, and tools. Start your AI journey today with our free learning platform.',
    stats: [
      { value: '100+', label: 'Free Lessons', icon: BookOpen },
      { value: 'Thousands', label: 'Students', icon: Users },
      { value: '25+', label: 'AI Tools', icon: Zap },
      { value: '24/7', label: 'Access', icon: Clock }
    ],
    searchPlaceholder: 'Search AI topics, tutorials, tools...',
    startLearning: 'Start Learning',
    exploreTools: 'Explore AI Tools',
    
    categoriesTitle: 'AI Learning Categories',
    categoriesSubtitle: 'Comprehensive AI education organized by topics',
    
    toolsTitle: 'Free AI Tools',
    toolsSubtitle: 'Powerful AI tools available for free on Centre.com.pk',
    viewAllTools: 'View All 25+ AI Tools',
    
    pathsTitle: 'Structured Learning Paths',
    pathsSubtitle: 'Follow our curated learning paths from beginner to expert',
    recommended: 'RECOMMENDED',
    beginnerPath: 'AI Beginner Path',
    intermediatePath: 'AI Developer Path',
    advancedPath: 'AI Expert Path',
    beginnerDesc: 'Start your AI journey with basics',
    intermediateDesc: 'Build AI applications and models',
    advancedDesc: 'Master advanced AI concepts',
    duration: 'Program',
    lessons: 'Lessons',
    freeCertificate: 'Free Certificate',
    startPath: 'Start Path',
    continuePath: 'Continue',
    progress: 'Progress',
    
    whyTitle: 'Why Learn AI Now?',
    whySubtitle: 'The future is artificial intelligence',
    whyStats: [
      { title: 'High Demand', description: 'AI jobs growing 74% annually with high salaries', icon: TrendingUp, stat: '74% Growth' },
      { title: 'Future Proof', description: 'AI skills will be essential in all industries', icon: Shield, stat: 'All Industries' },
      { title: 'Innovation', description: 'Create next-generation applications and solutions', icon: Rocket, stat: 'Limitless' },
      { title: 'Accessible', description: 'Learn AI for free with our comprehensive resources', icon: Globe, stat: 'Free Access' }
    ],
    
    ctaTitle: 'Start Your AI Journey Today',
    ctaSubtitle: 'Trusted by thousands of students learning AI for free. No prior experience required.',
    getStarted: 'Get Started Free',
    watchTutorials: 'Watch Tutorials',
    ctaNote: 'No credit card required • Free forever • Certificate included',
    
    themeInfo: 'AI Education'
  };

  // ==================== URDU CONTENT ====================
  const urContent = {
    heroBadge: 'AI تعلیمی پلیٹ فارم',
    heroTitle: 'مفت',
    heroTitleHighlight: 'AI',
    heroTitleEnd: 'سیکھیں',
    heroSubtitle: 'مکمل AI تعلیمی وسائل، سبق اور ٹولز۔ آج ہی ہمارے مفت لرننگ پلیٹ فارم کے ساتھ اپنے AI سفر کا آغاز کریں۔',
    stats: [
      { value: '100+', label: 'مفت اسباق', icon: BookOpen },
      { value: 'ہزاروں', label: 'طلباء', icon: Users },
      { value: '25+', label: 'AI ٹولز', icon: Zap },
      { value: '24/7', label: 'رسائی', icon: Clock }
    ],
    searchPlaceholder: 'AI موضوعات، سبق، ٹولز تلاش کریں...',
    startLearning: 'سیکھنا شروع کریں',
    exploreTools: 'AI ٹولز دریافت کریں',
    
    categoriesTitle: 'AI سیکھنے کے زمرے',
    categoriesSubtitle: 'موضوعات کے لحاظ سے جامع AI تعلیم',
    
    toolsTitle: 'مفت AI ٹولز',
    toolsSubtitle: 'Centre.com.pk پر مفت دستیاب طاقتور AI ٹولز',
    viewAllTools: 'تمام 25+ AI ٹولز دیکھیں',
    
    pathsTitle: 'ساختی سیکھنے کے راستے',
    pathsSubtitle: 'شروع سے ماہر تک ہمارے مرتب کردہ سیکھنے کے راستوں پر عمل کریں',
    recommended: 'تجویز کردہ',
    beginnerPath: 'AI ابتدائی راستہ',
    intermediatePath: 'AI ڈویلپر راستہ',
    advancedPath: 'AI ماہر راستہ',
    beginnerDesc: 'بنیادی باتوں کے ساتھ اپنا AI سفر شروع کریں',
    intermediateDesc: 'AI ایپلی کیشنز اور ماڈلز بنائیں',
    advancedDesc: 'اعلی درجے کے AI تصورات میں مہارت حاصل کریں',
    duration: 'پروگرام',
    lessons: 'اسباق',
    freeCertificate: 'مفت سرٹیفکیٹ',
    startPath: 'راستہ شروع کریں',
    continuePath: 'جاری رکھیں',
    progress: 'پیش رفت',
    
    whyTitle: 'ابھی AI کیوں سیکھیں؟',
    whySubtitle: 'مستقبل مصنوعی ذہانت ہے',
    whyStats: [
      { title: 'اعلی مانگ', description: 'AI ملازمتیں سالانہ 74% بڑھ رہی ہیں', icon: TrendingUp, stat: '74% اضافہ' },
      { title: 'مستقبل ثبوت', description: 'AI ہنر تمام صنعتوں میں ضروری ہو گا', icon: Shield, stat: 'تمام صنعتیں' },
      { title: 'جدت', description: 'اگلی نسل کی ایپلی کیشنز اور حل بنائیں', icon: Rocket, stat: 'لامحدود' },
      { title: 'قابل رسائی', description: 'ہمارے جامع وسائل کے ساتھ مفت AI سیکھیں', icon: Globe, stat: 'مفت رسائی' }
    ],
    
    ctaTitle: 'آج ہی اپنا AI سفر شروع کریں',
    ctaSubtitle: 'ہزاروں طلباء کے ساتھ مفت AI سیکھنے میں شامل ہوں۔ کسی پیشگی تجربے کی ضرورت نہیں۔',
    getStarted: 'مفت شروع کریں',
    watchTutorials: 'سبق دیکھیں',
    ctaNote: 'کریڈٹ کارڈ کی ضرورت نہیں • ہمیشہ مفت • سرٹیفکیٹ شامل ہے',
    
    themeInfo: 'AI تعلیم'
  };

  // ==================== ARABIC CONTENT ====================
  const arContent = {
    heroBadge: 'منصة تعليم الذكاء الاصطناعي',
    heroTitle: 'تعلم',
    heroTitleHighlight: 'الذكاء الاصطناعي',
    heroTitleEnd: 'مجاناً',
    heroSubtitle: 'موارد تعليمية كاملة للذكاء الاصطناعي ودروس وأدوات. ابدأ رحلتك في الذكاء الاصطناعي اليوم مع منصة التعلم المجانية لدينا.',
    stats: [
      { value: '100+', label: 'دروس مجانية', icon: BookOpen },
      { value: 'آلاف', label: 'طلاب', icon: Users },
      { value: '25+', label: 'أدوات ذكاء اصطناعي', icon: Zap },
      { value: '24/7', label: 'وصول', icon: Clock }
    ],
    searchPlaceholder: 'ابحث عن مواضيع الذكاء الاصطناعي والدروس والأدوات...',
    startLearning: 'ابدأ التعلم',
    exploreTools: 'استكشف أدوات الذكاء الاصطناعي',
    
    categoriesTitle: 'فئات تعلم الذكاء الاصطناعي',
    categoriesSubtitle: 'تعليم شامل للذكاء الاصطناعي منظم حسب المواضيع',
    
    toolsTitle: 'أدوات الذكاء الاصطناعي المجانية',
    toolsSubtitle: 'أدوات ذكاء اصطناعي قوية متاحة مجاناً على Centre.com.pk',
    viewAllTools: 'عرض جميع أدوات الذكاء الاصطناعي الـ 25+',
    
    pathsTitle: 'مسارات التعلم المنظمة',
    pathsSubtitle: 'اتبع مسارات التعلم المنسقة لدينا من المبتدئ إلى الخبير',
    recommended: 'موصى به',
    beginnerPath: 'مسار مبتدئ الذكاء الاصطناعي',
    intermediatePath: 'مسار مطور الذكاء الاصطناعي',
    advancedPath: 'مسار خبير الذكاء الاصطناعي',
    beginnerDesc: 'ابدأ رحلتك في الذكاء الاصطناعي مع الأساسيات',
    intermediateDesc: 'بناء تطبيقات ونماذج الذكاء الاصطناعي',
    advancedDesc: 'إتقان مفاهيم الذكاء الاصطناعي المتقدمة',
    duration: 'برنامج',
    lessons: 'دروس',
    freeCertificate: 'شهادة مجانية',
    startPath: 'ابدأ المسار',
    continuePath: 'استمر',
    progress: 'التقدم',
    
    whyTitle: 'لماذا تتعلم الذكاء الاصطناعي الآن؟',
    whySubtitle: 'المستقبل هو الذكاء الاصطناعي',
    whyStats: [
      { title: 'طلب مرتفع', description: 'وظائف الذكاء الاصطناعي تنمو 74% سنوياً', icon: TrendingUp, stat: 'نمو 74%' },
      { title: 'مستقبل', description: 'مهارات الذكاء الاصطناعي ستكون ضرورية في جميع الصناعات', icon: Shield, stat: 'جميع الصناعات' },
      { title: 'ابتكار', description: 'إنشاء تطبيقات وحلول من الجيل التالي', icon: Rocket, stat: 'غير محدود' },
      { title: 'متاح', description: 'تعلم الذكاء الاصطناعي مجاناً مع مواردنا الشاملة', icon: Globe, stat: 'وصول مجاني' }
    ],
    
    ctaTitle: 'ابدأ رحلتك في الذكاء الاصطناعي اليوم',
    ctaSubtitle: 'انضم إلى الآلاف من الطلاب الذين يتعلمون الذكاء الاصطناعي مجاناً. لا حاجة لخبرة سابقة.',
    getStarted: 'ابدأ مجاناً',
    watchTutorials: 'شاهد الدروس',
    ctaNote: 'لا حاجة لبطاقة ائتمان • مجاني للأبد • شهادة مضمنة',
    
    themeInfo: 'تعليم الذكاء الاصطناعي'
  };

  // ==================== HINDI CONTENT ====================
  const hiContent = {
    heroBadge: 'AI शिक्षा मंच',
    heroTitle: 'मुफ्त में',
    heroTitleHighlight: 'AI',
    heroTitleEnd: 'सीखें',
    heroSubtitle: 'पूर्ण AI शिक्षा संसाधन, ट्यूटोरियल और उपकरण। आज ही हमारे मुफ्त लर्निंग प्लेटफॉर्म के साथ अपनी AI यात्रा शुरू करें।',
    stats: [
      { value: '100+', label: 'मुफ्त पाठ', icon: BookOpen },
      { value: 'हज़ारों', label: 'छात्र', icon: Users },
      { value: '25+', label: 'AI उपकरण', icon: Zap },
      { value: '24/7', label: 'पहुंच', icon: Clock }
    ],
    searchPlaceholder: 'AI विषयों, ट्यूटोरियल, उपकरणों की खोज करें...',
    startLearning: 'सीखना शुरू करें',
    exploreTools: 'AI उपकरण खोजें',
    
    categoriesTitle: 'AI सीखने की श्रेणियाँ',
    categoriesSubtitle: 'विषयों के अनुसार व्यापक AI शिक्षा',
    
    toolsTitle: 'मुफ्त AI उपकरण',
    toolsSubtitle: 'Centre.com.pk पर मुफ्त में उपलब्ध शक्तिशाली AI उपकरण',
    viewAllTools: 'सभी 25+ AI उपकरण देखें',
    
    pathsTitle: 'संरचित सीखने के पथ',
    pathsSubtitle: 'शुरुआत से विशेषज्ञ तक हमारे चुनिंदा सीखने के पथों का पालन करें',
    recommended: 'अनुशंसित',
    beginnerPath: 'AI शुरुआती पथ',
    intermediatePath: 'AI डेवलपर पथ',
    advancedPath: 'AI विशेषज्ञ पथ',
    beginnerDesc: 'बुनियादी बातों के साथ अपनी AI यात्रा शुरू करें',
    intermediateDesc: 'AI एप्लिकेशन और मॉडल बनाएं',
    advancedDesc: 'उन्नत AI अवधारणाओं में महारत हासिल करें',
    duration: 'कार्यक्रम',
    lessons: 'पाठ',
    freeCertificate: 'मुफ्त प्रमाणपत्र',
    startPath: 'पथ शुरू करें',
    continuePath: 'जारी रखें',
    progress: 'प्रगति',
    
    whyTitle: 'अभी AI क्यों सीखें?',
    whySubtitle: 'भविष्य कृत्रिम बुद्धिमत्ता है',
    whyStats: [
      { title: 'उच्च मांग', description: 'AI नौकरियां सालाना 74% बढ़ रही हैं', icon: TrendingUp, stat: '74% वृद्धि' },
      { title: 'भविष्य प्रमाण', description: 'AI कौशल सभी उद्योगों में आवश्यक होगा', icon: Shield, stat: 'सभी उद्योग' },
      { title: 'नवाचार', description: 'अगली पीढ़ी के अनुप्रयोग और समाधान बनाएं', icon: Rocket, stat: 'असीमित' },
      { title: 'सुलभ', description: 'हमारे व्यापक संसाधनों के साथ मुफ्त में AI सीखें', icon: Globe, stat: 'मुफ्त पहुंच' }
    ],
    
    ctaTitle: 'आज ही अपनी AI यात्रा शुरू करें',
    ctaSubtitle: 'हजारों छात्रों के साथ मुफ्त में AI सीखने में शामिल हों। किसी पूर्व अनुभव की आवश्यकता नहीं।',
    getStarted: 'मुफ्त शुरू करें',
    watchTutorials: 'ट्यूटोरियल देखें',
    ctaNote: 'क्रेडिट कार्ड की आवश्यकता नहीं • हमेशा मुफ्त • प्रमाणपत्र शामिल',
    
    themeInfo: 'AI शिक्षा'
  };

  const getContent = () => {
    if (lang === 'ur') return urContent;
    if (lang === 'ar') return arContent;
    if (lang === 'hi') return hiContent;
    return enContent;
  };

  const content = getContent();
  const dir = getDirection();

  // AI Categories
  const aiCategories = [
    { id: 'ai-basics', title: lang === 'ur' ? 'AI بنیادی باتیں' : lang === 'ar' ? 'أساسيات الذكاء الاصطناعي' : lang === 'hi' ? 'AI मूल बातें' : 'AI Fundamentals', 
      description: lang === 'ur' ? 'AI بنیادی باتیں اور بنیادی تصورات سیکھیں' : lang === 'ar' ? 'تعلم أساسيات الذكاء الاصطناعي والمفاهيم الأساسية' : lang === 'hi' ? 'AI मूल बातें और मुख्य अवधारणाएं सीखें' : 'Learn AI basics and core concepts',
      icon: Brain, count: 12, color: 'primary' },
    { id: 'ai-tools', title: lang === 'ur' ? 'AI ٹولز گائیڈ' : lang === 'ar' ? 'دليل أدوات الذكاء الاصطناعي' : lang === 'hi' ? 'AI टूल्स गाइड' : 'AI Tools Guide',
      description: lang === 'ur' ? 'عملی AI ٹولز ٹیوٹوریلز' : lang === 'ar' ? 'دروس عملية لأدوات الذكاء الاصطناعي' : lang === 'hi' ? 'व्यावहारिक AI टूल्स ट्यूटोरियल' : 'Practical AI tools tutorials',
      icon: Code, count: 25, color: 'secondary' },
    { id: 'machine-learning', title: lang === 'ur' ? 'مشین لرننگ' : lang === 'ar' ? 'تعلم الآلة' : lang === 'hi' ? 'मशीन लर्निंग' : 'Machine Learning',
      description: lang === 'ur' ? 'مشین لرننگ الگورتھم اور ایپلی کیشنز' : lang === 'ar' ? 'خوارزميات وتطبيقات تعلم الآلة' : lang === 'hi' ? 'मशीन लर्निंग एल्गोरिदम और अनुप्रयोग' : 'ML algorithms and applications',
      icon: TrendingUp, count: 18, color: 'success' },
    { id: 'ai-ethics', title: lang === 'ur' ? 'AI اخلاقیات' : lang === 'ar' ? 'أخلاقيات الذكاء الاصطناعي' : lang === 'hi' ? 'AI नैतिकता' : 'AI Ethics',
      description: lang === 'ur' ? 'ذمہ دار AI ترقی' : lang === 'ar' ? 'تطوير الذكاء الاصطناعي المسؤول' : lang === 'hi' ? 'जिम्मेदार AI विकास' : 'Responsible AI development',
      icon: Shield, count: 8, color: 'warning' },
  ];

  // AI Tools
  const aiTools = [
    { name: lang === 'ur' ? 'AI چیٹ اسسٹنٹ' : lang === 'ar' ? 'مساعد الدردشة بالذكاء الاصطناعي' : lang === 'hi' ? 'AI चैट सहायक' : 'AI Chat Assistant',
      category: lang === 'ur' ? 'پیداواریت' : lang === 'ar' ? 'إنتاجية' : lang === 'hi' ? 'उत्पादकता' : 'Productivity',
      description: lang === 'ur' ? 'کوڈنگ، تحریر اور سیکھنے کے لیے مفت AI چیٹ بوٹ' : lang === 'ar' ? 'روبوت دردشة مجاني بالذكاء الاصطناعي للبرمجة والكتابة والتعلم' : lang === 'hi' ? 'कोडिंग, लेखन और सीखने के लिए मुफ्त AI चैटबॉट' : 'Free AI chatbot for coding, writing, and learning',
      link: '/tools/ai-chat', icon: '🤖', rating: 4.9 },
    { name: lang === 'ur' ? 'AI امیج جنریٹر' : lang === 'ar' ? 'مولد الصور بالذكاء الاصطناعي' : lang === 'hi' ? 'AI छवि जनरेटर' : 'Image Generator AI',
      category: lang === 'ur' ? 'ڈیزائن' : lang === 'ar' ? 'تصميم' : lang === 'hi' ? 'डिजाइन' : 'Design',
      description: lang === 'ur' ? 'ٹیکسٹ تفصیل سے تصاویر بنائیں' : lang === 'ar' ? 'إنشاء صور من النصوص الوصفية' : lang === 'hi' ? 'पाठ विवरण से छवियां बनाएं' : 'Create images from text descriptions',
      link: '/tools/ai-image-generator', icon: '🎨', rating: 4.8 },
    { name: lang === 'ur' ? 'کوڈ اسسٹنٹ' : lang === 'ar' ? 'مساعد البرمجة' : lang === 'hi' ? 'कोड सहायक' : 'Code Assistant',
      category: lang === 'ur' ? 'ڈیولپمنٹ' : lang === 'ar' ? 'تطوير' : lang === 'hi' ? 'विकास' : 'Development',
      description: lang === 'ur' ? 'AI سے چلنے والی کوڈ تکمیل اور ڈیبگنگ' : lang === 'ar' ? 'إكمال التعليمات البرمجية وتصحيح الأخطاء بالذكاء الاصطناعي' : lang === 'hi' ? 'AI-संचालित कोड पूर्णता और डिबगिंग' : 'AI-powered code completion and debugging',
      link: '/tools/ai-code-assistant', icon: '💻', rating: 4.9 },
    { name: lang === 'ur' ? 'ٹیکسٹ سمپلر' : lang === 'ar' ? 'ملخص النصوص' : lang === 'hi' ? 'पाठ सारांशक' : 'Text Summarizer',
      category: lang === 'ur' ? 'تحریر' : lang === 'ar' ? 'كتابة' : lang === 'hi' ? 'लेखन' : 'Writing',
      description: lang === 'ur' ? 'لمبی دستاویزات کا فوری خلاصہ' : lang === 'ar' ? 'تلخيص المستندات الطويلة فوراً' : lang === 'hi' ? 'लंबे दस्तावेज़ों को तुरंत सारांशित करें' : 'Summarize long documents instantly',
      link: '/tools/ai-summarizer', icon: '📝', rating: 4.7 },
  ];

  // Learning Paths
  const learningPaths = [
    { title: content.beginnerPath, duration: '4', level: lang === 'ur' ? 'شروع' : lang === 'ar' ? 'مبتدئ' : lang === 'hi' ? 'शुरुआती' : 'Beginner', 
      lessons: 20, description: content.beginnerDesc, progress: 0 },
    { title: content.intermediatePath, duration: '8', level: lang === 'ur' ? 'انٹرمیڈیٹ' : lang === 'ar' ? 'متوسط' : lang === 'hi' ? 'मध्यवर्ती' : 'Intermediate', 
      lessons: 40, description: content.intermediateDesc, progress: 0 },
    { title: content.advancedPath, duration: '12', level: lang === 'ur' ? 'ایڈوانس' : lang === 'ar' ? 'متقدم' : lang === 'hi' ? 'उन्नत' : 'Advanced', 
      lessons: 60, description: content.advancedDesc, progress: 0 },
  ];

  const safeColor = (colorPath: string): string => {
    if (!themeColors) return '#3b82f6';
    const parts = colorPath.split('.');
    let current: any = themeColors;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return '#3b82f6';
      }
    }
    return typeof current === 'string' ? current : '#3b82f6';
  };

  const primaryColor = safeColor('primary');
  const secondaryColor = safeColor('secondary');
  const successColor = safeColor('success');
  const warningColor = safeColor('warning');
  const textPrimary = safeColor('text.primary') || (isDarkMode ? '#f8fafc' : '#0f172a');
  const textSecondary = safeColor('text.secondary') || (isDarkMode ? '#cbd5e1' : '#475569');
  const backgroundColor = safeColor('background') || (isDarkMode ? '#0f172a' : '#f8fafc');
  const surfaceColor = safeColor('surface') || (isDarkMode ? '#1e293b' : '#ffffff');
  const borderColor = safeColor('border') || (isDarkMode ? '#334155' : '#e2e8f0');

  return (
    <main 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor, color: textPrimary, fontFamily: currentFont }}
      dir={dir}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ background: `radial-gradient(circle at 20% 50%, ${primaryColor}40 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${secondaryColor}30 0%, transparent 50%)` }}
        />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
              style={{ backgroundColor: `${primaryColor}15`, borderColor: primaryColor, color: primaryColor }}>
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">{content.heroBadge}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              {content.heroTitle}{' '}
              <span className="relative">
                <span className="relative z-10" style={{ color: primaryColor }}>{content.heroTitleHighlight}</span>
                <span className="absolute bottom-1 left-0 w-full h-3 z-0 opacity-30" style={{ backgroundColor: primaryColor }} />
              </span>{' '}
              {content.heroTitleEnd}
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{ color: textSecondary }}>
              {content.heroSubtitle}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 max-w-2xl mx-auto">
              {content.stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 mx-auto"
                      style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm" style={{ color: textSecondary }}>{stat.label}</div>
                  </div>
                );
              })}
            </div>
            
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: textSecondary }} />
                <input type="text" placeholder={content.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all"
                  style={{ backgroundColor: surfaceColor, borderColor: borderColor, color: textPrimary }} />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="#learning-paths"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{ backgroundColor: primaryColor, color: surfaceColor }}>
                <GraduationCap className="w-6 h-6" />
                <span>{content.startLearning}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#ai-tools"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border-2 hover:scale-105"
                style={{ borderColor: primaryColor, color: primaryColor, backgroundColor: `${primaryColor}10` }}>
                <Code className="w-6 h-6" />
                <span>{content.exploreTools}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.categoriesTitle}</h2>
            <p className="text-lg" style={{ color: textSecondary }}>{content.categoriesSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiCategories.map((category, index) => {
              const Icon = category.icon;
              const color = category.color === 'primary' ? primaryColor : category.color === 'secondary' ? secondaryColor : category.color === 'success' ? successColor : category.color === 'warning' ? warningColor : primaryColor;
              return (
                <Link key={index} href={`/blog/category/${category.id}`} className="group block">
                  <div className="h-full p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    style={{ backgroundColor: surfaceColor, border: `1px solid ${borderColor}` }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: `${color}20`, color: color }}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-sm font-semibold px-3 py-1 rounded-full"
                        style={{ backgroundColor: `${color}15`, color: color }}>{category.count} lessons</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{category.title}</h3>
                    <p className="mb-4" style={{ color: textSecondary }}>{category.description}</p>
                    <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: color }}>
                      <span>Explore Category</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section id="ai-tools" className="py-16 px-4" style={{ backgroundColor: surfaceColor }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.toolsTitle}</h2>
            <p className="text-lg" style={{ color: textSecondary }}>{content.toolsSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiTools.map((tool, index) => (
              <Link key={index} href={tool.link} className="group block">
                <div className="h-full p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{ backgroundColor: backgroundColor, border: `1px solid ${borderColor}` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{tool.icon}</div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" style={{ color: warningColor }} />
                      <span className="text-sm font-semibold">{tool.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{tool.name}</h3>
                  <div className="text-sm mb-3 px-3 py-1 rounded-full inline-block"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>{tool.category}</div>
                  <p className="text-sm mb-4" style={{ color: textSecondary }}>{tool.description}</p>
                  <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: primaryColor }}>
                    <span>Try Tool</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/tools"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{ backgroundColor: primaryColor, color: surfaceColor }}>
              <span>{content.viewAllTools}</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section id="learning-paths" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.pathsTitle}</h2>
            <p className="text-lg" style={{ color: textSecondary }}>{content.pathsSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {learningPaths.map((path, index) => (
              <div key={index} className="relative p-8 rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: surfaceColor, border: `1px solid ${borderColor}` }}>
                {index === 0 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold"
                    style={{ backgroundColor: primaryColor, color: surfaceColor }}>{content.recommended}</div>
                )}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
                    style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>{index + 1}</div>
                  <h3 className="text-2xl font-bold mb-2">{path.title}</h3>
                  <div className="text-sm mb-4 px-4 py-1 rounded-full inline-block"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>{path.level}</div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3"><Clock className="w-5 h-5" style={{ color: primaryColor }} /><span>{path.duration} {content.duration}</span></div>
                  <div className="flex items-center gap-3"><BookOpen className="w-5 h-5" style={{ color: primaryColor }} /><span>{path.lessons} {content.lessons}</span></div>
                  <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5" style={{ color: primaryColor }} /><span>{content.freeCertificate}</span></div>
                </div>
                <p className="mb-6 text-center" style={{ color: textSecondary }}>{path.description}</p>
                <button className="w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: primaryColor, color: surfaceColor }}>{path.progress > 0 ? content.continuePath : content.startPath}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Learn AI Section */}
      <section className="py-16 px-4" style={{ backgroundColor: surfaceColor }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.whyTitle}</h2>
            <p className="text-lg" style={{ color: textSecondary }}>{content.whySubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.whyStats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: backgroundColor, border: `1px solid ${borderColor}` }}>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto"
                    style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}><Icon className="w-8 h-8" /></div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm mb-3" style={{ color: textSecondary }}>{item.description}</p>
                  <div className="text-lg font-bold" style={{ color: primaryColor }}>{item.stat}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center p-12 rounded-3xl relative overflow-hidden"
            style={{ backgroundColor: surfaceColor, border: `1px solid ${borderColor}` }}>
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: `radial-gradient(${primaryColor} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{content.ctaTitle}</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: textSecondary }}>{content.ctaSubtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                  style={{ backgroundColor: primaryColor, color: surfaceColor }}>
                  <GraduationCap className="w-6 h-6" />
                  <span>{content.getStarted}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/blog/tutorials"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border-2 hover:scale-105"
                  style={{ borderColor: primaryColor, color: primaryColor, backgroundColor: `${primaryColor}10` }}>
                  <PlayCircle className="w-6 h-6" />
                  <span>{content.watchTutorials}</span>
                </Link>
              </div>
              <div className="mt-8 text-sm" style={{ color: textSecondary }}>
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: successColor }} />
                  {content.ctaNote}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}