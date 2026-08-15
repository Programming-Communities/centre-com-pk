'use client';
import { useState, useRef, useContext } from 'react';
import { CVContext } from '../tool.client';
import { Upload, X, Download, RefreshCw, Sliders } from 'lucide-react';
import { useTheme } from '@/components/theme';

export default function PhotoUpload() {
  const { state, dispatch } = useContext(CVContext);
  const { themeColors } = useTheme();
  const [photo, setPhoto] = useState<string | null>(state.personalInfo.photo || null);
  const [filter, setFilter] = useState('original');
  const [quality, setQuality] = useState(80);
  const fileRef = useRef<HTMLInputElement>(null);

  const filters = ['original', 'grayscale', 'sepia', 'warm', 'cool'];

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setPhoto(base64);
      dispatch({ type: 'SET_NESTED', section: 'personalInfo', field: 'photo', value: base64 });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto(null);
    dispatch({ type: 'SET_NESTED', section: 'personalInfo', field: 'photo', value: null });
  };

  const getFilterStyle = () => {
    switch (filter) {
      case 'grayscale': return { filter: 'grayscale(100%)' };
      case 'sepia': return { filter: 'sepia(100%)' };
      case 'warm': return { filter: 'sepia(30%) saturate(120%)' };
      case 'cool': return { filter: 'hue-rotate(180deg) saturate(80%)' };
      default: return {};
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium mb-2" style={{ color: themeColors.text.secondary }}>
        📸 Profile Photo (Passport Size)
      </label>
      {photo ? (
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2" style={{ borderColor: themeColors.primary }}>
            <img src={photo} alt="Profile" className="w-full h-full object-cover" style={getFilterStyle()} />
          </div>
          <div className="space-y-2">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              className="block w-full px-2 py-1 text-xs rounded border" style={{ borderColor: themeColors.border }}>
              {filters.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
            </select>
            <button onClick={removePhoto} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
              <X className="w-3 h-3" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="w-20 h-20 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
          style={{ borderColor: themeColors.border }}
        >
          <Upload className="w-5 h-5" style={{ color: themeColors.text.secondary }} />
          <span className="text-[9px] mt-1" style={{ color: themeColors.text.secondary }}>Upload</span>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
}
