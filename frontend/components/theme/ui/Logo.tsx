"use client";

import { memo } from 'react';

interface FullLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const FullLogo = memo(function FullLogo({ 
  className = '', 
  width = 40,
  height = 40,
}: FullLogoProps) {
  // SIMPLE SVG LOGO - No hydration issues
  return (
    <div 
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width, height }}
      aria-label="centre.com.pk"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <title>centre.com.pk - Free Online Tools</title>
        <circle 
          cx="20" 
          cy="20" 
          r="14" 
          stroke="#2563EB" 
          strokeWidth="2.5" 
          fill="none"
        />
        <circle 
          cx="28" 
          cy="20" 
          r="3" 
          fill="#1D4ED8"
        />
      </svg>
    </div>
  );
});

FullLogo.displayName = 'FullLogo';

export default FullLogo;