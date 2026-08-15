// components/seo/PerformanceScripts.tsx - FIXED VERSION
'use client';

import { useEffect } from 'react';

export default function PerformanceScripts() {
  useEffect(() => {
    // Preconnect to critical origins
    const preconnect = (url: string) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Preconnect to Google Fonts
    preconnect('https://fonts.googleapis.com');
    preconnect('https://fonts.gstatic.com');

    // Lazy load non-critical images
    const lazyLoadImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            
            // FIXED: Use proper type checking
            if (img.hasAttribute('data-src')) {
              const dataSrc = img.getAttribute('data-src');
              if (dataSrc) {
                img.src = dataSrc;
                img.removeAttribute('data-src');
              }
            }
            
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px 50px 0px',
      });
      
      images.forEach(img => imageObserver.observe(img));
    };

    // Prefetch likely next pages
    const prefetchPages = () => {
      const links = ['/tools', '/tools/calculators', '/tools/image-tools'];
      
      links.forEach(link => {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = link;
        prefetchLink.as = 'document';
        document.head.appendChild(prefetchLink);
      });
    };

    // Load non-critical resources after user interaction
    const loadLazyResources = () => {
      // Load analytics after user interaction
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          // Load non-critical scripts here
          console.log('Loading lazy resources...');
        });
      }
    };

    // Add event listener for user interaction
    const handleUserInteraction = () => {
      loadLazyResources();
      
      // Remove event listeners
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('mousemove', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };

    // Run immediate optimizations
    lazyLoadImages();
    prefetchPages();

    // Add event listeners for delayed optimizations
    document.addEventListener('scroll', handleUserInteraction, { once: true, passive: true });
    document.addEventListener('mousemove', handleUserInteraction, { once: true, passive: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true, passive: true });
    document.addEventListener('click', handleUserInteraction, { once: true });

    // Cleanup
    return () => {
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('mousemove', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  return null;
}