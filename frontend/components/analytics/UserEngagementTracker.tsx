// components/analytics/UserEngagementTracker.tsx
'use client';

import { useEffect, useRef } from 'react';

interface EngagementData {
  timeOnPage: number;
  scrollDepth: number;
  clicks: number;
  toolUsed: boolean;
}

export default function UserEngagementTracker({ toolSlug }: { toolSlug: string }) {
  const startTime = useRef(Date.now());
  const maxScroll = useRef(0);
  const clickCount = useRef(0);
  const toolUsed = useRef(false);
  const tracked = useRef(false);

  useEffect(() => {
    // Track scroll depth
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > maxScroll.current) {
        maxScroll.current = scrollPercent;
      }
    };

    // Track clicks
    const handleClick = () => {
      clickCount.current++;
    };

    // Track tool usage (when calculate button is clicked)
    const handleToolUse = () => {
      toolUsed.current = true;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick);

    // Listen for tool usage (custom event from tool.client.tsx)
    window.addEventListener('tool-used', handleToolUse);

    // Send data before page unload
    const handleBeforeUnload = () => {
      if (tracked.current) return;
      tracked.current = true;

      const timeOnPage = Math.round((Date.now() - startTime.current) / 1000);
      
      const data: EngagementData = {
        timeOnPage,
        scrollDepth: maxScroll.current,
        clicks: clickCount.current,
        toolUsed: toolUsed.current,
      };

      // Send to Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'user_engagement', {
          tool: toolSlug,
          time_on_page: timeOnPage,
          scroll_depth: maxScroll.current,
          click_count: clickCount.current,
          tool_used: toolUsed.current,
        });
      }

      // Send beacon for reliability
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/stats',
          JSON.stringify({ toolSlug, ...data })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    // Also send after 30 seconds (for users who stay long)
    const interval = setInterval(() => {
      if (maxScroll.current > 50 && !tracked.current) {
        handleBeforeUnload();
        clearInterval(interval);
      }
    }, 30000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('tool-used', handleToolUse);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(interval);
    };
  }, [toolSlug]);

  return null; // No UI, just tracking
}