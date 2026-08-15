'use client';
import { useState } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Target, MapPin, Navigation, Zap } from 'lucide-react';

const RADIUS_PRESETS = [
  { label: '🏠 100m (Street)', value: 0.1, desc: 'Just this street', speed: 5 },
  { label: '🏘️ 500m (Block)', value: 0.5, desc: 'This block/colony', speed: 5 },
  { label: '🏡 1km (Village)', value: 1, desc: 'Whole village', speed: 5 },
  { label: '🏙️ 3km (Area)', value: 3, desc: 'Local area', speed: 4 },
  { label: '🌆 5km (Town)', value: 5, desc: 'Small town', speed: 4 },
  { label: '🏢 10km (Sector)', value: 10, desc: 'City sector', speed: 3 },
  { label: '🌇 25km (City)', value: 25, desc: 'Medium city', speed: 3 },
  { label: '🌃 50km (Large City)', value: 50, desc: 'Large city like Lahore', speed: 2 },
  { label: '🗺️ 100km (District)', value: 100, desc: 'Full district', speed: 2 },
  { label: '🌍 200km (Region)', value: 200, desc: 'Multiple cities', speed: 1 },
  { label: '🌏 500km (Country)', value: 500, desc: 'Country-wide', speed: 1 },
];

const BUSINESS_TYPES = [
  { type: 'local_shop', label: '🏪 Local Shop', defaultRadius: 0.5 },
  { type: 'restaurant', label: '🍽️ Restaurant', defaultRadius: 3 },
  { type: 'clinic', label: '🏥 Clinic', defaultRadius: 5 },
  { type: 'school', label: '🏫 School', defaultRadius: 8 },
  { type: 'mall', label: '🏬 Mall', defaultRadius: 15 },
  { type: 'hospital', label: '🏨 Hospital', defaultRadius: 25 },
  { type: 'university', label: '🎓 University', defaultRadius: 50 },
  { type: 'factory', label: '🏭 Factory', defaultRadius: 100 },
  { type: 'ecommerce', label: '🛒 E-Commerce', defaultRadius: 0 },
];

interface RadiusSelectorProps {
  value: number;
  onChange: (radius: number, businessType?: string) => void;
  lang?: string;
}

export default function RadiusSelector({ value = 10, onChange, lang = 'en' }: RadiusSelectorProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [selectedRadius, setSelectedRadius] = useState(value);
  const [customRadius, setCustomRadius] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [businessType, setBusinessType] = useState('');

  const surface = themeColors.surface || '#ffffff';
  const border = themeColors.border || '#e2e8f0';
  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const primary = themeColors.primary || '#3b82f6';

  const handlePreset = (preset: typeof RADIUS_PRESETS[0]) => {
    setSelectedRadius(preset.value);
    setShowCustom(false);
    onChange(preset.value, businessType);
  };

  const handleBusinessType = (type: string) => {
    setBusinessType(type);
    const bt = BUSINESS_TYPES.find(b => b.type === type);
    if (bt && bt.defaultRadius > 0) {
      setSelectedRadius(bt.defaultRadius);
      onChange(bt.defaultRadius, type);
    } else {
      onChange(0, type); // ecommerce = no radius = country-wide
    }
  };

  const handleCustom = () => {
    const val = parseFloat(customRadius);
    if (val >= 0.1 && val <= 500) {
      setSelectedRadius(val);
      onChange(val, businessType);
    }
  };

  const getSpeedIcon = (radius: number) => {
    if (radius <= 1) return '⚡⚡⚡⚡⚡';
    if (radius <= 10) return '⚡⚡⚡⚡';
    if (radius <= 50) return '⚡⚡⚡';
    if (radius <= 100) return '⚡⚡';
    return '⚡';
  };

  const getCoverageDescription = (radius: number) => {
    if (radius <= 0.1) return 'One street/gali';
    if (radius <= 0.5) return 'One block/colony';
    if (radius <= 1) return 'One village';
    if (radius <= 5) return 'Small town area';
    if (radius <= 15) return 'City sector';
    if (radius <= 50) return 'Full city';
    if (radius <= 200) return 'Multiple cities';
    return 'Country-wide';
  };

  return (
    <div style={{ fontFamily: themeColors.fontFamily }}>
      
      {/* Business Type Selector */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: textSecondary, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Target size={14} /> Business Type (Auto-Suggest Radius)
        </label>
        <select value={businessType} onChange={e => handleBusinessType(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid ' + border, background: surface, color: textPrimary, fontSize: '13px' }}>
          <option value="">Select business type...</option>
          {BUSINESS_TYPES.map(bt => (
            <option key={bt.type} value={bt.type}>{bt.label} {bt.defaultRadius > 0 ? `(${bt.defaultRadius}km default)` : '(No radius — country-wide)'}</option>
          ))}
        </select>
      </div>

      {/* Radius Presets */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: textSecondary, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Navigation size={14} /> Target Radius: <span style={{ color: primary, fontWeight: 700 }}>{selectedRadius}km</span>
          <span style={{ fontSize: '10px', color: textSecondary }}>({getCoverageDescription(selectedRadius)})</span>
          <span style={{ fontSize: '12px' }}>{getSpeedIcon(selectedRadius)}</span>
        </label>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '6px', marginBottom: '8px' }}>
          {RADIUS_PRESETS.map(preset => (
            <button key={preset.value} onClick={() => handlePreset(preset)}
              style={{
                padding: '8px 10px', borderRadius: '8px', border: '1.5px solid ' + (selectedRadius === preset.value ? primary : border),
                background: selectedRadius === preset.value ? primary + '10' : surface,
                color: selectedRadius === preset.value ? primary : textPrimary,
                cursor: 'pointer', fontSize: '11px', fontWeight: selectedRadius === preset.value ? 600 : 400,
                textAlign: 'left', transition: 'all 0.15s'
              }}>
              <div>{preset.label}</div>
              <div style={{ fontSize: '9px', color: textSecondary }}>{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Radius */}
      <div style={{ marginBottom: '12px' }}>
        <button onClick={() => setShowCustom(!showCustom)}
          style={{ fontSize: '12px', color: primary, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          {showCustom ? 'Hide Custom' : '+ Custom Radius (0.1 - 500 km)'}
        </button>
        {showCustom && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input type="number" min="0.1" max="500" step="0.1" value={customRadius}
              onChange={e => setCustomRadius(e.target.value)} placeholder="Enter km..."
              style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid ' + border, background: surface, color: textPrimary, fontSize: '13px' }} />
            <button onClick={handleCustom}
              style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: primary, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}>
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Performance Info */}
      <div style={{ padding: '10px 14px', background: isDarkMode ? '#1e293b' : '#f0fdf4', borderRadius: '8px', fontSize: '11px', color: textSecondary }}>
        <Zap size={12} style={{ display: 'inline', marginRight: '4px', color: '#10b981' }} />
        <strong>Performance:</strong> {selectedRadius <= 1 ? 'Super Fast (Micro-targeting)' : selectedRadius <= 10 ? 'Very Fast (Local business)' : selectedRadius <= 50 ? 'Fast (City level)' : selectedRadius <= 100 ? 'OK (District level)' : 'Slower (Regional — use country targeting for 500km+)'}
      </div>
    </div>
  );
}
