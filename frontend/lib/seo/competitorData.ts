// lib/seo/competitorData.ts

export interface CompetitorFeature {
  free: boolean | 'limited';
  noRegistration: boolean;
  privacy: boolean;
  multiLanguage: boolean;
  rtlSupport: boolean;
  pageSpeed: number;
}

export interface Competitor {
  name: string;
  url: string;
  features: CompetitorFeature;
}

export interface KeywordData {
  keyword: string;
  position: number;
  difficulty: number;
  topCompetitor: string;
  actionNeeded: string;
}

export interface ToolCompetitorData {
  toolSlug: string;
  seoScore: number;
  keywordsTracked: number;
  keywordsOnFirstPage: number;
  estimatedTraffic: number;
  keywords: KeywordData[];
  improvementSuggestions: string[];
  competitors: Competitor[];
}

// Dynamic data per tool
export const toolsCompetitorData: Record<string, ToolCompetitorData> = {
  // ========== CALCULATORS ==========
  
  'age-calculator': {
    toolSlug: 'age-calculator',
    seoScore: 80,
    keywordsTracked: 6,
    keywordsOnFirstPage: 3,
    estimatedTraffic: 1416,
    keywords: [
      {
        keyword: 'age calculator',
        position: 13,
        difficulty: 75,
        topCompetitor: 'ILovePDF',
        actionNeeded: 'Add FAQ section'
      },
      {
        keyword: 'birthday calculator',
        position: 1,
        difficulty: 69,
        topCompetitor: 'OnlineConvert',
        actionNeeded: 'Add video tutorial'
      },
      {
        keyword: 'date calculator',
        position: 6,
        difficulty: 15,
        topCompetitor: 'ILovePDF',
        actionNeeded: 'Create comparison content'
      },
      {
        keyword: 'age in days',
        position: 4,
        difficulty: 80,
        topCompetitor: 'SmallPDF',
        actionNeeded: 'Improve page speed'
      },
      {
        keyword: 'age calculator online',
        position: 11,
        difficulty: 84,
        topCompetitor: 'ILovePDF',
        actionNeeded: 'Improve page speed'
      },
      {
        keyword: 'how old am i',
        position: 16,
        difficulty: 27,
        topCompetitor: 'RapidTables',
        actionNeeded: 'Improve page speed'
      }
    ],
    improvementSuggestions: [
      'Add 2 more FAQs',
      'Add "free online" to description',
      'Add more internal links',
      'Create "vs paid tools" comparison',
      'Add user testimonials section'
    ],
    competitors: [
      {
        name: 'Calculator.net',
        url: 'https://calculator.net',
        features: {
          free: 'limited',
          noRegistration: false,
          privacy: false,
          multiLanguage: false,
          rtlSupport: false,
          pageSpeed: 68
        }
      },
      {
        name: 'Omnicalculator.com',
        url: 'https://omnicalculator.com',
        features: {
          free: false,
          noRegistration: true,
          privacy: false,
          multiLanguage: false,
          rtlSupport: false,
          pageSpeed: 72
        }
      },
      {
        name: 'Timeanddate.com',
        url: 'https://timeanddate.com',
        features: {
          free: true,
          noRegistration: true,
          privacy: true,
          multiLanguage: false,
          rtlSupport: false,
          pageSpeed: 70
        }
      }
    ]
  },
  
  'bmi-calculator': {
    toolSlug: 'bmi-calculator',
    seoScore: 75,
    keywordsTracked: 8,
    keywordsOnFirstPage: 5,
    estimatedTraffic: 1800,
    keywords: [
      {
        keyword: 'bmi calculator',
        position: 8,
        difficulty: 85,
        topCompetitor: 'Calculator.net',
        actionNeeded: 'Add video tutorial'
      },
      {
        keyword: 'body mass index',
        position: 12,
        difficulty: 70,
        topCompetitor: 'WebMD',
        actionNeeded: 'Improve page speed'
      },
      {
        keyword: 'bmi chart',
        position: 5,
        difficulty: 45,
        topCompetitor: 'CDC',
        actionNeeded: 'Add infographic'
      },
      {
        keyword: 'bmi calculator women',
        position: 9,
        difficulty: 60,
        topCompetitor: 'Healthline',
        actionNeeded: 'Add gender specific content'
      },
      {
        keyword: 'bmi calculator men',
        position: 10,
        difficulty: 58,
        topCompetitor: 'WebMD',
        actionNeeded: 'Add gender specific content'
      },
      {
        keyword: 'healthy weight',
        position: 15,
        difficulty: 72,
        topCompetitor: 'Mayo Clinic',
        actionNeeded: 'Add weight management tips'
      },
      {
        keyword: 'ideal weight',
        position: 14,
        difficulty: 68,
        topCompetitor: 'MedicalNewsToday',
        actionNeeded: 'Add ideal weight range'
      },
      {
        keyword: 'body fat percentage',
        position: 18,
        difficulty: 82,
        topCompetitor: 'VerywellFit',
        actionNeeded: 'Add body fat calculator'
      }
    ],
    improvementSuggestions: [
      'Add 3 more FAQs',
      'Add health recommendations',
      'Add weight tracking feature',
      'Add body fat estimation',
      'Add metric/imperial toggle'
    ],
    competitors: [
      {
        name: 'Calculator.net',
        url: 'https://calculator.net',
        features: {
          free: 'limited',
          noRegistration: false,
          privacy: false,
          multiLanguage: false,
          rtlSupport: false,
          pageSpeed: 68
        }
      },
      {
        name: 'Healthline',
        url: 'https://healthline.com',
        features: {
          free: true,
          noRegistration: true,
          privacy: true,
          multiLanguage: false,
          rtlSupport: false,
          pageSpeed: 82
        }
      },
      {
        name: 'WebMD',
        url: 'https://webmd.com',
        features: {
          free: true,
          noRegistration: true,
          privacy: true,
          multiLanguage: false,
          rtlSupport: false,
          pageSpeed: 75
        }
      }
    ]
  },
  
  'loan-calculator': {
    toolSlug: 'loan-calculator',
    seoScore: 70,
    keywordsTracked: 7,
    keywordsOnFirstPage: 4,
    estimatedTraffic: 1500,
    keywords: [
      {
        keyword: 'loan calculator',
        position: 10,
        difficulty: 80,
        topCompetitor: 'Bankrate',
        actionNeeded: 'Add amortization schedule'
      },
      {
        keyword: 'mortgage calculator',
        position: 15,
        difficulty: 85,
        topCompetitor: 'Zillow',
        actionNeeded: 'Add property tax calculator'
      },
      {
        keyword: 'emi calculator',
        position: 5,
        difficulty: 50,
        topCompetitor: 'EMICalculator.net',
        actionNeeded: 'Improve page speed'
      },
      {
        keyword: 'car loan calculator',
        position: 8,
        difficulty: 55,
        topCompetitor: 'Autotrader',
        actionNeeded: 'Add down payment option'
      },
      {
        keyword: 'personal loan calculator',
        position: 12,
        difficulty: 60,
        topCompetitor: 'NerdWallet',
        actionNeeded: 'Add credit score impact'
      },
      {
        keyword: 'home loan calculator',
        position: 9,
        difficulty: 65,
        topCompetitor: 'Realtor.com',
        actionNeeded: 'Add PMI calculation'
      },
      {
        keyword: 'loan payment calculator',
        position: 6,
        difficulty: 45,
        topCompetitor: 'The Calculator Site',
        actionNeeded: 'Add extra payment option'
      }
    ],
    improvementSuggestions: [
      'Add 4 more FAQs',
      'Add amortization table',
      'Add extra payment calculator',
      'Add loan comparison feature',
      'Add printable schedule option'
    ],
    competitors: [
      {
        name: 'Bankrate',
        url: 'https://bankrate.com',
        features: {
          free: true,
          noRegistration: true,
          privacy: false,
          multiLanguage: false,
          rtlSupport: false,
          pageSpeed: 65
        }
      },
      {
        name: 'NerdWallet',
        url: 'https://nerdwallet.com',
        features: {
          free: true,
          noRegistration: true,
          privacy: false,
          multiLanguage: false,
          rtlSupport: false,
          pageSpeed: 70
        }
      },
      {
        name: 'The Calculator Site',
        url: 'https://thecalculatorsite.com',
        features: {
          free: 'limited',
          noRegistration: false,
          privacy: false,
          multiLanguage: false,
          rtlSupport: false,
          pageSpeed: 68
        }
      }
    ]
  },
  
  'currency-converter': {
    toolSlug: 'currency-converter',
    seoScore: 72,
    keywordsTracked: 8,
    keywordsOnFirstPage: 5,
    estimatedTraffic: 2200,
    keywords: [
      {
        keyword: 'currency converter',
        position: 7,
        difficulty: 85,
        topCompetitor: 'XE.com',
        actionNeeded: 'Add more currencies'
      },
      {
        keyword: 'usd to pkr',
        position: 3,
        difficulty: 40,
        topCompetitor: 'Google Finance',
        actionNeeded: 'Improve page speed'
      },
      {
        keyword: 'pkr to usd',
        position: 4,
        difficulty: 38,
        topCompetitor: 'XE.com',
        actionNeeded: 'Add historical rates'
      },
      {
        keyword: 'exchange rate',
        position: 12,
        difficulty: 75,
        topCompetitor: 'OANDA',
        actionNeeded: 'Add live rates'
      },
      {
        keyword: 'forex converter',
        position: 15,
        difficulty: 70,
        topCompetitor: 'Forex.com',
        actionNeeded: 'Add more pairs'
      },
      {
        keyword: 'euro to dollar',
        position: 8,
        difficulty: 55,
        topCompetitor: 'Bloomberg',
        actionNeeded: 'Add charts'
      },
      {
        keyword: 'pound to dollar',
        position: 9,
        difficulty: 52,
        topCompetitor: 'Reuters',
        actionNeeded: 'Add news feed'
      },
      {
        keyword: 'currency exchange',
        position: 11,
        difficulty: 68,
        topCompetitor: 'TransferWise',
        actionNeeded: 'Add transfer fee'
      }
    ],
    improvementSuggestions: [
      'Add 150+ currencies',
      'Add real-time rates',
      'Add historical charts',
      'Add crypto currencies',
      'Add rate alerts feature'
    ],
    competitors: [
      {
        name: 'XE.com',
        url: 'https://xe.com',
        features: {
          free: true,
          noRegistration: true,
          privacy: false,
          multiLanguage: true,
          rtlSupport: false,
          pageSpeed: 75
        }
      },
      {
        name: 'OANDA',
        url: 'https://oanda.com',
        features: {
          free: 'limited',
          noRegistration: false,
          privacy: false,
          multiLanguage: true,
          rtlSupport: false,
          pageSpeed: 70
        }
      },
      {
        name: 'TransferWise',
        url: 'https://wise.com',
        features: {
          free: true,
          noRegistration: false,
          privacy: false,
          multiLanguage: true,
          rtlSupport: false,
          pageSpeed: 80
        }
      }
    ]
  },
  
  // ========== PDF TOOLS ==========
  
  'pdf-merger': {
    toolSlug: 'pdf-merger',
    seoScore: 60,
    keywordsTracked: 7,
    keywordsOnFirstPage: 4,
    estimatedTraffic: 1267,
    keywords: [
      {
        keyword: 'pdf merger',
        position: 14,
        difficulty: 42,
        topCompetitor: 'RapidTables',
        actionNeeded: 'Create comparison content'
      },
      {
        keyword: 'combine pdf',
        position: 2,
        difficulty: 26,
        topCompetitor: 'SmallPDF',
        actionNeeded: 'Improve page speed'
      },
      {
        keyword: 'merge pdf files',
        position: 2,
        difficulty: 34,
        topCompetitor: 'Calculator.net',
        actionNeeded: 'Improve page speed'
      },
      {
        keyword: 'join pdf',
        position: 8,
        difficulty: 42,
        topCompetitor: 'SmallPDF',
        actionNeeded: 'Create comparison content'
      },
      {
        keyword: 'pdf combiner',
        position: 7,
        difficulty: 63,
        topCompetitor: 'SmallPDF',
        actionNeeded: 'Improve page speed'
      },
      {
        keyword: 'merge multiple pdf',
        position: 16,
        difficulty: 16,
        topCompetitor: 'Calculator.net',
        actionNeeded: 'Improve page speed'
      },
      {
        keyword: 'pdf unification',
        position: 15,
        difficulty: 46,
        topCompetitor: 'RapidTables',
        actionNeeded: 'Add video tutorial'
      }
    ],
    improvementSuggestions: [
      'Add 4 more FAQs',
      'Add "free online" to description',
      'Add more internal links',
      'Create "vs paid tools" comparison',
      'Add user testimonials section'
    ],
    competitors: [
      {
        name: 'SmallPDF',
        url: 'https://smallpdf.com',
        features: {
          free: 'limited',
          noRegistration: false,
          privacy: false,
          multiLanguage: true,
          rtlSupport: false,
          pageSpeed: 75
        }
      },
      {
        name: 'ILovePDF',
        url: 'https://ilovepdf.com',
        features: {
          free: 'limited',
          noRegistration: true,
          privacy: false,
          multiLanguage: true,
          rtlSupport: false,
          pageSpeed: 70
        }
      },
      {
        name: 'PDF2Go',
        url: 'https://pdf2go.com',
        features: {
          free: 'limited',
          noRegistration: true,
          privacy: false,
          multiLanguage: true,
          rtlSupport: false,
          pageSpeed: 68
        }
      }
    ]
  },
  
  'pdf-compressor': {
    toolSlug: 'pdf-compressor',
    seoScore: 55,
    keywordsTracked: 6,
    keywordsOnFirstPage: 3,
    estimatedTraffic: 980,
    keywords: [
      {
        keyword: 'pdf compressor',
        position: 12,
        difficulty: 55,
        topCompetitor: 'SmallPDF',
        actionNeeded: 'Add quality control'
      },
      {
        keyword: 'compress pdf',
        position: 8,
        difficulty: 48,
        topCompetitor: 'ILovePDF',
        actionNeeded: 'Improve compression speed'
      },
      {
        keyword: 'reduce pdf size',
        position: 10,
        difficulty: 52,
        topCompetitor: 'Adobe',
        actionNeeded: 'Add batch processing'
      }
    ],
    improvementSuggestions: [
      'Add 3 more FAQs',
      'Add compression level options',
      'Add batch upload feature',
      'Add before/after size comparison'
    ],
    competitors: [
      {
        name: 'SmallPDF',
        url: 'https://smallpdf.com',
        features: {
          free: 'limited',
          noRegistration: false,
          privacy: false,
          multiLanguage: true,
          rtlSupport: false,
          pageSpeed: 75
        }
      },
      {
        name: 'ILovePDF',
        url: 'https://ilovepdf.com',
        features: {
          free: 'limited',
          noRegistration: true,
          privacy: false,
          multiLanguage: true,
          rtlSupport: false,
          pageSpeed: 70
        }
      }
    ]
  },
  
  'pdf-splitter': {
    toolSlug: 'pdf-splitter',
    seoScore: 50,
    keywordsTracked: 5,
    keywordsOnFirstPage: 2,
    estimatedTraffic: 750,
    keywords: [
      {
        keyword: 'pdf splitter',
        position: 15,
        difficulty: 48,
        topCompetitor: 'SmallPDF',
        actionNeeded: 'Add page range option'
      },
      {
        keyword: 'split pdf',
        position: 9,
        difficulty: 42,
        topCompetitor: 'ILovePDF',
        actionNeeded: 'Add extract pages'
      }
    ],
    improvementSuggestions: [
      'Add 3 more FAQs',
      'Add page range selection',
      'Add extract by bookmarks',
      'Add split by size option'
    ],
    competitors: [
      {
        name: 'SmallPDF',
        url: 'https://smallpdf.com',
        features: {
          free: 'limited',
          noRegistration: false,
          privacy: false,
          multiLanguage: true,
          rtlSupport: false,
          pageSpeed: 75
        }
      },
      {
        name: 'ILovePDF',
        url: 'https://ilovepdf.com',
        features: {
          free: 'limited',
          noRegistration: true,
          privacy: false,
          multiLanguage: true,
          rtlSupport: false,
          pageSpeed: 70
        }
      }
    ]
  },
  
  'pdf-to-word': {
    toolSlug: 'pdf-to-word',
    seoScore: 48,
    keywordsTracked: 6,
    keywordsOnFirstPage: 2,
    estimatedTraffic: 1100,
    keywords: [
      {
        keyword: 'pdf to word',
        position: 11,
        difficulty: 65,
        topCompetitor: 'SmallPDF',
        actionNeeded: 'Improve conversion quality'
      },
      {
        keyword: 'convert pdf to word',
        position: 13,
        difficulty: 60,
        topCompetitor: 'Adobe',
        actionNeeded: 'Add OCR support'
      }
    ],
    improvementSuggestions: [
      'Add 4 more FAQs',
      'Add OCR support',
      'Add batch conversion',
      'Add format preservation'
    ],
    competitors: [
      {
        name: 'SmallPDF',
        url: 'https://smallpdf.com',
        features: {
          free: 'limited',
          noRegistration: false,
          privacy: false,
          multiLanguage: true,
          rtlSupport: false,
          pageSpeed: 75
        }
      },
      {
        name: 'Adobe Acrobat',
        url: 'https://adobe.com/acrobat',
        features: {
          free: false,
          noRegistration: false,
          privacy: false,
          multiLanguage: true,
          rtlSupport: false,
          pageSpeed: 65
        }
      }
    ]
  },
  
  // ========== CODE TOOLS ==========
  
  'json-formatter': {
    toolSlug: 'json-formatter',
    seoScore: 65,
    keywordsTracked: 5,
    keywordsOnFirstPage: 3,
    estimatedTraffic: 850,
    keywords: [
      {
        keyword: 'json formatter',
        position: 8,
        difficulty: 55,
        topCompetitor: 'JSONFormatter.org',
        actionNeeded: 'Add validation'
      },
      {
        keyword: 'beautify json',
        position: 6,
        difficulty: 45,
        topCompetitor: 'Code Beautify',
        actionNeeded: 'Add minify option'
      }
    ],
    improvementSuggestions: [
      'Add 2 more FAQs',
      'Add JSON validator',
      'Add JSON minifier',
      'Add syntax highlighting'
    ],
    competitors: [
      {
        name: 'JSONFormatter.org',
        url: 'https://jsonformatter.org',
        features: {
          free: true,
          noRegistration: true,
          privacy: false,
          multiLanguage: false,
          rtlSupport: false,
          pageSpeed: 72
        }
      },
      {
        name: 'Code Beautify',
        url: 'https://codebeautify.org',
        features: {
          free: true,
          noRegistration: true,
          privacy: false,
          multiLanguage: false,
          rtlSupport: false,
          pageSpeed: 68
        }
      }
    ]
  },
  
  'qr-code-generator': {
    toolSlug: 'qr-code-generator',
    seoScore: 70,
    keywordsTracked: 6,
    keywordsOnFirstPage: 4,
    estimatedTraffic: 2000,
    keywords: [
      {
        keyword: 'qr code generator',
        position: 5,
        difficulty: 65,
        topCompetitor: 'QRCode Monkey',
        actionNeeded: 'Add custom colors'
      },
      {
        keyword: 'free qr code',
        position: 3,
        difficulty: 50,
        topCompetitor: 'QR Code Generator',
        actionNeeded: 'Add logo upload'
      }
    ],
    improvementSuggestions: [
      'Add 3 more FAQs',
      'Add custom logo option',
      'Add color customization',
      'Add download formats'
    ],
    competitors: [
      {
        name: 'QRCode Monkey',
        url: 'https://qrcode-monkey.com',
        features: {
          free: true,
          noRegistration: true,
          privacy: false,
          multiLanguage: false,
          rtlSupport: false,
          pageSpeed: 70
        }
      },
      {
        name: 'QR Code Generator',
        url: 'https://qr-code-generator.com',
        features: {
          free: 'limited',
          noRegistration: true,
          privacy: false,
          multiLanguage: false,
          rtlSupport: false,
          pageSpeed: 68
        }
      }
    ]
  }
};

// Helper function to get competitor data for a tool
export function getToolCompetitorData(toolSlug: string): ToolCompetitorData | null {
  return toolsCompetitorData[toolSlug] || null;
}

// Helper function to get all tool slugs with data
export function getAllToolSlugs(): string[] {
  return Object.keys(toolsCompetitorData);
}

// Helper function to update or add new tool data
export function updateToolCompetitorData(
  toolSlug: string, 
  data: Partial<ToolCompetitorData>
): ToolCompetitorData {
  const existingData = toolsCompetitorData[toolSlug] || {
    toolSlug,
    seoScore: 0,
    keywordsTracked: 0,
    keywordsOnFirstPage: 0,
    estimatedTraffic: 0,
    keywords: [],
    improvementSuggestions: [],
    competitors: []
  };
  
  const updatedData = { ...existingData, ...data };
  toolsCompetitorData[toolSlug] = updatedData;
  return updatedData;
}