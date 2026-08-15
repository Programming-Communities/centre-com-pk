'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { CheckCircle, XCircle, Clock, FileText, Eye, Filter } from 'lucide-react';
import TableSkeleton from '@/components/skeletons/TableSkeleton';

export default function AdminKYCClient() {
  const { themeColors } = useTheme();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [note, setNote] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';

  const fetchKYC = () => {
    fetch(`/api/admin/kyc${filter ? '?status=' + filter : ''}`)
      .then(r => r.json())
      .then(d => { setRequests(d.requests || []); setLoading(false); });
  };

  useEffect(() => { fetchKYC(); }, [filter]);

  const handleAction = async (id: number, status: string) => {
    await fetch('/api/admin/kyc', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status, admin_note: note }) });
    setSelectedId(null); setNote('');
    fetchKYC();
  };

  const statusColors: Record<string, any> = {
    pending: { bg: '#f59e0b20', color: '#f59e0b', label: 'Pending' },
    approved: { bg: '#10b98120', color: '#10b981', label: 'Approved' },
    rejected: { bg: '#ef444420', color: '#ef4444', label: 'Rejected' },
  };

  if (loading) return <TableSkeleton rows={6} cols={6} />;

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: textPrimary, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FileText size={24} color={primary} /> KYC Verification
      </h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${filter === f ? primary : border}`, background: filter === f ? `${primary}15` : surface, color: filter === f ? primary : textSecondary, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            {f || 'All'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {requests.map((r: any) => {
          const sc = statusColors[r.status] || statusColors.pending;
          return (
            <div key={r.id} style={{ padding: '16px', background: surface, borderRadius: '10px', border: `1px solid ${border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: selectedId === r.id ? '12px' : '0' }}>
                <div>
                  <div style={{ fontWeight: 600, color: textPrimary, fontSize: '14px' }}>{r.user_name}</div>
                  <div style={{ fontSize: '12px', color: textSecondary }}>{r.user_email} • {r.document_type} • {new Date(r.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                  {r.status === 'pending' && (
                    <button onClick={() => setSelectedId(selectedId === r.id ? null : r.id)}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${primary}`, background: `${primary}10`, color: primary, cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={14} /> Review
                    </button>
                  )}
                </div>
              </div>
              {selectedId === r.id && (
                <div style={{ padding: '12px', background: `${primary}05`, borderRadius: '8px' }}>
                  {r.document_url && <div style={{ fontSize: '12px', color: primary, marginBottom: '8px' }}>📎 {r.document_url}</div>}
                  <input type="text" placeholder="Admin note..." value={note} onChange={e => setNote(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: `1px solid ${border}`, marginBottom: '8px', fontSize: '12px' }} />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => handleAction(r.id, 'approved')} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>✅ Approve</button>
                    <button onClick={() => handleAction(r.id, 'rejected')} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>❌ Reject</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {requests.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: textSecondary }}>No KYC requests</div>}
      </div>
    </div>
  );
}
