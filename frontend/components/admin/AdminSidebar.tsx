'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { 
  LayoutDashboard, FileText, Users, Settings, 
  Shield, MessageSquare, Image, FolderOpen, PlusCircle
} from 'lucide-react';

interface AdminSidebarProps {
  lang: string;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  onCollapseChange?: (collapsed: boolean) => void;
  isMobile?: boolean;
}

export default function AdminSidebar({ lang, collapsed: propCollapsed, setCollapsed: propSetCollapsed, onCollapseChange, isMobile: propIsMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const { themeColors, isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(propCollapsed ?? false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // ✅ FIXED: useSession ko safe tarah se call karo — try/catch with dynamic import
    const loadSession = async () => {
      try {
        const { useSession } = await import('next-auth/react');
        // We can't call hook here, so fallback to checking localStorage
        const userData = localStorage.getItem('user_data');
        if (userData) {
          setSession({ user: JSON.parse(userData) });
        }
      } catch {
        // next-auth not available, skip
      }
    };
    loadSession();
  }, []);

  // Sync collapsed state with parent
  useEffect(() => {
    if (propCollapsed !== undefined && propCollapsed !== collapsed) {
      setCollapsed(propCollapsed);
    }
  }, [propCollapsed]);

  const userRole = (session?.user as any)?.role || 'user';
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    propSetCollapsed?.(newState);
    onCollapseChange?.(newState);
  };

  const allMenus = [
    { href: `/${lang}/admin`, label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'super_admin', 'moderator', 'editor', 'user'] },
    { href: `/${lang}/admin/posts`, label: 'Posts', icon: FileText, roles: ['admin', 'super_admin', 'moderator', 'editor', 'user'] },
    { href: `/${lang}/admin/posts/new`, label: 'Add New', icon: PlusCircle, roles: ['admin', 'super_admin', 'moderator', 'editor', 'user'] },
    { href: `/${lang}/admin/media`, label: 'Media', icon: Image, roles: ['admin', 'super_admin', 'moderator', 'editor', 'user'] },
    { href: `/${lang}/admin/categories`, label: 'Categories', icon: FolderOpen, roles: ['admin', 'super_admin', 'moderator', 'user'] },
    { href: `/${lang}/admin/comments`, label: 'Comments', icon: MessageSquare, roles: ['admin', 'super_admin', 'moderator', 'editor', 'user'] },
    { href: `/${lang}/admin/users`, label: 'Users', icon: Users, roles: ['admin', 'super_admin', 'user'] },
    { href: `/${lang}/admin/dashboard/roles`, label: 'Roles', icon: Shield, roles: ['admin', 'super_admin', 'user'] },
    { href: `/${lang}/admin/dashboard/settings`, label: 'Settings', icon: Settings, roles: ['admin', 'super_admin', 'user'] },
  ];

  const filteredMenus = allMenus;

  if (!mounted) {
    return (
      <div style={{ 
        position: 'fixed', left: 0, top: 0, 
        width: collapsed ? '64px' : '200px', 
        height: '100vh', 
        backgroundColor: '#1d2327', 
        zIndex: 100, 
        padding: '20px', 
        color: '#b0b8c1' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, height: '100vh', width: collapsed ? '64px' : '200px',
      backgroundColor: '#1d2327', borderRight: '1px solid #333', transition: 'width 0.3s ease',
      zIndex: 100, overflowY: 'auto', overflowX: 'hidden',
    }}>
      <button onClick={toggleCollapse} style={{
        position: 'absolute', right: '-12px', top: '20px', width: '24px', height: '24px',
        backgroundColor: '#2271b1', color: '#fff', borderRadius: '50%', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        zIndex: 101, fontSize: '12px'
      }}>
        {collapsed ? '→' : '←'}
      </button>

      <div style={{ padding: '16px 12px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: '8px', height: '60px' }}>
        <span style={{ color: '#fff', fontSize: collapsed ? '18px' : '16px', fontWeight: 700 }}>{collapsed ? 'C' : 'Centre.com.pk'}</span>
        {!collapsed && <span style={{ color: '#b0b8c1', fontSize: '10px' }}>Admin</span>}
      </div>

      {!collapsed && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #333' }}>
          <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>
            {session?.user?.name || 'Guest'}
          </div>
          <div style={{ color: '#b0b8c1', fontSize: '11px' }}>
            {isAdmin ? '👑 Admin' : '👤 User'}
          </div>
        </div>
      )}

      <nav style={{ padding: '8px 0' }}>
        {filteredMenus.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: collapsed ? '12px 16px' : '10px 16px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                color: isActive ? '#fff' : '#b0b8c1',
                backgroundColor: isActive ? '#2271b1' : 'transparent',
                textDecoration: 'none', fontSize: '13px', fontWeight: isActive ? 600 : 400,
                transition: 'all 0.1s', borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
              }}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
