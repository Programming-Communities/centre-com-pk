'use client';
import { ReactNode, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import ProSidebar from '@/components/dashboard/pro/ProSidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { lang } = useParams() as { lang: string };
  const { themeColors, isDarkMode } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const saved = localStorage.getItem('dashboard_sidebar_collapsed');
    if (saved !== null) {
      setCollapsed(saved === 'true');
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const bg = themeColors?.background || (isDarkMode ? '#0f172a' : '#f8fafc');
  const marginLeft = isMobile ? 0 : (collapsed ? 64 : 260);

  if (!mounted) {
    return <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bg }} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bg }}>
      <ProSidebar lang={lang} role="user" onCollapseChange={setCollapsed} />
      <main style={{
        flex: 1,
        marginLeft: `${marginLeft}px`,
        padding: isMobile ? '70px 16px 16px 16px' : '30px',
        transition: 'margin-left 0.3s ease',
        maxWidth: '100%',
        overflowX: 'hidden',
        boxSizing: 'border-box'
      }}>
        {children}
      </main>
    </div>
  );
}
