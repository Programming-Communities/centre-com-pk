'use client';
import { useEffect } from 'react';

interface AdSenseConfigProps {
  publisherId?: string;
}

export default function AdSenseConfig({ publisherId }: AdSenseConfigProps) {
  useEffect(() => {
    const id = publisherId || process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'pub-2850749507378090';
    
    // Add Google AdSense script if not already present
    if (!document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${id}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, [publisherId]);

  return null;
}
