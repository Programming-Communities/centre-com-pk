'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Menu } from 'lucide-react';

function AdminLayoutContent({ children, lang }: { children: ReactNode; lang: string }) {
  const { themeColors, isDarkMode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (!token || !userData) {
      router.push(`/${lang}/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role === 'admin' || user.role === 'super_admin') {
        setAuthorized(true);
        setChecking(false);
      } else {
        router.push(`/${lang}/dashboard`);
      }
    } catch {
      router.push(`/${lang}/auth/signin`);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [lang, router, pathname]);

  if (!mounted || checking) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Checking access...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  const bg = themeColors?.background || (isDarkMode ? '#0f172a' : '#f8fafc');
  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bg }}>
      <AdminSidebar 
        lang={lang} 
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      
      <main 
        style={{
          flex: 1,
          minWidth: 0,
          marginLeft: isMobile ? '0px' : '260px',
          padding: isMobile ? '64px 12px 80px 12px' : '24px',
          maxWidth: isMobile ? '100%' : 'calc(100% - 260px)',
          overflowX: 'hidden',
          boxSizing: 'border-box',
          backgroundColor: bg,
          minHeight: '100vh',
        }}
      >
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

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { lang } = useParams() as { lang: string };
  return <AdminLayoutContent children={children} lang={lang} />;
}
