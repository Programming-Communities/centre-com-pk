
// scripts/restructure-translations.js
// 🚀 RUN: node scripts/restructure-translations.js

const fs = require('fs');
const path = require('path');

const OLD_PATH = path.join(process.cwd(), 'translations');
const BACKUP_PATH = path.join(process.cwd(), 'translations-backup');

console.log('🔄 RESTRUCTURING TRANSLATIONS...\n');

// 1. CREATE BACKUP
console.log('📦 Creating backup...');
if (fs.existsSync(OLD_PATH)) {
  if (fs.existsSync(BACKUP_PATH)) {
    fs.rmSync(BACKUP_PATH, { recursive: true, force: true });
  }
  fs.cpSync(OLD_PATH, BACKUP_PATH, { recursive: true });
  console.log('✅ Backup created: translations-backup/\n');
}

// 2. DELETE OLD STRUCTURE
console.log('🗑️ Deleting old structure...');
if (fs.existsSync(OLD_PATH)) {
  fs.rmSync(OLD_PATH, { recursive: true, force: true });
}
console.log('✅ Old structure deleted\n');

// 3. CREATE NEW STRUCTURE
console.log('🏗️ Creating new structure...');

// Create language folders
const LANGUAGES = ['en', 'ur', 'ar', 'hi'];
const TOOL_CATEGORIES = [
  'calculators',
  'code-tools',
  'design-tools',
  'image-tools',
  'pdf-tools',
  'security-tools',
  'text-tools'
];

LANGUAGES.forEach(lang => {
  // Create language folder
  const langPath = path.join(OLD_PATH, lang);
  fs.mkdirSync(langPath, { recursive: true });
  
  // Create tools subfolder
  const toolsPath = path.join(langPath, 'tools');
  fs.mkdirSync(toolsPath, { recursive: true });
  
  console.log(`  Created /${lang}/`);
});

console.log('✅ New structure created\n');

// 4. GENERATE JSON FILES FROM BACKUP
console.log('📝 Generating JSON files...');

// English translations (from backup)
const enMenu = {
  "menu.home": "Home",
  "menu.tools": "Tools",
  "menu.calculators": "Calculators",
  "menu.code": "Code Tools",
  "menu.design": "Design Tools",
  "menu.image": "Image Tools",
  "menu.pdf": "PDF Tools",
  "menu.security": "Security Tools",
  "menu.text": "Text Tools",
  "menu.educational": "Educational",
  "menu.all_tools": "All Tools",
  "menu.blog": "Blog",
  "menu.about": "About",
  "menu.contact": "Contact"
};

const enCommon = {
  "action.search": "Search",
  "action.search_placeholder": "Search tools...",
  "action.menu": "Menu",
  "action.close": "Close",
  "action.theme": "Theme",
  "action.language": "Language",
  "action.install": "Install App",
  "action.copy": "Copy",
  "action.download": "Download",
  "action.share": "Share",
  "action.reset": "Reset",
  "action.calculate": "Calculate",
  "action.clear": "Clear",
  "status.loading": "Loading...",
  "status.success": "Success!",
  "status.error": "Error!",
  "status.processing": "Processing...",
  "aria.menu": "Main navigation menu",
  "aria.search": "Search tools and calculators",
  "aria.theme_toggle": "Toggle dark/light mode",
  "aria.language_selector": "Select language"
};

const enPages = {
  "about.title": "About Centre.com.pk",
  "about.description": "We provide 500+ free online tools for everyone.",
  "contact.title": "Contact Us",
  "contact.description": "Get in touch with our team.",
  "privacy.title": "Privacy Policy",
  "privacy.description": "How we protect your data.",
  "terms.title": "Terms of Service",
  "terms.description": "Guidelines for using our tools.",
  "blog.title": "Blog",
  "blog.description": "Latest updates and tutorials."
};

// Urdu translations
const urMenu = {
  "menu.home": "ہوم",
  "menu.tools": "ٹولز",
  "menu.calculators": "کیلکولیٹرز",
  "menu.code": "کوڈ ٹولز",
  "menu.design": "ڈیزائن ٹولز",
  "menu.image": "امیج ٹولز",
  "menu.pdf": "پی ڈی ایف ٹولز",
  "menu.security": "سیکیورٹی ٹولز",
  "menu.text": "ٹیکسٹ ٹولز",
  "menu.educational": "تعلیمی",
  "menu.all_tools": "تمام ٹولز",
  "menu.blog": "بلاگ",
  "menu.about": "ہمارے بارے میں",
  "menu.contact": "رابطہ کریں"
};

const urCommon = {
  "action.search": "تلاش کریں",
  "action.search_placeholder": "ٹولز تلاش کریں...",
  "action.menu": "مینو",
  "action.close": "بند کریں",
  "action.theme": "تھیم",
  "action.language": "زبان",
  "action.install": "ایپ انسٹال کریں",
  "action.copy": "کاپی کریں",
  "action.download": "ڈاؤن لوڈ",
  "action.share": "شیئر کریں",
  "action.reset": "ری سیٹ",
  "action.calculate": "حساب کریں",
  "action.clear": "صاف کریں",
  "status.loading": "لوڈ ہو رہا ہے...",
  "status.success": "کامیاب!",
  "status.error": "خرابی!",
  "status.processing": "عمل جاری ہے...",
  "aria.menu": "مرکزی نیویگیشن مینو",
  "aria.search": "ٹولز اور کیلکولیٹرز تلاش کریں",
  "aria.theme_toggle": "ڈارک/لائٹ موڈ تبدیل کریں",
  "aria.language_selector": "زبان منتخب کریں"
};

const urPages = {
  "about.title": "Centre.com.pk کے بارے میں",
  "about.description": "ہم سب کے لیے 500+ مفت آن لائن ٹولز فراہم کرتے ہیں۔",
  "contact.title": "ہم سے رابطہ کریں",
  "contact.description": "ہماری ٹیم سے رابطہ کریں۔",
  "privacy.title": "پرائیویسی پالیسی",
  "privacy.description": "ہم آپ کے ڈیٹا کی حفاظت کیسے کرتے ہیں۔",
  "terms.title": "سروس کی شرائط",
  "terms.description": "ہمارے ٹولز کے استعمال کے رہنما اصول۔",
  "blog.title": "بلاگ",
  "blog.description": "تازہ ترین اپ ڈیٹس اور ٹیوٹوریلز۔"
};

// Arabic translations
const arMenu = {
  "menu.home": "الرئيسية",
  "menu.tools": "الأدوات",
  "menu.calculators": "الآلات الحاسبة",
  "menu.code": "أدوات البرمجة",
  "menu.design": "أدوات التصميم",
  "menu.image": "أدوات الصور",
  "menu.pdf": "أدوات PDF",
  "menu.security": "أدوات الأمان",
  "menu.text": "أدوات النص",
  "menu.educational": "التعليمية",
  "menu.all_tools": "جميع الأدوات",
  "menu.blog": "المدونة",
  "menu.about": "معلومات عنا",
  "menu.contact": "اتصل بنا"
};

const arCommon = {
  "action.search": "بحث",
  "action.search_placeholder": "ابحث عن أدوات...",
  "action.menu": "القائمة",
  "action.close": "إغلاق",
  "action.theme": "المظهر",
  "action.language": "اللغة",
  "action.install": "تثبيت التطبيق",
  "action.copy": "نسخ",
  "action.download": "تحميل",
  "action.share": "مشاركة",
  "action.reset": "إعادة تعيين",
  "action.calculate": "حساب",
  "action.clear": "مسح",
  "status.loading": "جاري التحميل...",
  "status.success": "نجاح!",
  "status.error": "خطأ!",
  "status.processing": "جاري المعالجة...",
  "aria.menu": "قائمة التنقل الرئيسية",
  "aria.search": "ابحث عن الأدوات والآلات الحاسبة",
  "aria.theme_toggle": "تبديل الوضع الداكن/الفاتح",
  "aria.language_selector": "اختر اللغة"
};

const arPages = {
  "about.title": "حول Centre.com.pk",
  "about.description": "نحن نقدم 500+ أداة مجانية عبر الإنترنت للجميع.",
  "contact.title": "اتصل بنا",
  "contact.description": "تواصل مع فريقنا.",
  "privacy.title": "سياسة الخصوصية",
  "privacy.description": "كيف نحمي بياناتك.",
  "terms.title": "شروط الخدمة",
  "terms.description": "إرشادات استخدام أدواتنا.",
  "blog.title": "المدونة",
  "blog.description": "أحدث التحديثات والدروس التعليمية."
};

// Hindi translations
const hiMenu = {
  "menu.home": "होम",
  "menu.tools": "टूल्स",
  "menu.calculators": "कैलकुलेटर",
  "menu.code": "कोड टूल्स",
  "menu.design": "डिज़ाइन टूल्स",
  "menu.image": "इमेज टूल्स",
  "menu.pdf": "पीडीएफ टूल्स",
  "menu.security": "सिक्योरिटी टूल्स",
  "menu.text": "टेक्स्ट टूल्स",
  "menu.educational": "शैक्षिक",
  "menu.all_tools": "सभी टूल्स",
  "menu.blog": "ब्लॉग",
  "menu.about": "हमारे बारे में",
  "menu.contact": "संपर्क करें"
};

const hiCommon = {
  "action.search": "खोजें",
  "action.search_placeholder": "टूल्स खोजें...",
  "action.menu": "मेनू",
  "action.close": "बंद करें",
  "action.theme": "थीम",
  "action.language": "भाषा",
  "action.install": "ऐप इंस्टॉल करें",
  "action.copy": "कॉपी करें",
  "action.download": "डाउनलोड",
  "action.share": "शेयर करें",
  "action.reset": "रीसेट",
  "action.calculate": "गणना करें",
  "action.clear": "साफ़ करें",
  "status.loading": "लोड हो रहा है...",
  "status.success": "सफल!",
  "status.error": "त्रुटि!",
  "status.processing": "प्रोसेस हो रहा है...",
  "aria.menu": "मुख्य नेविगेशन मेनू",
  "aria.search": "टूल्स और कैलकुलेटर खोजें",
  "aria.theme_toggle": "डार्क/लाइट मोड बदलें",
  "aria.language_selector": "भाषा चुनें"
};

const hiPages = {
  "about.title": "Centre.com.pk के बारे में",
  "about.description": "हम सभी के लिए 500+ मुफ्त ऑनलाइन टूल्स प्रदान करते हैं।",
  "contact.title": "संपर्क करें",
  "contact.description": "हमारी टीम से संपर्क करें।",
  "privacy.title": "गोपनीयता नीति",
  "privacy.description": "हम आपके डेटा की सुरक्षा कैसे करते हैं।",
  "terms.title": "सेवा की शर्तें",
  "terms.description": "हमारे टूल्स के उपयोग के दिशानिर्देश।",
  "blog.title": "ब्लॉग",
  "blog.description": "नवीनतम अपडेट और ट्यूटोरियल।"
};

// 5. WRITE ENGLISH FILES
console.log('  Writing English files...');
fs.writeFileSync(
  path.join(OLD_PATH, 'en', 'menu.json'),
  JSON.stringify(enMenu, null, 2)
);
fs.writeFileSync(
  path.join(OLD_PATH, 'en', 'common.json'),
  JSON.stringify(enCommon, null, 2)
);
fs.writeFileSync(
  path.join(OLD_PATH, 'en', 'pages.json'),
  JSON.stringify(enPages, null, 2)
);

// 6. WRITE URDU FILES
console.log('  Writing Urdu files...');
fs.writeFileSync(
  path.join(OLD_PATH, 'ur', 'menu.json'),
  JSON.stringify(urMenu, null, 2)
);
fs.writeFileSync(
  path.join(OLD_PATH, 'ur', 'common.json'),
  JSON.stringify(urCommon, null, 2)
);
fs.writeFileSync(
  path.join(OLD_PATH, 'ur', 'pages.json'),
  JSON.stringify(urPages, null, 2)
);

// 7. WRITE ARABIC FILES
console.log('  Writing Arabic files...');
fs.writeFileSync(
  path.join(OLD_PATH, 'ar', 'menu.json'),
  JSON.stringify(arMenu, null, 2)
);
fs.writeFileSync(
  path.join(OLD_PATH, 'ar', 'common.json'),
  JSON.stringify(arCommon, null, 2)
);
fs.writeFileSync(
  path.join(OLD_PATH, 'ar', 'pages.json'),
  JSON.stringify(arPages, null, 2)
);

// 8. WRITE HINDI FILES
console.log('  Writing Hindi files...');
fs.writeFileSync(
  path.join(OLD_PATH, 'hi', 'menu.json'),
  JSON.stringify(hiMenu, null, 2)
);
fs.writeFileSync(
  path.join(OLD_PATH, 'hi', 'common.json'),
  JSON.stringify(hiCommon, null, 2)
);
fs.writeFileSync(
  path.join(OLD_PATH, 'hi', 'pages.json'),
  JSON.stringify(hiPages, null, 2)
);

// 9. GENERATE TOOL TRANSLATIONS
console.log('  Writing tool translations...');

TOOL_CATEGORIES.forEach(category => {
  // English tools
  const enTools = {
    "title": category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    "description": `Free online ${category.replace('-', ' ')} tools for everyone.`,
    "meta_title": `${category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')} - Free Online Tools`,
    "meta_description": `Access free ${category.replace('-', ' ')} tools online. No registration, 100% free.`
  };
  
  fs.writeFileSync(
    path.join(OLD_PATH, 'en', 'tools', `${category}.json`),
    JSON.stringify(enTools, null, 2)
  );
  
  // Urdu tools
  const urTools = {
    "title": category === 'calculators' ? 'کیلکولیٹرز' :
             category === 'code-tools' ? 'کوڈ ٹولز' :
             category === 'design-tools' ? 'ڈیزائن ٹولز' :
             category === 'image-tools' ? 'امیج ٹولز' :
             category === 'pdf-tools' ? 'پی ڈی ایف ٹولز' :
             category === 'security-tools' ? 'سیکیورٹی ٹولز' :
             'ٹیکسٹ ٹولز',
    "description": `مفت آن لائن ${category.replace('-', ' ')} ٹولز سب کے لیے۔`,
    "meta_title": `${category === 'calculators' ? 'کیلکولیٹرز' :
                   category === 'code-tools' ? 'کوڈ ٹولز' :
                   category === 'design-tools' ? 'ڈیزائن ٹولز' :
                   category === 'image-tools' ? 'امیج ٹولز' :
                   category === 'pdf-tools' ? 'پی ڈی ایف ٹولز' :
                   category === 'security-tools' ? 'سیکیورٹی ٹولز' :
                   'ٹیکسٹ ٹولز'} - مفت آن لائن ٹولز`,
    "meta_description": `مفت ${category.replace('-', ' ')} ٹولز آن لائن استعمال کریں۔ کوئی رجسٹریشن نہیں، 100% مفت۔`
  };
  
  fs.writeFileSync(
    path.join(OLD_PATH, 'ur', 'tools', `${category}.json`),
    JSON.stringify(urTools, null, 2)
  );
  
  // Arabic tools
  const arTools = {
    "title": category === 'calculators' ? 'الآلات الحاسبة' :
             category === 'code-tools' ? 'أدوات البرمجة' :
             category === 'design-tools' ? 'أدوات التصميم' :
             category === 'image-tools' ? 'أدوات الصور' :
             category === 'pdf-tools' ? 'أدوات PDF' :
             category === 'security-tools' ? 'أدوات الأمان' :
             'أدوات النص',
    "description": `أدوات ${category.replace('-', ' ')} مجانية عبر الإنترنت للجميع.`,
    "meta_title": `${category === 'calculators' ? 'الآلات الحاسبة' :
                   category === 'code-tools' ? 'أدوات البرمجة' :
                   category === 'design-tools' ? 'أدوات التصميم' :
                   category === 'image-tools' ? 'أدوات الصور' :
                   category === 'pdf-tools' ? 'أدوات PDF' :
                   category === 'security-tools' ? 'أدوات الأمان' :
                   'أدوات النص'} - أدوات مجانية عبر الإنترنت`,
    "meta_description": `استخدم أدوات ${category.replace('-', ' ')} المجانية عبر الإنترنت. لا تسجيل، 100% مجاني.`
  };
  
  fs.writeFileSync(
    path.join(OLD_PATH, 'ar', 'tools', `${category}.json`),
    JSON.stringify(arTools, null, 2)
  );
  
  // Hindi tools
  const hiTools = {
    "title": category === 'calculators' ? 'कैलकुलेटर' :
             category === 'code-tools' ? 'कोड टूल्स' :
             category === 'design-tools' ? 'डिज़ाइन टूल्स' :
             category === 'image-tools' ? 'इमेज टूल्स' :
             category === 'pdf-tools' ? 'पीडीएफ टूल्स' :
             category === 'security-tools' ? 'सिक्योरिटी टूल्स' :
             'टेक्स्ट टूल्स',
    "description": `सभी के लिए मुफ्त ऑनलाइन ${category.replace('-', ' ')} टूल्स।`,
    "meta_title": `${category === 'calculators' ? 'कैलकुलेटर' :
                   category === 'code-tools' ? 'कोड टूल्स' :
                   category === 'design-tools' ? 'डिज़ाइन टूल्स' :
                   category === 'image-tools' ? 'इमेज टूल्स' :
                   category === 'pdf-tools' ? 'पीडीएफ टूल्स' :
                   category === 'security-tools' ? 'सिक्योरिटी टूल्स' :
                   'टेक्स्ट टूल्स'} - मुफ्त ऑनलाइन टूल्स`,
    "meta_description": `मुफ्त ${category.replace('-', ' ')} टूल्स ऑनलाइन उपयोग करें। कोई पंजीकरण नहीं, 100% मुफ्त।`
  };
  
  fs.writeFileSync(
    path.join(OLD_PATH, 'hi', 'tools', `${category}.json`),
    JSON.stringify(hiTools, null, 2)
  );
});

console.log('\n✅ All JSON files generated!');
console.log('\n📊 SUMMARY:');
console.log(`  Languages: ${LANGUAGES.join(', ')}`);
console.log(`  Tool Categories: ${TOOL_CATEGORIES.length}`);
console.log(`  Total Files: ${LANGUAGES.length * (3 + TOOL_CATEGORIES.length)}`);
console.log('\n🚀 New structure ready at /translations/');
console.log('📦 Backup saved at /translations-backup/');
console.log('\n⚠️  Run: node scripts/restructure-translations.js');