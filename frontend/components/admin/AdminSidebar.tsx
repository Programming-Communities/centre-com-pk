'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { 
  LayoutDashboard, FileText, Users, Settings, 
  Shield, MessageSquare, Image, FolderOpen, PlusCircle, 
  X, LogOut
} from 'lucide-react';

interface AdminSidebarProps {
  lang: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AdminSidebar({ lang, isMobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { themeColors, isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try { setSession({ user: JSON.parse(userData) }); } catch {}
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const bg = themeColors?.background || (isDarkMode ? '#0f172a' : '#ffffff');
  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#f8fafc');
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors?.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors?.primary || '#3b82f6';

  const menuItems = [
    { href: `/${lang}/admin`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${lang}/admin/posts`, label: 'Posts', icon: FileText },
    { href: `/${lang}/admin/posts/new`, label: 'Add New', icon: PlusCircle },
    { href: `/${lang}/admin/media`, label: 'Media', icon: Image },
    { href: `/${lang}/admin/categories`, label: 'Categories', icon: FolderOpen },
    { href: `/${lang}/admin/comments`, label: 'Comments', icon: MessageSquare },
    { href: `/${lang}/admin/users`, label: 'Users', icon: Users },
    { href: `/${lang}/admin/dashboard/roles`, label: 'Roles', icon: Shield },
    { href: `/${lang}/admin/dashboard/settings`, label: 'Settings', icon: Settings },
  ];

  if (!mounted) return null;

  const handleItemClick = () => {
    if (onMobileClose) onMobileClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = `/${lang}/auth/signin`;
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobile && isMobileOpen && (
        <div onClick={onMobileClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 998 }} />
      )}

      {/* SIDEBAR */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', width: '260px',
        backgroundColor: bg, borderRight: `1px solid ${border}`, zIndex: 999,
        transform: isMobile ? (isMobileOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.3s ease-in-out',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* HEADER */}
        <div style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
          <Link href={`/${lang}/admin`} style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: primary }}>Centre.pk</span>
            <span style={{ fontSize: '10px', color: textSecondary, marginLeft: '6px' }}>ADMIN</span>
          </Link>
          {isMobile && (
            <button onClick={onMobileClose} style={{ padding: '6px', borderRadius: '8px', backgroundColor: surface, color: textSecondary, border: 'none', cursor: 'pointer', display: 'flex' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* USER INFO */}
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0, background: `linear-gradient(135deg, ${primary}, ${themeColors?.secondary || '#1e40af'})` }}>
              {(session?.user as any)?.name?.charAt(0) || 'A'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '13px', color: textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {(session?.user as any)?.name || 'Admin'}
              </div>
              <div style={{ fontSize: '11px', color: textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {(session?.user as any)?.email || 'admin@email.com'}
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} onClick={handleItemClick}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                  borderRadius: '8px', marginBottom: '2px', fontSize: '13px',
                  fontWeight: isActive ? 600 : 500, textDecoration: 'none',
                  backgroundColor: isActive ? `${primary}12` : 'transparent',
                  color: isActive ? primary : textSecondary, position: 'relative',
                }}>
                <Icon size={16} style={{ color: isActive ? primary : textSecondary, flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                {isActive && <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '22px', borderRadius: '0 3px 3px 0', backgroundColor: primary }} />}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT ONLY */}
        <div style={{ padding: '10px', borderTop: `1px solid ${border}`, flexShrink: 0 }}>
          <button onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: '#ef4444', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
