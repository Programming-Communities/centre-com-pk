'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PreloadResources() {
  const pathname = usePathname();

  useEffect(() => {
    // ✅ CONDITIONAL FONT PRELOAD — Only for Urdu/Arabic
    const lang = document.documentElement.lang || 'en';
    if (lang === 'ur' || lang === 'ar') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/ttf';
      link.crossOrigin = 'anonymous';
      link.href = '/fonts/JameelNooriNastaleeq.ttf';
      document.head.appendChild(link);
    }
  }, [pathname]);

  return null;
}

export default PreloadResources;