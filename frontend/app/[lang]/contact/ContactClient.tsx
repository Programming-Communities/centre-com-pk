'use client';

import { useState, useEffect } from 'react';
import { Mail, MessageSquare, Users, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import Link from 'next/link';

export default function ContactClient() {
  const { themeColors } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState('en');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  // ==================== ENGLISH CONTENT ====================
  const enContent = {
    title: 'Contact Shahbaz',
    subtitle: 'I’m here to help — get in touch directly',
    general: 'General Support',
    generalDesc: 'For any questions about tools, errors, or suggestions.',
    generalEmail: 'shahbaz@centre.com.pk',
    suggestions: 'Suggest a Tool',
    suggestionsDesc: 'Have an idea for a tool? I build tools based on real needs.',
    suggestionsEmail: 'suggestions@centre.com.pk',
    partnerships: 'Partnerships',
    partnershipsDesc: 'Business inquiries, advertising, or collaborations.',
    partnershipsEmail: 'partners@centre.com.pk',
    formTitle: 'Send a Message',
    formSubtitle: 'I’ll reply within 24 hours (usually faster)',
    name: 'Full Name',
    namePlaceholder: 'Enter your full name',
    email: 'Email Address',
    emailPlaceholder: 'Enter your email address',
    subject: 'Subject',
    subjectPlaceholder: 'What is this regarding?',
    message: 'Message',
    messagePlaceholder: 'Please provide details about your inquiry...',
    send: 'Send Message',
    sending: 'Sending...',
    successMessage: 'Thank you! Your message has been sent successfully.',
    errorMessage: 'Oops! Something went wrong. Please try again.',
    privacyNote: 'Your info stays private. I never share it with anyone.',
    directPhone: '+92 325 7960378',
    directWeb: 'https://www.shahbaz.org.pk/'
  };

  // ==================== URDU CONTENT ====================
  const urContent = {
    title: 'شہباز سے رابطہ کریں',
    subtitle: 'میں مدد کے لیے حاضر ہوں — براہ راست رابطہ کریں',
    general: 'عمومی مدد',
    generalDesc: 'ٹولز، غلطیوں، یا تجاویز کے بارے میں کسی بھی سوال کے لیے۔',
    generalEmail: 'shahbaz@centre.com.pk',
    suggestions: 'ٹول تجویز کریں',
    suggestionsDesc: 'کسی ٹول کا آئیڈیا ہے؟ میں حقیقی ضروریات کی بنیاد پر ٹولز بناتا ہوں۔',
    suggestionsEmail: 'suggestions@centre.com.pk',
    partnerships: 'شراکت داری',
    partnershipsDesc: 'کاروباری استفسارات، اشتہارات، یا تعاون۔',
    partnershipsEmail: 'partners@centre.com.pk',
    formTitle: 'پیغام بھیجیں',
    formSubtitle: 'میں 24 گھنٹوں کے اندر جواب دوں گا (عام طور پر تیز تر)',
    name: 'پورا نام',
    namePlaceholder: 'اپنا پورا نام درج کریں',
    email: 'ای میل ایڈریس',
    emailPlaceholder: 'اپنا ای میل ایڈریس درج کریں',
    subject: 'موضوع',
    subjectPlaceholder: 'یہ کس بارے میں ہے؟',
    message: 'پیغام',
    messagePlaceholder: 'براہ کرم تفصیلات فراہم کریں...',
    send: 'پیغام بھیجیں',
    sending: 'بھیجا جا رہا ہے...',
    successMessage: 'شکریہ! آپ کا پیغام کامیابی سے بھیج دیا گیا ہے۔',
    errorMessage: 'اوہ! کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔',
    privacyNote: 'آپ کی معلومات نجی رہتی ہے۔ میں اسے کبھی کسی کے ساتھ شیئر نہیں کرتا۔',
    directPhone: '+92 325 7960378',
    directWeb: 'https://www.shahbaz.org.pk/'
  };

  // ==================== ARABIC CONTENT ====================
  const arContent = {
    title: 'اتصل بشهباز',
    subtitle: 'أنا هنا للمساعدة — تواصل مباشرة',
    general: 'الدعم العام',
    generalDesc: 'لأي أسئلة حول الأدوات أو الأخطاء أو الاقتراحات.',
    generalEmail: 'shahbaz@centre.com.pk',
    suggestions: 'اقترح أداة',
    suggestionsDesc: 'هل لديك فكرة لأداة؟ أنا أبني أدوات بناءً على الاحتياجات الحقيقية.',
    suggestionsEmail: 'suggestions@centre.com.pk',
    partnerships: 'الشراكات',
    partnershipsDesc: 'استفسارات تجارية أو إعلانات أو تعاون.',
    partnershipsEmail: 'partners@centre.com.pk',
    formTitle: 'أرسل رسالة',
    formSubtitle: 'سأرد خلال 24 ساعة (عادة أسرع)',
    name: 'الاسم الكامل',
    namePlaceholder: 'أدخل اسمك الكامل',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'أدخل بريدك الإلكتروني',
    subject: 'الموضوع',
    subjectPlaceholder: 'بماذا يتعلق هذا؟',
    message: 'الرسالة',
    messagePlaceholder: 'يرجى تقديم تفاصيل حول استفسارك...',
    send: 'إرسال الرسالة',
    sending: 'جاري الإرسال...',
    successMessage: 'شكراً! تم إرسال رسالتك بنجاح.',
    errorMessage: 'عذراً! حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    privacyNote: 'معلوماتك تبقى خاصة. لا أشاركها مع أي شخص أبدًا.',
    directPhone: '+92 325 7960378',
    directWeb: 'https://www.shahbaz.org.pk/'
  };

  // ==================== HINDI CONTENT ====================
  const hiContent = {
    title: 'शाहबाज से संपर्क करें',
    subtitle: 'मैं मदद के लिए यहाँ हूँ — सीधे संपर्क करें',
    general: 'सामान्य सहायता',
    generalDesc: 'उपकरणों, त्रुटियों, या सुझावों के बारे में किसी भी प्रश्न के लिए।',
    generalEmail: 'shahbaz@centre.com.pk',
    suggestions: 'एक उपकरण सुझाएँ',
    suggestionsDesc: 'किसी उपकरण का विचार है? मैं वास्तविक जरूरतों के आधार पर उपकरण बनाता हूँ।',
    suggestionsEmail: 'suggestions@centre.com.pk',
    partnerships: 'साझेदारी',
    partnershipsDesc: 'व्यावसायिक पूछताछ, विज्ञापन, या सहयोग।',
    partnershipsEmail: 'partners@centre.com.pk',
    formTitle: 'संदेश भेजें',
    formSubtitle: 'मैं 24 घंटे के भीतर जवाब दूंगा (आमतौर पर तेज़)',
    name: 'पूरा नाम',
    namePlaceholder: 'अपना पूरा नाम दर्ज करें',
    email: 'ईमेल पता',
    emailPlaceholder: 'अपना ईमेल पता दर्ज करें',
    subject: 'विषय',
    subjectPlaceholder: 'यह किस बारे में है?',
    message: 'संदेश',
    messagePlaceholder: 'कृपया विस्तार से बताएं...',
    send: 'संदेश भेजें',
    sending: 'भेजा जा रहा है...',
    successMessage: 'धन्यवाद! आपका संदेश सफलतापूर्वक भेज दिया गया है।',
    errorMessage: 'उफ़! कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
    privacyNote: 'आपकी जानकारी निजी रहती है। मैं इसे कभी किसी के साथ साझा नहीं करता।',
    directPhone: '+92 325 7960378',
    directWeb: 'https://www.shahbaz.org.pk/'
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

  const contactCards = [
    {
      icon: Mail,
      title: content.general,
      email: content.generalEmail,
      description: content.generalDesc,
    },
    {
      icon: MessageSquare,
      title: content.suggestions,
      email: content.suggestionsEmail,
      description: content.suggestionsDesc,
    },
    {
      icon: Users,
      title: content.partnerships,
      email: content.partnershipsEmail,
      description: content.partnershipsDesc,
    },
  ];

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
            <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: themeColors.text.secondary }}>
              {content.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="group rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  style={{ 
                    backgroundColor: themeColors.surface,
                    border: `1px solid ${themeColors.border}`,
                    borderRadius: '20px'
                  }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ 
                      backgroundColor: `${themeColors.primary}15`,
                      color: themeColors.primary
                    }}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: themeColors.text.primary }}>
                    {card.title}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: themeColors.text.secondary }}>
                    {card.description}
                  </p>
                  <p className="text-sm font-mono mb-3" style={{ color: themeColors.primary }}>
                    {card.email}
                  </p>
                  <a
                    href={`mailto:${card.email}`}
                    className="inline-flex items-center gap-1 text-sm font-medium hover:gap-2 transition-all"
                    style={{ color: themeColors.primary }}
                  >
                    Send Email <span>→</span>
                  </a>
                </div>
              );
            })}
          </div>

          {/* Direct Contact Info */}
          <div className="mt-8 p-4 rounded-xl text-center" style={{ backgroundColor: themeColors.surface, border: `1px solid ${themeColors.border}` }}>
            <p style={{ color: themeColors.text.primary }}>📞 {content.directPhone}</p>
            <a 
              href={content.directWeb} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 text-sm font-medium hover:underline" 
              style={{ color: themeColors.primary }}
            >
              {content.directWeb}
            </a>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl p-6 md:p-8 mt-8"
            style={{ 
              backgroundColor: themeColors.surface,
              border: `1px solid ${themeColors.border}`,
              borderRadius: '20px'
            }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: themeColors.text.primary }}>
                {content.formTitle}
              </h2>
              <p className="text-sm" style={{ color: themeColors.text.secondary }}>
                {content.formSubtitle}
              </p>
            </div>

            {formStatus === 'success' && (
              <div className="mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
                style={{ backgroundColor: `${themeColors.success}15`, border: `1px solid ${themeColors.success}` }}
              >
                <CheckCircle className="h-5 w-5" style={{ color: themeColors.success }} />
                <span style={{ color: themeColors.success }}>{content.successMessage}</span>
              </div>
            )}

            {formStatus === 'error' && (
              <div className="mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
                style={{ backgroundColor: `${themeColors.error}15`, border: `1px solid ${themeColors.error}` }}
              >
                <AlertCircle className="h-5 w-5" style={{ color: themeColors.error }} />
                <span style={{ color: themeColors.error }}>{content.errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                    {content.name} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all"
                    style={{ 
                      backgroundColor: themeColors.background,
                      color: themeColors.text.primary,
                      border: `1px solid ${themeColors.border}`,
                    }}
                    placeholder={content.namePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                    {content.email} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all"
                    style={{ 
                      backgroundColor: themeColors.background,
                      color: themeColors.text.primary,
                      border: `1px solid ${themeColors.border}`,
                    }}
                    placeholder={content.emailPlaceholder}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                  {content.subject} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    backgroundColor: themeColors.background,
                    color: themeColors.text.primary,
                    border: `1px solid ${themeColors.border}`,
                  }}
                  placeholder={content.subjectPlaceholder}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: themeColors.text.primary }}>
                  {content.message} <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{ 
                    backgroundColor: themeColors.background,
                    color: themeColors.text.primary,
                    border: `1px solid ${themeColors.border}`,
                  }}
                  placeholder={content.messagePlaceholder}
                />
              </div>
              
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: themeColors.primary,
                    color: '#ffffff'
                  }}
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {content.sending}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {content.send}
                    </>
                  )}
                </button>
              </div>
              
              <p className="text-xs text-center pt-4" style={{ color: themeColors.text.secondary }}>
                {content.privacyNote}
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}