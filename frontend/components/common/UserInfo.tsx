'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  plan: string;
  credits?: number;
}

export default function UserInfo({ collapsed, isMobile }: { collapsed?: boolean; isMobile?: boolean }) {
  const { themeColors, isDarkMode } = useTheme();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem('user_data');
        const token = localStorage.getItem('auth_token');
        
        if (userData) {
          const parsed = JSON.parse(userData);
          setUser(parsed);
        } else if (token) {
          fetch('/api/user/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(data => {
              if (data.success && data.user) {
                setUser(data.user);
                localStorage.setItem('user_data', JSON.stringify(data.user));
              }
            })
            .catch(err => console.error('Failed to fetch user:', err));
        }
      } catch (err) {
        console.error('Error loading user:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
    
    const handleStorageChange = () => {
      loadUser();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const surface = themeColors?.surface || (isDarkMode ? '#1e293b' : '#ffffff');
  const textPrimary = themeColors?.text?.primary || (isDarkMode ? '#f1f5f9' : '#0f172a');
  const textSecondary = themeColors?.text?.secondary || (isDarkMode ? '#94a3b8' : '#64748b');
  const border = themeColors?.border || (isDarkMode ? '#334155' : '#e2e8f0');
  const primary = themeColors?.primary || '#3b82f6';

  const showFullInfo = !collapsed || isMobile;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  if (loading) {
    return (
      <div style={{ padding: showFullInfo ? '16px 20px' : '16px 0', borderBottom: `1px solid ${border}`, marginBottom: '12px', textAlign: showFullInfo ? 'left' : 'center' }}>
        <div style={{ width: showFullInfo ? 'auto' : '32px', height: showFullInfo ? 'auto' : '32px', margin: showFullInfo ? '0' : '0 auto', background: `${primary}20`, borderRadius: '8px', padding: showFullInfo ? '8px 12px' : '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '13px', color: textSecondary }}>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    const pathLang = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'en' : 'en';
    return (
      <div style={{ padding: showFullInfo ? '16px 20px' : '16px 0', borderBottom: `1px solid ${border}`, marginBottom: '12px', textAlign: showFullInfo ? 'left' : 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: showFullInfo ? 'flex-start' : 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: `${primary}20`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '14px', color: primary }}>👤</span>
          </div>
          {showFullInfo && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary }}>Guest User</div>
              <Link href={`/${pathLang}/auth/signin`} style={{ fontSize: '11px', color: primary, textDecoration: 'none' }}>Sign in</Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full user info when sidebar expanded
  if (showFullInfo) {
    return (
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${border}`, marginBottom: '12px' }}>
        <div style={{ fontWeight: 700, color: textPrimary, fontSize: '16px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {user.name || user.email?.split('@')[0] || 'User'}
          {isAdmin && (
            <span style={{ fontSize: '10px', color: '#ef4444', background: '#ef444415', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>ADMIN</span>
          )}
        </div>
        <div style={{ fontSize: '11px', color: textSecondary, marginBottom: '6px', wordBreak: 'break-all' }}>
          {user.email || 'No email'}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: primary, background: `${primary}15`, padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
            Plan: {(user.plan || 'free').toUpperCase()}
          </span>
          {user.credits !== undefined && user.credits > 0 && (
            <span style={{ fontSize: '11px', color: '#10b981', background: '#10b98115', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
              Credits: {user.credits}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Minimal user info when sidebar collapsed
  return (
    <div style={{ padding: '16px 0', borderBottom: `1px solid ${border}`, marginBottom: '12px', textAlign: 'center' }}>
      <div style={{ width: '32px', height: '32px', margin: '0 auto', background: primary, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>{user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}</span>
      </div>
      {isAdmin && (
        <div style={{ marginTop: '4px' }}>
          <span style={{ fontSize: '8px', color: '#ef4444', background: '#ef444415', padding: '2px 4px', borderRadius: '8px' }}>ADMIN</span>
        </div>
      )}
    </div>
  );
}
