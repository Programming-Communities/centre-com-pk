import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Calculators Suite - Enterprise-Grade Financial, Health & Business Tools",
  description: "100+ advanced calculators for finance, health, business & science. AI-powered analytics, real-time calculations, export to Excel/PDF, API access. Better than Calculator.net & OmniCalculator.",
  keywords: `advanced calculators, financial calculator, investment calculator, business calculator, 
            health calculator, scientific calculator, real-time calculations, AI calculator, 
            excel export calculator, PDF report calculator, professional calculator suite,
            enterprise calculator tools, online calculation software`,
  
  openGraph: {
    title: "Professional Calculators Suite - Advanced Calculation Platform",
    description: "Enterprise-grade calculators with AI insights, real-time analytics & export features. Free alternative to expensive calculation software.",
    type: "website",
    url: "https://www.centre.com.pk/tools/calculators",
    siteName: "Centre.com.pk - Professional Tools Platform",
    images: [
      {
        url: "/api/og-image?title=Professional%20Calculators&description=Advanced%20Calculation%20Tools&category=calculators",
        width: 1200,
        height: 630,
        alt: "Centre.com.pk - Professional Calculators Dashboard",
      },
    ],
    locale: 'en_US',
    // FIXED: Removed publishedTime & modifiedTime (not valid for type 'website')
    // publishedTime: new Date().toISOString(), // ❌ REMOVED
    // modifiedTime: new Date().toISOString(),   // ❌ REMOVED
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Professional Calculators Suite - Advanced Tools Platform",
    description: "100+ enterprise-grade calculators for professionals. AI-powered, real-time, export to Excel/PDF.",
    images: ["/api/og-image?title=Professional%20Calculators&description=Advanced%20Calculation%20Tools&category=calculators"],
    creator: "@centerspk",
    site: "@centerspk",
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
      // FIXED: Duplicate property removed
      // "max-image-preview": "standard", // ❌ DUPLICATE - REMOVED
    },
  },
  
  alternates: {
    canonical: "https://www.centre.com.pk/tools/calculators",
    languages: {
      'en-US': 'https://www.centre.com.pk/tools/calculators',
      'x-default': 'https://www.centre.com.pk/tools/calculators',
    },
  },
  
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
  },
  
  category: "Technology & Software",
  // FIXED: 'classification' is not a valid Metadata property
  // classification: "Web Applications, Calculation Software, Business Tools", // ❌ REMOVED
  
  other: {
    'application-name': 'Centre.com.pk Calculators',
    'apple-mobile-web-app-title': 'Centre.com.pk Calculators',
    'msapplication-TileColor': '#2563eb',
    'theme-color': '#2563eb',
    // Add classification here instead
    'classification': 'Web Applications, Calculation Software, Business Tools',
  },
};

// Schema.org JSON-LD for Calculator Collection
export const calculatorSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Professional Calculator Collection",
  "description": "Collection of advanced calculators for professionals",
  "numberOfItems": 10,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": "BMI Calculator",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "SoftwareApplication",
        "name": "Age Calculator",
        "applicationCategory": "LifestyleApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "SoftwareApplication",
        "name": "Loan Calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    },
    // Add remaining 7 calculators...
  ]
};