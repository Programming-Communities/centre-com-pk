-- ============================================
-- ADD URDU/HINDI/ARABIC FOR ALL 54 TOOLS
-- ============================================

-- Get all English slugs that need translations
INSERT INTO blog_posts (title, slug, content, excerpt, category, lang, status, tool_slug, tool_name, seo_title, seo_description, seo_keywords, parent_slug, created_at, updated_at)
SELECT 
  CASE WHEN t.lang_code = 'ur' THEN 
    CASE WHEN bp.tool_slug = 'age-calculator' THEN 'عمر کیلکولیٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'bmi-calculator' THEN 'BMI کیلکولیٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'loan-calculator' THEN 'لون کیلکولیٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'currency-converter' THEN 'کرنسی کنورٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'percentage-calculator' THEN 'فیصد کیلکولیٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'date-calculator' THEN 'تاریخ کیلکولیٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'tip-calculator' THEN 'ٹپ کیلکولیٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'gpa-calculator' THEN 'GPA کیلکولیٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'compound-interest' THEN 'مرکب سود — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'unit-converter' THEN 'یونٹ کنورٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'password-generator' THEN 'پاس ورڈ جنریٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'qr-code-generator' THEN 'QR کوڈ جنریٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'json-formatter' THEN 'JSON فارمیٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'html-formatter' THEN 'HTML فارمیٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'css-formatter' THEN 'CSS فارمیٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'javascript-formatter' THEN 'JS فارمیٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'xml-formatter' THEN 'XML فارمیٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'url-encoder' THEN 'URL انکوڈر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'base64-encoder' THEN 'Base64 انکوڈر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'color-picker' THEN 'رنگ چننے والا — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'image-compressor' THEN 'تصویر کمپریسر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'image-converter' THEN 'تصویر کنورٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'image-cropper' THEN 'تصویر کراپر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'image-resizer' THEN 'تصویر ریزائزر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'image-rotator' THEN 'تصویر روٹیٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'image-filters' THEN 'تصویر فلٹرز — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'background-remover' THEN 'بیک گراؤنڈ ہٹانے والا — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'favicon-generator' THEN 'فیویکون جنریٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'meme-generator' THEN 'میم جنریٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'photo-collage' THEN 'فوٹو کولاج — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'pdf-compressor' THEN 'PDF کمپریسر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'pdf-merger' THEN 'PDF مرجر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'pdf-splitter' THEN 'PDF سپلٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'pdf-to-word' THEN 'PDF سے ورڈ — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'hash-generator' THEN 'ہیش جنریٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'ssl-checker' THEN 'SSL چیکر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'encryption-tools' THEN 'انکرپشن ٹولز — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'security-analyzer' THEN 'سیکیورٹی اینالائزر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'firewall-tester' THEN 'فائر وال ٹیسٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'data-masking' THEN 'ڈیٹا ماسکنگ — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'secure-file-wipe' THEN 'سیکیور فائل وائپ — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'two-factor-auth' THEN 'ٹو فیکٹر آتھ — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'api-security' THEN 'API سیکیورٹی — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'word-counter' THEN 'ورڈ کاؤنٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'character-counter' THEN 'کریکٹر کاؤنٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'case-converter' THEN 'کیس کنورٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'lorem-ipsum' THEN 'لوریم اپسم — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'markdown-editor' THEN 'مارک ڈاؤن ایڈیٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'regex-tester' THEN 'ریجیکس ٹیسٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'text-diff' THEN 'ٹیکسٹ ڈف — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'text-extractor' THEN 'ٹیکسٹ ایکسٹریکٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'uuid-generator' THEN 'UUID جنریٹر — مکمل گائیڈ 2026'
    WHEN bp.tool_slug = 'cv-builder' THEN 'CV بلڈر — مکمل گائیڈ 2026'
    ELSE bp.title || ' (UR)'
    END
  END,
  bp.slug,
  '<h2>📖 ' || REPLACE(bp.tool_name,' Calculator','') || ' کیا ہے؟</h2><p><strong>' || bp.tool_name || '</strong> ایک طاقتور مفت آن لائن ٹول ہے۔</p><h2>🌟 خصوصیات</h2><ul><li>🔒 100% پرائیویسی</li><li>⚡ فوری نتائج</li><li>📱 تمام ڈیوائسز</li><li>🆓 ہمیشہ مفت</li></ul>',
  bp.excerpt || 'مفت ٹول گائیڈ۔',
  bp.category, t.lang_code, 'published', bp.tool_slug, bp.tool_name,
  bp.seo_title || bp.title, bp.seo_description || bp.excerpt, bp.seo_keywords || bp.tool_slug,
  bp.parent_slug, datetime('now'), datetime('now')
FROM blog_posts bp
CROSS JOIN (SELECT 'ur' as lang_code UNION SELECT 'hi' UNION SELECT 'ar') t
WHERE bp.lang = 'en' AND bp.status = 'published'
AND NOT EXISTS (
  SELECT 1 FROM blog_posts bp2 
  WHERE bp2.slug = bp.slug AND bp2.lang = t.lang_code
)
LIMIT 200;
