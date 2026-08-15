'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { BarChart3, TrendingUp, Users, Eye, Globe, Monitor, Smartphone } from 'lucide-react';

export default function AnalyticsClient({ lang }: { lang: string }) {
  const { themeColors, isDarkMode } = useTheme();
  const [data, setData] = useState<any>(null);
  const [period, setPeriod] = useState('today');
  const [loading, setLoading] = useState(true);

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?period=${period}`)
      .then(r => r.json())
      .then(d => { setData(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [period]);

  const stats = [
    { icon: Eye, label: 'Total Views', value: data?.totalViews?.toLocaleString() || '0', color: '#3b82f6' },
    { icon: Users, label: 'Unique Visitors', value: data?.uniqueVisitors?.toLocaleString() || '0', color: '#10b981' },
    { icon: Globe, label: 'Total Users', value: data?.totalUsers?.toLocaleString() || '0', color: '#f59e0b' },
    { icon: BarChart3, label: 'Blog Posts', value: data?.totalPosts?.toLocaleString() || '0', color: '#8b5cf6' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BarChart3 size={24} color={primary} /> Analytics
      </h1>

      {/* Period Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['today', 'week', 'month', 'all'].map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${period === p ? primary : border}`, background: period === p ? `${primary}15` : surface, color: period === p ? primary : textSecondary, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ padding: '20px', background: surface, borderRadius: '12px', border: `1px solid ${border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <s.icon size={20} color={s.color} />
              <span style={{ fontSize: '13px', color: textSecondary }}>{s.label}</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: textPrimary }}>{loading ? '...' : s.value}</div>
          </div>
        ))}
      </div>

      {/* Top Pages */}
      {data?.topPages?.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: textPrimary, marginBottom: '12px' }}>📄 Top Pages</h2>
          <div style={{ background: surface, borderRadius: '12px', border: `1px solid ${border}`, overflow: 'hidden' }}>
            {data.topPages.map((p: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < data.topPages.length - 1 ? `1px solid ${border}` : 'none' }}>
                <span style={{ fontSize: '13px', color: textPrimary }}>{p.path}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: primary }}>{p.views} views</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Devices */}
      {data?.devices?.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: textPrimary, marginBottom: '12px' }}>📱 Devices</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            {data.devices.map((d: any, i: number) => (
              <div key={i} style={{ flex: 1, padding: '16px', background: surface, borderRadius: '10px', border: `1px solid ${border}`, textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>{d.device === 'mobile' ? '📱' : d.device === 'tablet' ? '📋' : '🖥️'}</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: textPrimary }}>{d.count}</div>
                <div style={{ fontSize: '12px', color: textSecondary }}>{d.device}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
