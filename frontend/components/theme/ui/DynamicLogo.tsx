"use client";

import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { memo } from 'react';

interface DynamicLogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'color' | 'white';
}

const DynamicLogo = memo(function DynamicLogo({ 
  className = '', 
  width = 40, 
  height = 40,
  variant = 'color'
}: DynamicLogoProps) {
  const { themeColors } = useTheme();

  // Choose fill color based on variant
  const fillColor = variant === 'white' 
    ? '#FFFFFF' 
    : themeColors?.primary || '#2563EB';

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
      }}
    >
      <svg 
        version="1.0" 
        xmlns="http://www.w3.org/2000/svg"
        width="100%" 
        height="100%" 
        viewBox="0 0 512 512"
        preserveAspectRatio="xMidYMid meet"
        style={{ 
          display: 'block',
          filter: variant === 'white' ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none'
        }}
      >
        <g 
          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" 
          fill={fillColor} 
          stroke="none"
        >
          {/* Key paths - only essential ones to keep it clean */}
          <path d="M2395 3904 c-199 -47 -280 -88 -396 -204 -98 -97 -151 -183 -187 -305 -31 -103 -34 -256 -7 -360 115 -451 620 -670 1022 -443 57 32 203 162 203 180 0 6 -23 -11 -51 -36 -59 -53 -167 -109 -255 -131 -76 -19 -224 -19 -300 0 -175 46 -324 170 -406 340 -93 191 -90 391 8 578 156 296 527 420 816 273 81 -41 89 -33 12 13 -98 59 -215 93 -335 97 -58 2 -114 1 -125 -2z"/>
          <path d="M2570 3814 c-106 -16 -156 -31 -229 -66 -198 -95 -331 -309 -331 -532 0 -118 59 -273 140 -368 55 -62 172 -140 257 -169 98 -34 260 -34 355 0 69 25 200 106 207 129 2 8 -19 -3 -47 -23 -72 -52 -153 -75 -261 -75 -130 0 -256 50 -355 140 -23 21 -52 41 -66 45 -75 23 -115 88 -106 169 8 63 8 75 5 206 -1 85 2 117 20 168 57 167 183 294 340 342 35 11 76 20 92 20 16 0 29 5 29 10 0 10 -4 10 -50 4z"/>
          <path d="M2471 3384 c-60 -30 -100 -82 -108 -141 -5 -37 -7 -39 -37 -35 -42 5 -116 -36 -140 -78 -38 -64 -17 -157 44 -193 31 -19 270 -33 270 -17 0 6 -11 10 -25 10 -14 0 -25 5 -25 10 0 6 11 10 25 10 14 0 25 5 25 10 0 6 -11 10 -25 10 -14 0 -25 5 -25 10 0 6 11 10 25 10 14 0 25 5 25 10 0 6 -11 10 -25 10 -16 0 -25 6 -25 15 0 9 9 15 25 15 14 0 25 5 25 10 0 6 -11 10 -25 10 -14 0 -25 5 -25 10 0 6 11 10 25 10 15 0 25 6 25 15 0 8 9 19 20 25 11 6 20 20 20 30 0 12 7 20 16 20 10 0 14 -7 12 -22 -2 -11 3 -23 11 -26 10 -3 13 2 9 22 -4 18 -1 26 8 26 8 0 14 -11 14 -25 0 -14 5 -25 10 -25 6 0 10 11 10 25 0 16 6 25 16 25 9 0 14 -7 12 -17 -1 -10 2 -20 7 -23 6 -3 11 5 13 18 4 27 22 29 22 2 0 -10 9 -24 20 -30 11 -6 20 -17 20 -25 0 -9 10 -15 25 -15 14 0 25 -4 25 -10 0 -5 -11 -10 -25 -10 -14 0 -25 -4 -25 -10 0 -5 11 -10 25 -10 16 0 25 -6 25 -15 0 -9 -9 -15 -25 -15 -14 0 -25 -4 -25 -10 0 -5 11 -10 25 -10 14 0 25 -4 25 -10 0 -5 -11 -10 -25 -10 -14 0 -25 -4 -25 -10 0 -5 11 -10 25 -10 14 0 25 -4 25 -10 0 -5 -11 -10 -25 -10 -14 0 -25 -4 -25 -10 0 -16 224 -13 263 4 45 19 68 48 74 94 9 67 -43 132 -107 132 -15 0 -20 6 -20 26 0 69 -97 142 -155 116 -22 -10 -27 -7 -51 28 -35 50 -112 90 -175 90 -30 0 -65 -9 -99 -26z"/>
        </g>
      </svg>
    </div>
  );
});

export default DynamicLogo;