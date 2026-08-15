'use client';
import { useContext, useState } from 'react';
import { CVContext } from '../tool.client';
import { Globe, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '@/components/theme';

const PROFICIENCY_LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'];

export default function Languages() {
  const { state, dispatch } = useContext(CVContext);
  const { themeColors } = useTheme();
  const [newLang, setNewLang] = useState('');
  const [proficiency, setProficiency] = useState('Fluent');

  const addLanguage = () => {
    if (!newLang.trim()) return;
    dispatch({ type: 'ADD_ITEM', section: 'languages', payload: { name: newLang.trim(), proficiency } });
    setNewLang('');
  };

  const removeLanguage = (index: number) => {
    dispatch({ type: 'REMOVE_ITEM', section: 'languages', index });
  };

  return (
    <div className="space-y-4 p-4 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
      <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
        <Globe className="w-5 h-5" style={{ color: themeColors.primary }} />Languages
      </h3>
      
      <div className="flex gap-2">
        <input type="text" value={newLang} onChange={(e) => setNewLang(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addLanguage()}
          placeholder="Language name..." className="flex-1 px-3 py-2 rounded-lg border text-sm"
          style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
        <select value={proficiency} onChange={(e) => setProficiency(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }}>
          {PROFICIENCY_LEVELS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <button onClick={addLanguage} className="px-3 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: themeColors.primary }}>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {state.languages.length === 0 && (
        <p className="text-sm text-center py-4" style={{ color: themeColors.text.secondary }}>No languages added.</p>
      )}

      <div className="space-y-2">
        {state.languages.map((lang: any, i: number) => (
          <div key={i} className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}` }}>
            <div>
              <span className="text-sm font-medium" style={{ color: themeColors.text.primary }}>{lang.name}</span>
              <span className="text-xs ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15`, color: themeColors.primary }}>{lang.proficiency}</span>
            </div>
            <button onClick={() => removeLanguage(i)} className="p-1 rounded hover:bg-black/5"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
