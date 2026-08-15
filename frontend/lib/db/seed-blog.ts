import { getLocalDB } from './local-db';
import { migrateBlog } from './migrate-blog';

export function seedBlogPosts() {
  migrateBlog();
  const db = getLocalDB();
  
  const categories = ['calculators', 'image-tools', 'pdf-tools', 'code-tools', 'text-tools', 'security-tools', 'design-tools'];
  const langs = ['en', 'ur', 'hi', 'ar'];
  
  const toolPosts: Record<string, Record<string, { title: string; excerpt: string; content: string; image: string }>> = {
    'bmi-calculator': {
      en: {
        title: 'BMI Calculator — Complete Guide with WHO Standards',
        excerpt: 'Learn how to calculate your Body Mass Index (BMI) using the standard WHO formula. Understand BMI categories from underweight to obese.',
        content: `<h2>What is BMI?</h2><p>Body Mass Index (BMI) is a simple measurement that uses your height and weight to determine if you have a healthy body weight. The <strong>World Health Organization (WHO)</strong> established BMI as a standard for assessing health risks.</p><h2>How to Calculate BMI</h2><p>The formula is: <code>BMI = weight (kg) / height² (m²)</code></p><p>For example, if you weigh 70 kg and are 1.75 m tall:<br><code>BMI = 70 / (1.75 × 1.75) = 22.9</code></p><h2>BMI Categories (WHO)</h2><ul><li>Below 18.5 — Underweight</li><li>18.5–24.9 — Normal weight</li><li>25–29.9 — Overweight</li><li>30 and above — Obese</li></ul><h2>Why Use Our BMI Calculator?</h2><p>Our free tool supports both metric and imperial units. Simply enter your measurements and get instant results.</p>`,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
      },
      ur: {
        title: 'BMI کیلکولیٹر — مکمل گائیڈ',
        excerpt: 'WHO کے معیاری فارمولے کا استعمال کرتے ہوئے اپنا باڈی ماس انڈیکس (BMI) معلوم کریں۔ BMI کیٹیگریز کو سمجھیں۔',
        content: `<h2>BMI کیا ہے؟</h2><p>باڈی ماس انڈیکس (BMI) ایک سادہ پیمائش ہے جو آپ کے قد اور وزن کا استعمال کرکے صحت مند جسمانی وزن کا تعین کرتی ہے۔</p>`,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
      },
      hi: {
        title: 'BMI कैलकुलेटर — पूरी गाइड',
        excerpt: 'WHO के मानक फॉर्मूले का उपयोग करके अपना बॉडी मास इंडेक्स (BMI) जानें। BMI श्रेणियों को समझें।',
        content: `<h2>BMI क्या है?</h2><p>बॉडी मास इंडेक्स (BMI) एक सरल माप है जो आपकी ऊंचाई और वजन का उपयोग करके स्वस्थ शरीर के वजन का निर्धारण करता है।</p>`,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
      },
      ar: {
        title: 'حاسبة BMI — دليل كامل',
        excerpt: 'تعلم كيفية حساب مؤشر كتلة الجسم (BMI) باستخدام صيغة منظمة الصحة العالمية. افهم فئات BMI.',
        content: `<h2>ما هو BMI؟</h2><p>مؤشر كتلة الجسم (BMI) هو قياس بسيط يستخدم طولك ووزنك لتحديد ما إذا كان لديك وزن صحي.</p>`,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
      }
    },
    'password-generator': {
      en: {
        title: 'Password Generator — Create Unbreakable Passwords',
        excerpt: 'Generate strong, random passwords with our free tool. Learn best practices for password security.',
        content: `<h2>Why Strong Passwords Matter</h2><p>In 2026, weak passwords remain the #1 cause of data breaches. A strong password protects your online accounts from hackers.</p><h2>What Makes a Password Strong?</h2><ul><li>At least 16 characters</li><li>Mix of uppercase and lowercase</li><li>Numbers and symbols</li><li>No dictionary words</li></ul>`,
        image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800'
      },
      ur: {
        title: 'پاسورڈ جنریٹر — مضبوط پاسورڈ بنائیں',
        excerpt: 'ہمارے مفت ٹول سے مضبوط، رینڈم پاسورڈ بنائیں۔ پاسورڈ سیکیورٹی کے بہترین طریقے سیکھیں۔',
        content: `<h2>مضبوط پاسورڈ کیوں ضروری ہے؟</h2><p>2026 میں، کمزور پاسورڈ ڈیٹا کی خلاف ورزیوں کی #1 وجہ ہیں۔</p>`,
        image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800'
      },
      hi: {
        title: 'पासवर्ड जनरेटर — अटूट पासवर्ड बनाएं',
        excerpt: 'हमारे मुफ्त टूल से मजबूत पासवर्ड बनाएं। पासवर्ड सुरक्षा के सर्वोत्तम तरीके सीखें।',
        content: `<h2>मजबूत पासवर्ड क्यों जरूरी है?</h2><p>2026 में कमजोर पासवर्ड डेटा उल्लंघनों का #1 कारण हैं।</p>`,
        image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800'
      },
      ar: {
        title: 'مولد كلمات المرور — أنشئ كلمات مرور قوية',
        excerpt: 'أنشئ كلمات مرور قوية وعشوائية باستخدام أداتنا المجانية. تعلم أفضل ممارسات الأمان.',
        content: `<h2>لماذا كلمات المرور القوية مهمة؟</h2><p>في عام 2026، تظل كلمات المرور الضعيفة السبب الأول لانتهاكات البيانات.</p>`,
        image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800'
      }
    }
  };

  let count = 0;
  const now = new Date().toISOString();

  for (const [tool, translations] of Object.entries(toolPosts)) {
    // Determine category
    let category = 'calculators';
    if (tool.includes('password') || tool.includes('hash') || tool.includes('ssl')) category = 'security-tools';
    else if (tool.includes('image') || tool.includes('photo')) category = 'image-tools';
    else if (tool.includes('pdf')) category = 'pdf-tools';
    else if (tool.includes('json') || tool.includes('html') || tool.includes('css') || tool.includes('qr')) category = 'code-tools';
    else if (tool.includes('word') || tool.includes('text') || tool.includes('case')) category = 'text-tools';
    else if (tool.includes('color') || tool.includes('picker')) category = 'design-tools';

    for (const [lang, data] of Object.entries(translations)) {
      const id = crypto.randomUUID();
      const slug = `${tool}-${lang}-${Date.now()}`;
      
      const existing = db.prepare('SELECT id FROM blog_posts WHERE tool_slug = ? AND lang = ?').get(tool, lang);
      if (existing) continue;

      db.prepare(`
        INSERT INTO blog_posts (id, tool_slug, tool_name, category, lang, title, slug, excerpt, content, image_url, author, meta_description, is_featured, read_time, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, tool, data.title.split('—')[0].trim(), category, lang, data.title, slug, data.excerpt, data.content, data.image, 'Centre.com.pk Team', data.excerpt, lang === 'en' ? 1 : 0, Math.floor(data.content.length / 500) || 3, now, now);
      
      count++;
    }
  }

  console.log(`✅ Seeded ${count} blog posts!`);
}

if (require.main === module) {
  seedBlogPosts();
}
