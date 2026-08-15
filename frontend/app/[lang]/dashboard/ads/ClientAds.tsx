'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { 
  Plus, Edit3, Trash2, CheckCircle, XCircle, Clock, 
  Image, Layout, Eye as EyeIcon, MousePointer
} from 'lucide-react';

export default function ClientAds() {
  const { lang } = useParams() as { lang: string };
  const { themeColors, isDarkMode } = useTheme();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const u = JSON.parse(userData);
        setUser(u);
      } catch {}
    }
  }, []);

  const fetchMyAds = () => {
    if (!user?.id) {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const u = JSON.parse(userData);
          setUser(u);
          setLoading(true);
          fetch(`/api/admin/ads?user_id=${u.id}`)
            .then(r => r.json())
            .then(d => { setAds(d.ads || []); setLoading(false); })
            .catch(() => setLoading(false));
          return;
        } catch {}
      }
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/admin/ads?user_id=${user.id}`)
      .then(r => r.json())
      .then(d => { setAds(d.ads || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchMyAds(); }, [user]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this ad?')) return;
    try {
      const res = await fetch('/api/admin/ads?id=' + id, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSubmitMessage({ type: 'success', text: '✅ Ad deleted!' });
        fetchMyAds();
        setTimeout(() => setSubmitMessage(null), 3000);
      } else {
        setSubmitMessage({ type: 'error', text: '❌ ' + (data.error || 'Delete failed') });
        setTimeout(() => setSubmitMessage(null), 3000);
      }
    } catch (err) {
      setSubmitMessage({ type: 'error', text: '❌ Failed to delete' });
      setTimeout(() => setSubmitMessage(null), 3000);
    }
  };

  const statusConfig: Record<string, any> = {
    pending: { bg: '#f59e0b15', color: '#f59e0b', icon: Clock, label: 'Pending Review' },
    active: { bg: '#3b82f615', color: '#3b82f6', icon: CheckCircle, label: 'Active' },
    approved: { bg: '#10b98115', color: '#10b981', icon: CheckCircle, label: 'Approved' },
    rejected: { bg: '#ef444415', color: '#ef4444', icon: XCircle, label: 'Rejected' },
    expired: { bg: '#64748b15', color: '#64748b', icon: XCircle, label: 'Expired' },
  };

  if (!user) {
    return <div style={{ padding: '40px', textAlign: 'center', color: textSecondary }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', minHeight: '80vh', backgroundColor: themeColors.background }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {submitMessage && (
          <div style={{
            position: 'fixed', top: '80px', right: '20px', zIndex: 9999,
            padding: '12px 24px', borderRadius: '12px',
            backgroundColor: submitMessage.type === 'success' ? '#10b981' : '#ef4444',
            color: '#fff', fontWeight: 600, fontSize: '14px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          }}>
            {submitMessage.text}
          </div>
        )}

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: textPrimary, margin: '0 0 4px' }}>
              📢 My Advertisements
            </h1>
            <p style={{ fontSize: '13px', color: textSecondary, margin: 0 }}>
              {ads.filter(a => a.status === 'active' || a.status === 'approved').length} active • 
              {ads.filter(a => a.status === 'pending').length} pending • 
              {ads.reduce((s: number, a: any) => s + (a.impressions || 0), 0).toLocaleString()} total views
            </p>
          </div>
          
          {/* ✅ CREATE NEW AD BUTTON — Redirect to full page */}
          <Link
            href={`/${lang}/dashboard/ads/new`}
            style={{
              padding: '12px 24px',
              background: primary,
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 16px ' + primary + '30',
            }}
          >
            <Plus size={18} /> Create New Ad
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: 'Total Ads', value: ads.length, color: primary, icon: Layout },
            { label: 'Active', value: ads.filter(a => a.status === 'active' || a.status === 'approved').length, color: '#10b981', icon: CheckCircle },
            { label: 'Pending', value: ads.filter(a => a.status === 'pending').length, color: '#f59e0b', icon: Clock },
            { label: 'Views', value: ads.reduce((s: number, a: any) => s + (a.impressions || 0), 0).toLocaleString(), color: '#8b5cf6', icon: EyeIcon },
            { label: 'Clicks', value: ads.reduce((s: number, a: any) => s + (a.clicks || 0), 0).toLocaleString(), color: '#ec4899', icon: MousePointer },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ padding: '14px', background: surface, borderRadius: '10px', border: '1px solid ' + border, textAlign: 'center' }}>
                <Icon size={18} color={s.color} style={{ marginBottom: '4px' }} />
                <div style={{ fontSize: '20px', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '10px', color: textSecondary, marginTop: '2px' }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Ads List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: textSecondary }}>Loading your ads...</div>
        ) : ads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: textSecondary }}>
            <Image size={56} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ fontSize: '18px', fontWeight: 600, color: textPrimary, marginBottom: '8px' }}>📭 No Advertisements Yet</p>
            <p style={{ fontSize: '14px', marginBottom: '20px' }}>Create your first ad to reach thousands of visitors!</p>
            <Link
              href={`/${lang}/dashboard/ads/new`}
              style={{
                padding: '14px 28px',
                background: primary,
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '14px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              🚀 Create Your First Ad
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ads.map((ad: any) => {
              const sc = statusConfig[ad.status] || statusConfig.pending;
              const StatusIcon = sc.icon;
              const geoLabel = ad.geo_type === 'all' ? '🌍 Everywhere' : 
                               ad.geo_type === 'country' ? `🏛️ ${ad.target_country}` : 
                               ad.geo_type === 'city' ? `🏙️ ${ad.target_city}` : 
                               ad.geo_type === 'radius' ? `📡 ${ad.target_radius}km` : 
                               ad.geo_type === 'street' ? `🏠 ${ad.target_street}` : '📍 Targeted';
              return (
                <div key={ad.id} style={{ padding: '16px', background: surface, borderRadius: '12px', border: '1px solid ' + border }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                      <div style={{ 
                        width: '60px', height: '45px', borderRadius: '8px', 
                        background: ad.image_url ? `url(${ad.image_url}) center/cover` : ad.bg_color || primary + '15',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontSize: '18px', flexShrink: 0, overflow: 'hidden' 
                      }}>
                        {!ad.image_url && (ad.title?.charAt(0) || '📢')}
                        {ad.image_url && <img src={ad.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: textPrimary, fontSize: '15px' }}>{ad.title}</div>
                        <div style={{ fontSize: '11px', color: textSecondary, display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                          <span>{ad.placement?.replace(/-/g, ' ')} • {ad.size}</span>
                          <span>{geoLabel}</span>
                          <span>👁️ {ad.impressions?.toLocaleString()||0} 🖱️ {ad.clicks?.toLocaleString()||0}</span>
                          {ad.budget > 0 && <span>💰 ${ad.budget}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '10px', fontWeight: 600, background: sc.bg, color: sc.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <StatusIcon size={12} /> {sc.label}
                      </span>
                      <button 
                        onClick={() => handleDelete(ad.id)} 
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ef4444', background: '#ef444410', cursor: 'pointer', color: '#ef4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
