'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import Link from 'next/link';
import { 
  Shield, 
  FileText, 
  Mail,
  Phone,
  MapPin,
  Lock
} from 'lucide-react';

export default function TermsClient() {
  const { themeColors } = useTheme();
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

  const lastUpdated = new Date().toLocaleDateString(
    lang === 'ur' ? 'ur-PK' : lang === 'hi' ? 'hi-IN' : lang === 'ar' ? 'ar-AE' : 'en-US', 
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const getDirection = () => {
    if (lang === 'ur' || lang === 'ar') return 'rtl';
    return 'ltr';
  };

  const getAddress = () => {
    if (lang === 'ur') return 'لاہور، پاکستان';
    if (lang === 'ar') return 'لاهور، باكستان';
    if (lang === 'hi') return 'लाहौर, पाकिस्तान';
    return 'Lahore, Pakistan';
  };

  // ==================== ENGLISH CONTENT ====================
  const enContent = {
    title: 'Terms of Service',
    lastUpdatedLabel: 'Last Updated',
    notice: 'Legal Notice',
    noticeDesc: 'These Terms of Service constitute a legally binding agreement between you and Centre.com.pk (Shahbaz Bashir). By accessing or using our platform, you agree to be bound by these terms.',
    section1_title: 'Acceptance of Terms',
    section1_desc: 'By accessing or using Centre.com.pk\'s website, tools, and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.',
    section2_title: 'Description of Service',
    section2_desc: 'Centre.com.pk provides free online tools, utilities, and resources including image editing, PDF manipulation, calculators, code formatting, text processing, design tools, and security utilities. We reserve the right to modify, suspend, or discontinue any service at any time.',
    section3_title: 'User Responsibilities',
    section3_desc: 'You agree to use Centre.com.pk services only for lawful purposes. You are prohibited from using our services for any illegal activity, attempting to bypass security measures, uploading malicious content, or interfering with other users.',
    section4_title: 'Intellectual Property',
    section4_desc: 'All content, trademarks, logos, and intellectual property on Centre.com.pk are owned by or licensed to Shahbaz Bashir. You may not copy, reproduce, distribute, or create derivative works without permission.',
    section5_title: 'Limitation of Liability',
    section5_desc: 'Centre.com.pk (Shahbaz Bashir) shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.',
    section6_title: 'Disclaimer of Warranties',
    section6_desc: 'Centre.com.pk provides its services on an "AS IS" and "AS AVAILABLE" basis. We do not warrant that our services will be uninterrupted or error-free.',
    section7_title: 'User Content',
    section7_desc: 'You retain ownership of any content you upload or create using our tools. By using our services, you grant Centre.com.pk a license to store and process your content.',
    section8_title: 'Third-Party Services',
    section8_desc: 'Our services may contain links to third-party websites. We do not endorse or assume responsibility for any third-party content or practices.',
    section9_title: 'Modifications to Terms',
    section9_desc: 'We reserve the right to update these Terms at any time. Changes become effective immediately upon posting. Your continued use constitutes acceptance.',
    section10_title: 'Termination',
    section10_desc: 'We may terminate or suspend your access to Centre.com.pk immediately for any violation of these Terms.',
    section11_title: 'Governing Law',
    section11_desc: 'These Terms shall be governed by the laws of Pakistan. Any legal disputes shall be resolved in the courts of Lahore, Pakistan.',
    section12_title: 'Changes to Services',
    section12_desc: 'We may add, modify, or remove features or tools at our discretion. We reserve the right to introduce premium features or advertising.',
    agreement_title: 'Acceptance of Agreement',
    agreement_desc: 'By using Centre.com.pk, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.',
    privacy: 'Privacy Policy',
    contact: 'Contact Shahbaz',
    email: 'Email Shahbaz',
    call: 'Call Shahbaz',
    visit: 'Visit Developer'
  };

  // ==================== URDU CONTENT ====================
  const urContent = {
    title: 'خدمات کی شرائط',
    lastUpdatedLabel: 'آخری بار اپ ڈیٹ',
    notice: 'قانونی نوٹس',
    noticeDesc: 'یہ خدمات کی شرائط آپ اور Centre.com.pk (شہباز بشیر) کے درمیان ایک قانونی پابند معاہدہ تشکیل دیتی ہیں۔ ہمارے پلیٹ فارم تک رسائی یا استعمال کرکے، آپ ان شرائط کا پابند ہونے پر متفق ہیں۔',
    section1_title: 'شرائط کی قبولیت',
    section1_desc: 'Centre.com.pk کی ویب سائٹ، ٹولز، اور خدمات تک رسائی یا استعمال کرکے، آپ تسلیم کرتے ہیں کہ آپ نے خدمات کی ان شرائط کو پڑھ لیا ہے، سمجھ لیا ہے، اور ان کا پابند ہونے پر متفق ہیں۔',
    section2_title: 'خدمات کی تفصیل',
    section2_desc: 'Centre.com.pk مفت آن لائن ٹولز، یوٹیلیٹیز، اور وسائل فراہم کرتا ہے۔ ہم کسی بھی خدمت کو تبدیل، معطل، یا بند کرنے کا حق محفوظ رکھتے ہیں۔',
    section3_title: 'صارف کی ذمہ داریاں',
    section3_desc: 'آپ Centre.com.pk خدمات کو صرف قانونی مقاصد کے لیے استعمال کرنے پر متفق ہیں۔',
    section4_title: 'دانشورانہ املاک',
    section4_desc: 'Centre.com.pk پر تمام مواد شہباز بشیر کی ملکیت ہے۔ بغیر اجازت کاپی، تقسیم وغیرہ منع ہے۔',
    section5_title: 'ذمہ داری کی حدود',
    section5_desc: 'Centre.com.pk (شہباز بشیر) آپ کی خدمات کے استعمال سے پیدا ہونے والے کسی بھی نقصان کے ذمہ دار نہیں ہوں گے۔',
    section6_title: 'ضمانتوں سے دستبرداری',
    section6_desc: 'Centre.com.pk اپنی خدمات فراہم کرتا ہے "جیسے ہیں" کی بنیاد پر۔',
    section7_title: 'صارف کا مواد',
    section7_desc: 'آپ اپنے کسی بھی مواد کی ملکیت برقرار رکھتے ہیں۔',
    section8_title: 'تیسری فریق کی خدمات',
    section8_desc: 'ہماری خدمات میں تیسری فریق کی ویب سائٹس کے لنک ہو سکتے ہیں۔',
    section9_title: 'شرائط میں ترمیم',
    section9_desc: 'ہم کسی بھی وقت ان شرائط کو اپ ڈیٹ کرنے کا حق محفوظ رکھتے ہیں۔',
    section10_title: 'اختتام',
    section10_desc: 'ہم ان شرائط کی خلاف ورزی پر فوری رسائی ختم کر سکتے ہیں۔',
    section11_title: 'حکمرانی کا قانون',
    section11_desc: 'یہ شرائط پاکستان کے قوانین کے مطابق ہوں گی۔',
    section12_title: 'خدمات میں تبدیلیاں',
    section12_desc: 'ہم اپنی صوابدید پر فیچرز یا ٹولز شامل، ترمیم، یا ہٹا سکتے ہیں۔',
    agreement_title: 'معاہدے کی قبولیت',
    agreement_desc: 'Centre.com.pk استعمال کرکے آپ ان شرائط کو قبول کرتے ہیں۔',
    privacy: 'رازداری کی پالیسی',
    contact: 'شہباز سے رابطہ کریں',
    email: 'ای میل کریں',
    call: 'کال کریں',
    visit: 'ڈویلپر سے ملیں'
  };

  // ==================== ARABIC CONTENT ====================
  const arContent = {
    title: 'شروط الخدمة',
    lastUpdatedLabel: 'آخر تحديث',
    notice: 'إشعار قانوني',
    noticeDesc: 'تشكل شروط الخدمة هذه اتفاقية ملزمة قانونًا بينك وبين Centre.com.pk (شهباز بشير).',
    section1_title: 'قبول الشروط',
    section1_desc: 'بالوصول إلى خدمات Centre.com.pk فإنك توافق على الالتزام بهذه الشروط.',
    section2_title: 'وصف الخدمة',
    section2_desc: 'يوفر Centre.com.pk أدوات مجانية عبر الإنترنت. نحن نحتفظ بالحق في تعديل أو إيقاف أي خدمة.',
    section3_title: 'مسؤوليات المستخدم',
    section3_desc: 'أنت توافق على استخدام الخدمات للأغراض القانونية فقط.',
    section4_title: 'الملكية الفكرية',
    section4_desc: 'جميع المحتويات مملوكة لشهباز بشير. لا يجوز النسخ دون إذن.',
    section5_title: 'حدود المسؤولية',
    section5_desc: 'لا يكون Centre.com.pk (شهباز بشير) مسؤولاً عن أي أضرار.',
    section6_title: 'إخلاء المسؤولية',
    section6_desc: 'الخدمات مقدمة "كما هي".',
    section7_title: 'محتوى المستخدم',
    section7_desc: 'تحتفظ بملكية المحتوى الذي تقوم بتحميله.',
    section8_title: 'خدمات الطرف الثالث',
    section8_desc: 'قد تحتوي خدماتنا على روابط لمواقع خارجية.',
    section9_title: 'تعديلات الشروط',
    section9_desc: 'نحتفظ بالحق في تحديث هذه الشروط في أي وقت.',
    section10_title: 'إنهاء الخدمة',
    section10_desc: 'يمكننا إنهاء وصولك فورًا لأي انتهاك.',
    section11_title: 'القانون الحاكم',
    section11_desc: 'تخضع هذه الشروط لقوانين باكستان.',
    section12_title: 'تغييرات الخدمات',
    section12_desc: 'قد نضيف أو نعدل أو نزيل ميزات.',
    agreement_title: 'قبول الاتفاقية',
    agreement_desc: 'باستخدام Centre.com.pk فإنك توافق على هذه الشروط.',
    privacy: 'سياسة الخصوصية',
    contact: 'اتصل بشهباز',
    email: 'راسل شهباز',
    call: 'اتصل به',
    visit: 'زر المطور'
  };

  // ==================== HINDI CONTENT ====================
  const hiContent = {
    title: 'सेवा की शर्तें',
    lastUpdatedLabel: 'अंतिम अपडेट',
    notice: 'कानूनी सूचना',
    noticeDesc: 'ये सेवा की शर्तें आपके और Centre.com.pk (शाहबाज बशीर) के बीच एक कानूनी समझौता हैं।',
    section1_title: 'शर्तों की स्वीकृति',
    section1_desc: 'Centre.com.pk का उपयोग करके आप इन शर्तों से सहमत होते हैं।',
    section2_title: 'सेवा का विवरण',
    section2_desc: 'Centre.com.pk मुफ्त ऑनलाइन उपकरण प्रदान करता है। हम सेवाओं में बदलाव करने का अधिकार रखते हैं।',
    section3_title: 'उपयोगकर्ता की जिम्मेदारियाँ',
    section3_desc: 'आप केवल वैध उद्देश्यों के लिए सेवाओं का उपयोग करने के लिए सहमत हैं।',
    section4_title: 'बौद्धिक संपदा',
    section4_desc: 'Centre.com.pk पर सभी सामग्री शाहबाज बशीर की संपत्ति है। बिना अनुमति कॉपी न करें।',
    section5_title: 'देयता की सीमा',
    section5_desc: 'Centre.com.pk (शाहबाज बशीर) किसी भी नुकसान के लिए उत्तरदायी नहीं होगा।',
    section6_title: 'वारंटी की अस्वीकृति',
    section6_desc: 'सेवाएं "जैसी हैं" आधार पर प्रदान की जाती हैं।',
    section7_title: 'उपयोगकर्ता सामग्री',
    section7_desc: 'आप अपनी सामग्री के स्वामी बने रहते हैं।',
    section8_title: 'तृतीय-पक्ष सेवाएँ',
    section8_desc: 'हमारी सेवाओं में तीसरे पक्ष की वेबसाइटों के लिंक हो सकते हैं।',
    section9_title: 'शर्तों में संशोधन',
    section9_desc: 'हम किसी भी समय इन शर्तों को अपडेट कर सकते हैं।',
    section10_title: 'समाप्ति',
    section10_desc: 'हम किसी भी उल्लंघन पर आपकी पहुंच समाप्त कर सकते हैं।',
    section11_title: 'शासन कानून',
    section11_desc: 'ये शर्तें पाकिस्तान के कानूनों द्वारा शासित होंगी।',
    section12_title: 'सेवाओं में बदलाव',
    section12_desc: 'हम अपने विवेक पर सुविधाएँ जोड़, संशोधित या हटा सकते हैं।',
    agreement_title: 'समझौते की स्वीकृति',
    agreement_desc: 'Centre.com.pk का उपयोग करके आप इन शर्तों से सहमत होते हैं।',
    privacy: 'गोपनीयता नीति',
    contact: 'शाहबाज से संपर्क करें',
    email: 'ईमेल करें',
    call: 'कॉल करें',
    visit: 'डेवलपर से मिलें'
  };

  const getContent = () => {
    if (lang === 'ur') return urContent;
    if (lang === 'ar') return arContent;
    if (lang === 'hi') return hiContent;
    return enContent;
  };

  const content = getContent();
  const dir = getDirection();

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
            <div className="inline-flex items-center justify-center mb-6">
              <div className="p-4 rounded-2xl shadow-lg" style={{ 
                backgroundColor: `${themeColors.primary}15`,
                boxShadow: `0 10px 25px -5px ${themeColors.primary}30`
              }}>
                <FileText className="h-10 w-10" style={{ color: themeColors.primary }} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <GradientText>{content.title}</GradientText>
            </h1>
            <p className="text-lg md:text-xl" style={{ color: themeColors.text.secondary }}>
              {content.lastUpdatedLabel}: <strong>{lastUpdated}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Notice Banner */}
          <div 
            className="rounded-2xl p-6 md:p-8 mb-10 shadow-lg"
            style={{ 
              backgroundColor: `${themeColors.error}10`,
              border: `1px solid ${themeColors.error}`,
              borderRadius: '20px'
            }}
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${themeColors.error}20` }}>
                  <span className="text-2xl">⚠️</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: themeColors.error }}>
                  {content.notice}
                </h3>
                <p className="leading-relaxed" style={{ color: themeColors.text.secondary }}>
                  {content.noticeDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Render all 12 sections */}
          {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
            const sectionTitle = content[`section${num}_title` as keyof typeof content];
            const sectionDesc = content[`section${num}_desc` as keyof typeof content];
            return (
              <div key={num} className="rounded-2xl p-6 md:p-8 mb-6 transition-all duration-300 hover:shadow-xl" style={{ backgroundColor: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: '20px' }}>
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg" style={{ backgroundColor: `${themeColors.primary}15`, color: themeColors.primary }}>
                      {String(num).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ color: themeColors.text.primary }}>{sectionTitle}</h3>
                    <div className="leading-relaxed" style={{ color: themeColors.text.secondary }}>
                      <p>{sectionDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Agreement Section */}
          <div 
            className="mt-12 p-6 md:p-8 rounded-2xl text-center"
            style={{ 
              background: `linear-gradient(135deg, ${themeColors.success}10, ${themeColors.success}05)`,
              border: `1px solid ${themeColors.success}`,
              borderRadius: '20px'
            }}
          >
            <div className="inline-flex items-center justify-center mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${themeColors.success}20` }}>
                <Shield className="h-8 w-8" style={{ color: themeColors.success }} />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: themeColors.success }}>
              {content.agreement_title}
            </h3>
            <p className="mb-6 max-w-2xl mx-auto leading-relaxed" style={{ color: themeColors.text.secondary }}>
              {content.agreement_desc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${lang}/privacy-policy`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: themeColors.primary,
                  color: '#ffffff'
                }}
              >
                <Lock className="h-4 w-4" />
                {content.privacy}
              </Link>
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: themeColors.surface,
                  color: themeColors.text.primary,
                  border: `1px solid ${themeColors.border}`
                }}
              >
                <Mail className="h-4 w-4" />
                {content.contact}
              </Link>
            </div>
          </div>

          {/* Contact Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div 
              className="rounded-xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ backgroundColor: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: '16px' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${themeColors.primary}15` }}>
                <Mail className="h-6 w-6" style={{ color: themeColors.primary }} />
              </div>
              <h4 className="font-semibold mb-1" style={{ color: themeColors.text.primary }}>{content.email}</h4>
              <a href="mailto:shahbaz@centre.com.pk" className="text-sm hover:underline" style={{ color: themeColors.primary }}>
                shahbaz@centre.com.pk
              </a>
            </div>
            
            <div 
              className="rounded-xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ backgroundColor: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: '16px' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${themeColors.primary}15` }}>
                <Phone className="h-6 w-6" style={{ color: themeColors.primary }} />
              </div>
              <h4 className="font-semibold mb-1" style={{ color: themeColors.text.primary }}>{content.call}</h4>
              <a href="tel:+923257960378" className="text-sm hover:underline" style={{ color: themeColors.primary }}>
                +92 325 7960378
              </a>
            </div>
            
            <div 
              className="rounded-xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ backgroundColor: themeColors.surface, border: `1px solid ${themeColors.border}`, borderRadius: '16px' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${themeColors.primary}15` }}>
                <MapPin className="h-6 w-6" style={{ color: themeColors.primary }} />
              </div>
              <h4 className="font-semibold mb-1" style={{ color: themeColors.text.primary }}>{content.visit}</h4>
              <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                {getAddress()}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}