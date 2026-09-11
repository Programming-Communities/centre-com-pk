import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'centers-local.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Tool ka SEO data import karo
import { TOOL_SEO_DATA } from '../lib/seo/toolSeoData';
import { semanticKeywords } from '../lib/seo/semantic-keywords';

const LANGUAGES = ['en', 'ur', 'hi', 'ar'];

// Template for blog posts
const BLOG_TEMPLATES: Record<string, { title: string; content: string }> = {
  en: {
    title: '{toolName} — Complete Guide & How to Use {toolName} Online (2026)',
    content: `
<h2>What is {toolName}?</h2>
<p>{toolName} is a free online tool that helps you {toolDescription}. With our {toolName}, you can {toolUseCase} — 100% free, no registration required.</p>

<h2>How to Use {toolName} — Step by Step Guide</h2>
<ol>
<li><strong>Step 1:</strong> Visit our {toolName} page</li>
<li><strong>Step 2:</strong> {toolStep2}</li>
<li><strong>Step 3:</strong> Click the button to get instant results</li>
<li><strong>Step 4:</strong> Copy or download your results</li>
</ol>

<h2>Key Features of Our {toolName}</h2>
<ul>
<li>✅ 100% Free — No hidden costs</li>
<li>✅ No Registration Required</li>
<li>✅ Privacy First — All processing in your browser</li>
<li>✅ Multi-Language Support (English, Urdu, Hindi, Arabic)</li>
<li>✅ Works on All Devices (Mobile, Tablet, Desktop)</li>
</ul>

<h2>Why Choose Our {toolName} Over Paid Alternatives?</h2>
<p>Unlike paid tools that charge $10-20/month, our {toolName} is completely free. We offer:</p>
<ul>
<li>💰 Save money with free unlimited usage</li>
<li>⚡ Lightning-fast processing</li>
<li>🔒 Complete privacy — no data stored on servers</li>
<li>🌍 Multi-language support</li>
</ul>

<h2>Frequently Asked Questions (FAQ)</h2>
<h3>Is this {toolName} really free?</h3>
<p>Yes, 100% free with no hidden charges or premium plans.</p>

<h3>Do I need to create an account?</h3>
<p>No, you can use {toolName} without any registration.</p>

<h3>Is my data safe?</h3>
<p>Absolutely! All processing happens locally in your browser. Your data never leaves your device.</p>

<h2>Conclusion</h2>
<p>Our {toolName} is the best free solution for all your needs. Try it now and see why thousands of users trust Centre.com.pk for their daily tasks.</p>
`,
  },
  ur: {
    title: '{toolName} — مکمل گائیڈ اور آن لائن استعمال کرنے کا طریقہ (2026)',
    content: `
<h2>{toolName} کیا ہے؟</h2>
<p>{toolName} ایک مفت آن لائن ٹول ہے جو آپ کی مدد کرتا ہے {toolDescription}۔ ہمارے {toolName} کے ساتھ، آپ {toolUseCase} کر سکتے ہیں — 100% مفت، کوئی رجسٹریشن نہیں۔</p>

<h2>{toolName} استعمال کرنے کا طریقہ — مرحلہ وار گائیڈ</h2>
<ol>
<li><strong>مرحلہ 1:</strong> ہمارے {toolName} صفحہ پر جائیں</li>
<li><strong>مرحلہ 2:</strong> {toolStep2}</li>
<li><strong>مرحلہ 3:</strong> فوری نتائج حاصل کرنے کے لیے بٹن دبائیں</li>
<li><strong>مرحلہ 4:</strong> اپنے نتائج کاپی یا ڈاؤن لوڈ کریں</li>
</ol>

<h2>ہمارے {toolName} کی اہم خصوصیات</h2>
<ul>
<li>✅ 100% مفت — کوئی پوشیدہ اخراجات نہیں</li>
<li>✅ کوئی رجسٹریشن درکار نہیں</li>
<li>✅ پرائیویسی فرسٹ — تمام پروسیسنگ آپ کے براؤزر میں</li>
<li>✅ کثیر زبان سپورٹ (اردو، ہندی، عربی، انگریزی)</li>
<li>✅ تمام ڈیوائسز پر کام کرتا ہے</li>
</ul>

<h2>اکثر پوچھے گئے سوالات (FAQ)</h2>
<h3>کیا یہ {toolName} واقعی مفت ہے؟</h3>
<p>جی ہاں، 100% مفت ہے۔</p>

<h3>کیا مجھے اکاؤنٹ بنانے کی ضرورت ہے؟</h3>
<p>نہیں، آپ بغیر رجسٹریشن کے استعمال کر سکتے ہیں۔</p>
`,
  },
  hi: {
    title: '{toolName} — पूरी गाइड और ऑनलाइन उपयोग कैसे करें (2026)',
    content: `
<h2>{toolName} क्या है?</h2>
<p>{toolName} एक मुफ्त ऑनलाइन टूल है जो आपकी मदद करता है {toolDescription}। हमारे {toolName} के साथ, आप {toolUseCase} कर सकते हैं — 100% मुफ्त, कोई पंजीकरण नहीं।</p>

<h2>{toolName} का उपयोग कैसे करें — चरण-दर-चरण गाइड</h2>
<ol>
<li><strong>चरण 1:</strong> हमारे {toolName} पेज पर जाएं</li>
<li><strong>चरण 2:</strong> {toolStep2}</li>
<li><strong>चरण 3:</strong> तुरंत परिणाम पाने के लिए बटन दबाएं</li>
<li><strong>चरण 4:</strong> अपने परिणाम कॉपी या डाउनलोड करें</li>
</ol>

<h2>हमारे {toolName} की मुख्य विशेषताएं</h2>
<ul>
<li>✅ 100% मुफ्त — कोई छिपी हुई लागत नहीं</li>
<li>✅ कोई पंजीकरण आवश्यक नहीं</li>
<li>✅ गोपनीयता प्रथम — सभी प्रोसेसिंग आपके ब्राउज़र में</li>
<li>✅ बहु-भाषा समर्थन</li>
</ul>

<h2>अक्सर पूछे जाने वाले प्रश्न (FAQ)</h2>
<h3>क्या यह {toolName} वास्तव में मुफ्त है?</h3>
<p>हां, 100% मुफ्त है।</p>

<h3>क्या मुझे खाता बनाने की आवश्यकता है?</h3>
<p>नहीं, आप बिना पंजीकरण के उपयोग कर सकते हैं।</p>
`,
  },
  ar: {
    title: '{toolName} — دليل كامل وكيفية الاستخدام عبر الإنترنت (2026)',
    content: `
<h2>ما هو {toolName}؟</h2>
<p>{toolName} هي أداة مجانية عبر الإنترنت تساعدك على {toolDescription}. مع {toolName} الخاص بنا، يمكنك {toolUseCase} — 100% مجاني، بدون تسجيل.</p>

<h2>كيفية استخدام {toolName} — دليل خطوة بخطوة</h2>
<ol>
<li><strong>الخطوة 1:</strong> قم بزيارة صفحة {toolName}</li>
<li><strong>الخطوة 2:</strong> {toolStep2}</li>
<li><strong>الخطوة 3:</strong> انقر على الزر للحصول على نتائج فورية</li>
<li><strong>الخطوة 4:</strong> انسخ أو حمّل نتائجك</li>
</ol>

<h2>الميزات الرئيسية لـ {toolName}</h2>
<ul>
<li>✅ 100% مجاني — بدون تكاليف خفية</li>
<li>✅ بدون تسجيل</li>
<li>✅ الخصوصية أولاً — جميع المعالجة في متصفحك</li>
<li>✅ دعم متعدد اللغات</li>
</ul>

<h2>الأسئلة الشائعة (FAQ)</h2>
<h3>هل {toolName} مجاني حقاً؟</h3>
<p>نعم، مجاني 100%.</p>

<h3>هل أحتاج إلى إنشاء حساب؟</h3>
<p>لا، يمكنك الاستخدام بدون تسجيل.</p>
`,
  },
};

// Helper: Generate slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

// Helper: Get tool use case from SEO data
function getToolUseCase(toolData: any): string {
  const firstKeyword = toolData.keywords?.[0] || toolData.title;
  return `perform ${firstKeyword.toLowerCase()} tasks`;
}

// Helper: Get step 2 from tool description
function getToolStep2(toolData: any): string {
  const description = toolData.description || '';
  const firstSentence = description.split('.')[0];
  return firstSentence.toLowerCase().substring(0, 80);
}

// Main function
function generateBlogPosts() {
  let count = 0;
  const now = new Date().toISOString();

  for (const [slug, toolData] of Object.entries(TOOL_SEO_DATA)) {
    const semantic = semanticKeywords[slug];
    const toolName = toolData.title.split('—')[0].trim();
    const toolDescription = toolData.description?.substring(0, 100) || `${toolName} tasks`;
    const toolUseCase = getToolUseCase(toolData);
    const toolStep2 = getToolStep2(toolData);
    const category = toolData.category || 'general';
    const primaryKeyword = semantic?.primary || `${toolName.toLowerCase()} online`;

    for (const lang of LANGUAGES) {
      const template = BLOG_TEMPLATES[lang];
      
      const title = template.title
        .replace(/{toolName}/g, toolName)
        .replace(/{toolDescription}/g, toolDescription)
        .replace(/{toolUseCase}/g, toolUseCase);
      
      const content = template.content
        .replace(/{toolName}/g, toolName)
        .replace(/{toolDescription}/g, toolDescription)
        .replace(/{toolUseCase}/g, toolUseCase)
        .replace(/{toolStep2}/g, toolStep2);

      const postSlug = `${slug}-${lang}-guide`;
      const excerpt = content.substring(0, 150).replace(/<[^>]+>/g, '') + '...';

      // Check existing post
      const existing = db.prepare('SELECT id FROM blog_posts WHERE slug = ?').get(postSlug);
      if (existing) {
        console.log(`⏭️ Skipping existing: ${postSlug}`);
        continue;
      }

      // Insert post
      db.prepare(`
        INSERT INTO blog_posts (title, slug, content, excerpt, category, lang, status, tool_slug, tool_name, seo_title, seo_description, seo_keywords, is_featured, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        title,
        postSlug,
        content,
        excerpt,
        category,
        lang,
        slug,
        toolName,
        title.substring(0, 60),
        excerpt.substring(0, 160),
        primaryKeyword + ', ' + (toolData.keywords?.slice(0, 5).join(', ') || ''),
        lang === 'en' ? 1 : 0,
        now,
        now
      );

      count++;
      console.log(`✅ Created: ${postSlug} (${lang})`);
    }
  }

  console.log(`\n🎉 Total blog posts created: ${count}`);
  db.close();
}

// Run
generateBlogPosts();