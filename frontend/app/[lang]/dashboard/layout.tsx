'use client';
import { ReactNode, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import ProSidebar from '@/components/dashboard/pro/ProSidebar';
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { lang } = useParams() as { lang: string };
  const { themeColors, isDarkMode } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ FIX: mounted=false pe hardcoded light colors (server = client, no mismatch)
  if (!mounted) {
    return (
      <div
        suppressHydrationWarning
        style={{
          display: 'flex',
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
        }}
      />
    );
  }

  // ✅ FIX: Ab colors calculate karo (mounted=true ke baad)
  const bg = themeColors?.background || (isDarkMode ? '#0f172a' : '#f8fafc');
  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');

  return (
    <div
      suppressHydrationWarning
      style={{ display: 'flex', minHeight: '100vh', backgroundColor: bg }}
    >
      {/* SIDEBAR */}
      <ProSidebar
        lang={lang}
        role="user"
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* MAIN CONTENT */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          marginLeft: isMobile ? '0px' : '250px',
          padding: isMobile ? '64px 12px 80px 12px' : '20px 24px',
          maxWidth: isMobile ? '100%' : 'calc(100% - 250px)',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* MOBILE HAMBURGER — Fixed top-left, below header */}
        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(true)}
            style={{
              position: 'fixed',
              top: '66px',
              left: '12px',
              zIndex: 100,
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: surface,
              color: textPrimary,
              border: `1px solid ${border}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>
        )}

        {children}
      </main>
    </div>
  );
}