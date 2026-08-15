'use client';
import { useState } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Upload, Palette, Type, Move, Eye } from 'lucide-react';

interface AdBuilderProps {
  onSave: (ad: any) => void;
}

export default function AdBuilder({ onSave }: AdBuilderProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [adTitle, setAdTitle] = useState('Your Ad Title');
  const [adDesc, setAdDesc] = useState('Your ad description here');
  const [bgColor, setBgColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(24);
  const [size, setSize] = useState('728x90');
  const [imageUrl, setImageUrl] = useState('');

  const surface = themeColors.surface || '#ffffff';
  const border = themeColors.border || '#e2e8f0';
  const textPrimary = themeColors.text?.primary || '#0f172a';

  const sizes = [
    { value: '728x90', label: 'Leaderboard (728×90)', w: 728, h: 90 },
    { value: '300x600', label: 'Half Page (300×600)', w: 300, h: 600 },
    { value: '300x250', label: 'Medium Rectangle (300×250)', w: 300, h: 250 },
    { value: '320x100', label: 'Mobile Banner (320×100)', w: 320, h: 100 },
    { value: '970x250', label: 'Billboard (970×250)', w: 970, h: 250 },
  ];

  const currentSize = sizes.find(s => s.value === size) || sizes[0];

  const handleSave = () => {
    onSave({
      title: adTitle,
      description: adDesc,
      bgColor,
      textColor,
      fontSize,
      size,
      imageUrl,
      ad_type: 'client',
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', fontFamily: themeColors.fontFamily }}>
      {/* Controls */}
      <div style={{ padding: '20px', background: surface, borderRadius: '12px', border: '1px solid ' + border }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette size={18} /> Ad Builder
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: textPrimary }}>Ad Title</label>
            <input value={adTitle} onChange={e => setAdTitle(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid ' + border, marginTop: '4px' }} />
          </div>
          
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: textPrimary }}>Description</label>
            <input value={adDesc} onChange={e => setAdDesc(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid ' + border, marginTop: '4px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: textPrimary }}>Background</label>
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid ' + border, marginTop: '4px', cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: textPrimary }}>Text Color</label>
              <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
                style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid ' + border, marginTop: '4px', cursor: 'pointer' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: textPrimary }}>Font Size: {fontSize}px</label>
            <input type="range" min="12" max="48" value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
              style={{ width: '100%', marginTop: '4px' }} />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: textPrimary }}>Banner Size</label>
            <select value={size} onChange={e => setSize(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid ' + border, marginTop: '4px' }}>
              {sizes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <button onClick={handleSave}
            style={{ padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}>
            ✅ Use This Design
          </button>
        </div>
      </div>

      {/* Preview */}
      <div style={{ padding: '20px', background: surface, borderRadius: '12px', border: '1px solid ' + border }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Eye size={18} /> Live Preview
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <div style={{
            width: Math.min(currentSize.w, 400) + 'px',
            height: Math.min(currentSize.h, 200) + 'px',
            background: imageUrl ? 'url(' + imageUrl + ') center/cover' : bgColor,
            borderRadius: '8px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: textColor, textAlign: 'center', padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.3s',
            position: 'relative', overflow: 'hidden'
          }}>
            {imageUrl && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: fontSize + 'px', fontWeight: 700, marginBottom: '4px' }}>{adTitle}</div>
              <div style={{ fontSize: Math.max(12, fontSize * 0.5) + 'px', opacity: 0.9 }}>{adDesc}</div>
            </div>
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: themeColors.text?.secondary, marginTop: '12px' }}>
          Preview — Actual size: {currentSize.w}×{currentSize.h}
        </p>
      </div>
    </div>
  );
}
