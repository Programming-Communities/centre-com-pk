'use client';
import { useEffect, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import CentersLoader from './CentersLoader';

export default function GlobalLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // INSTANT show — no delay
    setLoading(true);
    
    // Hide after page fully renders
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Smooth fade out
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return <CentersLoader fullScreen={true} />;
}
