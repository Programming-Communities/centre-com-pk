'use client';
import { useContext } from 'react';
import { CVContext } from '../tool.client';
import { Award, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '@/components/theme';

export default function Achievements() {
  const { state, dispatch } = useContext(CVContext);
  const { themeColors } = useTheme();

  const addAchievement = () => {
    dispatch({ type: 'ADD_ITEM', section: 'achievements', payload: { title: '', description: '', date: '' } });
  };

  const updateAchievement = (index: number, field: string, value: string) => {
    dispatch({ type: 'UPDATE_ITEM', section: 'achievements', index, payload: { [field]: value } });
  };

  const removeAchievement = (index: number) => {
    dispatch({ type: 'REMOVE_ITEM', section: 'achievements', index });
  };

  return (
    <div className="space-y-4 p-4 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
          <Award className="w-5 h-5" style={{ color: themeColors.primary }} />Achievements & Awards
        </h3>
        <button onClick={addAchievement} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: themeColors.primary }}>
          <Plus className="w-3.5 h-3.5" /> Add Achievement
        </button>
      </div>

      {state.achievements.length === 0 && (
        <p className="text-sm text-center py-6" style={{ color: themeColors.text.secondary }}>No achievements added yet.</p>
      )}

      {state.achievements.map((ach: any, i: number) => (
        <div key={i} className="p-4 rounded-lg border space-y-3" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: themeColors.primary }}>Achievement #{i + 1}</span>
            <button onClick={() => removeAchievement(i)} className="p-1 rounded hover:bg-black/5"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { field: 'title', label: 'Title', placeholder: 'Employee of the Year' },
              { field: 'date', label: 'Date', placeholder: '2024' },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>{label}</label>
                <input type="text" value={ach[field] || ''} onChange={(e) => updateAchievement(i, field, e.target.value)}
                  placeholder={placeholder} className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>Description</label>
            <textarea value={ach.description || ''} onChange={(e) => updateAchievement(i, 'description', e.target.value)}
              placeholder="Describe the achievement..." rows={2}
              className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
          </div>
        </div>
      ))}
    </div>
  );
}
