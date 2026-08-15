'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

export default function CentersLoader({ fullScreen = true, size = 'md' }: { fullScreen?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const theme = useTheme();
  const [showSubtitle, setShowSubtitle] = useState(false);
  
  const primary = theme.themeColors?.primary || '#3b82f6';
  const secondary = theme.themeColors?.secondary || '#8b5cf6';
  const isDark = theme.isDarkMode || false;
  const fontFamily = theme.fontFamily || 'system-ui, sans-serif';
  
  const sizes = { sm: 50, md: 70, lg: 90 };
  const s = sizes[size];
  const borderW = size === 'sm' ? 3 : 4;

  useEffect(() => {
    const t = setTimeout(() => setShowSubtitle(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: fullScreen ? 'fixed' : 'absolute', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: isDark ? '#0f172a' : '#ffffff', fontFamily }}>
      <div style={{ position: 'relative', width: s + 'px', height: s + 'px', marginBottom: '28px' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: borderW + 'px solid transparent', borderTopColor: primary, borderRightColor: secondary, borderBottomColor: primary + '40', borderLeftColor: secondary + '40', animation: 'spin 1s linear infinite', position: 'absolute', top: 0, left: 0, boxShadow: '0 0 30px ' + primary + '20' }} />
        <div style={{ width: '75%', height: '75%', borderRadius: '50%', border: borderW + 'px solid transparent', borderTopColor: secondary, borderLeftColor: primary, animation: 'spin 0.7s linear infinite reverse', position: 'absolute', top: '12.5%', left: '12.5%' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: size === 'sm' ? '8px' : size === 'lg' ? '14px' : '11px', fontWeight: 800, background: 'linear-gradient(135deg, ' + primary + ', ' + secondary + ')', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', lineHeight: 1.2 }}>Centers<br/>.pk</span>
        </div>
      </div>
      <div style={{ fontSize: size === 'sm' ? '12px' : '14px', color: isDark ? '#94a3b8' : '#64748b', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 400, opacity: showSubtitle ? 1 : 0, transform: showSubtitle ? 'translateY(0)' : 'translateY(6px)', transition: 'all 0.5s ease-out' }}>Free Online Tools Platform</div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
