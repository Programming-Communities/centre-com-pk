## ✅ **COMPLETE FUTURE ROADMAP FOR CALCULATORS & TOOLS**

---

## 📋 **FUTURE CALCULATORS - ADD KAR SAKTE HAIN (50+ Tools)**

### **Category 1: Financial Calculators (15 tools)**
| # | Tool Name | Description | Priority |
|---|-----------|-------------|----------|
| 1 | **Mortgage Calculator** | Calculate home loan payments with property tax & insurance | High |
| 2 | **SIP Calculator** | Systematic Investment Plan returns for mutual funds | High |
| 3 | **Retirement Calculator** | Plan retirement savings with inflation | Medium |
| 4 | **EMI Calculator** | Loan EMI with prepayment options | High |
| 5 | **Fixed Deposit Calculator** | FD maturity amount with interest | Medium |
| 6 | **RD Calculator** | Recurring Deposit returns | Medium |
| 7 | **GST Calculator** | Calculate Goods & Services Tax | High |
| 8 | **Income Tax Calculator** | Calculate annual tax liability | High |
| 9 | **Profit Margin Calculator** | Calculate profit percentage | Low |
| 10 | **Discount Calculator** | Calculate sale price after discount | Medium |
| 11 | **VAT Calculator** | Value Added Tax calculation | Medium |
| 12 | **Capital Gains Calculator** | Calculate tax on investment gains | Low |
| 13 | **Bond Yield Calculator** | Calculate bond returns | Low |
| 14 | **Dividend Calculator** | Calculate dividend income | Low |
| 15 | **Inflation Calculator** | Calculate purchasing power over time | Medium |

### **Category 2: Health & Fitness Calculators (12 tools)**
| # | Tool Name | Description | Priority |
|---|-----------|-------------|----------|
| 1 | **Calorie Calculator** | Daily calorie needs for weight management | High |
| 2 | **Body Fat Calculator** | Estimate body fat percentage | High |
| 3 | **Ideal Weight Calculator** | Calculate healthy weight range | Medium |
| 4 | **BMR Calculator** | Basal Metabolic Rate | High |
| 5 | **TDEE Calculator** | Total Daily Energy Expenditure | High |
| 6 | **Pregnancy Due Date** | Calculate expected delivery date | Medium |
| 7 | **Conception Date** | Calculate when baby was conceived | Low |
| 8 | **Heart Rate Zones** | Calculate training heart rate zones | Medium |
| 9 | **VO2 Max Calculator** | Estimate aerobic fitness | Low |
| 10 | **Water Intake Calculator** | Daily water needs based on activity | Medium |
| 11 | **Sleep Calculator** | Optimal bedtime based on wake time | Medium |
| 12 | **Macro Calculator** | Calculate protein, carbs, fats needs | High |

### **Category 3: Science & Engineering (10 tools)**
| # | Tool Name | Description | Priority |
|---|-----------|-------------|----------|
| 1 | **Scientific Calculator** | Advanced mathematical functions | High |
| 2 | **Fraction Calculator** | Simplify and calculate fractions | Medium |
| 3 | **Decimal to Fraction** | Convert decimal to fraction | Low |
| 4 | **Significant Figures** | Round numbers to sig figs | Low |
| 5 | **Quadratic Solver** | Solve quadratic equations | Medium |
| 6 | **Matrix Calculator** | Matrix operations | Low |
| 7 | **Statistics Calculator** | Mean, median, mode, standard deviation | Medium |
| 8 | **Permutation Calculator** | Calculate nPr | Low |
| 9 | **Combination Calculator** | Calculate nCr | Low |
| 10 | **Logarithm Calculator** | Calculate log values | Low |

### **Category 4: Time & Date Calculators (8 tools)**
| # | Tool Name | Description | Priority |
|---|-----------|-------------|----------|
| 1 | **Time Duration Calculator** | Calculate hours between times | High |
| 2 | **Age Calculator** | ✅ Already have | Complete |
| 3 | **Date Difference** | ✅ Already have | Complete |
| 4 | **Work Hours Calculator** | Calculate work hours with breaks | Medium |
| 5 | **Overtime Calculator** | Calculate overtime pay | Low |
| 6 | **Countdown Timer** | Days until specific date | Medium |
| 7 | **Time Zone Converter** | Convert between time zones | High |
| 8 | **Stopwatch** | Online stopwatch tool | Low |

### **Category 5: Cryptocurrency (6 tools)**
| # | Tool Name | Description | Priority |
|---|-----------|-------------|----------|
| 1 | **Crypto Converter** | Convert between cryptocurrencies | High |
| 2 | **Crypto Profit Calculator** | Calculate profit/loss on crypto trades | Medium |
| 3 | **Mining Calculator** | Calculate mining profitability | Low |
| 4 | **Staking Calculator** | Calculate staking rewards | Low |
| 5 | **DCA Calculator** | Dollar Cost Averaging returns | Medium |
| 6 | **Gas Fee Calculator** | Estimate Ethereum gas fees | Low |

### **Category 6: Salary & Business (6 tools)**
| # | Tool Name | Description | Priority |
|---|-----------|-------------|----------|
| 1 | **Salary Calculator** | Calculate hourly to annual salary | High |
| 2 | **Hourly to Salary** | Convert hourly wage to salary | Medium |
| 3 | **Bonus Calculator** | Calculate bonus percentage | Low |
| 4 | **Commission Calculator** | Calculate sales commission | Medium |
| 5 | **Pay Raise Calculator** | Calculate percentage increase | Low |
| 6 | **Freelance Rate** | Calculate hourly rate for freelancers | Medium |

### **Category 7: School & Education (8 tools)**
| # | Tool Name | Description | Priority |
|---|-----------|-------------|----------|
| 1 | **Grade Calculator** | Calculate final grade | High |
| 2 | **Test Score Calculator** | Calculate percentage score | Medium |
| 3 | **Attendance Calculator** | Calculate attendance percentage | Medium |
| 4 | **CGPA Calculator** | ✅ Already have | Complete |
| 5 | **GPA Calculator** | ✅ Already have | Complete |
| 6 | **College Cost Calculator** | Estimate college expenses | Low |
| 7 | **Student Loan Calculator** | Calculate student loan payments | Medium |
| 8 | **Scholarship Calculator** | Estimate scholarship eligibility | Low |

---

## 📁 **FILE TO CREATE: `future.cal.md`**

```markdown
# Future Calculator Template - Centers.pk

## 📋 How to Add a New Calculator Tool

### Step 1: Create Folder Structure
```
components/tools/calculators/{new-tool-slug}/
├── page.tsx           # Server component with metadata
└── tool.client.tsx    # Client component with logic
```

### Step 2: Create Page.tsx (Server Component)
```tsx
// components/tools/calculators/{new-tool-slug}/page.tsx
import type { Metadata } from "next";
import { getToolSEOData } from '@/lib/seo/toolSeoData';
import { ToolClient } from './tool.client';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const toolData = getToolSEOData('{new-tool-slug}');
  
  let title = toolData.title;
  let description = toolData.description;
  
  if (lang !== 'en') {
    try {
      const translations = await import(`@/translations/${lang}/tools/calculators.json`)
        .then(module => module.default)
        .catch(() => null);
      
      if (translations && translations.{new_tool_key}) {
        title = translations.{new_tool_key}.title || toolData.title;
        description = translations.{new_tool_key}.description || toolData.description;
      }
    } catch (e) {
      // Fallback to English
    }
  }
  
  return {
    title: `${title} | Centers.pk`,
    description: description,
    keywords: toolData.keywords,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: `https://centers.pk/${lang}/tools/calculators/{new-tool-slug}`,
      images: [{ url: "/og-images/{new-tool-slug}.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-images/{new-tool-slug}.png"],
    },
    alternates: {
      canonical: `https://centers.pk/${lang}/tools/calculators/{new-tool-slug}`,
      languages: {
        'en': 'https://centers.pk/en/tools/calculators/{new-tool-slug}',
        'ur': 'https://centers.pk/ur/tools/calculators/{new-tool-slug}',
        'hi': 'https://centers.pk/hi/tools/calculators/{new-tool-slug}',
        'ar': 'https://centers.pk/ar/tools/calculators/{new-tool-slug}',
      },
    },
  };
}

export default function {NewToolName}Page() {
  return <ToolClient />;
}
```

### Step 3: Create Tool Client (Tool.client.tsx)
```tsx
// components/tools/calculators/{new-tool-slug}/tool.client.tsx
"use client";

import { useState, useEffect } from "react";
import { Calculator, History, Copy, Download, Share2, CheckCircle, RefreshCw } from "lucide-react";
import { useTheme } from '@/components/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';
import CentralAd from '@/components/ads/CentralAd';

// Required Imports (Must include all):
// - useState, useEffect from react
// - useTheme from @/components/theme
// - useTranslation from @/hooks/useTranslation
// - useParams from next/navigation
// - CentralAd from @/components/ads/CentralAd

interface ToolResult {
  // Define your result interface
}

export function ToolClient() {
  const params = useParams();
  const currentLang = (params?.lang as string) || 'en';
  const { themeColors, fontFamily } = useTheme();
  const { t: tTools, loading: toolsLoading } = useTranslation({ namespace: 'tools', category: 'calculators' });
  const [mounted, setMounted] = useState(false);
  
  // Tool state variables
  const [result, setResult] = useState<ToolResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator');

  // Translation helper
  const t = (key: string, defaultValue?: string): string => {
    const toolKey = `{new_tool_key}.${key}`;
    const value = tTools(toolKey);
    return value === toolKey ? (defaultValue || key) : value;
  };

  // Load history from localStorage
  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem('{new-tool-slug}-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing history:', e);
      }
    }
  }, []);

  // Main calculation function
  const calculate = () => {
    // Your calculation logic here
    const newResult = { /* result data */ };
    setResult(newResult);
    
    // Save to history
    const historyEntry = {
      id: Date.now(),
      // ... history data
      timestamp: new Date().toISOString()
    };
    
    const newHistory = [historyEntry, ...history.slice(0, 9)];
    setHistory(newHistory);
    try {
      localStorage.setItem('{new-tool-slug}-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

  // Copy results to clipboard
  const copyResults = () => {
    if (!result) return;
    const text = `${t('result', 'Result')}: ${JSON.stringify(result)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export as text file
  const exportAsText = () => {
    if (!result) return;
    const text = `${t('export_header', '=== CALCULATION REPORT ===')}\n${t('date', 'Date')}: ${new Date().toLocaleDateString()}\n\n${t('result', 'Result')}: ${JSON.stringify(result)}\n\n${t('generated_by', '=== Generated by Centers.pk ===')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculation-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share results
  const shareResults = () => {
    if (!result) return;
    const shareText = `${t('share_text', 'Calculation result')}: ${JSON.stringify(result)}`;
    if (navigator.share) {
      navigator.share({
        title: t('share_title', 'Calculation Result'),
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert(t('copied_to_clipboard', 'Results copied to clipboard!'));
    }
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('{new-tool-slug}-history');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  };

  const isRTL = currentLang === 'ur' || currentLang === 'ar';
  const isLoading = !mounted || toolsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <div className="animate-pulse text-primary">{t('loading', 'Loading...')}</div>
      </div>
    );
  }

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen"
      style={{ backgroundColor: themeColors.background, color: themeColors.text.primary, fontFamily: fontFamily }}
    >
      {/* Top Banner Ad */}
      <CentralAd position="top" size="banner" />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="rounded-full p-3" style={{ backgroundColor: `${themeColors.primary}15` }}>
              <Calculator className="h-8 w-8" style={{ color: themeColors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeColors.text.primary }}>
            {t('title', '{Tool Title}')}
          </h1>
          <p className="text-lg" style={{ color: themeColors.text.secondary }}>
            {t('description', 'Tool description')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'calculator' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'calculator' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'calculator' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'calculator' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <Calculator className="h-4 w-4" />
            {t('tab_calculator', 'Calculator')}
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'history' ? '' : 'opacity-70 hover:opacity-100'}`}
            style={{
              backgroundColor: activeTab === 'history' ? themeColors.primary : themeColors.surface,
              color: activeTab === 'history' ? '#ffffff' : themeColors.text.secondary,
              border: activeTab === 'history' ? 'none' : `1px solid ${themeColors.border}`
            }}
          >
            <History className="h-4 w-4" />
            {t('tab_history', 'History')}
          </button>
        </div>

        {/* Main Content - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <CentralAd position="sidebar-left" size="skyscraper" />
            </div>
          </aside>
          
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            
            {/* Calculator Tab */}
            {activeTab === 'calculator' && (
              <div className="space-y-6">
                {/* Input Section */}
                <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                  <h2 className="text-xl font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                    {t('input', 'Input Values')}
                  </h2>
                  {/* Add your input fields here */}
                  
                  {/* Calculate Button */}
                  <button
                    onClick={calculate}
                    className="w-full mt-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                    style={{ backgroundColor: themeColors.primary, color: themeColors.text.accent }}
                  >
                    <Calculator className="h-5 w-5" />
                    {t('calculate', 'Calculate')}
                  </button>
                </div>

                {/* Results Section */}
                {result && (
                  <>
                    <div className="p-6 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                      <h2 className="text-xl font-semibold mb-4" style={{ color: themeColors.text.primary }}>
                        {t('result', 'Result')}
                      </h2>
                      {/* Display results here */}
                      
                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <button onClick={copyResults} className="py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 hover:opacity-80"
                          style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}>
                          {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copied ? t('copied', 'Copied!') : t('copy', 'Copy')}
                        </button>
                        <button onClick={exportAsText} className="py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 hover:opacity-80"
                          style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}>
                          <Download className="h-4 w-4" />
                          {t('export', 'Export')}
                        </button>
                        <button onClick={shareResults} className="py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 hover:opacity-80"
                          style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}`, color: themeColors.text.secondary }}>
                          <Share2 className="h-4 w-4" />
                          {t('share', 'Share')}
                        </button>
                      </div>
                    </div>

                    {/* In-content Ad */}
                    <CentralAd position="in-content" size="rectangle" />
                  </>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
                <div className="p-4 sm:p-6 border-b" style={{ borderColor: themeColors.border }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold" style={{ color: themeColors.text.primary }}>
                        {t('calculation_history', 'Calculation History')}
                      </h2>
                      <p className="text-sm opacity-80" style={{ color: themeColors.text.secondary }}>
                        {t('recent_calculations', 'Your recent calculations')}
                      </p>
                    </div>
                    {history.length > 0 && (
                      <button onClick={clearHistory} className="px-4 py-2 border rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                        style={{ borderColor: themeColors.error, color: themeColors.error }}>
                        {t('clear_history', 'Clear History')}
                      </button>
                    )}
                  </div>
                </div>
                {/* History list here */}
              </div>
            )}
          </div>
          
          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <CentralAd position="sidebar-right" size="skyscraper" />
            </div>
          </aside>
        </div>
        
        {/* Bottom Ad */}
        <div className="mt-8">
          <CentralAd position="bottom" size="banner" />
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Add Translations (4 Languages)
```json
// Add to translations/en/tools/calculators.json
{
  "{new_tool_key}": {
    "title": "Tool Title",
    "description": "Tool description",
    "loading": "Loading...",
    "tab_calculator": "Calculator",
    "tab_history": "History",
    "input": "Input Values",
    "calculate": "Calculate",
    "result": "Result",
    "copy": "Copy",
    "copied": "Copied!",
    "export": "Export",
    "share": "Share",
    "calculation_history": "Calculation History",
    "recent_calculations": "Your recent calculations",
    "clear_history": "Clear History",
    "no_history": "No calculation history yet",
    "history_will_appear": "Your calculations will appear here",
    "export_header": "=== CALCULATION REPORT ===",
    "date": "Date",
    "generated_by": "=== Generated by Centers.pk ===",
    "share_text": "Calculation result",
    "share_title": "Calculation Result",
    "copied_to_clipboard": "Results copied to clipboard!"
  }
}
```

### Step 5: Add SEO Data
```typescript
// Add to lib/seo/toolSeoData.ts
'{new-tool-slug}': {
  title: 'Tool Title | Centers.pk',
  description: 'Tool description for SEO',
  category: 'calculators',
  slug: '{new-tool-slug}',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  faqs: [
    {
      question: 'FAQ question 1?',
      answer: 'FAQ answer 1'
    }
  ]
}
```

### Step 6: Register in Tool Map
```typescript
// Update app/[lang]/tools/[category]/[tool]/page.tsx
// Add import
import {NewToolName} from '@/components/tools/calculators/{new-tool-slug}/tool.client';

// Add to toolComponentMap
const toolComponentMap = {
  // ... existing tools
  '{new-tool-slug}': NewToolName,
}
```

### Step 7: Update Category Page
```typescript
// Update app/[lang]/tools/calculators/page.client.tsx
// Add new tool to getCalculatorTools() array
{
  slug: "{new-tool-slug}",
  name: t('{new_tool_key}.name', 'Tool Name'),
  description: t('{new_tool_key}.description', 'Tool description'),
  icon: Calculator,
  category: "finance", // or appropriate category
  features: [
    t('{new_tool_key}.features.0', 'Feature 1'),
    t('{new_tool_key}.features.1', 'Feature 2'),
    t('{new_tool_key}.features.2', 'Feature 3'),
    t('{new_tool_key}.features.3', 'Feature 4')
  ],
  popular: true/false,
  new: true/false
}
```

### Required Imports Checklist:
- [ ] `"use client"` directive
- [ ] `import { useState, useEffect } from "react"`
- [ ] `import { useTheme } from '@/components/theme'`
- [ ] `import { useTranslation } from '@/hooks/useTranslation'`
- [ ] `import { useParams } from 'next/navigation'`
- [ ] `import CentralAd from '@/components/ads/CentralAd'`
- [ ] Required Icons from `lucide-react`

### Required Features Checklist:
- [ ] Multi-language support (`useTranslation`)
- [ ] RTL support (`dir` attribute)
- [ ] Theme integration (`useTheme`)
- [ ] Central Ads (top, sidebar-left, sidebar-right, in-content, bottom)
- [ ] History with localStorage
- [ ] Copy results to clipboard
- [ ] Export as text file
- [ ] Share results
- [ ] Loading states
- [ ] Responsive design (mobile-first)
- [ ] Tabs (Calculator / History)
- [ ] Clear history button
- [ ] SEO metadata
```

---

## 📁 **COMPLETE PROJECT TREE FOR REFERENCE**

```
centers.pk/
├── app/
│   ├── [lang]/
│   │   ├── tools/
│   │   │   ├── calculators/
│   │   │   │   ├── [tool-slug]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── tool.client.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── page.client.tsx
│   │   │   ├── code-tools/
│   │   │   ├── image-tools/
│   │   │   ├── pdf-tools/
│   │   │   ├── security-tools/
│   │   │   ├── text-tools/
│   │   │   └── design-tools/
│   │   └── layout.tsx
│   └── layout.tsx
│
├── components/
│   ├── ads/
│   │   ├── CentralAd.tsx
│   │   └── adConfig.ts
│   ├── theme/
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx
│   │   └── index.ts
│   ├── tools/
│   │   ├── calculators/
│   │   │   ├── age-calculator/
│   │   │   ├── bmi-calculator/
│   │   │   ├── compound-interest/
│   │   │   ├── currency-converter/
│   │   │   ├── date-calculator/
│   │   │   ├── gpa-calculator/
│   │   │   ├── loan-calculator/
│   │   │   ├── percentage-calculator/
│   │   │   ├── tip-calculator/
│   │   │   └── unit-converter/
│   │   └── MasterToolTemplate.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
│
├── hooks/
│   └── useTranslation.ts
│
├── lib/
│   ├── ads/
│   │   └── adConfig.ts
│   └── seo/
│       └── toolSeoData.ts
│
├── translations/
│   ├── en/
│   │   └── tools/
│   │       └── calculators.json
│   ├── ur/
│   │   └── tools/
│   │       └── calculators.json
│   ├── hi/
│   │   └── tools/
│   │       └── calculators.json
│   └── ar/
│       └── tools/
│           └── calculators.json
│
├── tailwind.config.js  # 20+ breakpoints configured
├── next.config.js      # Edge Runtime configured
└── package.json
```

---

## 🎯 **QUICK ADD NEW TOOL - SUMMARY**

| Step | File to Update | What to Do |
|------|----------------|-------------|
| 1 | Create folder | `components/tools/calculators/{slug}/` |
| 2 | Create `page.tsx` | Copy from template, change slug |
| 3 | Create `tool.client.tsx` | Copy from template, add logic |
| 4 | Update translations | Add to all 4 language JSON files |
| 5 | Update `toolSeoData.ts` | Add SEO data for new tool |
| 6 | Update `page.client.tsx` | Add tool to category page grid |
| 7 | Update tool map | Add to `[tool]/page.tsx` component map |

---

## ✅ **READY TO USE!**

**Jab bhi new tool add karna ho, bas `future.cal.md` file ka template use karo!** 🚀