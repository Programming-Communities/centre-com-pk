// lib/performance.ts
export const reportWebVitals = (metric: any) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics
    const body = JSON.stringify(metric);
    navigator.sendBeacon('/api/analytics', body);
  }
  
  console.log(metric);
};

export const measurePerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const paintMetrics = performance.getEntriesByType('paint');
    const navigationMetrics = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      fcp: paintMetrics.find(metric => metric.name === 'first-contentful-paint')?.startTime || 0,
      lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime || 0,
      fid: performance.getEntriesByName('first-input')[0]?.duration || 0,
      cls: (performance as any).getCLS ? (performance as any).getCLS() : 0,
      ttfb: navigationMetrics?.responseStart || 0,
    };
  }
  return null;
};