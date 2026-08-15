'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import Link from 'next/link';

export default function PrivacyPolicyClient() {
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

  const getDirection = () => {
    if (lang === 'ur' || lang === 'ar') return 'rtl';
    return 'ltr';
  };

  const lastUpdated = new Date().toLocaleDateString(
    lang === 'ur' ? 'ur-PK' : lang === 'hi' ? 'hi-IN' : lang === 'ar' ? 'ar-AE' : 'en-US', 
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  // ==================== ENGLISH CONTENT ====================
  const enContent = {
    title: 'Privacy Policy',
    lastUpdatedLabel: 'Last Updated',
    introduction: 'Introduction',
    intro1: 'At Centre.com.pk, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.',
    intro2: 'Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.',
    intro3: 'We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy.',
    
    section1_title: 'Information We Collect',
    section1_desc: 'We may collect personal information that you voluntarily provide to us when you use our tools, subscribe to our newsletter, fill out a form, or contact us. This information may include your name, email address, phone number, and any other information you choose to provide. We also automatically collect certain information when you visit our website, such as your IP address, browser type, operating system, access times, and pages viewed directly before and after accessing the site.',
    
    section2_title: 'How We Use Your Information',
    section2_desc: 'We use the information we collect to operate and maintain our website and services, improve user experience, respond to your comments and questions, send you technical notices and support messages, communicate with you about products, services, offers, and events, monitor and analyze trends, usage, and activities, detect, investigate, and prevent fraudulent transactions and other illegal activities, and comply with legal obligations.',
    
    section3_title: 'Sharing Your Information',
    section3_desc: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others rights, property, or safety.',
    
    section4_title: 'Cookies and Tracking Technologies',
    section4_desc: 'We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.',
    
    section5_title: 'Your Data Protection Rights',
    section5_desc: 'Depending on your location, you may have the following rights regarding your personal information: the right to access, update, or delete the information we have on you; the right to rectification; the right to object to processing; the right to restriction of processing; the right to data portability; and the right to withdraw consent. To exercise these rights, please contact us using the information below.',
    
    section6_title: 'Data Security',
    section6_desc: 'We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.',
    
    section7_title: 'Children\'s Privacy',
    section7_desc: 'Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from children under 13 without verification of parental consent, we will take steps to remove that information from our servers.',
    
    section8_title: 'International Data Transfers',
    section8_desc: 'Your information may be transferred to and maintained on servers located outside of your country or jurisdiction. If you are located outside Pakistan and choose to provide information to us, please note that we transfer the data to Pakistan and process it there. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.',
    
    section9_title: 'Changes to This Privacy Policy',
    section9_desc: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.',
    
    section10_title: 'Contact Us',
    section10_desc: 'If you have any questions about this Privacy Policy, please contact Shahbaz at shahbaz@centre.com.pk or call +92 325 7960378.',
    
    questions: 'Have Questions?',
    questionsDesc: 'If you have any questions about our Privacy Policy or how we handle your data, please don\'t hesitate to contact us.',
    contactBtn: 'Contact Shahbaz',
    termsBtn: 'Terms of Service'
  };

  // ==================== URDU CONTENT ====================
  const urContent = {
    title: 'رازداری کی پالیسی',
    lastUpdatedLabel: 'آخری بار اپ ڈیٹ',
    introduction: 'تعارف',
    intro1: 'Centre.com.pk میں، ہم آپ کی رازداری کو سنجیدگی سے لیتے ہیں۔ یہ رازداری کی پالیسی وضاحت کرتی ہے کہ ہم آپ کی معلومات کو کیسے جمع، استعمال، افشا اور محفوظ کرتے ہیں جب آپ ہماری ویب سائٹ اور خدمات استعمال کرتے ہیں۔',
    intro2: 'براہ کرم اس رازداری کی پالیسی کو غور سے پڑھیں۔ اگر آپ اس رازداری کی پالیسی کی شرائط سے متفق نہیں ہیں تو براہ کرم سائٹ تک رسائی حاصل نہ کریں یا ہماری خدمات استعمال نہ کریں۔',
    intro3: 'ہم کسی بھی وقت اور کسی بھی وجہ سے اس رازداری کی پالیسی میں تبدیلیاں کرنے کا حق محفوظ رکھتے ہیں۔ ہم اس رازداری کی پالیسی کی "آخری بار اپ ڈیٹ" تاریخ کو اپ ڈیٹ کرکے آپ کو کسی بھی تبدیلی کے بارے میں آگاہ کریں گے۔',
    
    section1_title: 'ہم کون سی معلومات جمع کرتے ہیں',
    section1_desc: 'ہم ذاتی معلومات جمع کر سکتے ہیں جو آپ رضاکارانہ طور پر ہمیں فراہم کرتے ہیں جب آپ ہمارے ٹولز استعمال کرتے ہیں، ہمارے نیوز لیٹر کو سبسکرائب کرتے ہیں، فارم بھرتے ہیں، یا ہم سے رابطہ کرتے ہیں۔ اس معلومات میں آپ کا نام، ای میل ایڈریس، فون نمبر، اور کوئی بھی دوسری معلومات شامل ہو سکتی ہے جو آپ فراہم کرنا چاہتے ہیں۔',
    
    section2_title: 'ہم آپ کی معلومات کا استعمال کیسے کرتے ہیں',
    section2_desc: 'ہم اپنی ویب سائٹ اور خدمات کو چلانے اور برقرار رکھنے، صارف کے تجربے کو بہتر بنانے، آپ کے تبصروں اور سوالات کا جواب دینے، آپ کو تکنیکی اطلاعات اور معاون پیغامات بھیجنے، مصنوعات، خدمات، پیشکشوں اور تقریبات کے بارے میں آپ سے رابطہ کرنے، رجحانات، استعمال اور سرگرمیوں کی نگرانی اور تجزیہ کرنے، دھوکہ دہی والے لین دین اور دیگر غیر قانونی سرگرمیوں کا پتہ لگانے، تفتیش کرنے اور روکنے، اور قانونی ذمہ داریوں کی تعمیل کرنے کے لیے جمع کردہ معلومات کا استعمال کرتے ہیں۔',
    
    section3_title: 'آپ کی معلومات کا اشتراک',
    section3_desc: 'ہم آپ کی ذاتی معلومات کو تیسری فریق کو فروخت، تجارت یا کرائے پر نہیں دیتے ہیں۔ ہم آپ کی معلومات قابل اعتماد تیسری فریق سروس فراہم کنندگان کے ساتھ شیئر کر سکتے ہیں جو ہماری ویب سائٹ کو چلانے، ہمارے کاروبار کو چلانے، یا آپ کی خدمت کرنے میں ہماری مدد کرتے ہیں، جب تک کہ وہ فریق اس معلومات کو خفیہ رکھنے پر متفق ہوں۔',
    
    section4_title: 'کوکیز اور ٹریکنگ ٹیکنالوجیز',
    section4_desc: 'ہم اپنی ویب سائٹ پر سرگرمی کو ٹریک کرنے اور کچھ معلومات رکھنے کے لیے کوکیز اور اسی طرح کی ٹریکنگ ٹیکنالوجیز استعمال کرتے ہیں۔ کوکیز ڈیٹا کی چھوٹی مقدار والی فائلیں ہیں جن میں ایک گمنام منفرد شناخت کنندہ شامل ہو سکتا ہے۔',
    
    section5_title: 'آپ کے ڈیٹا کے تحفظ کے حقوق',
    section5_desc: 'آپ کے مقام کے لحاظ سے، آپ کو اپنی ذاتی معلومات کے بارے میں درج ذیل حقوق حاصل ہو سکتے ہیں: ہمارے پاس موجود معلومات تک رسائی، اپ ڈیٹ یا حذف کرنے کا حق؛ تصحیح کا حق؛ پروسیسنگ پر اعتراض کرنے کا حق؛ پروسیسنگ کی پابندی کا حق؛ ڈیٹا پورٹیبلٹی کا حق؛ اور رضامندی واپس لینے کا حق۔',
    
    section6_title: 'ڈیٹا سیکیورٹی',
    section6_desc: 'ہم آپ کی ذاتی معلومات کی حفاظت کے لیے مناسب تکنیکی اور تنظیمی اقدامات نافذ کرتے ہیں۔ تاہم، براہ کرم نوٹ کریں کہ انٹرنیٹ پر ترسیل کا کوئی طریقہ یا الیکٹرانک اسٹوریج کا طریقہ 100٪ محفوظ نہیں ہے۔',
    
    section7_title: 'بچوں کی رازداری',
    section7_desc: 'ہماری ویب سائٹ 13 سال سے کم عمر بچوں کے لیے نہیں ہے۔ ہم جان بوجھ کر 13 سال سے کم عمر بچوں سے ذاتی معلومات جمع نہیں کرتے ہیں۔',
    
    section8_title: 'بین الاقوامی ڈیٹا کی منتقلی',
    section8_desc: 'آپ کی معلومات آپ کے ملک یا دائرہ اختیار سے باہر واقع سرورز پر منتقل اور برقرار رکھی جا سکتی ہے۔',
    
    section9_title: 'اس رازداری کی پالیسی میں تبدیلیاں',
    section9_desc: 'ہم وقتاً فوقتاً اپنی رازداری کی پالیسی کو اپ ڈیٹ کر سکتے ہیں۔ ہم آپ کو کسی بھی تبدیلی کے بارے میں اس صفحہ پر نئی رازداری کی پالیسی پوسٹ کرکے اور "آخری بار اپ ڈیٹ" کی تاریخ کو اپ ڈیٹ کرکے مطلع کریں گے۔',
    
    section10_title: 'ہم سے رابطہ کریں',
    section10_desc: 'اگر آپ کو اس رازداری کی پالیسی کے بارے میں کوئی سوال ہے تو براہ کرم شہباز سے رابطہ کریں: shahbaz@centre.com.pk یا +92 325 7960378 پر کال کریں۔',
    
    questions: 'سوالات؟',
    questionsDesc: 'اگر آپ کو ہماری رازداری کی پالیسی یا ہمارے ڈیٹا کو سنبھالنے کے طریقے کے بارے میں کوئی سوال ہے تو براہ کرم ہم سے رابطہ کرنے میں ہچکچاہٹ نہ کریں۔',
    contactBtn: 'شہباز سے رابطہ کریں',
    termsBtn: 'خدمات کی شرائط'
  };

  // ==================== ARABIC CONTENT ====================
  const arContent = {
    title: 'سياسة الخصوصية',
    lastUpdatedLabel: 'آخر تحديث',
    introduction: 'مقدمة',
    intro1: 'في Centre.com.pk، نأخذ خصوصيتك على محمل الجد. تشرح سياسة الخصوصية هذه كيفية جمع معلوماتك واستخدامها والكشف عنها وحمايتها عند استخدام موقعنا وخدماتنا.',
    intro2: 'يرجى قراءة سياسة الخصوصية هذه بعناية. إذا كنت لا توافق على شروط سياسة الخصوصية هذه، يرجى عدم الوصول إلى الموقع أو استخدام خدماتنا.',
    intro3: 'نحتفظ بالحق في إجراء تغييرات على سياسة الخصوصية هذه في أي وقت ولأي سبب. سننبهك إلى أي تغييرات عن طريق تحديث تاريخ "آخر تحديث" لسياسة الخصوصية هذه.',
    
    section1_title: 'المعلومات التي نجمعها',
    section1_desc: 'قد نجمع معلومات شخصية تقدمها لنا طواعية عند استخدام أدواتنا أو الاشتراك في نشرتنا الإخبارية أو ملء نموذج أو الاتصال بنا. قد تشمل هذه المعلومات اسمك وعنوان بريدك الإلكتروني ورقم هاتفك وأي معلومات أخرى تختار تقديمها.',
    
    section2_title: 'كيف نستخدم معلوماتك',
    section2_desc: 'نستخدم المعلومات التي نجمعها لتشغيل وصيانة موقعنا وخدماتنا، وتحسين تجربة المستخدم، والرد على تعليقاتك وأسئلتك، وإرسال الإشعارات الفنية ورسائل الدعم، والتواصل معك بشأن المنتجات والخدمات والعروض والأحداث، ومراقبة وتحليل الاتجاهات والاستخدام والأنشطة، والكشف عن المعاملات الاحتيالية والأنشطة غير القانونية الأخرى والتحقيق فيها ومنعها، والامتثال للالتزامات القانونية.',
    
    section3_title: 'مشاركة معلوماتك',
    section3_desc: 'نحن لا نبيع أو نتاجر أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك مع مقدمي خدمات خارجيين موثوقين يساعدوننا في تشغيل موقعنا أو إدارة أعمالنا أو خدمتك، طالما أن هذه الأطراف توافق على الحفاظ على سرية هذه المعلومات.',
    
    section4_title: 'ملفات تعريف الارتباط وتقنيات التتبع',
    section4_desc: 'نستخدم ملفات تعريف الارتباط وتقنيات التتبع المماثلة لتتبع النشاط على موقعنا والاحتفاظ بمعلومات معينة. ملفات تعريف الارتباط هي ملفات تحتوي على كمية صغيرة من البيانات قد تشمل معرفًا فريدًا مجهولاً.',
    
    section5_title: 'حقوق حماية البيانات الخاصة بك',
    section5_desc: 'اعتمادًا على موقعك، قد تكون لديك الحقوق التالية فيما يتعلق بمعلوماتك الشخصية: الحق في الوصول إلى المعلومات التي لدينا عنك أو تحديثها أو حذفها؛ الحق في التصحيح؛ الحق في الاعتراض على المعالجة؛ الحق في تقييد المعالجة؛ الحق في نقل البيانات؛ والحق في سحب الموافقة.',
    
    section6_title: 'أمن البيانات',
    section6_desc: 'نقوم بتنفيذ تدابير فنية وتنظيمية مناسبة لحماية أمان معلوماتك الشخصية. ومع ذلك، يرجى ملاحظة أنه لا توجد طريقة لنقل البيانات عبر الإنترنت أو طريقة تخزين إلكترونية آمنة بنسبة 100٪.',
    
    section7_title: 'خصوصية الأطفال',
    section7_desc: 'موقعنا غير مخصص للأطفال دون سن 13 عامًا. نحن لا نجمع عن قصد معلومات شخصية من الأطفال دون سن 13 عامًا.',
    
    section8_title: 'نقل البيانات الدولي',
    section8_desc: 'قد يتم نقل معلوماتك والحفاظ عليها على خوادم موجودة خارج بلدك أو منطقتك القضائية.',
    
    section9_title: 'التغييرات في سياسة الخصوصية هذه',
    section9_desc: 'قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. سنخطرك بأي تغييرات عن طريق نشر سياسة الخصوصية الجديدة على هذه الصفحة وتحديث تاريخ "آخر تحديث".',
    
    section10_title: 'اتصل بنا',
    section10_desc: 'إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بشهباز على shahbaz@centre.com.pk أو الاتصال على +92 325 7960378.',
    
    questions: 'لديك أسئلة؟',
    questionsDesc: 'إذا كان لديك أي أسئلة حول سياسة الخصوصية الخاصة بنا أو كيفية تعاملنا مع بياناتك، فلا تتردد في الاتصال بنا.',
    contactBtn: 'اتصل بشهباز',
    termsBtn: 'شروط الخدمة'
  };

  // ==================== HINDI CONTENT ====================
  const hiContent = {
    title: 'गोपनीयता नीति',
    lastUpdatedLabel: 'अंतिम अपडेट',
    introduction: 'परिचय',
    intro1: 'Centre.com.pk में, हम आपकी गोपनीयता को गंभीरता से लेते हैं। यह गोपनीयता नीति बताती है कि जब आप हमारी वेबसाइट और सेवाओं का उपयोग करते हैं तो हम आपकी जानकारी को कैसे एकत्र, उपयोग, प्रकट और सुरक्षित करते हैं।',
    intro2: 'कृपया इस गोपनीयता नीति को ध्यान से पढ़ें। यदि आप इस गोपनीयता नीति के नियमों से सहमत नहीं हैं, तो कृपया साइट तक पहुंच न करें या हमारी सेवाओं का उपयोग न करें।',
    intro3: 'हम किसी भी समय और किसी भी कारण से इस गोपनीयता नीति में बदलाव करने का अधिकार सुरक्षित रखते हैं। हम इस गोपनीयता नीति की "अंतिम अपडेट" तिथि को अपडेट करके आपको किसी भी बदलाव के बारे में सचेत करेंगे।',
    
    section1_title: 'हम कौन सी जानकारी एकत्र करते हैं',
    section1_desc: 'जब आप हमारे टूल का उपयोग करते हैं, हमारे न्यूज़लेटर की सदस्यता लेते हैं, फॉर्म भरते हैं, या हमसे संपर्क करते हैं, तो हम आपके द्वारा स्वेच्छा से प्रदान की गई व्यक्तिगत जानकारी एकत्र कर सकते हैं। इस जानकारी में आपका नाम, ईमेल पता, फोन नंबर और कोई भी अन्य जानकारी शामिल हो सकती है जो आप प्रदान करना चुनते हैं।',
    
    section2_title: 'हम आपकी जानकारी का उपयोग कैसे करते हैं',
    section2_desc: 'हम अपनी वेबसाइट और सेवाओं को संचालित और बनाए रखने, उपयोगकर्ता अनुभव को बेहतर बनाने, आपकी टिप्पणियों और प्रश्नों का जवाब देने, आपको तकनीकी नोटिस और सहायता संदेश भेजने, उत्पादों, सेवाओं, ऑफ़र और घटनाओं के बारे में आपसे संपर्क करने, रुझानों, उपयोग और गतिविधियों की निगरानी और विश्लेषण करने, धोखाधड़ी वाले लेनदेन और अन्य अवैध गतिविधियों का पता लगाने, जांच करने और रोकने और कानूनी दायित्वों का पालन करने के लिए एकत्र की गई जानकारी का उपयोग करते हैं।',
    
    section3_title: 'आपकी जानकारी साझा करना',
    section3_desc: 'हम आपकी व्यक्तिगत जानकारी को तीसरे पक्ष को बेचते, व्यापार या किराए पर नहीं देते हैं। हम आपकी जानकारी विश्वसनीय तृतीय-पक्ष सेवा प्रदाताओं के साथ साझा कर सकते हैं जो हमारी वेबसाइट को संचालित करने, हमारे व्यवसाय का संचालन करने या आपकी सेवा करने में हमारी सहायता करते हैं, जब तक कि वे पक्ष इस जानकारी को गोपनीय रखने के लिए सहमत हों।',
    
    section4_title: 'कुकीज़ और ट्रैकिंग तकनीकें',
    section4_desc: 'हम अपनी वेबसाइट पर गतिविधि को ट्रैक करने और कुछ जानकारी रखने के लिए कुकीज़ और समान ट्रैकिंग तकनीकों का उपयोग करते हैं। कुकीज़ डेटा की छोटी मात्रा वाली फ़ाइलें हैं जिनमें एक अज्ञात अद्वितीय पहचानकर्ता शामिल हो सकता है।',
    
    section5_title: 'आपके डेटा संरक्षण अधिकार',
    section5_desc: 'आपके स्थान के आधार पर, आपको अपनी व्यक्तिगत जानकारी के संबंध में निम्नलिखित अधिकार हो सकते हैं: हमारे पास मौजूद जानकारी तक पहुंचने, अपडेट करने या हटाने का अधिकार; सुधार का अधिकार; प्रसंस्करण पर आपत्ति करने का अधिकार; प्रसंस्करण के प्रतिबंध का अधिकार; डेटा पोर्टेबिलिटी का अधिकार; और सहमति वापस लेने का अधिकार।',
    
    section6_title: 'डेटा सुरक्षा',
    section6_desc: 'हम आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए उचित तकनीकी और संगठनात्मक उपायों को लागू करते हैं। हालाँकि, कृपया ध्यान दें कि इंटरनेट पर ट्रांसमिशन का कोई भी तरीका या इलेक्ट्रॉनिक स्टोरेज का तरीका 100% सुरक्षित नहीं है।',
    
    section7_title: 'बच्चों की गोपनीयता',
    section7_desc: 'हमारी वेबसाइट 13 वर्ष से कम उम्र के बच्चों के लिए नहीं है। हम जानबूझकर 13 वर्ष से कम उम्र के बच्चों से व्यक्तिगत जानकारी एकत्र नहीं करते हैं।',
    
    section8_title: 'अंतर्राष्ट्रीय डेटा स्थानांतरण',
    section8_desc: 'आपकी जानकारी आपके देश या क्षेत्राधिकार के बाहर स्थित सर्वरों पर स्थानांतरित और बनाए रखी जा सकती है।',
    
    section9_title: 'इस गोपनीयता नीति में बदलाव',
    section9_desc: 'हम समय-समय पर अपनी गोपनीयता नीति को अपडेट कर सकते हैं। हम इस पृष्ठ पर नई गोपनीयता नीति पोस्ट करके और "अंतिम अपडेट" तिथि को अपडेट करके आपको किसी भी बदलाव के बारे में सूचित करेंगे।',
    
    section10_title: 'संपर्क करें',
    section10_desc: 'यदि आपके पास इस गोपनीयता नीति के बारे में कोई प्रश्न हैं, तो कृपया शाहबाज से संपर्क करें: shahbaz@centre.com.pk या +92 325 7960378 पर कॉल करें।',
    
    questions: 'प्रश्न हैं?',
    questionsDesc: 'यदि आपके पास हमारी गोपनीयता नीति या हमारे डेटा को संभालने के तरीके के बारे में कोई प्रश्न हैं, तो कृपया हमसे संपर्क करने में संकोच न करें।',
    contactBtn: 'शाहबाज से संपर्क करें',
    termsBtn: 'सेवा की शर्तें'
  };

  const getContent = () => {
    if (lang === 'ur') return urContent;
    if (lang === 'ar') return arContent;
    if (lang === 'hi') return hiContent;
    return enContent;
  };

  const content = getContent();
  const dir = getDirection();

  const sections = [
    { title: content.section1_title, desc: content.section1_desc },
    { title: content.section2_title, desc: content.section2_desc },
    { title: content.section3_title, desc: content.section3_desc },
    { title: content.section4_title, desc: content.section4_desc },
    { title: content.section5_title, desc: content.section5_desc },
    { title: content.section6_title, desc: content.section6_desc },
    { title: content.section7_title, desc: content.section7_desc },
    { title: content.section8_title, desc: content.section8_desc },
    { title: content.section9_title, desc: content.section9_desc },
    { title: content.section10_title, desc: content.section10_desc }
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
            <p className="text-lg md:text-xl" style={{ color: themeColors.text.secondary }}>
              {content.lastUpdatedLabel}: <strong>{lastUpdated}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Introduction */}
          <div 
            className="rounded-2xl p-6 md:p-8 mb-10 shadow-lg"
            style={{ 
              backgroundColor: themeColors.surface,
              border: `1px solid ${themeColors.border}`,
              borderRadius: '20px'
            }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
              {content.introduction}
            </h2>
            <div className="space-y-3" style={{ color: themeColors.text.secondary }}>
              <p>{content.intro1}</p>
              <p>{content.intro2}</p>
              <p>{content.intro3}</p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div 
                key={index}
                className="group rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-xl"
                style={{ 
                  backgroundColor: themeColors.surface,
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: '20px'
                }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  <div className="shrink-0">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 group-hover:scale-110"
                      style={{ 
                        backgroundColor: `${themeColors.primary}15`,
                        color: themeColors.primary
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
                      {section.title}
                    </h3>
                    <div className="leading-relaxed" style={{ color: themeColors.text.secondary }}>
                      <p>{section.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Questions Section */}
          <div 
            className="mt-12 p-6 md:p-8 rounded-2xl text-center"
            style={{ 
              background: `linear-gradient(135deg, ${themeColors.primary}10, ${themeColors.primary}05)`,
              border: `1px solid ${themeColors.primary}`,
              borderRadius: '20px'
            }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: themeColors.primary }}>
              {content.questions}
            </h3>
            <p className="mb-6 max-w-2xl mx-auto leading-relaxed" style={{ color: themeColors.text.secondary }}>
              {content.questionsDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: themeColors.primary,
                  color: '#ffffff'
                }}
              >
                {content.contactBtn}
              </Link>
              <Link
                href={`/${lang}/terms`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: themeColors.surface,
                  color: themeColors.text.primary,
                  border: `1px solid ${themeColors.border}`
                }}
              >
                {content.termsBtn}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}