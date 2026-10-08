// lib/seo/toolSeoData.ts - ORIGINAL WORKING VERSION
import { ToolSEOData } from './types';

export const TOOL_SEO_DATA: Record<string, ToolSEOData> = {
  // ========== CALCULATORS ==========
  'age-calculator': {
    slug: 'age-calculator',
    category: 'calculators',
    title: 'Age Calculator - Calculate Your Exact Age Online',
    description: 'Free online age calculator. Calculate exact age in years, months, days, hours, and minutes. Perfect for birthday calculations, age verification, and date difference calculations.',
    keywords: ['age calculator', 'birthday calculator', 'date calculator', 'age in days', 'age calculator online', 'how old am i'],
    faqs: [
      {
        question: 'How does the age calculator work?',
        answer: 'Our age calculator uses precise date algorithms to calculate the exact difference between two dates. It considers leap years, month variations, and time zones to give accurate results in years, months, days, hours, and minutes.'
      },
      {
        question: 'Is this age calculator free to use?',
        answer: 'Yes, our age calculator is completely free with no registration required. You can use it unlimited times for personal or professional purposes.'
      },
      {
        question: 'Can I calculate age in different formats?',
        answer: 'Yes, our calculator shows age in multiple formats: total years, months, days, hours, and minutes. You can also see the exact number of days you have lived.'
      }
    ],
    relatedTools: ['date-calculator', 'loan-calculator', 'bmi-calculator'],
    schemaType: 'SoftwareApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'bmi-calculator': {
    slug: 'bmi-calculator',
    category: 'calculators',
    title: 'BMI Calculator - Calculate Body Mass Index Online',
    description: 'Free BMI calculator to check your body mass index. Calculate BMI for adults and children. Get instant results with WHO classification and health recommendations.',
    keywords: ['bmi calculator', 'body mass index', 'bmi calculator online', 'healthy weight', 'bmi chart', 'weight calculator'],
    faqs: [
      {
        question: 'What is BMI and why is it important?',
        answer: 'BMI (Body Mass Index) is a measure of body fat based on height and weight. It helps assess health risks associated with underweight, overweight, and obesity.'
      },
      {
        question: 'Is this BMI calculator accurate?',
        answer: 'Yes, our calculator uses the standard BMI formula (weight in kg ÷ height in m²) recommended by WHO. Results are shown with international classification standards.'
      }
    ],
    relatedTools: ['age-calculator', 'loan-calculator'],
    schemaType: 'SoftwareApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'currency-converter': {
    slug: 'currency-converter',
    category: 'calculators',
    title: 'Currency Converter - Live Exchange Rates Calculator',
    description: 'Free currency converter with live exchange rates. Convert between 150+ currencies with real-time data. Perfect for travelers, investors, and international businesses.',
    keywords: ['currency converter', 'exchange rates', 'forex calculator', 'money converter', 'live currency rates', 'currency calculator'],
    faqs: [
      {
        question: 'How current are the exchange rates?',
        answer: 'We update exchange rates every 5 minutes using reliable financial data sources. Rates are as current as possible for accurate conversions.'
      },
      {
        question: 'How many currencies are supported?',
        answer: 'Our converter supports 150+ world currencies including USD, EUR, GBP, JPY, CNY, INR, AED, and more with real-time conversion.'
      }
    ],
    relatedTools: ['unit-converter', 'loan-calculator'],
    schemaType: 'SoftwareApplication',
    priority: 0.9,
    changefreq: 'daily'
  },

  'date-calculator': {
    slug: 'date-calculator',
    category: 'calculators',
    title: 'Date Calculator - Calculate Days Between Dates',
    description: 'Free date calculator to calculate days between dates, add/subtract days, find weekdays, and countdown to events. Perfect for project planning and event management.',
    keywords: ['date calculator', 'days calculator', 'date difference', 'add days to date', 'working days calculator', 'date counter'],
    faqs: [
      {
        question: 'What can I calculate with this tool?',
        answer: 'You can calculate: days between dates, add/subtract days/weeks/months/years, find weekdays only, count business days, and calculate age from dates.'
      }
    ],
    relatedTools: ['age-calculator', 'loan-calculator'],
    schemaType: 'SoftwareApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'loan-calculator': {
    slug: 'loan-calculator',
    category: 'calculators',
    title: 'Loan Calculator - EMI, Interest & Payment Calculator',
    description: 'Free loan calculator to calculate EMI, interest rates, and payment schedules for home loans, car loans, personal loans, and business loans.',
    keywords: ['loan calculator', 'emi calculator', 'interest calculator', 'home loan calculator', 'car loan calculator', 'mortgage calculator'],
    faqs: [
      {
        question: 'What types of loans can I calculate?',
        answer: 'You can calculate: home loans, car loans, personal loans, education loans, business loans, and any type of fixed-rate installment loan.'
      },
      {
        question: 'How accurate are the calculations?',
        answer: 'Our calculator uses standard financial formulas for EMI calculation: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]. Results match bank calculations.'
      }
    ],
    relatedTools: ['currency-converter', 'percentage-calculator'],
    schemaType: 'SoftwareApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'percentage-calculator': {
    slug: 'percentage-calculator',
    category: 'calculators',
    title: 'Percentage Calculator - Calculate % Increase/Decrease',
    description: 'Free percentage calculator for all percentage calculations: increase/decrease, percentage of a number, percentage difference, and grade calculations.',
    keywords: ['percentage calculator', 'percent calculator', 'percentage increase', 'percentage decrease', 'calculate percentage', 'percent difference'],
    faqs: [
      {
        question: 'What percentage calculations can I do?',
        answer: 'You can calculate: percentage of a number, percentage increase/decrease, percentage difference, X is what percent of Y, and reverse percentages.'
      }
    ],
    relatedTools: ['loan-calculator', 'tip-calculator'],
    schemaType: 'SoftwareApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'tip-calculator': {
    slug: 'tip-calculator',
    category: 'calculators',
    title: 'Tip Calculator - Calculate Restaurant Tips Easily',
    description: 'Free tip calculator to calculate restaurant tips, split bills, and determine fair tips based on service quality. Perfect for dining out and service payments.',
    keywords: ['tip calculator', 'restaurant tip calculator', 'bill splitter', 'gratuity calculator', 'service tip calculator', 'how much to tip'],
    faqs: [
      {
        question: 'How do I calculate a fair tip?',
        answer: 'Enter your bill amount, select tip percentage (15%, 18%, 20% are standard), choose number of people to split, and get individual amounts instantly.'
      }
    ],
    relatedTools: ['percentage-calculator', 'loan-calculator'],
    schemaType: 'SoftwareApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'compound-interest': {
    slug: 'compound-interest',
    category: 'calculators',
    title: 'Compound Interest Calculator - Calculate Investment Growth',
    description: 'Free compound interest calculator to see how investments grow over time. Calculate future value, total interest earned, and investment growth with compound interest.',
    keywords: ['compound interest calculator', 'investment calculator', 'future value calculator', 'savings calculator', 'interest calculator', 'financial calculator'],
    faqs: [
      {
        question: 'What is compound interest?',
        answer: 'Compound interest is interest calculated on the initial principal and also on the accumulated interest of previous periods. It causes wealth to grow faster than simple interest.'
      },
      {
        question: 'How often should interest compound?',
        answer: 'More frequent compounding (monthly vs annually) results in higher returns. Monthly compounding is common for savings accounts, while CDs often compound daily or monthly.'
      },
      {
        question: 'Can I calculate with regular contributions?',
        answer: 'Yes, our calculator allows you to add monthly or annual contributions to see how regular savings combined with compound interest can grow your investment.'
      }
    ],
    relatedTools: ['loan-calculator', 'currency-converter', 'percentage-calculator'],
    schemaType: 'SoftwareApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'gpa-calculator': {
    slug: 'gpa-calculator',
    category: 'calculators',
    title: 'GPA Calculator - Calculate Grade Point Average Online',
    description: 'Free GPA calculator to calculate your grade point average. Calculate semester GPA, cumulative GPA, and see what grades you need to reach your target GPA.',
    keywords: ['gpa calculator', 'grade point average calculator', 'cgpa calculator', 'gpa calculator online', 'calculate gpa', 'college gpa calculator', 'university gpa'],
    faqs: [
      {
        question: 'How is GPA calculated?',
        answer: 'GPA = Total Grade Points ÷ Total Credit Hours. Each letter grade has a point value (A=4, B=3, C=2, D=1, F=0). Multiply grade points by credit hours for each course.'
      },
      {
        question: 'What GPA scales are supported?',
        answer: '4.0 scale (most common), 5.0 scale (weighted), percentage scale, and letter grades. You can also use +/- grades (A-, B+, etc.) with appropriate point values.'
      },
      {
        question: 'Can I calculate cumulative GPA?',
        answer: 'Yes, you can calculate semester GPA, cumulative GPA across multiple semesters, and predict future GPA based on current and planned course grades.'
      }
    ],
    relatedTools: ['percentage-calculator', 'loan-calculator', 'tip-calculator'],
    schemaType: 'SoftwareApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'unit-converter': {
    slug: 'unit-converter',
    category: 'calculators',
    title: 'Unit Converter - Convert Length, Weight, Temperature',
    description: 'Free unit converter for all measurement units: length, weight, temperature, area, volume, speed, time, and data storage. Instant conversions with precision.',
    keywords: ['unit converter', 'measurement converter', 'length converter', 'weight converter', 'temperature converter', 'metric converter'],
    faqs: [
      {
        question: 'What units can I convert?',
        answer: 'You can convert: length (meters, feet, inches), weight (kg, lbs), temperature (C, F, K), area, volume, speed, time, data storage, and cooking measurements.'
      }
    ],
    relatedTools: ['currency-converter', 'percentage-calculator'],
    schemaType: 'SoftwareApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  // ========== CODE TOOLS ==========
  'base64-encoder': {
    slug: 'base64-encoder',
    category: 'code-tools',
    title: 'Base64 Encoder/Decoder - Convert Text to Base64 Online',
    description: 'Free Base64 encoder and decoder tool. Encode text to Base64 for data transmission or decode Base64 back to original text. Supports UTF-8 and binary data.',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 converter', 'encode base64', 'decode base64', 'base64 to text', 'text to base64'],
    faqs: [
      {
        question: 'What is Base64 encoding used for?',
        answer: 'Base64 encodes binary data as ASCII text for safe transmission over media designed for text (email, URLs, JSON). Commonly used for images in data URLs and API authentication.'
      },
      {
        question: 'Does it support Unicode characters?',
        answer: 'Yes, our encoder supports UTF-8 encoding, which means all Unicode characters including emojis and international text can be properly encoded and decoded.'
      }
    ],
    relatedTools: ['url-encoder', 'hash-generator', 'qr-code-generator'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'css-formatter': {
    slug: 'css-formatter',
    category: 'code-tools',
    title: 'CSS Formatter - Beautify & Format CSS Code Online',
    description: 'Free CSS formatter to beautify, minify, and validate CSS code. Fix indentation, remove whitespace, and optimize CSS for better performance and readability.',
    keywords: ['css formatter', 'css beautifier', 'css minifier', 'css validator', 'format css', 'css prettifier', 'css code formatter'],
    faqs: [
      {
        question: 'Why should I format my CSS code?',
        answer: 'Formatted CSS is easier to read, debug, and maintain. Proper indentation and structure help in team collaboration and code review processes.'
      },
      {
        question: 'Can I minify CSS with this tool?',
        answer: 'Yes, you can both beautify (format) and minify (compress) CSS. Minification removes whitespace and comments to reduce file size for production.'
      }
    ],
    relatedTools: ['html-formatter', 'javascript-formatter', 'json-formatter'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'html-formatter': {
    slug: 'html-formatter',
    category: 'code-tools',
    title: 'HTML Formatter - Beautify HTML Code Online',
    description: 'Free HTML formatter to clean, indent, and beautify HTML code. Fix messy HTML, improve readability, and prepare code for production deployment.',
    keywords: ['html formatter', 'html beautifier', 'html minifier', 'format html', 'html prettifier', 'clean html code', 'html validator'],
    faqs: [
      {
        question: 'What HTML features are supported?',
        answer: 'Supports HTML5, fixes indentation, formats attributes, handles nested elements, and can minify HTML by removing whitespace and comments.'
      }
    ],
    relatedTools: ['css-formatter', 'javascript-formatter'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'javascript-formatter': {
    slug: 'javascript-formatter',
    category: 'code-tools',
    title: 'JavaScript Formatter - Beautify JS Code Online',
    description: 'Free JavaScript formatter to beautify, minify, and validate JS code. Fix coding style, improve readability, and optimize JavaScript for production.',
    keywords: ['javascript formatter', 'js beautifier', 'js minifier', 'format javascript', 'js prettifier', 'javascript validator', 'uglify js'],
    faqs: [
      {
        question: 'Does it support modern JavaScript (ES6+)?',
        answer: 'Yes, supports all modern JavaScript features including ES6, ES7, ES8, arrow functions, async/await, classes, and modules with proper formatting.'
      }
    ],
    relatedTools: ['css-formatter', 'html-formatter', 'json-formatter'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'json-formatter': {
    slug: 'json-formatter',
    category: 'code-tools',
    title: 'JSON Formatter - Beautify & Validate JSON Online',
    description: 'Free JSON formatter to beautify, minify, validate, and parse JSON data. Fix invalid JSON, improve readability, and convert JSON to other formats.',
    keywords: ['json formatter', 'json beautifier', 'json validator', 'json minifier', 'format json', 'json parser', 'json viewer'],
    faqs: [
      {
        question: 'Can I validate JSON with this tool?',
        answer: 'Yes, the tool validates JSON syntax and highlights errors with line numbers. It also formats valid JSON with proper indentation and structure.'
      }
    ],
    relatedTools: ['javascript-formatter', 'css-formatter'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'qr-code-generator': {
    slug: 'qr-code-generator',
    category: 'code-tools',
    title: 'QR Code Generator - Create Free QR Codes Online',
    description: 'Free QR code generator to create custom QR codes for URLs, text, contacts, WiFi, and events. Download in PNG, SVG, EPS formats with logo support.',
    keywords: ['qr code generator', 'create qr code', 'free qr code', 'qr code maker', 'custom qr code', 'qr code with logo', 'download qr code'],
    faqs: [
      {
        question: 'What types of QR codes can I create?',
        answer: 'You can create QR codes for: URLs, plain text, contact information (vCard), WiFi networks, email, SMS, phone numbers, and calendar events.'
      },
      {
        question: 'Can I add a logo to my QR code?',
        answer: 'Yes, you can upload your logo and place it in the center of the QR code. The tool ensures the QR remains scannable with the logo.'
      }
    ],
    relatedTools: ['favicon-generator', 'image-converter'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'url-encoder': {
    slug: 'url-encoder',
    category: 'code-tools',
    title: 'URL Encoder/Decoder - Percent Encoding Tool',
    description: 'Free URL encoder and decoder tool. Encode URLs for web safety using percent encoding or decode encoded URLs back to readable format. Supports encodeURI() and encodeURIComponent().',
    keywords: ['url encoder', 'url decoder', 'url encode', 'percent encoding', 'uri encoding', 'url encoding online', 'decode url'],
    faqs: [
      {
        question: 'What\'s the difference between encodeURI and encodeURIComponent?',
        answer: 'encodeURI() encodes complete URLs but preserves :, /, ?, &, =, etc. encodeURIComponent() encodes everything and is used for URL components like query parameters.'
      },
      {
        question: 'When should I URL encode?',
        answer: 'URL encode when including spaces, special characters, or Unicode text in URLs, especially in query parameters, file paths, or when constructing dynamic URLs.'
      }
    ],
    relatedTools: ['base64-encoder', 'hash-generator', 'javascript-formatter'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'xml-formatter': {
    slug: 'xml-formatter',
    category: 'code-tools',
    title: 'XML Formatter - Beautify & Validate XML Online',
    description: 'Free XML formatter to beautify, minify, and validate XML documents. Fix indentation, check syntax errors, and improve XML readability for development and debugging.',
    keywords: ['xml formatter', 'xml beautifier', 'xml validator', 'xml minifier', 'format xml', 'xml prettifier', 'xml parser'],
    faqs: [
      {
        question: 'Does it validate XML syntax?',
        answer: 'Yes, our tool validates XML against standard rules: well-formed structure, proper nesting, closed tags, valid attributes, and entity references.'
      },
      {
        question: 'Can I convert XML to other formats?',
        answer: 'While primarily a formatter, you can beautify (pretty print) or minify (compress) XML. For conversion to JSON or other formats, check our related tools.'
      }
    ],
    relatedTools: ['json-formatter', 'html-formatter', 'javascript-formatter'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  // ========== DESIGN TOOLS ==========
  'color-picker': {
    slug: 'color-picker',
    category: 'design-tools',
    title: 'Color Picker & Converter - Pick Colors & Convert Formats',
    description: 'Free color picker tool with format converter. Pick colors, convert between HEX, RGB, HSL, CMYK, check contrast ratios, and generate color palettes.',
    keywords: ['color picker', 'color converter', 'hex to rgb', 'rgb to hsl', 'color contrast checker', 'color palette generator', 'online color picker'],
    faqs: [
      {
        question: 'What color formats are supported?',
        answer: 'HEX (#RRGGBB), RGB (rgb()), HSL (hsl()), CMYK, and named colors. Convert between all formats with precision and copy with one click.'
      },
      {
        question: 'Can I check color contrast for accessibility?',
        answer: 'Yes, our tool calculates WCAG contrast ratios and shows if colors meet AA/AAA standards for text readability on different backgrounds.'
      }
    ],
    relatedTools: ['css-formatter', 'qr-code-generator', 'favicon-generator'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  // ========== SECURITY TOOLS ==========
  'password-generator': {
    slug: 'password-generator',
    category: 'security-tools',
    title: 'Password Generator - Create Strong & Secure Passwords',
    description: 'Free password generator to create strong, secure passwords. Customize length, include uppercase, lowercase, numbers, symbols. Check password strength and get security tips.',
    keywords: ['password generator', 'strong password generator', 'secure password', 'random password', 'password creator', 'password strength checker'],
    faqs: [
      {
        question: 'What makes a password strong?',
        answer: 'Strong passwords are at least 12 characters long, include uppercase/lowercase letters, numbers, and symbols, and avoid common words or patterns.'
      },
      {
        question: 'Can I generate multiple passwords?',
        answer: 'Yes, you can generate as many passwords as you need. Each generation creates a completely random password based on your selected criteria.'
      }
    ],
    relatedTools: ['hash-generator', 'uuid-generator', 'base64-encoder'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'api-security': {
    slug: 'api-security',
    category: 'security-tools',
    title: 'API Security Scanner - Test API Security Vulnerabilities',
    description: 'Free API security scanner to test REST API endpoints for common vulnerabilities. Check for injection flaws, authentication issues, and data exposure risks.',
    keywords: ['api security', 'api security scanner', 'rest api security', 'api vulnerability scanner', 'api security testing', 'api penetration testing'],
    faqs: [
      {
        question: 'What API security tests are performed?',
        answer: 'Tests for injection attacks, authentication bypass, insecure direct object references, broken authentication, sensitive data exposure, and rate limiting issues.'
      },
      {
        question: 'Is my API data safe during testing?',
        answer: 'Yes, all tests are performed locally or via secure connections. No sensitive API data is stored on our servers, and testing is non-destructive.'
      }
    ],
    relatedTools: ['ssl-checker', 'firewall-tester', 'security-analyzer'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'data-masking': {
    slug: 'data-masking',
    category: 'security-tools',
    title: 'Data Masking Tool - Anonymize Sensitive Data Online',
    description: 'Free data masking tool to anonymize and protect sensitive information. Mask emails, phone numbers, credit cards, and personal data for testing and privacy.',
    keywords: ['data masking', 'data anonymization', 'mask sensitive data', 'data protection tool', 'pii masking', 'data obfuscation', 'privacy tool'],
    faqs: [
      {
        question: 'What types of data can be masked?',
        answer: 'Emails, phone numbers, credit card numbers, social security numbers, names, addresses, dates of birth, and custom patterns using regex.'
      },
      {
        question: 'Why is data masking important?',
        answer: 'Data masking protects sensitive information in non-production environments, prevents data breaches during testing, and helps comply with privacy regulations like GDPR.'
      }
    ],
    relatedTools: ['encryption-tools', 'api-security', 'secure-file-wipe'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'encryption-tools': {
    slug: 'encryption-tools',
    category: 'security-tools',
    title: 'Encryption Tools - Encrypt & Decrypt Data Online',
    description: 'Free encryption tools to secure your data. Encrypt and decrypt text using AES, RSA, Blowfish, and other algorithms. Generate encryption keys and learn about cryptography.',
    keywords: ['encryption tools', 'encrypt text', 'decrypt text', 'aes encryption', 'rsa encryption', 'crypto tools', 'data encryption online'],
    faqs: [
      {
        question: 'What encryption algorithms are supported?',
        answer: 'AES-256 (most secure), RSA, Blowfish, Twofish, Triple DES, and Caesar cipher for basic encryption. Both symmetric and asymmetric encryption available.'
      },
      {
        question: 'Can I encrypt files with this tool?',
        answer: 'Currently supports text encryption/decryption. For file encryption, you can copy file contents as text or use our related secure file tools.'
      }
    ],
    relatedTools: ['hash-generator', 'data-masking', 'password-generator'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'firewall-tester': {
    slug: 'firewall-tester',
    category: 'security-tools',
    title: 'Firewall Tester - Check Firewall Security & Open Ports',
    description: 'Free firewall tester to check your network security. Test open ports, firewall rules, and network vulnerabilities. Ensure your firewall is properly configured and blocking threats.',
    keywords: ['firewall tester', 'port scanner', 'network security tester', 'check open ports', 'firewall security', 'network vulnerability scanner'],
    faqs: [
      {
        question: 'What does the firewall tester check?',
        answer: 'Checks for open ports (common vulnerabilities), tests if firewall is blocking unauthorized access, verifies port forwarding, and identifies potential security risks.'
      },
      {
        question: 'Is it safe to test my firewall?',
        answer: 'Yes, our tests use standard port scanning techniques that are non-invasive. However, always ensure you have permission to test the target network.'
      }
    ],
    relatedTools: ['ssl-checker', 'api-security', 'security-analyzer'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'secure-file-wipe': {
    slug: 'secure-file-wipe',
    category: 'security-tools',
    title: 'Secure File Wiper - Permanently Delete Files Online',
    description: 'Free secure file wipe tool to permanently delete sensitive files. Use military-grade deletion algorithms (DoD 5220.22-M, Gutmann) to prevent data recovery.',
    keywords: ['secure file wipe', 'permanent file deletion', 'file shredder', 'secure delete', 'data destruction', 'file eraser', 'wipe files securely'],
    faqs: [
      {
        question: 'How does secure file wiping work?',
        answer: 'Overwrites file data multiple times with random patterns before deletion, making recovery impossible. Uses algorithms like DoD 5220.22-M (7 passes) and Gutmann (35 passes).'
      },
      {
        question: 'Is this more secure than regular deletion?',
        answer: 'Yes, regular delete only removes file pointers; data remains recoverable. Secure wipe overwrites actual data, making recovery impossible even with forensic tools.'
      }
    ],
    relatedTools: ['data-masking', 'encryption-tools', 'password-generator'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'security-analyzer': {
    slug: 'security-analyzer',
    category: 'security-tools',
    title: 'Security Analyzer - Website & Network Security Check',
    description: 'Free security analyzer to check websites and networks for vulnerabilities. Scan for malware, SSL issues, security headers, and common web application vulnerabilities.',
    keywords: ['security analyzer', 'website security checker', 'vulnerability scanner', 'security audit', 'web security scanner', 'network security analyzer'],
    faqs: [
      {
        question: 'What security aspects are analyzed?',
        answer: 'SSL/TLS configuration, security headers (CSP, HSTS), malware detection, outdated software, open ports, DNS security, and common web vulnerabilities (XSS, SQLi).'
      },
      {
        question: 'How often should I run security analysis?',
        answer: 'Regular security checks (monthly) are recommended, plus after any website changes or when new vulnerabilities are discovered in your technology stack.'
      }
    ],
    relatedTools: ['ssl-checker', 'firewall-tester', 'api-security'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'ssl-checker': {
    slug: 'ssl-checker',
    category: 'security-tools',
    title: 'SSL Checker - Test SSL Certificate & Configuration',
    description: 'Free SSL checker to test website SSL certificates. Check expiration dates, certificate chain, encryption strength, and configuration for security best practices.',
    keywords: ['ssl checker', 'ssl certificate checker', 'https test', 'tls checker', 'certificate validation', 'ssl configuration tester'],
    faqs: [
      {
        question: 'What SSL/TLS issues does this tool detect?',
        answer: 'Expired certificates, incomplete certificate chains, weak encryption algorithms, mixed content issues, HSTS configuration, and protocol support issues.'
      },
      {
        question: 'Why is SSL checking important?',
        answer: 'Proper SSL configuration ensures secure data transmission, builds user trust with HTTPS, improves SEO rankings, and prevents security warnings in browsers.'
      }
    ],
    relatedTools: ['security-analyzer', 'firewall-tester', 'api-security'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'two-factor-auth': {
    slug: 'two-factor-auth',
    category: 'security-tools',
    title: 'Two-Factor Authentication (2FA) - Setup Guide & Tester',
    description: 'Free two-factor authentication guide and tester. Learn how to setup 2FA for accounts, test QR codes, and generate backup codes for popular services.',
    keywords: ['two factor authentication', '2fa setup', 'authenticator app', 'google authenticator', 'microsoft authenticator', '2fa generator', 'multi factor authentication'],
    faqs: [
      {
        question: 'What is two-factor authentication (2FA)?',
        answer: '2FA adds an extra security layer beyond passwords. Requires something you know (password) and something you have (phone app, security key, or SMS code).'
      },
      {
        question: 'Which services support 2FA?',
        answer: 'Most major services: Google, Facebook, Microsoft, Apple, GitHub, Twitter, banking, and crypto exchanges. Our guide shows setup for each platform.'
      }
    ],
    relatedTools: ['password-generator', 'encryption-tools', 'security-analyzer'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'hash-generator': {
    slug: 'hash-generator',
    category: 'security-tools',
    title: 'Hash Generator - Create Cryptographic Hashes (MD5, SHA)',
    description: 'Free hash generator for security applications. Create MD5, SHA-1, SHA-256, SHA-512 hashes for passwords, data integrity verification, and security checks.',
    keywords: ['hash generator', 'md5 generator', 'sha256 generator', 'cryptographic hash', 'password hash', 'checksum generator', 'security hash tool'],
    faqs: [
      {
        question: 'What hash algorithms are best for passwords?',
        answer: 'For password hashing, use SHA-256 or SHA-512 with salt. For modern applications, consider bcrypt or Argon2 which are specifically designed for password hashing.'
      },
      {
        question: 'Can I verify file integrity with hash generator?',
        answer: 'Yes, generate hash for original files and compare with downloaded files. Matching hashes confirm file integrity and no tampering during transfer.'
      }
    ],
    relatedTools: ['password-generator', 'encryption-tools', 'two-factor-auth'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  // ========== IMAGE TOOLS ==========
  'background-remover': {
    slug: 'background-remover',
    category: 'image-tools',
    title: 'Background Remover - Remove Image Background Online',
    description: 'Free background remover to delete backgrounds from images automatically. Remove backgrounds from photos, product images, and portraits in seconds.',
    keywords: ['background remover', 'remove background', 'transparent background', 'image background remover', 'photo background removal', 'bg remover'],
    faqs: [
      {
        question: 'How does automatic background removal work?',
        answer: 'Our AI-powered tool detects foreground objects and removes backgrounds automatically. Works best with clear contrasts between subject and background.'
      },
      {
        question: 'What image formats are supported?',
        answer: 'Supports JPG, PNG, WebP, and BMP formats. You can download results as PNG with transparent background or JPG with custom background color.'
      }
    ],
    relatedTools: ['image-converter', 'image-compressor', 'image-cropper'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'favicon-generator': {
    slug: 'favicon-generator',
    category: 'image-tools',
    title: 'Favicon Generator - Create Free Favicons Online',
    description: 'Free favicon generator to create favicons for websites. Generate ICO, PNG, and SVG favicons in all required sizes for modern browsers and devices.',
    keywords: ['favicon generator', 'create favicon', 'ico generator', 'website icon maker', 'favicon maker', 'favicon.ico generator', 'browser icon'],
    faqs: [
      {
        question: 'What favicon sizes should I generate?',
        answer: 'Generate: 16x16 (browser tab), 32x32 (taskbar), 48x48 (desktop), 180x180 (Apple touch icon), and 192x192 (Android Chrome) for full compatibility.'
      }
    ],
    relatedTools: ['qr-code-generator', 'image-converter'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'image-compressor': {
    slug: 'image-compressor',
    category: 'image-tools',
    title: 'Image Compressor - Reduce Image Size Online',
    description: 'Free image compressor to reduce image file size without losing quality. Compress JPG, PNG, WebP, and GIF images for web and mobile optimization.',
    keywords: ['image compressor', 'compress images', 'reduce image size', 'jpg compressor', 'png compressor', 'photo compressor', 'image optimizer'],
    faqs: [
      {
        question: 'How much can I compress images?',
        answer: 'Compression depends on image content. Typically reduces size by 50-80% without visible quality loss. You can adjust compression level as needed.'
      },
      {
        question: 'Does compression affect image quality?',
        answer: 'Our smart compression maintains visual quality while reducing file size. You can preview results before downloading to ensure quality meets your needs.'
      }
    ],
    relatedTools: ['background-remover', 'image-converter', 'image-resizer'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'image-converter': {
    slug: 'image-converter',
    category: 'image-tools',
    title: 'Image Converter - Convert Images to JPG, PNG, WebP',
    description: 'Free image converter to convert between JPG, PNG, WebP, GIF, BMP, and TIFF formats. Batch conversion, quality adjustment, and format optimization.',
    keywords: ['image converter', 'convert images', 'jpg to png', 'png to jpg', 'webp converter', 'image format converter', 'photo converter'],
    faqs: [
      {
        question: 'What image formats are supported?',
        answer: 'Supports all major formats: JPG/JPEG, PNG, WebP, GIF, BMP, TIFF, and SVG. Convert between any formats with quality and size options.'
      }
    ],
    relatedTools: ['image-compressor', 'image-resizer', 'background-remover'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'image-cropper': {
    slug: 'image-cropper',
    category: 'image-tools',
    title: 'Image Cropper - Crop Photos Online for Free',
    description: 'Free online image cropper to crop photos to exact dimensions. Crop images for social media, websites, and documents with precise aspect ratio control.',
    keywords: ['image cropper', 'crop images', 'photo cropper', 'crop photos online', 'image crop tool', 'crop to size', 'aspect ratio cropper'],
    faqs: [
      {
        question: 'What cropping options are available?',
        answer: 'Free-form cropping, fixed aspect ratios (1:1, 4:3, 16:9), preset sizes for social media (Facebook, Instagram, Twitter), and custom pixel dimensions.'
      }
    ],
    relatedTools: ['image-resizer', 'image-compressor', 'background-remover'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'image-filters': {
    slug: 'image-filters',
    category: 'image-tools',
    title: 'Image Filters - Apply Photo Filters Online',
    description: 'Free image filters to enhance photos online. Apply Instagram-like filters, adjust brightness/contrast, add effects, and create stunning photo edits.',
    keywords: ['image filters', 'photo filters', 'image effects', 'photo editor', 'instagram filters', 'photo enhancer', 'image editor online'],
    faqs: [
      {
        question: 'What filters and effects are available?',
        answer: 'Vintage, black & white, sepia, blur, sharpen, brightness, contrast, saturation, hue, noise reduction, vignette, and Instagram-style filters.'
      }
    ],
    relatedTools: ['image-converter', 'image-compressor', 'meme-generator'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'image-resizer': {
    slug: 'image-resizer',
    category: 'image-tools',
    title: 'Image Resizer - Resize Photos Online for Free',
    description: 'Free image resizer to change image dimensions online. Resize photos for websites, social media, email, and documents while maintaining quality.',
    keywords: ['image resizer', 'resize images', 'photo resizer', 'resize photos online', 'change image size', 'image dimension changer'],
    faqs: [
      {
        question: 'Can I resize multiple images at once?',
        answer: 'Yes, you can upload and resize multiple images simultaneously. All images will be resized to your specified dimensions or percentage scale.'
      },
      {
        question: 'Does resizing affect image quality?',
        answer: 'Our resizer uses smart algorithms to maintain quality during resizing. For best results, avoid extreme size reductions which may cause pixelation.'
      }
    ],
    relatedTools: ['image-compressor', 'image-cropper', 'image-converter'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'image-rotator': {
    slug: 'image-rotator',
    category: 'image-tools',
    title: 'Image Rotator - Rotate & Flip Photos Online',
    description: 'Free image rotator to rotate, flip, and straighten photos online. Fix orientation, rotate 90/180 degrees, flip horizontally/vertically, and adjust angle.',
    keywords: ['image rotator', 'rotate images', 'flip images', 'photo rotator', 'rotate photos online', 'image orientation', 'straighten photos'],
    faqs: [
      {
        question: 'What rotation options are available?',
        answer: 'Rotate 90° left/right, 180°, flip horizontally/vertically, custom angle rotation with degree input, and auto-straighten for tilted images.'
      }
    ],
    relatedTools: ['image-cropper', 'image-resizer', 'image-converter'],
    schemaType: 'WebApplication',
    priority: 0.6,
    changefreq: 'monthly'
  },

  'meme-generator': {
    slug: 'meme-generator',
    category: 'image-tools',
    title: 'Meme Generator - Create Funny Memes Online',
    description: 'Free meme generator to create funny memes with popular templates. Add text to images, create viral memes, and share on social media instantly.',
    keywords: ['meme generator', 'create memes', 'meme maker', 'funny meme generator', 'meme creator online', 'meme templates', 'add text to image'],
    faqs: [
      {
        question: 'Are meme templates provided?',
        answer: 'Yes, we provide popular meme templates (Distracted Boyfriend, Drake, Change My Mind, etc.) plus you can upload your own images to create custom memes.'
      }
    ],
    relatedTools: ['image-filters', 'photo-collage', 'image-converter'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'photo-collage': {
    slug: 'photo-collage',
    category: 'image-tools',
    title: 'Photo Collage Maker - Create Collages Online',
    description: 'Free photo collage maker to combine multiple photos into beautiful collages. Choose from layouts, add borders, adjust spacing, and create stunning photo grids.',
    keywords: ['photo collage', 'collage maker', 'photo grid maker', 'create collage', 'photo montage', 'image collage', 'online collage maker'],
    faqs: [
      {
        question: 'What collage layouts are available?',
        answer: 'Grid layouts (2x2, 3x3), mosaic patterns, free-form arrangements, Instagram-style layouts, and customizable templates with adjustable spacing.'
      }
    ],
    relatedTools: ['meme-generator', 'image-filters', 'image-compressor'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  // ========== PDF TOOLS ==========
  'pdf-compressor': {
    slug: 'pdf-compressor',
    category: 'pdf-tools',
    title: 'PDF Compressor - Reduce PDF File Size Online',
    description: 'Free PDF compressor to reduce PDF file size without losing quality. Compress large PDFs for email, web upload, and storage optimization.',
    keywords: ['pdf compressor', 'compress pdf', 'reduce pdf size', 'pdf optimizer', 'shrink pdf', 'pdf file compressor', 'make pdf smaller'],
    faqs: [
      {
        question: 'How much can PDFs be compressed?',
        answer: 'Compression depends on PDF content. Typically reduces size by 30-70% while maintaining quality. Images and embedded fonts affect compression ratio.'
      },
      {
        question: 'Is PDF compression safe?',
        answer: 'Yes, compression is done locally in your browser. Files are not uploaded to our servers, ensuring complete privacy and security of your documents.'
      }
    ],
    relatedTools: ['pdf-merger', 'pdf-splitter', 'pdf-to-word'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'pdf-merger': {
    slug: 'pdf-merger',
    category: 'pdf-tools',
    title: 'PDF Merger - Combine PDF Files Online',
    description: 'Free PDF merger to combine multiple PDF files into one document. Merge PDFs in any order, rearrange pages, and create unified documents.',
    keywords: ['pdf merger', 'combine pdf', 'merge pdf files', 'join pdf', 'pdf combiner', 'merge multiple pdf', 'pdf unification'],
    faqs: [
      {
        question: 'How many PDFs can I merge at once?',
        answer: 'You can merge up to 20 PDF files simultaneously, with total size limit of 100MB. Reorder files and pages before merging for desired sequence.'
      }
    ],
    relatedTools: ['pdf-splitter', 'pdf-compressor', 'pdf-to-word'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'pdf-splitter': {
    slug: 'pdf-splitter',
    category: 'pdf-tools',
    title: 'PDF Splitter - Split PDF Pages Online',
    description: 'Free PDF splitter to extract pages from PDF documents. Split PDF by page ranges, extract specific pages, and divide large PDFs into smaller files.',
    keywords: ['pdf splitter', 'split pdf', 'extract pdf pages', 'divide pdf', 'pdf page extractor', 'separate pdf pages', 'pdf divider'],
    faqs: [
      {
        question: 'How can I split a PDF?',
        answer: 'Select page ranges (1-5, 6-10), extract every page as separate file, split by odd/even pages, or extract specific page numbers you choose.'
      }
    ],
    relatedTools: ['pdf-merger', 'pdf-compressor', 'pdf-to-word'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'pdf-to-word': {
    slug: 'pdf-to-word',
    category: 'pdf-tools',
    title: 'PDF to Word Converter - Convert PDF to DOCX Online',
    description: 'Free PDF to Word converter to extract text from PDF to editable DOCX format. Convert scanned PDFs, preserve formatting, and edit PDF content in Word.',
    keywords: ['pdf to word', 'convert pdf to word', 'pdf to docx', 'pdf to editable word', 'extract text from pdf', 'pdf converter to word'],
    faqs: [
      {
        question: 'Does formatting remain after conversion?',
        answer: 'Yes, our converter preserves fonts, tables, lists, and layout as much as possible. For scanned PDFs, OCR technology extracts text while maintaining structure.'
      },
      {
        question: 'Can I convert scanned PDFs?',
        answer: 'Yes, we use OCR (Optical Character Recognition) to convert scanned PDFs into editable Word documents. Accuracy depends on scan quality and font clarity.'
      }
    ],
    relatedTools: ['pdf-merger', 'pdf-splitter', 'pdf-compressor'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },


  
  'pdf-protect': {
    slug: 'pdf-protect',
    category: 'pdf-tools',
    title: 'PDF Protect - Password Protect PDF Online Free',
    description: 'Free PDF protector to password protect and encrypt PDF files. Secure your PDF documents with password encryption. No registration, no watermarks.',
    keywords: ['pdf protect', 'protect pdf', 'password protect pdf', 'pdf encryption', 'secure pdf', 'lock pdf', 'pdf password'],
    faqs: [
      {
        question: 'How does PDF protect work?',
        answer: 'PDF protect adds password encryption to your PDF file. Only users with the correct password can open and view the document.'
      },
      {
        question: 'Is PDF protection secure?',
        answer: 'Yes, we use AES-256 encryption standard for PDF protection. Your files are processed locally in the browser and never uploaded to servers.'
      }
    ],
    relatedTools: ['pdf-merger', 'pdf-compressor', 'pdf-splitter'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  // ========== TEXT TOOLS ==========
  'case-converter': {
    slug: 'case-converter',
    category: 'text-tools',
    title: 'Case Converter - Change Text Case Online',
    description: 'Free case converter to change text between uppercase, lowercase, title case, sentence case, and more. Perfect for programming, writing, and formatting text.',
    keywords: ['case converter', 'text case changer', 'uppercase to lowercase', 'title case converter', 'sentence case', 'invert case', 'capitalize text'],
    faqs: [
      {
        question: 'What text cases are supported?',
        answer: 'UPPERCASE, lowercase, Title Case, Sentence case, Capitalize Each Word, tOGGLE cASE, CamelCase, snake_case, kebab-case, and more.'
      }
    ],
    relatedTools: ['character-counter', 'word-counter', 'text-extractor'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'character-counter': {
    slug: 'character-counter',
    category: 'text-tools',
    title: 'Character Counter - Count Characters Online',
    description: 'Free character counter to count characters, words, sentences, and paragraphs. Perfect for social media limits, SEO meta descriptions, and writing constraints.',
    keywords: ['character counter', 'count characters', 'word counter', 'text counter', 'character count tool', 'letter counter', 'text length checker'],
    faqs: [
      {
        question: 'What does the character counter measure?',
        answer: 'Measures: characters (with/without spaces), words, sentences, paragraphs, reading time, speaking time, and shows frequency of words/characters.'
      },
      {
        question: 'Is it useful for social media?',
        answer: 'Yes, shows counts relative to platform limits: Twitter (280 chars), Facebook (63206), Instagram (2200), LinkedIn (3000), and YouTube (5000).'
      }
    ],
    relatedTools: ['word-counter', 'case-converter', 'text-diff'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'lorem-ipsum': {
    slug: 'lorem-ipsum',
    category: 'text-tools',
    title: 'Lorem Ipsum Generator - Dummy Text Generator',
    description: 'Free Lorem Ipsum generator to create placeholder text for designs and layouts. Generate paragraphs, words, bytes, and lists with custom options.',
    keywords: ['lorem ipsum generator', 'dummy text', 'placeholder text', 'random text generator', 'lipsum', 'fake text generator', 'design text'],
    faqs: [
      {
        question: 'What generation options are available?',
        answer: 'Generate by paragraphs, words, bytes, or lists. Choose starting with "Lorem ipsum" or random Latin. Customize word count and paragraph count.'
      }
    ],
    relatedTools: ['markdown-editor', 'case-converter', 'word-counter'],
    schemaType: 'WebApplication',
    priority: 0.6,
    changefreq: 'monthly'
  },

  'markdown-editor': {
    slug: 'markdown-editor',
    category: 'text-tools',
    title: 'Markdown Editor - Online Markdown Editor & Preview',
    description: 'Free online markdown editor with live preview. Write markdown, see instant HTML preview, and export to HTML. Perfect for documentation and blogging.',
    keywords: ['markdown editor', 'online markdown', 'markdown preview', 'markdown to html', 'write markdown', 'markdown converter', 'github markdown'],
    faqs: [
      {
        question: 'What markdown features are supported?',
        answer: 'Headers, bold/italic, lists (ordered/unordered), links, images, code blocks, tables, blockquotes, horizontal rules, and GitHub-flavored markdown.'
      },
      {
        question: 'Can I export to HTML?',
        answer: 'Yes, you can copy the generated HTML or download it as an HTML file. The editor shows both markdown source and rendered HTML side by side.'
      }
    ],
    relatedTools: ['text-diff', 'regex-tester', 'case-converter'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'regex-tester': {
    slug: 'regex-tester',
    category: 'text-tools',
    title: 'Regex Tester - Test Regular Expressions Online',
    description: 'Free regex tester to test and debug regular expressions. Match patterns, extract groups, replace text, and learn regex with examples and cheat sheet.',
    keywords: ['regex tester', 'regular expression tester', 'regex debugger', 'pattern matching', 'regex validator', 'regex online', 'regex matcher'],
    faqs: [
      {
        question: 'What regex flavors are supported?',
        answer: 'Supports JavaScript regex (ECMAScript), PCRE (PHP), Python, Java, and .NET regex flavors with flags (global, case-insensitive, multiline).'
      },
      {
        question: 'Are regex examples provided?',
        answer: 'Yes, we provide common regex patterns for email, phone numbers, URLs, dates, IP addresses, and more with explanations and usage examples.'
      }
    ],
    relatedTools: ['markdown-editor', 'text-diff', 'text-extractor'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'text-diff': {
    slug: 'text-diff',
    category: 'text-tools',
    title: 'Text Diff - Compare & Find Differences Online',
    description: 'Free text diff tool to compare two texts and find differences. Highlight changes, compare code, documents, and track revisions with side-by-side view.',
    keywords: ['text diff', 'compare text', 'difference checker', 'text comparison', 'find differences', 'diff tool', 'text compare online'],
    faqs: [
      {
        question: 'How does the text comparison work?',
        answer: 'Uses line-by-line and character-by-character comparison algorithms. Shows additions (green), deletions (red), and modifications with highlighting.'
      },
      {
        question: 'Can I compare code files?',
        answer: 'Yes, perfect for comparing code versions, configuration files, JSON, XML, and documents. Shows syntax highlighting for programming languages.'
      }
    ],
    relatedTools: ['regex-tester', 'markdown-editor', 'text-extractor'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'text-extractor': {
    slug: 'text-extractor',
    category: 'text-tools',
    title: 'Text Extractor - Extract Text from Images & Files',
    description: 'Free text extractor to extract text from images (OCR), PDFs, and documents. Convert scanned documents, screenshots, and images to editable text.',
    keywords: ['text extractor', 'extract text from image', 'ocr online', 'image to text', 'pdf text extractor', 'scan to text', 'copy text from image'],
    faqs: [
      {
        question: 'What file types are supported?',
        answer: 'Images (JPG, PNG, BMP, TIFF), PDF documents (including scanned PDFs), and screenshots. Extracts text with OCR technology.'
      },
      {
        question: 'How accurate is the OCR extraction?',
        answer: 'Accuracy depends on image quality and font clarity. For clear printed text, accuracy is 95%+. For handwriting or low-quality scans, accuracy varies.'
      }
    ],
    relatedTools: ['pdf-to-word', 'uuid-generator', 'text-diff'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'uuid-generator': {
    slug: 'uuid-generator',
    category: 'text-tools',
    title: 'UUID Generator - Generate Unique Identifiers Online',
    description: 'Free UUID generator to create universally unique identifiers (UUID/GUID). Generate version 1, 3, 4, and 5 UUIDs for databases, APIs, and systems.',
    keywords: ['uuid generator', 'guid generator', 'generate uuid', 'unique identifier', 'uuid v4', 'random uuid', 'uuid online generator'],
    faqs: [
      {
        question: 'What UUID versions are supported?',
        answer: 'UUID v1 (time-based), v3 (MD5 hash), v4 (random), and v5 (SHA-1 hash). Most common is v4 which uses random numbers for maximum uniqueness.'
      },
      {
        question: 'Are UUIDs really unique?',
        answer: 'Yes, the probability of duplicate v4 UUIDs is astronomically low (1 in 2^128). For practical purposes, they can be considered universally unique.'
      }
    ],
    relatedTools: ['text-extractor', 'case-converter', 'lorem-ipsum'],
    schemaType: 'WebApplication',
    priority: 0.7,
    changefreq: 'monthly'
  },

  'word-counter': {
    slug: 'word-counter',
    category: 'text-tools',
    title: 'Word Counter - Count Words Online',
    description: 'Free word counter to count words, characters, sentences, and paragraphs. Analyze text density, reading time, and keyword frequency for SEO and writing.',
    keywords: ['word counter', 'count words', 'text analyzer', 'word count tool', 'character counter', 'reading time calculator', 'text statistics'],
    faqs: [
      {
        question: 'What statistics does it provide?',
        answer: 'Word count, character count (with/without spaces), sentence count, paragraph count, reading time, speaking time, and keyword density analysis.'
      },
      {
        question: 'Is it useful for SEO?',
        answer: 'Yes, helps optimize content length for SEO. Shows ideal ranges for meta descriptions (150-160 chars), titles (50-60 chars), and article lengths.'
      }
    ],
    relatedTools: ['character-counter', 'case-converter', 'text-diff'],
    schemaType: 'WebApplication',
    priority: 0.8,
    changefreq: 'monthly'
  },

  'cv-builder': {
    slug: 'cv-builder',
    category: 'text-tools',
    title: 'CV Builder - Create Professional Resumes Online Free',
    description: 'Free online CV builder with 15+ professional templates, AI-powered suggestions, photo upload, and instant PDF export. Create ATS-friendly resumes with no watermarks or sign-up required.',
    keywords: ['cv builder', 'resume builder', 'free cv maker', 'online resume builder', 'create cv online', 'professional resume maker', 'ats resume builder', 'cv template free', 'resume maker', 'cv maker pakistan'],
    faqs: [
      {
        question: 'Is this CV builder really free?',
        answer: 'Yes, completely free. No watermarks, no sign-up, no hidden charges. Export unlimited PDFs with all features unlocked.'
      },
      {
        question: 'Will my resume pass ATS (Applicant Tracking Systems)?',
        answer: 'Yes, all templates are ATS-optimized with clean formatting, standard fonts, and proper structure that hiring software can parse correctly.'
      },
      {
        question: 'Can I upload my photo?',
        answer: 'Yes, you can upload a professional photo. The tool also lets you add certificates, project screenshots, and manage multiple resume versions.'
      },
      {
        question: 'Are my details safe?',
        answer: 'Yes, all processing happens directly in your browser. Your data never leaves your device and is not stored on our servers.'
      }
    ],
    relatedTools: ['word-counter', 'character-counter', 'text-extractor'],
    schemaType: 'WebApplication',
    priority: 0.9,
    changefreq: 'weekly'
  },
};

// Helper function to get SEO data for a tool
export function getToolSEOData(slug: string): ToolSEOData {
  return TOOL_SEO_DATA[slug] || {
    slug,
    category: 'tools',
    title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Free Online Tool`,
    description: `Free online ${slug.replace(/-/g, ' ')} tool. Useful utility for various purposes.`,
    keywords: [slug, `${slug} tool`, `online ${slug}`, `free ${slug}`],
    faqs: [],
    relatedTools: [],
    schemaType: 'Tool',
    priority: 0.5,
    changefreq: 'monthly'
  };
}

// Get all tool slugs
export function getAllToolSlugs(): string[] {
  return Object.keys(TOOL_SEO_DATA);
}

// Get tools by category
export function getToolsByCategory(category: string): ToolSEOData[] {
  return Object.values(TOOL_SEO_DATA).filter(tool => tool.category === category);
}

// Get all categories
export function getAllCategories(): string[] {
  return Array.from(new Set(Object.values(TOOL_SEO_DATA).map(tool => tool.category)));
}

// Add this function to generate dynamic keywords
export function generateDynamicKeywords(baseKeywords: string[], toolName: string, category: string): string[] {
  const patterns = [
    `how to use ${toolName}`,
    `best ${toolName} online`,
    `${toolName} tutorial`,
    `free ${toolName} without registration`,
    `${toolName} for beginners`,
    `${toolName} step by step guide`,
    `${toolName} vs competitors`,
    `${toolName} alternatives`,
    `top 10 ${toolName}`,
    `best free ${toolName}`,
    `what is ${toolName}`,
    `why use ${toolName}`,
    `when to use ${toolName}`,
    `where to find ${toolName}`,
    `${toolName} in pakistan`,
    `${toolName} urdu tutorial`,
    `free ${toolName} for pakistani users`,
    `${toolName} api`,
    `${toolName} integration`,
    `${toolName} download`,
    `${toolName} source code`,
  ];
  
  return [...baseKeywords, ...patterns];
}