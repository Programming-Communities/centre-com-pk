'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Globe, MapPin, Target, Search, Crosshair, X, Plus, Map } from 'lucide-react';

interface GeoSelectorProps {
  value: {
    type: 'all' | 'country' | 'city' | 'state' | 'radius' | 'street' | 'coordinates';
    country?: string;
    city?: string;
    state?: string;
    radius?: number;
    lat?: number;
    lng?: number;
    street?: string;
    address?: string;
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
];

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];
const STATES = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad', 'Gilgit-Baltistan', 'Azad Kashmir'];

export default function GeoSelector({ value, onChange, label = '📍 Target Location' }: GeoSelectorProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';
  const isRTL = false;

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
    transition: 'all 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: textSecondary,
    marginBottom: '5px',
  };

  const detectLocation = async () => {
    setIsDetecting(true);
    try {
      const res = await fetch('/api/geo');
      const data = await res.json();
      if (data.success && data.location) {
        const loc = data.location;
        const locationData = {
          lat: loc.latitude,
          lng: loc.longitude,
          address: `${loc.city}, ${loc.region}, ${loc.country}`,
        };
        setUserLocation(locationData);
        onChange({
          ...value,
          lat: loc.latitude,
          lng: loc.longitude,
          city: loc.city,
          country: loc.countryCode,
          address: locationData.address,
          type: value.type === 'all' ? 'radius' : value.type,
        });
        setShowMap(true);
      }
    } catch (err) {
      console.error('Location detection failed:', err);
    }
    setIsDetecting(false);
  };

  const geoTypes = [
    { id: 'all', label: '🌍 Everywhere', icon: Globe },
    { id: 'country', label: '🏛️ Country', icon: MapPin },
    { id: 'city', label: '🏙️ City', icon: Target },
    { id: 'state', label: '🗺️ State/Region', icon: Map },
    { id: 'radius', label: '📡 Radius (km)', icon: Target },
    { id: 'street', label: '🏠 Street', icon: MapPin },
    { id: 'coordinates', label: '📍 Coordinates', icon: Crosshair },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label style={labelStyle}>{label}</label>

      {/* Type Selector Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {geoTypes.map((gt) => {
          const Icon = gt.icon;
          const isActive = value.type === gt.id;
          return (
            <button
              key={gt.id}
              onClick={() => onChange({ ...value, type: gt.id as any })}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: isActive ? '2px solid ' + primary : '1px solid ' + border,
                background: isActive ? primary + '15' : 'transparent',
                color: isActive ? primary : textSecondary,
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: isActive ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={14} />
              {gt.label}
            </button>
          );
        })}
      </div>

      {/* Location Inputs */}
      {value.type !== 'all' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', marginTop: '4px' }}>
          {value.type === 'country' && (
            <select
              value={value.country || ''}
              onChange={(e) => onChange({ ...value, country: e.target.value })}
              style={{ ...inputStyle, gridColumn: '1 / -1' }}
            >
              <option value="">Select Country</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          )}

          {value.type === 'city' && (
            <>
              <select
                value={value.city || ''}
                onChange={(e) => onChange({ ...value, city: e.target.value })}
                style={inputStyle}
              >
                <option value="">Select City</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={value.country || ''}
                onChange={(e) => onChange({ ...value, country: e.target.value })}
                style={inputStyle}
              >
                <option value="">Country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </>
          )}

          {value.type === 'state' && (
            <>
              <select
                value={value.state || ''}
                onChange={(e) => onChange({ ...value, state: e.target.value })}
                style={inputStyle}
              >
                <option value="">Select State</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={value.country || ''}
                onChange={(e) => onChange({ ...value, country: e.target.value })}
                style={inputStyle}
              >
                <option value="">Country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </>
          )}

          {value.type === 'radius' && (
            <>
              <div style={{ display: 'flex', gap: '8px', gridColumn: '1 / -1' }}>
                <input
                  type="number"
                  placeholder="Radius (km)"
                  value={value.radius || ''}
                  onChange={(e) => onChange({ ...value, radius: parseInt(e.target.value) || 0 })}
                  style={{ ...inputStyle, flex: 1 }}
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
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Crosshair size={16} />
                  {isDetecting ? '...' : '📍 Detect'}
                </button>
              </div>
              <input
                type="text"
                placeholder="Address / City (e.g. Lahore, Punjab)"
                value={value.address || ''}
                onChange={(e) => onChange({ ...value, address: e.target.value })}
                style={{ ...inputStyle, gridColumn: '1 / -1' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', gridColumn: '1 / -1' }}>
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
              </div>
            </>
          )}

          {value.type === 'street' && (
            <input
              type="text"
              placeholder="Street name (e.g. Mall Road, Lahore)"
              value={value.street || ''}
              onChange={(e) => onChange({ ...value, street: e.target.value })}
              style={{ ...inputStyle, gridColumn: '1 / -1' }}
            />
          )}

          {value.type === 'coordinates' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', gridColumn: '1 / -1' }}>
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

      {/* Map Preview */}
      {(value.type === 'radius' || value.type === 'coordinates') && (value.lat && value.lng) && (
        <div style={{ marginTop: '8px' }}>
          <div
            ref={mapRef}
            style={{
              width: '100%',
              height: '200px',
              borderRadius: '12px',
              border: '1px solid ' + border,
              background: isDarkMode ? '#1e293b' : '#e2e8f0',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Simple map placeholder with OpenStreetMap iframe */}
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${(value.lng || 74.3587) - 0.05},${(value.lat || 31.5204) - 0.05},${(value.lng || 74.3587) + 0.05},${(value.lat || 31.5204) + 0.05}&layer=mapnik&marker=${value.lat || 31.5204},${value.lng || 74.3587}`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Location Map"
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '24px',
                height: '24px',
                background: primary,
                borderRadius: '50%',
                border: '3px solid #fff',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            />
            {value.type === 'radius' && value.radius && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: Math.min(value.radius * 2, 300) + 'px',
                  height: Math.min(value.radius * 2, 300) + 'px',
                  borderRadius: '50%',
                  border: '2px dashed ' + primary + '60',
                  pointerEvents: 'none',
                  zIndex: 5,
                }}
              />
            )}
          </div>
          <div style={{ fontSize: '11px', color: textSecondary, marginTop: '4px', textAlign: 'center' }}>
            📍 {value.lat?.toFixed(4)}, {value.lng?.toFixed(4)}
            {value.type === 'radius' && value.radius && ` • Radius: ${value.radius} km`}
          </div>
        </div>
      )}

      {userLocation && value.type === 'all' && (
        <div style={{ fontSize: '11px', color: textSecondary, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Crosshair size={14} color={primary} />
          Detected: {userLocation.address}
        </div>
      )}
    </div>
  );
}
