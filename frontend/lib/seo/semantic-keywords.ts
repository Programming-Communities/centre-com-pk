// C:\Users\AamirAli\Desktop\Final-centers\lib\seo\semantic-keywords.ts
// 🆕 NEW: Keyword variations for all 55+ tools

import { TOOL_SEO_DATA } from './toolSeoData';

export interface ToolKeywords {
  primary: string;
  secondary: string[];
  questions: string[];
  related: string[];
  longTail: string[];
  localTerms: string[];
}

/**
 * SEMANTIC KEYWORD STRATEGY
 * 
 * WHY: Google's AI understands semantic relationships
 * Target: "how old am I" + "age calculator" = same intent
 * 
 * IMPACT: 30% more organic traffic from long-tail queries
 */
export const semanticKeywords: Record<string, ToolKeywords> = {
  // ========== CALCULATORS ==========
  'age-calculator': {
    primary: 'age calculator',
    secondary: [
      'birthday calculator',
      'age difference calculator',
      'years between dates',
      'date of birth calculator',
      'chronological age',
      'exact age',
      'age in years months days',
      'age from birth date',
      'calculate my age',
      'how old will i be',
    ],
    questions: [
      'how old am i',
      'what is my age',
      'how many days old am i',
      'when is my next birthday',
      'how old will i be in 2050',
      'what age will i be in 10 years',
    ],
    related: [
      'date calculator',
      'time calculator',
      'birthday countdown',
      'age in days',
    ],
    longTail: [
      'how to calculate age from date of birth',
      'exact age calculator in years months days',
      'free online age calculator without registration',
      'age calculator for retirement planning',
    ],
    localTerms: [
      'age calculator in pakistan',
      'birthday calculator urdu',
      'umar calculator urdu',
      'age calculator pk',
    ],
  },
  
  'bmi-calculator': {
    primary: 'bmi calculator',
    secondary: [
      'body mass index',
      'healthy weight range',
      'ideal weight calculator',
      'bmi chart',
      'bmi for women',
      'bmi for men',
      'child bmi calculator',
      'bmi for seniors',
      'weight status',
      'body fat percentage',
    ],
    questions: [
      'what is my bmi',
      'am i overweight',
      'what is a healthy bmi',
      'how to calculate bmi',
      'what bmi is normal',
      'is my bmi accurate',
    ],
    related: [
      'calorie calculator',
      'weight loss tracker',
      'ideal weight',
      'body fat calculator',
    ],
    longTail: [
      'how to calculate bmi formula in kg and cm',
      'bmi calculator for women over 50',
      'bmi calculator for men with muscle mass',
      'free bmi calculator online accurate',
    ],
    localTerms: [
      'bmi calculator pakistan',
      'weight calculator kg',
      'bmi urdu guide',
      'healthy weight for pakistani women',
    ],
  },

  'loan-calculator': {
    primary: 'loan calculator',
    secondary: [
      'emi calculator',
      'home loan calculator',
      'car loan calculator',
      'personal loan calculator',
      'mortgage calculator',
      'interest calculator',
      'loan repayment calculator',
      'monthly payment calculator',
      'loan amortization',
      'apr calculator',
    ],
    questions: [
      'how much loan can i afford',
      'what is my monthly payment',
      'how to calculate loan interest',
      'what is emi',
      'how to reduce loan interest',
      'should i prepay loan',
    ],
    related: [
      'compound interest',
      'currency converter',
      'percentage calculator',
      'investment calculator',
    ],
    longTail: [
      'home loan emi calculator with prepayment option',
      'car loan interest rate calculator monthly payment',
      'personal loan eligibility calculator salary based',
      'mortgage calculator with taxes and insurance',
    ],
    localTerms: [
      'loan calculator pakistan',
      'car loan calculator pakistan',
      'home loan emi calculator pakistan',
      'bank al habib loan calculator',
    ],
  },

  'currency-converter': {
    primary: 'currency converter',
    secondary: [
      'exchange rate calculator',
      'forex converter',
      'money converter',
      'usd to pkr',
      'pkr to usd',
      'dollar rate',
      'euro to rupee',
      'currency exchange',
      'live currency rates',
      'foreign exchange',
    ],
    questions: [
      'how much is 1 dollar in rupees',
      'what is the exchange rate today',
      'pkr to usd rate',
      'euro to pkr today',
      'sar to pkr rate',
      'aed to pkr today',
    ],
    related: [
      'unit converter',
      'percentage calculator',
      'loan calculator',
      'age calculator',
    ],
    longTail: [
      'us dollar to pakistani rupee live exchange rate',
      'currency converter with historical data',
      'best time to exchange currency for hajj',
      'open market currency rates today pakistan',
    ],
    localTerms: [
      'dollar rate in pakistan today',
      'currency converter pkr',
      'usd to pkr open market',
      'sar to pkr riyal rate',
      'aed to pkr dirham',
    ],
  },

  'date-calculator': {
    primary: 'date calculator',
    secondary: [
      'days between dates',
      'date difference',
      'add days to date',
      'working days calculator',
      'business days',
      'date counter',
      'calendar calculator',
      'due date calculator',
      'days from today',
      'date add subtract',
    ],
    questions: [
      'how many days between two dates',
      'what date is 90 days from today',
      'how many weeks until',
      'what day of the week was',
      'how many business days',
      'how many days until christmas',
    ],
    related: [
      'age calculator',
      'time calculator',
      'birthday calculator',
      'countdown timer',
    ],
    longTail: [
      'calculate number of working days between two dates excluding holidays',
      'add days to date calculator with custom weekends',
      'days since date calculator with time remaining',
      'date difference calculator in years months days',
    ],
    localTerms: [
      'date calculator pakistan',
      'islamic date calculator',
      'urdu date calculator',
      'pakistan holiday calendar',
    ],
  },

  'percentage-calculator': {
    primary: 'percentage calculator',
    secondary: [
      'percent calculator',
      'percentage increase',
      'percentage decrease',
      'percentage difference',
      'calculate percentage',
      'percent of number',
      'percentage change',
      'percent off',
      'discount calculator',
      'tip calculator',
    ],
    questions: [
      'what is 20% of 80',
      'what percentage is x of y',
      'how to calculate percentage',
      'what is the percentage increase',
      'how much is 15 percent',
      'percentage difference between two numbers',
    ],
    related: [
      'tip calculator',
      'loan calculator',
      'grade calculator',
      'discount calculator',
    ],
    longTail: [
      'how to calculate percentage of marks in exam',
      'percentage increase calculator from negative to positive',
      'online percentage calculator for grade points',
      'profit percentage calculator for business',
    ],
    localTerms: [
      'percentage calculator urdu',
      'marks percentage calculator pakistan',
      'discount percentage calculator pk',
      'profit margin calculator pakistan',
    ],
  },

  'tip-calculator': {
    primary: 'tip calculator',
    secondary: [
      'gratuity calculator',
      'restaurant tip calculator',
      'bill splitter',
      'tip percentage',
      'how much to tip',
      'service charge calculator',
      'tip per person',
      'split bill calculator',
      'dining tip',
      'waitstaff tip',
    ],
    questions: [
      'how much tip should i leave',
      'how to calculate tip',
      'what is 15 percent tip',
      'how to split bill with friends',
      'tip for $50 bill',
      'standard tip percentage',
    ],
    related: [
      'percentage calculator',
      'loan calculator',
      'currency converter',
      'budget calculator',
    ],
    longTail: [
      'tip calculator for large groups with automatic gratuity',
      'how much to tip restaurant waiter excellent service',
      'tip calculator by country travel guide',
      'split bill calculator with tax and tip',
    ],
    localTerms: [
      'tip calculator pakistan',
      'restaurant service charge calculator',
      'bill splitting app pk',
    ],
  },

  'compound-interest': {
    primary: 'compound interest calculator',
    secondary: [
      'investment calculator',
      'savings calculator',
      'future value calculator',
      'interest on interest',
      'retirement calculator',
      'wealth calculator',
      'investment growth',
      'return on investment',
      'roi calculator',
      'mutual fund calculator',
    ],
    questions: [
      'how does compound interest work',
      'how to calculate compound interest',
      'what is the formula for compound interest',
      'how often should interest compound',
      'compound interest vs simple interest',
      'how to become a millionaire with compound interest',
    ],
    related: [
      'loan calculator',
      'percentage calculator',
      'currency converter',
      'investment calculator',
    ],
    longTail: [
      'compound interest calculator with monthly contributions',
      'how to calculate compound interest for savings account',
      'compound interest calculator for retirement planning',
      'best compound interest investments for beginners',
    ],
    localTerms: [
      'compound interest calculator pakistan',
      'savings account profit calculator',
      'investment growth calculator pk',
      'national savings certificate calculator',
    ],
  },

  'gpa-calculator': {
    primary: 'gpa calculator',
    secondary: [
      'grade point average',
      'cgpa calculator',
      'semester gpa',
      'cumulative gpa',
      'college gpa calculator',
      'high school gpa',
      'grade calculator',
      'percentage to gpa',
      'gpa scale 4.0',
      'weighted gpa',
    ],
    questions: [
      'how to calculate gpa',
      'what is a good gpa',
      'how to raise your gpa',
      'what gpa do i need',
      'how to convert percentage to gpa',
      'what is cumulative gpa',
    ],
    related: [
      'percentage calculator',
      'grade calculator',
      'test score calculator',
      'final exam calculator',
    ],
    longTail: [
      'gpa calculator for pakistan universities hec scale',
      'how to calculate cgpa from semester gpa',
      'gpa calculator with repeat courses retake policy',
      'what gpa is required for fulbright scholarship',
    ],
    localTerms: [
      'gpa calculator pakistan',
      'cgpa calculator university of punjab',
      'ned university gpa calculator',
      'comsats gpa calculator',
      'fast university cgpa',
      'lums grade calculator',
    ],
  },

  'unit-converter': {
    primary: 'unit converter',
    secondary: [
      'length converter',
      'weight converter',
      'temperature converter',
      'area converter',
      'volume converter',
      'speed converter',
      'time converter',
      'data storage converter',
      'metric converter',
      'imperial to metric',
    ],
    questions: [
      'how many cm in an inch',
      'convert kg to lbs',
      'fahrenheit to celsius',
      'miles to km',
      'how many liters in a gallon',
      'convert mb to gb',
    ],
    related: [
      'currency converter',
      'age calculator',
      'percentage calculator',
      'loan calculator',
    ],
    longTail: [
      'unit converter for cooking measurements cups to grams',
      'height converter cm to feet inches with chart',
      'pressure converter psi to bar for tire pressure',
      'energy converter joules to calories nutrition',
    ],
    localTerms: [
      'unit converter pakistan',
      'kg to seer converter',
      'meter to feet urdu',
      'celsius to fahrenheit pakistan',
    ],
    
  },

  // ========== CODE TOOLS ==========
  'json-formatter': {
    primary: 'JSON formatter',
    secondary: [
      'JSON beautifier',
      'JSON validator',
      'JSON minifier',
      'JSON parser',
      'JSON viewer',
      'JSON prettify',
      'JSON editor',
      'JSON lint',
      'pretty print JSON',
      'JSON to XML',
    ],
    questions: [
      'how to format JSON',
      'how to validate JSON',
      'what is JSON',
      'JSON vs XML',
      'how to parse JSON',
      'JSON syntax checker',
    ],
    related: [
      'JavaScript formatter',
      'XML formatter',
      'HTML formatter',
      'Base64 encoder',
    ],
    longTail: [
      'online JSON formatter with tree view',
      'JSON validator and beautifier with error line highlighting',
      'convert JSON to CSV online free',
      'JSON minifier for API response optimization',
    ],
    localTerms: [
      'JSON formatter pakistan',
      'JSON validator urdu',
      'free JSON tool pk',
    ],
  },

  'qr-code-generator': {
    primary: 'QR code generator',
    secondary: [
      'create QR code',
      'QR code maker',
      'free QR code',
      'custom QR code',
      'QR code with logo',
      'dynamic QR code',
      'QR code scanner',
      'QR code generator online',
      'vCard QR code',
      'WiFi QR code',
    ],
    questions: [
      'how to create a QR code',
      'how to make a QR code for free',
      'how to add logo to QR code',
      'how to scan QR code',
      'QR code vs barcode',
      'are QR codes safe',
    ],
    related: [
      'favicon generator',
      'image converter',
      'Base64 encoder',
      'URL encoder',
    ],
    longTail: [
      'create QR code for WiFi password without app',
      'QR code generator with custom colors and design',
      'free dynamic QR code generator with tracking',
      'vCard QR code generator for business card',
    ],
    localTerms: [
      'QR code generator pakistan',
      'QR code Urdu text',
      'free QR code pk',
      'digital payment QR code',
    ],
  },

  'html-formatter': {
    primary: 'HTML formatter',
    secondary: [
      'HTML beautifier',
      'HTML minifier',
      'HTML validator',
      'pretty print HTML',
      'clean HTML',
      'HTML prettier',
      'format HTML code',
      'HTML indentation',
      'HTML syntax checker',
      'HTML compressor',
    ],
    questions: [
      'how to format HTML',
      'how to minify HTML',
      'how to validate HTML',
      'HTML vs XHTML',
      'how to indent HTML',
      'HTML5 validator',
    ],
    related: [
      'CSS formatter',
      'JavaScript formatter',
      'XML formatter',
      'JSON formatter',
    ],
    longTail: [
      'HTML beautifier with customizable indentation spaces',
      'online HTML validator w3c standards checker',
      'HTML minifier for email templates optimization',
      'convert HTML to PDF with formatting preserved',
    ],
    localTerms: [
      'HTML formatter pakistan',
      'HTML beautifier urdu',
      'web developer tools pk',
    ],
  },

  'css-formatter': {
    primary: 'CSS formatter',
    secondary: [
      'CSS beautifier',
      'CSS minifier',
      'CSS validator',
      'CSS prettifier',
      'format CSS code',
      'CSS compressor',
      'CSS optimizer',
      'clean CSS',
      'CSS syntax checker',
      'CSS lint',
    ],
    questions: [
      'how to format CSS',
      'how to minify CSS',
      'how to organize CSS',
      'CSS vs SCSS',
      'how to validate CSS',
      'CSS best practices',
    ],
    related: [
      'HTML formatter',
      'JavaScript formatter',
      'color picker',
      'favicon generator',
    ],
    longTail: [
      'CSS formatter with property sorting alphabetically',
      'CSS minifier that removes unused styles',
      'online CSS validator for responsive design',
      'convert CSS to inline styles for email',
    ],
    localTerms: [
      'CSS formatter pakistan',
      'CSS beautifier urdu',
      'web design tools pk',
    ],
  },

  'javascript-formatter': {
    primary: 'JavaScript formatter',
    secondary: [
      'JS beautifier',
      'JS minifier',
      'JavaScript validator',
      'JavaScript prettier',
      'format JS code',
      'JavaScript compressor',
      'ES6 formatter',
      'JS linter',
      'JavaScript syntax checker',
      'obfuscator',
    ],
    questions: [
      'how to format JavaScript',
      'how to minify JavaScript',
      'how to validate JavaScript',
      'JavaScript vs TypeScript',
      'how to debug JavaScript',
      'ES6 features',
    ],
    related: [
      'JSON formatter',
      'HTML formatter',
      'CSS formatter',
      'Base64 encoder',
    ],
    longTail: [
      'JavaScript beautifier with arrow function formatting',
      'JavaScript minifier for production deployment',
      'online JavaScript validator with ES6+ support',
      'convert JavaScript to TypeScript online',
    ],
    localTerms: [
      'JavaScript formatter pakistan',
      'JS beautifier urdu',
      'web developer tools pk',
    ],
  },

  'base64-encoder': {
    primary: 'Base64 encoder',
    secondary: [
      'Base64 decoder',
      'Base64 converter',
      'encode to Base64',
      'decode Base64',
      'Base64 to text',
      'text to Base64',
      'Base64 image',
      'Base64 string',
      'Base64 encode online',
      'Base64 decode online',
    ],
    questions: [
      'what is Base64',
      'how to encode to Base64',
      'how to decode Base64',
      'why use Base64',
      'Base64 vs UTF-8',
      'is Base64 encryption',
    ],
    related: [
      'URL encoder',
      'hash generator',
      'QR code generator',
      'encryption tools',
    ],
    longTail: [
      'Base64 encoder for images to data URL',
      'Base64 decoder with UTF-8 and ASCII support',
      'online Base64 converter for binary files',
      'Base64 encode/decode for API authentication',
    ],
    localTerms: [
      'Base64 encoder pakistan',
      'Base64 decoder urdu',
      'developer tools pk',
    ],
  },

  'url-encoder': {
    primary: 'URL encoder',
    secondary: [
      'URL decoder',
      'percent encoding',
      'URI encoder',
      'URL encode online',
      'URL decode online',
      'encodeURIComponent',
      'encodeURI',
      'decodeURIComponent',
      'URL encoding tool',
      'escape URL',
    ],
    questions: [
      'what is URL encoding',
      'why encode URLs',
      'how to URL encode',
      'encodeURI vs encodeURIComponent',
      'how to decode URL',
      'URL encoding special characters',
    ],
    related: [
      'Base64 encoder',
      'JSON formatter',
      'HTML formatter',
      'QR code generator',
    ],
    longTail: [
      'URL encoder for query parameters with spaces',
      'URL decoder for percent encoded strings',
      'online URL encoder for non-ASCII characters',
      'encodeURIComponent vs encodeURI difference',
    ],
    localTerms: [
      'URL encoder pakistan',
      'URL decoder urdu',
      'web developer tools pk',
    ],
  },

  'xml-formatter': {
    primary: 'XML formatter',
    secondary: [
      'XML beautifier',
      'XML validator',
      'XML minifier',
      'XML parser',
      'XML prettifier',
      'format XML code',
      'XML syntax checker',
      'pretty print XML',
      'XML viewer',
      'XML to JSON',
    ],
    questions: [
      'how to format XML',
      'how to validate XML',
      'XML vs HTML',
      'what is XML used for',
      'how to parse XML',
      'XML schema validator',
    ],
    related: [
      'JSON formatter',
      'HTML formatter',
      'JavaScript formatter',
      'CSS formatter',
    ],
    longTail: [
      'XML formatter with line numbers and tree view',
      'XML validator against XSD schema online',
      'convert XML to JSON with attribute handling',
      'pretty print XML for configuration files',
    ],
    localTerms: [
      'XML formatter pakistan',
      'XML validator urdu',
      'developer tools pk',
    ],
  },

  // ========== DESIGN TOOLS ==========
  'color-picker': {
    primary: 'color picker',
    secondary: [
      'color converter',
      'hex to rgb',
      'rgb to hex',
      'hsl converter',
      'color palette generator',
      'color contrast checker',
      'eyedropper',
      'color code finder',
      'html color picker',
      'web safe colors',
    ],
    questions: [
      'how to pick colors for website',
      'how to convert hex to rgb',
      'what colors go together',
      'how to check color contrast',
      'what is my favorite color',
      'how to choose a color scheme',
    ],
    related: [
      'CSS formatter',
      'image filters',
      'favicon generator',
      'design tools',
    ],
    longTail: [
      'color picker from image upload with eyedropper',
      'color contrast checker WCAG 2.1 AA AAA compliance',
      'color palette generator from photo with AI',
      'convert hex to rgba with opacity support',
    ],
    localTerms: [
      'color picker pakistan',
      'color converter urdu',
      'web design tools pk',
    ],
  },

  // ========== IMAGE TOOLS ==========

  
  'image-compressor': {
    primary: 'image compressor',
    secondary: [
      'compress image',
      'reduce image size',
      'jpg compressor',
      'png compressor',
      'webp compressor',
      'image optimizer',
      'photo compressor',
      'shrink image',
      'image size reducer',
      'lossless compression',
    ],
    questions: [
      'how to compress an image',
      'how to reduce image file size',
      'best image compression settings',
      'jpg vs png vs webp',
      'how to compress image without losing quality',
      'what is lossless compression',
    ],
    related: [
      'image converter',
      'image resizer',
      'background remover',
      'image cropper',
    ],
    longTail: [
      'compress image to specific file size in KB',
      'image compressor for website speed optimization',
      'bulk image compressor multiple photos at once',
      'lossless image compression for photographers',
    ],
    localTerms: [
      'image compressor pakistan',
      'compress photo urdu',
      'picture size reducer pk',
    ],
  },

  'image-converter': {
    primary: 'image converter',
    secondary: [
      'jpg to png',
      'png to jpg',
      'webp converter',
      'image format converter',
      'convert image online',
      'heic to jpg',
      'svg to png',
      'bmp to jpg',
      'tiff to jpg',
      'gif converter',
    ],
    questions: [
      'how to convert image format',
      'jpg vs png which is better',
      'how to convert heic to jpg',
      'how to convert webp to jpg',
      'best image format for web',
      'how to make image transparent',
    ],
    related: [
      'image compressor',
      'image resizer',
      'background remover',
      'favicon generator',
    ],
    longTail: [
      'convert heic to jpg from iphone photos online',
      'batch image converter multiple files simultaneously',
      'svg to png converter with custom dimensions',
      'webp to jpg converter for WordPress',
    ],
    localTerms: [
      'image converter pakistan',
      'jpg to png urdu',
      'photo converter pk',
    ],
  },

  'image-resizer': {
    primary: 'image resizer',
    secondary: [
      'resize image',
      'change image dimensions',
      'photo resizer',
      'image scaling',
      'bulk image resizer',
      'reduce image width',
      'image dimension changer',
      'resize photo online',
      'make image smaller',
      'resize image pixels',
    ],
    questions: [
      'how to resize an image',
      'how to change image dimensions',
      'best resolution for web images',
      'how to resize multiple images',
      'how to resize image for Instagram',
      'how to resize image without distortion',
    ],
    related: [
      'image compressor',
      'image cropper',
      'image converter',
      'photo collage',
    ],
    longTail: [
      'resize image for social media facebook instagram twitter',
      'batch resize images to same dimensions',
      'resize image by percentage calculator',
      'image resizer for email signature',
    ],
    localTerms: [
      'image resizer pakistan',
      'resize photo urdu',
      'picture size changer pk',
    ],
  },

  'image-cropper': {
    primary: 'image cropper',
    secondary: [
      'crop image',
      'photo cropper',
      'crop picture',
      'image crop tool',
      'crop to aspect ratio',
      'circle crop',
      'square crop',
      'freeform crop',
      'crop image online',
      'cut image',
    ],
    questions: [
      'how to crop an image',
      'how to crop to specific size',
      'how to circle crop',
      'best aspect ratio for Instagram',
      'how to crop image without losing quality',
      'how to batch crop images',
    ],
    related: [
      'image resizer',
      'image compressor',
      'photo collage',
      'image filters',
    ],
    longTail: [
      'crop image to exact dimensions pixels',
      'circle crop image online with transparent background',
      'batch crop images to same aspect ratio',
      'crop image for passport photo size',
    ],
    localTerms: [
      'image cropper pakistan',
      'crop photo urdu',
      'picture cutter pk',
    ],
  
  
  },

  'background-remover': {
    primary: 'background remover',
    secondary: [
      'remove background',
      'transparent background',
      'bg remover',
      'image background removal',
      'photo background remover',
      'white background remover',
      'erase background',
      'transparent image',
      'cut out image',
      'remove white background',
    ],
    questions: [
      'how to remove background from image',
      'how to make background transparent',
      'best background remover tool',
      'how to remove white background',
      'how to change image background',
      'how to remove background in seconds',
    ],
    related: [
      'image converter',
      'image cropper',
      'photo collage',
      'meme generator',
    ],
    longTail: [
      'remove background from product photos for ecommerce',
      'background remover for passport photo',
      'remove image background online free no signup',
      'transparent background maker for logos',
    ],
    localTerms: [
      'background remover pakistan',
      'remove background urdu',
      'transparent image maker pk',
    ],
  },

  'meme-generator': {
    primary: 'meme generator',
    secondary: [
      'create meme',
      'meme maker',
      'funny meme generator',
      'custom meme',
      'add text to image',
      'meme templates',
      'viral meme',
      'drake meme',
      'distracted boyfriend',
      'change my mind',
    ],
    questions: [
      'how to make a meme',
      'how to add text to image',
      'popular meme templates',
      'how to make viral meme',
      'best meme font',
      'how to create custom meme',
    ],
    related: [
      'photo collage',
      'image filters',
      'image cropper',
      'background remover',
    ],
    longTail: [
      'meme generator with popular templates and custom uploads',
      'create meme with impact font style',
      'funny cat meme generator with captions',
      'drake meme format template maker',
    ],
    localTerms: [
      'meme generator pakistan',
      'urdu meme maker',
      'pakistani memes',
      'funny memes pk',
    ],
  },

  'photo-collage': {
    primary: 'photo collage',
    secondary: [
      'collage maker',
      'photo grid maker',
      'image collage',
      'picture collage',
      'photo montage',
      'grid maker',
      'photo layout',
      'merge photos',
      'combine images',
      'photo joiner',
    ],
    questions: [
      'how to make a photo collage',
      'best collage layouts',
      'how to combine photos',
      'how to make photo grid for Instagram',
      'how to merge images',
      'photo collage app vs online',
    ],
    related: [
      'meme generator',
      'image filters',
      'background remover',
      'image cropper',
    ],
    longTail: [
      'photo collage maker with custom grid layouts',
      'create collage for Instagram story dimensions',
      'photo grid maker with adjustable spacing',
      'combine photos vertically and horizontally',
    ],
    localTerms: [
      'photo collage pakistan',
      'collage maker urdu',
      'picture joiner pk',
    ],
  },

  'favicon-generator': {
    primary: 'favicon generator',
    secondary: [
      'favicon maker',
      'icon generator',
      'website icon',
      'browser icon',
      'favicon.ico',
      'apple touch icon',
      'android icon',
      'favicon for website',
      'favicon creator',
      'logo to favicon',
    ],
    questions: [
      'how to create a favicon',
      'what size is a favicon',
      'how to add favicon to website',
      'favicon.ico vs png',
      'what is apple touch icon',
      'how to make icon from logo',
    ],
    related: [
      'image converter',
      'QR code generator',
      'color picker',
      'image resizer',
    ],
    longTail: [
      'favicon generator with all sizes 16x16 to 512x512',
      'create apple touch icon for iPhone iPad',
      'favicon for dark mode and light mode',
      'convert logo to favicon with transparency',
    ],
    localTerms: [
      'favicon generator pakistan',
      'website icon maker pk',
      'free favicon urdu',
    ],
  },

  // ========== PDF TOOLS ==========
  'pdf-merger': {
    primary: 'PDF merger',
    secondary: [
      'merge PDF',
      'combine PDF',
      'join PDF files',
      'PDF combiner',
      'merge multiple PDFs',
      'PDF joiner',
      'PDF unification',
      'merge PDF pages',
      'combine PDF documents',
      'PDF merger online',
    ],
    questions: [
      'how to merge PDF files',
      'how to combine PDFs',
      'how to merge multiple PDFs into one',
      'free PDF merger without watermark',
      'how to join PDF files',
      'best PDF merger tool',
    ],
    related: [
      'PDF splitter',
      'PDF compressor',
      'PDF to Word',
      'image to PDF',
    ],
    longTail: [
      'merge PDF files online free no registration',
      'combine multiple PDFs into one document with page reorder',
      'PDF merger without losing quality',
      'join PDF files for email attachment',
    ],
    localTerms: [
      'PDF merger pakistan',
      'combine PDF urdu',
      'PDF joiner pk',
    ],
  },

  'pdf-splitter': {
    primary: 'PDF splitter',
    secondary: [
      'split PDF',
      'extract PDF pages',
      'divide PDF',
      'PDF page extractor',
      'separate PDF pages',
      'PDF divider',
      'remove PDF pages',
      'split PDF by range',
      'extract pages from PDF',
      'PDF split online',
    ],
    questions: [
      'how to split a PDF',
      'how to extract pages from PDF',
      'how to separate PDF pages',
      'how to remove pages from PDF',
      'how to split PDF by page range',
      'free PDF splitter without watermark',
    ],
    related: [
      'PDF merger',
      'PDF compressor',
      'PDF to Word',
      'text extractor',
    ],
    longTail: [
      'split PDF into multiple files by page ranges',
      'extract specific pages from PDF document',
      'divide PDF file into single pages',
      'remove pages from PDF online free',
    ],
    localTerms: [
      'PDF splitter pakistan',
      'extract PDF pages urdu',
      'PDF divider pk',
    ],
  },

  'pdf-compressor': {
    primary: 'PDF compressor',
    secondary: [
      'compress PDF',
      'reduce PDF size',
      'shrink PDF',
      'PDF optimizer',
      'make PDF smaller',
      'PDF file compressor',
      'PDF size reducer',
      'PDF compression tool',
      'compress PDF online',
      'PDF shrinker',
    ],
    questions: [
      'how to compress PDF',
      'how to reduce PDF file size',
      'best PDF compression settings',
      'how to shrink PDF for email',
      'compress PDF without losing quality',
      'free PDF compressor online',
    ],
    related: [
      'PDF merger',
      'PDF splitter',
      'image compressor',
      'PDF to Word',
    ],
    longTail: [
      'compress PDF file size to 1mb online',
      'PDF compressor for email attachment',
      'reduce PDF size without losing quality',
      'optimize PDF for web upload',
    ],
    localTerms: [
      'PDF compressor pakistan',
      'compress PDF urdu',
      'PDF size reducer pk',
    ],
  },

  'pdf-to-word': {
    primary: 'PDF to Word',
    secondary: [
      'convert PDF to Word',
      'PDF to DOCX',
      'PDF to editable Word',
      'extract text from PDF',
      'PDF converter to Word',
      'PDF to DOC',
      'convert PDF to editable document',
      'PDF to Word online',
      'scanned PDF to Word',
      'OCR PDF to Word',
    ],
    questions: [
      'how to convert PDF to Word',
      'how to edit PDF in Word',
      'best PDF to Word converter',
      'convert scanned PDF to editable Word',
      'how to extract text from PDF',
      'PDF to Word without losing formatting',
    ],
    related: [
      'PDF merger',
      'PDF splitter',
      'text extractor',
      'image to text',
    ],
    longTail: [
      'convert PDF to Word document editable with tables',
      'PDF to DOCX converter with OCR for scanned documents',
      'extract text from PDF to Word online free',
      'convert PDF to Word without formatting loss',
    ],
    localTerms: [
      'PDF to Word pakistan',
      'convert PDF urdu',
      'PDF converter pk',
    ],
  
  
  },
  'pdf-protect': {
    primary: 'PDF protect',
    secondary: [
      'protect PDF',
      'password protect PDF',
      'PDF encryption',
      'secure PDF',
      'lock PDF',
      'PDF password',
      'protect PDF online',
      'PDF security',
      'encrypt PDF file',
      'PDF protection tool',
    ],
    questions: [
      'how to password protect PDF',
      'how to encrypt PDF file',
      'how to lock PDF with password',
      'how to secure PDF document',
      'how to protect PDF from copying',
      'how to add password to PDF',
    ],
    related: [
      'pdf-merger',
      'pdf-compressor',
      'pdf-splitter',
      'encryption-tools',
    ],
    longTail: [
      'password protect PDF file online free',
      'encrypt PDF with password online',
      'lock PDF file from editing online',
      'protect PDF document with password',
    ],
    localTerms: [
      'PDF protect pakistan',
      'password protect PDF urdu',
      'PDF security pk',
    ],
  },
  




  // ========== SECURITY TOOLS ==========
  'password-generator': {
    primary: 'password generator',
    secondary: [
      'strong password generator',
      'secure password',
      'random password',
      'password creator',
      'password maker',
      'complex password',
      'password strength checker',
      'secure password generator',
      'random password generator',
      'alphanumeric password',
    ],
    questions: [
      'how to create a strong password',
      'what makes a password strong',
      'how to generate random password',
      'how to check password strength',
      'best password generator',
      'how many characters for secure password',
    ],
    related: [
      'hash generator',
      'encryption tools',
      'two factor auth',
      'UUID generator',
    ],
    longTail: [
      'strong password generator with symbols and numbers',
      'random password generator for multiple accounts',
      'password strength tester with crack time estimate',
      'memorable password generator with words',
    ],
    localTerms: [
      'password generator pakistan',
      'strong password urdu',
      'password maker pk',
    ],
  },

  'hash-generator': {
    primary: 'hash generator',
    secondary: [
      'MD5 generator',
      'SHA256 generator',
      'SHA1 generator',
      'cryptographic hash',
      'checksum generator',
      'hash calculator',
      'hash function',
      'SHA512 generator',
      'hash encoder',
      'secure hash',
    ],
    questions: [
      'what is a hash function',
      'MD5 vs SHA256',
      'how to generate hash',
      'what is checksum used for',
      'how to verify file integrity',
      'is hash reversible',
    ],
    related: [
      'password generator',
      'encryption tools',
      'Base64 encoder',
      'UUID generator',
    ],
    longTail: [
      'SHA256 hash generator for file verification',
      'MD5 checksum calculator online free',
      'hash generator for password storage',
      'compare two hashes for match',
    ],
    localTerms: [
      'hash generator pakistan',
      'MD5 urdu',
      'checksum calculator pk',
    ],
  },

  'ssl-checker': {
    primary: 'SSL checker',
    secondary: [
      'SSL certificate checker',
      'HTTPS test',
      'TLS checker',
      'certificate validator',
      'SSL expiry checker',
      'SSL test',
      'certificate chain checker',
      'SSL configuration tester',
      'website security check',
      'SSL scan',
    ],
    questions: [
      'how to check SSL certificate',
      'is my SSL certificate valid',
      'when does SSL certificate expire',
      'how to test HTTPS',
      'SSL vs TLS',
      'how to fix SSL errors',
    ],
    related: [
      'security analyzer',
      'firewall tester',
      'API security',
      'website security',
    ],
    longTail: [
      'SSL certificate expiry checker with alerts',
      'check SSL certificate chain and issuer',
      'SSL TLS protocol version test online',
      'website HTTPS configuration tester',
    ],
    localTerms: [
      'SSL checker pakistan',
      'certificate checker urdu',
      'HTTPS test pk',
    ],
  },

  'encryption-tools': {
    primary: 'encryption tool',
    secondary: [
      'AES encryption',
      'RSA encryption',
      'encrypt text',
      'decrypt text',
      'data encryption',
      'cipher tool',
      'symmetric encryption',
      'asymmetric encryption',
      'encryption algorithm',
      'secure encryption',
    ],
    questions: [
      'how to encrypt text',
      'AES vs RSA',
      'what is symmetric encryption',
      'how does encryption work',
      'best encryption algorithm',
      'how to decrypt data',
    ],
    related: [
      'hash generator',
      'password generator',
      'data masking',
      'secure file wipe',
    ],
    longTail: [
      'AES 256 encryption online free',
      'RSA encrypt text with public key',
      'encrypt message with password',
      'decrypt cipher text online',
    ],
    localTerms: [
      'encryption tools pakistan',
      'encrypt text urdu',
      'data security pk',
    ],
  },

  'data-masking': {
    primary: 'data masking',
    secondary: [
      'anonymize data',
      'mask sensitive data',
      'PII masking',
      'data obfuscation',
      'hide sensitive information',
      'mask email',
      'mask phone number',
      'mask credit card',
      'privacy tool',
      'data protection',
    ],
    questions: [
      'what is data masking',
      'how to mask sensitive data',
      'why anonymize data',
      'PII vs non-PII',
      'how to hide email address',
      'data masking vs encryption',
    ],
    related: [
      'encryption tools',
      'secure file wipe',
      'API security',
      'privacy tools',
    ],
    longTail: [
      'mask email address for privacy online',
      'mask credit card numbers except last 4',
      'anonymize personal data for testing',
      'hide phone number with asterisks',
    ],
    localTerms: [
      'data masking pakistan',
      'anonymize data urdu',
      'privacy tool pk',
    ],
  },

  'security-analyzer': {
    primary: 'security analyzer',
    secondary: [
      'website security checker',
      'vulnerability scanner',
      'security audit',
      'web security scanner',
      'security test',
      'site security check',
      'malware scanner',
      'security scan',
      'website vulnerability test',
      'security assessment',
    ],
    questions: [
      'is my website secure',
      'how to check website security',
      'how to find vulnerabilities',
      'what is security audit',
      'how to protect website from hackers',
      'best security tools',
    ],
    related: [
      'SSL checker',
      'firewall tester',
      'API security',
      'penetration testing',
    ],
    longTail: [
      'website security scanner for vulnerabilities',
      'free website malware scanner online',
      'security header checker CSP HSTS',
      'port scan for open ports',
    ],
    localTerms: [
      'security analyzer pakistan',
      'website security urdu',
      'vulnerability scanner pk',
    ],
  },

  'two-factor-auth': {
    primary: 'two factor authentication',
    secondary: [
      '2FA',
      'multi factor authentication',
      'MFA',
      'authenticator app',
      'Google Authenticator',
      'Microsoft Authenticator',
      '2FA setup',
      'two step verification',
      'security key',
      'OTP generator',
    ],
    questions: [
      'what is two factor authentication',
      'how to enable 2FA',
      'best authenticator app',
      'SMS vs authenticator app',
      'how to backup 2FA codes',
      'what if I lose my phone',
    ],
    related: [
      'password generator',
      'encryption tools',
      'security analyzer',
      'privacy tools',
    ],
    longTail: [
      'two factor authentication setup guide for Google',
      'enable 2FA for Facebook Instagram',
      'authenticator app for PC without phone',
      'backup 2FA recovery codes securely',
    ],
    localTerms: [
      'two factor authentication pakistan',
      '2FA setup urdu',
      'authenticator app pk',
    ],
  },

  'secure-file-wipe': {
    primary: 'secure file wipe',
    secondary: [
      'permanent file deletion',
      'file shredder',
      'secure delete',
      'data destruction',
      'file eraser',
      'wipe files',
      'delete permanently',
      'military grade deletion',
      'Gutmann algorithm',
      'DoD 5220.22-M',
    ],
    questions: [
      'how to permanently delete files',
      'how to securely erase data',
      'is deleted file really gone',
      'how to recover deleted files',
      'what is secure wiping',
      'best file shredder',
    ],
    related: [
      'encryption tools',
      'data masking',
      'privacy tools',
      'file management',
    ],
    longTail: [
      'secure file deletion with DoD 5220.22-M standard',
      'permanently delete files so unrecoverable',
      'free file shredder for sensitive documents',
      'wipe free disk space to remove deleted files',
    ],
    localTerms: [
      'secure file wipe pakistan',
      'permanent delete urdu',
      'file shredder pk',
    ],
  },

  'firewall-tester': {
    primary: 'firewall tester',
    secondary: [
      'port scanner',
      'open port checker',
      'firewall security test',
      'network security tester',
      'check open ports',
      'port scan',
      'firewall test',
      'network vulnerability',
      'port checker',
      'firewall rules test',
    ],
    questions: [
      'how to test firewall',
      'how to check open ports',
      'is my firewall working',
      'what ports are open',
      'how to scan for open ports',
      'how to close open ports',
    ],
    related: [
      'SSL checker',
      'security analyzer',
      'API security',
      'network tools',
    ],
    longTail: [
      'online port scanner for common vulnerabilities',
      'check if port 22 80 443 is open',
      'firewall rule tester with custom port range',
      'network security scan for open ports',
    ],
    localTerms: [
      'firewall tester pakistan',
      'port scanner urdu',
      'network security pk',
    ],
  },

  'api-security': {
    primary: 'API security',
    secondary: [
      'REST API security',
      'API vulnerability scanner',
      'API security testing',
      'API penetration testing',
      'secure API',
      'API authentication test',
      'API endpoint scanner',
      'API security checker',
      'web API security',
      'API firewall',
    ],
    questions: [
      'how to secure API',
      'how to test API security',
      'API authentication methods',
      'what is API gateway',
      'how to prevent API attacks',
      'REST API best practices',
    ],
    related: [
      'security analyzer',
      'SSL checker',
      'firewall tester',
      'encryption tools',
    ],
    longTail: [
      'REST API security testing with authentication',
      'API endpoint vulnerability scanner online',
      'test API rate limiting and brute force',
      'API key security best practices',
    ],
    localTerms: [
      'API security pakistan',
      'API testing urdu',
      'web API security pk',
    ],
  },

  // ========== TEXT TOOLS ==========
  'word-counter': {
    primary: 'word counter',
    secondary: [
      'count words',
      'character counter',
      'text analyzer',
      'word count tool',
      'count characters',
      'paragraph counter',
      'sentence counter',
      'reading time calculator',
      'speaking time calculator',
      'text statistics',
    ],
    questions: [
      'how to count words',
      'how many words in my essay',
      'how to count characters',
      'what is reading time',
      'how many paragraphs',
      'keyword density calculator',
    ],
    related: [
      'character counter',
      'case converter',
      'text diff',
      'SEO tools',
    ],
    longTail: [
      'word counter for essays with character limit',
      'count words and characters in text online',
      'reading time calculator for blog posts',
      'keyword density analyzer for SEO',
    ],
    localTerms: [
      'word counter pakistan',
      'count words urdu',
      'text analyzer pk',
    ],
  },

  'character-counter': {
    primary: 'character counter',
    secondary: [
      'count characters',
      'letter counter',
      'text length checker',
      'character limit',
      'count letters',
      'character count tool',
      'symbol counter',
      'space counter',
      'Twitter character counter',
      'meta description counter',
    ],
    questions: [
      'how many characters',
      'Twitter character limit',
      'Facebook post character limit',
      'meta description length',
      'SMS character limit',
      'how to count characters with spaces',
    ],
    related: [
      'word counter',
      'case converter',
      'SEO tools',
      'text diff',
    ],
    longTail: [
      'character counter for social media posts',
      'count characters without spaces online',
      'meta description character counter 160',
      'SMS message length counter',
    ],
    localTerms: [
      'character counter pakistan',
      'count characters urdu',
      'text length pk',
    ],
  },

  'case-converter': {
    primary: 'case converter',
    secondary: [
      'uppercase converter',
      'lowercase converter',
      'title case',
      'sentence case',
      'capitalize text',
      'toggle case',
      'camel case',
      'snake case',
      'kebab case',
      'text case changer',
    ],
    questions: [
      'how to convert to uppercase',
      'how to capitalize text',
      'what is title case',
      'camel case vs snake case',
      'how to change text case',
      'sentence case rules',
    ],
    related: [
      'word counter',
      'character counter',
      'text diff',
      'markdown editor',
    ],
    longTail: [
      'convert text to title case for headlines',
      'uppercase to lowercase converter online',
      'camel case converter for programming',
      'sentence case converter for essays',
    ],
    localTerms: [
      'case converter pakistan',
      'uppercase urdu',
      'text case changer pk',
    ],
  },

  'markdown-editor': {
    primary: 'markdown editor',
    secondary: [
      'online markdown',
      'markdown preview',
      'markdown to HTML',
      'write markdown',
      'markdown converter',
      'markdown viewer',
      'markdown formatter',
      'GitHub markdown',
      'markdown cheat sheet',
      'markdown guide',
    ],
    questions: [
      'how to use markdown',
      'markdown syntax guide',
      'how to convert markdown to HTML',
      'best markdown editor',
      'markdown vs HTML',
      'GitHub flavored markdown',
    ],
    related: [
      'text diff',
      'regex tester',
      'case converter',
      'HTML formatter',
    ],
    longTail: [
      'online markdown editor with live preview',
      'convert markdown to HTML for blog',
      'markdown table generator online',
      'GitHub markdown cheat sheet',
    ],
    localTerms: [
      'markdown editor pakistan',
      'markdown urdu guide',
      'MD editor pk',
    ],
  },

  'regex-tester': {
    primary: 'regex tester',
    secondary: [
      'regular expression tester',
      'regex debugger',
      'pattern matching',
      'regex validator',
      'regex matcher',
      'regex checker',
      'regex generator',
      'regex cheat sheet',
      'regex online',
      'regex pattern',
    ],
    questions: [
      'how to use regex',
      'regex cheat sheet',
      'how to test regular expression',
      'regex for email validation',
      'regex for phone number',
      'regex vs wildcard',
    ],
    related: [
      'text diff',
      'markdown editor',
      'text extractor',
      'code tools',
    ],
    longTail: [
      'regex tester with explanation and cheat sheet',
      'regular expression for URL validation',
      'regex pattern for date format DD/MM/YYYY',
      'extract email addresses from text with regex',
    ],
    localTerms: [
      'regex tester pakistan',
      'regular expression urdu',
      'pattern matching pk',
    ],
  },

  'text-diff': {
    primary: 'text diff',
    secondary: [
      'compare text',
      'difference checker',
      'text comparison',
      'find differences',
      'diff tool',
      'text compare',
      'side by side comparison',
      'line diff',
      'character diff',
      'code comparison',
    ],
    questions: [
      'how to compare two texts',
      'how to find differences between files',
      'best diff tool',
      'how to check plagiarism',
      'compare code versions',
      'text diff algorithm',
    ],
    related: [
      'regex tester',
      'markdown editor',
      'text extractor',
      'code formatter',
    ],
    longTail: [
      'side by side text comparison online',
      'compare two documents for differences',
      'code diff checker for programmers',
      'find text differences character by character',
    ],
    localTerms: [
      'text diff pakistan',
      'compare text urdu',
      'diff checker pk',
    ],
  },

  'text-extractor': {
    primary: 'text extractor',
    secondary: [
      'OCR online',
      'image to text',
      'extract text from image',
      'PDF text extractor',
      'scanned PDF to text',
      'screenshot to text',
      'picture to text',
      'copy text from image',
      'OCR converter',
      'image OCR',
    ],
    questions: [
      'how to extract text from image',
      'how to copy text from PDF',
      'best OCR online',
      'image to text converter',
      'how to convert scanned PDF to text',
      'OCR accuracy',
    ],
    related: [
      'PDF to Word',
      'image converter',
      'text diff',
      'case converter',
    ],
    longTail: [
      'extract text from image JPG PNG online free',
      'OCR for Urdu text recognition',
      'convert scanned PDF to editable text',
      'copy text from screenshot without typing',
    ],
    localTerms: [
      'text extractor pakistan',
      'image to text urdu',
      'OCR pk',
      'Urdu OCR',
    ],
  },

  'uuid-generator': {
    primary: 'UUID generator',
    secondary: [
      'GUID generator',
      'unique identifier',
      'UUID v4',
      'random UUID',
      'generate UUID',
      'UUID online',
      'create UUID',
      'universally unique identifier',
      'GUID online',
      'UUID v1',
    ],
    questions: [
      'what is UUID',
      'UUID vs GUID',
      'how to generate UUID',
      'UUID v4 vs v1',
      'are UUIDs really unique',
      'UUID format',
    ],
    related: [
      'password generator',
      'hash generator',
      'text tools',
      'developer tools',
    ],
    longTail: [
      'UUID v4 generator for database primary key',
      'generate random UUID online free',
      'bulk UUID generator multiple at once',
      'UUID without hyphens',
    ],
    localTerms: [
      'UUID generator pakistan',
      'GUID generator urdu',
      'unique ID pk',
    ],
  },

  'lorem-ipsum': {
    primary: 'lorem ipsum generator',
    secondary: [
      'dummy text',
      'placeholder text',
      'random text generator',
      'lipsum',
      'fake text',
      'design text',
      'sample text',
      'mockup text',
      'Latin text',
      'text generator',
    ],
    questions: [
      'what is lorem ipsum',
      'why use placeholder text',
      'how to generate lorem ipsum',
      'lorem ipsum meaning',
      'where does lorem ipsum come from',
      'dummy text for design',
    ],
    related: [
      'case converter',
      'word counter',
      'markdown editor',
      'text tools',
    ],
    longTail: [
      'lorem ipsum generator by paragraphs words',
      'custom lorem ipsum with HTML tags',
      'random text generator for wireframes',
      'Cicero Latin dummy text',
    ],
    localTerms: [
      'lorem ipsum pakistan',
      'dummy text urdu',
      'placeholder text pk',
    ],
  },
  'cv-builder': {
    primary: 'CV builder',
    secondary: ['resume builder', 'CV maker', 'create CV online', 'professional CV', 'resume creator', 'CV template', 'build resume', 'CV generator', 'online resume builder', 'free CV maker'],
    questions: ['how to create a CV', 'how to make a resume', 'best CV format', 'how to write professional CV', 'CV vs resume difference', 'how to make CV for job'],
    related: ['text-extractor', 'pdf-to-word', 'markdown-editor', 'word-counter'],
    longTail: ['free CV builder online without registration', 'professional resume builder with templates', 'create CV for job application online', 'ATS friendly CV builder free'],
    localTerms: ['CV builder pakistan', 'resume maker urdu', 'CV template pk'],
  },
  
  // ========== IMAGE TOOLS (ADDED) ==========
  'image-filters': {
    primary: 'image filters',
    secondary: [
      'photo filters online',
      'image effects',
      'photo editor online',
      'instagram filters',
      'photo enhancer',
      'image editor free',
      'vintage filter',
      'black and white filter',
      'sepia filter',
      'blur image',
    ],
    questions: [
      'how to apply filters to photos',
      'best photo filter app',
      'how to add vintage effect',
      'how to make photo black and white',
      'how to blur image background',
      'how to enhance photo quality',
    ],
    related: [
      'image-converter',
      'image-compressor',
      'meme-generator',
      'photo-collage',
    ],
    longTail: [
      'apply instagram filters online without app',
      'photo enhancer online free for portraits',
      'vintage photo filter online free',
      'blur image background online tool',
    ],
    localTerms: [
      'photo filters pakistan',
      'image editor urdu',
      'photo effects pk',
    ],
  },

  'image-rotator': {
    primary: 'image rotator',
    secondary: [
      'rotate image online',
      'flip image',
      'photo rotator',
      'rotate photo 90 degrees',
      'image orientation changer',
      'straighten photo',
      'rotate image 180 degrees',
      'flip image horizontally',
      'flip image vertically',
      'rotate image by degrees',
    ],
    questions: [
      'how to rotate an image',
      'how to flip image horizontally',
      'how to rotate image 90 degrees',
      'how to straighten a photo',
      'how to rotate image by custom angle',
      'how to fix image orientation',
    ],
    related: [
      'image-cropper',
      'image-resizer',
      'image-converter',
      'image-filters',
    ],
    longTail: [
      'rotate image by custom angle online',
      'flip image horizontally and vertically online',
      'straighten tilted photo online free',
      'fix image orientation for social media',
    ],
    localTerms: [
      'image rotator pakistan',
      'rotate photo urdu',
      'photo flip pk',
    ],
  },
}; 

/**
 * Get semantic keywords for a tool
 */
export function getSemanticKeywords(toolSlug: string): ToolKeywords | null {
  return semanticKeywords[toolSlug] || null;
}

/**
 * Generate all keywords for a tool (primary + secondary + longTail + localTerms)
 */
export function getAllKeywordsForTool(toolSlug: string): string[] {
  const keywords = semanticKeywords[toolSlug];
  if (!keywords) return [];
  
  return [
    keywords.primary,
    ...keywords.secondary,
    ...keywords.longTail,
    ...keywords.localTerms,
    ...keywords.questions,
  ];
}

/**
 * Generate natural language description with semantic keywords
 */
export function generateSmartDescription(
  toolSlug: string, 
  baseDescription: string
): string {
  const keywords = semanticKeywords[toolSlug];
  if (!keywords) return baseDescription;
  
  // Add 2-3 secondary keywords naturally
  const naturalKeywords = keywords.secondary
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .join(', ');
    
  return `${baseDescription} Perfect for ${naturalKeywords}. Free, no registration required.`;
}

/**
 * Get FAQ structured data questions with semantic intent
 */
export function getToolFAQs(toolSlug: string): Array<{ 
  question: string; 
  answer: string;
  keywords: string[];
}> {
  const keywords = semanticKeywords[toolSlug];
  if (!keywords) return [];
  
  return keywords.questions.map(q => ({
    question: q,
    answer: `Use our free ${keywords.primary} tool to ${q.toLowerCase().replace(/^(how|what|when|where|why|is|are|can|does)/, '').trim()}. 100% free, no signup, works on all devices.`,
    keywords: [keywords.primary, ...keywords.secondary.slice(0, 3)],
  }));
}

/**
 * Get search intent classification
 */
export function getSearchIntent(toolSlug: string): 'informational' | 'commercial' | 'transactional' | 'navigational' {
  // Calculators: transactional (use tool)
  if (toolSlug.includes('calculator')) return 'transactional';
  
  // Image/PDF tools: transactional (use tool)
  if (['image', 'pdf', 'converter', 'generator', 'editor'].some(t => toolSlug.includes(t))) {
    return 'transactional';
  }
  
  // Security/Code tools: transactional (use tool)
  if (['password', 'hash', 'encoder', 'formatter'].some(t => toolSlug.includes(t))) {
    return 'transactional';
  }
  
  // Default
  return 'informational';
}

/**
 * Get related search terms for internal linking
 */
export function getRelatedSearchTerms(toolSlug: string): string[] {
  const keywords = semanticKeywords[toolSlug];
  if (!keywords) return [];
  
  return [
    ...keywords.related,
    ...keywords.secondary.slice(0, 5),
  ];
}

/**
 * Update TOOL_SEO_DATA with semantic keywords
 * Call this function to enhance existing SEO data
 */
export function enhanceToolSEOData() {
  const enhancedData: Record<string, any> = {};
  
  Object.keys(semanticKeywords).forEach(slug => {
    const seoData = TOOL_SEO_DATA[slug];
    const semantic = semanticKeywords[slug];
    
    if (seoData && semantic) {
      enhancedData[slug] = {
        ...seoData,
        semanticKeywords: {
          primary: semantic.primary,
          secondary: semantic.secondary,
          longTail: semantic.longTail,
          localTerms: semantic.localTerms,
        },
        enhancedDescription: generateSmartDescription(slug, seoData.description),
        allKeywords: getAllKeywordsForTool(slug),
        searchIntent: getSearchIntent(slug),
      };
    }
  });
  
  return enhancedData;
}