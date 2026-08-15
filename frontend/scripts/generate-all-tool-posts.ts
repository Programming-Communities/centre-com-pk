import { getLocalDB } from '@/lib/db/local-db';
import { TOOL_SEO_DATA } from '@/lib/seo/toolSeoData';

const LANGS = ['en', 'ur', 'hi', 'ar'];

const TOOL_NAMES: Record<string, Record<string, string>> = {
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
  'color-picker': { en: 'Color Picker', ur: 'رنگ چننے والا', hi: 'रंग चुनने वाला', ar: 'منتقي الألوان' },
  'image-compressor': { en: 'Image Compressor', ur: 'تصویر کمپریسر', hi: 'इमेज कंप्रेसर', ar: 'ضاغط الصور' },
  'image-converter': { en: 'Image Converter', ur: 'تصویر کنورٹر', hi: 'इमेज कन्वर्टर', ar: 'محول الصور' },
  'image-resizer': { en: 'Image Resizer', ur: 'تصویر ریزائزر', hi: 'इमेज रिसाइज़र', ar: 'مغير حجم الصور' },
  'image-cropper': { en: 'Image Cropper', ur: 'تصویر کراپر', hi: 'इमेज क्रॉपर', ar: 'قاطع الصور' },
  'background-remover': { en: 'Background Remover', ur: 'بیک گراؤنڈ ہٹانے والا', hi: 'बैकग्राउंड रिमूवर', ar: 'مزيل الخلفية' },
  'image-filters': { en: 'Image Filters', ur: 'تصویری فلٹرز', hi: 'इमेज फिल्टर', ar: 'فلاتر الصور' },
  'image-rotator': { en: 'Image Rotator', ur: 'تصویر گھمانے والا', hi: 'इमेज रोटेटर', ar: 'مدور الصور' },
  'favicon-generator': { en: 'Favicon Generator', ur: 'فیویکون جنریٹر', hi: 'फेविकॉन जनरेटर', ar: 'مولد الأيقونات' },
  'meme-generator': { en: 'Meme Generator', ur: 'میم جنریٹر', hi: 'मीम जनरेटर', ar: 'مولد الميم' },
  'photo-collage': { en: 'Photo Collage', ur: 'فوٹو کولاج', hi: 'फोटो कोलाज', ar: 'كولاج الصور' },
  'pdf-compressor': { en: 'PDF Compressor', ur: 'PDF کمپریسر', hi: 'PDF कंप्रेसर', ar: 'ضاغط PDF' },
  'pdf-merger': { en: 'PDF Merger', ur: 'PDF مرجر', hi: 'PDF मर्जर', ar: 'دمج PDF' },
  'pdf-splitter': { en: 'PDF Splitter', ur: 'PDF اسپلٹر', hi: 'PDF स्प्लिटर', ar: 'تقسيم PDF' },
  'pdf-to-word': { en: 'PDF to Word', ur: 'PDF سے ورڈ', hi: 'PDF से वर्ड', ar: 'PDF إلى Word' },
  'password-generator': { en: 'Password Generator', ur: 'پاس ورڈ جنریٹر', hi: 'पासवर्ड जनरेटर', ar: 'مولد كلمات المرور' },
  'hash-generator': { en: 'Hash Generator', ur: 'ہیش جنریٹر', hi: 'हैश जनरेटर', ar: 'مولد التجزئة' },
  'encryption-tools': { en: 'Encryption Tools', ur: 'انکرپشن ٹولز', hi: 'एन्क्रिप्शन टूल्स', ar: 'أدوات التشفير' },
  'ssl-checker': { en: 'SSL Checker', ur: 'SSL چیکر', hi: 'SSL चेकर', ar: 'مدقق SSL' },
  'security-analyzer': { en: 'Security Analyzer', ur: 'سیکیورٹی اینالائزر', hi: 'सुरक्षा विश्लेषक', ar: 'محلل الأمان' },
  'firewall-tester': { en: 'Firewall Tester', ur: 'فائر وال ٹیسٹر', hi: 'फायरवॉल टेस्टर', ar: 'مختبر الجدار الناري' },
  'data-masking': { en: 'Data Masking', ur: 'ڈیٹا ماسکنگ', hi: 'डेटा मास्किंग', ar: 'إخفاء البيانات' },
  'secure-file-wipe': { en: 'Secure File Wipe', ur: 'سیکیور فائل وائپ', hi: 'सिक्योर फाइल वाइप', ar: 'مسح آمن للملفات' },
  'two-factor-auth': { en: 'Two Factor Auth', ur: 'ٹو فیکٹر آتھ', hi: 'टू फैक्टर ऑथ', ar: 'مصادقة ثنائية' },
  'api-security': { en: 'API Security', ur: 'API سیکیورٹی', hi: 'API सुरक्षा', ar: 'أمان API' },
  'word-counter': { en: 'Word Counter', ur: 'ورڈ کاؤنٹر', hi: 'शब्द गणक', ar: 'عداد الكلمات' },
  'character-counter': { en: 'Character Counter', ur: 'کریکٹر کاؤنٹر', hi: 'अक्षर गणक', ar: 'عداد الأحرف' },
  'case-converter': { en: 'Case Converter', ur: 'کیس کنورٹر', hi: 'केस कन्वर्टर', ar: 'محول الحالة' },
  'text-diff': { en: 'Text Diff', ur: 'ٹیکسٹ ڈف', hi: 'टेक्स्ट डिफ', ar: 'مقارنة النصوص' },
  'lorem-ipsum': { en: 'Lorem Ipsum', ur: 'لوریم اپسم', hi: 'लोरेम इप्सम', ar: 'لوريم إيبسوم' },
  'markdown-editor': { en: 'Markdown Editor', ur: 'مارک ڈاؤن ایڈیٹر', hi: 'मार्कडाउन एडिटर', ar: 'محرر Markdown' },
  'uuid-generator': { en: 'UUID Generator', ur: 'UUID جنریٹر', hi: 'UUID जनरेटर', ar: 'مولد UUID' },
  'regex-tester': { en: 'Regex Tester', ur: 'ریجیکس ٹیسٹر', hi: 'रेगेक्स टेस्टर', ar: 'مختبر Regex' },
  'text-extractor': { en: 'Text Extractor', ur: 'ٹیکسٹ ایکسٹریکٹر', hi: 'टेक्स्ट एक्सट्रैक्टर', ar: 'مستخرج النصوص' },
  'cv-builder': { en: 'CV Builder', ur: 'CV بلڈر', hi: 'CV बिल्डर', ar: 'منشئ السيرة الذاتية' },
  'json-formatter': { en: 'JSON Formatter', ur: 'JSON فارمیٹر', hi: 'JSON फॉर्मेटर', ar: 'منسق JSON' },
  'html-formatter': { en: 'HTML Formatter', ur: 'HTML فارمیٹر', hi: 'HTML फॉर्मेटर', ar: 'منسق HTML' },
  'css-formatter': { en: 'CSS Formatter', ur: 'CSS فارمیٹر', hi: 'CSS फॉर्मेटर', ar: 'منسق CSS' },
  'javascript-formatter': { en: 'JS Formatter', ur: 'JS فارمیٹر', hi: 'JS फॉर्मेटर', ar: 'منسق JS' },
  'xml-formatter': { en: 'XML Formatter', ur: 'XML فارمیٹر', hi: 'XML फॉर्मेटर', ar: 'منسق XML' },
  'url-encoder': { en: 'URL Encoder', ur: 'URL انکوڈر', hi: 'URL एनकोडर', ar: 'مشفر URL' },
  'base64-encoder': { en: 'Base64 Encoder', ur: 'Base64 انکوڈر', hi: 'Base64 एनकोडर', ar: 'مشفر Base64' },
  'qr-code-generator': { en: 'QR Code Generator', ur: 'QR کوڈ جنریٹر', hi: 'QR कोड जनरेटर', ar: 'مولد QR كود' },
};

function getContent(lang: string, toolName: string): string {
  const c: Record<string, string> = {
    en: `<h2>What is ${toolName}?</h2><p><strong>${toolName}</strong> is a professional-grade free online tool by Centre.com.pk. No registration, no downloads — completely free and private.</p><h2>Key Features</h2><ul><li>🚀 Instant Results</li><li>🔒 100% Private & Secure</li><li>📱 Works on All Devices</li><li>🌐 Multi-Language Support</li><li>🆓 Completely Free Forever</li><li>⚡ No Registration Required</li></ul><h2>How to Use</h2><ol><li>Open the <strong>${toolName}</strong> tool</li><li>Enter your data in the input fields</li><li>Get instant results with one click</li></ol><h2>Use Cases</h2><ul><li>📄 Professional Use</li><li>🎓 Education & Learning</li><li>💼 Business Needs</li><li>📱 Personal Daily Use</li></ul><h2>Pro Tips</h2><ul><li>💡 Bookmark this page for quick access</li><li>💡 Results can be copied with one click</li><li>💡 Try related tools for more features</li></ul><h2>FAQ</h2><h3>Is ${toolName} really free?</h3><p>Yes! 100% free with no hidden costs.</p><h3>Is my data safe?</h3><p>Absolutely! All processing happens in your browser.</p><h2>Privacy Note</h2><p>Your privacy is our priority. No data is collected or stored.</p>`,
    ur: `<h2>${toolName} کیا ہے؟</h2><p><strong>${toolName}</strong> Centre.com.pk کا ایک پروفیشنل گریڈ مفت آن لائن ٹول ہے۔</p><h2>خصوصیات</h2><ul><li>🚀 فوری نتائج</li><li>🔒 مکمل پرائیویسی</li><li>📱 تمام ڈیوائسز پر کام</li><li>🌐 کثیر لسانی سپورٹ</li><li>🆓 ہمیشہ کے لیے مفت</li><li>⚡ رجسٹریشن کی ضرورت نہیں</li></ul><h2>استعمال کرنے کا طریقہ</h2><ol><li><strong>${toolName}</strong> ٹول کھولیں</li><li>اپنا ڈیٹا درج کریں</li><li>ایک کلک سے نتائج حاصل کریں</li></ol><h2>استعمال کے مواقع</h2><ul><li>📄 پیشہ ورانہ</li><li>🎓 تعلیم</li><li>💼 کاروبار</li><li>📱 ذاتی استعمال</li></ul><h2>FAQ</h2><h3>کیا یہ مفت ہے؟</h3><p>جی ہاں! 100% مفت۔</p>`,
    hi: `<h2>${toolName} क्या है?</h2><p><strong>${toolName}</strong> Centre.com.pk का एक पेशेवर मुफ्त ऑनलाइन टूल है।</p><h2>विशेषताएं</h2><ul><li>🚀 तुरंत परिणाम</li><li>🔒 पूर्ण गोपनीयता</li><li>📱 सभी डिवाइस पर काम</li><li>🌐 बहुभाषी</li><li>🆓 हमेशा मुफ्त</li></ul><h2>उपयोग कैसे करें</h2><ol><li><strong>${toolName}</strong> खोलें</li><li>डेटा दर्ज करें</li><li>एक क्लिक में परिणाम</li></ol>`,
    ar: `<h2>ما هو ${toolName}؟</h2><p><strong>${toolName}</strong> أداة احترافية مجانية من Centre.com.pk.</p><h2>الميزات</h2><ul><li>🚀 نتائج فورية</li><li>🔒 خصوصية كاملة</li><li>📱 يعمل على جميع الأجهزة</li><li>🌐 متعدد اللغات</li><li>🆓 مجاني للأبد</li></ul><h2>كيفية الاستخدام</h2><ol><li>افتح <strong>${toolName}</strong></li><li>أدخل البيانات</li><li>احصل على النتائج بنقرة واحدة</li></ol>`,
  };
  return c[lang] || c.en;
}

async function main() {
  const db = getLocalDB();
  let created = 0, skipped = 0;

  for (const [slug, toolData] of Object.entries(TOOL_SEO_DATA)) {
    for (const lang of LANGS) {
      const blogSlug = `${slug}-complete-guide`;
      const existing = db.prepare('SELECT id FROM blog_posts WHERE slug = ? AND lang = ?').get(blogSlug, lang);
      if (existing) { skipped++; continue; }

      const toolName = TOOL_NAMES[slug]?.[lang] || toolData.title;
      const content = getContent(lang, toolName);
      const excerpt = content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';

      db.prepare(`INSERT INTO blog_posts (title, slug, content, excerpt, category, lang, status, tool_slug, tool_name, seo_title, seo_description, seo_keywords, published_at) VALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, datetime('now'))`).run(
        `${toolName} — Complete Guide 2026`,
        blogSlug, content, excerpt,
        toolData.category, lang, slug, toolName,
        `${toolName} — Free Online Tool | Complete Guide 2026`,
        excerpt, `${slug}, ${toolName.toLowerCase()}, free tools`
      );
      created++;
    }
    console.log(`✅ ${slug} (4 languages)`);
  }

  console.log(`\n🎉 COMPLETE! Created: ${created}, Skipped: ${skipped}, Total: ${created + skipped}`);
}

main();
