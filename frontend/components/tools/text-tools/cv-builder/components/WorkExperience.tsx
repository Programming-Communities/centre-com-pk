'use client';
import { useContext } from 'react';
import { CVContext } from '../tool.client';
import { Briefcase, Plus, Trash2, GripVertical, Sparkles } from 'lucide-react';
import { useTheme } from '@/components/theme';

export default function WorkExperience() {
  const { state, dispatch } = useContext(CVContext);
  const { themeColors } = useTheme();

  const addEntry = () => {
    dispatch({
      type: 'ADD_ITEM',
      section: 'experience',
      payload: { company: '', position: '', startDate: '', endDate: '', description: '', achievements: [''] },
    });
  };

  const updateEntry = (index: number, field: string, value: any) => {
    dispatch({ type: 'UPDATE_ITEM', section: 'experience', index, payload: { [field]: value } });
  };

  const removeEntry = (index: number) => {
    dispatch({ type: 'REMOVE_ITEM', section: 'experience', index });
  };

  return (
    <div className="space-y-4 p-4 rounded-xl border" style={{ backgroundColor: themeColors.surface, borderColor: themeColors.border }}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: themeColors.text.primary }}>
          <Briefcase className="w-5 h-5" style={{ color: themeColors.primary }} />Work Experience
        </h3>
        <button onClick={addEntry} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: themeColors.primary }}>
          <Plus className="w-3.5 h-3.5" /> Add Experience
        </button>
      </div>
      {state.experience.length === 0 && (
        <p className="text-sm text-center py-6" style={{ color: themeColors.text.secondary }}>No work experience added yet. Click "Add Experience" to begin.</p>
      )}
      {state.experience.map((exp: any, i: number) => (
        <div key={i} className="p-4 rounded-lg border" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium" style={{ color: themeColors.primary }}>Experience #{i + 1}</span>
            <div className="flex gap-1">
              <button onClick={() => {}} className="p-1 rounded hover:bg-black/5"><Sparkles className="w-3.5 h-3.5" /></button>
              <button onClick={() => removeEntry(i)} className="p-1 rounded hover:bg-black/5"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { field: 'company', label: 'Company', placeholder: 'Company Name' },
              { field: 'position', label: 'Position', placeholder: 'Job Title' },
              { field: 'startDate', label: 'Start Date', placeholder: 'YYYY-MM' },
              { field: 'endDate', label: 'End Date', placeholder: 'YYYY-MM or Present' },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>{label}</label>
                <input type="text" value={exp[field] || ''} onChange={(e) => updateEntry(i, field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <label className="block text-xs font-medium mb-1" style={{ color: themeColors.text.secondary }}>Description</label>
            <textarea value={exp.description || ''} onChange={(e) => updateEntry(i, 'description', e.target.value)}
              placeholder="Describe your responsibilities and achievements..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ borderColor: themeColors.border, backgroundColor: themeColors.background, color: themeColors.text.primary }} />
          </div>
        </div>
      ))}
    </div>
  );
}
