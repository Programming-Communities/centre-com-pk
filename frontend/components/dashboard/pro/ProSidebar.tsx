'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import UserInfo from '@/components/common/UserInfo';

interface ProSidebarProps {
  lang: string;
}

export default function ProSidebar({ lang }: ProSidebarProps) {
  const { theme } = useTheme();
  const { t } = useTranslation(lang);
  const pathname = usePathname();
  const params = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Load state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pro-sidebar-collapsed');
    if (saved === 'true') setCollapsed(true);
    
    const savedMenus = localStorage.getItem('pro-sidebar-menus');
    if (savedMenus) {
      try {
        setOpenMenus(JSON.parse(savedMenus));
      } catch { /* ignore */ }
    }
  }, []);

  // Save state to localStorage
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    localStorage.setItem('pro-sidebar-collapsed', String(!collapsed));
  };

  const toggleMenu = (key: string) => {
    setOpenMenus(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      localStorage.setItem('pro-sidebar-menus', JSON.stringify(newState));
      return newState;
    });
  };

  const isActive = (path: string) => {
    return pathname?.startsWith(`/${lang}/dashboard${path}`);
  };

  // Menu items
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊', path: '' },
    { key: 'documents', label: 'Documents', icon: '📄', path: '/documents' },
    { key: 'editor', label: 'Editor', icon: '✏️', path: '/editor' },
    { key: 'plan', label: 'Plan', icon: '💎', path: '/plan' },
    { key: 'ads', label: 'Ads', icon: '📢', path: '/ads' },
    { key: 'affiliate', label: 'Affiliate', icon: '🔗', path: '/affiliate' },
    { key: 'bookmarks', label: 'Bookmarks', icon: '🔖', path: '/bookmarks' },
    { key: 'comments', label: 'Comments', icon: '💬', path: '/comments' },
    { key: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
    { key: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
    { key: 'kyc', label: 'KYC', icon: '🪪', path: '/kyc' },
    { key: 'posts', label: 'My Posts', icon: '📝', path: '/posts' },
  ];

  return (
    <aside className={`
      fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
      transition-all duration-300 ease-in-out z-50
      ${collapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Arrow Toggle Button — VISIBLE ON DESKTOP */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-6 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-50"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '→' : '←'}
      </button>

      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
        {collapsed ? (
          <span className="text-xl font-bold text-primary">C</span>
        ) : (
          <span className="text-xl font-bold text-primary">Centre.com.pk</span>
        )}
      </div>

      {/* User Info — Only when expanded */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <UserInfo lang={lang} />
        </div>
      )}

      {/* Navigation */}
      <nav className="p-2 overflow-y-auto h-[calc(100vh-4rem)]">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            href={`/${lang}/dashboard${item.path}`}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
              ${collapsed ? 'justify-center' : ''}
              ${isActive(item.path) ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
            `}
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
