'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { 
  ArrowLeft, Upload, X, Target, Check, AlertCircle, Eye,
  Smartphone, Monitor, Tablet, ChevronDown, ChevronUp, Palette
} from 'lucide-react';
import LocationPicker from '@/components/location/LocationPicker';

const TEMPLATES = [
  { id: 'sale', icon: '🔥', title: 'Sale Offer', desc: '50% OFF — Limited Time!', bg: '#ef4444', text: '#ffffff' },
  { id: 'launch', icon: '🚀', title: 'New Launch', desc: 'Introducing Our New Tool', bg: '#8b5cf6', text: '#ffffff' },
  { id: 'free', icon: '🎁', title: 'Free Trial', desc: 'Try Free for 7 Days', bg: '#10b981', text: '#ffffff' },
  { id: 'discount', icon: '💰', title: 'Discount Code', desc: 'Use Code SAVE20', bg: '#f59e0b', text: '#000000' },
  { id: 'newsletter', icon: '📧', title: 'Newsletter', desc: 'Subscribe for Updates', bg: '#3b82f6', text: '#ffffff' },
  { id: 'webinar', icon: '🎥', title: 'Webinar', desc: 'Join Our Free Webinar', bg: '#6366f1', text: '#ffffff' },
  { id: 'sponsored', icon: '⭐', title: 'Sponsored', desc: 'Sponsored Content', bg: '#0ea5e9', text: '#ffffff' },
  { id: 'announcement', icon: '📢', title: 'Announcement', desc: 'Special Announcement', bg: '#f43f5e', text: '#ffffff' },
];

const PLACEMENTS = [
  { value: 'header', label: '🖥️ Header (728x90)', w: 728, h: 90 },
  { value: 'sidebar', label: '📌 Sidebar (300x600)', w: 300, h: 600 },
  { value: 'in-tool', label: '🔧 In-Tool (728x90)', w: 728, h: 90 },
  { value: 'footer', label: '📄 Footer (728x90)', w: 728, h: 90 },
  { value: 'blog-post', label: '📝 Blog Post (728x90)', w: 728, h: 90 },
  { value: 'blog-sidebar', label: '📰 Blog Sidebar (300x600)', w: 300, h: 600 },
  { value: 'home-banner', label: '🏠 Home (970x250)', w: 970, h: 250 },
];

const DEVICE_PREVIEWS = [
  { id: 'desktop', icon: Monitor, label: 'Desktop', width: 100 },
  { id: 'tablet', icon: Tablet, label: 'Tablet', width: 70 },
  { id: 'mobile', icon: Smartphone, label: 'Mobile', width: 45 },
];

export default function CreateAdClient({ lang }: { lang: string }) {
  const router = useRouter();
  const { themeColors, isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deviceView, setDeviceView] = useState('desktop');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const isRTL = lang === 'ur' || lang === 'ar';

  const [form, setForm] = useState({
    title: '', description: '', target_url: '', placement: 'header',
    size: '728x90', ad_type: 'client', image_url: '', custom_html: '',
    price: 0, budget: 0, client_name: '', client_company: '', client_email: '',
    start_date: '', end_date: '', max_impressions: 10000, max_clicks: 1000,
    target_device: '', bg_color: '#3b82f6', text_color: '#ffffff',
    font_size: 18, animation: 'none',
  });

  const [location, setLocation] = useState({
    type: 'all' as 'all' | 'specific' | 'radius',
    locations: [] as Array<{ id: string; lat: number; lng: number; address: string; radius: number; }>,
  });

  useEffect(() => { setMounted(true); }, []);

  const textPrimary = themeColors?.text?.primary || '#0f172a';
  const textSecondary = themeColors?.text?.secondary || '#64748b';
  const border = themeColors?.border || '#e2e8f0';
  const surface = themeColors?.surface || '#ffffff';
  const primary = themeColors?.primary || '#3b82f6';

  useEffect(() => {
    if (!mounted) return;
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const u = JSON.parse(userData);
        setUser(u);
        setForm(prev => ({ ...prev, client_name: u.name || '', client_email: u.email || '' }));
      } catch {}
    }
  }, [mounted]);

  useEffect(() => {
    const placement = PLACEMENTS.find(p => p.value === form.placement);
    if (placement) setForm(prev => ({ ...prev, size: `${placement.w}x${placement.h}` }));
  }, [form.placement]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/ads/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) {
      setForm({ ...form, image_url: data.url });
      setPreviewUrl(data.url);
      setMessage({ type: 'success', text: '✅ Image uploaded!' });
      setTimeout(() => setMessage(null), 3000);
    }
    setUploading(false);
  };

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    setForm({ ...form, title: template.title, description: template.desc, bg_color: template.bg, text_color: template.text });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: '❌ Title is required!' });
      setLoading(false);
      return;
    }
    try {
      const submitData = {
        ...form,
        user_id: user?.id,
        client_email: user?.email || form.client_email,
        target_lat: location.locations[0]?.lat || 0,
        target_lng: location.locations[0]?.lng || 0,
        target_radius: location.locations[0]?.radius || 0,
        target_address: location.locations[0]?.address || '',
        geo_type: location.type === 'all' ? 'all' : location.type === 'radius' ? 'radius' : 'specific',
        target_locations: location.locations.map(l => ({ lat: l.lat, lng: l.lng, address: l.address, radius: l.radius || 0 })),
      };
      const res = await fetch('/api/me/ads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(submitData) });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: '✅ Ad submitted for approval!' });
        setTimeout(() => router.push(`/${lang}/dashboard/ads`), 1500);
      } else {
        setMessage({ type: 'error', text: '❌ ' + (data.error || 'Submission failed') });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: '❌ ' + err.message });
    }
    setLoading(false);
  };

  const currentPlacement = PLACEMENTS.find(p => p.value === form.placement) || PLACEMENTS[0];
  const currentDevice = DEVICE_PREVIEWS.find(d => d.id === deviceView) || DEVICE_PREVIEWS[0];

  const getPreviewDimensions = () => {
    const baseW = currentPlacement.w;
    const baseH = currentPlacement.h;
    const aspectRatio = baseW / baseH;
    let maxWidth = 100; // Default small
    if (deviceView === 'mobile') maxWidth = 280;
    else if (deviceView === 'tablet') maxWidth = 400;
    else maxWidth = 500; // Desktop — chhota karo taake overflow na ho
    if (currentPlacement.value === 'sidebar' || currentPlacement.value === 'blog-sidebar') {
      maxWidth = deviceView === 'mobile' ? 150 : 220;
    }
    const width = Math.min(maxWidth, baseW);
    const height = width / aspectRatio;
    return { width, height, maxWidth };
  };

  const previewDim = getPreviewDimensions();

  const inputStyle = {
    padding: '12px 14px', borderRadius: '10px', border: '1px solid ' + border,
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', color: textPrimary,
    fontSize: '13px', outline: 'none', width: '100%',
    boxSizing: 'border-box' as const, minHeight: '44px',
  };

  const labelStyle = {
    display: 'block', fontSize: '12px', fontWeight: 600,
    color: textSecondary, marginBottom: '6px',
  };

  if (!mounted) {
    return (
      <div className="create-ad-container">
        <div className="create-ad-wrapper" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ color: textSecondary }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="create-ad-container">
        <div className="create-ad-wrapper" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ color: textSecondary }}>Loading user...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-ad-container" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="create-ad-wrapper">
        
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <Link href={`/${lang}/dashboard/ads`} style={{
            padding: '8px 12px', borderRadius: '10px', border: '1px solid ' + border,
            color: textSecondary, textDecoration: 'none', display: 'flex',
            alignItems: 'center', gap: '6px', fontSize: '13px', minHeight: '40px',
          }}>
            <ArrowLeft size={16} /> Back
          </Link>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <h1 style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 800, color: textPrimary, margin: 0 }}>
              Create New Advertisement
            </h1>
            <p style={{ fontSize: '13px', color: textSecondary, margin: '4px 0 0' }}>
              Target your audience with precision
            </p>
          </div>
        </div>

        {/* MESSAGE */}
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

        {/* MAIN GRID */}
        <div className="create-ad-grid">
          
          {/* ========== FORM SECTION ========== */}
          <div className="form-section" style={{ background: surface, borderRadius: '16px', border: '1px solid ' + border, padding: '16px' }}>
            
            {/* Templates */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>✨ Quick Templates</label>
              <div className="templates-scroll">
                {TEMPLATES.map((t) => (
                  <button key={t.id} onClick={() => applyTemplate(t)} style={{
                    padding: '10px 14px', borderRadius: '8px', border: '1px solid ' + border,
                    background: 'transparent', cursor: 'pointer', fontSize: '11px',
                    display: 'flex', alignItems: 'center', gap: '4px', color: textPrimary,
                    whiteSpace: 'nowrap', flexShrink: 0, minHeight: '40px',
                  }}>
                    <span>{t.icon}</span> {t.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Form */}
            <div className="form-grid">
              <div>
                <label style={labelStyle}>📝 Ad Title *</label>
                <input placeholder="e.g. Summer Sale 2026" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>🔗 Target URL *</label>
                <input placeholder="https://www.centre.com.pk/..." value={form.target_url} onChange={(e) => setForm({ ...form, target_url: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>📄 Description</label>
                <input placeholder="Brief description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>📍 Placement</label>
                <select value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })} style={inputStyle}>
                  {PLACEMENTS.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>🖼️ Image URL</label>
                <input placeholder="Paste image URL or upload" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>📸 Ad Type</label>
                <select value={form.ad_type} onChange={(e) => setForm({ ...form, ad_type: e.target.value })} style={inputStyle}>
                  <option value="client">📸 Banner</option>
                  <option value="sponsor">🤝 Sponsored</option>
                  <option value="google_adsense">🔷 AdSense</option>
                </select>
              </div>
            </div>

            {/* Advanced Options — Toggle Button (mobile + desktop) */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                border: '1px dashed ' + border, background: 'transparent',
                color: textSecondary, fontSize: '12px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                marginTop: '16px', cursor: 'pointer', minHeight: '44px',
              }}
            >
              <Palette size={16} />
              {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Advanced Options — Collapsible */}
            {showAdvanced && (
              <div style={{ marginTop: '16px' }}>
                <div className="color-grid">
                  <div>
                    <label style={labelStyle}>🎨 BG Color</label>
                    <input type="color" value={form.bg_color} onChange={(e) => setForm({ ...form, bg_color: e.target.value })} style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid ' + border, cursor: 'pointer' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>✏️ Text Color</label>
                    <input type="color" value={form.text_color} onChange={(e) => setForm({ ...form, text_color: e.target.value })} style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid ' + border, cursor: 'pointer' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>📏 Font Size</label>
                    <input type="number" value={form.font_size} onChange={(e) => setForm({ ...form, font_size: Number(e.target.value) })} min={12} max={48} style={inputStyle} />
                  </div>
                </div>

                <div className="form-grid" style={{ marginTop: '16px' }}>
                  <div>
                    <label style={labelStyle}>💰 Budget ($)</label>
                    <input type="number" placeholder="0" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>👁️ Max Impressions</label>
                    <input type="number" placeholder="10000" value={form.max_impressions} onChange={(e) => setForm({ ...form, max_impressions: Number(e.target.value) })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>📅 Start Date</label>
                    <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>📅 End Date</label>
                    <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>📱 Target Device</label>
                    <select value={form.target_device} onChange={(e) => setForm({ ...form, target_device: e.target.value })} style={inputStyle}>
                      <option value="">All Devices</option>
                      <option value="desktop">Desktop</option>
                      <option value="mobile">Mobile</option>
                      <option value="tablet">Tablet</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>👤 Client Name</label>
                    <input placeholder="Your name" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} style={inputStyle} />
                  </div>
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div style={{ marginTop: '20px' }}>
              <label style={labelStyle}>📤 Upload Image</label>
              <input type="file" ref={fileRef} accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              <div onClick={() => fileRef.current?.click()} style={{
                padding: '20px', border: '2px dashed ' + border, borderRadius: '12px',
                textAlign: 'center', cursor: 'pointer', background: isDarkMode ? '#0f172a' : '#f8fafc',
                minHeight: '120px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                {uploading ? (
                  <div style={{ fontSize: '13px', color: textSecondary }}>⏳ Uploading...</div>
                ) : previewUrl ? (
                  <div>
                    <img src={previewUrl} alt="Preview" style={{ maxHeight: '80px', borderRadius: '8px', maxWidth: '100%' }} />
                    <button type="button" onClick={(e) => { e.stopPropagation(); setPreviewUrl(''); setForm({ ...form, image_url: '' }); }}
                      style={{ marginTop: '8px', padding: '6px 12px', borderRadius: '6px', border: '1px solid #ef4444', background: '#ef444410', color: '#ef4444', cursor: 'pointer', fontSize: '11px', minHeight: '36px' }}>
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload size={32} style={{ color: textSecondary, marginBottom: '8px', opacity: 0.5 }} />
                    <p style={{ fontSize: '13px', color: textSecondary, margin: 0 }}>Click to upload banner image</p>
                    <p style={{ fontSize: '11px', color: textSecondary, margin: '4px 0 0' }}>JPG, PNG, GIF</p>
                  </div>
                )}
              </div>
            </div>

            {/* Location Picker */}
            <div style={{ marginTop: '20px' }}>
              <LocationPicker value={location} onChange={setLocation} label="📍 Target Locations" />
            </div>

            {/* Submit Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', flexWrap: 'wrap' }}>
              <button onClick={handleSubmit} disabled={loading} style={{
                flex: 1, minWidth: '200px', padding: '14px', borderRadius: '12px', border: 'none',
                background: '#10b981', color: '#fff', fontWeight: 700, fontSize: '14px',
                cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', minHeight: '48px',
              }}>
                {loading ? '⏳ Submitting...' : '📢 Submit for Approval'}
              </button>
              <Link href={`/${lang}/dashboard/ads`} style={{
                padding: '14px 24px', borderRadius: '12px', border: '1px solid ' + border,
                background: 'transparent', color: textSecondary, textDecoration: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                fontSize: '14px', minHeight: '48px',
              }}>
                Cancel
              </Link>
            </div>
          </div>

          {/* ========== LIVE PREVIEW (Desktop — Right Side, Sticky, Overflow Fix) ========== */}
          <div className="preview-desktop" style={{
            background: surface, borderRadius: '16px', border: '1px solid ' + border,
            padding: '20px', overflow: 'hidden',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} color={primary} /> Live Preview
            </h3>
            
            {/* Device Toggle */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {DEVICE_PREVIEWS.map((d) => {
                const Icon = d.icon;
                return (
                  <button key={d.id} onClick={() => setDeviceView(d.id)} style={{
                    padding: '8px 14px', borderRadius: '8px', border: '1px solid ' + border,
                    background: deviceView === d.id ? primary + '20' : 'transparent',
                    color: deviceView === d.id ? primary : textSecondary,
                    cursor: 'pointer', fontSize: '12px', fontWeight: deviceView === d.id ? 600 : 400,
                    display: 'flex', alignItems: 'center', gap: '4px', minHeight: '40px',
                  }}>
                    <Icon size={14} /> {d.label}
                  </button>
                );
              })}
            </div>

            {/* Placement Info */}
            <div style={{
              fontSize: '12px', color: textSecondary, marginBottom: '12px',
              padding: '10px 12px', background: isDarkMode ? '#0f172a' : '#f8fafc',
              borderRadius: '8px', display: 'flex', justifyContent: 'space-between',
            }}>
              <span>📐 {currentPlacement.label}</span>
              <span>{currentPlacement.w}×{currentPlacement.h}</span>
            </div>

            {/* Ad Preview Box — Overflow Fixed */}
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              background: isDarkMode ? '#0f172a' : '#f1f5f9',
              borderRadius: '12px', padding: '16px', minHeight: '200px',
              maxHeight: '400px', overflow: 'auto',
            }}>
              <div style={{
                width: previewDim.width + 'px',
                height: previewDim.height + 'px',
                maxWidth: '100%',
                background: form.image_url ? `url(${form.image_url}) center/cover` : form.bg_color,
                borderRadius: '8px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: form.text_color, textAlign: 'center', padding: '12px',
                position: 'relative', overflow: 'hidden',
                border: '2px solid ' + border,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                flexShrink: 0,
              }}>
                {form.image_url && (<div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />)}
                <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                  <div style={{
                    fontSize: Math.min(form.font_size, previewDim.height / 3.5) + 'px',
                    fontWeight: 700, marginBottom: '2px', wordBreak: 'break-word', lineHeight: 1.2,
                  }}>
                    {form.title || 'Ad Title'}
                  </div>
                  <div style={{
                    fontSize: Math.max(9, Math.min(form.font_size * 0.45, previewDim.height / 6)) + 'px',
                    opacity: 0.9, wordBreak: 'break-word',
                  }}>
                    {form.description || 'Description'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '12px', fontSize: '11px', color: textSecondary,
              textAlign: 'center', padding: '8px',
              background: isDarkMode ? '#0f172a' : '#f8fafc', borderRadius: '6px',
            }}>
              📱 {currentDevice.label} • {Math.round(previewDim.width)}×{Math.round(previewDim.height)}
            </div>
          </div>

          {/* ========== LIVE PREVIEW (Mobile — Top or Bottom, All Features) ========== */}
          <div className="preview-mobile" style={{
            background: surface, borderRadius: '16px', border: '1px solid ' + border,
            padding: '16px', overflow: 'hidden',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={16} color={primary} /> Live Preview
            </h3>
            
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {DEVICE_PREVIEWS.map((d) => {
                const Icon = d.icon;
                return (
                  <button key={d.id} onClick={() => setDeviceView(d.id)} style={{
                    padding: '8px 12px', borderRadius: '8px', border: '1px solid ' + border,
                    background: deviceView === d.id ? primary + '20' : 'transparent',
                    color: deviceView === d.id ? primary : textSecondary,
                    cursor: 'pointer', fontSize: '11px', fontWeight: deviceView === d.id ? 600 : 400,
                    display: 'flex', alignItems: 'center', gap: '4px', minHeight: '36px',
                  }}>
                    <Icon size={12} /> {d.label}
                  </button>
                );
              })}
            </div>

            <div style={{
              fontSize: '11px', color: textSecondary, marginBottom: '12px',
              padding: '8px 12px', background: isDarkMode ? '#0f172a' : '#f8fafc',
              borderRadius: '8px', display: 'flex', justifyContent: 'space-between',
            }}>
              <span>📐 {currentPlacement.label}</span>
              <span>{currentPlacement.w}×{currentPlacement.h}</span>
            </div>

            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              background: isDarkMode ? '#0f172a' : '#f1f5f9',
              borderRadius: '12px', padding: '16px', minHeight: '180px',
            }}>
              <div style={{
                width: previewDim.width + 'px', height: previewDim.height + 'px',
                maxWidth: '100%',
                background: form.image_url ? `url(${form.image_url}) center/cover` : form.bg_color,
                borderRadius: '8px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: form.text_color, textAlign: 'center', padding: '12px',
                position: 'relative', overflow: 'hidden',
                border: '2px solid ' + border,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}>
                {form.image_url && (<div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />)}
                <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                  <div style={{
                    fontSize: Math.min(form.font_size, previewDim.height / 3.5) + 'px',
                    fontWeight: 700, marginBottom: '2px', wordBreak: 'break-word', lineHeight: 1.2,
                  }}>
                    {form.title || 'Ad Title'}
                  </div>
                  <div style={{
                    fontSize: Math.max(9, Math.min(form.font_size * 0.45, previewDim.height / 6)) + 'px',
                    opacity: 0.9, wordBreak: 'break-word',
                  }}>
                    {form.description || 'Description'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '12px', fontSize: '11px', color: textSecondary,
              textAlign: 'center', padding: '8px',
              background: isDarkMode ? '#0f172a' : '#f8fafc', borderRadius: '6px',
            }}>
              📱 {currentDevice.label} • {Math.round(previewDim.width)}×{Math.round(previewDim.height)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}