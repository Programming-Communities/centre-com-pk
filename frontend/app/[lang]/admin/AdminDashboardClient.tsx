'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Users, FileText, Wrench, Megaphone, DollarSign, TrendingUp, 
  Search, BarChart3, Eye, Clock, CheckCircle, ArrowRight, Shield
} from 'lucide-react';
import AdminSkeleton from '@/components/skeletons/AdminSkeleton';

export default function AdminDashboardClient() {
  const { lang } = useParams() as { lang: string };
  const { themeColors, isDarkMode } = useTheme();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';

  useEffect(() => {
    fetch('/api/admin/dashboard-stats')
      .then(r => r.json())
      .then(d => { setStats(d.stats || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <AdminSkeleton />;

  const s = stats || {};

  const statCards = [
    { icon: Users, value: s.totalUsers?.toLocaleString() || '0', label: 'Total Users', color: '#3b82f6', href: `/${lang}/admin/dashboard/users` },
    { icon: FileText, value: s.totalPosts?.toLocaleString() || '0', label: 'Blog Posts', color: '#8b5cf6', href: `/${lang}/admin/posts` },
    { icon: Wrench, value: s.totalTools?.toLocaleString() || '0', label: 'Tools', color: '#ef4444', href: `/${lang}/admin/tools-manager` },
    { icon: Megaphone, value: s.totalAds?.toLocaleString() || '0', label: 'Ads', color: '#ec4899', href: `/${lang}/admin/dashboard/ads` },
    { icon: DollarSign, value: (s.totalRevenue || 0).toLocaleString(), label: 'Revenue', color: '#10b981', href: `/${lang}/admin/dashboard/sales` },
    { icon: Eye, value: s.totalViews?.toLocaleString() || '0', label: 'Total Views', color: '#f59e0b', href: `/${lang}/admin/dashboard/analytics` },
  ];

  const pendingItems = [
    { icon: Clock, value: s.pendingApprovals || 0, label: 'Pending Approvals', color: '#f59e0b', href: `/${lang}/admin/approvals` },
    { icon: Shield, value: s.pendingKYC || 0, label: 'Pending KYC', color: '#6366f1', href: `/${lang}/admin/dashboard/kyc` },
    { icon: Megaphone, value: s.pendingAds || 0, label: 'Pending Ads', color: '#ec4899', href: `/${lang}/admin/dashboard/ads` },
  ];

  const modules = [
    { icon: Users, title: 'User Manager', desc: 'Manage users & roles', href: `/${lang}/admin/dashboard/users`, color: '#3b82f6' },
    { icon: FileText, title: 'Content Manager', desc: 'Posts, comments, categories', href: `/${lang}/admin/posts`, color: '#8b5cf6' },
    { icon: Wrench, title: 'Tools Manager', desc: '53 tools, add/edit', href: `/${lang}/admin/tools-manager`, color: '#ef4444' },
    { icon: Search, title: 'SEO Manager', desc: 'Keywords & rankings', href: `/${lang}/admin/seo-manager`, color: '#6366f1' },
    { icon: Megaphone, title: 'Ad Manager', desc: 'Ads & placements', href: `/${lang}/admin/dashboard/ads`, color: '#ec4899' },
    { icon: BarChart3, title: 'Analytics', desc: 'Traffic & insights', href: `/${lang}/admin/dashboard/analytics`, color: '#14b8a6' },
    { icon: DollarSign, title: 'Revenue', desc: 'Sales & transactions', href: `/${lang}/admin/dashboard/sales`, color: '#10b981' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: textPrimary, marginBottom: '4px' }}>Admin Dashboard</h1>
      <p style={{ fontSize: '14px', color: textSecondary, marginBottom: '28px' }}>Real-time overview of your platform</p>

      {/* Pending Alerts */}
      {(s.pendingApprovals > 0 || s.pendingKYC > 0 || s.pendingAds > 0) && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {pendingItems.filter(p => p.value > 0).map((p, i) => (
            <Link key={i} href={p.href} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '10px 18px', background: p.color + '15', borderRadius: '10px', border: '1px solid ' + p.color + '30', display: 'flex', alignItems: 'center', gap: '8px', color: p.color, fontWeight: 600, fontSize: '13px' }}>
                <p.icon size={16} /> {p.value} {p.label} →
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        {statCards.map((sc, i) => (
          <Link key={i} href={sc.href} style={{ textDecoration: 'none' }}>
            <div style={{ padding: '18px', background: surface, borderRadius: '12px', border: '1px solid ' + border, textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }}>
              <sc.icon size={22} color={sc.color} style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '22px', fontWeight: 700, color: textPrimary }}>{sc.value}</div>
              <div style={{ fontSize: '11px', color: textSecondary, marginTop: '2px' }}>{sc.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Module Cards */}
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: textPrimary, marginBottom: '14px' }}>Quick Access</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '14px' }}>
        {modules.map((m, i) => (
          <Link key={i} href={m.href} style={{ textDecoration: 'none' }}>
            <div style={{ padding: '20px', background: surface, borderRadius: '14px', border: '1px solid ' + border, transition: 'all 0.2s', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: m.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <m.icon size={20} color={m.color} />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: 0 }}>{m.title}</h3>
              </div>
              <p style={{ fontSize: '13px', color: textSecondary, margin: 0 }}>{m.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
