import { getLocalDB } from '@/lib/db/local-db';
import { generateBlogFromTool } from '@/lib/blog/blogGenerator';
import { TOOL_SEO_DATA } from '@/lib/seo/toolSeoData';

const LANGS = ['en', 'ur', 'hi', 'ar'];

const MULTILINGUAL_TITLES: Record<string, Record<string, string>> = {
  'age-calculator': { en: 'Age Calculator', ur: 'عمر کیلکولیٹر', hi: 'आयु कैलकुलेटर', ar: 'حاسبة العمر' },
  'bmi-calculator': { en: 'BMI Calculator', ur: 'BMI کیلکولیٹر', hi: 'BMI कैलकुलेटर', ar: 'حاسبة BMI' },
  'loan-calculator': { en: 'Loan Calculator', ur: 'لون کیلکولیٹر', hi: 'ऋण कैलकुलेटर', ar: 'حاسبة القروض' },
  'currency-converter': { en: 'Currency Converter', ur: 'کرنسی کنورٹر', hi: 'मुद्रा परिवर्तक', ar: 'محول العملات' },
  'percentage-calculator': { en: 'Percentage Calculator', ur: 'فیصد کیلکولیٹر', hi: 'प्रतिशत कैलकुलेटर', ar: 'حاسبة النسبة المئوية' },
  'date-calculator': { en: 'Date Calculator', ur: 'تاریخ کیلکولیٹر', hi: 'दिनांक कैलकुलेटर', ar: 'حاسبة التاريخ' },
  'tip-calculator': { en: 'Tip Calculator', ur: 'ٹپ کیلکولیٹر', hi: 'टिप कैलकुलेटर', ar: 'حاسبة البقشيش' },
  'gpa-calculator': { en: 'GPA Calculator', ur: 'GPA کیلکولیٹر', hi: 'GPA कैलकुलेटर', ar: 'حاسبة GPA' },
  'compound-interest': { en: 'Compound Interest', ur: 'مرکب سود', hi: 'चक्रवृद्धि ब्याज', ar: 'الفائدة المركبة' },
  'unit-converter': { en: 'Unit Converter', ur: 'یونٹ کنورٹر', hi: 'इकाई परिवर्तक', ar: 'محول الوحدات' },
};

function getTitle(slug: string, lang: string, fallback: string): string {
  return MULTILINGUAL_TITLES[slug]?.[lang] || fallback;
}

function getLangContent(lang: string, toolName: string): any {
  const content: Record<string, any> = {
    en: {
      introduction: `Welcome to the ultimate guide for ${toolName}! Whether you're a beginner or professional, this comprehensive guide covers everything you need to know.`,
      whatIs: `${toolName} is a powerful free online tool that helps you get accurate results instantly. No registration required.`,
      features: [
        { icon: '🚀', title: 'Instant Results', description: 'Get results in milliseconds' },
        { icon: '🔒', title: '100% Private', description: 'All calculations happen in your browser' },
        { icon: '📱', title: 'Mobile Friendly', description: 'Works on all devices' },
        { icon: '🌐', title: 'Multi-Language', description: 'Available in 4 languages' },
        { icon: '🆓', title: 'Completely Free', description: 'No hidden costs, free forever' },
        { icon: '⚡', title: 'No Registration', description: 'Start using immediately' }
      ],
      howToUse: [{ step: 1, title: 'Open the Tool', description: `Navigate to ${toolName} page` }, { step: 2, title: 'Enter Data', description: 'Fill in the required fields' }, { step: 3, title: 'Get Results', description: 'Click calculate for instant results' }],
      useCases: [
        { icon: '📄', title: 'Professional Use', description: `Ideal for professionals needing accurate ${toolName} calculations` },
        { icon: '🎓', title: 'Education', description: `Students and teachers use ${toolName} for learning` },
        { icon: '💼', title: 'Business', description: `Businesses use ${toolName} for quick calculations` },
        { icon: '📱', title: 'Personal Use', description: `Everyday ${toolName} made simple and fast` }
      ],
      proTips: [`💡 Bookmark this ${toolName} page for quick access`, `💡 Use keyboard shortcuts for faster input`, `💡 Results copy with one click`, `💡 Try related tools for more features`, `💡 Works offline after loading`],
      faqs: [
        { question: `Is ${toolName} really free?`, answer: `Yes! 100% free with no hidden costs. No registration required.` },
        { question: 'Is my data safe?', answer: 'Absolutely! All calculations happen in your browser. No data leaves your device.' },
        { question: 'Can I use this on mobile?', answer: 'Yes! Fully responsive on smartphones and tablets.' },
        { question: 'Do I need to create an account?', answer: 'No! Start using immediately. No sign-up required.' }
      ],
      privacyNote: 'Your privacy is our top priority. All calculations are performed locally in your browser. We do not collect, store, or share any of your data.'
    },
    ur: {
      introduction: `${toolName} کے لیے مکمل گائیڈ میں خوش آمدید! چاہے آپ ابتدائی ہیں یا پیشہ ور، یہ جامع گائیڈ ہر چیز کا احاطہ کرتی ہے۔`,
      whatIs: `${toolName} ایک طاقتور مفت آن لائن ٹول ہے جو آپ کو فوری درست نتائج حاصل کرنے میں مدد کرتا ہے۔ کوئی رجسٹریشن کی ضرورت نہیں۔`,
      features: [
        { icon: '🚀', title: 'فوری نتائج', description: 'ملی سیکنڈز میں نتائج حاصل کریں' },
        { icon: '🔒', title: 'مکمل پرائیویسی', description: 'تمام حسابات آپ کے براؤزر میں ہوتے ہیں' },
        { icon: '📱', title: 'موبائل فرینڈلی', description: 'تمام ڈیوائسز پر کام کرتا ہے' },
        { icon: '🌐', title: 'کثیر لسانی', description: '4 زبانوں میں دستیاب' },
        { icon: '🆓', title: 'مکمل مفت', description: 'کوئی پوشیدہ اخراجات نہیں' },
        { icon: '⚡', title: 'کوئی رجسٹریشن نہیں', description: 'فوری استعمال شروع کریں' }
      ],
      howToUse: [{ step: 1, title: 'ٹول کھولیں', description: `${toolName} صفحہ کھولیں` }, { step: 2, title: 'ڈیٹا درج کریں', description: 'مطلوبہ فیلڈز پُر کریں' }, { step: 3, title: 'نتائج حاصل کریں', description: 'کیلکولیٹ پر کلک کریں' }],
      useCases: [
        { icon: '📄', title: 'پیشہ ورانہ استعمال', description: `پیشہ ور افراد کے لیے درست ${toolName} حسابات` },
        { icon: '🎓', title: 'تعلیم', description: `طلباء اور اساتذہ ${toolName} سیکھنے کے لیے استعمال کرتے ہیں` },
        { icon: '💼', title: 'کاروبار', description: `کاروباری افراد فوری حسابات کے لیے` },
        { icon: '📱', title: 'ذاتی استعمال', description: `روزمرہ ${toolName} آسان اور تیز` }
      ],
      proTips: [`💡 اس ${toolName} صفحہ کو بک مارک کریں`, `💡 تیز ان پٹ کے لیے کی بورڈ شارٹ کٹس`, `💡 ایک کلک سے نتائج کاپی کریں`, `💡 مزید فیچرز کے لیے متعلقہ ٹولز آزمائیں`, `💡 آف لائن بھی کام کرتا ہے`],
      faqs: [
        { question: `کیا ${toolName} واقعی مفت ہے؟`, answer: `جی ہاں! 100% مفت بغیر کسی پوشیدہ اخراجات کے۔` },
        { question: 'کیا میرا ڈیٹا محفوظ ہے؟', answer: 'بالکل! تمام حسابات آپ کے براؤزر میں ہوتے ہیں۔' },
        { question: 'کیا میں موبائل پر استعمال کر سکتا ہوں؟', answer: 'جی ہاں! اسمارٹ فون اور ٹیبلٹ پر مکمل طور پر کام کرتا ہے۔' }
      ],
      privacyNote: 'آپ کی پرائیویسی ہماری اولین ترجیح ہے۔ تمام حسابات آپ کے براؤزر میں مقامی طور پر کیے جاتے ہیں۔'
    },
    hi: {
      introduction: `${toolName} के लिए संपूर्ण गाइड में आपका स्वागत है! चाहे आप शुरुआती हों या पेशेवर, यह व्यापक गाइड सब कुछ कवर करती है।`,
      whatIs: `${toolName} एक शक्तिशाली मुफ्त ऑनलाइन टूल है जो आपको तुरंत सटीक परिणाम प्राप्त करने में मदद करता है। कोई पंजीकरण आवश्यक नहीं।`,
      features: [
        { icon: '🚀', title: 'तुरंत परिणाम', description: 'मिलीसेकंड में परिणाम प्राप्त करें' },
        { icon: '🔒', title: 'पूर्ण गोपनीयता', description: 'सभी गणनाएं आपके ब्राउज़र में होती हैं' },
        { icon: '📱', title: 'मोबाइल फ्रेंडली', description: 'सभी डिवाइस पर काम करता है' },
        { icon: '🌐', title: 'बहुभाषी', description: '4 भाषाओं में उपलब्ध' },
        { icon: '🆓', title: 'पूरी तरह मुफ्त', description: 'कोई छिपी हुई लागत नहीं' },
        { icon: '⚡', title: 'कोई पंजीकरण नहीं', description: 'तुरंत उपयोग शुरू करें' }
      ],
      howToUse: [{ step: 1, title: 'टूल खोलें', description: `${toolName} पृष्ठ खोलें` }, { step: 2, title: 'डेटा दर्ज करें', description: 'आवश्यक फ़ील्ड भरें' }, { step: 3, title: 'परिणाम प्राप्त करें', description: 'तुरंत परिणाम के लिए क्लिक करें' }],
      useCases: [
        { icon: '📄', title: 'व्यावसायिक उपयोग', description: `सटीक ${toolName} गणना के लिए आदर्श` },
        { icon: '🎓', title: 'शिक्षा', description: `छात्र और शिक्षक ${toolName} सीखने के लिए उपयोग करते हैं` },
        { icon: '💼', title: 'व्यवसाय', description: `त्वरित गणना के लिए व्यवसायिक उपयोग` },
        { icon: '📱', title: 'व्यक्तिगत उपयोग', description: `रोज़मर्रा ${toolName} सरल और तेज़` }
      ],
      proTips: [`💡 इस ${toolName} पृष्ठ को बुकमार्क करें`, `💡 तेज़ इनपुट के लिए कीबोर्ड शॉर्टकट`, `💡 एक क्लिक में परिणाम कॉपी करें`, `💡 अधिक सुविधाओं के लिए संबंधित टूल आज़माएं`, `💡 ऑफ़लाइन भी काम करता है`],
      faqs: [
        { question: `क्या ${toolName} वास्तव में मुफ्त है?`, answer: `हाँ! बिना किसी छिपे खर्च के 100% मुफ्त।` },
        { question: 'क्या मेरा डेटा सुरक्षित है?', answer: 'बिल्कुल! सभी गणनाएं आपके ब्राउज़र में होती हैं।' },
        { question: 'क्या मैं मोबाइल पर उपयोग कर सकता हूं?', answer: 'हाँ! स्मार्टफोन और टैबलेट पर पूरी तरह से काम करता है।' }
      ],
      privacyNote: 'आपकी गोपनीयता हमारी सर्वोच्च प्राथमिकता है। सभी गणनाएं आपके ब्राउज़र में स्थानीय रूप से की जाती हैं।'
    },
    ar: {
      introduction: `مرحباً بك في الدليل الشامل لـ ${toolName}! سواء كنت مبتدئاً أو محترفاً، يغطي هذا الدليل كل ما تحتاج معرفته.`,
      whatIs: `${toolName} هي أداة مجانية قوية عبر الإنترنت تساعدك في الحصول على نتائج دقيقة فوراً. لا حاجة للتسجيل.`,
      features: [
        { icon: '🚀', title: 'نتائج فورية', description: 'احصل على النتائج في أجزاء من الثانية' },
        { icon: '🔒', title: 'خصوصية كاملة', description: 'جميع الحسابات تتم في متصفحك' },
        { icon: '📱', title: 'متوافق مع الجوال', description: 'يعمل على جميع الأجهزة' },
        { icon: '🌐', title: 'متعدد اللغات', description: 'متوفر بـ 4 لغات' },
        { icon: '🆓', title: 'مجاني بالكامل', description: 'لا توجد تكاليف خفية' },
        { icon: '⚡', title: 'بدون تسجيل', description: 'ابدأ الاستخدام فوراً' }
      ],
      howToUse: [{ step: 1, title: 'افتح الأداة', description: `انتقل إلى صفحة ${toolName}` }, { step: 2, title: 'أدخل البيانات', description: 'املأ الحقول المطلوبة' }, { step: 3, title: 'احصل على النتائج', description: 'انقر للحصول على نتائج فورية' }],
      useCases: [
        { icon: '📄', title: 'استخدام مهني', description: `مثالي للمحترفين الذين يحتاجون حسابات ${toolName} دقيقة` },
        { icon: '🎓', title: 'التعليم', description: `يستخدم الطلاب والمعلمون ${toolName} للتعلم` },
        { icon: '💼', title: 'الأعمال', description: `تستخدم الشركات ${toolName} للحسابات السريعة` },
        { icon: '📱', title: 'استخدام شخصي', description: `${toolName} اليومي بسيط وسريع` }
      ],
      proTips: [`💡 ضع إشارة مرجعية لصفحة ${toolName}`, `💡 استخدم اختصارات لوحة المفاتيح`, `💡 انسخ النتائج بنقرة واحدة`, `💡 جرب الأدوات ذات الصلة`, `💡 يعمل بدون اتصال`],
      faqs: [
        { question: `هل ${toolName} مجاني حقاً؟`, answer: `نعم! مجاني 100% بدون تكاليف خفية.` },
        { question: 'هل بياناتي آمنة؟', answer: 'بالتأكيد! جميع الحسابات تتم في متصفحك.' },
        { question: 'هل يمكنني استخدامه على الجوال؟', answer: 'نعم! يعمل بشكل كامل على الهواتف والأجهزة اللوحية.' }
      ],
      privacyNote: 'خصوصيتك هي أولويتنا القصوى. تتم جميع الحسابات محلياً في متصفحك.'
    }
  };
  return content[lang] || content.en;
}

async function main() {
  const db = getLocalDB();
  let created = 0;
  let skipped = 0;

  const tools = Object.entries(TOOL_SEO_DATA);

  for (const [slug, toolData] of tools) {
    for (const lang of LANGS) {
      const blogSlug = `${slug}-complete-guide`;
      
      // Check if already exists
      const existing = db.prepare('SELECT id FROM blog_posts WHERE slug = ? AND lang = ?').get(blogSlug, lang);
      if (existing) {
        skipped++;
        continue;
      }

      const toolTitle = getTitle(slug, lang, toolData.title);
      const content = getLangContent(lang, toolTitle);

      db.prepare(`
        INSERT INTO blog_posts (title, slug, content, excerpt, category, lang, status, tool_slug, seo_title, seo_description, seo_keywords, published_at)
        VALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, datetime('now'))
      `).run(
        `${toolTitle} — Complete Guide 2026`,
        blogSlug,
        JSON.stringify(content),
        content.introduction?.substring(0, 150) + '...',
        toolData.category,
        lang,
        slug,
        `${toolTitle} — Free Online Tool | Complete Guide 2026`,
        content.introduction?.substring(0, 160) || '',
        `${slug}, ${toolTitle.toLowerCase()}, free ${toolData.category} tools, online ${slug}`
      );

      created++;
      console.log(`✅ [${lang}] ${toolTitle}`);
    }
  }

  console.log('');
  console.log(`🎉 COMPLETE! Created: ${created}, Skipped: ${skipped}, Total: ${tools.length * LANGS.length}`);
  console.log(`📊 Expected: ${tools.length} tools × ${LANGS.length} languages = ${tools.length * LANGS.length} posts`);
}

main();
