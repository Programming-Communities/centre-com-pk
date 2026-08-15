'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Trash2, CheckCircle, XCircle, MessageCircle } from 'lucide-react';

export default function CommentsClient() {
  const { lang } = useParams() as { lang: string };
  const { themeColors } = useTheme();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';

  useEffect(() => {
    fetch('/api/admin/comments')
      .then(r => r.json())
      .then(d => { setComments(d.comments || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    await fetch('/api/admin/comments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'approved' }),
    });
    setComments(comments.map(c => c.id === id ? { ...c, status: 'approved' } : c));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return;
    await fetch(`/api/admin/comments?id=${id}`, { method: 'DELETE' });
    setComments(comments.filter(c => c.id !== id));
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: textPrimary, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MessageCircle size={24} /> Comments Manager
      </h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: textSecondary }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {comments.map((c: any) => (
            <div key={c.id} style={{ padding: '16px', background: surface, borderRadius: '10px', border: `1px solid ${border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <strong style={{ color: textPrimary }}>{c.user_name || c.user_email || 'Anonymous'}</strong>
                  <span style={{ fontSize: '12px', color: textSecondary, marginLeft: '8px' }}>{c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {c.status !== 'approved' && (
                    <button onClick={() => handleApprove(c.id)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #10b981', background: '#10b98110', color: '#10b981', cursor: 'pointer', fontSize: '12px' }}>
                      <CheckCircle size={14} /> Approve
                    </button>
                  )}
                  <button onClick={() => handleDelete(c.id)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ef4444', background: '#ef444410', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
              <p style={{ color: textSecondary, fontSize: '14px', margin: 0 }}>{c.content}</p>
              <div style={{ fontSize: '11px', color: textSecondary, marginTop: '6px' }}>
                {c.status === 'approved' ? '✅ Approved' : c.status === 'pending' ? '⏳ Pending' : '❌ Rejected'}
                {c.post_title && ` • On: ${c.post_title}`}
              </div>
            </div>
          ))}
          {comments.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: textSecondary }}>No comments yet</div>}
        </div>
      )}
    </div>
  );
}
