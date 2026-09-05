'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { 
  LayoutDashboard, FileText, Crown, Megaphone, 
  Link2, Bookmark, MessageCircle, User, Settings, Shield, 
  FileEdit, X, LogOut
} from 'lucide-react';

interface ProSidebarProps {
  lang: string;
  role?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function ProSidebar({ lang, role = 'user', isMobileOpen = false, onMobileClose }: ProSidebarProps) {
  const { themeColors, isDarkMode } = useTheme();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch {}
    }
    
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (path: string) => {
    if (path === '') return pathname === `/${lang}/dashboard`;
    return pathname?.startsWith(`/${lang}/dashboard${path}`);
  };

  const bg = themeColors?.background || (isDarkMode ? '#0f172a' : '#ffffff');
  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#f8fafc');
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors?.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors?.primary || '#3b82f6';

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '' },
    { key: 'documents', label: 'My Documents', icon: FileText, path: '/editor' },
    { key: 'plan', label: 'My Plan', icon: Crown, path: '/plan' },
    { key: 'ads', label: 'My Ads', icon: Megaphone, path: '/ads' },
    { key: 'affiliate', label: 'Affiliate', icon: Link2, path: '/affiliate' },
    { key: 'bookmarks', label: 'Bookmarks', icon: Bookmark, path: '/bookmarks' },
    { key: 'comments', label: 'My Comments', icon: MessageCircle, path: '/comments' },
    { key: 'posts', label: 'My Posts', icon: FileEdit, path: '/posts' },
    { key: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { key: 'kyc', label: 'KYC Verification', icon: Shield, path: '/kyc' },
    { key: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleItemClick = () => {
    if (onMobileClose) onMobileClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = `/${lang}/auth/signin`;
  };

  // ✅ DON'T RENDER UNTIL MOUNTED
  if (!mounted) return null;

  return (
    <>
      {/* OVERLAY — Mobile Only */}
      {isMobile && isMobileOpen && (
        <div 
          onClick={onMobileClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 998,
          }}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '250px',
          backgroundColor: bg,
          borderRight: `1px solid ${border}`,
          zIndex: 999,
          transform: isMobile 
            ? (isMobileOpen ? 'translateX(0)' : 'translateX(-100%)')
            : 'translateX(0)',
          transition: 'transform 0.3s ease-in-out',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* HEADER */}
        <div style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
          <Link href={`/${lang}/dashboard`} style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: primary }}>Centre.pk</span>
          </Link>
          {isMobile && (
            <button
              onClick={onMobileClose}
              style={{ padding: '6px', borderRadius: '8px', backgroundColor: surface, color: textSecondary, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* USER INFO */}
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0, background: `linear-gradient(135deg, ${primary}, ${themeColors?.secondary || '#1e40af'})` }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '13px', color: textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '11px', color: textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email || 'user@email.com'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
            <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '9px', fontWeight: 700, background: role === 'admin' || role === 'super_admin' ? '#ef444420' : '#3b82f620', color: role === 'admin' || role === 'super_admin' ? '#ef4444' : primary }}>
              {role === 'super_admin' ? 'SUPER ADMIN' : role === 'admin' ? 'ADMIN' : 'USER'}
            </span>
            <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', background: '#10b98120', color: '#10b981' }}>
              {user?.plan || 'Free'}
            </span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.key}
                href={`/${lang}/dashboard${item.path}`}
                onClick={handleItemClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  marginBottom: '2px',
                  fontSize: '13px',
                  fontWeight: active ? 600 : 500,
                  textDecoration: 'none',
                  backgroundColor: active ? `${primary}12` : 'transparent',
                  color: active ? primary : textSecondary,
                  position: 'relative',
                }}
              >
                <Icon size={16} style={{ color: active ? primary : textSecondary, flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                {active && (
                  <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '22px', borderRadius: '0 3px 3px 0', backgroundColor: primary }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div style={{ padding: '10px', borderTop: `1px solid ${border}`, flexShrink: 0 }}>
          <button
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: '#ef4444', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
