'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { 
  Search, X, MapPin, Crosshair, Target, Check, 
  Plus, Trash2, Globe, Loader2, ZoomIn, ZoomOut,
  Navigation, AlertCircle
} from 'lucide-react';

interface LocationPickerProps {
  value: {
    locations: Array<{
      id: string;
      lat: number;
      lng: number;
      address: string;
      radius: number; // in meters
    }>;
    type: 'all' | 'specific' | 'radius';
  };
  onChange: (value: any) => void;
  label?: string;
}

export default function LocationPicker({ value, onChange, label = '📍 Target Locations' }: LocationPickerProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: 31.5204, lng: 74.3587 });
  const [mapZoom, setMapZoom] = useState(13);
  const searchRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const border = themeColors.border || '#e2e8f0';
  const surface = themeColors.surface || '#ffffff';
  const primary = themeColors.primary || '#3b82f6';
  const errorColor = '#ef4444';

  // Search locations
  const searchLocation = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/location/search?q=${encodeURIComponent(query)}&limit=10`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    }
    setIsSearching(false);
  }, []);

  // Reverse geocode (click on map)
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/location/reverse?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (data.success && data.location) {
        const loc = data.location;
        addLocation({
          lat: loc.lat,
          lng: loc.lng,
          address: loc.display_name || `${loc.lat}, ${loc.lng}`,
          radius: 0,
        });
      } else {
        addLocation({
          lat,
          lng,
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          radius: 0,
        });
      }
    } catch (err) {
      addLocation({
        lat,
        lng,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        radius: 0,
      });
    }
  }, []);

  // Detect current location
  const detectLocation = useCallback(async () => {
    setIsDetecting(true);
    try {
      const res = await fetch('/api/geo');
      const data = await res.json();
      if (data.success && data.location) {
        const loc = data.location;
        setMapCoords({ lat: loc.latitude, lng: loc.longitude });
        setMapZoom(15);
        
        // Reverse geocode to get address
        const geoRes = await fetch(`/api/location/reverse?lat=${loc.latitude}&lng=${loc.longitude}`);
        const geoData = await geoRes.json();
        
        const address = geoData.success ? geoData.location.display_name : 
          `${loc.city}, ${loc.region}, ${loc.country}`;

        addLocation({
          lat: loc.latitude,
          lng: loc.longitude,
          address: address || 'Current Location',
          radius: 0,
        });
      }
    } catch (err) {
      console.error('Location detection failed:', err);
    }
    setIsDetecting(false);
  }, []);

  // Add location
  const addLocation = (location: { lat: number; lng: number; address: string; radius?: number }) => {
    const newLocation = {
      id: `${location.lat}-${location.lng}-${Date.now()}`,
      lat: location.lat,
      lng: location.lng,
      address: location.address || `${location.lat}, ${location.lng}`,
      radius: location.radius || 0,
    };

    // Check if already exists
    const exists = value.locations.some(
      l => Math.abs(l.lat - newLocation.lat) < 0.0001 && Math.abs(l.lng - newLocation.lng) < 0.0001
    );
    
    if (!exists) {
      onChange({
        ...value,
        locations: [...value.locations, newLocation],
        type: 'specific',
      });
    }
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Remove location
  const removeLocation = (id: string) => {
    onChange({
      ...value,
      locations: value.locations.filter(l => l.id !== id),
    });
  };

  // Update radius
  const updateRadius = (id: string, radius: number) => {
    onChange({
      ...value,
      locations: value.locations.map(l => l.id === id ? { ...l, radius } : l),
    });
  };

  // Update location type
  const updateType = (type: 'all' | 'specific' | 'radius') => {
    onChange({ ...value, type });
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // In production, get click coordinates from map
    // For now, just use center of map
    reverseGeocode(mapCoords.lat, mapCoords.lng);
  };

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <label style={labelStyle}>{label}</label>

      {/* Type Selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {[
          { id: 'all', label: '🌍 Everywhere', icon: Globe },
          { id: 'specific', label: '📍 Specific Locations', icon: MapPin },
          { id: 'radius', label: '📡 Radius (0m = exact)', icon: Target },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => updateType(t.id as any)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: value.type === t.id ? '2px solid ' + primary : '1px solid ' + border,
              background: value.type === t.id ? primary + '15' : 'transparent',
              color: value.type === t.id ? primary : textSecondary,
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: value.type === t.id ? 600 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {(value.type === 'specific' || value.type === 'radius') && (
        <>
          {/* Search Bar */}
          <div style={{ position: 'relative' }} ref={searchRef}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
                <input
                  type="text"
                  placeholder="Search city, street, landmark..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchLocation(e.target.value);
                  }}
                  onFocus={() => setShowSearch(true)}
                  style={{
                    ...inputStyle,
                    paddingLeft: '36px',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: textSecondary }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
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
                  opacity: isDetecting ? 0.7 : 1,
                }}
              >
                {isDetecting ? <Loader2 size={16} className="animate-spin" /> : <Crosshair size={16} />}
                {isDetecting ? 'Detecting...' : '📍 Current'}
              </button>
            </div>

            {/* Search Results */}
            {showSearch && searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: surface,
                border: '1px solid ' + border,
                borderRadius: '10px',
                marginTop: '4px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 100,
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              }}>
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => addLocation({ lat: result.lat, lng: result.lng, address: result.display_name })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: 'none',
                      borderBottom: '1px solid ' + border,
                      background: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: textPrimary,
                      fontSize: '12px',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = primary + '10'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <MapPin size={16} color={primary} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{result.display_name}</div>
                      <div style={{ fontSize: '10px', color: textSecondary }}>
                        {result.type} • {result.lat.toFixed(4)}, {result.lng.toFixed(4)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div style={{
            width: '100%',
            height: '250px',
            borderRadius: '12px',
            border: '1px solid ' + border,
            overflow: 'hidden',
            position: 'relative',
            background: isDarkMode ? '#1e293b' : '#e2e8f0',
            cursor: 'pointer',
          }} onClick={handleMapClick}>
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${(mapCoords.lng || 74.3587) - 0.02 / mapZoom * 10},${(mapCoords.lat || 31.5204) - 0.02 / mapZoom * 10},${(mapCoords.lng || 74.3587) + 0.02 / mapZoom * 10},${(mapCoords.lat || 31.5204) + 0.02 / mapZoom * 10}&layer=mapnik`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Location Map"
            />
            
            {/* Click to add marker overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                background: primary,
                borderRadius: '50%',
                border: '3px solid #fff',
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px',
              }}>
                <MapPin size={18} />
              </div>
            </div>

            {/* Map controls */}
            <div style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <button
                onClick={() => setMapZoom(Math.min(mapZoom + 1, 18))}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid ' + border,
                  background: surface,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: textPrimary,
                }}
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => setMapZoom(Math.max(mapZoom - 1, 10))}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid ' + border,
                  background: surface,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: textPrimary,
                }}
              >
                <ZoomOut size={16} />
              </button>
            </div>

            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '4px 12px',
              borderRadius: '6px',
              background: 'rgba(0,0,0,0.7)',
              color: '#fff',
              fontSize: '10px',
            }}>
              Click map to add location
            </div>
          </div>

          {/* Selected Locations */}
          {value.locations.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: textSecondary }}>
                Selected Locations ({value.locations.length})
              </div>
              {value.locations.map((loc) => (
                <div
                  key={loc.id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid ' + border,
                    background: surface,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: textPrimary, truncate: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      📍 {loc.address}
                    </div>
                    <div style={{ fontSize: '10px', color: textSecondary }}>
                      {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}
                      {value.type === 'radius' && (
                        <span style={{ marginLeft: '8px' }}>
                          • Radius: <input
                            type="number"
                            value={loc.radius || 0}
                            onChange={(e) => updateRadius(loc.id, parseInt(e.target.value) || 0)}
                            style={{
                              width: '60px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid ' + border,
                              background: 'transparent',
                              color: textPrimary,
                              fontSize: '10px',
                            }}
                          /> m
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeLocation(loc.id)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #ef4444',
                      background: '#ef444410',
                      cursor: 'pointer',
                      color: '#ef4444',
                      fontSize: '11px',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Quick radius presets */}
          {value.type === 'radius' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[0, 100, 500, 1000, 2000, 5000, 10000, 50000].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    if (value.locations.length > 0) {
                      const id = value.locations[0].id;
                      updateRadius(id, r);
                    }
                  }}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    border: '1px solid ' + border,
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '10px',
                    color: textSecondary,
                  }}
                >
                  {r === 0 ? '0m (Exact)' : r >= 1000 ? `${r/1000}km` : `${r}m`}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Summary */}
      {value.type !== 'all' && (
        <div style={{
          padding: '8px 12px',
          borderRadius: '8px',
          background: primary + '10',
          fontSize: '11px',
          color: textSecondary,
        }}>
          {value.type === 'specific' && `${value.locations.length} location${value.locations.length > 1 ? 's' : ''} selected`}
          {value.type === 'radius' && value.locations.length > 0 && 
            `📍 ${value.locations[0].address} • Radius: ${value.locations[0].radius || 0}m`
          }
        </div>
      )}
    </div>
  );
}
