'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Target, Users, Heart, Globe, Zap, Shield, Code } from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

export default function AboutClient() {
  const { themeColors, isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
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

  const getDirection = () => {
    if (lang === 'ur' || lang === 'ar') return 'rtl';
    return 'ltr';
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 rounded-full mx-auto mb-4" style={{ backgroundColor: themeColors.primary }} />
          <p style={{ color: themeColors.primary }}>Loading...</p>
        </div>
      </div>
    );
  }

  // ==================== ENGLISH CONTENT ====================
  const enContent = {
    title: 'About Centre.com.pk',
    subtitle: "Built by Shahbaz Bashir — making essential digital tools free for everyone, everywhere.",
    authorName: 'Shahbaz Bashir',
    authorRole: 'Full‑Stack Developer & Founder',
    authorBio: 'I’m a software engineer from Lahore, Pakistan. I built Centre.com.pk because I saw too many people struggling with bad free tools. Every tool here runs in your browser — no data is ever sent to a server.',
    authorPhone: '+92 325 7960378',
    authorWebsite: 'https://www.shahbaz.org.pk/',
    authorImage: '/shahbaz.webp',
    visionTitle: 'Our Vision & Values',
    visionSubtitle: 'Building a better digital future through accessible tools and education',
    
    missionTitle: 'Our Mission',
    missionDesc: 'To democratize access to essential digital tools and empower individuals through free education and productivity resources.',
    
    forEveryoneTitle: 'For Everyone',
    forEveryoneDesc: 'From students and teachers to professionals and developers, our tools are designed to be accessible to all skill levels.',
    
    freeTitle: 'Free Forever',
    freeDesc: 'We believe essential tools should be free. No subscriptions, no hidden fees, just quality tools available to everyone.',
    
    qualityTitle: 'Quality First',
    qualityDesc: 'Every tool undergoes rigorous testing and regular updates to ensure reliability and optimal performance.',
    
    storyTitle: 'Our Story',
    story1: 'Centre.com.pk started in 2023 when Shahbaz Bashir, a full‑stack developer from Lahore, noticed a visa officer rejected his cousin’s application because a free online age calculator gave the wrong answer. That moment sparked a mission: build tools that actually work, respect privacy, and stay free forever.',
    story2: 'What began as a single age calculator has grown into a platform of 50+ tools — all carefully tested, completely private, and used by millions across 150+ countries.',
    story3: 'Today, I (Shahbaz) continue to maintain and expand Centre.com.pk from my home office in Lahore. Every tool is something I actually use myself.',
    
    teamTitle: 'Meet the Maker',
    team1_name: 'Shahbaz Bashir',
    team1_role: 'Founder & Full‑Stack Developer',
    team2_name: 'Community Contributors',
    team2_role: 'Translators & Beta Testers',
    team3_name: 'You?',
    team3_role: 'Suggest a tool or improve translations!',
    
    ctaTitle: 'Join the Mission',
    ctaDesc: "Whether you're a user, developer, or educator, you can contribute to making digital tools accessible to everyone.",
    ctaButton: 'Start Using Tools',
    ctaButton2: 'Contact Shahbaz',
    
    statsTitle: 'Our Impact',
    stats_tools: '50+ Tools',
    stats_users: '1M+ Users',
    stats_countries: '150+ Countries',
    stats_free: '100% Free'
  };

  // ==================== URDU CONTENT ====================
  const urContent = {
    title: 'Centre.com.pk کے بارے میں',
    subtitle: 'شہباز بشیر کی بنائی ہوئی — ضروری ڈیجیٹل ٹولز کو ہر ایک کے لیے مفت فراہم کرنا',
    authorName: 'شہباز بشیر',
    authorRole: 'فل اسٹیک ڈویلپر اور بانی',
    authorBio: 'میں لاہور، پاکستان سے سافٹ ویئر انجینئر ہوں۔ میں نے Centre.com.pk اس لیے بنایا کیونکہ میں نے بہت سے لوگوں کو خراب مفت ٹولز سے پریشان دیکھا۔ یہاں ہر ٹول آپ کے براؤزر میں چلتا ہے — کبھی کوئی ڈیٹا سرور پر نہیں بھیجا جاتا۔',
    authorPhone: '+92 325 7960378',
    authorWebsite: 'https://www.shahbaz.org.pk/',
    authorImage: '/shahbaz.webp',
    visionTitle: 'ہمارا وژن اور اقدار',
    visionSubtitle: 'قابل رسائی ٹولز اور تعلیم کے ذریعے ایک بہتر ڈیجیٹل مستقبل کی تعمیر',
    
    missionTitle: 'ہمارا مشن',
    missionDesc: 'ضروری ڈیجیٹل ٹولز تک رسائی کو جمہوری بنانا اور مفت تعلیم اور پیداواری وسائل کے ذریعے افراد کو بااختیار بنانا۔',
    
    forEveryoneTitle: 'سب کے لیے',
    forEveryoneDesc: 'طلباء اور اساتذہ سے لے کر پیشہ ور افراد اور ڈویلپرز تک، ہمارے ٹولز تمام مہارت کی سطحوں کے لیے قابل رسائی ہیں۔',
    
    freeTitle: 'مستقل طور پر مفت',
    freeDesc: 'ہم سمجھتے ہیں کہ ضروری ٹولز مفت ہونے چاہئیں۔ کوئی سبسکرپشن نہیں، کوئی پوشیدہ فیس نہیں، صرف معیاری ٹولز جو سب کے لیے دستیاب ہیں۔',
    
    qualityTitle: 'معیار اول',
    qualityDesc: 'ہر ٹول کو سخت جانچ اور باقاعدہ اپ ڈیٹس سے گزرنا پڑتا ہے تاکہ وشوسنییتا اور بہترین کارکردگی کو یقینی بنایا جا سکے۔',
    
    storyTitle: 'ہماری کہانی',
    story1: 'Centre.com.pk 2023 میں اس وقت شروع ہوا جب لاہور سے تعلق رکھنے والے فل اسٹیک ڈویلپر شہباز بشیر نے دیکھا کہ ایک مفت آن لائن عمر کیلکولیٹر کے غلط جواب کی وجہ سے ان کے کزن کی ویزا درخواست مسترد ہو گئی۔ اس لمحے نے ایک مشن کو جنم دیا: ایسے ٹولز بنائیں جو واقعی کام کریں، رازداری کا احترام کریں، اور ہمیشہ مفت رہیں۔',
    story2: 'جو ایک عمر کیلکولیٹر سے شروع ہوا تھا وہ 50+ ٹولز کے پلیٹ فارم میں تبدیل ہو گیا ہے — سب احتیاط سے جانچے گئے، مکمل طور پر نجی، اور 150+ ممالک میں لاکھوں صارفین استعمال کرتے ہیں۔',
    story3: 'آج، میں (شہباز) لاہور میں اپنے گھر کے دفتر سے Centre.com.pk کو برقرار رکھتا اور پھیلاتا ہوں۔ ہر ٹول وہ چیز ہے جسے میں خود استعمال کرتا ہوں۔',
    
    teamTitle: 'بنانے والے سے ملیں',
    team1_name: 'شہباز بشیر',
    team1_role: 'بانی اور فل اسٹیک ڈویلپر',
    team2_name: 'کمیونٹی کے شراکت دار',
    team2_role: 'مترجم اور بیٹا ٹیسٹرز',
    team3_name: 'آپ؟',
    team3_role: 'ٹول تجویز کریں یا ترجمے میں بہتری لائیں!',
    
    ctaTitle: 'مشن میں شامل ہوں',
    ctaDesc: 'چاہے آپ صارف ہوں، ڈویلپر ہوں، یا معلم، آپ ڈیجیٹل ٹولز کو سب کے لیے قابل رسائی بنانے میں اپنا حصہ ڈال سکتے ہیں۔',
    ctaButton: 'ٹولز استعمال کرنا شروع کریں',
    ctaButton2: 'شہباز سے رابطہ کریں',
    
    statsTitle: 'ہمارا اثر',
    stats_tools: '50+ ٹولز',
    stats_users: '10 لاکھ+ صارفین',
    stats_countries: '150+ ممالک',
    stats_free: '100% مفت'
  };

  // ==================== ARABIC CONTENT ====================
  const arContent = {
    title: 'حول Centre.com.pk',
    subtitle: 'بناها شهباز بشير — جعل الأدوات الرقمية الأساسية مجانية للجميع في كل مكان',
    authorName: 'شهباز بشير',
    authorRole: 'مطور شامل ومؤسس',
    authorBio: 'أنا مهندس برمجيات من لاهور، باكستان. لقد بنيت Centre.com.pk لأنني رأيت الكثير من الناس يعانون من الأدوات المجانية السيئة. كل أداة هنا تعمل في متصفحك — لا يتم إرسال أي بيانات إلى الخادم أبدًا.',
    authorPhone: '+92 325 7960378',
    authorWebsite: 'https://www.shahbaz.org.pk/',
    authorImage: '/shahbaz.webp',
    visionTitle: 'رؤيتنا وقيمنا',
    visionSubtitle: 'بناء مستقبل رقمي أفضل من خلال الأدوات المتاحة والتعليم',
    
    missionTitle: 'مهمتنا',
    missionDesc: 'إضفاء الطابع الديمقراطي على الوصول إلى الأدوات الرقمية الأساسية وتمكين الأفراد من خلال التعليم المجاني وموارد الإنتاجية.',
    
    forEveryoneTitle: 'للجميع',
    forEveryoneDesc: 'من الطلاب والمعلمين إلى المهنيين والمطورين، تم تصميم أدواتنا لتكون في متناول جميع مستويات المهارة.',
    
    freeTitle: 'مجاني للأبد',
    freeDesc: 'نعتقد أن الأدوات الأساسية يجب أن تكون مجانية. لا اشتراكات، لا رسوم خفية، فقط أدوات عالية الجودة متاحة للجميع.',
    
    qualityTitle: 'الجودة أولاً',
    qualityDesc: 'يخضع كل أداة لاختبارات صارمة وتحديثات منتظمة لضمان الموثوقية والأداء الأمثل.',
    
    storyTitle: 'قصتنا',
    story1: 'بدأ مركز.pk في عام 2023 عندما لاحظ شهباز بشير، مطور برمجيات متكامل من لاهور، رفض طلب تأشيرة ابن عمه بسبب خطأ في حاسبة العمر المجانية على الإنترنت. تلك اللحظة أشعلت مهمة: بناء أدوات تعمل بشكل صحيح، وتحترم الخصوصية، وتبقى مجانية إلى الأبد.',
    story2: 'ما بدأ كحاسبة عمر واحدة تحول إلى منصة تضم أكثر من 50 أداة — جميعها مختبرة بعناية، خاصة تمامًا، ويستخدمها الملايين في أكثر من 150 دولة.',
    story3: 'اليوم، أواصل (شهباز) صيانة وتوسيع مركز.pk من مكتبي المنزلي في لاهور. كل أداة هي شيء أستخدمه بنفسي بالفعل.',
    
    teamTitle: 'تعرف على الصانع',
    team1_name: 'شهباز بشير',
    team1_role: 'المؤسس والمطور الشامل',
    team2_name: 'المساهمون المجتمعيون',
    team2_role: 'مترجمون ومختبرون تجريبيون',
    team3_name: 'أنت؟',
    team3_role: 'اقترح أداة أو حسّن الترجمات!',
    
    ctaTitle: 'انضم إلى المهمة',
    ctaDesc: 'سواء كنت مستخدمًا أو مطورًا أو معلمًا، يمكنك المساهمة في جعل الأدوات الرقمية في متناول الجميع.',
    ctaButton: 'ابدأ باستخدام الأدوات',
    ctaButton2: 'اتصل بشهباز',
    
    statsTitle: 'تأثيرنا',
    stats_tools: '50+ أداة',
    stats_users: 'مليون+ مستخدم',
    stats_countries: '150+ دولة',
    stats_free: 'مجاني 100%'
  };

  // ==================== HINDI CONTENT ====================
  const hiContent = {
    title: 'Centre.com.pk के बारे में',
    subtitle: 'शाहबाज बशीर द्वारा निर्मित — सभी के लिए आवश्यक डिजिटल उपकरण मुफ्त बनाना',
    authorName: 'शाहबाज बशीर',
    authorRole: 'फुल‑स्टैक डेवलपर और संस्थापक',
    authorBio: 'मैं लाहौर, पाकिस्तान से एक सॉफ्टवेयर इंजीनियर हूं। मैंने Centre.com.pk इसलिए बनाया क्योंकि मैंने बहुत से लोगों को खराब मुफ्त उपकरणों से परेशान देखा। यहां हर उपकरण आपके ब्राउज़र में चलता है — कभी कोई डेटा सर्वर पर नहीं भेजा जाता।',
    authorPhone: '+92 325 7960378',
    authorWebsite: 'https://www.shahbaz.org.pk/',
    authorImage: '/shahbaz.webp',
    visionTitle: 'हमारा दृष्टिकोण और मूल्य',
    visionSubtitle: 'सुलभ उपकरणों और शिक्षा के माध्यम से एक बेहतर डिजिटल भविष्य का निर्माण',
    
    missionTitle: 'हमारा मिशन',
    missionDesc: 'आवश्यक डिजिटल उपकरणों तक पहुंच को लोकतांत्रिक बनाना और मुफ्त शिक्षा और उत्पादकता संसाधनों के माध्यम से व्यक्तियों को सशक्त बनाना।',
    
    forEveryoneTitle: 'सबके लिए',
    forEveryoneDesc: 'छात्रों और शिक्षकों से लेकर पेशेवरों और डेवलपर्स तक, हमारे उपकरण सभी कौशल स्तरों के लिए सुलभ हैं।',
    
    freeTitle: 'हमेशा मुफ्त',
    freeDesc: 'हमारा मानना है कि आवश्यक उपकरण मुफ्त होने चाहिए। कोई सदस्यता नहीं, कोई छिपी हुई फीस नहीं, बस गुणवत्तापूर्ण उपकरण जो सभी के लिए उपलब्ध हैं।',
    
    qualityTitle: 'गुणवत्ता पहले',
    qualityDesc: 'प्रत्येक उपकरण का कठोर परीक्षण और नियमित अपडेट किया जाता है ताकि विश्वसनीयता और इष्टतम प्रदर्शन सुनिश्चित हो सके।',
    
    storyTitle: 'हमारी कहानी',
    story1: 'Centre.com.pk 2023 में तब शुरू हुआ जब लाहौर के एक फुल‑स्टैक डेवलपर शाहबाज बशीर ने देखा कि एक मुफ्त ऑनलाइन आयु कैलकुलेटर के गलत उत्तर के कारण उनके चचेरे भाई का वीज़ा आवेदन खारिज हो गया। उस पल ने एक मिशन को जन्म दिया: ऐसे उपकरण बनाएं जो वास्तव में काम करें, गोपनीयता का सम्मान करें और हमेशा मुफ्त रहें।',
    story2: 'जो एक आयु कैलकुलेटर से शुरू हुआ था वह 50+ उपकरणों के एक मंच में बदल गया है — सभी सावधानीपूर्वक परीक्षित, पूरी तरह से निजी, और 150+ देशों में लाखों उपयोगकर्ताओं द्वारा उपयोग किया जाता है।',
    story3: 'आज, मैं (शाहबाज) लाहौर में अपने घर के कार्यालय से Centre.com.pk को बनाए रखता और विस्तार करता हूं। हर उपकरण कुछ ऐसा है जिसे मैं खुद वास्तव में उपयोग करता हूं।',
    
    teamTitle: 'निर्माता से मिलें',
    team1_name: 'शाहबाज बशीर',
    team1_role: 'संस्थापक और फुल‑स्टैक डेवलपर',
    team2_name: 'सामुदायिक योगदानकर्ता',
    team2_role: 'अनुवादक और बीटा परीक्षक',
    team3_name: 'आप?',
    team3_role: 'एक उपकरण सुझाएं या अनुवाद सुधारें!',
    
    ctaTitle: 'मिशन में शामिल हों',
    ctaDesc: 'चाहे आप उपयोगकर्ता हों, डेवलपर हों, या शिक्षक, आप डिजिटल उपकरणों को सभी के लिए सुलभ बनाने में योगदान दे सकते हैं।',
    ctaButton: 'उपकरणों का उपयोग शुरू करें',
    ctaButton2: 'शाहबाज से संपर्क करें',
    
    statsTitle: 'हमारा प्रभाव',
    stats_tools: '50+ उपकरण',
    stats_users: '10 लाख+ उपयोगकर्ता',
    stats_countries: '150+ देश',
    stats_free: '100% मुफ्त'
  };

  const getContent = () => {
    if (lang === 'ur') return urContent;
    if (lang === 'ar') return arContent;
    if (lang === 'hi') return hiContent;
    return enContent;
  };

  const content = getContent();
  const dir = getDirection();

  const values = [
    { icon: Target, title: content.missionTitle, description: content.missionDesc },
    { icon: Users, title: content.forEveryoneTitle, description: content.forEveryoneDesc },
    { icon: Heart, title: content.freeTitle, description: content.freeDesc },
    { icon: CheckCircle, title: content.qualityTitle, description: content.qualityDesc },
  ];

  const team = [
    { name: content.team1_name, role: content.team1_role },
    { name: content.team2_name, role: content.team2_role },
    { name: content.team3_name, role: content.team3_role },
  ];

  const stats = [
    { value: content.stats_tools, label: 'Tools' },
    { value: content.stats_users, label: 'Users' },
    { value: content.stats_countries, label: 'Countries' },
    { value: content.stats_free, label: 'Free' },
  ];

  const GradientText = ({ children }: { children: React.ReactNode }) => (
    <span style={{ 
      background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary || themeColors.primary})`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }}>
      {children}
    </span>
  );

  return (
    <main 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: themeColors.background }}
      dir={dir}
    >
      {/* Hero Section */}
      <section 
        className="relative py-16 md:py-24 overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${themeColors.primary}08, ${themeColors.secondary || themeColors.primary}05)`
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <GradientText>{content.title}</GradientText>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: themeColors.text.secondary }}>
              {content.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Author Spotlight */}
      <section className="py-12 md:py-16 border-b" style={{ borderColor: themeColors.border }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img 
              src={content.authorImage} 
              alt={content.authorName}
              className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover shadow-xl"
              style={{ border: `4px solid ${themeColors.primary}` }}
            />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: themeColors.text.primary }}>
                {content.authorName}
              </h2>
              <p className="text-lg font-medium mb-3" style={{ color: themeColors.primary }}>
                {content.authorRole}
              </p>
              <p className="mb-4 leading-relaxed" style={{ color: themeColors.text.secondary }}>
                {content.authorBio}
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <a 
                  href={`tel:${content.authorPhone}`}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition"
                  style={{ color: themeColors.primary }}
                >
                  📞 {content.authorPhone}
                </a>
                <a 
                  href={content.authorWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition"
                  style={{ color: themeColors.primary }}
                >
                  🌐 shahbaz.org.pk
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b" style={{ borderColor: themeColors.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: themeColors.primary }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: themeColors.text.secondary }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Values Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
              {content.visionTitle}
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: themeColors.text.secondary }}>
              {content.visionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  style={{ 
                    backgroundColor: themeColors.surface,
                    border: `1px solid ${themeColors.border}`,
                    borderRadius: '20px'
                  }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${themeColors.primary}15`, color: themeColors.primary }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: themeColors.text.primary }}>
                    {value.title}
                  </h3>
                  <p className="leading-relaxed" style={{ color: themeColors.text.secondary }}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-20" style={{ backgroundColor: themeColors.surface }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
              {content.storyTitle}
            </h2>
          </div>
          <div className="space-y-4 text-lg leading-relaxed" style={{ color: themeColors.text.secondary }}>
            <p>{content.story1}</p>
            <p>{content.story2}</p>
            <p>{content.story3}</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
              {content.teamTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{ 
                  backgroundColor: themeColors.surface,
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: '20px'
                }}
              >
                <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary || themeColors.primary})` }}
                >
                  <span className="text-3xl font-bold text-white">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: themeColors.text.primary }}>
                  {member.name}
                </h3>
                <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="rounded-2xl p-8 md:p-12 text-center"
            style={{ 
              background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary || themeColors.primary})`,
              borderRadius: '24px'
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              {content.ctaTitle}
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              {content.ctaDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${lang}/tools`}
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: '#ffffff',
                  color: themeColors.primary
                }}
              >
                {content.ctaButton}
              </Link>
              <Link
                href={`/${lang}/contact`}
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: `2px solid #ffffff`
                }}
              >
                {content.ctaButton2}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}