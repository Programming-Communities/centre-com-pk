import { ReactNode, Suspense } from 'react';
import { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { WebVitals } from '@/app/web-vitals';
import PreloadResources from '@/components/PreloadResources';
import ThemeProviderWrapper from '@/components/theme/providers/ThemeProviderWrapper';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#2563eb', width: 'device-width', initialScale: 1, maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.centre.com.pk'),
  title: 'Free Online Tools | Centre.com.pk',
  description: 'Access 55+ free online tools — age calculator, BMI calculator, PDF merger, image compressor, password generator, JSON formatter & more. No registration needed.',
  keywords: 'free online tools, online centre, age calculator, bmi calculator, pdf merger, image compressor, password generator, json formatter, word counter, qr code generator, calculators, converters, Pakistan, India, UK, US',
  applicationName: 'Centre.com.pk',
  robots: { index: true, follow: true },
  icons: { icon: '/logo.svg', apple: '/logo.svg' },
  openGraph: {
    title: 'Free Online Tools | Centre.com.pk',
    description: '55+ free tools: age calculator, BMI, PDF merger, image compressor, password generator & more.',
    url: 'https://www.centre.com.pk',
    type: 'website',
    siteName: 'Centre.com.pk',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Tools | Centre.com.pk',
    description: '55+ free tools: calculators, PDF tools, image tools, security tools & more.',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" style={{backgroundColor:"#0f172a"}} suppressHydrationWarning>
      <head>
        {/* ✅ ADSENSE — Next.js Script Component */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2850749507378090"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        {/* ✅ Ahrefs Analytics */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="w62qYSTRDFmFOmVR0JU9IA"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased min-h-screen bg-background text-text-primary" suppressHydrationWarning>
        <ThemeProviderWrapper>
          <PreloadResources />
          <Suspense fallback={null}>
            {children}
          </Suspense>
          <WebVitals />
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
