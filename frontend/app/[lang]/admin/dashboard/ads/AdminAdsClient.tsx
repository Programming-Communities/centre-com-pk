'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { CheckCircle, XCircle, Clock, Eye, BarChart3 } from 'lucide-react';

export default function AdminAdsClient({ lang }: { lang: string }) {
  const { themeColors } = useTheme();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [note, setNote] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';

  const fetchAds = () => {
    setLoading(true);
    fetch('/api/admin/ads?status=' + filter)
      .then(r => r.json())
      .then(d => { setAds(d.ads || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchAds(); }, [filter]);

  const handleAction = async (id: number, status: string) => {
    await fetch('/api/admin/ads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, admin_note: note }),
    });
    setSelectedId(null);
    setNote('');
    // Refresh list
    fetchAds();
  };

  const statusColors: Record<string, any> = {
    pending: { bg: '#f59e0b20', color: '#f59e0b', icon: Clock, label: 'Pending' },
    active: { bg: '#3b82f620', color: '#3b82f6', icon: CheckCircle, label: 'Active' },
    approved: { bg: '#10b98120', color: '#10b981', icon: CheckCircle, label: 'Approved' },
    rejected: { bg: '#ef444420', color: '#ef4444', icon: XCircle, label: 'Rejected' },
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: textPrimary, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BarChart3 size={24} color={primary} /> Ad Manager
      </h1>
      <p style={{ fontSize: '14px', color: textSecondary, marginBottom: '24px' }}>Review & manage client advertisements</p>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['pending', 'active', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{
              padding: '10px 20px', borderRadius: '8px', border: '1.5px solid ' + (filter === s ? primary : border),
              background: filter === s ? primary + '15' : surface,
              color: filter === s ? primary : textSecondary,
              fontWeight: 600, fontSize: '13px', cursor: 'pointer', textTransform: 'capitalize'
            }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: textSecondary }}>Loading...</div>
      ) : ads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: textSecondary }}>No {filter} ads found</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ads.map((ad: any) => {
            const sc = statusColors[ad.status] || statusColors.pending;
            const StatusIcon = sc.icon;
            return (
              <div key={ad.id} style={{ padding: '18px', background: surface, borderRadius: '12px', border: '1px solid ' + border }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: selectedId === ad.id ? '12px' : '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '8px', background: ad.image_url ? 'url(' + ad.image_url + ') center/cover' : primary + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                      {!ad.image_url && '📢'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: textPrimary }}>{ad.title}</div>
                      <div style={{ fontSize: '12px', color: textSecondary }}>{ad.client_name || ad.client_email} • {ad.placement} • {ad.ad_type} • 👁️{ad.impressions || 0} 🖱️{ad.clicks || 0}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: 600, background: sc.bg, color: sc.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <StatusIcon size={12} /> {sc.label}
                    </span>
                    {ad.status === 'pending' && (
                      <button onClick={() => setSelectedId(selectedId === ad.id ? null : ad.id)}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid ' + primary, background: primary + '10', color: primary, cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                        <Eye size={14} /> Review
                      </button>
                    )}
                  </div>
                </div>
                
                {selectedId === ad.id && (
                  <div style={{ padding: '12px', background: primary + '05', borderRadius: '8px', marginTop: '8px' }}>
                    <p style={{ fontSize: '12px', color: textSecondary, marginBottom: '8px' }}>
                      Target: {ad.target_url || 'N/A'} | Budget: ${ad.budget || 0} | Max Views: {ad.max_impressions || 100000}
                    </p>
                    <input type="text" placeholder="Admin note (optional)..." value={note} onChange={e => setNote(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid ' + border, marginBottom: '8px', fontSize: '12px', background: 'transparent', color: textPrimary }} />
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleAction(ad.id, 'active')}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                        ✅ Approve & Activate
                      </button>
                      <button onClick={() => handleAction(ad.id, 'rejected')}
                        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
