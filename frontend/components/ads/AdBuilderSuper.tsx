'use client';
import { useState, useRef } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { 
  Upload, Palette, Type, Move, Eye, Zap, Sparkles, 
  QrCode, Globe, Smartphone, Clock, Play, Image
} from 'lucide-react';

interface AdBuilderSuperProps {
  onSave: (ad: any) => void;
  onClose: () => void;
}

export default function AdBuilderSuper({ onSave, onClose }: AdBuilderSuperProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [tab, setTab] = useState<'design' | 'ai' | 'qr' | 'target' | 'schedule'>('design');
  const [adTitle, setAdTitle] = useState('Amazing Offer!');
  const [adDesc, setAdDesc] = useState('Click to learn more');
  const [bgColor, setBgColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(24);
  const [animation, setAnimation] = useState('none');
  const [size, setSize] = useState('728x90');
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [targetCountry, setTargetCountry] = useState('');
  const [targetCity, setTargetCity] = useState('');
  const [targetDevice, setTargetDevice] = useState('');
  const [aiProduct, setAiProduct] = useState('');
  const [aiTone, setAiTone] = useState('professional');
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [qrUrl, setQrUrl] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [scheduleDays, setScheduleDays] = useState<string[]>([]);
  const [scheduleStart, setScheduleStart] = useState('');
  const [scheduleEnd, setScheduleEnd] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const surface = themeColors.surface || '#ffffff';
  const border = themeColors.border || '#e2e8f0';
  const textPrimary = themeColors.text?.primary || '#0f172a';
  const primary = themeColors.primary || '#3b82f6';

  const tabs = [
    { id: 'design', icon: Palette, label: 'Design' },
    { id: 'ai', icon: Sparkles, label: 'AI Generate' },
    { id: 'qr', icon: QrCode, label: 'QR Code' },
    { id: 'target', icon: Globe, label: 'Target' },
    { id: 'schedule', icon: Clock, label: 'Schedule' },
  ];

  const sizes = [
    { value: '728x90', label: 'Leaderboard', w: 728, h: 90 },
    { value: '300x600', label: 'Half Page', w: 300, h: 600 },
    { value: '300x250', label: 'Rectangle', w: 300, h: 250 },
    { value: '320x100', label: 'Mobile', w: 320, h: 100 },
    { value: '970x250', label: 'Billboard', w: 970, h: 250 },
  ];

  const animations = [
    { value: 'none', label: 'None' },
    { value: 'fade', label: 'Fade In' },
    { value: 'slide', label: 'Slide Up' },
    { value: 'bounce', label: 'Bounce' },
    { value: 'pulse', label: 'Pulse' },
  ];

  const currentSize = sizes.find(s => s.value === size) || sizes[0];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/ads/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) setImageUrl(data.url);
  };

  const handleAIGenerate = async () => {
    if (!aiProduct) return;
    const res = await fetch('/api/ads/ai-generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: aiProduct, target: 'users', tone: aiTone }),
    });
    const data = await res.json();
    if (data.success) setAiResults(data.variations);
  };

  const applyAIVariation = (v: any) => {
    setAdTitle(v.title); setAdDesc(v.description);
    setBgColor(v.bgColor); setTextColor(v.textColor);
    setTab('design');
  };

  const handleQRGenerate = async () => {
    if (!targetUrl) return;
    const res = await fetch('/api/ads/qrcode', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: targetUrl }) });
    const data = await res.json();
    if (data.success) setQrImage(data.qr_code_url);
  };

  const handleSave = () => {
    onSave({
      title: adTitle, description: adDesc, bgColor, textColor, fontSize, animation,
      size, imageUrl, targetUrl, targetCountry, targetCity, targetDevice,
      scheduleDays, scheduleStart, scheduleEnd, qr_code_url: qrImage,
      ad_type: 'client', ai_generated: aiResults.length > 0 ? 1 : 0,
    });
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div style={{ fontFamily: themeColors.fontFamily }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '2px solid ' + border, paddingBottom: '12px', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            style={{
              padding: '10px 20px', borderRadius: '8px', border: 'none',
              background: tab === t.id ? primary : 'transparent',
              color: tab === t.id ? '#fff' : (themeColors.text?.secondary || '#64748b'),
              fontWeight: 600, cursor: 'pointer', fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap'
            }}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* LEFT: Controls */}
        <div style={{ padding: '20px', background: surface, borderRadius: '12px', border: '1px solid ' + border, maxHeight: '500px', overflowY: 'auto' }}>
          
          {tab === 'design' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input placeholder="Ad Title" value={adTitle} onChange={e => setAdTitle(e.target.value)}
                style={inputStyle(border, textPrimary)} />
              <input placeholder="Description" value={adDesc} onChange={e => setAdDesc(e.target.value)}
                style={inputStyle(border, textPrimary)} />
              <input placeholder="Target URL" value={targetUrl} onChange={e => setTargetUrl(e.target.value)}
                style={inputStyle(border, textPrimary)} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div><label style={labelStyle}>BG Color</label><input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: '100%', height: '32px', border: 'none', cursor: 'pointer' }} /></div>
                <div><label style={labelStyle}>Text Color</label><input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} style={{ width: '100%', height: '32px', border: 'none', cursor: 'pointer' }} /></div>
                <div><label style={labelStyle}>Font Size</label><input type="number" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={inputStyle(border, textPrimary)} /></div>
              </div>

              <div>
                <label style={labelStyle}>Banner Size</label>
                <select value={size} onChange={e => setSize(e.target.value)} style={inputStyle(border, textPrimary)}>
                  {sizes.map(s => <option key={s.value} value={s.value}>{s.label} ({s.w}×{s.h})</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Animation</label>
                <select value={animation} onChange={e => setAnimation(e.target.value)} style={inputStyle(border, textPrimary)}>
                  {animations.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>

              <div onClick={() => fileRef.current?.click()}
                style={{ padding: '20px', border: '2px dashed ' + border, borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}>
                <Upload size={20} style={{ opacity: 0.5 }} />
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Click to upload image</p>
                <input type="file" ref={fileRef} accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </div>
              {imageUrl && <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px' }} />}
            </div>
          )}

          {tab === 'ai' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ margin: 0, color: primary }}><Sparkles size={16} /> AI Ad Generator</h4>
              <input placeholder="Product/Service name" value={aiProduct} onChange={e => setAiProduct(e.target.value)} style={inputStyle(border, textPrimary)} />
              <select value={aiTone} onChange={e => setAiTone(e.target.value)} style={inputStyle(border, textPrimary)}>
                <option value="professional">Professional</option>
                <option value="urgent">Urgent/Limited</option>
                <option value="friendly">Friendly/Casual</option>
                <option value="luxury">Luxury/Premium</option>
              </select>
              <button onClick={handleAIGenerate}
                style={{ padding: '12px', background: primary, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                <Sparkles size={16} /> Generate Ad Variations
              </button>
              
              {aiResults.map((v, i) => (
                <div key={i} onClick={() => applyAIVariation(v)}
                  style={{ padding: '12px', border: '1px solid ' + border, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ fontWeight: 600, color: textPrimary, fontSize: '14px' }}>{v.title}</div>
                  <div style={{ fontSize: '12px', color: themeColors.text?.secondary, marginTop: '4px' }}>{v.description}</div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                    {[v.bgColor, v.accentColor, v.textColor].map((c, j) => (
                      <div key={j} style={{ width: '16px', height: '16px', borderRadius: '50%', background: c, border: '1px solid #ccc' }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'qr' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <h4 style={{ margin: 0, color: primary }}><QrCode size={16} /> QR Code Generator</h4>
              <p style={{ fontSize: '12px', color: themeColors.text?.secondary }}>Generate QR code for your ad URL</p>
              <input placeholder="Enter URL" value={targetUrl} onChange={e => setTargetUrl(e.target.value)} style={{...inputStyle(border, textPrimary), width: '100%'}} />
              <button onClick={handleQRGenerate}
                style={{ padding: '12px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                <QrCode size={16} /> Generate QR Code
              </button>
              {qrImage && <img src={qrImage} alt="QR Code" style={{ width: '200px', height: '200px' }} />}
            </div>
          )}

          {tab === 'target' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ margin: 0, color: primary }}><Globe size={16} /> Geo & Device Targeting</h4>
              <select value={targetCountry} onChange={e => setTargetCountry(e.target.value)} style={inputStyle(border, textPrimary)}>
                <option value="">All Countries</option>
                <option value="PK">Pakistan</option>
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="AE">UAE</option>
                <option value="SA">Saudi Arabia</option>
              </select>
              <input placeholder="City (optional)" value={targetCity} onChange={e => setTargetCity(e.target.value)} style={inputStyle(border, textPrimary)} />
              <select value={targetDevice} onChange={e => setTargetDevice(e.target.value)} style={inputStyle(border, textPrimary)}>
                <option value="">All Devices</option>
                <option value="mobile">Mobile Only</option>
                <option value="desktop">Desktop Only</option>
                <option value="tablet">Tablet Only</option>
              </select>
            </div>
          )}

          {tab === 'schedule' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ margin: 0, color: primary }}><Clock size={16} /> Ad Schedule</h4>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {days.map(d => (
                  <button key={d} onClick={() => setScheduleDays(scheduleDays.includes(d) ? scheduleDays.filter(x => x !== d) : [...scheduleDays, d])}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid ' + (scheduleDays.includes(d) ? primary : border), background: scheduleDays.includes(d) ? primary + '15' : 'transparent', color: scheduleDays.includes(d) ? primary : themeColors.text?.secondary, fontWeight: 600, cursor: 'pointer', fontSize: '11px' }}>
                    {d}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div><label style={labelStyle}>Start Time</label><input type="time" value={scheduleStart} onChange={e => setScheduleStart(e.target.value)} style={inputStyle(border, textPrimary)} /></div>
                <div><label style={labelStyle}>End Time</label><input type="time" value={scheduleEnd} onChange={e => setScheduleEnd(e.target.value)} style={inputStyle(border, textPrimary)} /></div>
              </div>
            </div>
          )}

          <button onClick={handleSave}
            style={{ padding: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '15px', marginTop: '8px' }}>
            ✅ Save Ad
          </button>
        </div>

        {/* RIGHT: Live Preview */}
        <div style={{ padding: '20px', background: surface, borderRadius: '12px', border: '1px solid ' + border, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <h4 style={{ marginBottom: '16px', color: textPrimary }}><Eye size={16} /> Preview</h4>
          <div style={{
            width: Math.min(currentSize.w, 400) + 'px',
            height: Math.min(currentSize.h, 200) + 'px',
            background: imageUrl ? 'url(' + imageUrl + ') center/cover' : bgColor,
            borderRadius: '8px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: textColor, textAlign: 'center', padding: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transition: 'all 0.3s',
            position: 'relative', overflow: 'hidden',
            animation: animation === 'fade' ? 'fadeIn 1s' : animation === 'bounce' ? 'bounce 1s' : animation === 'pulse' ? 'pulse 2s infinite' : 'none'
          }}>
            {imageUrl && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: fontSize + 'px', fontWeight: 700, marginBottom: '4px' }}>{adTitle}</div>
              <div style={{ fontSize: Math.max(11, fontSize * 0.45) + 'px', opacity: 0.9 }}>{adDesc}</div>
            </div>
          </div>
          {qrImage && <img src={qrImage} alt="QR" style={{ width: '100px', height: '100px', marginTop: '12px' }} />}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      `}</style>
    </div>
  );
}

const inputStyle = (border: string, textPrimary: string): React.CSSProperties => ({
  padding: '8px 10px', borderRadius: '6px', border: '1px solid ' + border,
  background: 'transparent', color: textPrimary, fontSize: '13px', width: '100%', boxSizing: 'border-box'
});

const labelStyle: React.CSSProperties = { fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' };
