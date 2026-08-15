'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload, Loader2, Send } from 'lucide-react';
import Link from 'next/link';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ur', label: 'Urdu', flag: '🇵🇰' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
];

export default function NewPostClient({ lang }: { lang: string }) {
  const router = useRouter();
  const [activeLang, setActiveLang] = useState('en');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [enData, setEnData] = useState({ title: '', slug: '', excerpt: '', content: '', image_url: '' });
  const [urData, setUrData] = useState({ title: '', slug: '', excerpt: '', content: '', image_url: '' });
  const [hiData, setHiData] = useState({ title: '', slug: '', excerpt: '', content: '', image_url: '' });
  const [arData, setArData] = useState({ title: '', slug: '', excerpt: '', content: '', image_url: '' });

  const langDataMap: any = { en: enData, ur: urData, hi: hiData, ar: arData };
  const langSetterMap: any = { en: setEnData, ur: setUrData, hi: setHiData, ar: setArData };

  const current = langDataMap[activeLang];
  const currentSetter = langSetterMap[activeLang];

  const [form, setForm] = useState({ category: 'calculators', status: 'draft' as 'draft' | 'published' });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setUploadMsg('⏳ Uploading...');
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/upload/blog-media', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) {
      currentSetter({ ...current, image_url: data.url });
      setUploadMsg('✅ Uploaded!');
      setTimeout(() => setUploadMsg(''), 2000);
    } else { setUploadMsg('❌ Failed'); }
    setUploading(false);
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!enData.title) { alert('English title is required!'); return; }
    setSaving(true);
    const translations = {
      en: { ...enData, slug: enData.slug || enData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
      ur: { ...urData, slug: urData.slug || urData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
      hi: { ...hiData, slug: hiData.slug || hiData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
      ar: { ...arData, slug: arData.slug || arData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
    };
    const res = await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ translations, category: form.category, status, featured_image: enData.image_url, image_url: enData.image_url }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) { alert('✅ Post created!'); router.push(`/${lang}/admin/posts`); }
    else { alert('❌ Failed'); }
  };

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
          <h1 style={{ fontSize: '23px', fontWeight: 400, margin: 0, color: '#1d2327' }}>Add New Post</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => handleSubmit('draft')} disabled={saving}
            style={{ padding: '8px 16px', border: '1px solid #8c8f94', borderRadius: '3px', background: '#fff', color: '#50575e', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Save size={14} /> Save Draft
          </button>
          <button onClick={() => handleSubmit('published')} disabled={saving}
            style={{ padding: '8px 16px', border: 'none', borderRadius: '3px', background: '#2271b1', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Send size={14} /> Publish
          </button>
        </div>
      </div>

      {/* Language Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '1px solid #c3c4c7', paddingBottom: '8px' }}>
        {LANGUAGES.map(l => (
          <button key={l.code} onClick={() => setActiveLang(l.code)}
            style={{
              padding: '6px 12px', border: '1px solid ' + (activeLang === l.code ? '#2271b1' : '#c3c4c7'),
              borderRadius: '3px 3px 0 0', borderBottom: activeLang === l.code ? '1px solid #fff' : '1px solid #c3c4c7',
              backgroundColor: activeLang === l.code ? '#fff' : '#f0f0f1', color: activeLang === l.code ? '#1d2327' : '#50575e',
              cursor: 'pointer', fontSize: '13px', fontWeight: activeLang === l.code ? 600 : 400,
              marginBottom: '-1px', position: 'relative'
            }}>
            {l.flag} {l.label}
          </button>
        ))}
      </div>

      <input placeholder="Title" value={current.title || ''} onChange={e => currentSetter({ ...current, title: e.target.value })} style={inputStyle} />
      <input placeholder="Slug" value={current.slug || ''} onChange={e => currentSetter({ ...current, slug: e.target.value })} style={inputStyle} />
      <textarea placeholder="Excerpt" value={current.excerpt || ''} onChange={e => currentSetter({ ...current, excerpt: e.target.value })} rows={2} style={inputStyle} />

      <div style={{ padding: '16px', border: '1px solid #c3c4c7', borderRadius: '4px', marginBottom: '12px', backgroundColor: '#f9f9f9' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d2327', marginBottom: '8px', display: 'block' }}>🖼️ Featured Image</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input value={current.image_url || ''} onChange={e => currentSetter({ ...current, image_url: e.target.value })} placeholder="Image URL" style={{ ...inputStyle, marginBottom: 0 }} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            style={{ padding: '8px 12px', border: '1px solid #8c8f94', borderRadius: '3px', background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload
          </button>
        </div>
        {uploadMsg && <div style={{ marginTop: '8px', fontSize: '12px', color: uploadMsg.includes('✅') ? '#10b981' : '#ef4444' }}>{uploadMsg}</div>}
        {current.image_url && <img src={current.image_url} alt="Preview" style={{ maxWidth: '300px', maxHeight: '150px', marginTop: '8px', borderRadius: '4px' }} />}
      </div>
      <input type="file" ref={fileRef} accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />

      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...inputStyle, width: 'auto' }}>
          <option value="calculators">Calculators</option><option value="image-tools">Image Tools</option><option value="pdf-tools">PDF Tools</option>
          <option value="code-tools">Code Tools</option><option value="text-tools">Text Tools</option><option value="security-tools">Security</option>
          <option value="design-tools">Design</option>
        </select>
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} style={{ ...inputStyle, width: 'auto' }}>
          <option value="draft">Draft</option><option value="published">Published</option>
        </select>
      </div>

      <label style={{ fontSize: '13px', fontWeight: 600, color: '#1d2327', marginBottom: '8px', display: 'block' }}>📝 Content (HTML)</label>
      <textarea value={current.content || ''} onChange={e => currentSetter({ ...current, content: e.target.value })} rows={20}
        style={{ width: '100%', padding: '12px', border: '1px solid #8c8f94', borderRadius: '3px', fontSize: '14px', fontFamily: 'monospace', boxSizing: 'border-box', marginBottom: '16px', resize: 'vertical' }} />

      <button onClick={() => handleSubmit('published')} disabled={saving}
        style={{ width: '100%', padding: '12px', border: 'none', borderRadius: '3px', background: '#2271b1', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
        <Send size={16} style={{ display: 'inline', marginRight: '6px' }} />
        {saving ? 'Publishing...' : '🚀 Publish Post'}
      </button>
    </div>
  );
}
