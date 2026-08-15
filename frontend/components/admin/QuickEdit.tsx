'use client';
import { useState } from 'react';

interface QuickEditProps {
  post: any;
  lang: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function QuickEdit({ post, lang, onClose, onSaved }: QuickEditProps) {
  const [title, setTitle] = useState(post.title || '');
  const [slug, setSlug] = useState(post.slug || '');
  const [status, setStatus] = useState(post.status || 'draft');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/blog', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id, title, slug, status }),
    });
    setSaving(false);
    onSaved();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', width: '500px', maxWidth: '90%' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Quick Edit — {post.title}</h2>
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#1d2327' }}>Title</label>
          <input value={title} onChange={e => { setTitle(e.target.value); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')); }}
            style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '3px', fontSize: '14px', boxSizing: 'border-box' }} />
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#1d2327' }}>Slug</label>
          <input value={slug} onChange={e => setSlug(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '3px', fontSize: '14px', boxSizing: 'border-box' }} />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#1d2327' }}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '3px', fontSize: '14px' }}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', border: '1px solid #8c8f94', borderRadius: '3px', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving}
            style={{ padding: '8px 16px', border: 'none', borderRadius: '3px', background: '#2271b1', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            {saving ? 'Saving...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
}
