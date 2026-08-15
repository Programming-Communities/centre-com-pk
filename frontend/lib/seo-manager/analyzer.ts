// SEO Content Analyzer — Professional Grade

export interface SEOScore {
  score: number;
  grade: string;
  titleLength: number;
  metaLength: number;
  h1Count: number;
  imgAltMissing: number;
  internalLinks: number;
  wordCount: number;
  issues: string[];
  suggestions: string[];
}

export function analyzeSEO(
  title: string,
  description: string,
  content: string,
  keywords: string[],
  internalLinks: number,
  images: { alt: string }[]
): SEOScore {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Title analysis
  const titleLen = title.length;
  if (titleLen < 30) { score -= 10; issues.push('Title too short (<30 chars)'); suggestions.push('Add more descriptive words to title'); }
  else if (titleLen > 60) { score -= 5; issues.push('Title too long (>60 chars)'); suggestions.push('Shorten title to under 60 characters'); }
  else { score += 5; }

  // Keyword in title
  const keywordInTitle = keywords.some(k => title.toLowerCase().includes(k.toLowerCase()));
  if (!keywordInTitle) { score -= 15; issues.push('Primary keyword missing in title'); suggestions.push('Add primary keyword at beginning of title'); }
  else { score += 10; }

  // Meta description
  const metaLen = description.length;
  if (metaLen < 120) { score -= 8; issues.push('Meta description too short (<120 chars)'); }
  else if (metaLen > 160) { score -= 3; issues.push('Meta description too long (>160 chars)'); }
  else { score += 5; }

  const keywordInMeta = keywords.some(k => description.toLowerCase().includes(k.toLowerCase()));
  if (!keywordInMeta) { score -= 10; issues.push('Keyword missing in meta description'); }

  // Content word count
  if (content.length < 300) { score -= 20; issues.push('Content too thin (<300 words)'); suggestions.push('Add at least 500-800 words of detailed content'); }
  else if (content.length < 800) { score -= 5; issues.push('Content could be longer'); suggestions.push('Target 1000+ words for better ranking'); }
  else { score += 10; }

  // Keyword density
  const wordCount = content.split(/\s+/).length;
  let keywordCount = 0;
  keywords.forEach(k => {
    const regex = new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = content.match(regex);
    if (matches) keywordCount += matches.length;
  });
  const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;
  if (density < 1) { score -= 5; issues.push('Keyword density too low (<1%)'); }
  else if (density > 3) { score -= 5; issues.push('Keyword density too high (>3%) — possible keyword stuffing'); }
  else { score += 5; }

  // H1 count
  const h1Count = (content.match(/<h1[^>]*>/gi) || []).length;
  if (h1Count === 0) { score -= 10; issues.push('No H1 tag found'); suggestions.push('Add exactly one H1 tag'); }
  else if (h1Count > 1) { score -= 5; issues.push('Multiple H1 tags found'); }

  // Image alt tags
  const imgAltMissing = images.filter(img => !img.alt).length;
  if (imgAltMissing > 0) { score -= imgAltMissing * 3; issues.push(`${imgAltMissing} images missing alt text`); }

  // Internal links
  if (internalLinks < 2) { score -= 8; issues.push('Too few internal links'); suggestions.push('Add 3-5 internal links to related tools'); }
  else if (internalLinks >= 5) { score += 5; }

  // Grade calculation
  let grade = 'F';
  if (score >= 90) grade = 'A+';
  else if (score >= 80) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 60) grade = 'C';
  else if (score >= 50) grade = 'D';
  else grade = 'F';

  return {
    score: Math.max(0, Math.min(100, score)),
    grade,
    titleLength: titleLen,
    metaLength: metaLen,
    h1Count,
    imgAltMissing,
    internalLinks,
    wordCount,
    issues,
    suggestions
  };
}

// LSI Keyword Generator
export function generateLSIKeywords(primaryKeyword: string): string[] {
  const lsiMap: Record<string, string[]> = {
    'calculator': ['calculate', 'computation', 'math', 'numbers', 'result', 'formula', 'convert', 'measure', 'estimate', 'arithmetic'],
    'converter': ['convert', 'transformation', 'change', 'switch', 'exchange', 'translate', 'modify', 'adapt', 'turn', 'alter'],
    'generator': ['generate', 'create', 'produce', 'build', 'make', 'construct', 'develop', 'form', 'craft', 'design'],
    'checker': ['check', 'verify', 'validate', 'test', 'inspect', 'examine', 'review', 'audit', 'scan', 'analyze'],
    'editor': ['edit', 'modify', 'change', 'update', 'revise', 'correct', 'adjust', 'refine', 'polish', 'improve'],
    'compressor': ['compress', 'reduce', 'shrink', 'minimize', 'compact', 'squeeze', 'condense', 'decrease', 'lower', 'optimize'],
    'formatter': ['format', 'arrange', 'organize', 'structure', 'style', 'layout', 'design', 'configure', 'set', 'align'],
    'encoder': ['encode', 'encrypt', 'cipher', 'code', 'transform', 'convert', 'translate', 'secure', 'protect', 'hide'],
    'merger': ['merge', 'combine', 'join', 'unite', 'blend', 'fuse', 'integrate', 'mix', 'consolidate', 'connect'],
    'splitter': ['split', 'divide', 'separate', 'break', 'cut', 'partition', 'segment', 'detach', 'fragment', 'disconnect'],
    'remover': ['remove', 'delete', 'erase', 'clear', 'eliminate', 'strip', 'extract', 'purge', 'wipe', 'clean'],
    'resizer': ['resize', 'scale', 'adjust', 'modify', 'change', 'transform', 'reshape', 'reformat', 'alter', 'adapt'],
    'cropper': ['crop', 'cut', 'trim', 'clip', 'slice', 'snip', 'shear', 'prune', 'shave', 'carve'],
    'counter': ['count', 'calculate', 'tally', 'total', 'sum', 'compute', 'measure', 'quantify', 'enumerate', 'add'],
    'picker': ['pick', 'select', 'choose', 'decide', 'opt', 'prefer', 'elect', 'determine', 'identify', 'designate'],
    'tester': ['test', 'check', 'verify', 'validate', 'try', 'probe', 'examine', 'assess', 'evaluate', 'inspect'],
    'analyzer': ['analyze', 'examine', 'study', 'review', 'inspect', 'evaluate', 'assess', 'scan', 'probe', 'investigate'],
    'builder': ['build', 'create', 'construct', 'make', 'develop', 'assemble', 'form', 'produce', 'craft', 'establish'],
  };

  const primaryLower = primaryKeyword.toLowerCase();
  let lsiKeywords: string[] = [];

  for (const [key, words] of Object.entries(lsiMap)) {
    if (primaryLower.includes(key)) {
      lsiKeywords = [...lsiKeywords, ...words];
    }
  }

  if (lsiKeywords.length === 0) {
    lsiKeywords = ['free', 'online', 'tool', 'best', 'easy', 'fast', 'simple', 'quick', 'accurate', 'professional'];
  }

  return [...new Set(lsiKeywords)].slice(0, 15);
}

// Competitor Gap Analysis
export function analyzeCompetitorGap(
  ourKeywords: string[],
  competitorKeywords: string[]
): { missing: string[]; common: string[]; unique: string[] } {
  const our = new Set(ourKeywords.map(k => k.toLowerCase()));
  const comp = new Set(competitorKeywords.map(k => k.toLowerCase()));

  const missing = [...comp].filter(k => !our.has(k));
  const common = [...our].filter(k => comp.has(k));
  const unique = [...our].filter(k => !comp.has(k));

  return { missing, common, unique };
}

// Auto Meta Generator
export function generateMetaTags(
  toolName: string,
  category: string,
  lang: string
): { title: string; description: string; keywords: string } {
  const templates: Record<string, Record<string, { title: string; desc: string }>> = {
    en: {
      calculators: { title: `${toolName} - Free Online Calculator | Centre.com.pk`, desc: `Free ${toolName.toLowerCase()}. Calculate instantly with our online tool. No registration required. Accurate results for all your calculation needs.` },
      'code-tools': { title: `${toolName} - Free Online Code Tool | Centre.com.pk`, desc: `Free ${toolName.toLowerCase()}. Format, encode, and process your code instantly online. No download needed.` },
      'image-tools': { title: `${toolName} - Free Online Image Tool | Centre.com.pk`, desc: `Free ${toolName.toLowerCase()}. Edit your images online without uploading. Fast, secure, and 100% private.` },
      'pdf-tools': { title: `${toolName} - Free Online PDF Tool | Centre.com.pk`, desc: `Free ${toolName.toLowerCase()}. Process PDF files online instantly. No registration, no watermarks.` },
      'security-tools': { title: `${toolName} - Free Online Security Tool | Centre.com.pk`, desc: `Free ${toolName.toLowerCase()}. Secure your data with our online security tool. Fast and reliable.` },
      'text-tools': { title: `${toolName} - Free Online Text Tool | Centre.com.pk`, desc: `Free ${toolName.toLowerCase()}. Process text instantly with our online tool. Easy to use.` },
      'design-tools': { title: `${toolName} - Free Online Design Tool | Centre.com.pk`, desc: `Free ${toolName.toLowerCase()}. Create and design online. No software needed.` },
    },
    ur: {
      calculators: { title: `${toolName} - مفت آن لائن کیلکولیٹر | Centre.com.pk`, desc: `${toolName} مفت۔ آن لائن حساب کریں۔ کوئی رجسٹریشن نہیں۔ درست نتائج۔` },
    },
    hi: {
      calculators: { title: `${toolName} - मुफ्त ऑनलाइन कैलकुलेटर | Centre.com.pk`, desc: `${toolName} मुफ्त। तुरंत ऑनलाइन गणना करें। कोई पंजीकरण नहीं।` },
    },
    ar: {
      calculators: { title: `${toolName} - آلة حاسبة مجانية | Centre.com.pk`, desc: `${toolName} مجاني. احسب فوراً عبر الإنترنت. لا حاجة للتسجيل.` },
    },
  };

  const langTemplates = templates[lang] || templates.en;
  const catTemplate = langTemplates[category] || langTemplates.calculators;

  const title = catTemplate?.title || `${toolName} - Centre.com.pk`;
  const description = catTemplate?.desc || `Free ${toolName}. Use our online tool at Centre.com.pk.`;
  const keywords = `${toolName}, free, online, ${category}, Centre.com.pk, tool`;

  return { title, description, keywords };
}

// Internal Link Suggester
export function suggestInternalLinks(
  currentTool: string,
  allTools: { slug: string; category: string; name: string }[]
): { slug: string; anchor: string; type: string }[] {
  const currentCat = allTools.find(t => t.slug === currentTool)?.category;
  const related = allTools
    .filter(t => t.slug !== currentTool && t.category === currentCat)
    .slice(0, 3)
    .map(t => ({ slug: t.slug, anchor: t.name, type: 'related' }));

  const popular = allTools
    .filter(t => t.slug !== currentTool && t.category !== currentCat)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)
    .map(t => ({ slug: t.slug, anchor: t.name, type: 'popular' }));

  return [...related, ...popular];
}
