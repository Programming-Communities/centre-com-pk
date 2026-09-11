'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { ArrowLeft, Save, Calculator, Code, RefreshCw, Sparkles, Settings, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { value: 'calculators', label: 'Calculators', icon: '🧮' },
  { value: 'code-tools', label: 'Code Tools', icon: '💻' },
  { value: 'design-tools', label: 'Design Tools', icon: '🎨' },
  { value: 'image-tools', label: 'Image Tools', icon: '🖼️' },
  { value: 'pdf-tools', label: 'PDF Tools', icon: '📄' },
  { value: 'security-tools', label: 'Security Tools', icon: '🔒' },
  { value: 'text-tools', label: 'Text Tools', icon: '📝' },
];

const TOOL_TYPES = [
  { value: 'calculator', label: 'Calculator', icon: Calculator, desc: 'Form + Calculate' },
  { value: 'formatter', label: 'Formatter', icon: Code, desc: 'Text formatter' },
  { value: 'converter', label: 'Converter', icon: RefreshCw, desc: 'Upload → Download' },
  { value: 'generator', label: 'Generator', icon: Sparkles, desc: 'Button → Output' },
  { value: 'custom', label: 'Custom', icon: Settings, desc: 'Custom code' },
];

export default function ToolCreator() {
  const router = useRouter();
  const params = useParams() as { lang: string };
  const lang = params?.lang || 'en';
  const { themeColors } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: 'calculators',
    icon: '🔧',
    type: 'calculator',
    description: '',
  });

  const [autoSEO, setAutoSEO] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ HYDration FIX — Flat colors object (server + client same)
  const colors = {
    background: mounted ? (themeColors?.background || '#ffffff') : '#ffffff',
    surface: mounted ? (themeColors?.surface || '#f8fafc') : '#f8fafc',
    textPrimary: mounted ? (themeColors?.text?.primary || '#0f172a') : '#0f172a',
    textSecondary: mounted ? (themeColors?.text?.secondary || '#334155') : '#334155',
    border: mounted ? (themeColors?.border || '#e2e8f0') : '#e2e8f0',
    primary: mounted ? (themeColors?.primary || '#1d4ed8') : '#1d4ed8',
  };

  const handleNameChange = (name: string) => {
    setForm({
      ...form,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.slug) {
      setMessage({ type: 'error', text: '❌ Please fill required fields' });
      return;
    }
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/tools/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          seo: autoSEO ? undefined : {},
          translations: autoTranslate ? undefined : {},
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: '✅ Tool created successfully!' });
        setTimeout(() => router.push(`/${lang}/admin/tools-manager`), 1500);
      } else {
        setMessage({ type: 'error', text: '❌ ' + (data.error || 'Failed') });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: '❌ ' + err.message });
    }
    setSaving(false);
  };

  const inputStyle: any = {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '1px solid ' + colors.border, backgroundColor: colors.background,
    color: colors.textPrimary, fontSize: '13px', outline: 'none',
    boxSizing: 'border-box', minHeight: '44px',
  };

  const labelStyle: any = {
    display: 'block', fontSize: '12px', fontWeight: 600,
    color: colors.textSecondary, marginBottom: '6px',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background, padding: '16px 12px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Link href={`/${lang}/admin/tools-manager`} style={{
            padding: '8px 12px', borderRadius: '10px', border: '1px solid ' + colors.border,
            color: colors.textSecondary, textDecoration: 'none', display: 'flex',
            alignItems: 'center', gap: '6px', fontSize: '13px',
          }}>
            <ArrowLeft size={16} /> Back
          </Link>
          <h1 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: colors.textPrimary, margin: 0 }}>
            🛠️ Create New Tool
          </h1>
        </div>

        {message && (
          <div style={{
            padding: '12px 16px', borderRadius: '12px',
            backgroundColor: message.type === 'success' ? '#10b981' : '#ef4444',
            color: '#fff', marginBottom: '16px', display: 'flex',
            alignItems: 'center', gap: '10px', fontSize: '13px',
          }}>
            {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        <div style={{ padding: '20px', backgroundColor: colors.surface, borderRadius: '16px', border: '1px solid ' + colors.border }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Tool Name *</label>
              <input type="text" placeholder="e.g. Discount Calculator"
                value={form.name} onChange={(e) => handleNameChange(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>URL Slug *</label>
              <input type="text" placeholder="discount-calculator"
                value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                {CATEGORIES.map(c => (<option key={c.value} value={c.value}>{c.icon} {c.label}</option>))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Icon</label>
              <input type="text" placeholder="🔧" value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })} style={inputStyle} maxLength={4} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Description</label>
            <textarea placeholder="Brief description..." value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} />
          </div>

          <label style={labelStyle}>Tool Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            {TOOL_TYPES.map((t) => {
              const Icon = t.icon;
              const selected = form.type === t.value;
              return (
                <button key={t.value} onClick={() => setForm({ ...form, type: t.value })}
                  style={{
                    padding: '12px', borderRadius: '10px',
                    border: '2px solid ' + (selected ? colors.primary : colors.border),
                    backgroundColor: selected ? colors.primary + '10' : 'transparent',
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                  <Icon size={18} style={{ color: selected ? colors.primary : colors.textSecondary, marginBottom: '6px' }} />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: selected ? colors.primary : colors.textPrimary }}>
                    {t.label}
                  </div>
                  <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: '2px' }}>{t.desc}</div>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', border: '1px solid ' + colors.border, borderRadius: '10px' }}>
              <input type="checkbox" checked={autoSEO} onChange={(e) => setAutoSEO(e.target.checked)} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary }}>Auto-generate SEO</div>
                <div style={{ fontSize: '11px', color: colors.textSecondary }}>Title, description, keywords, FAQs</div>
              </div>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', border: '1px solid ' + colors.border, borderRadius: '10px' }}>
              <input type="checkbox" checked={autoTranslate} onChange={(e) => setAutoTranslate(e.target.checked)} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary }}>Auto-generate Translations</div>
                <div style={{ fontSize: '11px', color: colors.textSecondary }}>English, Urdu, Hindi, Arabic</div>
              </div>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleSubmit} disabled={saving}
              style={{
                flex: 1, minWidth: '200px', padding: '14px', borderRadius: '12px', border: 'none',
                background: '#10b981', color: '#fff', fontWeight: 700, fontSize: '14px',
                cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                minHeight: '48px',
              }}>
              {saving ? '⏳ Creating...' : <><Save size={18} /> Create Tool</>}
            </button>
            <Link href={`/${lang}/admin/tools-manager`}
              style={{
                padding: '14px 24px', borderRadius: '12px',
                border: '1px solid ' + colors.border, background: 'transparent',
                color: colors.textSecondary, textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '14px', minHeight: '48px',
              }}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}