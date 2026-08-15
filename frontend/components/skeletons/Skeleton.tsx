'use client';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

export default function Skeleton({ width = '100%', height = '20px', borderRadius = '6px' }: SkeletonProps) {
  const { isDarkMode } = useTheme();
  
  const bgColor = isDarkMode ? '#1e293b' : '#f1f5f9';
  const bgColor2 = isDarkMode ? '#334155' : '#e2e8f0';
  
  return (
    <div style={{
      width: typeof width === 'number' ? width + 'px' : width,
      height: typeof height === 'number' ? height + 'px' : height,
      borderRadius: borderRadius,
      backgroundColor: bgColor,
      backgroundImage: `linear-gradient(90deg, ${bgColor} 0%, ${bgColor2} 50%, ${bgColor} 100%)`,
      backgroundSize: '200% 100%',
      animation: 'skeleton-pulse 1.5s ease-in-out infinite',
      marginBottom: '8px'
    }} />
  );
}
