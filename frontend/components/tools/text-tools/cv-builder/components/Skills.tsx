'use client';
import { useContext, useState } from 'react';
import { CVContext } from '../tool.client';
import { Code, Plus, X } from 'lucide-react';
import { useTheme } from '@/components/theme';

const SKILL_CATEGORIES = ['Technical', 'Soft Skills', 'Languages', 'Tools & Software', 'Other'];

export default function Skills() {
  const { state, dispatch } = useContext(CVContext);
  const { themeColors } = useTheme();
  const [newSkill, setNewSkill] = useState('');
  const [category, setCategory] = useState('Technical');

  const addSkill = () => {
    if (!newSkill.trim()) return;
    dispatch({ type: 'ADD_ITEM', section: 'skills', payload: { name: newSkill.trim(), category } });
    setNewSkill('');
  };

  const removeSkill = (index: number) => {
    dispatch({ type: 'REMOVE_ITEM', section: 'skills', index });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  };

  return (
    <div className="space-y-4 p-4 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
      <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
        <Code className="w-5 h-5" style={{ color: themeColors.primary }} />Skills
      </h3>
      
      <div className="flex gap-2">
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }}>
          {SKILL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter..." className="flex-1 px-3 py-2 rounded-lg border text-sm"
          style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
        <button onClick={addSkill} className="px-3 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: themeColors.primary }}>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {state.skills.length === 0 && (
        <p className="text-sm text-center py-4" style={{ color: themeColors.text.secondary }}>No skills added. Start typing above!</p>
      )}

      {state.skills.length > 0 && (
        <div className="space-y-3">
          {SKILL_CATEGORIES.filter(cat => state.skills.some((s: any) => s.category === cat)).map(cat => (
            <div key={cat}>
              <h4 className="text-xs font-semibold mb-1.5" style={{ color: themeColors.text.secondary }}>{cat}</h4>
              <div className="flex flex-wrap gap-1.5">
                {state.skills.filter((s: any) => s.category === cat).map((skill: any, i: number) => {
                  const globalIndex = state.skills.indexOf(skill);
                  return (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${themeColors.primary}15`, color: themeColors.primary, border: `1px solid ${themeColors.primary}30` }}>
                      {skill.name}
                      <button onClick={() => removeSkill(globalIndex)} className="hover:bg-black/10 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
