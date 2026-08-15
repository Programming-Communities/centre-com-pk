'use client';
import { ReactNode, useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayoutClient({ children, lang }: { children: ReactNode; lang: string }) {
  const { themeColors, isDarkMode } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Listen for sidebar collapse state from localStorage or event
    const savedState = localStorage.getItem('admin_sidebar_collapsed');
    if (savedState !== null) {
      setCollapsed(savedState === 'true');
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save collapse state
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('admin_sidebar_collapsed', String(collapsed));
    }
  }, [collapsed, mounted]);

  const bg = themeColors?.background || (isDarkMode ? '#0f172a' : '#f8fafc');
  const marginLeft = isMobile ? 0 : (collapsed ? 64 : 260);

  if (!mounted) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bg }}>
        <div style={{ width: '260px' }} />
        <main style={{ flex: 1, padding: '24px' }}>{children}</main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bg }}>
      <AdminSidebar lang={lang} onCollapseChange={setCollapsed} />
      <main style={{
        flex: 1,
        marginLeft: `${marginLeft}px`,
        padding: isMobile ? '70px 16px 16px 16px' : '24px',
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
