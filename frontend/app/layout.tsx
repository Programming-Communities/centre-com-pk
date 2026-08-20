import { ReactNode, Suspense } from 'react';
import { Metadata, Viewport } from 'next';
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
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="w62qYSTRDFmFOmVR0JU9IA" async />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        <style dangerouslySetInnerHTML={{
          __html: `
            body { margin:0; font-family:system-ui,-apple-system,sans-serif; background-color:#0f172a; color:#f1f5f9; min-height:100vh; }
            .flex { display:flex; }
            .flex-col { flex-direction:column; }
            .min-h-screen { min-height:100vh; }
            .items-center { align-items:center; }
            .justify-center { justify-content:center; }
            .pt-16 { padding-top:4rem; }
            .bg-background { background-color:var(--background,#0f172a); }
            .text-white { color:#fff; }
            .font-bold { font-weight:700; }
            .text-2xl { font-size:1.5rem; }
            .text-lg { font-size:1.125rem; }
            .mt-4 { margin-top:1rem; }
            .rounded-lg { border-radius:0.5rem; }
            .px-4 { padding-inline:1rem; }
            .py-2 { padding-block:0.5rem; }
            .bg-blue-600 { background-color:#2563eb; }
            .gap-4 { gap:1rem; }
            .container { width:100%; max-width:1200px; margin-inline:auto; padding-inline:1rem; }
          `
        }} />
        
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var theme = localStorage.getItem('theme') || 'dark';
            document.documentElement.className = theme;
            document.documentElement.style.backgroundColor = theme === 'dark' ? '#0f172a' : '#ffffff';
          })();
        `}} />
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