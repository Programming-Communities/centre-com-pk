// app/[lang]/tools/layout.tsx - COLLAPSIBLE SIDEBARS (NO GAP VERSION)
import { Metadata } from 'next';
import CollapsibleSidebarAd from '@/components/ads/CollapsibleSidebarAd';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  
  const metadataMap: Record<string, any> = {
    en: {
      title: 'Free Online Tools - Calculators, Converters & More | Centre.com.pk',
      description: '100+ free online tools including calculators, converters, formatters, image tools, PDF tools, security tools, and more. No registration required.',
      keywords: 'online tools, free tools, calculators, converters, formatters, image tools, PDF tools, security tools',
    },
    ur: {
      title: 'مفت آن لائن ٹولز - کیلکولیٹرز، کنورٹرز اور مزید | Centre.com.pk',
      description: '100+ مفت آن لائن ٹولز: کیلکولیٹرز، کنورٹرز، فارمیٹرز، امیج ٹولز، پی ڈی ایف ٹولز، سیکیورٹی ٹولز۔ رجسٹریشن کی ضرورت نہیں۔',
      keywords: 'آن لائن ٹولز, مفت ٹولز, کیلکولیٹرز, کنورٹرز, فارمیٹرز',
    },
    hi: {
      title: 'मुफ्त ऑनलाइन टूल्स - कैलकुलेटर, कन्वर्टर्स और अधिक | Centre.com.pk',
      description: '100+ मुफ्त ऑनलाइन टूल्स: कैलकुलेटर, कन्वर्टर्स, फॉर्मेटर्स, इमेज टूल्स, पीडीएफ टूल्स, सुरक्षा टूल्स। कोई पंजीकरण आवश्यक नहीं।',
      keywords: 'ऑनलाइन टूल्स, मुफ्त टूल्स, कैलकुलेटर, कन्वर्टर्स',
    },
    ar: {
      title: 'أدوات مجانية عبر الإنترنت - الآلات الحاسبة والمحولات والمزيد | Centre.com.pk',
      description: '100+ أداة مجانية عبر الإنترنت: الآلات الحاسبة، المحولات، المنسقات، أدوات الصور، أدوات PDF، أدوات الأمان. لا حاجة للتسجيل.',
      keywords: 'أدوات عبر الإنترنت, أدوات مجانية, آلات حاسبة, محولات',
    },
  };
  
  const meta = metadataMap[lang] || metadataMap.en;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      url: `https://www.centre.com.pk/${lang}/tools`,
      siteName: 'Centre.com.pk',
      images: [{ url: '/og-tools.png', width: 1200, height: 630 }],
      locale: lang === 'ur' ? 'ur_PK' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AE' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['/og-tools.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `https://www.centre.com.pk/${lang}/tools`,
      languages: {
        'en': 'https://www.centre.com.pk/tools',
        'ur': 'https://www.centre.com.pk/ur/tools',
        'hi': 'https://www.centre.com.pk/hi/tools',
        'ar': 'https://www.centre.com.pk/ar/tools',
      },
    },
  };
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex relative min-h-screen bg-background w-full" suppressHydrationWarning>
      
      {/* ============================================ */}
      {/* LEFT COLLAPSIBLE SIDEBAR                     */}
      {/* ============================================ */}
      <CollapsibleSidebarAd position="left" />

      {/* ============================================ */}
      {/* MAIN CONTENT — Auto-expands to full width    */}
      {/* ============================================ */}
      <main 
        className="flex-1 min-w-0 w-full transition-all duration-300 bg-background" 
        id="main-content" 
        suppressHydrationWarning
      >
        {children}
      </main>

      {/* ============================================ */}
      {/* RIGHT COLLAPSIBLE SIDEBAR                    */}
      {/* ============================================ */}
      <CollapsibleSidebarAd position="right" />
      
    </div>
  );
}