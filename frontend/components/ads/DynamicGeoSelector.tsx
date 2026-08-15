'use client';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/components/theme/contexts/ThemeContext';
import { Search, MapPin, Globe, X, Navigation, Building2, Home, Store, ChevronRight, Plus, Trash2, Target } from 'lucide-react';

interface Location {
  id: number;
  name: string;
  type: string;
  country: string;
  country_code: string;
  state: string;
  city: string;
  lat: string;
  lon: string;
}

interface DynamicGeoSelectorProps {
  onSelect: (locations: Location[]) => void;
  selected?: Location[];
  lang?: string;
}

export default function DynamicGeoSelector({ onSelect, selected = [], lang = 'en' }: DynamicGeoSelectorProps) {
  const { themeColors, isDarkMode } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedLocs, setSelectedLocs] = useState<Location[]>(selected);
  const [useMyLocation, setUseMyLocation] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const surface = themeColors.surface || '#ffffff';
  const border = themeColors.border || '#e2e8f0';
  const textPrimary = themeColors.text?.primary || '#0f172a';
  const textSecondary = themeColors.text?.secondary || '#64748b';
  const primary = themeColors.primary || '#3b82f6';

  const labels: Record<string, any> = {
    en: { search: 'Search any location worldwide...', myLocation: 'Use My Location', selected: 'Targeted Locations', noTarget: 'No target = Show everywhere', add: 'Add', remove: 'Remove', country: 'Country', state: 'State', city: 'City', anywhere: '🌍 Anywhere (Worldwide)' },
    ur: { search: 'دنیا میں کہیں بھی تلاش کریں...', myLocation: 'میری لوکیشن', selected: 'منتخب مقامات', noTarget: 'کوئی نہیں = ہر جگہ', add: 'شامل', remove: 'ہٹائیں', country: 'ملک', state: 'صوبہ', city: 'شہر', anywhere: '🌍 ہر جگہ' },
    hi: { search: 'दुनिया में कहीं भी खोजें...', myLocation: 'मेरी लोकेशन', selected: 'चयनित स्थान', noTarget: 'कोई नहीं = हर जगह', add: 'जोड़ें', remove: 'हटाएं', country: 'देश', state: 'राज्य', city: 'शहर', anywhere: '🌍 हर जगह' },
    ar: { search: 'ابحث في أي مكان...', myLocation: 'موقعي', selected: 'المواقع المختارة', noTarget: 'لا شيء = كل مكان', add: 'إضافة', remove: 'حذف', country: 'دولة', state: 'ولاية', city: 'مدينة', anywhere: '🌍 كل مكان' },
  };
  const l = labels[lang] || labels.en;

  // Debounced search
  const handleSearch = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (value.length < 2) { setResults([]); return; }
    
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/geo/search?q=' + encodeURIComponent(value) + '&limit=8');
        const data = await res.json();
        setResults(data.locations || []);
      } catch {}
      setSearching(false);
    }, 400);
  };

  // Get user's location
  const handleMyLocation = () => {
    if (!navigator.geolocation) return;
    setUseMyLocation(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const res = await fetch('/api/geo/reverse?lat=' + latitude + '&lon=' + longitude);
      const data = await res.json();
      if (data.success && data.location) {
        const loc: Location = {
          id: Date.now(),
          name: data.location.name,
          type: 'gps',
          country: data.location.country,
          country_code: data.location.country_code,
          state: data.location.state,
          city: data.location.city,
          lat: String(latitude),
          lon: String(longitude),
        };
        addLocation(loc);
      }
      setUseMyLocation(false);
    }, () => setUseMyLocation(false));
  };

  const addLocation = (loc: Location) => {
    if (selectedLocs.find(l => l.id === loc.id)) return;
    const updated = [...selectedLocs, loc];
    setSelectedLocs(updated);
    onSelect(updated);
    setQuery('');
    setResults([]);
  };

  const removeLocation = (id: number) => {
    const updated = selectedLocs.filter(l => l.id !== id);
    setSelectedLocs(updated);
    onSelect(updated);
  };

  const typeIcons: Record<string, any> = {
    country: Globe, state: Building2, city: Building,
    town: Home, village: Home, street: Navigation, shop: Store
  };

  return (
    <div style={{ fontFamily: themeColors.fontFamily }}>
      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
        <input
          type="text"
          placeholder={l.search}
          value={query}
          onChange={e => handleSearch(e.target.value)}
          style={{
            width: '100%', padding: '14px 14px 14px 44px', fontSize: '14px',
            borderRadius: '12px', border: '2px solid ' + (query ? primary : border),
            background: isDarkMode ? '#1e293b' : '#ffffff', color: textPrimary,
            outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s'
          }}
        />
        {searching && (
          <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: textSecondary }}>
            Searching...
          </span>
        )}
      </div>

      {/* My Location Button */}
      <button onClick={handleMyLocation} disabled={useMyLocation}
        style={{
          width: '100%', padding: '10px', marginBottom: '12px',
          background: useMyLocation ? primary + '20' : 'transparent',
          border: '1px solid ' + primary, borderRadius: '10px',
          color: primary, fontWeight: 600, cursor: 'pointer', fontSize: '13px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}>
        <Navigation size={16} /> {useMyLocation ? '📍 Getting location...' : l.myLocation}
      </button>

      {/* Selected Locations */}
      {selectedLocs.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={16} color={primary} /> {l.selected} ({selectedLocs.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {selectedLocs.map(loc => {
              const Icon = typeIcons[loc.type] || MapPin;
              return (
                <div key={loc.id} style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
                  background: primary + '08', borderRadius: '10px', border: '1px solid ' + primary + '20'
                }}>
                  <Icon size={16} color={primary} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {loc.city || loc.state || loc.name?.split(',')[0]}
                    </div>
                    <div style={{ fontSize: '10px', color: textSecondary }}>
                      {[loc.country, loc.state, loc.city].filter(Boolean).join(' › ')}
                    </div>
                  </div>
                  <button onClick={() => removeLocation(loc.id)}
                    style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', background: '#ef444415', color: '#ef4444', cursor: 'pointer', fontSize: '11px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedLocs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '16px', color: textSecondary, fontSize: '13px', background: isDarkMode ? '#1e293b' : '#f8fafc', borderRadius: '10px', marginBottom: '12px' }}>
          🌍 {l.anywhere}
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div style={{
          maxHeight: '300px', overflowY: 'auto', borderRadius: '10px',
          border: '1px solid ' + border, background: surface
        }}>
          {results.map((loc, i) => {
            const Icon = typeIcons[loc.type] || MapPin;
            return (
              <div key={i} onClick={() => addLocation(loc)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px',
                  cursor: 'pointer', borderBottom: i < results.length - 1 ? '1px solid ' + border : 'none',
                  transition: 'background 0.15s',
                  background: selectedLocs.find(l => l.id === loc.id) ? primary + '10' : 'transparent'
                }}>
                <Icon size={16} color={primary} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {loc.name?.split(',')[0]}
                  </div>
                  <div style={{ fontSize: '11px', color: textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {loc.name?.split(',').slice(1).join(',')}
                  </div>
                </div>
                <span style={{
                  padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 600,
                  background: (loc.country_code === 'pk' ? '#10b981' : '#3b82f6') + '15',
                  color: loc.country_code === 'pk' ? '#10b981' : '#3b82f6'
                }}>
                  {loc.country_code?.toUpperCase() || loc.type}
                </span>
                <Plus size={16} color={primary} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
