'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Globe, MapPin, Target, Search, Crosshair, X, Plus, Map, Check } from 'lucide-react';

interface GeoSelectorProps {
  value: {
    type: 'all' | 'country' | 'city' | 'state' | 'radius' | 'street' | 'coordinates';
    countries: string[];
    cities: string[];
    states: string[];
    radius: number;
    lat: number;
    lng: number;
    street: string;
    address: string;
  };
  onChange: (value: any) => void;
  label?: string;
}

const COUNTRIES = [
  { code: 'PK', name: '🇵🇰 Pakistan' },
  { code: 'US', name: '🇺🇸 United States' },
  { code: 'UK', name: '🇬🇧 United Kingdom' },
  { code: 'CA', name: '🇨🇦 Canada' },
  { code: 'AE', name: '🇦🇪 UAE' },
  { code: 'SA', name: '🇸🇦 Saudi Arabia' },
  { code: 'IN', name: '🇮🇳 India' },
  { code: 'AU', name: '🇦🇺 Australia' },
  { code: 'DE', name: '🇩🇪 Germany' },
  { code: 'FR', name: '🇫🇷 France' },
  { code: 'TR', name: '🇹🇷 Turkey' },
  { code: 'EG', name: '🇪🇬 Egypt' },
  { code: 'MY', name: '🇲🇾 Malaysia' },
  { code: 'SG', name: '🇸🇬 Singapore' },
];

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Hyderabad'];
const STATES = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad', 'Gilgit-Baltistan', 'Azad Kashmir'];

export default function GeoSelectorProfessional({ value, onChange, label = '📍 Target Location' }: GeoSelectorProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [isDetecting, setIsDetecting] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';

  const inputStyle = {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid ' + border,
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    color: textPrimary,
    fontSize: '13px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: textSecondary,
    marginBottom: '5px',
  };

  const chipStyle = (isSelected: boolean) => ({
    padding: '4px 12px',
    borderRadius: '20px',
    border: isSelected ? '2px solid ' + primary : '1px solid ' + border,
    background: isSelected ? primary + '15' : 'transparent',
    color: isSelected ? primary : textSecondary,
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: isSelected ? 600 : 400,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s',
  });

  const detectLocation = async () => {
    setIsDetecting(true);
    try {
      const res = await fetch('/api/geo');
      const data = await res.json();
      if (data.success && data.location) {
        const loc = data.location;
        onChange({
          ...value,
          lat: loc.latitude,
          lng: loc.longitude,
          address: `${loc.city}, ${loc.region}, ${loc.country}`,
          type: value.type === 'all' ? 'radius' : value.type,
        });
        setShowMap(true);
      }
    } catch (err) {
      console.error('Location detection failed:', err);
    }
    setIsDetecting(false);
  };

  const toggleSelection = (type: 'countries' | 'cities' | 'states', item: string) => {
    const current = value[type] || [];
    const newList = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
    onChange({ ...value, [type]: newList });
  };

  const geoTypes = [
    { id: 'all', label: '🌍 Everywhere', icon: Globe },
    { id: 'country', label: '🏛️ Countries', icon: MapPin },
    { id: 'city', label: '🏙️ Cities', icon: Target },
    { id: 'state', label: '🗺️ States', icon: Map },
    { id: 'radius', label: '📡 Radius', icon: Crosshair },
    { id: 'coordinates', label: '📍 Coordinates', icon: Crosshair },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label style={labelStyle}>{label}</label>

      {/* Type Selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {geoTypes.map((gt) => {
          const isActive = value.type === gt.id;
          return (
            <button
              key={gt.id}
              onClick={() => onChange({ ...value, type: gt.id as any })}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: isActive ? '2px solid ' + primary : '1px solid ' + border,
                background: isActive ? primary + '15' : 'transparent',
                color: isActive ? primary : textSecondary,
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <gt.icon size={14} />
              {gt.label}
            </button>
          );
        })}
      </div>

      {value.type !== 'all' && (
        <div style={{ marginTop: '4px' }}>
          
          {/* Countries - Multi-select chips */}
          {value.type === 'country' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => toggleSelection('countries', c.code)}
                  style={chipStyle(value.countries.includes(c.code))}
                >
                  {value.countries.includes(c.code) && <Check size={12} />}
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {/* Cities - Multi-select chips */}
          {value.type === 'city' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleSelection('cities', c)}
                  style={chipStyle(value.cities.includes(c))}
                >
                  {value.cities.includes(c) && <Check size={12} />}
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* States - Multi-select chips */}
          {value.type === 'state' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {STATES.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSelection('states', s)}
                  style={chipStyle(value.states.includes(s))}
                >
                  {value.states.includes(s) && <Check size={12} />}
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Radius */}
          {value.type === 'radius' && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="number"
                placeholder="Radius (km)"
                value={value.radius || ''}
                onChange={(e) => onChange({ ...value, radius: parseInt(e.target.value) || 0 })}
                style={{ ...inputStyle, flex: 1, minWidth: '120px' }}
              />
              <button
                onClick={detectLocation}
                disabled={isDetecting}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: primary,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Crosshair size={16} />
                {isDetecting ? '...' : '📍 Detect'}
              </button>
            </div>
          )}

          {/* Street */}
          {value.type === 'street' && (
            <input
              type="text"
              placeholder="Street name (e.g. Mall Road, Lahore)"
              value={value.street || ''}
              onChange={(e) => onChange({ ...value, street: e.target.value })}
              style={inputStyle}
            />
          )}

          {/* Coordinates */}
          {value.type === 'coordinates' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input
                type="number"
                step="0.0001"
                placeholder="Latitude"
                value={value.lat || ''}
                onChange={(e) => onChange({ ...value, lat: parseFloat(e.target.value) || 0 })}
                style={inputStyle}
              />
              <input
                type="number"
                step="0.0001"
                placeholder="Longitude"
                value={value.lng || ''}
                onChange={(e) => onChange({ ...value, lng: parseFloat(e.target.value) || 0 })}
                style={inputStyle}
              />
              <button
                onClick={detectLocation}
                disabled={isDetecting}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: primary,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  gridColumn: '1 / -1',
                  justifyContent: 'center',
                }}
              >
                <Crosshair size={16} />
                {isDetecting ? 'Detecting...' : '📍 Use Current Location'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Selected summary */}
      {value.type !== 'all' && (
        <div style={{ fontSize: '11px', color: textSecondary, marginTop: '4px' }}>
          {value.type === 'country' && value.countries.length > 0 && `Selected: ${value.countries.length} countries`}
          {value.type === 'city' && value.cities.length > 0 && `Selected: ${value.cities.length} cities`}
          {value.type === 'state' && value.states.length > 0 && `Selected: ${value.states.length} states`}
          {value.type === 'radius' && value.radius > 0 && `Radius: ${value.radius} km`}
          {value.type === 'street' && value.street && `Street: ${value.street}`}
          {value.type === 'coordinates' && value.lat && value.lng && `📍 ${value.lat}, ${value.lng}`}
        </div>
      )}
    </div>
  );
}
