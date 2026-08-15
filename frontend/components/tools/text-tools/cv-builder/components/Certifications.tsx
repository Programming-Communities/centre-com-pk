'use client';
import { useContext, useState, useRef } from 'react';
import { CVContext } from '../tool.client';
import { Award, Plus, Trash2, Upload, X, Link, Calendar } from 'lucide-react';
import { useTheme } from '@/components/theme';

const CERT_CATEGORIES = [
  { value: 'professional', label: '🏆 Professional', icon: '🏆' },
  { value: 'academic', label: '📜 Academic', icon: '📜' },
  { value: 'skills', label: '🎓 Skills', icon: '🎓' },
  { value: 'language', label: '🌐 Language', icon: '🌐' },
  { value: 'award', label: '⭐ Award', icon: '⭐' },
];

export default function Certifications() {
  const { state, dispatch } = useContext(CVContext);
  const { themeColors } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', issuer: '', category: 'professional', issueDate: '', expiryDate: '', credentialId: '', url: '', image: null as string | null });
  const fileRef = useRef<HTMLInputElement>(null);

  const addCert = () => {
    if (!form.name || !form.issuer) return;
    dispatch({ type: 'ADD_ITEM', section: 'certifications', payload: { ...form } });
    setForm({ name: '', issuer: '', category: 'professional', issueDate: '', expiryDate: '', credentialId: '', url: '', image: null });
    setShowForm(false);
  };

  const removeCert = (index: number) => {
    dispatch({ type: 'REMOVE_ITEM', section: 'certifications', index });
  };

  const toggleCert = (index: number) => {
    const cert = state.certifications[index];
    dispatch({ type: 'UPDATE_ITEM', section: 'certifications', index, payload: { isActive: !cert.isActive } });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 2 * 1024 * 1024) { alert('Max 2MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setForm(prev => ({ ...prev, image: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 p-4 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
          <Award className="w-5 h-5" style={{ color: themeColors.primary }} />Certifications
        </h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: themeColors.primary }}>
          <Plus className="w-3.5 h-3.5" /> Add Certificate
        </button>
      </div>

      {showForm && (
        <div className="p-4 rounded-lg border space-y-3 animate-in fade-in" style={{ borderColor: themeColors.primary, backgroundColor: themeColors.background }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { field: 'name', label: 'Certificate Name', placeholder: 'AWS Solutions Architect' },
              { field: 'issuer', label: 'Issuing Organization', placeholder: 'Amazon Web Services' },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>{label}</label>
                <input type="text" value={(form as any)[field]} onChange={(e) => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                  placeholder={placeholder} className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>Category</label>
              <select value={form.category} onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }}>
                {CERT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>Issue Date</label>
              <input type="date" value={form.issueDate} onChange={(e) => setForm(prev => ({ ...prev, issueDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>Expiry Date</label>
              <input type="date" value={form.expiryDate} onChange={(e) => setForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>Credential ID</label>
              <input type="text" value={form.credentialId} onChange={(e) => setForm(prev => ({ ...prev, credentialId: e.target.value }))}
                placeholder="AWS-ASA-12345" className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>Verification URL</label>
              <input type="url" value={form.url} onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://credly.com/..." className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>Certificate Image</label>
            {form.image ? (
              <div className="relative inline-block">
                <img src={form.image} alt="Certificate" className="w-24 h-16 object-cover rounded-lg border" />
                <button onClick={() => setForm(prev => ({ ...prev, image: null }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1 px-3 py-2 rounded-lg border text-xs"
                style={{ borderColor: themeColors.border, color: themeColors.text.secondary }}>
                <Upload className="w-3.5 h-3.5" /> Upload Image
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
          <div className="flex gap-2">
            <button onClick={addCert} className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: themeColors.primary }}>Add Certificate</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border text-sm" style={{ borderColor: themeColors.border, color: themeColors.text.secondary }}>Cancel</button>
          </div>
        </div>
      )}

      {state.certifications.length === 0 && !showForm && (
        <p className="text-sm text-center py-6" style={{ color: themeColors.text.secondary }}>No certifications added yet.</p>
      )}

      <div className="space-y-2">
        {state.certifications.map((cert: any, i: number) => (
          <div key={i} className={`p-3 rounded-lg border ${cert.isActive === false ? 'opacity-50' : ''}`} style={{ borderColor: themeColors.border, backgroundColor: themeColors.background }}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {cert.image && <img src={cert.image} alt={cert.name} className="w-12 h-9 object-cover rounded border" />}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>{cert.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15`, color: themeColors.primary }}>
                      {CERT_CATEGORIES.find(c => c.value === cert.category)?.icon} {cert.category}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: themeColors.text.secondary }}>{cert.issuer}{cert.issueDate ? ` · ${cert.issueDate}` : ''}</p>
                  {cert.expiryDate && (
                    <p className="text-xs mt-0.5" style={{ color: new Date(cert.expiryDate) < new Date() ? '#ef4444' : '#f59e0b' }}>
                      {new Date(cert.expiryDate) < new Date() ? '⚠️ Expired: ' : '⏰ Expires: '}{cert.expiryDate}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => toggleCert(i)} className="p-1 rounded hover:bg-black/5 text-xs" title="Show/Hide">👁️</button>
                <button onClick={() => removeCert(i)} className="p-1 rounded hover:bg-black/5"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
