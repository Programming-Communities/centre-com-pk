// components/seo/RankingFactors.tsx
'use client';

import { useEffect, useRef } from 'react';
import { RankingFactorsProps } from './types';

export default function RankingFactors({
  pageUrl,
  trackEngagement = true,
  trackScroll = true,
  trackClicks = true,
  trackTime = true,
}: RankingFactorsProps) {
  const pageLoadTime = useRef<number>(Date.now());
  const scrollDepth = useRef<number>(0);
  const timeOnPage = useRef<number>(0);
  const clickCount = useRef<number>(0);

  useEffect(() => {
    if (!trackEngagement) return;

    // Track page load performance
    const trackPerformance = () => {
      if (window.performance && window.performance.timing) {
        const { navigationStart, loadEventEnd } = window.performance.timing;
        const loadTime = loadEventEnd - navigationStart;
        
        // Send to analytics (you would replace with your actual analytics)
        console.log('Page Load Time:', loadTime, 'ms');
        
        // Core Web Vitals tracking
        if (window.performance.getEntriesByType) {
          const paintEntries = window.performance.getEntriesByType('paint');
          paintEntries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              console.log('FCP:', entry.startTime, 'ms');
            }
          });
        }
      }
    };

    // Track scroll depth
    const trackScrollDepth = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      
      const currentDepth = Math.round((scrollTop + clientHeight) / scrollHeight * 100);
      if (currentDepth > scrollDepth.current) {
        scrollDepth.current = currentDepth;
        
        // Log depth milestones
        if ([25, 50, 75, 90, 100].includes(currentDepth)) {
          console.log(`Scroll Depth: ${currentDepth}%`);
          
          // Send to analytics
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'scroll_depth', {
              event_category: 'engagement',
              event_label: pageUrl || window.location.pathname,
              value: currentDepth,
            });
          }
        }
      }
    };

    // Track time on page
    const startTimeTracking = () => {
      const interval = setInterval(() => {
        timeOnPage.current += 1;
        
        // Log time milestones (every 30 seconds)
        if (timeOnPage.current % 30 === 0) {
          console.log(`Time on page: ${timeOnPage.current} seconds`);
          
          // Send to analytics
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'time_on_page', {
              event_category: 'engagement',
              event_label: pageUrl || window.location.pathname,
              value: timeOnPage.current,
            });
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    };

    // Track clicks
    const trackClickEvents = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const clickableElement = target.closest('a, button, [role="button"]');
      
      if (clickableElement) {
        clickCount.current += 1;
        
        // Get element info
        const tagName = clickableElement.tagName.toLowerCase();
        const text = clickableElement.textContent?.trim().substring(0, 50) || '';
        const href = clickableElement.getAttribute('href') || '';
        
        console.log(`Click #${clickCount.current}: ${tagName} - ${text}`);
        
        // Send to analytics
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', 'click', {
            event_category: 'engagement',
            event_label: `${tagName}: ${text}`,
            value: clickCount.current,
          });
        }
      }
    };

    // Track beforeunload for final metrics
    const trackUnload = () => {
      const totalTime = Math.round((Date.now() - pageLoadTime.current) / 1000);
      
      console.log('Page Session Summary:', {
        totalTime,
        maxScrollDepth: scrollDepth.current,
        totalClicks: clickCount.current,
        url: pageUrl || window.location.href,
      });
      
      // Send final analytics
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'page_session', {
          event_category: 'engagement',
          event_label: pageUrl || window.location.pathname,
          total_time: totalTime,
          scroll_depth: scrollDepth.current,
          click_count: clickCount.current,
        });
      }
    };

    // Initialize tracking
    trackPerformance();
    
    // Set up event listeners
    if (trackScroll) {
      window.addEventListener('scroll', trackScrollDepth, { passive: true });
    }
    
    if (trackClicks) {
      document.addEventListener('click', trackClickEvents);
    }
    
    if (trackTime) {
      const timeInterval = startTimeTracking();
    }
    
    window.addEventListener('beforeunload', trackUnload);
    
    // LCP (Largest Contentful Paint) tracking
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime, 'ms');
        });
        
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (error) {
        console.log('LCP tracking not supported');
      }
    }
    
    // CLS (Cumulative Layout Shift) tracking
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        const clsEntries: any[] = [];
        
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              clsEntries.push(entry);
            }
          }
          
          console.log('Current CLS value:', clsValue);
        });
        
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        
        // Report final CLS on visibility change
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') {
            console.log('Final CLS:', clsValue);
            
            // Send to analytics
            if (typeof window.gtag !== 'undefined') {
              window.gtag('event', 'web_vitals', {
                event_category: 'Core Web Vitals',
                event_label: pageUrl || window.location.pathname,
                value: Math.round(clsValue * 1000),
                non_interaction: true,
              });
            }
          }
        });
      } catch (error) {
        console.log('CLS tracking not supported');
      }
    }
    
    // Cleanup
    return () => {
      if (trackScroll) {
        window.removeEventListener('scroll', trackScrollDepth);
      }
      
      if (trackClicks) {
        document.removeEventListener('click', trackClickEvents);
      }
      
      window.removeEventListener('beforeunload', trackUnload);
      trackUnload(); // Final report
    };
  }, [trackEngagement, trackScroll, trackClicks, trackTime, pageUrl]);

  return null;
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}