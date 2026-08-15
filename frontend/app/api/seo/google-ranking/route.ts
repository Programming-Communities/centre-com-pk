export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { TOOL_SEO_DATA } from '@/lib/seo/toolSeoData';

const SUPPORTED_LANGUAGES = ['en', 'ur', 'hi', 'ar'];

async function getTranslation(lang: string, key: string, defaultValue: string): Promise<string> {
  if (lang === 'en') return defaultValue;
  
  try {
    const translations = await import(`@/translations/${lang}/common.json`)
      .then(module => module.default)
      .catch(() => null);
    
    if (translations && translations[key]) {
      return translations[key];
    }
  } catch (e) {}
  
  return defaultValue;
}

function getTranslatedCompetitor(competitor: string, lang: string): string {
  const translations: Record<string, Record<string, string>> = {
    ur: { 'SmallPDF': 'سمال پی ڈی ایف', 'ILovePDF': 'آئی لوو پی ڈی ایف', 'OnlineConvert': 'آن لائن کنورٹ', 'Calculator.net': 'کیلکولیٹر ڈاٹ نیٹ', 'RapidTables': 'ریپڈ ٹیبلز' },
    hi: { 'SmallPDF': 'स्मॉल पीडीएफ', 'ILovePDF': 'आई लव पीडीएफ', 'OnlineConvert': 'ऑनलाइन कन्वर्ट', 'Calculator.net': 'कैलकुलेटर.नेट', 'RapidTables': 'रैपिड टेबल्स' },
    ar: { 'SmallPDF': 'سمول بي دي إف', 'ILovePDF': 'آي لوف بي دي إف', 'OnlineConvert': 'أونلاين كونفيرت', 'Calculator.net': 'كالكوليتور.نت', 'RapidTables': 'رابيد تيبلز' }
  };
  
  if (lang !== 'en' && translations[lang] && translations[lang][competitor]) {
    return translations[lang][competitor];
  }
  return competitor;
}

function getTranslatedOpportunity(opportunity: string, lang: string): string {
  const translations: Record<string, Record<string, string>> = {
    ur: { 'Add FAQ section': 'FAQ سیکشن شامل کریں', 'Create comparison content': 'موازنہ کا مواد بنائیں', 'Improve page speed': 'پیج کی رفتار بہتر کریں', 'Add video tutorial': 'ویڈیو ٹیوٹوریل شامل کریں', 'Generate more backlinks': 'مزید بیک لنکس بنائیں' },
    hi: { 'Add FAQ section': 'FAQ सेक्शन जोड़ें', 'Create comparison content': 'तुलना सामग्री बनाएं', 'Improve page speed': 'पेज की गति सुधारें', 'Add video tutorial': 'वीडियो ट्यूटोरियल जोड़ें', 'Generate more backlinks': 'अधिक बैकलिंक बनाएं' },
    ar: { 'Add FAQ section': 'إضافة قسم الأسئلة الشائعة', 'Create comparison content': 'إنشاء محتوى مقارنة', 'Improve page speed': 'تحسين سرعة الصفحة', 'Add video tutorial': 'إضافة فيديو تعليمي', 'Generate more backlinks': 'إنشاء المزيد من الروابط الخلفية' }
  };
  
  if (lang !== 'en' && translations[lang] && translations[lang][opportunity]) {
    return translations[lang][opportunity];
  }
  return opportunity;
}

function getTranslatedKeyword(keyword: string, lang: string): string {
  const translations: Record<string, Record<string, string>> = {
    ur: { 'age calculator': 'عمر کیلکولیٹر', 'birthday calculator': 'سالگرہ کیلکولیٹر', 'date calculator': 'تاریخ کیلکولیٹر', 'age in days': 'عمر دنوں میں', 'age calculator online': 'آن لائن عمر کیلکولیٹر', 'how old am i': 'میری عمر کتنی ہے', 'bmi calculator': 'بی ایم آئی کیلکولیٹر', 'loan calculator': 'قرض کیلکولیٹر', 'currency converter': 'کرنسی کنورٹر', 'percentage calculator': 'فیصد کیلکولیٹر', 'tip calculator': 'ٹپ کیلکولیٹر', 'compound interest': 'مرکب سود', 'gpa calculator': 'جی پی اے کیلکولیٹر', 'unit converter': 'یونٹ کنورٹر' },
    hi: { 'age calculator': 'आयु कैलकुलेटर', 'birthday calculator': 'जन्मदिन कैलकुलेटर', 'date calculator': 'तारीख कैलकुलेटर', 'age in days': 'दिनों में आयु', 'age calculator online': 'ऑनलाइन आयु कैलकुलेटर', 'how old am i': 'मैं कितना बड़ा हूँ', 'bmi calculator': 'बीएमआई कैलकुलेटर', 'loan calculator': 'ऋण कैलकुलेटर', 'currency converter': 'मुद्रा परिवर्तक', 'percentage calculator': 'प्रतिशत कैलकुलेटर', 'tip calculator': 'टिप कैलकुलेटर', 'compound interest': 'चक्रवृद्धि ब्याज', 'gpa calculator': 'जीपीए कैलकुलेटर', 'unit converter': 'यूनिट कन्वर्टर' },
    ar: { 'age calculator': 'حاسبة العمر', 'birthday calculator': 'حاسبة عيد الميلاد', 'date calculator': 'حاسبة التاريخ', 'age in days': 'العمر بالأيام', 'age calculator online': 'حاسبة العمر أونلاين', 'how old am i': 'كم عمري', 'bmi calculator': 'حاسبة BMI', 'loan calculator': 'حاسبة القرض', 'currency converter': 'محول العملات', 'percentage calculator': 'حاسبة النسبة المئوية', 'tip calculator': 'حاسبة البقشيش', 'compound interest': 'الفائدة المركبة', 'gpa calculator': 'حاسبة المعدل', 'unit converter': 'محول الوحدات' }
  };
  
  const lowerKeyword = keyword.toLowerCase();
  if (lang !== 'en' && translations[lang] && translations[lang][lowerKeyword]) {
    return translations[lang][lowerKeyword];
  }
  return keyword;
}

function getTranslatedImprovement(improvement: string, lang: string): string {
  if (lang === 'en') return improvement;
  
  const translations: Record<string, Record<string, string>> = {
    ur: { 'Add 1 more FAQs': '1 مزید FAQ شامل کریں', 'Add 2 more FAQs': '2 مزید FAQs شامل کریں', 'Add 3 more FAQs': '3 مزید FAQs شامل کریں', 'Add 4 more FAQs': '4 مزید FAQs شامل کریں', 'Add 5 more FAQs': '5 مزید FAQs شامل کریں', 'Add more FAQs': 'مزید FAQs شامل کریں', 'Add "free online" to description': 'وضاحت میں "مفت آن لائن" شامل کریں', 'Add more internal links': 'مزید اندرونی لنکس شامل کریں', 'Create "vs paid tools" comparison': '"ادائیگی والے ٹولز بمقابلہ" موازنہ بنائیں', 'Add user testimonials section': 'صارفین کے تجربات کا سیکشن شامل کریں' },
    hi: { 'Add 1 more FAQs': '1 और FAQ जोड़ें', 'Add 2 more FAQs': '2 और FAQs जोड़ें', 'Add 3 more FAQs': '3 और FAQs जोड़ें', 'Add 4 more FAQs': '4 और FAQs जोड़ें', 'Add 5 more FAQs': '5 और FAQs जोड़ें', 'Add more FAQs': 'और FAQs जोड़ें', 'Add "free online" to description': 'विवरण में "मुफ्त ऑनलाइन" जोड़ें', 'Add more internal links': 'अधिक आंतरिक लिंक जोड़ें', 'Create "vs paid tools" comparison': '"भुगतान वाले टूल्स बनाम" तुलना बनाएं', 'Add user testimonials section': 'उपयोगकर्ता प्रशंसापत्र अनुभाग जोड़ें' },
    ar: { 'Add 1 more FAQs': 'إضافة 1 المزيد من الأسئلة الشائعة', 'Add 2 more FAQs': 'إضافة 2 المزيد من الأسئلة الشائعة', 'Add 3 more FAQs': 'إضافة 3 المزيد من الأسئلة الشائعة', 'Add 4 more FAQs': 'إضافة 4 المزيد من الأسئلة الشائعة', 'Add 5 more FAQs': 'إضافة 5 المزيد من الأسئلة الشائعة', 'Add more FAQs': 'إضافة المزيد من الأسئلة الشائعة', 'Add "free online" to description': 'أضف "مجاني عبر الإنترنت" إلى الوصف', 'Add more internal links': 'إضافة المزيد من الروابط الداخلية', 'Create "vs paid tools" comparison': 'إنشاء مقارنة "مقابل الأدوات المدفوعة"', 'Add user testimonials section': 'إضافة قسم شهادات المستخدمين' }
  };
  
  if (translations[lang] && translations[lang][improvement]) {
    return translations[lang][improvement];
  }
  
  const match = improvement.match(/Add (\d+) more FAQs/);
  if (match && translations[lang]) {
    const count = match[1];
    const key = `Add ${count} more FAQs`;
    if (translations[lang][key]) {
      return translations[lang][key];
    }
    return `${count} مزید FAQs شامل کریں`;
  }
  
  return improvement;
}

async function getTranslatedToolName(toolSlug: string, category: string, lang: string, defaultTitle: string): Promise<string> {
  if (lang === 'en') return defaultTitle;
  
  try {
    const translations = await import(`@/translations/${lang}/tools/${category}.json`)
      .then(module => module.default)
      .catch(() => null);
    
    if (translations) {
      if (translations.highlight_title && translations.title) {
        return `${translations.title} ${translations.highlight_title}`;
      } else if (translations.badge) {
        return translations.badge;
      } else if (translations.title) {
        return translations.title;
      }
    }
  } catch (e) {}
  
  return defaultTitle;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const toolSlug = searchParams.get('tool');
  const lang = searchParams.get('lang') || 'en';
  
  if (!toolSlug) {
    return NextResponse.json(
      { error: 'Tool slug required' },
      { status: 400 }
    );
  }
  
  const toolData = TOOL_SEO_DATA[toolSlug as keyof typeof TOOL_SEO_DATA];
  if (!toolData) {
    return NextResponse.json(
      { error: 'Tool not found' },
      { status: 404 }
    );
  }
  
  const translatedToolName = await getTranslatedToolName(toolSlug, toolData.category, lang, toolData.title);
  
  const seoScoreLabel = await getTranslation(lang, 'seo_score', 'SEO Score');
  const excellentLabel = await getTranslation(lang, 'excellent', 'Excellent');
  const goodLabel = await getTranslation(lang, 'good', 'Good');
  const needsImprovementLabel = await getTranslation(lang, 'needs_improvement', 'Needs Improvement');
  const keywordsTrackedLabel = await getTranslation(lang, 'keywords_tracked', 'Keywords Tracked');
  const onFirstPageLabel = await getTranslation(lang, 'on_first_page', 'on first page');
  const estimatedTrafficLabel = await getTranslation(lang, 'estimated_traffic', 'Estimated Traffic');
  const visitorsPerMonthLabel = await getTranslation(lang, 'visitors_per_month', 'visitors/month');
  const keywordPositionsLabel = await getTranslation(lang, 'keyword_positions', 'Keyword Positions');
  const keywordLabel = await getTranslation(lang, 'keyword', 'Keyword');
  const positionLabel = await getTranslation(lang, 'position', 'Position');
  const difficultyLabel = await getTranslation(lang, 'difficulty', 'Difficulty');
  const topCompetitorLabel = await getTranslation(lang, 'top_competitor', 'Top Competitor');
  const actionNeededLabel = await getTranslation(lang, 'action_needed', 'Action Needed');
  const improvementSuggestionsLabel = await getTranslation(lang, 'improvement_suggestions', 'Improvement Suggestions');
  const seoAnalysisTitle = await getTranslation(lang, 'seo_analysis_title', 'Google Ranking Analysis for');
  
  const serpData = {
    tool: translatedToolName,
    originalTool: toolData.title,
    lang,
    labels: {
      seoScore: seoScoreLabel,
      excellent: excellentLabel,
      good: goodLabel,
      needsImprovement: needsImprovementLabel,
      keywordsTracked: keywordsTrackedLabel,
      onFirstPage: onFirstPageLabel,
      estimatedTraffic: estimatedTrafficLabel,
      visitorsPerMonth: visitorsPerMonthLabel,
      keywordPositions: keywordPositionsLabel,
      keyword: keywordLabel,
      position: positionLabel,
      difficulty: difficultyLabel,
      topCompetitor: topCompetitorLabel,
      actionNeeded: actionNeededLabel,
      improvementSuggestions: improvementSuggestionsLabel,
      seoAnalysisTitle: seoAnalysisTitle
    },
    keywords: toolData.keywords,
    positions: toolData.keywords.map((keyword: string, index: number) => {
      const position = Math.floor(Math.random() * 20) + 1;
      const competitor = getTopCompetitor(keyword);
      const difficulty = calculateKeywordDifficulty(keyword);
      const opportunity = findRankingOpportunity(keyword);
      
      return {
        key: `keyword-${index}`,
        keyword: getTranslatedKeyword(keyword, lang),
        originalKeyword: keyword,
        position,
        difficulty,
        competitor: getTranslatedCompetitor(competitor, lang),
        originalCompetitor: competitor,
        opportunity: getTranslatedOpportunity(opportunity, lang),
        originalOpportunity: opportunity
      };
    }),
    overallScore: calculateOverallSEOScore(toolData),
    improvements: generateRankingImprovements(toolData).map(imp => getTranslatedImprovement(imp, lang))
  };
  
  return NextResponse.json(serpData, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'X-Edge-Runtime': 'true',
    },
  });
}

function getTopCompetitor(keyword: string): string {
  const competitors = ['SmallPDF', 'ILovePDF', 'OnlineConvert', 'Calculator.net', 'RapidTables'];
  return competitors[Math.floor(Math.random() * competitors.length)];
}

function calculateKeywordDifficulty(keyword: string): number {
  return Math.floor(Math.random() * 100);
}

function findRankingOpportunity(keyword: string): string {
  const opportunities = [
    'Add FAQ section',
    'Create comparison content',
    'Improve page speed',
    'Add video tutorial',
    'Generate more backlinks'
  ];
  return opportunities[Math.floor(Math.random() * opportunities.length)];
}

function calculateOverallSEOScore(toolData: any): number {
  let score = 50;
  if (toolData.faqs?.length >= 3) score += 20;
  if (toolData.keywords?.length >= 10) score += 20;
  if (toolData.schemaType) score += 10;
  return Math.min(score, 100);
}

function generateRankingImprovements(toolData: any): string[] {
  const improvements = [];
  
  if (toolData.faqs?.length < 5) {
    improvements.push(`Add ${5 - toolData.faqs.length} more FAQs`);
  }
  
  if (!toolData.description?.includes('free online')) {
    improvements.push('Add "free online" to description');
  }
  
  if (toolData.relatedTools?.length < 5) {
    improvements.push('Add more internal links');
  }
  
  improvements.push('Create "vs paid tools" comparison');
  improvements.push('Add user testimonials section');
  
  return improvements;
}
