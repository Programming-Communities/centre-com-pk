'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditPostPage() {
  const { lang, id } = useParams() as { lang: string; id: string };
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [form, setForm] = useState<any>({
    title: '', slug: '', excerpt: '', content: '',
    image_url: '', category: 'calculators', lang: 'en', status: 'published',
  });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/admin/blog?id=${id}`).then(r => r.json()).then(d => {
      if (d.success && d.post) {
        setForm({
          id: d.post.id, title: d.post.title || '', slug: d.post.slug || '',
          excerpt: d.post.excerpt || '', content: d.post.content || '',
          image_url: d.post.image_url || d.post.featured_image || '',
          category: d.post.category || 'calculators', lang: d.post.lang || 'en',
          status: d.post.status || 'published',
        });
      }
      setLoading(false);
    });
  }, [id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setUploadMsg('⏳ Uploading...');
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/upload/blog-media', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) {
      setForm({ ...form, image_url: data.url });
      setUploadMsg('✅ Uploaded!');
      setTimeout(() => setUploadMsg(''), 2000);
    } else {
      setUploadMsg('❌ Failed');
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/blog', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    alert('✅ Post saved!');
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading post...</div>;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '3px',
    fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px'
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <Link href={`/${lang}/admin/posts`} style={{ fontSize: '13px', color: '#50575e', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <ArrowLeft size={14} /> Back to Posts
          </Link>
          <h1 style={{ fontSize: '23px', fontWeight: 400, margin: 0, color: '#1d2327' }}>Edit Post</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {form.slug && (
            <Link href={`/${lang}/blog/${form.slug}`} target="_blank"
              style={{ padding: '8px 16px', border: '1px solid #8c8f94', borderRadius: '3px', background: '#fff', color: '#50575e', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={14} /> Preview
            </Link>
          )}
          <button onClick={handleSave} disabled={saving}
            style={{ padding: '8px 16px', border: 'none', borderRadius: '3px', background: '#2271b1', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Save size={14} /> {saving ? 'Saving...' : 'Update'}
          </button>
        </div>
      </div>

      <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })} style={inputStyle} />
      
      <input placeholder="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} style={inputStyle} />
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        <select value={form.lang} onChange={e => setForm({ ...form, lang: e.target.value })} style={{ ...inputStyle, width: 'auto' }}>
          <option value="en">English</option><option value="ur">Urdu</option><option value="hi">Hindi</option><option value="ar">Arabic</option>
        </select>
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...inputStyle, width: 'auto' }}>
          <option value="calculators">Calculators</option><option value="image-tools">Image Tools</option><option value="pdf-tools">PDF Tools</option>
          <option value="code-tools">Code Tools</option><option value="text-tools">Text Tools</option><option value="security-tools">Security</option>
          <option value="design-tools">Design</option>
        </select>
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ ...inputStyle, width: 'auto' }}>
          <option value="draft">Draft</option><option value="published">Published</option>
        </select>
      </div>

      <div style={{ padding: '16px', border: '1px solid #c3c4c7', borderRadius: '4px', marginBottom: '12px', backgroundColor: '#f9f9f9' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d2327', marginBottom: '8px', display: 'block' }}>🖼️ Featured Image</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL" style={{ ...inputStyle, marginBottom: 0 }} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            style={{ padding: '8px 12px', border: '1px solid #8c8f94', borderRadius: '3px', background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload
          </button>
        </div>
        {uploadMsg && <div style={{ marginTop: '8px', fontSize: '12px', color: uploadMsg.includes('✅') ? '#10b981' : '#ef4444' }}>{uploadMsg}</div>}
        {form.image_url && <img src={form.image_url} alt="Preview" style={{ maxWidth: '300px', maxHeight: '150px', marginTop: '8px', borderRadius: '4px' }} />}
      </div>
      <input type="file" ref={fileRef} accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />

      <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d2327', marginBottom: '8px', display: 'block' }}>📝 Content (HTML)</label>
      <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={20}
        style={{ width: '100%', padding: '12px', border: '1px solid #8c8f94', borderRadius: '3px', fontSize: '14px', fontFamily: 'monospace', boxSizing: 'border-box', marginBottom: '16px', resize: 'vertical' }} />

      <button onClick={handleSave} disabled={saving}
        style={{ width: '100%', padding: '12px', border: 'none', borderRadius: '3px', background: '#2271b1', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
        <Save size={16} style={{ display: 'inline', marginRight: '6px' }} />
        {saving ? 'Saving...' : '💾 Update Post'}
      </button>
    </div>
  );
}
