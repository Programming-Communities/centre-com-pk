'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import ThemeProviderWrapper from '@/components/theme/providers/ThemeProviderWrapper';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import AdminSidebar from '@/components/admin/AdminSidebar';

function AdminLayoutContent({ children, lang }: { children: ReactNode; lang: string }) {
  const { themeColors, isDarkMode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // ✅ AUTH CHECK
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
  const marginLeft = isMobile ? 0 : (collapsed ? 64 : 200);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bg }}>
      <AdminSidebar lang={lang} collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} />
      <main style={{
        flex: 1,
        marginLeft: `${marginLeft}px`,
        padding: isMobile ? '70px 16px 16px 16px' : '30px',
        transition: 'margin-left 0.3s ease',
        maxWidth: '100%',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        backgroundColor: bg,
        minHeight: '100vh'
      }}>
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { lang } = useParams() as { lang: string };

  return (
    <ThemeProviderWrapper>
      <AdminLayoutContent children={children} lang={lang} />
    </ThemeProviderWrapper>
  );
}